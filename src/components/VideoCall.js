import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    const loadJitsi = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/meeting/${appointmentId}`
      );
      const data = await response.json();

      const roomName = data.roomId; // IMPORTANT

      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const domain = "meet.jit.si";

        const api = new window.JitsiMeetExternalAPI(domain, {
          roomName: roomName,
          parentNode: jitsiContainerRef.current,
          width: "100%",
          height: "100%",
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,

              prejoinPageEnabled: false,   
            enableLobby: false,           
            enableUserRolesBasedOnToken: false,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "hangup",
              "chat",
            ],
          },
        });

        // 🔴 IMPORTANT: handle end call
        // api.addEventListener("readyToClose", () => {
        //   api.dispose();
        //   navigate("/"); // redirect to homepage
        // });
        
        api.addEventListener("readyToClose", () => {
          api.dispose();
          navigate("/");
        });
      };
    };

    loadJitsi();
  }, [appointmentId, navigate]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div ref={jitsiContainerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default VideoCall;