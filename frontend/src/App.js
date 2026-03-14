import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import PatientDashboard from "./components/PatientDashboard";
import PhysicianDashboard from "./components/PhysicianDashboard";
import ForgotPassword from "./components/ForgotPassword";
import NewAccountPage from "./components/NewAccountPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/dashboard/patient" element={<PatientDashboard/>} />
        <Route path="/dashboard/physician" element={<PhysicianDashboard/>} />
        <Route path="/forgotpassword/:role" element={<ForgotPassword/>} />
        <Route path="/newaccount/:role" element={<NewAccountPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
