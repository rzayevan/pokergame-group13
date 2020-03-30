let PokerTable = require("./PokerTableObjects/PokerTable.js");
let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let User = require("./model/User.js");

const DataAccessLayer = require('./controllers/DataAccessLayer.js');
const UserUtils = require('./utilities/UserUtils.js');
const ReportUtils = require('./utilities/ReportUtils.js');

http.listen(3000, () => {
    let users = DataAccessLayer.ReadUsersFile();
    let reports = DataAccessLayer.ReadReportsFile();
    console.log('Listening on port *: 3000');
});

io.on('connection', (socket) => {
    console.log("Client connected.");          
    socket.emit("connected", "Hello from server");

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

    socket.on('disconnect', function () {

        console.log('disconnected');
  
    });

    socket.on('request reports', function() {
        retrieveReports(this, false);
    });

    socket.on('review report', function(updateData) {
        ReportUtils.reviewReport(updateData);
        retrieveReports(this, true);
    });

    retrieveReports = function(socket, isUpdate) {
        let reportData = {
            reports: ReportUtils.getReports(),
            gridColumns: ["Offending User", "Submitted", "Offense", "Reported By"], 
        };

        if (isUpdate) {
            socket.broadcast.emit("receive reports", reportData);
        }
        else {
            socket.emit("receive reports", reportData);
        }
    }

    // start of added code to talk with poker.vue
    // these next two functions are temporary, need to login and join table via login page and tables page
    socket.on('joinRoomRequest', function(msg){ // a user wishes to join a room/table
        joinRoom(io, socket, msg);
    });

    // each player will send a message upon a game play button click, this will check whether or not it is the player's turn and if the move is valid
    socket.on('turnDecision', function(msg){
        turnDecision(io, socket, msg);
    });

    socket.on('exitRoomRequest', function(msg){
        exitRoomRequest(io, socket, msg);
    });
});


// a list of sample profiles already put into the system, these are not the real profiles (just hard coded ones)
// need to update to use the real profiles stored in the server
let profiles = [
    {userID: 1000, name: 'Mark123', chips: 20000, icon: 'player_icon_1'},
    {userID: 2000, name: 'John456', chips: 40000, icon: 'player_icon_1'},
    {userID: 3000, name: 'Luke854', chips: 60000, icon: 'player_icon_1'},
    {userID: 4000, name: 'Jane027', chips: 80000, icon: 'player_icon_1'},
    {userID: 5000, name: 'Stan693', chips: 10000, icon: 'player_icon_1'},
    {userID: 6000, name: 'Mack273', chips: 20, icon: 'player_icon_1'},
];
// the entire list of tables, might need a better way to store them?
let tables = [];
tables.push(new PokerTable(2000, 'Big Fish')); // initially we will have one table, with a big blind of 2000, when socket rooms are implemented then multiple tables will be added



const { v1: uuid } = require('uuid');
pokerTableStats = require("./PokerTableObjects/PokerUtilities.js").pokerTableStats;
let rooms = [];
let numberOfEachRoom = 2;
for (let i = 0; i < pokerTableStats.length; i++) { // for each type of table we create a few
    for(let j = 0; j < numberOfEachRoom; j++){ // right now two of each table is created
        let room = {
            id: uuid(),
            table: new PokerTable(pokerTableStats[i]),
        }
        rooms[i*numberOfEachRoom + j] = room;
    }
}
// these next two functions are for signing up a client to the poker table, need to use the real login and tables page to do this
function canUserJoinRoom(roomToJoin, profile){ // check if the user is permitted to join the table
    let table = roomToJoin.table;
    if(roomToJoin === undefined || table.isTableFull() || table.isPlayerAtTable(profile) || profile.chips < table.buyIn){
        return false; // the user cannot join this table/room
    }
    else{
        return true;
    }
}
function joinRoom(io, socket, msg){ // request sent from client that they want to join the table
    let profile = DataAccessLayer.ReadUsersFile().find(profile => profile.id === msg.userID); // get their profile
    let roomToJoin = rooms[msg.roomID]; // TODO: when tables is linked to poker, use .find(),
    let table = roomToJoin.table;
    if(canUserJoinRoom(roomToJoin, profile)){// the user can join the table
        profile.chips -= table.buyIn; // user pays the buy in
        DataAccessLayer.UpdateUser(profile); // we took the buy in from their account, update it
        let result = table.addPlayerToTable(profile, socket.id); // the table will fill a seat based on the profile and send back the seat id
        socket.join(roomToJoin.id); // now this client will receive messages from the tableName room
        socket.emit('joinRoom', {
            seatID: result.seatID,
            tableName: result.tableName, // used only for the chat title
            roomID: roomToJoin.id, // used for further communication
            bigBlind: result.bigBlind,
        });
        io.to(roomToJoin.id).emit('tableState', JSON.stringify(table.getTableState())); // send to everyone the updated table state in this room
        if(table.canAGameBegin() && !table.tableActive){ // check if we can begin a game
            table.tableActive = true; // the table is now active
            beginTheGame(io, roomToJoin);
        }
    }
}
function exitRoomRequest(io, socket, msg){
    let room = rooms.find(room => room.id === msg.roomID);
    let table = room.table;
    let user = DataAccessLayer.ReadUsersFile().find(user => user.id === msg.userID);
    user.chips += table.bootPlayer(user.id, io, room); // boot the player and return any chips they had (not including pot)
    DataAccessLayer.UpdateUser(user);
    socket.leave(room.id);
    socket.emit('leaveRoom');
    io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
    if(table.showdown){// after each move we need to check if the table is ready for a showdown
        beginShowingTheRemainingCommunityCards(io, room);
    }
}
// the functions for communication between the server and the poker.vue page
function beginTheGame(io, room){ // function will begin the game with a time out of 5 seconds
    setTimeout(function() { // in five seconds the game will begin
        let table = room.table;
        table.beginTheGame(); // the game is set up
        io.to(room.id).emit('tableState', JSON.stringify(table.getTableState())); // send to everyone the new table state
        for(let i = 0; i < table.numberOfTableSeats; i++){
            let seat = table.tableSeats[i];
            if(seat.socketID !== -1){
                io.to(`${seat.socketID}`).emit('beginTheGame', JSON.stringify(seat.cards));
            }
        }
        // now the player whos the current turn can send us a decision
    }, 5000);
}
function turnDecision(io, socket, msg){ // each player when clicking the poker.vue buttons will trigger this function, it will assess whether or not the move was valid
    let room = rooms.find(room => room.id === msg.roomID);
    let table = room.table;
    if(table.isItTheirTurn(msg.userID, msg.seatID, socket.id)){
        // there is a limited number of actions a player can take based on their current state
        // ask if they can make that move, if not then do nothing, later also disable buttons based on lack of options
        let response = table.playerAction(msg.action, msg.raiseToValue); // will assess the action and return a response
        if(response){
            io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
        }
        else{
            socket.emit('badMove');
        }
        if(table.showdown){// after each move we need to check if the table is ready for a showdown
           beginShowingTheRemainingCommunityCards(io, room);
        }
    }
}
function beginShowingTheRemainingCommunityCards(io, room){ // the remaining community cards are revealed, one at a time (used if a premature show down is called)
    let table = room.table;
    let count = table.communityCards.length - table.communityCardsShown;
    function showCommunityCard() { // each time this runs a single community card revealed
        if(count <= 0){ // we are done showing community cards now show player cards
            clearInterval(timeout);
            // now begin showing player cards
            showRemainingPlayerCards(io, room);
        }
        else{
            table.showOneMoreCommunityCard();
        }
        count--;
        io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
    }
    let timeout = setInterval(showCommunityCard, 2000);
}
function showRemainingPlayerCards(io, room){ // the players still in play will show their cards (backside)
    let table = room.table;
    setTimeout(function() { // all players in play will show their cards face down
        io.to(room.id).emit('showdown', JSON.stringify(table.getShowdownCardRevealState()));
        beginFlippingOverEachPlayersCards(io, room);
    }, 1000);
}
function beginFlippingOverEachPlayersCards(io, room){ // one at a time each player will flip their cards over
    let table = room.table;
    let count = table.getNumberOfPlayersStillInPlay();
    function flipNextPlayerCards(){ // each player one at a time will either show or 'throw away' their cards depending on if they have a higher hand
        count--;
        if(count < 1){
            clearInterval(timeout);
            setTimeout(function() { // all players have show or thrown their cards, now show the winner(s)
                let winners = table.getWinnerSocketIDs();
                for(let i = 0; i < winners.length; i++){
                    io.to(`${winners[i]}`).emit('winner');
                }
                calculateAndDistributeChips(io, room); // calculate the chip distribution
            }, 1000);
        }
        table.showNextPlayerCards();
        io.to(room.id).emit('showdown', JSON.stringify(table.getShowdownCardRevealState()));
    }
    let timeout = setInterval(flipNextPlayerCards, 2000);
}
function calculateAndDistributeChips(io, room){ // after a winner is found the chips are redistributed
    setTimeout(function() {
        let table = room.table;
        table.calculateAndDistributeChips();
        io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
        bootPlayers(io, room); // remove any players that lost all their chips
    }, 1000);
}
function bootPlayers(io, room){ // any players that lost all their chips are removed from the table
    setTimeout(function() {
        let table = room.table;
        table.bootPlayers(io, room); // will remove all players that have no more chips
        table.reset(); // reset the table for a new game
        io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
        io.to(room.id).emit('reset');
        if(table.canAGameBegin()){
            beginTheGame(io, room);
        }
        else{
            table.tableActive = false;
        }
    }, 2000);
}
