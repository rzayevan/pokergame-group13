let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let User = require("./model/User.js");
const { v4: uuidv4 } = require('uuid');
let PokerController = require("./controllers/PokerController.js");
let ReportController = require("./controllers/ReportController.js");
let pokerController, reportController;

const DataAccessLayer = require('./controllers/DataAccessLayer.js');
const UserUtils = require('./utilities/UserUtils.js');
const ReportUtils = require('./utilities/ReportUtils.js');

let rooms = {};

http.listen(3000, () => {
    let users = DataAccessLayer.ReadUsersFile();
    let reports = DataAccessLayer.ReadReportsFile();

    // Declare the amount of each room type to create
    // TODO: Make this dynamic
    let numberOfEachRoom = 2;
    pokerController = new PokerController(numberOfEachRoom);

    reportController = new ReportController();

    console.log('Listening on port *: 3000');
    console.log("Creating Tables");


    //Create set number of tables on server startup

    for (let x = 1; x <= 10; x++) {
        //Create x number of rooms 
        const room = {
            id: uuidv4(),
            name: "Table " + x,
            buyin: 20000,
            blinds: "1000 / 2000",
            sockets: []
        }
        rooms[room.id] = room;
    }

    console.log(rooms);

});

io.on('connection', (socket) => {
    console.log("Client connected.");
    console.log(rooms)
    socket.emit("connected", "Hello from server");
    socket.emit("serve-tables", rooms);

    socket.on('add-new-user', function(user) {
        // create a new user if the email provided is unique
        if (!UserUtils.emailExists(user)) {
            let newUser = new User();
            newUser.CreateNewUser(user.username, user.password, user.email);
            DataAccessLayer.AddUserToFile(newUser);
            socket.emit("alert text", "Successfully signed up!");
        } else {
            socket.emit("alert text", "Email provided already exists. Please try again.");
        }
    });

    socket.on('authenticate user', function(user) {
        // authenticate the user if the credentials provided exist in the stored data
        if (UserUtils.credentialsMatch(user)) {
            socket.emit("authenticated", user);
        } else {
            socket.emit("alert text", "Authentication failed. Please try again.");
        }
    });

    socket.on('disconnect', function() {
        console.log('disconnected');
    });

    socket.on('request reports', function() {
        reportController.retrieveReports(this, false);
    });

    socket.on('review report', function(updateData) {
        ReportUtils.reviewReport(updateData);
        reportController.retrieveReports(this, true);
    });

    // start of added code to talk with poker.vue
    // these next two functions are temporary, need to login and join table via login page and tables page
    socket.on('joinRoomRequest', function(msg) { // a user wishes to join a room/table
        pokerController.joinRoom(io, socket, msg);
    });

    // each player will send a message upon a game play button click, this will check whether or not it is the player's turn and if the move is valid
    socket.on('turnDecision', function(msg) {
        pokerController.turnDecision(io, socket, msg);
    });

    socket.on('exitRoomRequest', function(msg) {
        pokerController.exitRoomRequest(io, socket, msg);
    });

    //Adds player to room 
    socket.on('join-room', (roomId, callback) => {
        const room = rooms[roomId];
        joinRoom(socket, room);
    });
});

//Function to handle joining a room
const joinRoom = (socket, room) => {
    room.sockets.push(socket);
    socket.join(room.id, () => {
        socket.roomId = room.id;
        console.log(socket.id, "Joined", room.id);

    });
};