// const ICE_SERVERS = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     { urls: "stun:stun1.l.google.com:19302" },
//   ],
// };
// let pendingCandidates = [];
// let peerConnection = null;
// let localStream = null;

// // ============================
// // GET LOCAL STREAM
// // ============================
// export const getLocalStream = async () => {
//   try {
//     localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     return localStream;
//   } catch (err) {
//     console.error("getUserMedia error:", err.name, err.message);
//     throw err;
//   }
// };

// // ============================
// // CREATE PEER CONNECTION
// // ============================
// export const createPeerConnection = (socket, roomId, onRemoteStream) => {
//   if (peerConnection) return peerConnection;

//   peerConnection = new RTCPeerConnection(ICE_SERVERS);

//   // Remote stream
//   peerConnection.ontrack = (event) => {
//     onRemoteStream(event.streams[0]);
//   };

//   // ICE candidate
//   peerConnection.onicecandidate = (event) => {
//     if (event.candidate) {
//       socket.emit("ice-candidate", {
//         candidate: event.candidate,
//         roomId,
//       });
//     }
//   };

//   // Add local tracks safely
//   if (localStream) {
//     localStream.getTracks().forEach((track) => {
//       peerConnection.addTrack(track, localStream);
//     });
//   }

//   return peerConnection;
// };

// // ============================
// // CREATE OFFER (DOCTOR)
// // ============================
// export const createOffer = async (socket, roomId) => {
//   if (!peerConnection) return;

//   const offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(offer);

//   socket.emit("offer", { offer, roomId });
// };

// // ============================
// // HANDLE OFFER (PATIENT)
// // ============================
// export const handleOffer = async (offer, socket, roomId) => {
//   if (!peerConnection) return;

//   // allow only valid transition
//   if (
//     peerConnection.signalingState !== "stable" &&
//     peerConnection.signalingState !== "have-remote-offer"
//   ) {
//     console.log("Skipping offer:", peerConnection.signalingState);
//     return;
//   }

//   await peerConnection.setRemoteDescription(
//     new RTCSessionDescription(offer)
//   );

//   const answer = await peerConnection.createAnswer();
//   await peerConnection.setLocalDescription(answer);

//   socket.emit("answer", { answer, roomId });
// };

// // ============================
// // HANDLE ANSWER (DOCTOR)
// // ============================
// export const handleAnswer = async (answer) => {
//   if (!peerConnection) return;

//   if (peerConnection.signalingState !== "have-local-offer") {
//     console.log("Skipping answer:", peerConnection.signalingState);
//     return;
//   }

//   await peerConnection.setRemoteDescription(
//     new RTCSessionDescription(answer)
//   );
// };
// // ============================
// // HANDLE ICE CANDIDATE
// // ============================
// export const handleIceCandidate = async (candidate) => {
//   try {
//     if (!peerConnection || !peerConnection.remoteDescription) {
//       return; // silently ignore early ICE
//     }

//     await peerConnection.addIceCandidate(
//       new RTCIceCandidate(candidate)
//     );
//   } catch (err) {
//     console.error("ICE error:", err);
//   }
// };

// // ============================
// // END CALL
// // ============================
// export const endCall = () => {
//   localStream?.getTracks().forEach((t) => t.stop());

//   peerConnection?.close();
//   peerConnection = null;
//   localStream = null;
// };

// // ============================
// // CLEANUP
// // ============================
// export const cleanupCall = () => {
//   endCall();
// };

let peerConnection = null;
let localStream = null;

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// ---------------- STREAM ----------------
export const getLocalStream = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  return localStream;
};

// ---------------- PEER ----------------
export const createPeerConnection = (socket, roomId, onRemoteStream) => {
  if (peerConnection) return peerConnection;

  peerConnection = new RTCPeerConnection(ICE_SERVERS);

  peerConnection.ontrack = (event) => {
    onRemoteStream(event.streams[0]);
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        candidate: event.candidate,
        roomId,
      });
    }
  };

  // attach local tracks
  localStream?.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  return peerConnection;
};

// ---------------- OFFER ----------------
export const createOffer = async (socket, roomId) => {
  if (!peerConnection) return;

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("offer", { offer, roomId });
};

// ---------------- ANSWER ----------------
export const handleOffer = async (offer, socket, roomId) => {
  if (!peerConnection) return;

  if (peerConnection.signalingState !== "stable") return;

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(offer)
  );

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("answer", { answer, roomId });
};

export const handleAnswer = async (answer) => {
  if (!peerConnection) return;

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(answer)
  );
};

// ---------------- ICE ----------------
export const handleIceCandidate = async (candidate) => {
  try {
    if (peerConnection && peerConnection.remoteDescription) {
      await peerConnection.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    }
  } catch (err) {
    console.log("ICE error:", err);
  }
};

// ---------------- END CALL ----------------
export const endCall = () => {
  localStream?.getTracks().forEach((t) => t.stop());
  peerConnection?.close();

  peerConnection = null;
  localStream = null;
};