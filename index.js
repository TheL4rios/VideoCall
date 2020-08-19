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
    if (request.body.action == 'create') {
        const room = request.body.room;
        const pass = request.body.password;
        
        response.redirect('/room.html/' + room + pass);
    } else if (request.body.action == 'join') {
        
    } else {
        
    }
});

app.get('/room.html/:data', (request, response) => {
    response.render('room', {id: request.params.data});
});

io.on('connection', (socket) => {
    socket.join('sdf');
    io.to('sdf').emit('messages', 'hi');
});

/*io.on('connection', (socket) => {
    socket.on('stream', (image) => {
        socket.broadcast.emit('stream', image);
    });
});*/