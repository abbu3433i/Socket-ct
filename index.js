const express = require('express');
const { createServer } = require('node:http');
const app = express();

const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server);

app.set('view engine','ejs')


app.get('/', (req, res) => {
    res.render('index');
});


io.on('connection', (socket) => {   //ye connection banata he fronend ka backend se or iske andar hi soket ka code likhayega
    console.log('a user connected');

    socket.on('chat message', (msg) => {
    //   console.log('message: ' + msg);
    io.emit('chat message', msg);
    });


    //====================================================================

    let users = {};  //created for data store

    socket.on('join', (username) => {  //-------------------soket.on helps to receive the code came from frontend
        users[socket.id] = username;  //--------------------users ke andar jo bhi username store ho uske liye ek unique id generate kar do
        socket.broadcast.emit('user connected', username); //--------ye username ko sabhi jagah broadcast kar dega
        io.emit('update users', Object.values(users));    //---------(object.value) ek javascript ka fn he jo [users] me data store hoga key or value ki form me usme se sirf value nikaal lega
        console.log(username);
    });



  });//---io.on


server.listen(3000, () => {
  console.log('server running');
});