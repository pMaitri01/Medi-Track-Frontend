import './App.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ── Shared ──
import ProtectedRoute from './components/ProtectedRoute';

// ─────────────────────────────────────────────
// PATIENT FLOW
// / → PatientLogin
//   ├── Register  → /PatientRegistration
//   ├── Forgot Pwd→ /PatientForgotPwd → /PatientOtp → /PatientResetPwd
//   └── Login OK
//         ├── First time → /PatientProfileSetup → /PatientHome
//         └── Returning  → /PatientHome
// ─────────────────────────────────────────────
import PatientLogin        from './patient/pages/PatientLogin';
import PatientRegistration from './patient/pages/PatientRegistration';
import PatientForgotPwd    from './patient/pages/PatientForgotPwd';
import PatientOtp          from './patient/pages/PatientOtp';
import PatientResetPwd     from './patient/pages/PatientResetPwd';
import PatientProfileSetup from './patient/pages/PatientProfileSetup';
import PatientHome         from './patient/pages/PatientHome';
import DoctorList          from './patient/pages/DoctorList';
import BookAppointment     from './patient/pages/BookAppointment';

// ─────────────────────────────────────────────
// DOCTOR FLOW
// /DoctorLogin
//   ├── Register    → /DoctorSignUp
//   ├── Forgot Pwd  → /DoctorForgotPassword (OTP + Reset inside)
//   └── Login OK    → /DoctorDashboard
//         ├── /PatientList
//         ├── /AppointmentView
//         └── /DoctorProfile
// ─────────────────────────────────────────────
import DoctorLogin       from './doctor/pages/DoctorLogin';
import DoctorSignUp      from './doctor/pages/DoctorSignUp';
import DoctorRegister    from './doctor/pages/DoctorRegister';
import WaitingApproval   from './doctor/pages/WaitingApproval';
import DoctorForgotFlow  from './doctor/pages/DoctorForgotFlow';
import DoctorDashboard   from './doctor/pages/DoctorDashboard';
import DoctorProfile     from './doctor/pages/DoctorProfile';
import PatientList       from './doctor/pages/PatientList';
import AppointmentView   from './doctor/pages/AppointmentView';

// ─────────────────────────────────────────────
// ADMIN FLOW
// /admin → redirects to /admin/dashboard
//   ├── /admin/dashboard
//   ├── /admin/doctors
//   ├── /admin/patients
//   ├── /admin/appointments
//   ├── /admin/notifications
//   └── /admin/profile
// ─────────────────────────────────────────────
import AdminLayout            from './admin/pages/AdminLayout';
import AdminDashboard         from './admin/pages/AdminDashboard';
import DoctorManagement       from './admin/pages/DoctorManagement';
import DoctorApproval         from './admin/pages/DoctorApproval';
import PatientManagement      from './admin/pages/PatientManagement';
import AppointmentManagement  from './admin/pages/AppointmentManagement';
import AdminProfile           from './admin/pages/AdminProfile';
import NotificationManagement from './admin/pages/NotificationManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── PATIENT ── */}
        <Route path="/"                    element={<PatientLogin />} />
        <Route path="/PatientRegistration" element={<PatientRegistration />} />
        <Route path="/PatientForgotPwd"    element={<PatientForgotPwd />} />
        <Route path="/PatientOtp"          element={<PatientOtp />} />
        <Route path="/PatientResetPwd"     element={<PatientResetPwd />} />
        <Route path="/PatientProfileSetup" element={<PatientProfileSetup />} />
        <Route path="/DoctorList"          element={<DoctorList />} />
        <Route path="/PatientHome"
          element={<ProtectedRoute role="patient"><PatientHome /></ProtectedRoute>} />
        <Route path="/BookAppointment"
          element={<ProtectedRoute role="patient"><BookAppointment /></ProtectedRoute>} />

        {/* ── DOCTOR ── */}
        <Route path="/DoctorLogin"          element={<DoctorLogin />} />
        <Route path="/DoctorSignUp"         element={<DoctorSignUp />} />
        <Route path="/DoctorRegister"       element={<DoctorRegister />} />
        <Route path="/DoctorWaiting"        element={<WaitingApproval />} />
        <Route path="/DoctorForgotPassword" element={<DoctorForgotFlow />} />
        <Route path="/DoctorProfile"        element={<DoctorProfile />} />
        <Route path="/PatientList"
          element={<ProtectedRoute role="doctor"><PatientList /></ProtectedRoute>} />
        <Route path="/DoctorDashboard"
          element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/AppointmentView"
          element={<ProtectedRoute role="doctor"><AppointmentView /></ProtectedRoute>} />

        {/* ── ADMIN (nested layout) ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard"     element={<AdminDashboard />} />
          <Route path="doctors"       element={<DoctorManagement />} />
          <Route path="approvals"     element={<DoctorApproval />} />
          <Route path="patients"      element={<PatientManagement />} />
          <Route path="appointments"  element={<AppointmentManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="profile"       element={<AdminProfile />} />
        </Route>

      </Routes>

      <ToastContainer
        position="top-center"
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
