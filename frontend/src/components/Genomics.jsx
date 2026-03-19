import "./Genomics.css";
import { useState } from "react";
import {
    Sparkles, Brain, CheckCircle, AlertTriangle, Info,
    Pill, Activity, TrendingUp, Calendar, Shield,
    Users, Dna, Heart, Target, Sun, Droplet, Lightbulb
} from "lucide-react";

// TODO: Replace with GET /api/patient/genomics

const variants = [
    {
        gene: "APOE - ε3/ε4",
        classification: "Pathogenic",
        classColor: "red",
        location: "chr19:45411941 · Chromosome 19",
        association: "Alzheimer's Disease",
        description: "One copy of the APOE ε4 allele increases risk of late-onset Alzheimer's disease.",
        risk: "3x risk",
        riskColor: "red",
        recommendation: "Cognitive screening every 2 years after age 60. Focus on brain-healthy lifestyle: regular exercise, Mediterranean diet, cognitive stimulation.",
        icon: <AlertTriangle size={18} />,
        borderColor: "red",
    },
    {
        gene: "BRCA1 - c.68_69delAG",
        classification: "Likely Benign",
        classColor: "green",
        location: "chr17:41276045 · Chromosome 17",
        association: "Breast/Ovarian Cancer",
        description: "No pathogenic variants detected in BRCA1 gene.",
        risk: null,
        recommendation: "Standard cancer screening protocols. No additional surveillance needed.",
        icon: <CheckCircle size={18} />,
        borderColor: "green",
    },
    {
        gene: "MTHFR - C677T (Heterozygous)",
        classification: "Uncertain",
        classColor: "yellow",
        location: "chr1:11856378 · Chromosome 1",
        association: "Folate Metabolism",
        description: "May affect folate metabolism and homocysteine levels.",
        risk: "Mild risk",
        riskColor: "yellow",
        recommendation: "Consider B-vitamin supplementation (especially folate and B12). Monitor homocysteine levels annually.",
        icon: <Info size={18} />,
        borderColor: "yellow",
    },
    {
        gene: "CYP2C19 - *2/*17",
        classification: "Pharmacogenomic",
        classColor: "blue",
        location: "chr10:96541616 · Chromosome 10",
        association: "Drug Metabolism",
        description: "Intermediate metabolizer for certain medications including clopidogrel and some antidepressants.",
        risk: "Variable risk",
        riskColor: "orange",
        recommendation: "Inform prescribers about this variant when starting new medications. May require dose adjustments.",
        icon: <Pill size={18} />,
        borderColor: "blue",
    },
];

const pgxDrugs = [
    { name: "Clopidogrel (Plavix)", gene: "CYP2C19", effect: "Reduced effectiveness due to intermediate metabolism", priority: "Moderate Priority", priorityColor: "yellow", rec: "Consider alternative antiplatelet therapy" },
    { name: "Warfarin", gene: "CYP2C9 / VKORC1", effect: "Normal metabolizer status for both genes", priority: "Low Priority", priorityColor: "green", rec: "Standard dosing appropriate" },
    { name: "Simvastatin", gene: "SLCO1B1", effect: "Increased risk of myopathy at higher doses", priority: "Moderate Priority", priorityColor: "yellow", rec: "Avoid doses > 40mg daily" },
    { name: "Codeine", gene: "CYP2D6", effect: "Normal metabolizer – standard pain relief expected", priority: "Low Priority", priorityColor: "green", rec: "Standard dosing" },
];

const ancestry = [
    { label: "Northern European", pct: 52.3 },
    { label: "Southern European", pct: 28.7 },
    { label: "Middle Eastern", pct: 12.4 },
    { label: "East Asian", pct: 4.2 },
    { label: "Sub-Saharan African", pct: 2.4 },
];

const traits = [
    { icon: <Sun size={18} />, name: "Caffeine Metabolism", gene: "CYP1A2", result: "Fast Metabolizer" },
    { icon: <Droplet size={18} />, name: "Lactose Tolerance", gene: "LCT", result: "Tolerant" },
    { icon: <Activity size={18} />, name: "Muscle Performance", gene: "ACTN3", result: "Power Type" },
    { icon: <Heart size={18} />, name: "Alcohol Flush Response", gene: "ALDH2", result: "Normal" },
];

const actionPlans = [
    {
        icon: <Brain size={20} />,
        title: "Alzheimer's Disease Prevention Protocol",
        priority: "HIGH PRIORITY",
        priorityColor: "red",
        borderColor: "red",
        description: "Your APOE ε4 variant increases Alzheimer's risk by 3x. However, lifestyle interventions can significantly reduce this risk.",
        actions: [
            "Engage in 150+ minutes of aerobic exercise weekly (shown to reduce risk by 45% in ε4 carriers)",
            "Follow Mediterranean diet rich in omega-3 fatty acids",
            "Prioritize 7-8 hours of quality sleep nightly",
            "Participate in regular cognitive training and social activities",
            "Consider baseline cognitive assessment at age 60",
        ],
        evidence: "Strong evidence from longitudinal studies in APOE ε4 carriers",
        timeline: "Start immediately - effects compound over years",
    },
    {
        icon: <Heart size={20} />,
        title: "Lipid Management Strategy",
        priority: "MODERATE PRIORITY",
        priorityColor: "yellow",
        borderColor: "yellow",
        description: "Your SLCO1B1 variant affects statin metabolism. Current simvastatin dose should be monitored carefully.",
        actions: [
            "Keep simvastatin dose at or below 40mg daily",
            "Monitor for muscle pain or weakness (increased myopathy risk)",
            "Consider quarterly lipid panels to optimize dosing",
            "Report any unexplained muscle symptoms immediately",
            "Alternative statins (atorvastatin, rosuvastatin) may be preferable",
        ],
        evidence: "FDA pharmacogenomic guidelines for SLCO1B1 variants",
        timeline: "Ongoing - discuss with physician at next visit",
    },
    {
        icon: <Activity size={20} />,
        title: "Folate Metabolism Optimization",
        priority: "MODERATE PRIORITY",
        priorityColor: "yellow",
        borderColor: "yellow",
        description: "MTHFR C677T variant may affect folate conversion. Enhanced B-vitamin intake recommended.",
        actions: [
            "Take methylfolate supplement (not standard folic acid)",
            "Include B12 (methylcobalamin) 1000mcg daily",
            "Consume folate-rich foods: leafy greens, legumes, citrus",
            "Monitor homocysteine levels annually (target < 10 μmol/L)",
            "Avoid alcohol excess which impairs folate metabolism",
        ],
        evidence: "Moderate evidence for supplementation in heterozygous carriers",
        timeline: "Start supplementation within 1 month",
    },
    {
        icon: <CheckCircle size={20} />,
        title: "Cancer Screening Protocol",
        priority: "LOW PRIORITY",
        priorityColor: "green",
        borderColor: "green",
        description: "No pathogenic BRCA1/BRCA2 variants detected. Standard screening protocols appropriate.",
        actions: [
            "Annual mammography starting age 40",
            "Clinical breast exam annually",
            "Consider breast MRI only if additional risk factors develop",
            "Standard colonoscopy screening at age 45",
            "Annual skin cancer screening given sun exposure history",
        ],
        evidence: "Standard guidelines - no genetic risk elevation",
        timeline: "Follow age-appropriate screening schedule",
    },
];

const pgxInteractions = [
    {
        gene: "CYP2C19",
        variant: "*2/*17",
        medications: ["Clopidogrel", "Omeprazole", "Citalopram", "Diazepam"],
        prescribed: null,
        rec: "Alert all prescribers about intermediate metabolizer status. Alternative medications may be more effective.",
        ai: "If clopidogrel is needed for cardiovascular protection, prasugrel or ticagrelor would be more effective alternatives given your genotype.",
    },
    {
        gene: "CYP2D6",
        variant: "Normal Metabolizer",
        medications: ["Codeine", "Tramadol", "Tamoxifen", "Venlafaxine"],
        prescribed: null,
        rec: "Standard dosing expected to be effective.",
        ai: "No dose adjustments needed for CYP2D6-metabolized medications. Standard efficacy expected.",
    },
];

const screeningSchedule = [
    { name: "Cognitive Assessment", reason: "APOE ε4 carrier - early detection of cognitive changes", freq: "Every 2 years starting age 60", status: "Not yet applicable", statusColor: "gray" },
    { name: "Homocysteine Level", reason: "MTHFR variant monitoring", freq: "Annually", status: "Due in 3 months", statusColor: "green" },
    { name: "Lipid Panel with CK", reason: "Statin therapy monitoring (SLCO1B1 variant)", freq: "Every 3-6 months", status: "Due in 1 month", statusColor: "yellow" },
    { name: "Comprehensive Metabolic Panel", reason: "General health monitoring with medication therapy", freq: "Annually", status: "Due in 8 months", statusColor: "green" },
];

const riskComparison = [
    { disease: "Alzheimer's Disease Risk", modifiable: true, yourRisk: "15-20%", popAvg: "5-10%", status: "Higher", statusColor: "red" },
    { disease: "Type 2 Diabetes Risk", modifiable: true, yourRisk: "25-30%", popAvg: "20-25%", status: "Similar", statusColor: "gray" },
    { disease: "Breast Cancer Risk", modifiable: false, yourRisk: "10-12%", popAvg: "12-13%", status: "Lower", statusColor: "green" },
    { disease: "Cardiovascular Disease", modifiable: true, yourRisk: "15-18%", popAvg: "20-25%", status: "Lower", statusColor: "green" },
];

// ── Sub-tab: Genomic Profile ──────────────────────────────────────────────────
function GenomicProfile() {
    return (
        <div className="gn-content">
            {/* Header Banner */}
            <div className="gn-banner">
                <div className="gn-banner-icon"><Dna size={22} /></div>
                <div>
                    <p className="gn-banner-title">Your Genomic Profile</p>
                    <p className="gn-banner-body">Your genetic information has been analyzed to identify health risks, medication responses, and ancestry. This data is combined with your medical history to provide personalized health insights and preventive care recommendations.</p>
                    <p className="gn-banner-meta"><Sparkles size={13} /> Sequencing completed: March 15, 2024 · 847,582 variants analyzed</p>
                </div>
            </div>

            {/* Clinically Significant Variants */}
            <div className="gn-card">
                <div className="gn-section-title-row">
                    <Dna size={19} className="gn-purple-icon" />
                    <h2 className="gn-section-title">Clinically Significant Genetic Variants</h2>
                </div>
                <div className="gn-variants">
                    {variants.map((v, i) => (
                        <div key={i} className={`gn-variant gn-variant-${v.borderColor}`}>
                            <div className="gn-variant-header">
                                <div className="gn-variant-left">
                                    <span className={`gn-variant-icon gn-icon-${v.borderColor}`}>{v.icon}</span>
                                    <div>
                                        <div className="gn-variant-name-row">
                                            <span className="gn-variant-name">{v.gene}</span>
                                            <span className={`gn-badge gn-badge-${v.classColor}`}>{v.classification}</span>
                                        </div>
                                        <p className="gn-variant-loc">{v.location}</p>
                                    </div>
                                </div>
                                {v.risk && <span className={`gn-risk-label gn-risk-${v.riskColor}`}>{v.risk}</span>}
                            </div>
                            <p className="gn-variant-assoc">Associated with: <strong>{v.association}</strong></p>
                            <p className="gn-variant-desc">{v.description}</p>
                            <div className="gn-rec-box">
                                <p className="gn-rec-label">Clinical Recommendation:</p>
                                <p className="gn-rec-text">{v.recommendation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pharmacogenomic Profile */}
            <div className="gn-card">
                <div className="gn-section-title-row">
                    <Pill size={17} className="gn-blue-icon" />
                    <h2 className="gn-section-title">Pharmacogenomic Profile</h2>
                </div>
                <p className="gn-section-sub">How your genes affect medication metabolism and effectiveness. Share this information with all prescribers.</p>
                <div className="gn-pgx-list">
                    {pgxDrugs.map((d, i) => (
                        <div key={i} className="gn-pgx-item">
                            <div className="gn-pgx-header">
                                <span className="gn-pgx-name">{d.name}</span>
                                <span className={`gn-badge gn-badge-${d.priorityColor}`}>{d.priority}</span>
                            </div>
                            <p className="gn-pgx-gene">Gene: {d.gene}</p>
                            <p className="gn-pgx-effect">{d.effect}</p>
                            <div className="gn-pgx-rec">
                                <span className="gn-pgx-rec-label">Recommendation: </span>
                                <span className="gn-pgx-rec-text">{d.rec}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ancestry */}
            <div className="gn-card">
                <div className="gn-section-title-row">
                    <TrendingUp size={17} className="gn-purple-icon" />
                    <h2 className="gn-section-title">Ancestry Composition</h2>
                </div>
                <div className="gn-ancestry">
                    {ancestry.map((a, i) => (
                        <div key={i} className="gn-ancestry-row">
                            <div className="gn-ancestry-label-row">
                                <span className="gn-ancestry-label">{a.label}</span>
                                <span className="gn-ancestry-pct">{a.pct}%</span>
                            </div>
                            <div className="gn-bar-bg">
                                <div className="gn-bar-fill" style={{ width: `${a.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="gn-implications">
                    <p className="gn-implications-label">Health Implications:</p>
                    {["Increased lactose tolerance (Northern European ancestry)", "Standard vitamin D production capacity", "No increased risk for sickle cell trait"].map((item, i) => (
                        <div key={i} className="gn-implication-row">
                            <CheckCircle size={15} className="gn-green-icon" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Genetic Traits */}
            <div className="gn-card">
                <div className="gn-section-title-row">
                    <Activity size={17} className="gn-green-icon" />
                    <h2 className="gn-section-title">Genetic Traits</h2>
                </div>
                <p className="gn-section-sub">Non-medical genetic traits that may influence your lifestyle and preferences.</p>
                <div className="gn-traits-grid">
                    {traits.map((t, i) => (
                        <div key={i} className="gn-trait-card">
                            <div className="gn-trait-icon">{t.icon}</div>
                            <div>
                                <p className="gn-trait-name">{t.name}</p>
                                <p className="gn-trait-gene">Gene: {t.gene}</p>
                                <p className="gn-trait-result">{t.result}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Privacy */}
            <div className="gn-privacy">
                <Shield size={18} className="gn-blue-icon" />
                <div>
                    <p className="gn-privacy-title">Your Genomic Privacy</p>
                    <p className="gn-privacy-body">Your genetic data is encrypted and stored with the highest security standards. You have complete control over who can access this information. Genetic data is never shared without your explicit consent and can be deleted from our systems at any time.</p>
                </div>
            </div>
        </div>
    );
}

// ── Sub-tab: AI Analysis ──────────────────────────────────────────────────────
function AIAnalysis() {
    return (
        <div className="gn-content">
            {/* AI Banner */}
            <div className="gn-banner">
                <div className="gn-banner-icon"><Brain size={22} /></div>
                <div style={{ flex: 1 }}>
                    <p className="gn-banner-title">AI-Powered Genomic Analysis</p>
                    <p className="gn-banner-body">Based on comprehensive analysis of 847,582 genetic variants combined with medical history and lifestyle data, the AI has identified several key areas for personalized health optimization. Your APOE ε4 carrier status warrants proactive cognitive health strategies, while your pharmacogenomic profile suggests important medication considerations. Overall, your genetic profile indicates good baseline health with specific areas requiring targeted preventive care.</p>
                    <div className="gn-score-row">
                        <p className="gn-score-label"><Sparkles size={13} /> Last updated 2 hours ago</p>
                        <p className="gn-score-label">Health Optimization Score:</p>
                        <div className="gn-score-bar-bg">
                            <div className="gn-score-bar-fill" style={{ width: "72%" }} />
                        </div>
                        <p className="gn-score-value">72/100</p>
                    </div>
                </div>
            </div>

            {/* Action Plans */}
            <div className="gn-card">
                <div className="gn-section-title-row">
                    <Target size={17} className="gn-purple-icon" />
                    <h2 className="gn-section-title">Personalized Action Plans</h2>
                </div>
                <p className="gn-section-sub">AI-generated recommendations based on your genetic profile, medical history, and latest research.</p>
                <div className="gn-plans">
                    {actionPlans.map((p, i) => (
                        <div key={i} className={`gn-plan gn-plan-${p.borderColor}`}>
                            <div className="gn-plan-header">
                                <span className={`gn-plan-icon gn-icon-${p.borderColor}`}>{p.icon}</span>
                                <div>
                                    <p className="gn-plan-title">{p.title}</p>
                                    <span className={`gn-priority-badge gn-priority-${p.priorityColor}`}>{p.priority}</span>
                                </div>
                            </div>
                            <p className="gn-plan-desc">{p.description}</p>
                            <div className="gn-rec-box">
                                <p className="gn-rec-label">Recommended Actions:</p>
                                {p.actions.map((a, j) => (
                                    <div key={j} className="gn-action-row">
                                        <CheckCircle size={14} className="gn-green-icon" />
                                        <span>{a}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="gn-plan-footer">
                                <span className="gn-plan-meta"><Lightbulb size={13} className="gn-blue-icon" /> Evidence: {p.evidence}</span>
                                <span className="gn-plan-meta"><Calendar size={13} className="gn-purple-icon" /> Timeline: {p.timeline}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PGx Interactions */}
            <div className="gn-card">
                <div className="gn-section-title-row">
                    <AlertTriangle size={17} className="gn-blue-icon" />
                    <h2 className="gn-section-title">Pharmacogenomic Interactions Analysis</h2>
                </div>
                <p className="gn-section-sub">How your genes interact with medications - important information for all healthcare providers.</p>
                <div className="gn-pgx-interactions">
                    {pgxInteractions.map((p, i) => (
                        <div key={i} className="gn-interaction-card">
                            <p className="gn-interaction-gene">{p.gene}</p>
                            <p className="gn-interaction-variant">Variant: {p.variant}</p>
                            <div className="gn-interaction-row">
                                <div>
                                    <p className="gn-interaction-label">Affected Medications:</p>
                                    <div className="gn-med-tags">
                                        {p.medications.map((m, j) => <span key={j} className="gn-med-tag">{m}</span>)}
                                    </div>
                                </div>
                                <div>
                                    <p className="gn-interaction-label">Currently Prescribed:</p>
                                    <span className="gn-none-tag">None currently prescribed</span>
                                </div>
                            </div>
                            <div className="gn-rec-box">
                                <p className="gn-rec-label" style={{ color: "rgb(0,87,235)" }}>Clinical Recommendation:</p>
                                <p className="gn-rec-text" style={{ color: "rgb(0,87,235)" }}>{p.rec}</p>
                            </div>
                            <div className="gn-ai-insight-row">
                                <Sparkles size={14} className="gn-purple-icon" />
                                <div>
                                    <span className="gn-ai-label">AI Insight: </span>
                                    <span className="gn-ai-text">{p.ai}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Screening Schedule */}
            <div className="gn-card">
                <div className="gn-section-title-row">
                    <Calendar size={17} className="gn-green-icon" />
                    <h2 className="gn-section-title">Genomic-Based Screening Schedule</h2>
                </div>
                <p className="gn-section-sub">Personalized monitoring schedule based on your genetic risk factors.</p>
                <div className="gn-schedule">
                    {screeningSchedule.map((s, i) => (
                        <div key={i} className="gn-schedule-item">
                            <div className="gn-schedule-left">
                                <p className="gn-schedule-name">{s.name}</p>
                                <p className="gn-schedule-reason">{s.reason}</p>
                                <p className="gn-schedule-freq">Frequency: {s.freq}</p>
                            </div>
                            <span className={`gn-status-badge gn-status-${s.statusColor}`}>{s.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Risk vs Population */}
            <div className="gn-card">
                <div className="gn-section-title-row">
                    <Users size={17} className="gn-purple-icon" />
                    <h2 className="gn-section-title">Your Risk vs. Population Average</h2>
                </div>
                <p className="gn-section-sub">Lifetime risk comparison based on genetic and non-genetic factors.</p>
                <div className="gn-risks">
                    {riskComparison.map((r, i) => (
                        <div key={i} className="gn-risk-card">
                            <div className="gn-risk-header">
                                <p className="gn-risk-disease">{r.disease}</p>
                                <span className={`gn-status-badge gn-status-${r.statusColor}`}>{r.status}</span>
                            </div>
                            {r.modifiable && <span className="gn-modifiable-badge">Risk can be modified by lifestyle</span>}
                            <div className="gn-risk-row">
                                <div>
                                    <p className="gn-risk-sub">Your Lifetime Risk</p>
                                    <p className="gn-risk-val">{r.yourRisk}</p>
                                </div>
                                <div>
                                    <p className="gn-risk-sub">Population Average</p>
                                    <p className="gn-risk-val">{r.popAvg}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="gn-disclaimer">
                <AlertTriangle size={18} className="gn-yellow-icon" />
                <div>
                    <p className="gn-disclaimer-title">Important Note About AI Analysis</p>
                    <p className="gn-disclaimer-body">This AI analysis is based on current scientific literature and your health data. However, it should not replace professional medical advice. Always discuss findings with your healthcare provider before making any medical decisions. Genetic risk predictions are probabilities, not certainties, and are influenced by many factors including lifestyle and environment.</p>
                </div>
            </div>
        </div>
    );
}

// ── Main Genomics component ───────────────────────────────────────────────────
function Genomics() {
    const [activeSubTab, setActiveSubTab] = useState("profile");

    return (
        <div className="gn-wrap">
            {/* Sub-tabs */}
            <div className="gn-subtabs">
                <button
                    className={`gn-subtab ${activeSubTab === "profile" ? "gn-subtab-active" : ""}`}
                    onClick={() => setActiveSubTab("profile")}
                >
                    <Dna size={15} /> Genomic Profile
                </button>
                <button
                    className={`gn-subtab ${activeSubTab === "ai" ? "gn-subtab-active" : ""}`}
                    onClick={() => setActiveSubTab("ai")}
                >
                    <Brain size={15} /> AI Analysis
                </button>
            </div>

            {activeSubTab === "profile" && <GenomicProfile />}
            {activeSubTab === "ai" && <AIAnalysis />}
        </div>
    );
}

export default Genomics;
