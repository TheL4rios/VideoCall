const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = new express();
const http = require("https").createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;
const peer = require('peer');

app.use('/peerjs', peer.ExpressPeerServer(http, {
    debug: true
}));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.post('/room.html', (request, response) => {
    const room = request.body.room;
    const pass = request.body.password;
    response.redirect('/room.html/' + room + pass);
});

app.get('/room.html/:data', (request, response) => {
    response.render('room', {room: request.params.data});
});

io.on('connection', (socket) => {
    socket.on('join', (room, peerId) => {
        socket.join(room);
        socket.to(room).broadcast.emit('user-connected', peerId);
        socket.on('message', (message) => {
            io.to(room).emit('new-message', message);
        });

        socket.on('disconnect', () => {
            socket.to(room).broadcast.emit('user-disconnected', peerId);
        });
    });
});

http.listen(port, () => {
    console.log('Running in port ' + port);
});