let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let User = require("./model/User.js");
const { v1: uuid } = require('uuid');

let PokerController = require("./controllers/PokerController.js");
let ReportController = require("./controllers/ReportController.js");
let ChatMessage = require("./model/ChatMessage.js")
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

    socket.on('add-new-user', function(clientData) {
        // create a new user if the email provided is unique
        if (!UserUtils.emailExists(clientData)) {
            let newUser = new User();
            newUser.CreateNewUser(clientData.username, clientData.password, clientData.email, UserUtils.createUserIcon());
            DataAccessLayer.AddUserToFile(newUser);
            socket.emit("alert text", "Successfully signed up!");
            console.log(clientData.username + " has signed up.");
        } else {
            socket.emit("alert text", "Email provided already exists. Please try again.");
        }
    });

    socket.on('authenticate user', function(clientData) {
        // authenticate the user if the credentials provided exist in the stored data
        let result = UserUtils.credentialsMatch(clientData);
        if (result.matchFound && result.userData.isLoggedIn) {
            socket.emit("alert text", "You've already logged in. Please sign out of other sessions before trying again.");
        } else if (result.matchFound) {
            if(result.banned){
                socket.emit("banned");
            } else {
                // log the user in and notify the client
                let updatedUser = UserUtils.setUserLogInStatus(result.userData, true);
                socket.emit("authenticated", updatedUser);
                console.log(result.userData.username + " has logged in.");  

                let loggedInResult = DataAccessLayer.UserLoggedIn(result.userData.id);
                // at this moment the user's funds have already been updated we want to send a visual effect
                // so send back the user's funds - bonus, and the bonus, the user will click and their displayed funds is updated
                if(loggedInResult.dailyBonus !== 0){
                    // we want the bonus to show up after the table list has, set a timeout function
                    setTimeout(function(){ socket.emit("dailyBonus", loggedInResult) }, 1000); // 1 second seems fair
                }
                else{
                    socket.emit("acountChips", loggedInResult.accountChips);
                }
            }
        } else {
            socket.emit("alert text", "Authentication failed. Please try again.");
        }
    });

    socket.on('log out user', function(clientData) {
        let user = UserUtils.getUserFromClientData(clientData);
        UserUtils.setUserLogInStatus(user, false);
        console.log(user.username + " has logged out.");   
    });

    socket.on('disconnect', function () {
        console.log('disconnected');
        pokerController.disconnectFromTable(io, socket);
    });

    // Attempt to submit the report and return the result of the attempt
    socket.on('submit report', function(reportData) {
        let submitReportSuccess = ReportUtils.submitReport(reportData);

        // If a report was successfully submitted, update the table for admins
        if (submitReportSuccess) {
            io.emit('update reports', ReportUtils.getReports());
        }

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
        let sender = UserUtils.getUserById(msg.userID);
        if(sender !== undefined){
            let messageObject = {
                id: uuid(),
                senderID: msg.userID,
                name: sender.username,
                message: msg.message
            };

            let storedMessage = new ChatMessage(msg.roomID, sender, msg.message);
            DataAccessLayer.AddMessageToCache(storedMessage);

            // Send userReceivedMessage event to all users within table
            io.to(msg.roomID).emit("messageSentSuccessful", messageObject);
        }
    });
});