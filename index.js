const express = require('express');

const app = new express();

app.listen(3000, () => {
    console.log('Running...');
});

app.use(express.static('page'));

/*app.get('/', (request, response) => {
    response.sendFile(__dirname + '/page/' + 'index.html');
});*/