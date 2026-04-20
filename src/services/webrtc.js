// const ICE_SERVERS = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     { urls: "stun:stun1.l.google.com:19302" },
//   ],
// };

// let peerConnection = null;
// let localStream = null;

// export const getLocalStream = async () => {
//   localStream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//   });
//   return localStream;
// };

// export const createPeerConnection = (socket, roomId, onRemoteStream) => {
//   peerConnection = new RTCPeerConnection(ICE_SERVERS);

//   // Add local tracks to the connection
//   localStream.getTracks().forEach((track) => {
//     peerConnection.addTrack(track, localStream);
//   });

//   // When remote stream arrives, pass it to the callback
//   peerConnection.ontrack = (event) => {
//     onRemoteStream(event.streams[0]);
//   };

//   // Send ICE candidates to the other peer via server
//   peerConnection.onicecandidate = (event) => {
//     if (event.candidate) {
//       socket.emit("ice-candidate", { candidate: event.candidate, roomId });
//     }
//   };

//   return peerConnection;
// };

// export const createOffer = async (socket, roomId) => {
//   const offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(offer);
//   socket.emit("offer", { offer, roomId });
// };

// export const handleOffer = async (offer, socket, roomId) => {
//   await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//   const answer = await peerConnection.createAnswer();
//   await peerConnection.setLocalDescription(answer);
//   socket.emit("answer", { answer, roomId });
// };

// export const handleAnswer = async (answer) => {
//   await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
// };

// export const handleIceCandidate = async (candidate) => {
//   await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
// };

// export const endCall = () => {
//   localStream?.getTracks().forEach((t) => t.stop());
//   peerConnection?.close();
//   peerConnection = null;
//   localStream = null;
// };

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

let peerConnection = null;
let localStream = null;

// ✅ Get camera safely
export const getLocalStream = async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return localStream;
  } catch (err) {
    console.error("getUserMedia error:", err.name, err.message);
    throw err;
  }
};

// ✅ Create Peer Connection safely
export const createPeerConnection = (socket, roomId, onRemoteStream) => {
  if (peerConnection) return peerConnection;

  peerConnection = new RTCPeerConnection(ICE_SERVERS);

  // 🚨 Ensure localStream exists
  if (!localStream) {
    console.error("Local stream not available!");
    return;
  }

  // Add tracks
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Remote stream
  peerConnection.ontrack = (event) => {
    onRemoteStream(event.streams[0]);
  };

  // ICE
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        candidate: event.candidate,
        roomId,
      });
    }
  };

  return peerConnection;
};

// ✅ Create Offer
export const createOffer = async (socket, roomId) => {
  if (!peerConnection) return;

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("offer", { offer, roomId });
};

// ✅ Handle Offer (FIXED)
export const handleOffer = async (offer, socket, roomId) => {
  if (!peerConnection) {
    console.error("PeerConnection not initialized!");
    return;
  }

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(offer)
  );

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("answer", { answer, roomId });
};

// ✅ Handle Answer
export const handleAnswer = async (answer) => {
  if (!peerConnection) return;

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(answer)
  );
};

// ✅ Handle ICE
export const handleIceCandidate = async (candidate) => {
  try {
    if (peerConnection) {
      await peerConnection.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    }
  } catch (err) {
    console.error("ICE error:", err);
  }
};

// ✅ End Call
export const endCall = () => {
  localStream?.getTracks().forEach((t) => t.stop());
  peerConnection?.close();

  peerConnection = null;
  localStream = null;
};