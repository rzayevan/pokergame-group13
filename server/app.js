let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let User = require("./model/User.js");
const { v1: uuid } = require('uuid');

let PokerController = require("./controllers/PokerController.js");
let ReportController = require("./controllers/ReportController.js");
let pokerController, reportController;

const DataAccessLayer = require('./controllers/DataAccessLayer.js');
const UserUtils = require('./utilities/UserUtils.js');
const ReportUtils = require('./utilities/ReportUtils.js');

http.listen(3000, () => {
    let users = DataAccessLayer.ReadUsersFile();
    let reports = DataAccessLayer.ReadReportsFile();

    // Declare the amount of each room type to create
    // TODO: Make this dynamic
    let numberOfEachRoom = 2;
    pokerController = new PokerController(numberOfEachRoom);

    reportController = new ReportController();

    console.log('Listening on port *: 3000');
});

io.on('connection', (socket) => {
    console.log("Client connected.");          
    socket.emit("connected", "Hello from server");

    socket.on('add-new-user', function(user) {
        // create a new user if the email provided is unique
        if (!UserUtils.emailExists(user)) {
            let newUser = new User();
            newUser.CreateNewUser(user.username, user.password, user.email, UserUtils.createUserIcon());
            DataAccessLayer.AddUserToFile(newUser);
            socket.emit("alert text", "Successfully signed up!");
        } else {
            socket.emit("alert text", "Email provided already exists. Please try again.");
        }
    });

    socket.on('authenticate user', function(user) {
        // authenticate the user if the credentials provided exist in the stored data
        let result = UserUtils.credentialsMatch(user);
        if (result.matchFound) {
            socket.emit("authenticated", result.userID);
        } else {
            socket.emit("alert text", "Authentication failed. Please try again.");
        }
    });

    socket.on('disconnect', function () {
        console.log('disconnected');
        pokerController.disconnectFromTable(io, socket);
    });

    socket.on('submit report', function(reportData) {
        console.log("in app")
        let submitReportSuccess = ReportUtils.submitReport(reportData);

        socket.emit("submitReportResponse", submitReportSuccess);

    })

    socket.on('request reports', function() {
        reportController.retrieveReports(this, false);
    });

    socket.on('review report', function(updateData) {
        ReportUtils.reviewReport(updateData);
        reportController.retrieveReports(this, true);
    });

    socket.on('serveRoomList', function() {
        socket.emit("receiveRoomList", pokerController.getRoomList());
    });
    
    // start of added code to talk with poker.vue
    // these next two functions are temporary, need to login and join table via login page and tables page
    socket.on('joinRoomRequest', function(msg){ // a user wishes to join a room/table
        pokerController.joinRoom(io, socket, msg);
    });

    // each player will send a message upon a game play button click, this will check whether or not it is the player's turn and if the move is valid
    socket.on('turnDecision', function(msg){
        pokerController.turnDecision(io, socket, msg);
    });

    socket.on('exitRoomRequest', function(msg){
        pokerController.exitRoomRequest(io, socket, msg);
    });

    socket.on('userSentMessage', function(msg) {
        let sender = UserUtils.getUser(msg.userID);

        let messageObject = {
            id: uuid(),
            senderID: msg.userID,
            name: sender.username,
            message: msg.message
        };

        // Send userReceivedMessage event to all users within table
        io.to(msg.roomID).emit("messageSentSuccessful", messageObject);
    });
});