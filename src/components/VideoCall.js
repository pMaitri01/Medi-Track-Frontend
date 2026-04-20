// import { useEffect, useRef, useState, useCallback } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import socket from "../services/socket";
// import {
//   getLocalStream,
//   createPeerConnection,
//   createOffer,
//   handleOffer,
//   handleAnswer,
//   handleIceCandidate,
//   endCall,
// } from "../services/webrtc";

// export default function VideoCall() {
//   const { roomId } = useParams();
//   const location = useLocation();
//   const role = new URLSearchParams(location.search).get("role");
//   const userId = localStorage.getItem("userId"); // adjust if needed

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   const [callState, setCallState] = useState("idle");
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCamOff, setIsCamOff] = useState(false);

//   // Attach stream
//   const attachStream = (ref, stream) => {
//     if (ref.current) {
//       ref.current.srcObject = stream;
//     }
//   };

//   const onRemoteStream = useCallback((stream) => {
//     attachStream(remoteVideoRef, stream);
//     setCallState("active");
//   }, []);

//   useEffect(() => {
//     // ✅ Connect socket safely
//     if (!socket.connected) {
//       socket.connect();
//     }

//     socket.emit("join-room", { roomId, userId, role });

//     // ✅ Start camera with ERROR HANDLING
//     // const startMedia = async () => {
//     //   try {
//     //     const stream = await getLocalStream();
//     //     attachStream(localVideoRef, stream);
//     //   } catch (err) {
//     //     console.error("Camera error:", err.name, err.message);
//     //     alert("Camera/Microphone access failed: " + err.message);
//     //   }
//     // };

//     const startMedia = async () => {
//   try {
//     const stream = await getLocalStream();
//     attachStream(localVideoRef, stream);

//     // ✅ Create peer AFTER camera ready
//     createPeerConnection(socket, roomId, onRemoteStream);

//   } catch (err) {
//     console.error("Camera error:", err.name, err.message);
//   }
// };
//     startMedia();

//     // 👇 SOCKET EVENTS

//     socket.on("user-joined", async () => {
//   console.log("User joined room");

//   // ✅ BOTH sides create peer connection
//   createPeerConnection(socket, roomId, onRemoteStream);

//   // ✅ Doctor sends offer when patient joins
//   if (role === "doctor") {
//     createOffer(socket, roomId);
//     setCallState("waiting");
//   }
// });

//    socket.on("offer", async (offer) => {
//   console.log("Received offer");

//   // ✅ Ensure peer exists
//   createPeerConnection(socket, roomId, onRemoteStream);

//   await handleOffer(offer, socket, roomId);

//   setCallState("waiting");
// });

//     socket.on("answer", async (answer) => {
//       await handleAnswer(answer);
//     });

//     socket.on("ice-candidate", async (candidate) => {
//       await handleIceCandidate(candidate);
//     });

//     socket.on("call-ended", () => {
//       endCall();
//       setCallState("ended");
//     });

//     return () => {
//       socket.off("user-joined");
//       socket.off("call-started");
//       socket.off("offer");
//       socket.off("answer");
//       socket.off("ice-candidate");
//       socket.off("call-ended");

//       socket.disconnect();
//       endCall();
//     };
//   }, [roomId, userId, role, onRemoteStream]);

//   // ▶️ Doctor starts call
// //   const handleStartCall = () => {
// //     socket.emit("start-call", roomId);
// //     createOffer(socket, roomId);
// //     setCallState("waiting");
// //   };
// const handleStartCall = () => {
//   setCallState("waiting");
// };

//   // ❌ End call
//   const handleEndCall = () => {
//     socket.emit("end-call", roomId);
//     endCall();
//     setCallState("ended");
//   };

//   // 🔇 Mute toggle
//   const toggleMute = () => {
//     const stream = localVideoRef.current?.srcObject;
//     if (stream) {
//       stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
//       setIsMuted((m) => !m);
//     }
//   };

//   // 📷 Camera toggle
//   const toggleCamera = () => {
//     const stream = localVideoRef.current?.srcObject;
//     if (stream) {
//       stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
//       setIsCamOff((c) => !c);
//     }
//   };

//   if (callState === "ended") {
//     return <div className="text-center p-8">Call ended. Thank you!</div>;
//   }

//   return (
//     <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 min-h-screen">
//       {/* VIDEO AREA */}
//       <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden">
        
//         {/* Remote Video */}
//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           playsInline
//           className="w-full h-full object-cover"
//         />

//         {/* Local Video */}
//         <video
//           ref={localVideoRef}
//           autoPlay
//           playsInline
//           muted
//           className="absolute bottom-4 right-4 w-36 h-24 rounded-lg border-2 border-white object-cover"
//         />

//         {/* Overlay */}
//         {callState !== "active" && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-lg">
//             {callState === "idle" && "Ready to connect..."}
//             {callState === "waiting" && "Waiting for other participant..."}
//           </div>
//         )}
//       </div>

//       {/* CONTROLS */}
//       <div className="flex items-center gap-4 mt-2">
//         <button
//           onClick={toggleMute}
//           className="px-4 py-2 bg-gray-700 text-white rounded-full"
//         >
//           {isMuted ? "Unmute" : "Mute"}
//         </button>

//         <button
//           onClick={toggleCamera}
//           className="px-4 py-2 bg-gray-700 text-white rounded-full"
//         >
//           {isCamOff ? "Cam On" : "Cam Off"}
//         </button>

//         {/* Doctor only */}
//         {role === "doctor" && callState === "idle" && (
//           <button
//             onClick={handleStartCall}
//             className="px-6 py-2 bg-green-600 text-white rounded-full font-semibold"
//           >
//             Start Call
//           </button>
//         )}

//         <button
//           onClick={handleEndCall}
//           className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold"
//         >
//           End Call
//         </button>
//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../services/socket";
import {
  getLocalStream,
  createPeerConnection,
  createOffer,
  handleOffer,
  handleAnswer,
  handleIceCandidate,
  endCall,
} from "../services/webrtc";

export default function VideoCall() {
  const { roomId } = useParams();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");
  const userId = localStorage.getItem("userId");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [callState, setCallState] = useState("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  // Attach stream
  const attachStream = (ref, stream) => {
    if (ref.current) ref.current.srcObject = stream;
  };

  const onRemoteStream = useCallback((stream) => {
    attachStream(remoteVideoRef, stream);
    setCallState("active");
  }, []);

  useEffect(() => {
    // ✅ Connect socket
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", { roomId, userId, role });

    // ✅ Start camera FIRST
    const init = async () => {
      try {
        const stream = await getLocalStream();
        attachStream(localVideoRef, stream);

        // ✅ Create peer after camera
        createPeerConnection(socket, roomId, onRemoteStream);

        // ✅ Doctor auto-create offer after delay (FIXES timing issue)
        if (role === "doctor") {
          setTimeout(() => {
            console.log("Doctor sending offer...");
            createOffer(socket, roomId);
            setCallState("waiting");
          }, 2000);
        }

      } catch (err) {
        console.error("Camera error:", err.name, err.message);
        alert("Camera/Mic access failed");
      }
    };

    init();

    // ✅ SOCKET EVENTS

    socket.on("offer", async (offer) => {
      console.log("Received offer");

      createPeerConnection(socket, roomId, onRemoteStream);
      await handleOffer(offer, socket, roomId);

      setCallState("waiting");
    });

    socket.on("answer", async (answer) => {
      console.log("Received answer");
      await handleAnswer(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      await handleIceCandidate(candidate);
    });

    socket.on("call-ended", () => {
      endCall();
      setCallState("ended");
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("call-ended");

      socket.disconnect();
      endCall();
    };
  }, [roomId, userId, role, onRemoteStream]);

  // ❌ End call
  const handleEndCall = () => {
    socket.emit("end-call", roomId);
    endCall();
    setCallState("ended");
  };

  // 🔇 Mute
  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setIsMuted((m) => !m);
    }
  };

  // 📷 Camera
  const toggleCamera = () => {
    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setIsCamOff((c) => !c);
    }
  };

  if (callState === "ended") {
    return <div className="text-center p-8">Call ended. Thank you!</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 min-h-screen">
      
      {/* VIDEO AREA */}
      <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden">
        
        {/* Remote */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local */}
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 w-36 h-24 rounded-lg border-2 border-white object-cover"
        />

        {/* Overlay */}
        {callState !== "active" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-lg">
            {callState === "idle" && "Ready to connect..."}
            {callState === "waiting" && "Connecting..."}
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-4 mt-2">
        <button onClick={toggleMute} className="px-4 py-2 bg-gray-700 text-white rounded-full">
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <button onClick={toggleCamera} className="px-4 py-2 bg-gray-700 text-white rounded-full">
          {isCamOff ? "Cam On" : "Cam Off"}
        </button>

        <button onClick={handleEndCall} className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold">
          End Call
        </button>
      </div>
    </div>
  );
}