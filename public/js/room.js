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

socket.emit('join', ID);

socket.on('newMessage', (message) => {
    const div = document.createElement('div');
    div.className = 'message';
    const p = document.createElement('p');
    p.append(message);
    div.appendChild(p);
    document.getElementById('messages').appendChild(div);
});

socket.on('newStream', (stream) => {
    loadCamera(stream);
    videoAdjust();
});

init = function() {
    initCamera(camera, mic);
}

function initCamera(video, mic) {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: video, audio: mic},(stream) => {
            loadCamera(stream);
            socket.emit('stream', stream);
        },() => {});
    }
}

function loadCamera(stream){
    const video = document.createElement('video');
    video.className = 'video';
    video.autoplay = 'true';
    document.getElementById('video-section').appendChild(video);

    try {
        video.srcObject = stream;
    } catch (error) {
        video.src = (window.URL || window.webkitURL).createObjectURL(stream);
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
        let text = document.getElementById('message').value;

        if (text != '') {
            socket.emit('message', text);
            document.getElementById('message').value = '';
        }
    }
});