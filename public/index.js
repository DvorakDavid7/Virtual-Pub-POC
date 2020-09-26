const socket = io.connect("/");
const peer = new Peer();
const videoGrid = document.querySelector("#video-grid");
const controlBtn = document.querySelector(".action-btn");


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


peer.on("open", id => {
    console.log(`peer on open ${id}`);
    socket.emit("join-room", ROOM_ID, id);
});


controlBtn.addEventListener("click", () => {
    socket.emit("sound-effect", ROOM_ID);
});

socket.on("sound-effect", () => {
    const audio = document.querySelector(".cheers");
    audio.play();
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