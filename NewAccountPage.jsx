import "./NewAccountPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Stethoscope, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

// TODO: Replace with generated ID from backend
const mockIds = { patient: "PAT-9848", physician: "PHY-4974" };

function NewAccountPage() {
    const { role } = useParams();
    const navigate = useNavigate();
    const isPatient = role === "patient";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/login/${role}`);
    };

    return (
        <main className={`na-page ${role}`}>

            {/* Icon */}
            <div className="na-icon">
                {isPatient ? <User size={32} /> : <Stethoscope size={32} />}
            </div>

            {/* Title */}
            <h1 className="na-title">{isPatient ? "Create Patient Account" : "Create Physician Account"}</h1>
            <p className="na-subtitle">Join HealthUnity and take control of your health data</p>

            {/* Card */}
            <form className="na-card" onSubmit={handleSubmit}>

                {/* Health ID Banner */}
                <div className="na-id-banner">
                    <div>
                        <p className="na-id-label">Your Health ID</p>
                        <p className="na-id-value">{mockIds[role]}</p>
                        <p className="na-id-help">Save this ID securely – you'll need it to sign in</p>
                    </div>
                    <CheckCircle size={28} className="na-id-check" />
                </div>

                {/* Personal Information */}
                <div className="na-section-header">
                    <h2 className="na-section-title">Personal Information</h2>
                    <div className="na-divider" />
                </div>

                <div className="na-row">
                    <div className="na-field">
                        <label className="na-label">First Name *</label>
                        <input className="na-input" type="text" placeholder="John" required />
                    </div>
                    <div className="na-field">
                        <label className="na-label">Last Name *</label>
                        <input className="na-input" type="text" placeholder="Doe" required />
                    </div>
                </div>

                <div className="na-field">
                    <label className="na-label">Email Address *</label>
                    <input className="na-input" type="email" placeholder="john.doe@example.com" required />
                </div>

                <div className="na-row">
                    <div className="na-field">
                        <label className="na-label">Phone Number *</label>
                        <input className="na-input" type="tel" placeholder="(555) 123-4567" required />
                    </div>
                    <div className="na-field">
                        <label className="na-label">Date of Birth *</label>
                        <input className="na-input" type="date" required />
                    </div>
                </div>

                {/* Professional Information (physician only) */}
                {!isPatient && (
                    <>
                        <div className="na-section-header">
                            <h2 className="na-section-title">Professional Information</h2>
                            <div className="na-divider" />
                        </div>

                        <div className="na-field">
                            <label className="na-label">Medical License Number *</label>
                            <input className="na-input" type="text" placeholder="e.g., MD123456" required />
                        </div>

                        <div className="na-field">
                            <label className="na-label">Specialty *</label>
                            <input className="na-input" type="text" placeholder="e.g., Cardiology, Family Medicine" required />
                        </div>
                    </>
                )}

                {/* Security */}
                <div className="na-section-header">
                    <h2 className="na-section-title">Security</h2>
                    <div className="na-divider" />
                </div>

                <div className="na-field">
                    <label className="na-label">Password *</label>
                    <div className="na-input-wrap">
                        <input
                            className="na-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            required
                        />
                        <button type="button" className="na-eye-btn" onClick={() => setShowPassword(v => !v)}>
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>
                    <small className="na-help">Must be at least 8 characters with uppercase, lowercase, and numbers</small>
                </div>

                <div className="na-field">
                    <label className="na-label">Confirm Password *</label>
                    <div className="na-input-wrap">
                        <input
                            className="na-input"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Re-enter your password"
                            required
                        />
                        <button type="button" className="na-eye-btn" onClick={() => setShowConfirm(v => !v)}>
                            {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>
                </div>

                {/* Terms */}
                <label className="na-terms">
                    <input type="checkbox" required />
                    <span>
                        I agree to the <a className="na-link" href="#">Terms of Service</a> and <a className="na-link" href="#">Privacy Policy</a>
                    </span>
                </label>

                {/* Submit */}
                <button type="submit" className="na-submit-btn">
                    Create Account
                </button>

                {/* Sign in link */}
                <button
                    type="button"
                    className="na-signin-link"
                    onClick={() => navigate(`/login/${role}`)}
                >
                    Already have an account? Sign in
                </button>

            </form>

            {/* Back */}
            <button type="button" className="na-back-btn" onClick={() => navigate(`/login/${role}`)}>
                <ArrowLeft size={16} />
                Back to sign in
            </button>

        </main>
    );
}

export default NewAccountPage;
