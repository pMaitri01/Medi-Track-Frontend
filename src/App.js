import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './patient/pages/Login';
import ForgotPassword from "./patient/pages/ForgotPassword";
import Otp from './patient/pages/Otp';
import ResetPwd from './patient/pages/ResetPwd';
import Registration from './patient/pages/Registration';
import PatientHome from './patient/pages/PatientHome';
import AdminLogin from './admin/pages/AdminLogin';
import AdminRegister from './admin/pages/AdminRegister';
import DoctorDashboard from './admin/pages/DoctorDashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path='/Otp' element={<Otp/>} />
        <Route path='/ResetPwd' element={<ResetPwd/>} />
        <Route path='/Registration' element={<Registration/>}/>
        <Route path='/AdminLogin' element={<AdminLogin/>}/>
        <Route path='/AdminRegister' element={<AdminRegister/>}/> 
        <Route path='/DoctorDashboard' element={<DoctorDashboard/>}/>
        <Route path='/PatientHome' element={<PatientHome/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
