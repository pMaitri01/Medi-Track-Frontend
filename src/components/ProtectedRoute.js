import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const [isAuth, setIsAuth] = useState(null);

  // decide API based on role
  const url =
    role === "doctor"
      ? `${process.env.REACT_APP_API_URL}/api/Doctor/profile`
      : `${process.env.REACT_APP_API_URL}/api/Patient/profile`;

  const redirectPath = role === "doctor" ? "/DoctorLogin" : "/patient/login";

  useEffect(() => {
    fetch(url, {
      credentials: "include",
    })
      .then((res) => setIsAuth(res.ok))
      .catch(() => setIsAuth(false));
  }, [url]);

  if (isAuth === null) return <p>Loading...</p>;

  return isAuth ? children : <Navigate to={redirectPath} />;
};

export default ProtectedRoute;