const express = require('express');
var bodyParser = require('body-parser');
const app = new express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

http.listen(port, () => {
    console.log('Running in port ' + port);
});

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
    socket.on('join', (room) => {
        socket.join(room);

        socket.on('message', (message) => {
            io.to(room).emit('newMessage', message);
        });

        socket.on('stream', (stream) => {
            socket.broadcast.emit('newStream', stream);
            //io.to(room).emit('newStream', stream);
        });
    });
});