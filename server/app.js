let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

const DataAccessLayer = require('./controllers/DataAccessLayer.js')

http.listen(3000, () => {
    let users = DataAccessLayer.ReadUsersFile();
    console.log(users);
    console.log('Listening on port *: 3000');
});

io.on('connection', (socket) => {
    console.log("Client connected.");          
    socket.emit("connected", "Hello from server");

    socket.on('add-new-user', function(msg) {
        let splitUserString = msg.split(';');
        let newUser = {
            username: splitUserString[0],
            password: splitUserString[1],
            email: splitUserString[2],
            gold: 100
        };
        DataAccessLayer.AddUserToFile(newUser);
    });
});