import "./ForgotPassword.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Stethoscope, ArrowLeft } from "lucide-react";

function ForgotPassword() {
    const { role } = useParams();
    const navigate = useNavigate();
    const isPatient = role === "patient";

    const [identifier, setIdentifier] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className={`fp-page ${role}`}>

            {/* Icon */}
            <div className="fp-icon">
                {isPatient ? <User size={32} /> : <Stethoscope size={32} />}
            </div>

            {/* Title */}
            <h1 className="fp-title">Reset Password</h1>
            <p className="fp-subtitle">
                {submitted
                    ? "Check your email or Health ID inbox for a verification code."
                    : "We'll send you a verification code"}
            </p>

            {/* Card */}
            {!submitted ? (
                <form className="fp-card" onSubmit={handleSubmit}>
                    <label className="fp-label" htmlFor="identifier">
                        Health ID or Email
                    </label>
                    <input
                        id="identifier"
                        className="fp-input"
                        type="text"
                        placeholder={isPatient ? "PAT-1234 or email@example.com" : "PHY-1234 or email@example.com"}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />
                    <small className="fp-help">
                        Enter your Health ID or registered email address
                    </small>
                    <button type="submit" className="fp-submit-btn">
                        Send Verification Code
                    </button>
                </form>
            ) : (
                <div className="fp-card fp-success-card">
                    <p className="fp-success-text">
                        A verification code has been sent. Please check your email or Health ID inbox.
                    </p>
                    <button
                        type="button"
                        className="fp-submit-btn"
                        onClick={() => navigate(`/login/${role}`)}
                    >
                        Back to Sign In
                    </button>
                </div>
            )}

            {/* Back to sign in */}
            {!submitted && (
                <button
                    type="button"
                    className="fp-back-btn"
                    onClick={() => navigate(`/login/${role}`)}
                >
                    <ArrowLeft size={16} />
                    Back to sign in
                </button>
            )}
        </main>
    );
}

export default ForgotPassword;
