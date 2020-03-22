let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let User = require("./model/User.js");

const DataAccessLayer = require('./controllers/DataAccessLayer.js');
const UserUtils = require('./utilities/UserUtils.js');

http.listen(3000, () => {
    let users = DataAccessLayer.ReadUsersFile();
    console.log('Listening on port *: 3000');
});

io.on('connection', (socket) => {
    console.log("Client connected.");          
    socket.emit("connected", "Hello from server");

    socket.on('add-new-user', function(msg) {
        let splitUserString = msg.split(';');
        let newUser = new User();
        newUser.CreateNewUser(splitUserString[0], splitUserString[1], splitUserString[2]);
        DataAccessLayer.AddUserToFile(newUser);
    });

    socket.on('authenticate user', function(user) {
        if (UserUtils.isExistingUser(user)) {
            socket.emit("authenticated");
        }
    });
});