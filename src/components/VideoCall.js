import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const jitsiRef = useRef(null);

  useEffect(() => {
    const loadJitsi = async () => {
      try {
        // ✅ Get token correctly
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        // ✅ Fetch meeting (fix 401)
        await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointment/meeting/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const roomName = `meditrack-${appointmentId}`;

        // ✅ Function to start Jitsi
        const startJitsi = () => {
          if (jitsiRef.current) return; // prevent multiple frames

          const domain = "meet.jit.si";

          jitsiRef.current = new window.JitsiMeetExternalAPI(domain, {
            roomName: roomName,
            parentNode: jitsiContainerRef.current,
            width: "100%",
            height: "100%",
            configOverwrite: {
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              prejoinPageEnabled: false,
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

          // ✅ Redirect when call ends
          jitsiRef.current.addEventListener("readyToClose", () => {
            jitsiRef.current.dispose();
            navigate("/");
          });
        };

        // ✅ Load script only once
        if (!window.JitsiMeetExternalAPI) {
          const script = document.createElement("script");
          script.src = "https://meet.jit.si/external_api.js";
          script.async = true;
          document.body.appendChild(script);

          script.onload = startJitsi;
        } else {
          startJitsi();
        }
      } catch (error) {
        console.error("Error loading Jitsi:", error);
      }
    };

    loadJitsi();

    // ✅ Cleanup (important)
    return () => {
      if (jitsiRef.current) {
        jitsiRef.current.dispose();
        jitsiRef.current = null;
      }
    };
  }, [appointmentId, navigate]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div
        ref={jitsiContainerRef}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default VideoCall;