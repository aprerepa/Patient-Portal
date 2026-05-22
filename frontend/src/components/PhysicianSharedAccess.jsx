import { useMemo, useState } from "react";
import {
    Share2, Search, User, Eye, Clock, Copy, CheckCircle, LockKeyhole
} from "lucide-react";
import "./MyPatients.css";
import "./PhysicianSharedAccess.css";

const pendingRequests = [
    {
        id: 1,
        patient: "Jennifer Lee",
        healthId: "PAT-7821",
        detail: "New patient consultation scheduled for Dec 15, 2024",
        requested: "12/5/2024",
    },
];

const patientsWithAccess = [
    {
        name: "Sarah Johnson",
        id: "PAT-2847",
        age: 52,
        gender: "Female",
        conditions: ["Type 2 Diabetes", "Hypertension"],
        accessLevel: "Full Access",
        records: 247,
        lastAccessed: "Dec 4",
        expires: "Ongoing",
        sharedDate: "1/14/2024",
    },
    {
        name: "Robert Martinez",
        id: "PAT-2156",
        age: 61,
        gender: "Male",
        conditions: ["Type 2 Diabetes", "Hypertension", "CAD"],
        accessLevel: "Cardiology Records Only",
        records: 124,
        lastAccessed: "Dec 2",
        expires: "2025-04-10",
        sharedDate: "10/9/2024",
    },
    {
        name: "Michael Chen",
        id: "PAT-3921",
        age: 45,
        gender: "Male",
        conditions: ["High Cholesterol"],
        accessLevel: "View Only",
        records: 156,
        lastAccessed: "Dec 6",
        expires: "2025-02-20",
        sharedDate: "11/19/2024",
    },
    {
        name: "Emily Rodriguez",
        id: "PAT-4103",
        age: 38,
        gender: "Female",
        conditions: ["Asthma"],
        accessLevel: "Full Access",
        records: 89,
        lastAccessed: "Nov 29",
        expires: "Ongoing",
        sharedDate: "9/14/2024",
    },
];

function getPhysicianHealthId() {
    try {
        const raw = localStorage.getItem("user");
        if (!raw) return "";
        const u = JSON.parse(raw);
        return u.health_id || "";
    } catch {
        return "";
    }
}

function PhysicianSharedAccess() {
    const [search, setSearch] = useState("");
    const [copied, setCopied] = useState(false);
    const phyId = getPhysicianHealthId();

    const filteredPatients = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return patientsWithAccess;
        return patientsWithAccess.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.id.toLowerCase().includes(q)
        );
    }, [search]);

    const handleCopyId = () => {
        if (!phyId) return;
        navigator.clipboard.writeText(phyId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const stats = [
        { label: "Total Shared Access", value: 4 },
        { label: "Active Access", value: 2 },
        { label: "Pending Requests", value: 1 },
    ];

    const totalCount = patientsWithAccess.length;

    return (
        <div className="phd-sa-wrap">
            {/* Patient Data Access — matches ShareData / Figma green info card */}
            <div className="phd-sa-access-banner">
                <div className="phd-sa-access-banner-inner">
                    <div className="phd-sa-access-icon">
                        <Share2 size={22} />
                    </div>
                    <div className="phd-sa-access-text">
                        <p className="phd-sa-access-title">Patient Data Access</p>
                        <p className="phd-sa-access-body">
                            View and manage patient records that have been shared with you securely.
                        </p>
                        <div className="phd-sa-phy-id-row">
                            <div className="phd-sa-phy-id-box">
                                <p className="phd-sa-phy-id-label">Your Physician ID</p>
                                <p className="phd-sa-phy-id-value">{phyId || "—"}</p>
                            </div>
                            <button
                                type="button"
                                className="phd-sa-copy-btn"
                                onClick={handleCopyId}
                                disabled={!phyId}
                                aria-label="Copy physician ID"
                            >
                                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                        <p className="phd-sa-access-hint">
                            Share this ID with patients so they can grant you access to their records
                        </p>
                    </div>
                </div>
            </div>

            {/* Pending Access Requests */}
            <div className="phd-card phd-sa-pending-section">
                <h2 className="phd-sa-pending-heading">Pending Access Requests</h2>
                <div className="phd-sa-pending-list">
                    {pendingRequests.map((r) => (
                        <div key={r.id} className="phd-sa-pending-item">
                            <div className="phd-sa-pending-top">
                                <div>
                                    <p className="phd-sa-pending-name">{r.patient}</p>
                                    <p className="phd-sa-pending-id">{r.healthId}</p>
                                </div>
                                <span className="phd-sa-pending-badge">Pending</span>
                            </div>
                            <p className="phd-sa-pending-detail">{r.detail}</p>
                            <p className="phd-sa-pending-date">Requested {r.requested}</p>
                            <div className="phd-sa-pending-actions">
                                <button type="button" className="phd-sa-btn-approve">
                                    Approve Request
                                </button>
                                <button type="button" className="phd-sa-btn-decline">
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search — same pattern as My Patients */}
            <div className="mp-search-row">
                <div className="mp-search-wrap">
                    <Search size={16} className="mp-search-icon" />
                    <input
                        className="mp-search"
                        type="text"
                        placeholder="Search patients by name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Summary stats — same cards as My Patients list stats */}
            <div className="mp-stats">
                {stats.map((s) => (
                    <div className="mp-stat" key={s.label}>
                        <span className="mp-stat-label">{s.label}</span>
                        <span className="mp-stat-value">{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Patients who have shared access */}
            <div className="phd-card phd-sa-list-outer">
                <h2 className="phd-sa-list-title">Patients Who Have Shared Access</h2>
                <p className="phd-sa-list-sub">
                    {totalCount} patients have granted you access to their medical records
                </p>
                <div className="phd-sa-patient-stack">
                    {filteredPatients.length === 0 ? (
                        <p className="phd-sa-empty">No patients match your search.</p>
                    ) : (
                        filteredPatients.map((p) => (
                            <div key={p.id} className="phd-sa-patient-card">
                                <div className="phd-sa-patient-top">
                                    <div className="phd-sa-avatar">
                                        <User size={18} />
                                    </div>
                                    <div className="phd-sa-patient-info">
                                        <p className="phd-sa-patient-name">{p.name}</p>
                                        <p className="phd-sa-patient-id">ID: {p.id}</p>
                                        <p className="phd-sa-patient-demo">
                                            {p.age} years • {p.gender}
                                        </p>
                                        <div className="phd-sa-tags">
                                            {p.conditions.map((c) => (
                                                <span key={c} className="phd-sa-tag">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button type="button" className="phd-sa-view-btn">
                                        <Eye size={18} />
                                        View Records
                                    </button>
                                </div>
                                <div className="phd-sa-detail-grid">
                                    <div className="phd-sa-detail-cell">
                                        <span className="phd-sa-detail-label">Access Level</span>
                                        <span className="phd-sa-detail-value">{p.accessLevel}</span>
                                    </div>
                                    <div className="phd-sa-detail-cell">
                                        <span className="phd-sa-detail-label">Records</span>
                                        <span className="phd-sa-detail-value">{p.records}</span>
                                    </div>
                                    <div className="phd-sa-detail-cell">
                                        <span className="phd-sa-detail-label">Last Accessed</span>
                                        <span className="phd-sa-detail-value">{p.lastAccessed}</span>
                                    </div>
                                    <div className="phd-sa-detail-cell">
                                        <span className="phd-sa-detail-label">Expires</span>
                                        <span className="phd-sa-detail-value">{p.expires}</span>
                                    </div>
                                </div>
                                <div className="phd-sa-card-footer">
                                    <span className="phd-sa-footer-shared">
                                        <Clock size={14} className="phd-sa-footer-clock" />
                                        Shared {p.sharedDate}
                                    </span>
                                    <button type="button" className="phd-sa-log-link">
                                        View Access Log
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="phd-sa-compliance">
                <LockKeyhole size={20} className="phd-sa-compliance-icon" />
                <div>
                    <p className="phd-sa-compliance-title">Secure Access &amp; Compliance</p>
                    <p className="phd-sa-compliance-body">
                        All patient data access is logged and encrypted. Only access records when medically necessary.
                        Patients can revoke your access at any time. All access complies with HIPAA regulations.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PhysicianSharedAccess;
