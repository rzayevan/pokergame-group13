const { v1: uuid } = require('uuid');
let PokerUtils = require('../utilities/PokerUtils.js');
let PokerTable = require("../model/PokerTable.js");
const DataAccessLayer = require('../controllers/DataAccessLayer.js');

class PokerController {
    constructor(numberOfEachRoom) {
        this.pokerTableStats = PokerUtils.GetPokerTableStats();
        this.numberOfEachRoom = numberOfEachRoom;
        this.rooms = [];

        for (let i = 0; i < this.pokerTableStats.length; i++) { // for each type of table we create a few
            for(let j = 0; j < this.numberOfEachRoom; j++) { // right now two of each table is created
                let room = {
                    id: uuid(),
                    table: new PokerTable(this.pokerTableStats[i]),
                }
                this.rooms[i*this.numberOfEachRoom + j] = room;
            }
        }
    }

    /**
     * Checks if a User can join the room
     * TODO: needs to use the real login and tables page
     * @param {Object} roomToJoin The room object of the room to join
     * @param {User} profile The User object of the user attempting to join
     */
    canUserJoinRoom(roomToJoin, profile) { // check if the user is permitted to join the table
        let table = roomToJoin.table;
        if(roomToJoin === undefined || table.isTableFull() || table.isPlayerAtTable(profile) || profile.chips < table.buyIn){
            return false; // the user cannot join this table/room
        }

        return true;
    }

    /**
     * Attempts to connect a User to a room
     * @param {Object} io The io of the system
     * @param {Object} socket The socket of the user
     * @param {String} msg The message request
     */
    joinRoom(io, socket, msg) { // request sent from client that they want to join the table
        let profile = DataAccessLayer.ReadUsersFile().find(profile => profile.id === msg.userID); // get their profile
        let roomToJoin = this.rooms[msg.roomID]; // TODO: when tables is linked to poker, use .find(),
        let table = roomToJoin.table;
        if(this.canUserJoinRoom(roomToJoin, profile)){// the user can join the table
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
                this.beginTheGame(io, roomToJoin);
            }
        }
    }

    /**
     * Attempts to disconnect a User from a room
     * @param {Object} io The io of the system
     * @param {Object} socket The socket of the user
     * @param {String} msg The message request
     */
    exitRoomRequest(io, socket, msg) {
        let room = this.rooms.find(room => room.id === msg.roomID);
        let table = room.table;
        let user = DataAccessLayer.ReadUsersFile().find(user => user.id === msg.userID);
        user.chips += table.bootPlayer(user.id, io, room); // boot the player and return any chips they had (not including pot)
        DataAccessLayer.UpdateUser(user);
        socket.leave(room.id);
        socket.emit('leaveRoom');
        io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
        if(table.showdown){// after each move we need to check if the table is ready for a showdown
            this.beginShowingTheRemainingCommunityCards(io, room);
        }
    }

    /**
     * Begins the game with a timeout of 5 seconds
     * @param {*} io The socket of the system
     * @param {*} room The room that is to begin a game
     */
    beginTheGame(io, room) { 
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

    /**
     * Assess whether a move made by a User is valid
     * @param {Object} io The io of the system
     * @param {Object} socket The socket of the user
     * @param {String} msg The message request
     */
    turnDecision(io, socket, msg) {
        let room = this.rooms.find(room => room.id === msg.roomID);
        let table = room.table;
        if(table.isItTheirTurn(msg.userID, msg.seatID, socket.id)) {
            // there is a limited number of actions a player can take based on their current state
            // ask if they can make that move, if not then do nothing, later also disable buttons based on lack of options
            let response = table.playerAction(msg.action, msg.raiseToValue); // will assess the action and return a response
            if(response) {
                io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
            } else {
                socket.emit('badMove');
            }
            if(table.showdown ) {// after each move we need to check if the table is ready for a showdown
                this.beginShowingTheRemainingCommunityCards(io, room);
            }
        }
    }

    /**
     * Reveal the remaining community cards, one at a time
     * @param {Object} io The io of the system
     * @param {Object} room The room the table being assessed is in
     */
    beginShowingTheRemainingCommunityCards(io, room) { 
        let table = room.table;
        let count = table.communityCards.length - table.communityCardsShown;
        var self = this;
        function showCommunityCard() { // each time this runs a single community card revealed
            if(count <= 0){ // we are done showing community cards now show player cards
                clearInterval(timeout);
                // now begin showing player cards
                setTimeout(function () { self.beginFlippingOverEachPlayersCards(io, room); }, 1000);
            }
            else{
                table.showOneMoreCommunityCard();
            }
            count--;
            io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
        }
        let timeout = setInterval(showCommunityCard, 2000);
    }

    /**
     * Flip the card of each player, one at a time
     * @param {Object} io The io of the system
     * @param {object} room The room the table being assessed is in
     */
    beginFlippingOverEachPlayersCards(io, room) { // one at a time each player will flip their cards over
        let table = room.table;
        io.to(room.id).emit('showdown', JSON.stringify(table.getShowdownCardRevealState()));
        let count = table.getNumberOfPlayersStillInPlay();
        let self = this;
        function flipNextPlayerCards(){ // each player one at a time will either show or 'throw away' their cards depending on if they have a higher hand
            count--;
            if(count < 1) {
                clearInterval(timeout);
                setTimeout(function() { // all players have show or thrown their cards, now show the winner(s)
                    let winners = table.getWinnerSocketIDs();
                    for(let i = 0; i < winners.length; i++){
                        io.to(`${winners[i]}`).emit('winner');
                    }
                    setTimeout(function() { self.calculateAndDistributeChips(io, room); }, 1000); // calculate the chip distribution
                }, 1000);
            }
            table.showNextPlayerCards();
            io.to(room.id).emit('showdown', JSON.stringify(table.getShowdownCardRevealState()));
        }
        let timeout = setInterval(flipNextPlayerCards, 2000);
    }

    /**
     * Redistribute chips after a winner is found
     * @param {Object} io The io of the system
     * @param {object} room The room the table being assessed is in
     */
    calculateAndDistributeChips(io, room) { // after a winner is found the chips are redistributed
        let table = room.table;
        let self = this;
        table.calculateAndDistributeChips();
        io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
        setTimeout(function() { self.bootPlayers(io, room); }, 2000); // remove any players that lost all their chips
    }

    /**
     * Any players that have lost all their chips are removed from the table
     * @param {Object} io The io of the system
     * @param {object} room The room the table being assessed is in
     */
    bootPlayers(io, room) {
        let table = room.table;
        let self = this;
        table.bootPlayers(io, room); // will remove all players that have no more chips
        table.reset(); // reset the table for a new game
        io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
        io.to(room.id).emit('reset');
        if(table.canAGameBegin()){
            self.beginTheGame(io, room);
        }
        else{
            table.tableActive = false;
        }
    }
}

module.exports = PokerController;