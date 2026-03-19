import "./Insurance.css";
import {
    Shield, DollarSign, TrendingUp, FileText, CheckCircle,
    AlertTriangle, Sparkles, CreditCard, Download, MessageSquare,
    Send, Bot
} from "lucide-react";

// TODO: Replace with GET /api/patient/insurance

const coverage = {
    provider: "Blue Cross Blue Shield",
    plan: "Gold PPO Plan",
    policyNumber: "BCBS-847291034",
    memberId: "MEM-2847",
    groupNumber: "GRP-50847",
    coveragePeriod: "2023 Plan Year",
    copays: [
        { label: "Primary Care Visit:", amount: "$25" },
        { label: "Specialist Visit:", amount: "$50" },
        { label: "Emergency Room:", amount: "$250" },
    ],
};

const deductible = {
    annual: 1500,
    met: 850,
    remaining: 650,
    pct: 57,
    ai: "AI predicts you'll meet your deductible by February 2025 based on scheduled appointments.",
};

const outOfPocket = {
    annual: 6000,
    met: 2340,
    remaining: 3660,
    pct: 39,
    ai: "You're at 39% of your maximum. Good news - you're unlikely to reach the limit this year.",
};

const claims = [
    {
        id: "CLM-2024-1847",
        title: "Annual Physical Examination",
        provider: "Dr. Emily Martinez",
        status: "Processed",
        statusColor: "green",
        icon: "check",
        billed: "$385.00",
        covered: "$310.00",
        youPay: "$75.00",
        ai: "Claim processed successfully. Payment reflects in-network rates with 20% coinsurance.",
        aiAction: null,
    },
    {
        id: "CLM-2024-1789",
        title: "Complete Blood Count (CBC)",
        provider: "Quest Diagnostics",
        status: "Processed",
        statusColor: "green",
        icon: "check",
        billed: "$125.00",
        covered: "$100.00",
        youPay: "$25.00",
        ai: "Standard lab test covered at 80%. Consider using in-network lab for better coverage.",
        aiAction: null,
    },
    {
        id: "CLM-2024-1654",
        title: "Chest X-Ray",
        provider: "Valley Imaging Center",
        status: "Denied",
        statusColor: "red",
        icon: "warn",
        billed: "$450.00",
        covered: "$0.00",
        youPay: "$450.00",
        ai: "Claim denied due to lack of prior authorization. AI-generated appeal letter available.",
        aiAction: "Generate AI Appeal Letter",
    },
];

const preAuths = [
    {
        title: "MRI Brain with Contrast",
        id: "PA-2024-489",
        provider: "Advanced Imaging Associates",
        status: "Approved",
        statusColor: "green",
        requestDate: "12/4/2024",
        decisionLabel: "Valid Until",
        decisionDate: "1/4/2025",
        ai: "Auto-approved based on APOE ε4 genetic risk and clinical history.",
        aiColor: "purple",
    },
    {
        title: "Physical Therapy (12 sessions)",
        id: "PA-2024-502",
        provider: "Metro Physical Therapy",
        status: "Pending",
        statusColor: "yellow",
        requestDate: "12/7/2024",
        decisionLabel: "Expected Decision",
        decisionDate: "12/11/2024",
        ai: "AI predicts 95% approval probability based on diagnosis code and treatment plan.",
        aiColor: "purple",
    },
];

const predictedCosts = [
    {
        title: "Quarterly Lab Work",
        expected: "2025-01-15",
        estCost: "$220",
        coverage: "$176",
        youPay: "$44",
        ai: "Deductible already met - only 20% coinsurance applies.",
    },
    {
        title: "Specialist Follow-up",
        expected: "2024-12-20",
        estCost: "$285",
        coverage: "$235",
        youPay: "$50",
        ai: "Use in-network specialist to avoid additional fees.",
    },
];

function Insurance() {
    return (
        <div className="ins-wrap">

            {/* AI Assistant Banner */}
            <div className="ins-ai-banner">
                <div className="ins-ai-icon"><Bot size={25} /></div>
                <div className="ins-ai-content">
                    <p className="ins-ai-title">AI Insurance Assistant</p>
                    <p className="ins-ai-body">Your AI assistant has reviewed your insurance coverage and claims. You have one claim denial that may be successfully appealed. Your deductible is 57% met, and you're on track for optimal coverage utilization. Ask me anything about your coverage, claims, or costs.</p>
                    <button className="ins-ai-btn">
                        <MessageSquare size={14} /> Chat with Insurance Assistant
                    </button>
                </div>
            </div>

            {/* Current Coverage */}
            <div className="ins-card">
                <div className="ins-section-title-row">
                    <Shield size={17} className="ins-blue-icon" />
                    <h2 className="ins-section-title">Current Coverage</h2>
                </div>
                <div className="ins-coverage-grid">
                    <div className="ins-coverage-left">
                        <p className="ins-provider-name">{coverage.provider}</p>
                        <p className="ins-plan-name">{coverage.plan}</p>
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
                        <p className="ins-copay-title">Copay Amounts</p>
                        {coverage.copays.map((c, i) => (
                            <div key={i} className="ins-copay-row">
                                <span className="ins-copay-label">{c.label}</span>
                                <span className="ins-copay-amount">{c.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Deductible + OOP */}
            <div className="ins-two-col">
                {/* Deductible */}
                <div className="ins-card">
                    <div className="ins-section-title-row">
                        <DollarSign size={17} className="ins-green-icon" />
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

                {/* Out of Pocket */}
                <div className="ins-card">
                    <div className="ins-section-title-row">
                        <TrendingUp size={17} className="ins-purple-icon" />
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

            {/* Recent Claims */}
            <div className="ins-card">
                <div className="ins-section-title-row">
                    <FileText size={17} className="ins-blue-icon" />
                    <h2 className="ins-section-title">Recent Claims</h2>
                    <button className="ins-view-all">View All Claims</button>
                </div>
                <div className="ins-claims">
                    {claims.map((c, i) => (
                        <div key={i} className={`ins-claim ins-claim-${c.statusColor}`}>
                            <div className="ins-claim-header">
                                <div className="ins-claim-left">
                                    {c.icon === "check"
                                        ? <CheckCircle size={20} className="ins-green-icon" />
                                        : <AlertTriangle size={20} className="ins-red-icon" />}
                                    <div>
                                        <p className="ins-claim-title">{c.title}</p>
                                        <p className="ins-claim-sub">{c.id} · {c.provider}</p>
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

            {/* Pre-Authorizations */}
            <div className="ins-card">
                <div className="ins-section-title-row">
                    <FileText size={17} className="ins-purple-icon" />
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

            {/* Predicted Costs */}
            <div className="ins-card">
                <div className="ins-section-title-row">
                    <CreditCard size={17} className="ins-green-icon" />
                    <h2 className="ins-section-title">Predicted Healthcare Costs</h2>
                </div>
                <p className="ins-section-sub">AI-powered cost predictions based on your scheduled appointments and treatment plans.</p>
                <div className="ins-predicted">
                    {predictedCosts.map((p, i) => (
                        <div key={i} className="ins-predicted-item">
                            <div>
                                <p className="ins-preauth-title">{p.title}</p>
                                <p className="ins-preauth-sub">Expected: {p.expected}</p>
                            </div>
                            <div className="ins-claim-amounts">
                                <div>
                                    <p className="ins-amount-label">Est. Cost</p>
                                    <p className="ins-amount-value">{p.estCost}</p>
                                </div>
                                <div>
                                    <p className="ins-amount-label">Coverage</p>
                                    <p className="ins-amount-value">{p.coverage}</p>
                                </div>
                                <div>
                                    <p className="ins-amount-label">You Pay</p>
                                    <p className="ins-amount-value">{p.youPay}</p>
                                </div>
                            </div>
                            <div className="ins-claim-ai ins-ai-blue">
                                <Sparkles size={13} className="ins-blue-icon" />
                                <span>{p.ai}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Digital Insurance Card */}
            <div className="ins-card">
                <div className="ins-section-title-row">
                    <CreditCard size={17} className="ins-blue-icon" />
                    <h2 className="ins-section-title">Digital Insurance Card</h2>
                    <button className="ins-download-btn">
                        <Download size={14} /> Download Card
                    </button>
                </div>
                <div className="ins-id-card">
                    <div className="ins-id-card-top">
                        <div>
                            <p className="ins-id-provider">{coverage.provider}</p>
                            <p className="ins-id-plan">{coverage.plan}</p>
                        </div>
                        <Shield size={28} className="ins-id-shield" />
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
