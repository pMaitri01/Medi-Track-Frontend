import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PatientLogin from './patient/pages/PatientLogin';
import PatientForgotPwd from "./patient/pages/PatientForgotPwd";
import PatientOtp from './patient/pages/PatientOtp';
import PatientResetPwd from './patient/pages/PatientResetPwd';
import PatientRegistration from './patient/pages/PatientRegistration';
import PatientHome from './patient/pages/PatientHome';
import AdminLogin from './admin/pages/AdminLogin';
import AdminSignUp from './admin/pages/AdminSignUp';
import DoctorDashboard from './admin/pages/DoctorDashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientLogin />} />
        <Route path="/Patientforgotpwd" element={<PatientForgotPwd />} />
        <Route path='/PatientOtp' element={<PatientOtp/>} />
        <Route path='/PatientResetPwd' element={<PatientResetPwd/>} />
        <Route path='/PatientRegistration' element={<PatientRegistration/>}/>
        <Route path='/PatientHome' element={<PatientHome/>}/>
        <Route path='/AdminLogin' element={<AdminLogin/>}/>
        <Route path='/AdminSignUp' element={<AdminSignUp/>}/> 
        <Route path='/DoctorDashboard' element={<DoctorDashboard/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
