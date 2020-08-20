document.addEventListener('DOMContentLoaded', () => {
    init();
});

const ROOM_ID = String(window.location).split('/')[4];
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80)
});

navigator.getUserMedia = (navigator.getUserMedia        ||
                          navigator.webkitGetUserMedia  ||
                          navigator.mozGetUserMedia     ||
                          navigator.msgGetUserMedia     ||
                          navigator.mediaDevices);
let localCamera;
let allVideos = {};
const socket = io();

peer.on('open', (peerId) => {
    socket.emit('join', ROOM_ID, peerId);
});

socket.on('user-disconnected', (peerId) => {
    if (allVideos[peerId]) {
        allVideos[peerId].remove(); 
        videoAdjust();
    }
});

socket.on('new-message', (message) => {
    const div = document.createElement('div');
    div.className = 'message';
    const p = document.createElement('p');
    p.append(message);
    div.appendChild(p);
    document.getElementById('messages').appendChild(div);
});

function initCamera(video, mic) {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: video, audio: mic},(stream) => {
            localCamera = stream;
            const video = document.createElement('video');
            loadCamera(video, stream);
            peerConnection(stream);
        },() => {});
    }
}

init = function() {
    initCamera(camera, mic);
}

function peerConnection(stream) {
    const video = document.createElement('video');
    peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (videoStream) => {
            loadCamera(video, videoStream);
        });
    });

    socket.on('user-connected', (peerId) => {
        connectToUser(peerId, stream);
    });
}

function connectToUser(peerId, stream) {
    const video = document.createElement('video');
    allVideos[peerId] = video;
    const call = peer.call(peerId, stream);
    call.on('stream', (videoStream) => {
        loadCamera(video, videoStream);
    });
}

function loadCamera(video, stream){
    video.className = 'video';
    video.autoplay = 'true';
    document.getElementById('video-section').appendChild(video);

    try {
        video.srcObject = stream;
    } catch (error) {
        video.src = (window.URL || window.webkitURL).createObjectURL(stream);
    }

    videoAdjust();
}

function videoAdjust() {
    let videos = document.getElementsByTagName('video');
    let width = 0;
    let height = 100;

    if (videos.length > 8) {
        height = (100 / Math.ceil(videos.length / 8)) - 1;
        width = (100 / 8) - 1;
    } else {
        width = (100 / videos.length) - 1;
    }

    for (let i = 0; i < videos.length; i++) {
        videos[i].style.height = height + '%';
        videos[i].style.width = width + '%';
        videos[i].style.marginLeft = '0.5%';
    }
}

document.getElementById('mic').addEventListener('click', () => {
    let mic = localCamera.getAudioTracks()[0].enabled;
    
    if (!mic) {
        localCamera.getAudioTracks()[0].enabled = true;
        document.getElementById('mic-img').src = '../img/icons/mic.png';
    } else {
        localCamera.getAudioTracks()[0].enabled = false;
        document.getElementById('mic-img').src = '../img/icons/mic-off.png';
    }
});

document.getElementById('camera').addEventListener('click', () => {
    let camera = localCamera.getVideoTracks()[0].enabled;
    
    if (!camera) {
        localCamera.getVideoTracks()[0].enabled = true;
        document.getElementById('camera-img').src = '../img/icons/camera.png';
    } else {
        localCamera.getVideoTracks()[0].enabled = false;
        document.getElementById('camera-img').src = '../img/icons/camera-off.png';
    }
});

document.getElementById('call').addEventListener('click', () => {
    window.history.back();
});

document.getElementById('message').addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        let text = document.getElementById('message').value;

        if (text != '') {
            socket.emit('message', text);
            document.getElementById('message').value = '';
        }
    }
});