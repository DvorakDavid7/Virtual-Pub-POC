const socket = io.connect("/");
const peer = new Peer();
const videoGrid = document.querySelector("#video-grid");

const peers = {};

const video = document.createElement("video");
video.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(video, stream);

    peer.on("call", call => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", userVideoStream => {
            addVideoStream(video, userVideoStream)
        });
    });

    socket.on("user-connected", userId => {
        connectToNewUser(userId, stream);
    });
});

/* socket.on("user-disconnected", userId => {
    console.log(userId);
}); */

peer.on("open", id => {
    console.log("open");
    socket.emit("join-room", ROOM_ID, id);
});



function connectToNewUser(userId, stream) {
    console.log("connect to new user");
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
    });
    call.on("close", () => {
        video.remove()
    });

    peers[userId] = call
}


function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    videoGrid.appendChild(video);
}