import { useEffect } from "react";
import { useParams } from "react-router-dom";

const VideoCall = () => {
  const { appointmentId } = useParams();

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointments/meeting/${appointmentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // ✅ If you are using token auth
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

        const data = await response.json();

        const { meetingLink, role } = data;

        const roomName = meetingLink.split("/").pop();

        const domain = "meet.jit.si";

        const options = {
          roomName: roomName,
          width: "100%",
          height: 600,
          parentNode: document.getElementById("jitsi-container"),

          configOverwrite: {
            prejoinPageEnabled: false,
          },

          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        // ✅ DOCTOR enables waiting room
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
  }, [appointmentId]);

  return <div id="jitsi-container"></div>;
};

export default VideoCall;

// import { useEffect, useState } from "react";
// import { useParams,useLocation } from "react-router-dom";

// const VideoCall = () => {
//   const { appointmentId } = useParams();
//   const [meetingLink, setMeetingLink] = useState("");
//   const location = useLocation();

// const queryParams = new URLSearchParams(location.search);
// const role = queryParams.get("role"); // "patient"

//   useEffect(() => {
//     const fetchMeeting = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_API_URL}/api/appointment/meeting/${appointmentId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//             credentials: "include",
//           }
//         );

//         const data = await response.json();
//         setMeetingLink(data.meetingLink);
//       } catch (error) {
//         console.error("Error fetching meeting:", error);
//       }
//     };

//     fetchMeeting();
//   }, [appointmentId]);

//   // ✅ Ensure proper URL + enable lobby
//   const safeMeetingLink = meetingLink
//     ? meetingLink.startsWith("http")
//       ? `${meetingLink}#config.enableLobby=true`
//       : `https://meet.jit.si/${meetingLink}#config.enableLobby=true`
//     : "";

//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       {safeMeetingLink && (
//         <iframe
//           src={safeMeetingLink}
//           title="Video Call"
//           width="100%"
//           height="100%"
//           allow="camera; microphone; fullscreen; display-capture"
//           style={{ border: 0 }}
//         ></iframe>
//       )}
//     </div>
//   );
// };

// export default VideoCall;