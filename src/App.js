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
import DoctorList from './patient/pages/DoctorList';
import PatientList from './doctor/pages/PatientList';
import DoctorLogin from './doctor/pages/DoctorLogin';
import DoctorProfile from './doctor/pages/DoctorProfile';
import DoctorSignUp from './doctor/pages/DoctorSignUp';
import DoctorDashboard from './doctor/pages/DoctorDashboard';
import BookAppointment from './patient/pages/BookAppointment';
import ProtectedRoute from './components/ProtectedRoute';
import AppointmentView from './doctor/pages/AppointmentView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientLogin />} />
        <Route path="/Patientforgotpwd" element={<PatientForgotPwd />} />
        <Route path='/PatientOtp' element={<PatientOtp/>} />
        <Route path='/PatientResetPwd' element={<PatientResetPwd/>} />
        <Route path='/PatientRegistration' element={<PatientRegistration/>}/>
        <Route path='/PatientHome' element={<ProtectedRoute role="patient"><PatientHome/></ProtectedRoute>}/>
        <Route path='/PatientList' element={<ProtectedRoute role="doctor"><PatientList/></ProtectedRoute>}/>
        <Route path='/DoctorList' element={<DoctorList/>}/>
        <Route path='/DoctorLogin' element={<DoctorLogin/>}/>
        <Route path='/DoctorProfile' element={<DoctorProfile/>}/>
        <Route path='/DoctorSignUp' element={<DoctorSignUp/>}/> 
        <Route path='/DoctorDashboard' element={<ProtectedRoute role="doctor"><DoctorDashboard/></ProtectedRoute>}/>
        <Route path='/BookAppointment' element={<ProtectedRoute role="patient"><BookAppointment/></ProtectedRoute>}/>
        <Route path='/AppointmentView' element={<ProtectedRoute role="doctor"><AppointmentView/></ProtectedRoute>}/>

      </Routes>
      <ToastContainer 
        position="top-center" // This moves it to the top middle
        autoClose={1000}
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
