//import PokerTable from './PokerTable';
let PokerTable = require("./PokerTableObjects/PokerTable.js");

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let User = require("./model/User.js");

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
        let newUser = new User();
        newUser.CreateNewUser(splitUserString[0], splitUserString[1], splitUserString[2]);
        DataAccessLayer.AddUserToFile(newUser);
    });


    // start of added code to talk with poker.vue
    socket.on("logIn", function(msg){
        let profile = profiles.find(profile => profile.userID === msg);
        if(profile === undefined){
            // the user does not exist
            return;
        }
        else{
            // send the current table state
            socket.emit('tableState', JSON.stringify(tables[0].getTableState()));
        }
    });
    
    socket.on('joinTable', function(msg){ // a user wishes to join a table
        let profile = profiles.find(profile => profile.userID === msg.userID); // get their profile
        let tableToJoin = tables.find(table => table.tableID === msg.tableID); // get the table they wish to join
        if(tableToJoin === undefined || tableToJoin.isTableFull() || tableToJoin.isPlayerAtTable(profile) || profile.chips < tableToJoin.buyIn){
            return; // the user cannot join this table
        }
        else{
            // the user can join the table
            let seatID = tableToJoin.addPlayerToTable(profile, socket.id); // the table will fill a seat based on the profile and send back the seat id
            socket.emit('yourSeatID', seatID); // send him back his tableSeatID
            io.emit('tableState', JSON.stringify(tableToJoin.getTableState())); // send to everyone the updated table state
            if(tableToJoin.canAGameBegin() && !tableToJoin.tableActive){ // check if we can begin a game
                tableToJoin.tableActive = true; // the table is now active
                beginTheGame(io, tableToJoin);
            }
        }
    });

    socket.on('turnDecision', function(msg){
        if(tables[0].isItTheirTurn(msg.userID, msg.seatID, socket.id)){
            // there is a limited number of actions a player can take based on their current state
            // ask if they can make that move, if not then do nothing, later also disable buttons based on lack of options
            let response = tables[0].playerAction(msg.action, msg.raiseToValue); // will assess the action and return a response
            if(response){
                io.emit('tableState', JSON.stringify(tables[0].getTableState()));
            }
            else{
                console.log('bad move');
            }
            if(tables[0].showdown){// after each move we need to check if the table is ready for a showdown
                console.log("show down begin");
               beginShowingTheRemainingCommunityCards(io, tables[0]);
            }
        }
    });
});



// a list of sample profiles already logged into the system
let profiles = [
    {userID: 1000, name: 'Mark123', chips: 20000, icon: 'player_icon_1'},
    {userID: 2000, name: 'John456', chips: 40000, icon: 'player_icon_1'},
    {userID: 3000, name: 'Luke854', chips: 60000, icon: 'player_icon_1'},
    {userID: 4000, name: 'Jane027', chips: 80000, icon: 'player_icon_1'},
    {userID: 5000, name: 'Stan693', chips: 10000, icon: 'player_icon_1'},
    {userID: 6000, name: 'Mack273', chips: 20, icon: 'player_icon_1'},
];
// the entire list of tables
let tables = [];
tables.push(new PokerTable()); // initially we will have one table

function beginTheGame(io, table){
    setTimeout(function() { // in five seconds the game will begin
        console.log('beginning the game');
        table.beginTheGame(); // the game is set up
        io.emit('tableState', JSON.stringify(table.getTableState())); // send to everyone the new table state
        for(let i = 0; i < 6; i++){
            let seat = table.tableSeats[i];
            if(seat.socketID !== -1){
                console.log('yes');
                io.to(`${seat.socketID}`).emit('beginTheGame', JSON.stringify(seat.cards));
            }
        }
        // now the player whos the current turn can send us a decision
    }, 5000);
}

function beginShowingTheRemainingCommunityCards(io, table){ // the remaining community cards are revealed
    let count = 5 - tables[0].communityCardsShown;
    function showCommunityCard() {
        count--;
        if(count < 1){
            clearInterval(timeout);
            // now begin showing player cards
            showRemainingPlayerCards(io, table);
        }
        table.showOneMoreCommunityCard();
        io.emit('tableState', JSON.stringify(table.getTableState()));
    }
    let timeout = setInterval(showCommunityCard, 2000);
}

function showRemainingPlayerCards(io, table){ // the players still in play will show their cards
    setTimeout(function() {
        io.emit('showdownCardRevealState', JSON.stringify(table.getShowdownCardRevealState()));
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
                    io.to(`${winners[i]}`).emit('winner', i);
                    calculateAndDistributeChips(io, table);
                }
            }, 1000);
        }
        table.showNextPlayerCards();
        io.emit('showdownCardRevealState', JSON.stringify(table.getShowdownCardRevealState()));
    }
    let timeout = setInterval(flipNextPlayerCards, 2000);
}

function calculateAndDistributeChips(io, table){
    setTimeout(function() {
        table.calculateAndDistributeChips();
        io.emit('tableState', JSON.stringify(table.getTableState()));
        bootPlayers(io, table);
    }, 1000);
}

function bootPlayers(io, table){
    setTimeout(function() {
        table.bootPlayers(); // will remove all players that have no more chips
        table.reset(); // reset the table for a new game
        io.emit('tableState', JSON.stringify(table.getTableState()));
        io.emit('reset', 'reset');
        if(table.canAGameBegin()){
            beginTheGame(io, table);
        }
        else{
            table.tableActive = false;
        }
    }, 2000);
}
