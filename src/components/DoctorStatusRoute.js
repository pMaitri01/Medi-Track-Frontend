import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const DoctorStatusRoute = ({ children, allowedStatus }) => {
  const [state, setState] = useState({
    loading: true,
    user: null,
  });

  useEffect(() => {
    const checkDoctor = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/Doctor/profile`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          setState({ loading: false, user: null });
          return;
        }

        const data = await res.json();
        setState({ loading: false, user: data.user });
      } catch (err) {
        setState({ loading: false, user: null });
      }
    };

    checkDoctor();
  }, []);

  // ⏳ Loading state
  if (state.loading) return <p>Loading...</p>;

  // ❌ Not logged in
  if (!state.user) {
    return <Navigate to="/DoctorLogin" replace />;
  }

  // ❌ Not a doctor
  if (state.user.role !== "doctor") {
    return <Navigate to="/unauthorized" replace />;
  }

  // ❌ Wrong status
  if (!allowedStatus.includes(state.user.status)) {
    return <Navigate to="/DoctorDashboard" replace />;
  }

  // ✅ Allowed
  return children;
};

export default DoctorStatusRoute;