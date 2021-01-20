const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");

const myPeer = new Peer(undefined, {
  // port: 3005,
  // host: "/"
  host: "mkpeerserver.herokuapp.com",
  secure:true,
  port:443
});

// Peer
myPeer.on("open", (id) => {
  console.log("your user id : ", id);
  socket.emit("join-room", ROOM_ID, id);
});

// Socket

// My Video
myVideo.muted = true;

// connect my video
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
    socket.on("user-connected", (userId) => {
      console.log("New User Connected with id : ", userId);
      connectToNewUser(userId, stream);
    });
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
  });

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
  console.log("Connect to other user of id : ", userId);
  const call = myPeer.call(userId, stream);
  const otherUserVideo = document.createElement("video");
  call.on("stream", (otherUserStream) => {
    console.log("Stream from other user : ", otherUserStream);
    addVideoStream(otherUserVideo, otherUserStream);
  });
  call.on("close", () => {
    otherUserVideo.remove();
  });
}
