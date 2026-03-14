import "./HomePage.css";
import RoleSelect from "./RoleSelect";
import { Shield, User, Stethoscope } from 'lucide-react';
import { useNavigate } from "react-router-dom";



function HomePage() {
    const navigate = useNavigate();

    const handlePatient = () => {
        navigate("/login/patient");
    };

    const handlePhysician = () => {
        navigate("/login/physician");
    };

    return( 
        <div className="home-page">
            <div className="home-logo">
                <Shield size={40} />
            </div>
            <div className="card-container">
                <RoleSelect 
                className={"patient"}
                image={<User size={32} />}
                title="I'm a Patient"
                description="Access your complete medical history, manage your health records, and share data with providers worldwide."
                bullets={[
                    "View all your medical records in one place" ,
                    "Get AI-powered health insights" ,
                    "Control who accesses your data"
                ]}
                onClick={handlePatient} 
                />
                <RoleSelect 
                className={"physician"}
                image={<Stethoscope size={32} />}
                title="I'm a Physician" 
                description="Access patient records with permission, view comprehensive medical histories, and get AI-assisted clinical decision support."
                bullets={[
                    "Access complete patient histories instantly" ,
                    "AI-powered clinical decision support" ,
                    "Drug interaction and safety alerts"
                ]}
                onClick ={handlePhysician}
                />
            </div>
        </div>
    );
}
export default HomePage;