import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword  from "./ForgotPassword";
import OtpVerification from "./OtpVerification";
import ResetPassword   from "./ResetPassword";

// Controls which step is shown
const DoctorForgotFlow = () => {
  const [step, setStep]   = useState("forgot"); // forgot | otp | reset
  const [email, setEmail] = useState("");
  const navigate          = useNavigate();

  const handleBack = (to) => {
    if (to === "login") navigate("/DoctorLogin");
    else setStep(to);
  };

  if (step === "forgot")
    return (
      <ForgotPassword
        onBack={handleBack}
        onNext={(mail) => { setEmail(mail); setStep("otp"); }}
      />
    );

  if (step === "otp")
    return (
      <OtpVerification
        email={email}
        onBack={handleBack}
        onSuccess={() => setStep("reset")}
      />
    );

  return <ResetPassword onDone={() => navigate("/DoctorLogin")} />;
};

export default DoctorForgotFlow;
