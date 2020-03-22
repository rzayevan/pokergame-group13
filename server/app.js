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

    socket.on('add-new-user', function(user) {
        // create a new user is the email provided is unique
        if (!UserUtils.emailExists(user)) {
            let newUser = new User();
            newUser.CreateNewUser(user.username, user.email, user.password);
            DataAccessLayer.AddUserToFile(newUser);
        }
    });

    socket.on('authenticate user', function(user) {
        // authenticate the user if the credentials provided exist in the stored data
        if (UserUtils.credentialsMatch(user)) {
            socket.emit("authenticated", user);
        }
    });
});