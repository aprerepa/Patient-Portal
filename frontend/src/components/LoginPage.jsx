import "./LoginPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { User, Stethoscope, Eye, EyeOff, ArrowLeft } from "lucide-react";
import axios from "axios";

function LoginPage() {
    const { role } = useParams();
    const navigate = useNavigate();
    const isPatient = role === "patient";

    const [healthId, setHealthId] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/auth/login", {
            healthId,
            password
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            navigate(`/dashboard/${response.data.user.role}`);
        } catch (error) {
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <main className={`lp-page ${role}`}>

            {/* Icon */}
            <div className="lp-icon">
                {isPatient ? <User size={40} /> : <Stethoscope size={40} />}
            </div>

            {/* Title */}
            <h1 className="lp-title">{isPatient ? "Patient Portal" : "Physician Portal"}</h1>
            <p className="lp-subtitle">Sign in to access your HealthUnity account</p>

            {/* Card */}
            <form className="lp-card" onSubmit={handleSignIn}>

                {/* Health ID */}
                <label className="lp-label" htmlFor="healthId">Health ID</label>
                <div className="lp-input-wrap">
                    <input
                        id="healthId"
                        className="lp-input"
                        type="text"
                        placeholder={isPatient ? "PAT-1234" : "PHY-1234"}
                        value={healthId}
                        onChange={(e) => setHealthId(e.target.value)}
                        required
                    />
                    <span className="lp-input-badge">{isPatient ? "PAT-####" : "PHY-####"}</span>
                </div>
                <small className="lp-help">
                    {isPatient
                        ? "Enter your unique Health ID (e.g., PAT-1234)"
                        : "Enter your unique Health ID (e.g., PHY-1234)"}
                </small>

                {/* Password */}
                <label className="lp-label" htmlFor="password">Password</label>
                <div className="lp-input-wrap">
                    <input
                        id="password"
                        className="lp-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="lp-eye-btn"
                        onClick={() => setShowPassword((v) => !v)}
                    >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                {/* Remember me + Forgot password */}
                <div className="lp-row">
                    <label className="lp-remember">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Remember me</span>
                    </label>
                    <button
                        type="button"
                        className="lp-forgot"
                        onClick={() => navigate(`/forgotpassword/${role}`)}
                    >
                        Forgot password?
                    </button>
                </div>

                {/* Sign In */}
                <button type="submit" className="lp-signin-btn">
                    Sign In
                </button>

                {/* Divider */}
                <div className="lp-divider">
                    <span>New to HealthUnity?</span>
                </div>

                {/* Create Account */}
                <button
                    type="button"
                    className="lp-create-btn"
                    onClick={() => navigate(`/newaccount/${role}`)}
                >
                    Create an Account
                </button>

            </form>

            {/* Back to role selection */}
            <button
                type="button"
                className="lp-back-btn"
                onClick={() => navigate("/")}
            >
                <ArrowLeft size={16} />
                Back to role selection
            </button>

        </main>
    );
}

export default LoginPage;
