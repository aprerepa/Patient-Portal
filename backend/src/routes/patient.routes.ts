import { Router } from "express";
import pool from "../db";
import { authenticateToken } from "../middleware";
import { fetchFhirPatient, getPatientNameFromFhir, fetchPatientMedicalData } from "../fhirServices";

export const patientRouter = Router();

async function getFhirPatientId(userId: number): Promise<string | null> {
    const result = await pool.query(
        `SELECT fhir_patient_id FROM users WHERE id = $1`,
        [userId]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0].fhir_patient_id ?? null;
}

function decodeNoteText(doc: any): string {
    const data = doc?.content?.[0]?.attachment?.data;
    if (!data) return "";
    try {
        return Buffer.from(data, "base64").toString("utf8");
    } catch {
        return "";
    }
}

/** Pull a short blurb from Synthea clinical note markdown. */
function extractNoteBlurb(noteText: string): string | null {
    const assessment = noteText.match(
        /# Assessment and Plan\s*\n+([\s\S]*?)(?=\n##|\n# |\s*$)/i
    );
    if (assessment) {
        const line = assessment[1]
            .split("\n")
            .map((l) => l.trim())
            .find((l) => l.length > 0 && !l.startsWith("#"));
        if (line) return line;
    }

    const chief = noteText.match(
        /# Chief Complaint\s*\n+([\s\S]*?)(?=\n# |\s*$)/i
    );
    if (chief) {
        const line = chief[1]
            .split("\n")
            .map((l) => l.trim())
            .find((l) => l.length > 0);
        if (line && !/^no complaints\.?$/i.test(line)) return line;
    }

    return null;
}

function encounterReason(encounter: any): string | null {
    const reason =
        encounter?.reasonCode?.[0]?.coding?.[0]?.display ||
        encounter?.reasonCode?.[0]?.text ||
        encounter?.type?.[0]?.text ||
        encounter?.type?.[0]?.coding?.[0]?.display ||
        null;
    return reason ?? null;
}

function encounterLookupKey(reference: string | undefined): string | null {
    if (!reference) return null;
    return reference.replace(/^urn:uuid:/, "").replace(/^Encounter\//, "");
}

/** Shorten RxNorm labels: "Simvastatin 10 MG Oral Tablet" → "Simvastatin 10mg" */
function formatMedicationName(raw: string | undefined | null): string {
    if (!raw) return "Unknown medication";

    let name = raw.trim();

    const brand = name.match(/\[([^\]]+)\]/);
    if (brand) {
        return brand[1].replace(/\s+\d+\s*Day$/i, "").trim();
    }

    name = name.replace(/^\{\d+\s*\(/, "").replace(/\)\s*\}\s*.*$/i, "");
    name = name.replace(/^\d+\s+ACTUAT\s+/i, "");
    name = name.replace(
        /\s+(Oral Tablet|Oral Capsule|Chewable Tablet|Delayed Release Oral Tablet|Inhalation Solution|Dry Powder Inhaler|Injectable Solution|Auto-Injector|Transdermal System|Pack)\s*$/i,
        ""
    );
    name = name.replace(/\s*\/\s*ACTUAT/gi, "");
    name = name.replace(/\bMG\b/g, "mg").replace(/\bML\b/g, "ml");
    name = name.replace(/(\d)\s+mg\b/gi, "$1mg").replace(/(\d)\s+ml\b/gi, "$1ml");
    name = name.replace(/\s+/g, " ").trim();

    // Combo products → primary ingredient only (matches "Lisinopril 10mg" style titles)
    if (name.includes(" / ")) {
        name = name.split(" / ")[0].trim();
    }

    name = name
        .split(" ")
        .map((word) => {
            if (/^\d/.test(word) || word.includes("/") || word === "mg" || word === "ml") {
                return word;
            }
            if (word === "/") return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");

    // Drop common salt/form words: "Naproxen Sodium 220mg" → "Naproxen 220mg"
    name = name.replace(
        /\s+(Sodium|Hydrochloride|Hcl|Potassium|Calcium|Maleate|Succinate|Propionate)\b/gi,
        ""
    );

    return name || raw;
}

function medicationDisplayName(medication: any): string {
    const raw =
        medication?.medicationCodeableConcept?.text ||
        medication?.medicationCodeableConcept?.coding?.[0]?.display;
    return formatMedicationName(raw);
}

function formatConditionLabel(raw: string | undefined | null): string | null {
    if (!raw) return null;
    return raw.replace(/\s*\(disorder\)\s*$/i, "").replace(/\s*\(finding\)\s*$/i, "").trim();
}

function medicationReason(medication: any): string | null {
    const fromCode =
        medication?.reasonCode?.[0]?.coding?.[0]?.display ||
        medication?.reasonCode?.[0]?.text;
    const fromRef = medication?.reasonReference?.[0]?.display;
    return formatConditionLabel(fromCode || fromRef);
}

function medicationFrequencyBlurb(medication: any): string | null {
    const dose = medication?.dosageInstruction?.[0];
    if (!dose) return null;

    if (dose.text) {
        const text = String(dose.text).trim().replace(/\.$/, "");
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    if (dose.asNeededBoolean) return "Take as needed";

    const repeat = dose.timing?.repeat;
    if (!repeat) return null;

    const frequency = Number(repeat.frequency ?? 1);
    const period = Number(repeat.period ?? 1);
    const unit = String(repeat.periodUnit || "d");

    if (unit === "d" && period === 1 && frequency === 1) return "Take once a day";
    if (unit === "d" && period === 1 && frequency === 2) return "Take twice a day";
    if (unit === "d" && period === 1 && frequency === 3) return "Take three times a day";
    if (unit === "d" && period === 1) return `Take ${frequency} times a day`;
    if (unit === "h" && period === 1 && frequency === 1) return "Take every hour";
    if (unit === "h" && frequency === 1) return `Take every ${period} hours`;
    if (unit === "wk" && period === 1 && frequency === 1) return "Take once a week";

    return `Take ${frequency} time(s) every ${period} ${unit}`;
}

function medicationSummaryBlurb(medication: any): string {
    const frequency = medicationFrequencyBlurb(medication) || "Take as directed";
    const reason = medicationReason(medication);

    if (reason) return `${frequency} for ${reason.toLowerCase()}.`;
    return `${frequency}.`;
}

/** Stable portal-style Health ID for FHIR practitioners (until they have users rows). */
function portalPhysicianHealthId(referenceOrKey: string | undefined | null): string {
    const key = referenceOrKey || "unknown";
    const npiMatch = key.match(/us-npi\|(\d+)/i);
    const seed = npiMatch?.[1] || key;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return `PHY-${1000 + (hash % 9000)}`;
}

function encounterPhysician(encounter: any): {
    name: string;
    healthId: string;
} {
    const practitioner = (encounter?.participant ?? []).find(
        (p: any) =>
            p.individual?.reference?.includes("Practitioner") ||
            p.individual?.display
    );
    const name = practitioner?.individual?.display || "Unknown physician";
    const healthId = portalPhysicianHealthId(
        practitioner?.individual?.reference || name
    );
    return { name, healthId };
}

patientRouter.get("/profile", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;

        const result = await pool.query(
            `SELECT id, health_id, role, email, created_at, fhir_patient_id
             FROM users
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Patient not found" });
        }

        const user = result.rows[0];
        let firstName: string | null = null;
        let lastName: string | null = null;

        if (user.fhir_patient_id) {
            try {
                const fhirPatient = await fetchFhirPatient(user.fhir_patient_id);
                ({ firstName, lastName } = getPatientNameFromFhir(fhirPatient));
            } catch (error) {
                console.error("Failed to load FHIR patient name:", error);
            }
        }

        res.json({
            user: {
                ...user,
                first_name: firstName,
                last_name: lastName,
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

patientRouter.get("/vitals", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const fhirPatientId = await getFhirPatientId(userId);
        if (!fhirPatientId) {
            return res.status(404).json({ error: "Patient not found" });
        }
        const bundle = await fetchPatientMedicalData(
            "Observation",
            fhirPatientId,
            "&category=vital-signs"
        );

        const byTime = new Map<string, {
            date: string;
            month: string;
            heartRate?: number;
            systolicBP?: number;
        }>();

        for (const vital of bundle.entry ?? []) {
            const observation = vital.resource;
            const date = observation.effectiveDateTime;
            if (!date) continue;
            const code = observation.code?.coding?.[0]?.code;
            if (!byTime.has(date)) {
                const dateObj = new Date(date);
                byTime.set(date, {
                    date: date,
                    month: dateObj.toLocaleString("en-US", {
                        month: "short",
                        year: "numeric",
                    }),
                });
            }
            const vitalData = byTime.get(date);
            if (!vitalData) continue;
            if (code === "8867-4" && observation.valueQuantity?.value != null) {
                vitalData.heartRate = observation.valueQuantity.value;
            }
            if (code === "85354-9" && observation.component) {
                for (const part of observation.component) {
                    const partCode = part.code?.coding?.[0]?.code;
                    if (partCode === "8480-6" && part.valueQuantity?.value != null) {
                        vitalData.systolicBP = part.valueQuantity.value;
                    }
                }
            }
        }

        const vitals = Array.from(byTime.values())
            .filter((p) => p.heartRate != null || p.systolicBP != null)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        res.json({ vitals });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch vitals" });
    }
});

patientRouter.get("/medications", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const fhirPatientId = await getFhirPatientId(userId);
        if (!fhirPatientId) {
            return res.status(404).json({ error: "Patient not found" });
        }
        const bundle = await fetchPatientMedicalData("MedicationRequest", fhirPatientId);
        const medications = (bundle.entry ?? []).map((entry) => {
            const medication = entry.resource;
            const name = medicationDisplayName(medication);
            return {
                id: medication.id,
                name,
                dosage: medicationFrequencyBlurb(medication) ?? "",
                frequency: medicationFrequencyBlurb(medication) ?? "",
                reason: medicationReason(medication),
                prescriber: medication.requester?.display ?? "-",
                startDate: medication.authoredOn ?? null,
                endDate: null,
                isActive: medication.status === "active",
                summary: medicationSummaryBlurb(medication),
            };
        });
        res.json({ medications });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch medications" });
    }
});

patientRouter.get("/records", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const fhirPatientId = await getFhirPatientId(userId);
        if (!fhirPatientId) {
            return res.status(404).json({ error: "Patient not found" });
        }

        const [reportBundle, noteBundle, medBundle, encounterBundle] =
            await Promise.all([
                fetchPatientMedicalData("DiagnosticReport", fhirPatientId),
                fetchPatientMedicalData("DocumentReference", fhirPatientId),
                fetchPatientMedicalData("MedicationRequest", fhirPatientId),
                fetchPatientMedicalData("Encounter", fhirPatientId),
            ]);

        const encountersById = new Map<string, any>();
        for (const entry of encounterBundle.entry ?? []) {
            const encounter = entry.resource;
            if (encounter?.id) {
                encountersById.set(encounter.id, encounter);
            }
        }

        const labs = (reportBundle.entry ?? []).map((entry) => {
            const report = entry.resource;
            const title =
                report.code?.text ||
                report.code?.coding?.[0]?.display ||
                "Lab report";
            const facility = report.performer?.[0]?.display ?? "—";
            return {
                id: report.id,
                record_type: "lab",
                title,
                provider: facility,
                facility: "",
                record_date: report.effectiveDateTime || report.issued || null,
                summary: report.conclusion || title,
                file_url: null,
            };
        });

        const notes = (noteBundle.entry ?? []).map((entry) => {
            const doc = entry.resource;
            const title =
                doc.type?.coding?.[0]?.display ||
                doc.description ||
                "Clinical note";

            const noteText = decodeNoteText(doc);
            let summary = extractNoteBlurb(noteText);

            if (!summary) {
                for (const ref of doc.context?.encounter ?? []) {
                    const key = encounterLookupKey(ref.reference);
                    if (!key) continue;
                    const encounter = encountersById.get(key);
                    summary = encounterReason(encounter);
                    if (summary) break;
                }
            }

            return {
                id: doc.id,
                record_type: "note",
                title,
                provider: doc.author?.[0]?.display ?? "—",
                facility: doc.custodian?.display ?? "—",
                record_date: doc.date || null,
                summary: summary || title,
                file_url: null,
            };
        });
        const prescriptions = (medBundle.entry ?? []).map((entry) => {
            const medication = entry.resource;
            const name = medicationDisplayName(medication);
            return {
                id: `rx-${medication.id}`,
                record_type: "prescription",
                title: name,
                provider: medication.requester?.display ?? "—",
                facility: "—",
                record_date: medication.authoredOn ?? null,
                summary: medicationSummaryBlurb(medication),
                file_url: null,
            };
        });

        const medical_records = [...labs, ...notes, ...prescriptions].sort(
            (a, b) =>
                new Date(b.record_date || 0).getTime() -
                new Date(a.record_date || 0).getTime()
        );

        res.json({ medical_records });
    } catch (error) {
        console.error("Failed to fetch medical records:", error);
        res.status(500).json({ error: "Failed to fetch medical records" });
    }
});

patientRouter.get("/appointments", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const fhirPatientId = await getFhirPatientId(userId);
        if (!fhirPatientId) {
            return res.status(404).json({ error: "Patient not found" });
        }

        const bundle = await fetchPatientMedicalData("Encounter", fhirPatientId);

        const appointments = (bundle.entry ?? [])
            .map((entry) => {
                const encounter = entry.resource;
                const reason =
                    encounter.type?.[0]?.text ||
                    encounter.type?.[0]?.coding?.[0]?.display ||
                    encounter.reasonCode?.[0]?.coding?.[0]?.display ||
                    "Encounter";

                const finished =
                    encounter.status === "finished" ||
                    encounter.status === "completed";

                const physician = encounterPhysician(encounter);

                return {
                    id: encounter.id,
                    appointment_date: encounter.period?.start || null,
                    appointment_type: "in-person",
                    reason,
                    facility: encounter.serviceProvider?.display ?? null,
                    physician_name: physician.name,
                    physician_health_id: physician.healthId,
                    status: finished ? "completed" : "confirmed",
                    notes: encounter.reasonCode?.[0]?.text ?? null,
                };
            })
            .sort(
                (a, b) =>
                    new Date(b.appointment_date || 0).getTime() -
                    new Date(a.appointment_date || 0).getTime()
            );

        res.json({ appointments });
    } catch (error) {
        console.error("Failed to fetch appointments:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});

function money(amount: number | null | undefined): string {
    const n = Number(amount ?? 0);
    return `$${n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function eobSubmittedAmount(eob: any): number {
    const totals = eob?.total ?? [];
    const submitted = totals.find(
        (t: any) =>
            t.category?.text === "Submitted Amount" ||
            t.category?.coding?.[0]?.code === "submitted"
    );
    return Number(submitted?.amount?.value ?? 0);
}

function eobContainedCoverage(eob: any): any | null {
    return (
        (eob?.contained ?? []).find(
            (c: any) => c.resourceType === "Coverage"
        ) ?? null
    );
}

function eobPayerName(eob: any): string {
    const containedCoverage = eobContainedCoverage(eob);
    return (
        containedCoverage?.payor?.[0]?.display ||
        containedCoverage?.type?.text ||
        eob?.insurer?.display ||
        eob?.insurance?.[0]?.coverage?.display ||
        "Unknown payer"
    );
}

/** Insurance member / subscriber ID from Coverage — never the portal Health ID. */
function eobMemberId(eob: any): string | null {
    const coverage = eobContainedCoverage(eob);
    if (!coverage) return null;

    if (coverage.subscriberId) return String(coverage.subscriberId);

    const identifiers = coverage.identifier ?? [];
    for (const id of identifiers) {
        const code = id?.type?.coding?.[0]?.code?.toUpperCase?.() ?? "";
        const system = String(id?.system || "").toLowerCase();
        if (
            id?.value &&
            (code === "MB" ||
                code === "SN" ||
                system.includes("subscriber") ||
                system.includes("member") ||
                system.includes("medicaid") ||
                system.includes("mbi"))
        ) {
            return String(id.value);
        }
    }
    if (identifiers[0]?.value) return String(identifiers[0].value);

    const memberClass = (coverage.class ?? []).find((c: any) => {
        const code = c?.type?.coding?.[0]?.code?.toLowerCase?.() ?? "";
        const text = String(c?.type?.text || "").toLowerCase();
        return code === "mb" || text.includes("member");
    });
    if (memberClass?.value) return String(memberClass.value);

    return null;
}

patientRouter.get("/insurance", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const userResult = await pool.query(
            `SELECT fhir_patient_id FROM users WHERE id = $1`,
            [userId]
        );
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "Patient not found" });
        }

        const { fhir_patient_id: fhirPatientId } = userResult.rows[0];
        if (!fhirPatientId) {
            return res.status(404).json({ error: "No FHIR patient linked" });
        }

        const eobBundle = await fetchPatientMedicalData(
            "ExplanationOfBenefit",
            fhirPatientId
        );

        const eobs = (eobBundle.entry ?? []).map((e) => e.resource);

        const payerCounts = new Map<string, number>();
        let memberId: string | null = null;
        for (const eob of eobs) {
            const payer = eobPayerName(eob);
            if (!payer || payer === "NO_INSURANCE") continue;
            payerCounts.set(payer, (payerCounts.get(payer) ?? 0) + 1);
            if (!memberId) memberId = eobMemberId(eob);
        }

        let primaryPayer = "NO_INSURANCE";
        let primaryCount = 0;
        for (const [payer, count] of payerCounts) {
            if (count > primaryCount) {
                primaryPayer = payer;
                primaryCount = count;
            }
        }
        if (primaryPayer === "NO_INSURANCE" && eobs.length > 0) {
            primaryPayer = eobPayerName(eobs[0]);
        }

        const coverage = {
            provider: primaryPayer,
            plan: primaryPayer === "NO_INSURANCE" ? "Uninsured / self-pay" : primaryPayer,
            policyNumber: "—",
            // Synthea Coverage has no subscriberId / member identifier
            memberId: memberId || "Not on file",
            groupNumber: "—",
            coveragePeriod: primaryPayer === "NO_INSURANCE" ? "N/A" : "Active (from claims)",
            status: primaryPayer === "NO_INSURANCE" ? "none" : "active",
            // Synthea does not include copay tables
            copays: [] as Array<{ label: string; amount: string }>,
        };

        const claims = eobs
            .map((eob) => {
                const billed = eobSubmittedAmount(eob);
                const paid = Number(eob?.payment?.amount?.value ?? 0);
                const youPay = Math.max(0, billed - paid);
                const title =
                    eob?.item?.[0]?.productOrService?.text ||
                    eob?.item?.[0]?.productOrService?.coding?.[0]?.display ||
                    "Healthcare claim";
                const provider =
                    eob?.facility?.display ||
                    eob?.provider?.display ||
                    "Unknown provider";
                const outcome = String(eob?.outcome || "").toLowerCase();
                const payer = eobPayerName(eob);

                let status = "Processed";
                let statusColor = "green";
                let icon: "check" | "warn" = "check";
                if (payer === "NO_INSURANCE" && paid === 0 && billed > 0) {
                    status = "Self-pay";
                    statusColor = "yellow";
                    icon = "warn";
                } else if (outcome === "error" || outcome === "queued") {
                    status = "Pending";
                    statusColor = "yellow";
                    icon = "warn";
                }

                const date =
                    eob?.billablePeriod?.start ||
                    eob?.created ||
                    null;

                return {
                    id: eob?.id ? `EOB-${eob.id}` : `EOB-${date}`,
                    title,
                    provider,
                    payer,
                    date,
                    status,
                    statusColor,
                    icon,
                    billed: money(billed),
                    covered: money(paid),
                    youPay: money(youPay),
                    billedValue: billed,
                    coveredValue: paid,
                    youPayValue: youPay,
                    ai:
                        payer === "NO_INSURANCE"
                            ? "No insurance applied on this claim (self-pay / uninsured period)."
                            : paid > 0
                              ? `Payer ${payer} remitted ${money(paid)} against ${money(billed)} billed.`
                              : `Claim recorded with ${payer}. Submitted ${money(billed)}; remittance amount is ${money(paid)}.`,
                    aiAction: null as string | null,
                };
            })
            .sort(
                (a, b) =>
                    new Date(b.date || 0).getTime() -
                    new Date(a.date || 0).getTime()
            );

        const totalBilled = claims.reduce((s, c) => s + c.billedValue, 0);
        const totalPaid = claims.reduce((s, c) => s + c.coveredValue, 0);
        const totalYouPay = claims.reduce((s, c) => s + c.youPayValue, 0);

        res.json({
            coverage,
            claims,
            summary: {
                claimCount: claims.length,
                totalBilled: money(totalBilled),
                totalPaid: money(totalPaid),
                totalYouPay: money(totalYouPay),
                payers: Array.from(payerCounts.keys()),
            },
        });
    } catch (error) {
        console.error("Failed to fetch insurance:", error);
        res.status(500).json({ error: "Failed to fetch insurance" });
    }
});
