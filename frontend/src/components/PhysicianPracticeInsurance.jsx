import { useState, useMemo } from "react";
import {
    Bot,
    Sparkles,
    Clock,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    FileText,
    Plus,
    CheckCircle,
    Shield,
    Search,
    Send,
} from "lucide-react";
import "./PhysicianPracticeInsurance.css";

const summaryStats = [
    {
        key: "pending",
        icon: Clock,
        iconColor: "rgb(200, 140, 0)",
        label: "Pending Auth",
        value: "2 Active",
        sub: "Est. approval: 2-3 days",
    },
    {
        key: "out",
        icon: DollarSign,
        iconColor: "rgb(0, 160, 60)",
        label: "Outstanding",
        value: "$3,180",
        sub: "Expected within 15 days",
    },
    {
        key: "denials",
        icon: AlertTriangle,
        iconColor: "rgb(220, 70, 50)",
        label: "Denials",
        value: "2 This Month",
        sub: "AI appeals ready",
    },
    {
        key: "rate",
        icon: TrendingUp,
        iconColor: "rgb(0, 87, 235)",
        label: "Approval Rate",
        value: "89%",
        sub: "+3% vs. average",
        subClass: "phi-stat-sub-green",
    },
];

const priorAuths = [
    {
        id: "pa1",
        tone: "yellow",
        icon: Clock,
        title: "Physical Therapy (12 sessions)",
        badges: [{ text: "Pending", variant: "yellow" }],
        patient: "Sarah Johnson",
        patientId: "HU-2847",
        meta: "PA-2024-502 · Blue Cross Blue Shield",
        leftLabel: "Request Date",
        leftValue: "12/7/2024",
        rightLabel: "AI Prediction",
        rightValue: "95% approval probability",
        aiText: "All required documentation submitted. Expected approval within 3 business days.",
        footer: null,
    },
    {
        id: "pa2",
        tone: "red",
        icon: AlertTriangle,
        title: "Specialty Medication - Humira",
        badges: [
            { text: "More Info Needed", variant: "red" },
            { text: "Urgent", variant: "urgent" },
        ],
        patient: "Michael Chen",
        patientId: "HU-3921",
        meta: "PA-2024-518 · UnitedHealthcare",
        leftLabel: "Request Date",
        leftValue: "12/6/2024",
        rightLabel: "AI Prediction",
        rightValue: "70% approval with additional info",
        aiText: "Missing lab results from last 30 days. AI-generated follow-up letter ready to send.",
        footer: "submit",
    },
    {
        id: "pa3",
        tone: "green",
        icon: CheckCircle,
        title: "MRI Lumbar Spine",
        badges: [{ text: "Approved", variant: "green" }],
        patient: "Emma Davis",
        patientId: "HU-2156",
        meta: "PA-2024-489 · Aetna",
        leftLabel: "Request Date",
        leftValue: "12/5/2024",
        rightLabel: "Valid Until",
        rightValue: "1/8/2025",
        aiText: "Prior authorization approved. Schedule imaging at in-network facility.",
        footer: null,
    },
];

const verifiedPatients = [
    {
        name: "Sarah Johnson",
        id: "HU-2847",
        plan: "Blue Cross Blue Shield Gold PPO",
        memberId: "MEM-2847",
        copay: "$50",
        deductible: "57%",
        verified: "12/7/2024",
        note: "Coverage verified. Patient has excellent benefits for chronic disease management.",
    },
    {
        name: "Michael Chen",
        id: "HU-3921",
        plan: "UnitedHealthcare Choice Plus",
        memberId: "MEM-3921",
        copay: "$40",
        deductible: "100%",
        verified: "12/8/2024",
        note: "Deductible met — all services covered at 80% coinsurance for in-network care.",
    },
];

const reimbursementMonths = [
    {
        month: "November 2024",
        rate: 86,
        rows: [
            { label: "Submitted", value: "$48,750", tone: "dark" },
            { label: "Approved", value: "$42,120", tone: "green" },
            { label: "Denied", value: "$0", tone: "red" },
            { label: "Pending", value: "$6,630", tone: "orange" },
            { label: "Paid Out", value: "$38,940", tone: "dark" },
            { label: "Outstanding", value: "$3,180", tone: "dark" },
        ],
    },
    {
        month: "October 2024",
        rate: 82,
        rows: [
            { label: "Submitted", value: "$44,200", tone: "dark" },
            { label: "Approved", value: "$36,244", tone: "green" },
            { label: "Denied", value: "$890", tone: "red" },
            { label: "Pending", value: "$2,100", tone: "orange" },
            { label: "Paid Out", value: "$35,100", tone: "dark" },
            { label: "Outstanding", value: "$1,200", tone: "dark" },
        ],
    },
];

const denialClaims = [
    {
        service: "Extended Office Visit",
        amount: "$285",
        deniedDate: "12/4/2024",
        patient: "Robert Taylor",
        patientId: "HU-4782",
        claimId: "CLM-2024-7821",
        reason: "Documentation insufficient",
        strategy:
            "AI has drafted an appeal with additional clinical notes and visit documentation to satisfy payer requirements.",
        status: "ready",
    },
    {
        service: "Lab Panel",
        amount: "$412",
        deniedDate: "11/28/2024",
        patient: "Lisa Park",
        patientId: "HU-5102",
        claimId: "CLM-2024-7601",
        reason: "Not medically necessary",
        strategy:
            "AI appeal references recent diagnoses and guideline-consistent ordering to support medical necessity.",
        status: "submitted",
    },
];

function PhysicianPracticeInsurance() {
    const [verifySearch, setVerifySearch] = useState("");

    const filteredVerified = useMemo(() => {
        const q = verifySearch.trim().toLowerCase();
        if (!q) return verifiedPatients;
        return verifiedPatients.filter(
            (v) =>
                v.name.toLowerCase().includes(q) ||
                v.id.toLowerCase().includes(q)
        );
    }, [verifySearch]);

    return (
        <div className="phi-stack">
            <div className="phi-ai-banner">
                <div className="phi-ai-icon">
                    <Bot size={22} />
                </div>
                <div className="phi-ai-text">
                    <p className="phi-ai-title">AI Insurance Management Assistant</p>
                    <p className="phi-ai-body">
                        You have 3 pending authorizations requiring attention. Your practice&apos;s approval rate is 89%,
                        up 3% from network average. November reimbursements are tracking well with $42,120 approved to date.
                    </p>
                    <div className="phi-ai-actions">
                        <button type="button" className="phi-btn-solid">
                            <Sparkles size={16} />
                            Auto-Process Ready Items
                        </button>
                        <button type="button" className="phi-btn-outline">
                            View AI Recommendations
                        </button>
                    </div>
                </div>
            </div>

            <div className="phd-stat-grid">
                {summaryStats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div className="phd-stat-card" key={s.key}>
                            <div className="phd-stat-top">
                                <Icon size={22} color={s.iconColor} />
                                <span className="phd-stat-label">{s.label}</span>
                            </div>
                            <p className="phd-stat-value">{s.value}</p>
                            <p className={`phd-stat-sub ${s.subClass || ""}`}>{s.sub}</p>
                        </div>
                    );
                })}
            </div>

            <div className="phd-card phi-section">
                <div className="phi-section-head">
                    <div className="phd-card-title-row" style={{ marginBottom: 0 }}>
                        <FileText size={18} color="rgb(0, 160, 60)" />
                        <h2 className="phd-card-title">Prior Authorization Management</h2>
                    </div>
                    <button type="button" className="phi-btn-solid phi-btn-compact">
                        <Plus size={16} />
                        New Authorization Request
                    </button>
                </div>
                <div className="phi-pa-list">
                    {priorAuths.map((pa) => {
                        const Icon = pa.icon;
                        return (
                            <div key={pa.id} className={`phi-pa-card phi-pa-${pa.tone}`}>
                                <div className="phi-pa-top">
                                    <div className="phi-pa-title-row">
                                        <Icon size={20} className={`phi-pa-title-icon phi-pa-icon-${pa.tone}`} />
                                        <h3 className="phi-pa-title">{pa.title}</h3>
                                    </div>
                                    <div className="phi-pa-badges">
                                        {pa.badges.map((b) => (
                                            <span key={b.text} className={`phi-badge phi-badge-${b.variant}`}>
                                                {b.text}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="phi-pa-patient">
                                    {pa.patient} ({pa.patientId})
                                </p>
                                <p className="phi-pa-meta">{pa.meta}</p>
                                <div className="phi-pa-grid2">
                                    <div>
                                        <span className="phi-pa-dt-label">{pa.leftLabel}</span>
                                        <p className="phi-pa-dt-value">{pa.leftValue}</p>
                                    </div>
                                    <div>
                                        <span className="phi-pa-dt-label">{pa.rightLabel}</span>
                                        <p className="phi-pa-dt-value">{pa.rightValue}</p>
                                    </div>
                                </div>
                                <div className="phi-pa-ai-inset">
                                    <Sparkles size={15} className="phi-pa-ai-sparkle" />
                                    <div>
                                        <span className="phi-pa-ai-label">AI Recommendation:</span>
                                        <p className="phi-pa-ai-copy">{pa.aiText}</p>
                                    </div>
                                </div>
                                {pa.footer === "submit" && (
                                    <div className="phi-pa-footer">
                                        <button type="button" className="phi-btn-solid phi-btn-compact">
                                            <Send size={15} />
                                            Submit AI-Generated Response
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="phd-card phi-section">
                <div className="phi-verify-head">
                    <div className="phd-card-title-row" style={{ marginBottom: 0 }}>
                        <Shield size={18} color="rgb(0, 87, 235)" />
                        <h2 className="phd-card-title">Insurance Verification</h2>
                    </div>
                    <div className="phi-verify-tools">
                        <div className="phi-search-wrap">
                            <Search size={16} className="phi-search-icon" />
                            <input
                                className="phi-search"
                                type="text"
                                placeholder="Search patient..."
                                value={verifySearch}
                                onChange={(e) => setVerifySearch(e.target.value)}
                            />
                        </div>
                        <button type="button" className="phi-btn-solid phi-btn-compact">
                            Verify Coverage
                        </button>
                    </div>
                </div>
                <div className="phi-verify-list">
                    {filteredVerified.length === 0 ? (
                        <p className="phi-empty-msg">No patients match your search.</p>
                    ) : (
                        filteredVerified.map((v) => (
                        <div key={v.id} className="phi-verify-card">
                            <div className="phi-verify-card-top">
                                <div>
                                    <p className="phi-verify-name">
                                        {v.name} ({v.id})
                                    </p>
                                    <p className="phi-verify-plan">{v.plan}</p>
                                    <p className="phi-verify-member">Member ID: {v.memberId}</p>
                                </div>
                                <span className="phi-badge phi-badge-green">Active</span>
                            </div>
                            <div className="phi-verify-metrics">
                                <div>
                                    <span className="phi-pa-dt-label">Copay</span>
                                    <p className="phi-pa-dt-value">{v.copay}</p>
                                </div>
                                <div>
                                    <span className="phi-pa-dt-label">Deductible Met</span>
                                    <p className="phi-pa-dt-value">{v.deductible}</p>
                                </div>
                                <div>
                                    <span className="phi-pa-dt-label">Last Verified</span>
                                    <p className="phi-pa-dt-value">{v.verified}</p>
                                </div>
                            </div>
                            <div className="phi-verify-note">
                                <Sparkles size={15} color="rgb(0, 87, 235)" />
                                <span>{v.note}</span>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>

            <div className="phd-card phi-section">
                <div className="phd-card-title-row">
                    <DollarSign size={18} color="rgb(0, 160, 60)" />
                    <h2 className="phd-card-title">Reimbursement Tracking</h2>
                </div>
                <div className="phi-reimb-stack">
                    {reimbursementMonths.map((m) => (
                        <div key={m.month} className="phi-reimb-card">
                            <div className="phi-reimb-head">
                                <span className="phi-reimb-month">{m.month}</span>
                                <div className="phi-reimb-rate">
                                    <span className="phi-pa-dt-label">Approval Rate</span>
                                    <p className="phi-reimb-rate-val">{m.rate}%</p>
                                </div>
                            </div>
                            <div className="phi-reimb-grid">
                                {m.rows.map((r) => (
                                    <div key={r.label}>
                                        <span className="phi-pa-dt-label">{r.label}</span>
                                        <p className={`phi-reimb-val phi-reimb-${r.tone}`}>{r.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="phi-reimb-bar-bg">
                                <div className="phi-reimb-bar-fill" style={{ width: `${m.rate}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="phd-card phi-section">
                <div className="phd-card-title-row">
                    <AlertTriangle size={18} color="rgb(220, 70, 50)" />
                    <h2 className="phd-card-title">Claims Denials &amp; AI-Assisted Appeals</h2>
                </div>
                <p className="phi-denial-intro">
                    AI automatically analyzes denials and generates appeal documentation with supporting evidence.
                </p>
                <div className="phi-denial-list">
                    {denialClaims.map((d) => (
                        <div key={d.claimId} className="phi-denial-card">
                            <div className="phi-denial-top">
                                <div className="phi-denial-title-row">
                                    <AlertTriangle size={18} className="phi-denial-warn-icon" />
                                    <span className="phi-denial-service">{d.service}</span>
                                </div>
                                <div className="phi-denial-amt">
                                    <span className="phi-denial-price">{d.amount}</span>
                                    <span className="phi-denial-date">Denied: {d.deniedDate}</span>
                                </div>
                            </div>
                            <p className="phi-denial-patient">
                                {d.patient} ({d.patientId})
                            </p>
                            <p className="phi-denial-claim">{d.claimId}</p>
                            <p className="phi-denial-reason">
                                <span className="phi-denial-reason-label">Denial Reason:</span>{" "}
                                <span className="phi-denial-reason-txt">{d.reason}</span>
                            </p>
                            <div className="phi-denial-strategy">
                                <Sparkles size={15} className="phi-pa-ai-sparkle" />
                                <div>
                                    <span className="phi-denial-strat-label">AI Appeal Strategy:</span>
                                    <p className="phi-denial-strat-copy">{d.strategy}</p>
                                </div>
                            </div>
                            <div className="phi-denial-footer">
                                {d.status === "ready" ? (
                                    <>
                                        <span className="phi-badge phi-badge-blue">Ready to Submit</span>
                                        <button type="button" className="phi-btn-solid phi-btn-compact">
                                            <Send size={15} />
                                            Submit AI Appeal
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="phi-badge phi-badge-yellow">Appeal Submitted</span>
                                        <span className="phi-denial-pending">Decision expected: 12/14/2024</span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PhysicianPracticeInsurance;
