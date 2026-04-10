import "./MedicalRecords.css";
import { useState } from "react";
import {
    Search, Filter, FileText, Pill, FlaskConical,
    Dna, Eye, Download, CheckCircle, Sparkles,
    AlertTriangle
} from "lucide-react";

const categories = [
    { key: "all",          label: "All Records",   icon: null, },
    { key: "note",         label: "Medical Notes", icon: <FileText   size={16} /> },
    { key: "prescription", label: "Prescriptions", icon: <Pill       size={16} /> },
    { key: "lab",          label: "Lab Tests",     icon: <FlaskConical size={16} /> },
    { key: "genomic",      label: "Genomic Data",  icon: <Dna        size={16} /> },
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

function MedicalRecords({ records, loading }) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");

    

    const getCategoryCount = (key) => {
        if (key === "all") return records.length;
        return records.filter(r => r.record_type === key).length;
    };

    const filtered = records.filter((r) => {
        const matchCategory = activeCategory === "all" || r.record_type === activeCategory;
        const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                            r.summary.toLowerCase().includes(search.toLowerCase()) ||
                            r.provider.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });
    
    if (loading) return <div className="mr-empty">Loading records...</div>;

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
                        <span className="mr-category-count">{getCategoryCount(category.key)} records</span>
                    </button>
                ))}
            </div>

            {/* Records List */}
            <div className="mr-list">
                {filtered.length === 0 && (
                    <div className="mr-empty">No records found.</div>
                )}
                {filtered.map((r) => {
                    const { icon, bg } = typeIconMap[r.record_type];
                    return (
                        <div key={r.id} className="mr-card">
                            <div className="mr-card-header">
                                <div className={`mr-type-icon mr-type-icon-${bg}`}>{icon}</div>
                                <div className="mr-card-meta">
                                    <div className="mr-card-title-row">
                                        <h3 className="mr-card-title">{r.title}</h3>
                                        <span className="mr-card-date">
                                            {new Date(r.record_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                        </span>
                                    </div>
                                    <p className="mr-card-provider">{r.provider} · {r.facility}</p>
                                </div>
                            </div>
                            <p className="mr-card-summary">{r.summary}</p>
                            <AiInsight ai={r.ai} />
                            {r.file_url && (
                                <div className="mr-card-actions">
                                    <button className="mr-btn-view">
                                        <Eye size={14} /> View
                                    </button>
                                    <button className="mr-btn-download">
                                        <Download size={14} /> Download
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MedicalRecords;
