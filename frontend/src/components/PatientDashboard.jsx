import "./PatientDashboard.css";
import { useState, useEffect } from "react";
import {
    Shield, FileText, Pill, FlaskConical, Calendar,
    Dna, CreditCard, Share2, Upload, LogOut,
    AlertCircle, CheckCircle, Sparkles, Activity,
    Brain, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MedicalRecords from "./MedicalRecords";
import Genomics from "./Genomics";
import Insurance from "./Insurance";
import ShareData from "./ShareData";

// ── Mock Data (swap these out when your AI API is ready) ──────────────────────

const patient = {
    name: "Sarah Johnson",
    id: "HU-2847",
    initials: "SJ",
};

// TODO: Replace with GET /api/ai/summary
const aiSummary =
    "Good morning, Sarah! Your health metrics are stable with blood pressure averaging 118/76 mmHg. You have 1 important alert requiring attention and 3 AI-powered recommendations to optimize your health today.";

// TODO: Replace with GET /api/ai/safety-alerts
const aiSafetyAlert = {
    message:
        "Potential interaction detected between Lisinopril and Ibuprofen. Consider consulting your doctor about alternative pain relief options.",
};

// TODO: Replace with GET /api/ai/recommendations
const aiRecommendations = [
    {
        color: "green",
        icon: <CheckCircle size={18} />,
        title: "Medication Adherence",
        body: "Excellent adherence streak! You've taken all medications on time for 12 consecutive days.",
    },
    {
        color: "blue",
        icon: <FlaskConical size={18} />,
        title: "Upcoming Lab Work",
        body: "Your quarterly lab tests are due in 2 weeks. AI suggests scheduling now to maintain continuity.",
    },
    {
        color: "yellow",
        icon: <Sparkles size={18} />,
        title: "Genomic Alert",
        body: "Based on your APOE ε4 status, consider cognitive screening in the next 6 months.",
    },
];

// TODO: Replace with GET /api/ai/chart-analysis
const aiAnalysis =
    "AI Analysis: Your blood pressure shows excellent control over the past 6 months, averaging 118/76 mmHg. Continue current medication regimen and lifestyle habits.";

// TODO: Replace with GET /api/ai/risk-assessment
const riskScores = [
    { label: "Overall Risk Score", value: 18, rating: "Low",      color: "green"  },
    { label: "Cardiovascular",     value: 22, rating: "Low",      color: "green"  },
    { label: "Diabetes",           value: 58, rating: "Moderate", color: "orange" },
    { label: "Alzheimer's Disease",value: 54, rating: "Moderate", color: "orange" },
    { label: "Cancer",             value: 20, rating: "Low",      color: "green"  },
];

// TODO: Replace with GET /api/patient/activity
const recentActivity = [
    {
        icon: <FlaskConical size={18} />,
        iconBg: "blue",
        title: "Complete Blood Count results uploaded",
        time: "2 days ago",
        ai: { color: "green", text: "AI: All values normal" },
    },
    {
        icon: <Pill size={18} />,
        iconBg: "green",
        title: "Prescription refill: Metformin 500mg",
        time: "5 days ago",
        ai: { color: "blue", text: "AI: 90-day supply, next refill Feb 2025" },
    },
    {
        icon: <FileText size={18} />,
        iconBg: "purple",
        title: "Shared records with Dr. Martinez",
        time: "1 week ago",
        ai: null,
    },
];

// TODO: Replace with GET /api/patient/vitals
const vitalChartData = [
    { month: "Jan", heartRate: 71, systolicBP: 120 },
    { month: "Feb", heartRate: 70, systolicBP: 118 },
    { month: "Mar", heartRate: 72, systolicBP: 119 },
    { month: "Apr", heartRate: 71, systolicBP: 119 },
    { month: "May", heartRate: 70, systolicBP: 117 },
    { month: "Jun", heartRate: 71, systolicBP: 118 },
];

const statCards = [
    { icon: <FileText size={22} color="rgb(0,87,235)"   />, label: "Total Records",      value: "247",    sub: "Medical documents"     },
    { icon: <Pill      size={22} color="rgb(0,160,60)"  />, label: "Active Meds",        value: "5",      sub: "Current prescriptions" },
    { icon: <FlaskConical size={22} color="rgb(120,60,220)" />, label: "Lab Tests",      value: "23",     sub: "Last 12 months"        },
    { icon: <Calendar  size={22} color="rgb(220,80,40)" />, label: "Next Appointment",   value: "Dec 15", sub: "Dr. Martinez"          },
];

const navTabs = [
    { label: "Dashboard",       icon: <Activity    size={15} /> },
    { label: "Medical Records", icon: <FileText    size={15} /> },
    { label: "Genomics",        icon: <Dna         size={15} /> },
    { label: "Insurance",       icon: <CreditCard  size={15} /> },
    { label: "Share Data",      icon: <Share2      size={15} /> },
    { label: "Upload",          icon: <Upload      size={15} /> },
];

// ── Pure SVG line chart (no dependencies) ────────────────────────────────────
function VitalChart({ data }) {
    const [tooltip, setTooltip] = useState(null);

    const W = 800, H = 220;
    const padL = 40, padR = 20, padT = 10, padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const minY = 0, maxY = 140;
    const yTicks = [0, 35, 70, 105, 140];

    const xPos = (i) => padL + (i / (data.length - 1)) * chartW;
    const yPos = (v) => padT + chartH - ((v - minY) / (maxY - minY)) * chartH;

    const makePath = (key) =>
        data.map((d, i) => `${i === 0 ? "M" : "L"}${xPos(i)},${yPos(d[key])}`).join(" ");

    return (
        <div className="pd-chart-wrap">
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: "visible" }}>
                {/* Y grid lines */}
                {yTicks.map((t) => (
                    <g key={t}>
                        <line x1={padL} x2={W - padR} y1={yPos(t)} y2={yPos(t)}
                            stroke="rgb(230,235,245)" strokeDasharray="4 3" strokeWidth={1} />
                        <text x={padL - 6} y={yPos(t) + 4} textAnchor="end"
                            fontSize={11} fill="rgb(160,168,185)">{t}</text>
                    </g>
                ))}

                {/* X labels */}
                {data.map((d, i) => (
                    <text key={i} x={xPos(i)} y={H - 4} textAnchor="middle"
                        fontSize={11} fill="rgb(160,168,185)">{d.month}</text>
                ))}

                {/* Lines */}
                <path d={makePath("systolicBP")} fill="none" stroke="rgb(0,87,235)" strokeWidth={2} strokeLinejoin="round" />
                <path d={makePath("heartRate")}  fill="none" stroke="rgb(0,160,60)" strokeWidth={2} strokeLinejoin="round" />

                {/* Dots + hover targets */}
                {data.map((d, i) => (
                    <g key={i}>
                        <circle cx={xPos(i)} cy={yPos(d.systolicBP)} r={4} fill="rgb(0,87,235)" />
                        <circle cx={xPos(i)} cy={yPos(d.heartRate)}  r={4} fill="rgb(0,160,60)" />
                        <rect
                            x={xPos(i) - 20} y={padT} width={40} height={chartH}
                            fill="transparent"
                            onMouseEnter={() => setTooltip({ i, d, x: xPos(i), y: Math.min(yPos(d.systolicBP), yPos(d.heartRate)) - 10 })}
                            onMouseLeave={() => setTooltip(null)}
                        />
                    </g>
                ))}

                {/* Tooltip */}
                {tooltip && (
                    <g>
                        <line x1={xPos(tooltip.i)} x2={xPos(tooltip.i)} y1={padT} y2={padT + chartH}
                            stroke="rgb(200,210,230)" strokeWidth={1} strokeDasharray="3 2" />
                        <foreignObject x={xPos(tooltip.i) - 80} y={tooltip.y - 60} width={160} height={70}>
                            <div className="pd-tooltip">
                                <p className="pd-tooltip-label">{tooltip.d.month}</p>
                                <p style={{ color: "rgb(0,160,60)", margin: "2px 0", fontSize: 12 }}>Heart Rate (bpm) : {tooltip.d.heartRate}</p>
                                <p style={{ color: "rgb(0,87,235)",  margin: "2px 0", fontSize: 12 }}>Systolic BP : {tooltip.d.systolicBP}</p>
                            </div>
                        </foreignObject>
                    </g>
                )}
            </svg>

            {/* Legend */}
            <div className="pd-chart-legend">
                <span className="pd-legend-dot" style={{ background: "rgb(0,160,60)" }} /> Heart Rate
                <span className="pd-legend-dot" style={{ background: "rgb(0,87,235)", marginLeft: 16 }} /> Systolic BP
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
function PatientDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [chartRange, setChartRange] = useState("Last 6 months");
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3001/patient/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data.user);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        
        fetchProfile();
    }, []);

    return (
        <div className="pd-page">

            {/* Top Bar */}
            <header className="pd-header">
                <div className="pd-header-left">
                    <div className="pd-header-logo"><Shield size={20} /></div>
                    <div>
                        <p className="pd-header-brand">HealthUnity</p>
                        <p className="pd-header-portal">Patient Portal</p>
                    </div>
                </div>
                <div className="pd-header-right">
                    <div className="pd-header-userinfo">
                        <p className="pd-header-name">{user ? `${user.first_name} ${user.last_name}` : "Loading..."}</p>
                        <p className="pd-header-id">Patient ID: {user ? user.health_id : ""}</p>
                    </div>
                    <div className="pd-header-avatar">
                        {user ? `${user.first_name[0]}${user.last_name[0]}` : ""}
                    </div>
                    <button className="pd-header-logout" onClick={() =>  {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/");
                    }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {/* Scrollable body */}
            <div className="pd-body">

                {/* Nav Tabs */}
                <nav className="pd-nav">
                    <div className="pd-nav-inner">
                        {navTabs.map((tab) => (
                            <button
                                key={tab.label}
                                className={`pd-nav-tab ${activeTab === tab.label ? "pd-nav-tab-active" : ""}`}
                                onClick={() => setActiveTab(tab.label)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {activeTab === "Dashboard" && <>

                {/* AI Daily Summary */}
                <div className="pd-ai-summary">
                    <div className="pd-ai-summary-icon"><Brain size={22} /></div>
                    <div>
                        <p className="pd-ai-summary-title">AI Daily Health Summary</p>
                        <p className="pd-ai-summary-body">{aiSummary}</p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="pd-stat-grid">
                    {statCards.map((s) => (
                        <div className="pd-stat-card" key={s.label}>
                            <div className="pd-stat-top">
                                {s.icon}
                                <span className="pd-stat-label">{s.label}</span>
                            </div>
                            <p className="pd-stat-value">{s.value}</p>
                            <p className="pd-stat-sub">{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Safety Alert */}
                <div className="pd-alert">
                    <AlertCircle size={20} className="pd-alert-icon" />
                    <div>
                        <div className="pd-alert-header">
                            <span className="pd-alert-title">AI Safety Alert</span>
                            <span className="pd-alert-badge">Action Required</span>
                        </div>
                        <p className="pd-alert-body">{aiSafetyAlert.message}</p>
                    </div>
                </div>

                {/* AI Recommendations */}
                <div className="pd-card">
                    <div className="pd-card-title-row">
                        <Sparkles size={17} className="pd-sparkle-purple" />
                        <h2 className="pd-card-title">AI Personalized Recommendations</h2>
                    </div>
                    <div className="pd-recs">
                        {aiRecommendations.map((r) => (
                            <div key={r.title} className={`pd-rec pd-rec-${r.color}`}>
                                <span className={`pd-rec-icon pd-rec-icon-${r.color}`}>{r.icon}</span>
                                <div>
                                    <p className="pd-rec-title">{r.title}</p>
                                    <p className="pd-rec-body">{r.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vital Signs Chart */}
                <div className="pd-card">
                    <div className="pd-chart-header">
                        <div className="pd-card-title-row">
                            <Activity size={17} color="rgb(0,87,235)" />
                            <h2 className="pd-card-title">Vital Signs Trends</h2>
                        </div>
                        <select
                            className="pd-chart-select"
                            value={chartRange}
                            onChange={(e) => setChartRange(e.target.value)}
                        >
                            <option>Last 6 months</option>
                            <option>Last 3 months</option>
                            <option>Last 12 months</option>
                        </select>
                    </div>
                    <VitalChart data={vitalChartData} />
                    <div className="pd-ai-note">
                        <Sparkles size={14} className="pd-sparkle-purple" />
                        <p>{aiAnalysis}</p>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="pd-bottom-grid">

                    {/* Recent Activity */}
                    <div className="pd-card">
                        <h2 className="pd-card-title" style={{ marginBottom: 16 }}>Recent Activity</h2>
                        <div className="pd-activity-list">
                            {recentActivity.map((a, i) => (
                                <div key={i} className="pd-activity-item">
                                    <div className={`pd-activity-icon pd-activity-icon-${a.iconBg}`}>{a.icon}</div>
                                    <div>
                                        <p className="pd-activity-title">{a.title}</p>
                                        <p className="pd-activity-time">{a.time}</p>
                                        {a.ai && (
                                            <p className={`pd-activity-ai pd-activity-ai-${a.ai.color}`}>
                                                {a.ai.color === "green" ? <CheckCircle size={12} /> : <Sparkles size={12} />}
                                                <span>{a.ai.text}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Health Risk */}
                    <div className="pd-card">
                        <div className="pd-card-title-row" style={{ marginBottom: 16 }}>
                            <TrendingUp size={17} color="rgb(0,87,235)" />
                            <h2 className="pd-card-title">AI Health Risk Assessment</h2>
                        </div>
                        <div className="pd-risk-list">
                            {riskScores.map((r) => (
                                <div key={r.label} className="pd-risk-item">
                                    <div className="pd-risk-label-row">
                                        <span className="pd-risk-label">{r.label}</span>
                                        <span className={`pd-risk-rating pd-risk-${r.color}`}>{r.rating}</span>
                                    </div>
                                    <div className="pd-risk-bar-bg">
                                        <div className={`pd-risk-bar-fill pd-risk-bar-${r.color}`} style={{ width: `${r.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pd-risk-note">
                            <Sparkles size={13} className="pd-sparkle-purple" />
                            <p>Risk scores include genomic factors (APOE ε4), lifestyle data, and family history. Updated daily with latest health metrics.</p>
                        </div>
                    </div>

                </div>
                </>}
                {activeTab === "Medical Records" && <MedicalRecords />}
                {activeTab === "Genomics" && <Genomics />}
                {activeTab === "Insurance" && <Insurance />}
                {activeTab === "Share Data" && <ShareData />}
            </div>
        </div>
    );
}

export default PatientDashboard;
