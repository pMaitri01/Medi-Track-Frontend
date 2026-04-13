// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, role }) => {
//   const [isAuth, setIsAuth] = useState(null);

//   const url =
//     role === "doctor"
//       ? `${process.env.REACT_APP_API_URL}/api/Doctor/profile`
//       : `${process.env.REACT_APP_API_URL}/api/Patient/profile`;

//   const redirectPath =
//     role === "doctor" ? "/DoctorLogin" : "/patient/login";

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch(url, {
//           method: "GET",
//           credentials: "include",
//         });

//         if (!res.ok) {
//           setIsAuth(false);
//           return;
//         }

//         const data = await res.json();

//         if (data.user?.role === role) {
//           setIsAuth(true);
//         } else {
//           setIsAuth(false);
//         }
//       } catch (err) {
//         setIsAuth(false);
//       }
//     };

//     checkAuth();
//   }, [url, role]);

//   if (isAuth === null) return <p>Loading...</p>;

//   return isAuth ? children : <Navigate to={redirectPath} replace />;
// };

// export default ProtectedRoute;

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const [state, setState] = useState({
    loading: true,
    isAuth: false,
  });

  let url = "";
  let redirectPath = "/";

  // ✅ Decide API + redirect based on role
  if (role === "doctor") {
    url = `${process.env.REACT_APP_API_URL}/api/Doctor/profile`;
    redirectPath = "/DoctorLogin";
  } else if (role === "patient") {
    url = `${process.env.REACT_APP_API_URL}/api/Patient/profile`;
    redirectPath = "/patient/login";
  } else if (role === "admin") {
    url = `${process.env.REACT_APP_API_URL}/api/admin/dashboard`; // ✅ FIXED
    redirectPath = "/admin/login";
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setState({ loading: false, isAuth: false });
          return;
        }

        const data = await res.json();

        // ✅ For admin (no user object usually)
        if (role === "admin") {
          setState({ loading: false, isAuth: true });
        } 
        // ✅ For doctor/patient
        else if (data.user?.role === role) {
          setState({ loading: false, isAuth: true });
        } else {
          setState({ loading: false, isAuth: false });
        }

      } catch (err) {
        setState({ loading: false, isAuth: false });
      }
    };

    checkAuth();
  }, [url, role]);

  if (state.loading) return <p>Loading...</p>;

  return state.isAuth ? children : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;