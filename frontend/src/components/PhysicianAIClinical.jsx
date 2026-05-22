import { useState } from "react";
import {
    Brain,
    Sparkles,
    Pill,
    FileText,
    Search,
    TrendingUp,
    CheckCircle,
} from "lucide-react";
import "./PhysicianAIClinical.css";

const guidelines = [
    { title: "Hypertension Management", subtitle: "2024 ACC/AHA Guidelines" },
    { title: "Type 2 Diabetes", subtitle: "ADA Standards of Care 2024" },
    { title: "Lipid Management", subtitle: "2023 ESC Guidelines" },
    { title: "Anticoagulation", subtitle: "CHEST Guidelines 2024" },
];

const riskCalculators = [
    {
        key: "ascvd",
        title: "ASCVD Risk",
        subtitle: "Cardiovascular disease",
        tone: "orange",
    },
    {
        key: "chads",
        title: "CHA₂DS₂-VASc",
        subtitle: "Stroke risk in AFib",
        tone: "blue",
    },
    {
        key: "hasbled",
        title: "HAS-BLED",
        subtitle: "Bleeding risk",
        tone: "purple",
    },
    {
        key: "frax",
        title: "FRAX Score",
        subtitle: "Fracture risk",
        tone: "green",
    },
];

const labBullets = [
    "Flags abnormal values with clinical significance",
    "Suggests follow-up tests based on patterns",
    "Tracks trends over time automatically",
];

function PhysicianAIClinical() {
    const [meds, setMeds] = useState("");
    const [symptoms, setSymptoms] = useState("");

    return (
        <div className="aic-stack">
            {/* Hover = light green (per Figma screenshot 2) */}
            <div className="aic-decision-banner">
                <div className="aic-decision-icon">
                    <Brain size={22} />
                </div>
                <div className="aic-decision-text">
                    <p className="aic-decision-title">AI Clinical Decision Support</p>
                    <p className="aic-decision-body">
                        Leverage AI to enhance patient safety, improve diagnostic accuracy, and streamline clinical workflows.
                    </p>
                </div>
            </div>

            <div className="aic-two-col">
                <div className="phd-card aic-tool-card">
                    <div className="phd-card-title-row">
                        <Pill size={18} className="aic-icon-red" />
                        <h2 className="phd-card-title">Drug Interaction Checker</h2>
                    </div>
                    <p className="aic-tool-desc">
                        Check for potential interactions between medications, including severity levels and recommendations.
                    </p>
                    <label className="aic-field-label" htmlFor="aic-meds">
                        Enter medications (comma-separated)
                    </label>
                    <input
                        id="aic-meds"
                        className="aic-input"
                        type="text"
                        placeholder="e.g., Lisinopril, Ibuprofen, Metformin"
                        value={meds}
                        onChange={(e) => setMeds(e.target.value)}
                    />
                    <button type="button" className="aic-btn-primary">
                        <Search size={18} />
                        Check Interactions
                    </button>
                </div>

                <div className="phd-card aic-tool-card">
                    <div className="phd-card-title-row">
                        <Sparkles size={18} className="aic-icon-purple" />
                        <h2 className="phd-card-title">Differential Diagnosis Assistant</h2>
                    </div>
                    <p className="aic-tool-desc">
                        Enter patient symptoms to get AI-suggested differential diagnoses ranked by likelihood.
                    </p>
                    <label className="aic-field-label" htmlFor="aic-symptoms">
                        Enter symptoms
                    </label>
                    <textarea
                        id="aic-symptoms"
                        className="aic-textarea"
                        rows={5}
                        placeholder="e.g., Fever, cough, shortness of breath, fatigue"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                    <button type="button" className="aic-btn-primary">
                        <Brain size={18} />
                        Generate Differential
                    </button>
                </div>
            </div>

            <div className="phd-card aic-section-card">
                <div className="phd-card-title-row">
                    <FileText size={18} color="rgb(0, 87, 235)" />
                    <h2 className="phd-card-title">Evidence-Based Guidelines</h2>
                </div>
                <p className="aic-section-sub">
                    Quick access to current clinical practice guidelines based on patient conditions.
                </p>
                <div className="aic-guideline-grid">
                    {guidelines.map((g) => (
                        <button key={g.title} type="button" className="aic-guideline-tile">
                            <span className="aic-guideline-title">{g.title}</span>
                            <span className="aic-guideline-sub">{g.subtitle}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="phd-card aic-section-card">
                <div className="phd-card-title-row">
                    <TrendingUp size={18} color="rgb(220, 100, 0)" />
                    <h2 className="phd-card-title">Risk Assessment Calculators</h2>
                </div>
                <p className="aic-section-sub">
                    Calculate patient-specific risk scores for various conditions.
                </p>
                <div className="aic-risk-row">
                    {riskCalculators.map((c) => (
                        <button
                            key={c.key}
                            type="button"
                            className={`aic-risk-tile aic-risk-tile-${c.tone}`}
                        >
                            <span className="aic-risk-title">{c.title}</span>
                            <span className="aic-risk-sub">{c.subtitle}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="phd-card aic-section-card">
                <div className="phd-card-title-row">
                    <CheckCircle size={18} color="rgb(0, 160, 60)" />
                    <h2 className="phd-card-title">AI Lab Result Interpretation</h2>
                </div>
                <div className="aic-lab-panel">
                    <Brain size={22} className="aic-lab-brain" />
                    <div>
                        <p className="aic-lab-lead">
                            AI automatically analyzes lab results and provides clinical interpretations with recommended follow-up actions.
                        </p>
                        <ul className="aic-lab-bullets">
                            {labBullets.map((line) => (
                                <li key={line}>{line}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PhysicianAIClinical;
