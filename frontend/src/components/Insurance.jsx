import "./Insurance.css";
import {
    Shield, DollarSign, TrendingUp, FileText, CheckCircle,
    AlertTriangle, Sparkles, CreditCard, Download, MessageSquare,
    Send, Bot, Landmark, Medal, Heart, Trees, HeartHandshake,
    CircleOff, Building2, Plus
} from "lucide-react";

// Not available from Synthea FHIR — kept as demo UI only
const deductible = {
    annual: 1500,
    met: 850,
    remaining: 650,
    pct: 57,
    ai: "Deductible details are not present in Synthea claims data. This section remains demo-only.",
};

const outOfPocket = {
    annual: 6000,
    met: 2340,
    remaining: 3660,
    pct: 39,
    ai: "Out-of-pocket maximums are not present in Synthea claims data. This section remains demo-only.",
};

const preAuths = [
    {
        title: "Prior authorization demo",
        id: "PA-DEMO",
        provider: "Not available from FHIR",
        status: "Demo",
        statusColor: "yellow",
        requestDate: "—",
        decisionLabel: "Note",
        decisionDate: "Synthea has no PA resources",
        ai: "Pre-authorizations are not included in the current FHIR dataset.",
        aiColor: "purple",
    },
];

/** Brand themes keyed by Synthea payer display names (+ common aliases). */
const INSURER_THEMES = [
    {
        match: [/blue\s*cross/i, /bcbs/i, /anthem/i],
        key: "bcbs",
        icon: Shield,
        // Blue Cross Blue Shield — blue shield / blue card
        color: "rgb(0, 87, 235)",
        gradient: "linear-gradient(135deg, rgb(0, 87, 235), rgb(30, 60, 200))",
    },
    {
        match: [/medicaid/i],
        key: "medicaid",
        icon: Landmark,
        color: "rgb(0, 128, 128)",
        gradient: "linear-gradient(135deg, rgb(0, 128, 128), rgb(0, 90, 100))",
    },
    {
        match: [/medicare/i],
        key: "medicare",
        icon: Medal,
        color: "rgb(185, 28, 28)",
        gradient: "linear-gradient(135deg, rgb(185, 28, 28), rgb(127, 29, 29))",
    },
    {
        match: [/united\s*health/i, /^uhc$/i],
        key: "uhc",
        icon: HeartHandshake,
        color: "rgb(0, 51, 102)",
        gradient: "linear-gradient(135deg, rgb(0, 70, 130), rgb(0, 40, 80))",
    },
    {
        match: [/humana/i],
        key: "humana",
        icon: Heart,
        color: "rgb(0, 140, 70)",
        gradient: "linear-gradient(135deg, rgb(0, 140, 70), rgb(0, 90, 50))",
    },
    {
        match: [/cigna/i],
        key: "cigna",
        icon: Trees,
        color: "rgb(232, 119, 34)",
        gradient: "linear-gradient(135deg, rgb(232, 119, 34), rgb(180, 70, 20))",
    },
    {
        match: [/aetna/i],
        key: "aetna",
        icon: Building2,
        color: "rgb(112, 48, 160)",
        gradient: "linear-gradient(135deg, rgb(112, 48, 160), rgb(70, 25, 110))",
    },
    {
        match: [/kaiser/i],
        key: "kaiser",
        icon: Plus,
        color: "rgb(0, 96, 175)",
        gradient: "linear-gradient(135deg, rgb(0, 96, 175), rgb(0, 60, 120))",
    },
    {
        match: [/no[_\s-]?insurance/i, /uninsured/i, /self[-\s]?pay/i],
        key: "none",
        icon: CircleOff,
        color: "rgb(100, 116, 139)",
        gradient: "linear-gradient(135deg, rgb(100, 116, 139), rgb(71, 85, 105))",
    },
];

const DEFAULT_THEME = {
    key: "default",
    icon: CreditCard,
    color: "rgb(55, 65, 145)",
    gradient: "linear-gradient(135deg, rgb(55, 65, 145), rgb(35, 40, 100))",
};

function getInsurerTheme(provider) {
    const name = String(provider || "");
    for (const theme of INSURER_THEMES) {
        if (theme.match.some((re) => re.test(name))) {
            return theme;
        }
    }
    return DEFAULT_THEME;
}

function formatClaimDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function Insurance({ insurance, loading }) {
    const coverage = insurance?.coverage || {
        provider: "Loading…",
        plan: "—",
        policyNumber: "—",
        memberId: "—",
        groupNumber: "—",
        coveragePeriod: "—",
        copays: [],
    };
    const claims = insurance?.claims || [];
    const summary = insurance?.summary || {
        claimCount: 0,
        totalBilled: "$0.00",
        totalPaid: "$0.00",
        totalYouPay: "$0.00",
    };

    const theme = getInsurerTheme(coverage.provider);
    const InsurerIcon = theme.icon;

    if (loading && !insurance) {
        return <div className="ins-wrap"><p className="ins-section-sub">Loading insurance…</p></div>;
    }

    return (
        <div className="ins-wrap">

            <div className="ins-ai-banner">
                <div className="ins-ai-icon"><Bot size={25} /></div>
                <div className="ins-ai-content">
                    <p className="ins-ai-title">AI Insurance Assistant</p>
                    <p className="ins-ai-body">
                        Loaded {summary.claimCount} claims from your health record.
                        Primary payer: {coverage.provider}. Total billed {summary.totalBilled};
                        remitted {summary.totalPaid}; estimated patient responsibility {summary.totalYouPay}.
                        Deductible and prior-auth details are not available in this FHIR dataset.
                    </p>
                    <button className="ins-ai-btn">
                        <MessageSquare size={14} /> Chat with Insurance Assistant
                    </button>
                </div>
            </div>

            <div className="ins-card">
                <div className="ins-section-title-row">
                    <InsurerIcon size={20} style={{ color: theme.color }} />
                    <h2 className="ins-section-title">Current Coverage</h2>
                </div>
                <div className="ins-coverage-grid">
                    <div className="ins-coverage-left">
                        <div className="ins-provider-row">
                            <span
                                className="ins-provider-badge"
                                style={{ background: theme.color }}
                            >
                                <InsurerIcon size={16} />
                            </span>
                            <div>
                                <p className="ins-provider-name" style={{ color: theme.color }}>
                                    {coverage.provider}
                                </p>
                                <p className="ins-plan-name">{coverage.plan}</p>
                            </div>
                        </div>
                        <div className="ins-coverage-fields">
                            <div className="ins-field-row">
                                <span className="ins-field-label">Policy Number:</span>
                                <span className="ins-field-value">{coverage.policyNumber}</span>
                            </div>
                            <div className="ins-field-row">
                                <span className="ins-field-label">Member ID:</span>
                                <span className="ins-field-value">{coverage.memberId}</span>
                            </div>
                            <div className="ins-field-row">
                                <span className="ins-field-label">Group Number:</span>
                                <span className="ins-field-value">{coverage.groupNumber}</span>
                            </div>
                            <div className="ins-field-row">
                                <span className="ins-field-label">Coverage Period:</span>
                                <span className="ins-field-value">{coverage.coveragePeriod}</span>
                            </div>
                        </div>
                    </div>
                    <div className="ins-coverage-right">
                        <p className="ins-copay-title">Claims snapshot</p>
                        <div className="ins-copay-row">
                            <span className="ins-copay-label">Claims on file:</span>
                            <span className="ins-copay-amount">{summary.claimCount}</span>
                        </div>
                        <div className="ins-copay-row">
                            <span className="ins-copay-label">Total billed:</span>
                            <span className="ins-copay-amount">{summary.totalBilled}</span>
                        </div>
                        <div className="ins-copay-row">
                            <span className="ins-copay-label">Total remitted:</span>
                            <span className="ins-copay-amount">{summary.totalPaid}</span>
                        </div>
                        <p className="ins-section-sub" style={{ marginTop: 12 }}>
                            Copay tables are not present in Synthea FHIR data.
                        </p>
                    </div>
                </div>
            </div>

            <div className="ins-two-col">
                <div className="ins-card">
                    <div className="ins-section-title-row">
                        <DollarSign size={20} className="ins-green-icon" />
                        <h2 className="ins-section-title">Deductible Progress</h2>
                    </div>
                    <div className="ins-progress-row">
                        <span className="ins-progress-label">Annual Deductible</span>
                        <span className="ins-progress-amount">${deductible.annual.toLocaleString()}</span>
                    </div>
                    <div className="ins-bar-bg">
                        <div className="ins-bar-fill ins-bar-green" style={{ width: `${deductible.pct}%` }} />
                    </div>
                    <div className="ins-progress-sub">
                        <span>Met: ${deductible.met.toLocaleString()}</span>
                        <span>Remaining: ${deductible.remaining.toLocaleString()}</span>
                    </div>
                    <div className="ins-ai-note ins-ai-blue">
                        <Sparkles size={13} className="ins-blue-icon" />
                        <span>{deductible.ai}</span>
                    </div>
                </div>

                <div className="ins-card">
                    <div className="ins-section-title-row">
                        <TrendingUp size={20} className="ins-purple-icon" />
                        <h2 className="ins-section-title">Out-of-Pocket Maximum</h2>
                    </div>
                    <div className="ins-progress-row">
                        <span className="ins-progress-label">Annual Maximum</span>
                        <span className="ins-progress-amount">${outOfPocket.annual.toLocaleString()}</span>
                    </div>
                    <div className="ins-bar-bg">
                        <div className="ins-bar-fill ins-bar-purple" style={{ width: `${outOfPocket.pct}%` }} />
                    </div>
                    <div className="ins-progress-sub">
                        <span>Met: ${outOfPocket.met.toLocaleString()}</span>
                        <span>Remaining: ${outOfPocket.remaining.toLocaleString()}</span>
                    </div>
                    <div className="ins-ai-note ins-ai-green">
                        <CheckCircle size={13} className="ins-green-icon" />
                        <span>{outOfPocket.ai}</span>
                    </div>
                </div>
            </div>

            <div className="ins-card">
                <div className="ins-section-title-row">
                    <FileText size={20} className="ins-blue-icon" />
                    <h2 className="ins-section-title">Recent Claims</h2>
                    <button className="ins-view-all">{claims.length} total</button>
                </div>
                <div className="ins-claims">
                    {claims.length === 0 && (
                        <p className="ins-section-sub">No claims found in FHIR.</p>
                    )}
                    {claims.slice(0, 12).map((c) => (
                        <div key={c.id} className={`ins-claim ins-claim-${c.statusColor}`}>
                            <div className="ins-claim-header">
                                <div className="ins-claim-left">
                                    {c.icon === "check"
                                        ? <CheckCircle size={20} className="ins-green-icon" />
                                        : <AlertTriangle size={20} className="ins-red-icon" />}
                                    <div>
                                        <p className="ins-claim-title">{c.title}</p>
                                        <p className="ins-claim-sub">
                                            {c.id}
                                            {c.date ? ` · ${formatClaimDate(c.date)}` : ""}
                                            {` · ${c.provider}`}
                                            {c.payer ? ` · ${c.payer}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <span className={`ins-status-badge ins-status-${c.statusColor}`}>{c.status}</span>
                            </div>
                            <div className="ins-claim-amounts">
                                <div>
                                    <p className="ins-amount-label">Billed</p>
                                    <p className="ins-amount-value">{c.billed}</p>
                                </div>
                                <div>
                                    <p className="ins-amount-label">Covered</p>
                                    <p className="ins-amount-value">{c.covered}</p>
                                </div>
                                <div>
                                    <p className="ins-amount-label">You Pay</p>
                                    <p className="ins-amount-value">{c.youPay}</p>
                                </div>
                            </div>
                            <div className="ins-claim-ai">
                                <Sparkles size={13} className="ins-blue-icon" />
                                <span>{c.ai}</span>
                            </div>
                            {c.aiAction && (
                                <button className="ins-appeal-btn">
                                    <Send size={13} /> {c.aiAction}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="ins-card">
                <div className="ins-section-title-row">
                    <FileText size={20} className="ins-purple-icon" />
                    <h2 className="ins-section-title">Pre-Authorizations</h2>
                </div>
                <div className="ins-preauths">
                    {preAuths.map((p, i) => (
                        <div key={i} className="ins-preauth">
                            <div className="ins-preauth-header">
                                <div>
                                    <p className="ins-preauth-title">{p.title}</p>
                                    <p className="ins-preauth-sub">{p.id} · {p.provider}</p>
                                </div>
                                <span className={`ins-status-badge ins-status-${p.statusColor}`}>{p.status}</span>
                            </div>
                            <div className="ins-preauth-dates">
                                <div>
                                    <p className="ins-amount-label">Request Date</p>
                                    <p className="ins-preauth-date">{p.requestDate}</p>
                                </div>
                                <div>
                                    <p className="ins-amount-label">{p.decisionLabel}</p>
                                    <p className="ins-preauth-date">{p.decisionDate}</p>
                                </div>
                            </div>
                            <div className={`ins-preauth-ai ins-ai-${p.aiColor}`}>
                                <Sparkles size={13} className="ins-purple-icon" />
                                <span>{p.ai}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="ins-card">
                <div className="ins-section-title-row">
                    <CreditCard size={20} style={{ color: theme.color }} />
                    <h2 className="ins-section-title">Digital Insurance Card</h2>
                    <button className="ins-download-btn">
                        <Download size={14} /> Download Card
                    </button>
                </div>
                <div className="ins-id-card" style={{ background: theme.gradient }}>
                    <div className="ins-id-card-top">
                        <div>
                            <p className="ins-id-provider">{coverage.provider}</p>
                            <p className="ins-id-plan">{coverage.plan}</p>
                        </div>
                        <InsurerIcon size={32} className="ins-id-shield" />
                    </div>
                    <div className="ins-id-card-bottom">
                        <div>
                            <p className="ins-id-field-label">Member ID</p>
                            <p className="ins-id-field-value">{coverage.memberId}</p>
                        </div>
                        <div>
                            <p className="ins-id-field-label">Group Number</p>
                            <p className="ins-id-field-value">{coverage.groupNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Insurance;
