import "./PhysicianDashboard.css";
import { useState, useEffect } from "react";
import {
    Shield, Users, Calendar, FileText, Share2,
    LogOut, AlertCircle, Sparkles, Activity,
    Brain, TrendingUp, Clock, CheckCircle,
    CreditCard, User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MyPatients from "./MyPatients";

// ── Mock Data ─────────────────────────────────────────────────────────────────

// TODO: Replace with GET /api/physician/alerts
const priorityAlerts = [
    {
        id: 1,
        patient: "Sarah Johnson",
        message: "Lab results available for review",
        time: "2 hours ago",
        urgent: false,
    },
    {
        id: 2,
        patient: "Robert Martinez",
        message: "Medication refill request pending",
        time: "4 hours ago",
        urgent: false,
    },
    {
        id: 3,
        patient: "Jennifer Lee",
        message: "Critical lab value: Potassium 5.8 mEq/L",
        time: "1 day ago",
        urgent: true,
    },
];

// TODO: Replace with GET /api/physician/schedule/today
const todaySchedule = [
    { id: 1, time: "9:00 AM",  duration: 30, patient: "Sarah Johnson",   reason: "Follow-up",       status: "confirmed" },
    { id: 2, time: "10:00 AM", duration: 45, patient: "Michael Chen",    reason: "Annual Physical", status: "confirmed" },
    { id: 3, time: "11:00 AM", duration: 60, patient: "Emily Rodriguez", reason: "New Patient",     status: "pending"   },
    { id: 4, time: "2:00 PM",  duration: 30, patient: "David Thompson",  reason: "Consultation",    status: "confirmed" },
];

// TODO: Replace with GET /api/physician/activity
const recentActivity = [
    {
        id: 1,
        icon: "file",
        iconBg: "blue",
        title: "New lab results uploaded for Sarah Johnson",
        time: "2 hours ago",
        sub: "CBC Panel",
    },
    {
        id: 2,
        icon: "activity",
        iconBg: "green",
        title: "Michael Chen uploaded vital signs data",
        time: "5 hours ago",
        sub: "BP: 128/82, HR: 72",
    },
    {
        id: 3,
        icon: "clock",
        iconBg: "purple",
        title: "Emily Rodriguez granted you access to medical records",
        time: "1 day ago",
        sub: "Full access granted",
    },
];

// TODO: Replace with real weekly volume data
const weeklyVolume = [
    { day: "Mon", count: 12 },
    { day: "Tue", count: 15 },
    { day: "Wed", count: 18 },
    { day: "Thu", count: 14 },
    { day: "Fri", count: 16 },
];

const navTabs = [
    { label: "Dashboard",         icon: <Activity   size={15} /> },
    { label: "My Patients",       icon: <Users      size={15} /> },
    { label: "Shared Access",     icon: <Share2     size={15} /> },
    { label: "AI Clinical Tools", icon: <Brain      size={15} /> },
    { label: "Schedule",          icon: <Calendar   size={15} /> },
    { label: "Insurance",         icon: <CreditCard size={15} /> },
];

// ── Weekly Volume Bar Chart ───────────────────────────────────────────────────
function VolumeChart({ data }) {
    const max = Math.max(...data.map(d => d.count));
    const W = 500, H = 280;
    const padL = 34, padR = 10, padT = 30, padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const barW = chartW / data.length * 0.5;
    const gap  = chartW / data.length;
    const yTicks = [0, 5, 10, 15, 20];

    const xCenter = (i) => padL + i * gap + gap / 2;
    const barH    = (v) => (v / max) * chartH;
    const barY    = (v) => padT + chartH - barH(v);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: "visible" }}>
            {yTicks.map(t => (
                <g key={t}>
                    <line
                        x1={padL} x2={W - padR}
                        y1={padT + chartH - (t / max) * chartH}
                        y2={padT + chartH - (t / max) * chartH}
                        stroke="rgb(230,235,245)" strokeDasharray="4 3" strokeWidth={1}
                    />
                    <text
                        x={padL - 6}
                        y={padT + chartH - (t / max) * chartH + 4}
                        textAnchor="end" fontSize={11} fill="rgb(160,168,185)"
                    >{t}</text>
                </g>
            ))}
            {data.map((d, i) => (
                <g key={i}>
                    <rect
                        x={xCenter(i) - barW / 2}
                        y={barY(d.count)}
                        width={barW}
                        height={barH(d.count)}
                        rx={4}
                        fill="rgb(0, 160, 60)"
                        opacity={0.85}
                    />
                    <text
                        x={xCenter(i)} y={H - 4}
                        textAnchor="middle" fontSize={11} fill="rgb(160,168,185)"
                    >{d.day}</text>
                </g>
            ))}
        </svg>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
function PhysicianDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3001/patient/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.user);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    return (
        <div className="phd-page">

            {/* Header */}
            <header className="phd-header">
                <div className="phd-header-left">
                    <div className="phd-header-logo"><Shield size={20} /></div>
                    <div>
                        <p className="phd-header-brand">HealthUnity</p>
                        <p className="phd-header-portal">Physician Portal</p>
                    </div>
                </div>
                <div className="phd-header-right">
                    <div className="phd-header-userinfo">
                        <p className="phd-header-name">
                            {user ? `Dr. ${user.first_name} ${user.last_name}` : "Loading..."}
                        </p>
                        <p className="phd-header-id">ID: {user ? user.health_id : ""}</p>
                    </div>
                    <div className="phd-header-avatar">
                        {user ? `${user.first_name[0]}${user.last_name[0]}` : ""}
                    </div>
                    <button className="phd-header-logout" onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/");
                    }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {/* Body */}
            <div className="phd-body">

                {/* Nav */}
                <nav className="phd-nav">
                    <div className="phd-nav-inner">
                        {navTabs.map(tab => (
                            <button
                                key={tab.label}
                                className={`phd-nav-tab ${activeTab === tab.label ? "phd-nav-tab-active" : ""}`}
                                onClick={() => setActiveTab(tab.label)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {activeTab === "Dashboard" && <>

                {/* Stat Cards */}
                <div className="phd-stat-grid">
                    <div className="phd-stat-card">
                        <div className="phd-stat-top">
                            <Calendar size={22} color="rgb(0, 160, 60)" />
                            <span className="phd-stat-label">Today</span>
                        </div>
                        <p className="phd-stat-value">12</p>
                        <p className="phd-stat-sub">Scheduled appointments</p>
                    </div>
                    <div className="phd-stat-card">
                        <div className="phd-stat-top">
                            <Users size={22} color="rgb(0, 87, 235)" />
                            <span className="phd-stat-label">Active</span>
                        </div>
                        <p className="phd-stat-value">234</p>
                        <p className="phd-stat-sub">Total patients</p>
                    </div>
                    <div className="phd-stat-card">
                        <div className="phd-stat-top">
                            <AlertCircle size={22} color="rgb(220, 100, 0)" />
                            <span className="phd-stat-label">Pending</span>
                        </div>
                        <p className="phd-stat-value">8</p>
                        <p className="phd-stat-sub">Action items</p>
                    </div>
                    <div className="phd-stat-card">
                        <div className="phd-stat-top">
                            <FileText size={22} color="rgb(120, 60, 220)" />
                            <span className="phd-stat-label">To Review</span>
                        </div>
                        <p className="phd-stat-value">15</p>
                        <p className="phd-stat-sub">Lab results</p>
                    </div>
                </div>

                {/* Priority Alerts */}
                <div className="phd-card">
                    <div className="phd-card-title-row">
                        <AlertCircle size={17} color="rgb(220, 100, 0)" />
                        <h2 className="phd-card-title">Priority Alerts</h2>
                    </div>
                    <div className="phd-alerts-list">
                        {priorityAlerts.map(alert => (
                            <div key={alert.id} className={`phd-alert-item ${alert.urgent ? "phd-alert-urgent" : "phd-alert-normal"}`}>
                                <div className="phd-alert-body">
                                    <div className="phd-alert-name-row">
                                        <span className="phd-alert-patient">{alert.patient}</span>
                                        {alert.urgent && <span className="phd-alert-badge">URGENT</span>}
                                    </div>
                                    <p className="phd-alert-message">{alert.message}</p>
                                    <p className="phd-alert-time">{alert.time}</p>
                                </div>
                                <button className="phd-alert-review">Review</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="phd-bottom-grid">

                    {/* Today's Schedule */}
                    <div className="phd-card">
                        <div className="phd-card-title-row">
                            <Calendar size={17} color="rgb(0, 160, 60)" />
                            <h2 className="phd-card-title">Today's Schedule</h2>
                            <span className="phd-today-date">{today}</span>
                        </div>
                        <div className="phd-schedule-list">
                            {todaySchedule.map(appt => (
                                <div key={appt.id} className="phd-schedule-item">
                                    <div className="phd-schedule-time">
                                        <span className="phd-schedule-hour">{appt.time}</span>
                                        <span className="phd-schedule-dur">{appt.duration} min</span>
                                    </div>
                                    <div className="phd-schedule-info">
                                        <span className="phd-schedule-patient">{appt.patient}</span>
                                        <span className="phd-schedule-reason">{appt.reason}</span>
                                    </div>
                                    <span className={`phd-schedule-status phd-status-${appt.status}`}>
                                        {appt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Volume */}
                    <div className="phd-card">
                        <div className="phd-card-title-row">
                            <TrendingUp size={17} color="rgb(0, 160, 60)" />
                            <h2 className="phd-card-title">Weekly Patient Volume</h2>
                        </div>
                        <VolumeChart data={weeklyVolume} />
                    </div>

                </div>

                {/* Recent Patient Updates */}
                <div className="phd-card">
                    <div className="phd-card-title-row">
                        <Activity size={17} color="rgb(0, 87, 235)" />
                        <h2 className="phd-card-title">Recent Patient Updates</h2>
                    </div>
                    <div className="phd-activity-list">
                        {recentActivity.map(a => (
                            <div key={a.id} className="phd-activity-item">
                                <div className={`phd-activity-icon phd-activity-icon-${a.iconBg}`}>
                                    {a.icon === "file"     && <FileText size={18} />}
                                    {a.icon === "activity" && <Activity size={18} />}
                                    {a.icon === "clock"    && <Clock    size={18} />}
                                </div>
                                <div>
                                    <p className="phd-activity-title">{a.title}</p>
                                    <p className="phd-activity-time">{a.time} · {a.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                </>}

                {activeTab === "My Patients" && <MyPatients />}

                {activeTab !== "Dashboard" && activeTab !== "My Patients" && (
                    <div className="phd-coming-soon">
                        <Sparkles size={32} color="rgb(0, 160, 60)" />
                        <h2>Coming Soon</h2>
                        <p>This section is under construction.</p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default PhysicianDashboard;
