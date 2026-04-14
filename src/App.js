import './App.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DoctorProvider } from "./context/DoctorContext";

// Shared
import ProtectedRoute from './components/ProtectedRoute';
import DoctorStatusRoute from "./components/DoctorStatusRoute";

// Patient Pages
import PatientLanding from './patient/pages/PatientLanding';
import PatientLogin from './patient/pages/PatientLogin';
import PatientRegistration from './patient/pages/PatientRegistration';
import PatientForgotPwd from './patient/pages/PatientForgotPwd';
import PatientOtp from './patient/pages/PatientOtp';
import PatientResetPwd from './patient/pages/PatientResetPwd';
import PatientProfileSetup from './patient/pages/PatientProfileSetup';
import PatientHome from './patient/pages/PatientHome';
import DoctorList from './patient/pages/DoctorList';
import BookAppointment from './patient/pages/BookAppointment';
import PatientAppointment from './patient/pages/PatientAppointment';
import MedicalRecords from './patient/pages/MedicalRecords';
import PrescriptionPage from './patient/pages/PrescriptionPage';

// Doctor Pages
import DoctorLogin from './doctor/pages/DoctorLogin';
import DoctorSignUp from './doctor/pages/DoctorSignUp';
import DoctorRegister from './doctor/pages/DoctorRegister';
import WaitingApproval from './doctor/pages/WaitingApproval';
import RejectedPage from './doctor/pages/RejectedPage';
import DoctorForgotFlow from './doctor/pages/DoctorForgotFlow';
import DoctorDashboard from './doctor/pages/DoctorDashboard';
import DoctorProfile from './doctor/pages/DoctorProfile';
import PatientList from './doctor/pages/PatientList';
import AppointmentView from './doctor/pages/AppointmentView';
import DoctorAppointmentHistory from './doctor/pages/DoctorAppointmentHistory';
import DoctorPrescription from './doctor/pages/DoctorPrescription';

// Admin Pages
import AdminLayout from './admin/pages/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import DoctorManagement from './admin/pages/DoctorManagement';
import DoctorApproval from './admin/pages/DoctorApproval';
import PatientManagement from './admin/pages/PatientManagement';
import AppointmentManagement from './admin/pages/AppointmentManagement';
import AdminProfile from './admin/pages/AdminProfile';
import NotificationManagement from './admin/pages/NotificationManagement';

function App() {

  // ✅ FIXED: declare user OUTSIDE return
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <BrowserRouter>
            <DoctorProvider>
      <Routes>
        <Route path="/" element={<PatientLanding />} />

        {/* Patient Auth */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegistration />} />
        <Route path="/patient/forgot" element={<PatientForgotPwd />} />
        <Route path="/PatientOtp" element={<PatientOtp />} />
        <Route path="/PatientResetPwd" element={<PatientResetPwd />} />

        {/* Patient Protected */}
        <Route path="/PatientProfileSetup" element={
          <ProtectedRoute role="patient">
            <PatientProfileSetup />
          </ProtectedRoute>
        } />

        <Route path="/DoctorList" element={
          <ProtectedRoute role="patient">
            <DoctorList />
          </ProtectedRoute>
        } />

        <Route path="/PatientAppointment" element={
          <ProtectedRoute role="patient">
            <PatientAppointment />
          </ProtectedRoute>
        } />

        <Route path="/records" element={
          <ProtectedRoute role="patient">
            <MedicalRecords />
          </ProtectedRoute>
        } />

        <Route path="/prescriptions" element={
          <ProtectedRoute role="patient">
            <PrescriptionPage />
          </ProtectedRoute>
        } />

        <Route path="/PatientHome" element={
          <ProtectedRoute role="patient">
            <PatientHome />
          </ProtectedRoute>
        } />

        <Route path="/BookAppointment" element={
          <ProtectedRoute role="patient">
            <BookAppointment />
          </ProtectedRoute>
        } />

        {/* Doctor */}
        <Route path="/DoctorLogin" element={<DoctorLogin />} />
        <Route path="/DoctorSignUp" element={<DoctorSignUp />} />
        <Route path="/DoctorRegister" element={<DoctorRegister />} />
        <Route path="/DoctorForgotPassword" element={<DoctorForgotFlow />} />

        <Route path="/DoctorProfile" element={
          <ProtectedRoute role="doctor">
            <DoctorProfile />
          </ProtectedRoute>
        } />

        <Route path="/PatientList" element={
          <ProtectedRoute role="doctor">
            <PatientList />
          </ProtectedRoute>
        } />

        <Route path="/DoctorDashboard" element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/AppointmentView" element={
          <ProtectedRoute role="doctor">
            <AppointmentView />
          </ProtectedRoute>
        } />

        <Route path="/AppointmentHistory" element={
          <ProtectedRoute role="doctor">
            <DoctorAppointmentHistory />
          </ProtectedRoute>
        } />

        <Route path="/DoctorPrescription" element={
          <ProtectedRoute role="doctor">
            <DoctorPrescription />
          </ProtectedRoute>
        } />

        {/* <Route path="/DoctorWaiting" element={
          <DoctorStatusRoute allowedStatus={["waiting"]}>
            <WaitingApproval />
          </DoctorStatusRoute>
        } /> */}
        <Route path="/DoctorWaiting" element={<WaitingApproval />} />
          <Route path="/DoctorRejected" element={<RejectedPage />} />
        {/* <Route path="/DoctorRejected" element={
          <DoctorStatusRoute allowedStatus={["rejected"]}>
            <RejectedPage />
          </DoctorStatusRoute>
        } /> */}

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={
            user?.role === "admin"
              ? <Navigate to="/admin/dashboard" replace />
              : <AdminLogin />
          }
        />

        {/* Admin Protected */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="approvals" element={<DoctorApproval />} />
          <Route path="patients" element={<PatientManagement />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

      </Routes>
 </DoctorProvider>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;