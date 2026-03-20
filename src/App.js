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
<<<<<<< HEAD
import AppointmentView from './admin/pages/AppointmentView';
=======
import BookAppointment from './patient/pages/BookAppointment';
>>>>>>> cae6dfbde6e38c94321d0347200a222c5b8e39fb
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientLogin />} />
        <Route path="/Patientforgotpwd" element={<PatientForgotPwd />} />
        <Route path='/PatientOtp' element={<PatientOtp/>} />
        <Route path='/PatientResetPwd' element={<PatientResetPwd/>} />
<<<<<<< HEAD
        <Route path='/PatientRegistration' element={<ProtectedRoute><PatientRegistration/></ProtectedRoute>}/>
        <Route path='/PatientHome' element={<PatientHome/>}/>
        {/* <Route path='/PatientHome' element={<ProtectedRoute><PatientHome/></ProtectedRoute>}/> */}
        {/* <Route path='/PatientList' element={<ProtectedRoute><PatientList/></ProtectedRoute>}/> */}
        <Route path='/PatientList' element={<PatientList/>}/>
        <Route path='/DoctorLogin' element={<DoctorLogin/>}/>
        <Route path='/DoctorSignUp' element={<DoctorSignUp/>}/> 
        <Route path='/DoctorDashboard' element={<ProtectedRoute><DoctorDashboard/></ProtectedRoute>}/>
        <Route path='/AppointmentView' element={<AppointmentView/>}/>
=======
        <Route path='/PatientRegistration' element={<PatientRegistration/>}/>
        <Route path='/PatientHome' element={<ProtectedRoute><PatientHome/></ProtectedRoute>}/>
        <Route path='/PatientList' element={<ProtectedRoute><PatientList/></ProtectedRoute>}/>
        <Route path='/DoctorLogin' element={<DoctorLogin/>}/>
        <Route path='/DoctorSignUp' element={<DoctorSignUp/>}/> 
<<<<<<< HEAD
        <Route path='/DoctorDashboard' element={<ProtectedRoute><DoctorDashboard/></ProtectedRoute>}/>
=======
        <Route path='/DoctorDashboard' element={<DoctorDashboard/>}/>
        <Route path='/BookAppointment' element={<BookAppointment/>}/>
>>>>>>> c411e26e80219146f322bcd1d7c12ea514c0e7ac

>>>>>>> cae6dfbde6e38c94321d0347200a222c5b8e39fb
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
