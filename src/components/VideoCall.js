import { useEffect } from "react";
import { useParams } from "react-router-dom";

const VideoCall = () => {
  const { appointmentId } = useParams();

  useEffect(() => {
    let api = null;

    const fetchMeeting = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointment/meeting/${appointmentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

        // ❗ check backend error first
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Backend Error:", errorText);
          return;
        }

        const data = await response.json();

        console.log("Meeting API Response:", data);

        const { meetingLink, role } = data || {};

        // ❗ protect against undefined
        if (!meetingLink) {
          console.error("meetingLink is missing from API response");
          return;
        }

        const roomName = meetingLink.split("/").pop();

        const container = document.getElementById("jitsi-container");
        if (!container) return;

        container.innerHTML = "";

        const domain = "meet.jit.si";

        const options = {
          roomName,
          width: "100%",
          height: 600,
          parentNode: container,
          configOverwrite: {
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
          },
        };

        api = new window.JitsiMeetExternalAPI(domain, options);

        api.addEventListener("videoConferenceJoined", () => {
          if (role === "doctor") {
            api.executeCommand("toggleLobby", true);
          }
        });
      } catch (error) {
        console.error("Error fetching meeting:", error);
      }
    };

    fetchMeeting();

    return () => {
      if (api) api.dispose();
    };
  }, [appointmentId]);

  return <div id="jitsi-container" style={{ width: "100%", height: "600px" }} />;
};

export default VideoCall;