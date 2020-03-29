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
    socket.on('joinTableRequest', function(msg){ // a user wishes to join a table
        joinTable(io, socket, msg);
    });

    // each player will send a message upon a game play button click, this will check whether or not it is the player's turn and if the move is valid
    socket.on('turnDecision', function(msg){
        turnDecision(io, socket, msg);
    });

    socket.on('exitTableRequest', function(msg){
        exitTableRequest(io, socket, msg);
    });

});



// the entire list of tables, might need a better way to store them?
let tables = [];
// add new table with big blind, table name, table id
tables.push(new PokerTable(200, 'Little Fish 1', 0));
tables.push(new PokerTable(200, 'Little Fish 2', 1));
tables.push(new PokerTable(2000, 'Big Fish 1', 2));
tables.push(new PokerTable(2000, 'Big Fish 2', 3));
tables.push(new PokerTable(10000, 'Champion 1', 4));
tables.push(new PokerTable(10000, 'Champion 2', 5));


// these next two functions are for signing up a client to the poker table, need to use the real login and tables page to do this
function canUserJoinTable(tableToJoin, profile){ // check if the user is permitted to join the table
    if(tableToJoin === undefined || tableToJoin.isTableFull() || tableToJoin.isPlayerAtTable(profile) || profile.chips < tableToJoin.buyIn){
        return false; // the user cannot join this table
    }
    else{
        return true;
    }
}
function joinTable(io, socket, msg){ // request sent from client that they want to join the table
    let profile = DataAccessLayer.ReadUsersFile().find(profile => profile.id === msg.userID);
    //let profile = profiles.find(profile => profile.userID === msg.userID); // get their profile
    let tableToJoin = tables.find(table => table.tableID === msg.tableID); // get the table they wish to join
    if(canUserJoinTable(tableToJoin, profile)){// the user can join the table
        profile.chips -= tableToJoin.buyIn; // user pays the buy in
        DataAccessLayer.UpdateUser(profile);
        let result = tableToJoin.addPlayerToTable(profile, socket.id); // the table will fill a seat based on the profile and send back the seat id
        socket.join(result.tableName); // now this client will receive messages from the tableName room
        socket.emit('joinTable', {
            seatID: result.seatID,
            tableName: result.tableName,
            tableID: result.tableID,
            bigBlind: result.bigBlind,
        });
        io.to(result.tableName).emit('tableState', JSON.stringify(tableToJoin.getTableState())); // send to everyone the updated table state in this room
        if(tableToJoin.canAGameBegin() && !tableToJoin.tableActive){ // check if we can begin a game
            tableToJoin.tableActive = true; // the table is now active
            beginTheGame(io, tableToJoin);
        }
    }
}
function exitTableRequest(io, socket, msg){
    let table = tables.find(table => table.tableID === msg.tableID);
    let user = DataAccessLayer.ReadUsersFile().find(user => user.id === msg.userID);
    user.chips += table.bootPlayer(user.id); // boot the player and return any chips they had (not including pot)
    DataAccessLayer.UpdateUser(user);
    socket.leave(table.tableName);
    socket.emit('leaveTable');
    io.to(table.tableName).emit('tableState', JSON.stringify(table.getTableState()));
    if(table.showdown){// after each move we need to check if the table is ready for a showdown
        beginShowingTheRemainingCommunityCards(io, table);
    }
}
// the functions for communication between the server and the poker.vue page
function beginTheGame(io, table){ // function will begin the game with a time out of 5 seconds
    setTimeout(function() { // in five seconds the game will begin
        table.beginTheGame(); // the game is set up
        io.to(table.tableName).emit('tableState', JSON.stringify(table.getTableState())); // send to everyone the new table state
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
    let table = tables.find(table => table.tableID === msg.tableID);
    if(table.isItTheirTurn(msg.userID, msg.seatID, socket.id)){
        // there is a limited number of actions a player can take based on their current state
        // ask if they can make that move, if not then do nothing, later also disable buttons based on lack of options
        let response = table.playerAction(msg.action, msg.raiseToValue); // will assess the action and return a response
        if(response){
            io.to(table.tableName).emit('tableState', JSON.stringify(table.getTableState()));
        }
        else{
            socket.emit('badMove');
        }
        if(table.showdown){// after each move we need to check if the table is ready for a showdown
           beginShowingTheRemainingCommunityCards(io, table);
        }
    }
}
function beginShowingTheRemainingCommunityCards(io, table){ // the remaining community cards are revealed, one at a time (used if a premature show down is called)
    let count = table.communityCards.length - table.communityCardsShown;
    function showCommunityCard() { // each time this runs a single community card revealed
        if(count <= 0){ // we are done showing community cards now show player cards
            clearInterval(timeout);
            // now begin showing player cards
            showRemainingPlayerCards(io, table);
        }
        else{
            table.showOneMoreCommunityCard();
        }
        count--;
        io.to(table.tableName).emit('tableState', JSON.stringify(table.getTableState()));
    }
    let timeout = setInterval(showCommunityCard, 2000);
}
function showRemainingPlayerCards(io, table){ // the players still in play will show their cards (backside)
    setTimeout(function() { // all players in play will show their cards face down
        io.to(table.tableName).emit('showdown', JSON.stringify(table.getShowdownCardRevealState()));
        beginFlippingOverEachPlayersCards(io, table);
    }, 2000);
}
function beginFlippingOverEachPlayersCards(io, table){ // one at a time each player will flip their cards over
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
                calculateAndDistributeChips(io, table); // calculate the chip distribution
            }, 1000);
        }
        table.showNextPlayerCards();
        io.to(table.tableName).emit('showdown', JSON.stringify(table.getShowdownCardRevealState()));
    }
    let timeout = setInterval(flipNextPlayerCards, 2000);
}
function calculateAndDistributeChips(io, table){ // after a winner is found the chips are redistributed
    setTimeout(function() {
        table.calculateAndDistributeChips();
        io.to(table.tableName).emit('tableState', JSON.stringify(table.getTableState()));
        bootPlayers(io, table); // remove any players that lost all their chips
    }, 1000);
}
function bootPlayers(io, table){ // any players that lost all their chips are removed from the table
    setTimeout(function() {
        table.bootPlayers(); // will remove all players that have no more chips
        table.reset(); // reset the table for a new game
        io.to(table.tableName).emit('tableState', JSON.stringify(table.getTableState()));
        io.to(table.tableName).emit('reset');
        if(table.canAGameBegin()){
            beginTheGame(io, table);
        }
        else{
            table.tableActive = false;
        }
    }, 2000);
}