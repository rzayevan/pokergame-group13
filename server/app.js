let PokerTable = require("./PokerTableObjects/PokerTable.js");

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let User = require("./model/User.js");

const DataAccessLayer = require('./controllers/DataAccessLayer.js');
const UserUtils = require('./utilities/UserUtils.js');

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

    // start of added code to talk with poker.vue
    // these next two functions are temporary, need to login and join table via login page and tables page
    socket.on("logIn", function(msg){
        login(socket, msg);
    });
    socket.on('joinTable', function(msg){ // a user wishes to join a table
        joinTable(io, socket, msg);
    });

    // each player will send a message upon a game play button click, this will check whether or not it is the correct player's turn and if the move is valid
    socket.on('turnDecision', function(msg){
        turnDecision(io, socket, msg);
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
tables.push(new PokerTable(2000)); // initially we will have one table, with a big blind of 2000, when socket rooms are implemented then multiple tables will be added


// these next three functions are for signing up a client to the poker table, need to use the real login and tables page to do this
function login(socket, msg){
    let profile = profiles.find(profile => profile.userID === msg);
    if(profile === undefined){// the user does not exist
        return;
    }
    else{// send the current table state
        socket.emit('tableState', JSON.stringify(tables[0].getTableState()));
    }
}
function canUserJoinTable(tableToJoin, profile){
    if(tableToJoin === undefined || tableToJoin.isTableFull() || tableToJoin.isPlayerAtTable(profile) || profile.chips < tableToJoin.buyIn){
        return false; // the user cannot join this table
    }
    else{
        return true;
    }
}
function joinTable(io, socket, msg){
    let profile = profiles.find(profile => profile.userID === msg.userID); // get their profile
    let tableToJoin = tables.find(table => table.tableID === msg.tableID); // get the table they wish to join
    if(canUserJoinTable(tableToJoin, profile)){// the user can join the table
        let seatID = tableToJoin.addPlayerToTable(profile, socket.id); // the table will fill a seat based on the profile and send back the seat id
        socket.emit('yourSeatID', seatID); // send him back his tableSeatID
        io.emit('tableState', JSON.stringify(tableToJoin.getTableState())); // send to everyone the updated table state
        if(tableToJoin.canAGameBegin() && !tableToJoin.tableActive){ // check if we can begin a game
            tableToJoin.tableActive = true; // the table is now active
            beginTheGame(io, tableToJoin);
        }
    }
    else{
        return; // the user can not join the table
    }
}
// the functions for communication between the server and the poker.vue page
function beginTheGame(io, table){ // function will begin the game with a time out of 5 seconds
    setTimeout(function() { // in five seconds the game will begin
        table.beginTheGame(); // the game is set up
        io.emit('tableState', JSON.stringify(table.getTableState())); // send to everyone the new table state
        for(let i = 0; i < 6; i++){
            let seat = table.tableSeats[i];
            if(seat.socketID !== -1){
                io.to(`${seat.socketID}`).emit('beginTheGame', JSON.stringify(seat.cards));
            }
        }
        // now the player whos the current turn can send us a decision
    }, 5000);
}
function turnDecision(io, socket, msg){ // each player when clicking the poker.vue buttons will trigger this function, it will assess whether or not the move was valid
    let table = tables[msg.tableID];
    if(table.isItTheirTurn(msg.userID, msg.seatID, socket.id)){
        // there is a limited number of actions a player can take based on their current state
        // ask if they can make that move, if not then do nothing, later also disable buttons based on lack of options
        let response = table.playerAction(msg.action, msg.raiseToValue); // will assess the action and return a response
        if(response){
            io.emit('tableState', JSON.stringify(table.getTableState()));
        }
        else{
            console.log('bad move'); // later send message back to client that their move was invalid
        }
        if(table.showdown){// after each move we need to check if the table is ready for a showdown
           beginShowingTheRemainingCommunityCards(io, table);
        }
    }
}
function beginShowingTheRemainingCommunityCards(io, table){ // the remaining community cards are revealed, one at a time (used if a premature show down is called)
    let count = 5 - table.communityCardsShown;
    function showCommunityCard() {
        if(count <= 0){
            clearInterval(timeout);
            // now begin showing player cards
            showRemainingPlayerCards(io, table);
        }
        else{
            table.showOneMoreCommunityCard();
        }
        count--;
        io.emit('tableState', JSON.stringify(table.getTableState()));
    }
    let timeout = setInterval(showCommunityCard, 2000);
}
function showRemainingPlayerCards(io, table){ // the players still in play will show their cards (backside)
    setTimeout(function() {
        io.emit('showdown', JSON.stringify(table.getShowdownCardRevealState()));
        beginFlippingOverEachPlayersCards(io, table);
    }, 2000);
}
function beginFlippingOverEachPlayersCards(io, table){ // one at a time each player will flip their cards over
    let count = table.getNumberOfPlayersStillInPlay();
    function flipNextPlayerCards(){
        count--;
        if(count < 1){
            clearInterval(timeout);
            setTimeout(function() {
                let winners = table.getWinnerSocketIDs();
                for(let i = 0; i < winners.length; i++){
                    io.to(`${winners[i]}`).emit('winner');
                    calculateAndDistributeChips(io, table);
                }
            }, 1000);
        }
        table.showNextPlayerCards();
        io.emit('showdown', JSON.stringify(table.getShowdownCardRevealState()));
    }
    let timeout = setInterval(flipNextPlayerCards, 2000);
}
function calculateAndDistributeChips(io, table){ // after a winner is found the chips are redistributed
    setTimeout(function() {
        table.calculateAndDistributeChips();
        io.emit('tableState', JSON.stringify(table.getTableState()));
        bootPlayers(io, table);
    }, 1000);
}
function bootPlayers(io, table){ // any players that lost all their chips are removed from the table
    setTimeout(function() {
        table.bootPlayers(); // will remove all players that have no more chips
        table.reset(); // reset the table for a new game
        io.emit('tableState', JSON.stringify(table.getTableState()));
        io.emit('reset');
        if(table.canAGameBegin()){
            beginTheGame(io, table);
        }
        else{
            table.tableActive = false;
        }
    }, 2000);
}