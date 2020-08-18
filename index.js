const express = require('express');
var bodyParser = require('body-parser');
const app = new express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

http.listen(port, () => {
    console.log('Running in port ' + port);
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

/*io.on('connection', (socket) => {
    socket.on('stream', (image) => {
        socket.broadcast.emit('stram', image);
    });
});*/

app.post('/room.html', function(request, response) {
    if (request.body.action == 'create') {
        const room = request.body.room;
        const pass = request.body.password;
        
        io.on('connection', (socket) => {
            response.status(200);
            socket.join(room + pass);
            response.redirect('/room.html');
            io.to(room + pass).emit('messages', 'hi');
        });
    } else if (request.body.action == 'join') {
        
    } else {
        
    }
});

/*io.on('connection', (socket) => {
    socket.on('stream', (image) => {
        socket.broadcast.emit('stream', image);
    });
});*/