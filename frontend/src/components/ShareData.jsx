import "./ShareData.css";
import { useState } from "react";
import {
    Share2, UserPlus, Copy, Globe, LockKeyhole,
    Clock, CheckCircle, Shield, ChevronRight
} from "lucide-react";

// TODO: Replace with GET /api/patient/sharing

const activeShares = [
    {
        name: "Dr. Emily Martinez",
        id: "PHY-1847",
        role: "Primary Care Physician",
        status: "active",
        accessLevel: "Full Access",
        expires: "Ongoing",
        sharedDate: "1/14/2024",
    },
    {
        name: "Dr. James Chen",
        id: "PHY-2934",
        role: "Cardiologist",
        status: "active",
        accessLevel: "Cardiology Records Only",
        expires: "2025-03-20",
        sharedDate: "9/19/2024",
    },
    {
        name: "City General Hospital",
        id: "FAC-5012",
        role: "Healthcare Facility",
        status: "active",
        accessLevel: "Emergency Access",
        expires: "Ongoing",
        sharedDate: "1/14/2024",
    },
];

const sharedWithMe = [
    {
        name: "Michael Chen",
        id: "PAT-8472",
        accessLevel: "View Only",
        records: 156,
        lastAccessed: "Dec 4",
        sharedDate: "11/19/2024",
    },
    {
        name: "Jennifer Lee",
        id: "PAT-3921",
        accessLevel: "Full Access",
        records: 89,
        lastAccessed: "Nov 29",
        sharedDate: "10/14/2024",
    },
];

const recentActivity = [
    {
        title: "Shared full medical history",
        meta: "Dr. Martinez (PHY-1847) · 11/30/2024 · 247 records",
    },
    {
        title: "Shared lab results",
        meta: "LabCorp Portal (FAC-7821) · 11/27/2024 · 5 records",
    },
    {
        title: "Revoked access",
        meta: "Dr. Sarah Williams (PHY-4156) · 10/14/2024",
    },
];

function ShareData() {
    const [activeSubTab, setActiveSubTab] = useState("my");
    const [copied, setCopied] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const healthId = user ? user.health_id : "";
    
    const handleCopy = () => {
        navigator.clipboard.writeText(healthId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="sd-wrap">

            {/* Secure Data Sharing Banner */}
            <div className="sd-banner">
                <div className="sd-banner-left">
                    <div className="sd-banner-icon"><Share2 size={25} /></div>
                    <div>
                        <p className="sd-banner-title">Secure Data Sharing</p>
                        <p className="sd-banner-body">Control who can access your medical records. Share with doctors worldwide instantly and securely.</p>
                        <div className="sd-health-id-row">
                            <div className="sd-health-id-box">
                                <p className="sd-health-id-label">Your Health ID</p>
                                <p className="sd-health-id-value">{healthId}</p>
                            </div>
                            <button className="sd-copy-btn" onClick={handleCopy}>
                                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
                <button className="sd-share-btn">
                    <UserPlus size={15} /> Share Access
                </button>
            </div>

            {/* Sub-tabs */}
            <div className="sd-subtabs">
                <button
                    className={`sd-subtab ${activeSubTab === "my" ? "sd-subtab-active" : ""}`}
                    onClick={() => setActiveSubTab("my")}
                >
                    My Sharing
                </button>
                <button
                    className={`sd-subtab ${activeSubTab === "shared" ? "sd-subtab-active" : ""}`}
                    onClick={() => setActiveSubTab("shared")}
                >
                    Shared With Me
                </button>
            </div>

            {activeSubTab === "my" && (
                <>
                    {/* Active Shared Access */}
                    <div className="sd-card">
                        <h2 className="sd-section-title">Active Shared Access</h2>
                        <p className="sd-section-sub">Healthcare providers and facilities you've granted access to</p>
                        <div className="sd-shares">
                            {activeShares.map((s, i) => (
                                <div key={i} className="sd-share-item">
                                    <div className="sd-share-header">
                                        <div className="sd-share-name-row">
                                            <p className="sd-share-name">{s.name}</p>
                                            <span className="sd-active-badge">
                                                <CheckCircle size={11} /> active
                                            </span>
                                        </div>
                                        <button className="sd-revoke-btn">Revoke</button>
                                    </div>
                                    <p className="sd-share-id">ID: {s.id}</p>
                                    <p className="sd-share-role">{s.role}</p>
                                    <div className="sd-share-meta">
                                        <div>
                                            <p className="sd-meta-label">Access Level</p>
                                            <p className="sd-meta-value">{s.accessLevel}</p>
                                        </div>
                                        <div>
                                            <p className="sd-meta-label">Expires</p>
                                            <p className="sd-meta-value">{s.expires}</p>
                                        </div>
                                    </div>
                                    <div className="sd-share-footer">
                                        <Clock size={13} className="sd-gray-icon" />
                                        <span className="sd-shared-date">Shared {s.sharedDate}</span>
                                        <button className="sd-activity-btn">View Activity Log</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Share Options */}
                    <div className="sd-card">
                        <h2 className="sd-section-title">Quick Share Options</h2>
                        <div className="sd-quick-grid">
                            <button className="sd-quick-btn">
                                <Globe size={22} className="sd-blue-icon" />
                                <p className="sd-quick-title">Generate Shareable Link</p>
                                <p className="sd-quick-sub">Create a secure, time-limited link to share specific records</p>
                            </button>
                            <button className="sd-quick-btn">
                                <LockKeyhole size={22} className="sd-blue-icon" />
                                <p className="sd-quick-title">Emergency Access Code</p>
                                <p className="sd-quick-sub">Generate one-time code for emergency medical situations</p>
                            </button>
                        </div>
                    </div>

                    {/* Recent Sharing Activity */}
                    <div className="sd-card">
                        <h2 className="sd-section-title">Recent Sharing Activity</h2>
                        <div className="sd-activity-list">
                            {recentActivity.map((a, i) => (
                                <div key={i} className="sd-activity-item">
                                    <div className="sd-activity-icon">
                                        <Share2 size={16} />
                                    </div>
                                    <div>
                                        <p className="sd-activity-title">{a.title}</p>
                                        <p className="sd-activity-meta">{a.meta}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="sd-privacy">
                        <LockKeyhole size={18} className="sd-blue-icon" />
                        <div>
                            <p className="sd-privacy-title">Privacy-First Sharing</p>
                            <p className="sd-privacy-body">All sharing uses unique Health IDs instead of email addresses to protect your privacy. Data sharing is encrypted end-to-end. You maintain full control and can revoke access at any time.</p>
                        </div>
                    </div>
                </>
            )}

            {activeSubTab === "shared" && (
                <>
                    <div className="sd-card">
                        <h2 className="sd-section-title">Shared With Me</h2>
                        <p className="sd-section-sub">Patients who have shared their health records with you</p>
                        <div className="sd-shares">
                            {sharedWithMe.map((s, i) => (
                                <div key={i} className="sd-share-item">
                                    <div className="sd-share-header">
                                        <div>
                                            <p className="sd-share-name">{s.name}</p>
                                            <p className="sd-share-id">ID: {s.id}</p>
                                        </div>
                                        <button className="sd-view-btn">View Records</button>
                                    </div>
                                    <div className="sd-shared-with-meta">
                                        <div>
                                            <p className="sd-meta-label">Access Level</p>
                                            <p className="sd-meta-value">{s.accessLevel}</p>
                                        </div>
                                        <div>
                                            <p className="sd-meta-label">Records</p>
                                            <p className="sd-meta-value">{s.records}</p>
                                        </div>
                                        <div>
                                            <p className="sd-meta-label">Last Accessed</p>
                                            <p className="sd-meta-value">{s.lastAccessed}</p>
                                        </div>
                                    </div>
                                    <div className="sd-share-footer">
                                        <Clock size={13} className="sd-gray-icon" />
                                        <span className="sd-shared-date">Shared with you on {s.sharedDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sd-privacy">
                        <LockKeyhole size={18} className="sd-blue-icon" />
                        <div>
                            <p className="sd-privacy-title">Privacy-First Sharing</p>
                            <p className="sd-privacy-body">All sharing uses unique Health IDs instead of email addresses to protect your privacy. Data sharing is encrypted end-to-end. You maintain full control and can revoke access at any time.</p>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}

export default ShareData;
