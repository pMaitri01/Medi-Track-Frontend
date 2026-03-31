import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const [isAuth, setIsAuth] = useState(null);

  const url =
    role === "doctor"
      ? `${process.env.REACT_APP_API_URL}/api/Doctor/profile`
      : `${process.env.REACT_APP_API_URL}/api/Patient/profile`;

  const redirectPath =
    role === "doctor" ? "/DoctorLogin" : "/patient/login";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setIsAuth(false);
          return;
        }

        const data = await res.json();

        if (data.user?.role === role) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [url, role]);

  if (isAuth === null) return <p>Loading...</p>;

  return isAuth ? children : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;