import "./MedicalRecords.css";
import { useState } from "react";
import {
    Search, Filter, FileText, Pill, FlaskConical,
    Dna, Eye, Download, CheckCircle, Sparkles,
    AlertTriangle, ChevronDown
} from "lucide-react";

// TODO: Replace with GET /api/patient/records
const allRecords = [
    {
        id: 1,
        type: "note",
        title: "Annual Physical Examination",
        provider: "Dr. Emily Martinez",
        facility: "City General Hospital",
        date: "Nov 30, 2024",
        summary: "Routine physical examination. Patient reports feeling well. All vitals stable.",
        ai: { color: "green", icon: "check", text: "All vitals within healthy range. No abnormalities detected." },
    },
    {
        id: 2,
        type: "lab",
        title: "Complete Blood Count (CBC)",
        provider: "LabCorp",
        facility: "LabCorp – Downtown",
        date: "Nov 27, 2024",
        summary: "All values within normal range. WBC: 7.2, RBC: 4.8, Hemoglobin: 14.2",
        ai: { color: "green", icon: "check", text: "CBC results excellent. No signs of anemia or infection." },
    },
    {
        id: 3,
        type: "prescription",
        title: "Lisinopril 10mg",
        provider: "Dr. Emily Martinez",
        facility: "City General Hospital",
        date: "Nov 24, 2024",
        summary: "Take one tablet daily for blood pressure management. 90-day supply.",
        ai: { color: "yellow", icon: "warn", text: "Drug interaction alert: Avoid NSAIDs like ibuprofen. Consider acetaminophen for pain." },
    },
    {
        id: 4,
        type: "prescription",
        title: "Metformin 500mg",
        provider: "Dr. Emily Martinez",
        facility: "City General Hospital",
        date: "Nov 24, 2024",
        summary: "Take one tablet twice daily with meals. For type 2 diabetes management.",
        ai: { color: "blue", icon: "spark", text: "Adherence excellent (95%). Next refill due February 2025." },
    },
    {
        id: 5,
        type: "genomic",
        title: "Pharmacogenomic Panel",
        provider: "23andMe Health",
        facility: "Online Portal",
        date: "Oct 14, 2024",
        summary: "Analysis of drug metabolism genes. CYP2C19 normal metabolizer, CYP2D6 intermediate.",
        ai: { color: "blue", icon: "spark", text: "Data integrated with prescription management. Alerts enabled for gene-drug interactions." },
    },
    {
        id: 6,
        type: "lab",
        title: "Lipid Panel",
        provider: "Quest Diagnostics",
        facility: "Quest – Medical Plaza",
        date: "Oct 9, 2024",
        summary: "Total cholesterol: 185 mg/dL, HDL: 58 mg/dL, LDL: 110 mg/dL, Triglycerides: 85 mg/dL",
        ai: { color: "green", icon: "check", text: "Lipid levels optimal. Continue current statin therapy and lifestyle habits." },
    },
    {
        id: 7,
        type: "note",
        title: "Cardiology Consultation",
        provider: "Dr. James Chen",
        facility: "Heart & Vascular Center",
        date: "Sep 21, 2024",
        summary: "Patient presents with occasional palpitations. ECG normal. Holter monitor ordered.",
        ai: { color: "blue", icon: "spark", text: "Follow-up recommended in 3 months. Holter monitor results pending review." },
    },
    {
        id: 8,
        type: "lab",
        title: "HbA1c Test",
        provider: "LabCorp",
        facility: "LabCorp – Downtown",
        date: "Aug 29, 2024",
        summary: "HbA1c: 6.2% – indicating good diabetes control over past 3 months.",
        ai: { color: "green", icon: "check", text: "Diabetes well-controlled. Target HbA1c <7.0% achieved. Next test due in 3 months." },
    },
];

const categories = [
    { key: "all",          label: "All Records",   icon: null,                    count: 247 },
    { key: "note",         label: "Medical Notes", icon: <FileText   size={16} />, count: 89  },
    { key: "prescription", label: "Prescriptions", icon: <Pill       size={16} />, count: 45  },
    { key: "lab",          label: "Lab Tests",     icon: <FlaskConical size={16} />, count: 78 },
    { key: "genomic",      label: "Genomic Data",  icon: <Dna        size={16} />, count: 35  },
];

const typeIconMap = {
    note:         { icon: <FileText    size={20} />, bg: "blue"   },
    prescription: { icon: <Pill        size={20} />, bg: "green"  },
    lab:          { icon: <FlaskConical size={20} />, bg: "purple" },
    genomic:      { icon: <Dna         size={20} />, bg: "white" },
};

function AiInsight({ ai }) {
    if (!ai) return null;
    return (
        <div className={`mr-ai mr-ai-${ai.color}`}>
            {ai.icon === "check" && <CheckCircle  size={14} />}
            {ai.icon === "warn"  && <AlertTriangle size={14} />}
            {ai.icon === "spark" && <Sparkles      size={14} />}
            <span>{ai.text}</span>
        </div>
    );
}

function MedicalRecords() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");

    const filtered = allRecords.filter((r) => {
        const matchCategory = activeCategory === "all" || r.type === activeCategory;
        const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                            r.summary.toLowerCase().includes(search.toLowerCase()) ||
                            r.provider.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="mr-wrap">
            {/* Search + Filter */}
            <div className="mr-search-row">
                <div className="mr-search-wrap">
                    <Search size={16} className="mr-search-icon" />
                    <input
                        className="mr-search"
                        type="text"
                        placeholder="Search medical records..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="mr-filter-btn">
                    <Filter size={15} />
                    Filter
                </button>
            </div>

            {/* Category Tabs */}
            <div className="mr-categories">
                {categories.map((category) => (
                    <button
                        key={category.key}
                        className={`mr-category ${activeCategory === category.key ? "mr-category-active" : ""}`}
                        onClick={() => setActiveCategory(category.key)}
                    >
                        {category.icon && <span className="mr-category-icon">{category.icon}</span>}
                        <span className="mr-category-label">{category.label}</span>
                        <span className="mr-category-count">{category.count} records</span>
                    </button>
                ))}
            </div>

            {/* Records List */}
            <div className="mr-list">
                {filtered.length === 0 && (
                    <div className="mr-empty">No records found.</div>
                )}
                {filtered.map((r) => {
                    const { icon, bg } = typeIconMap[r.type];
                    return (
                        <div key={r.id} className="mr-card">
                            <div className="mr-card-header">
                                <div className={`mr-type-icon mr-type-icon-${bg}`}>{icon}</div>
                                <div className="mr-card-meta">
                                    <div className="mr-card-title-row">
                                        <h3 className="mr-card-title">{r.title}</h3>
                                        <span className="mr-card-date">{r.date}</span>
                                    </div>
                                    <p className="mr-card-provider">{r.provider} · {r.facility}</p>
                                </div>
                            </div>
                            <p className="mr-card-summary">{r.summary}</p>
                            <AiInsight ai={r.ai} />
                            <div className="mr-card-actions">
                                <button className="mr-btn-view">
                                    <Eye size={14} /> View
                                </button>
                                <button className="mr-btn-download">
                                    <Download size={14} /> Download
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MedicalRecords;
