import './App.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PatientLogin from './patient/pages/PatientLogin';
import PatientForgotPwd from "./patient/pages/PatientForgotPwd";
import PatientOtp from './patient/pages/PatientOtp';
import PatientResetPwd from './patient/pages/PatientResetPwd';
import PatientRegistration from './patient/pages/PatientRegistration';
import PatientHome from './patient/pages/PatientHome';
import PatientList from './admin/pages/PatientList';
import DoctorLogin from './admin/pages/DoctorLogin';
import DoctorSignUp from './admin/pages/DoctorSignUp';
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
        <Route path='/PatientList' element={<PatientList/>}/>
        <Route path='/DoctorLogin' element={<DoctorLogin/>}/>
        <Route path='/DoctorSignUp' element={<DoctorSignUp/>}/> 
        <Route path='/DoctorDashboard' element={<DoctorDashboard/>}/>

      </Routes>
      <ToastContainer 
        position="top-center" // This moves it to the top middle
        autoClose={10000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
