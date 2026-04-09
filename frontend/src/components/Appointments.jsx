import "./Appointments.css";
import { useState } from "react";
import {
    Calendar, CheckCircle, TrendingUp, Users,
    Sparkles, Clock, MapPin, User, Video,
    FlaskConical, Stethoscope, ChevronRight,
    Plus, Filter, AlertTriangle, Activity, Brain, FileText
} from "lucide-react";

// TODO: Replace with GET /api/patient/appointments AI data
const aiRecommendations = [
    {
        id: 1,
        title: "Preventive Care Due",
        priority: "medium",
        text: "Dental checkup is overdue by 3 months. Consider scheduling with your dentist.",
    },
    {
        id: 2,
        title: "Specialist Referral Available",
        priority: "low",
        text: "Dr. Martinez mentioned genetic counseling in your last visit. Would you like to schedule?",
    },
    {
        id: 3,
        title: "Immunization Update",
        priority: "high",
        text: "Annual flu vaccine recommended. Book appointment at any HealthUnity facility.",
    },
];

// TODO: Replace with GET /api/patient/appointments care team data
const careTeam = [
    {
        id: 1,
        name: "Dr. Elena Martinez",
        specialty: "Primary Care",
        physicianId: "PHY-4892",
        lastVisit: "Nov 10",
        nextVisit: "Dec 15",
        color: "blue",
    },
    {
        id: 2,
        name: "Dr. James Chen",
        specialty: "Cardiology",
        physicianId: "PHY-3421",
        lastVisit: "Jul 14",
        nextVisit: "Dec 20",
        color: "red",
    },
    {
        id: 3,
        name: "Dr. Sarah Williams",
        specialty: "Endocrinology",
        physicianId: "PHY-5634",
        lastVisit: null,
        nextVisit: "Jan 22",
        color: "green",
    },
];

const typeConfig = {
    "in-person":  { label: "In-Person",  icon: <Stethoscope size={13} />, className: "ap-type-inperson" },
    "telehealth": { label: "Telehealth", icon: <Video        size={13} />, className: "ap-type-telehealth" },
    "lab-work":   { label: "Lab Work",   icon: <FlaskConical size={13} />, className: "ap-type-lab" },
};

const statusConfig = {
    confirmed: { label: "Confirmed", className: "ap-status-confirmed" },
    pending:   { label: "Pending",   className: "ap-status-pending" },
    completed: { label: "Completed", className: "ap-status-completed" },
};

const priorityConfig = {
    high:   { className: "ap-priority-high",   label: "HIGH" },
    medium: { className: "ap-priority-medium", label: "MEDIUM" },
    low:    { className: "ap-priority-low",    label: "LOW" },
};

function AppointmentCard({ appt, expandedId, setExpandedId }) {
    const type = typeConfig[appt.appointment_type] || typeConfig["in-person"];
    const status   = statusConfig[appt.status] || statusConfig["pending"];
    const isExpanded = expandedId === appt.id;
    const isPast     = appt.status === "completed";

    return (
        <div className="ap-card" onClick={() => setExpandedId(isExpanded ? null : appt.id)}>
            <div className="ap-card-left">
                <div className="ap-date-badge">
                    <span className="ap-date-month">
                        {new Date(appt.appointment_date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="ap-date-day">
                        {new Date(appt.appointment_date).getDate()}
                    </span>
                </div>
            </div>
            <div className="ap-card-body">
                <div className="ap-card-title-row">
                    <h3 className="ap-card-title">{appt.reason}</h3>
                    <ChevronRight
                        size={18}
                        className="ap-card-chevron"
                        style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
                    />
                </div>
                <div className="ap-card-tags">
                    <span className={`ap-type-tag ${type.className}`}>
                        {type.icon} {type.label}
                    </span>
                    <span className={`ap-status-tag ${status.className}`}>
                        {status.label}
                    </span>
                </div>
                <div className="ap-card-details">
                    <span className="ap-detail">
                        <Clock size={13} /> {new Date(appt.appointment_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                    <span className="ap-detail">
                        <User size={13} /> Physician ID: {appt.physician_health_id}
                    </span>
                    {appt.facility && (
                        <span className="ap-detail">
                            <MapPin size={13} /> {appt.facility}
                        </span>
                    )}
                    {appt.appointment_type === "telehealth" && !appt.facility && (
                        <span className="ap-detail">
                            <Video size={13} /> Video Call
                        </span>
                    )}
                </div>
                {appt.ai && !isPast && (
                    <div className="ap-card-ai">
                        <Sparkles size={13} />
                        <span>{appt.ai}</span>
                    </div>
                )}

                {isPast && appt.notes && (
                    <div className="ap-past-notes">
                        <FileText size={13} />
                        <span>{appt.notes}</span>
                    </div>
                )}

                {/* Expanded Section */}
                {isExpanded && (
                    <div className="ap-expanded" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-expanded-actions">
                            {!isPast ? <>
                                <button className="ap-exp-btn-primary">Get Directions</button>
                                <button className="ap-exp-btn-secondary">Reschedule</button>
                                <button className="ap-exp-btn-cancel">Cancel</button>
                            </> : <>
                                <button className="ap-exp-btn-primary">View Full Notes</button>
                                <button className="ap-exp-btn-secondary">Schedule Follow-up</button>
                                <button className="ap-exp-btn-secondary">Download Summary</button>
                            </>}
                        </div>
                        {!isPast && (
                            <p className="ap-prep-tips">
                                <strong>Preparation Tips:</strong> Bring your insurance card, photo ID, and list of current medications. Arrive 10 minutes early for check-in.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function Appointments({ appointments }) {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [expandedId, setExpandedId] = useState(null);

    const upcoming = appointments.filter(a => a.status !== "completed");
    const past = appointments.filter(a => a.status === "completed");
    const displayed = activeTab === "upcoming" ? upcoming : past;

    return (
        <div className="ap-wrap">

            {/* AI Banner */}
            <div className="ap-ai-banner">
                <div className="ap-ai-icon">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="ap-ai-title">AI Appointment Intelligence</h3>
                    {/* TODO: Replace with real AI summary */}
                    <p className="ap-ai-text">
                        You have 4 upcoming appointments in the next 6 weeks. All preventive care is on schedule
                        except dental checkup. AI has identified 3 recommendations to optimize your care coordination.
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="ap-stats">
                <div className="ap-stat-card">
                    <div className="ap-stat-top">
                        <Calendar size={18} className="ap-stat-icon ap-stat-icon-blue" />
                        <span className="ap-stat-label">Upcoming</span>
                    </div>
                    {/* TODO: Replace with real count */}
                    <span className="ap-stat-value">{appointments.filter(a => a.status !== "completed").length}</span>
                    <span className="ap-stat-sub">Next 6 weeks</span>
                </div>
                <div className="ap-stat-card">
                    <div className="ap-stat-top">
                        <CheckCircle size={18} className="ap-stat-icon ap-stat-icon-green" />
                        <span className="ap-stat-label">Completed</span>
                    </div>
                    {/* TODO: Replace with real count */}
                    <span className="ap-stat-value">{appointments.filter(a => a.status === "completed").length}</span>
                    <span className="ap-stat-sub">Last 6 months</span>
                </div>
                <div className="ap-stat-card">
                    <div className="ap-stat-top">
                        <TrendingUp size={18} className="ap-stat-icon ap-stat-icon-purple" />
                        <span className="ap-stat-label">Adherence</span>
                    </div>
                    {/* TODO: Replace with real rate */}
                    <span className="ap-stat-value">96%</span>
                    <span className="ap-stat-sub">Show-up rate</span>
                </div>
                <div className="ap-stat-card">
                    <div className="ap-stat-top">
                        <Users size={18} className="ap-stat-icon ap-stat-icon-orange" />
                        <span className="ap-stat-label">Providers</span>
                    </div>
                    {/* TODO: Replace with real count */}
                    <span className="ap-stat-value">6</span>
                    <span className="ap-stat-sub">Active care team</span>
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="ap-section">
                <div className="ap-section-header">
                    <Sparkles size={16} className="ap-section-icon" />
                    <h2 className="ap-section-title">AI Care Scheduling Recommendations</h2>
                </div>
                <div className="ap-recommendations">
                    {/* TODO: Replace with real AI recommendations */}
                    {aiRecommendations.map((rec) => {
                        const priority = priorityConfig[rec.priority];
                        return (
                            <div key={rec.id} className={`ap-rec-card ap-rec-${rec.priority}`}>
                                <div className="ap-rec-body">
                                    <div className="ap-rec-title-row">
                                        <span className="ap-rec-title">{rec.title}</span>
                                        <span className={`ap-priority-badge ${priority.className}`}>
                                            {priority.label}
                                        </span>
                                    </div>
                                    <p className="ap-rec-text">{rec.text}</p>
                                </div>
                                <button className="ap-rec-btn">Schedule</button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Appointments List */}
            <div className="ap-section">
                <div className="ap-list-header">
                    <div className="ap-subtabs">
                        <button
                            className={`ap-subtab ${activeTab === "upcoming" ? "ap-subtab-active" : ""}`}
                            onClick={() => setActiveTab("upcoming")}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`ap-subtab ${activeTab === "past" ? "ap-subtab-active" : ""}`}
                            onClick={() => setActiveTab("past")}
                        >
                            Past
                        </button>
                    </div>
                    <div className="ap-list-actions">
                        <button className="ap-filter-btn">
                            <Filter size={14} /> All Types
                        </button>
                        <button className="ap-book-btn">
                            <Plus size={14} /> Book Appointment
                        </button>
                    </div>
                </div>

                <div className="ap-list">
                    {displayed.length === 0 && (
                        <div className="ap-empty">No appointments found.</div>
                    )}
                    {displayed.map((appt) => (
                        <AppointmentCard
                            key={appt.id}
                            appt={appt}
                            expandedId={expandedId}
                            setExpandedId={setExpandedId}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Row: AI Care Pattern Analysis + Care Team */}
            <div className="ap-bottom-row">

                {/* AI Care Pattern Analysis */}
                <div className="ap-pattern-card">
                    <div className="ap-section-header">
                        <Activity size={16} className="ap-section-icon" />
                        <h2 className="ap-section-title">AI Care Pattern Analysis</h2>
                    </div>
                    {/* TODO: Replace with real AI care pattern data */}
                    <div className="ap-patterns">
                        {[
                            { label: "Preventive Care Compliance", rating: "Excellent", color: "green", pct: 90, sub: "All major screenings completed on time" },
                            { label: "Chronic Care Management",    rating: "On Track",  color: "green", pct: 80, sub: "Regular follow-ups with cardiology & endocrinology" },
                            { label: "Specialist Coordination",    rating: "Good",      color: "blue",  pct: 65, sub: "4 specialists collaborating on your care" },
                        ].map((item, i) => (
                            <div key={i} className="ap-pattern-item">
                                <div className="ap-pattern-top">
                                    <span className="ap-pattern-label">{item.label}</span>
                                    <span className={`ap-pattern-rating ap-rating-${item.color}`}>{item.rating}</span>
                                </div>
                                <div className="ap-progress-track">
                                    <div
                                        className={`ap-progress-fill ap-progress-${item.color}`}
                                        style={{ width: `${item.pct}%` }}
                                    />
                                </div>
                                <span className="ap-pattern-sub">{item.sub}</span>
                            </div>
                        ))}
                    </div>
                    <div className="ap-pattern-insight">
                        <Sparkles size={13} />
                        <span>
                            Your appointment adherence rate is in the top 10% of patients. This consistency
                            helps providers deliver better preventive care and early intervention.
                        </span>
                    </div>
                </div>

                {/* Care Team */}
                <div className="ap-careteam-card">
                    <div className="ap-section-header">
                        <User size={16} className="ap-section-icon" />
                        <h2 className="ap-section-title">Your Care Team</h2>
                    </div>
                    {/* TODO: Replace with real care team data */}
                    <div className="ap-careteam-list">
                        {careTeam.map((doc) => (
                            <div key={doc.id} className="ap-doctor-card">
                                <div className={`ap-doctor-avatar ap-avatar-${doc.color}`}>
                                    <User size={16} />
                                </div>
                                <div className="ap-doctor-info">
                                    <div className="ap-doctor-name-row">
                                        <span className="ap-doctor-name">{doc.name}</span>
                                        <span className="ap-doctor-id">{doc.physicianId}</span>
                                    </div>
                                    <span className="ap-doctor-specialty">{doc.specialty}</span>
                                    <span className="ap-doctor-visits">
                                        {doc.lastVisit && `Last visit: ${doc.lastVisit} · `}
                                        {doc.nextVisit && `Next: ${doc.nextVisit}`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="ap-viewall-btn">View All Providers (6)</button>
                    <div className="ap-careteam-ai">
                        <Sparkles size={13} />
                        <span>AI ensures all your providers have access to shared records via the HealthUnity ID system. Care coordination score: 94/100.</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Appointments;
