document.addEventListener('DOMContentLoaded', function() {
    init();
});

const ID = String(window.location).split('/')[4];

navigator.getUserMedia = (navigator.getUserMedia        ||
                          navigator.webkitGetUserMedia  ||
                          navigator.mozGetUserMedia     ||
                          navigator.msgGetUserMedia);
let mic = true;
let camera = true;
const socket = io();

socket.on('messages', (data) => {
    document.getElementById('messages').append(data);
});

init = function() {
    initCamera(camera, mic);
}

function initCamera(video, mic) {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: video, audio: mic},loadCamera,() => {});
        videoAdjust();
    }
}

function loadCamera(stream){
    const video = document.getElementById('video');

    try {
        video.srcObject = stream;
    } catch (error) {
        video.src = URL.createObjectURL(stream);
    }
}

function videoAdjust() {
    let videos = document.getElementsByTagName('video');
    let percent = 0;

    if (videos.length > 4) {
        percent = (100 / 4) - 1;
    } else {
        percent = (100 / videos.length) - 1;
    }

    for (let i = 0; i < videos.length; i++) {
        videos[i].style.width = percent + '%';
        videos[i].style.marginLeft = '0.5%';
    }
}

document.getElementById('mic').addEventListener('click', () => {
    mic = !mic;
    
    if (!mic) {
        document.getElementById('mic-img').src = '../img/icons/mic-off.png';
    } else {
        document.getElementById('mic-img').src = '../img/icons/mic.png';
    }

    initCamera(camera, mic);
});

document.getElementById('camera').addEventListener('click', () => {
    camera = !camera;
    
    if (!camera) {
        document.getElementById('camera-img').src = '../img/icons/camera-off.png';
    } else {
        document.getElementById('camera-img').src = '../img/icons/camera.png';
    }

    initCamera(camera, mic);
});

document.getElementById('call').addEventListener('click', () => {
    
});

document.getElementById('message').addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        
    }
});