const { v1: uuid } = require('uuid');
let PokerUtils = require('../utilities/PokerUtils.js');
let PokerTable = require("../model/PokerTable.js");
const DataAccessLayer = require('../controllers/DataAccessLayer.js');

class PokerController {
    constructor(numberOfEachRoom) {
        this.pokerTableStats = PokerUtils.GetPokerTableStats();
        this.numberOfEachRoom = numberOfEachRoom;
        this.rooms = [];
        this.pokerTableTimeout = PokerUtils.GetPokerTableTimeout();

        for (let i = 0; i < this.pokerTableStats.length; i++) { // for each type of table we create a few
            for (let j = 0; j < this.numberOfEachRoom; j++) { // right now two of each table is created
                let room = {
                    id: uuid(),
                    table: new PokerTable(this.pokerTableStats[i], i + 1),
                }
                this.rooms[i * this.numberOfEachRoom + j] = room;
            }
        }
    }

    getRoomList() { // returns an object containing vital info on the tables
        let list = [];
        for (let i = 0; i < this.rooms.length; i++) {
            let room = this.rooms[i];
            list.push({
                roomID: room.id,
                tableName: room.table.tableName,
                buyIn: room.table.buyIn,
                bigBlind: room.table.bigBlind,
                numberOfFullSeats: room.table.getNumberOfFullSeats(),
                numberOfTableSeats: PokerUtils.GetNumberOfTableSeats()
            });
        }

        return list;
    }

    disconnectFromTable(io, socket) {
        for (let i = 0; i < this.rooms.length; i++) {
            let room = this.rooms[i];
            for (let j = 0; j < room.table.tableSeats.length; j++) {
                let seat = room.table.tableSeats[j];
                if (seat.socketID === socket.id) {
                    let msg = {
                        userID: seat.userID,
                        roomID: room.id,
                        seatID: seat.seatID,
                    };
                    this.exitRoomRequest(io, socket, msg); // we make a exitroom request for them
                    return;
                }
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
        if (roomToJoin === undefined) {
            return { allowed: false, reason: 'room is undefined' }
        } else if (table.isTableFull()) {
            return { allowed: false, reason: 'table is full' }
        } else if (table.isPlayerAtTable(profile)) {
            return { allowed: false, reason: 'player is already at table' }
        } else if (profile.chips < table.buyIn) {
            return { allowed: false, reason: 'not enough chips' }
        } else {
            return { allowed: true, reason: 'all conditions pass' }
        }
    }

    /**
     * Attempts to connect a User to a room
     * @param {Object} io The io of the system
     * @param {Object} socket The socket of the user
     * @param {String} msg The message request
     */
    joinRoom(io, socket, msg) { // request sent from client that they want to join the table
        let profile = DataAccessLayer.ReadUsersFile().find(profile => profile.id === msg.userID); // get their profile
        if (profile === undefined) { return; };
        let roomToJoin = this.rooms.find(room => room.id === msg.roomID);
        if (roomToJoin === undefined) { return; }
        let table = roomToJoin.table;
        let response = this.canUserJoinRoom(roomToJoin, profile);
        if (response.allowed) { // the user can join the table
            profile.chips -= table.buyIn; // user pays the buy in
            DataAccessLayer.UpdateUser(profile); // we took the buy in from their account, update it
            socket.emit("acountChips", profile.chips);
            let result = table.addPlayerToTable(profile, socket.id); // the table will fill a seat based on the profile and send back the seat id
            socket.join(roomToJoin.id); // now this client will receive messages from the tableName room
            socket.emit('joinRoom', {
                seatID: result.seatID,
                tableName: result.tableName, // used only for the chat title
                roomID: roomToJoin.id, // used for further communication
                bigBlind: result.bigBlind,
                chipValueChangeBy: table.buyIn,
            });
            io.to(roomToJoin.id).emit('tableState', JSON.stringify(table.getTableState())); // send to everyone the updated table state in this room

            //if joining the game results in a full table, add a table with same specs into room list 
            if (table.isTableFull()) {
                let copies = 1;
                let tableSplit = null;
                let tableOrigin = table.tableName;

                if (table.tableName.includes(" ")) {
                    tableSplit = String(table.tableName).split(" ");
                    tableOrigin = tableSplit[0];
                }

                for (let i = 0; i < this.rooms.length; i++) {
                    let room = this.rooms[i];
                    if (room.table.tableName.includes(tableOrigin)) {
                        copies++;
                    }
                }

                let room = {
                    id: uuid(),
                    table: new PokerTable({ name: tableOrigin + " " + copies, bigBlind: table.bigBlind, buyIn: table.buyIn }),
                }

                this.rooms.push(room);
                this.rooms.sort(function(a, b) { return a.table.bigBlind - b.table.bigBlind })

                io.emit("receiveRoomList", this.getRoomList()); // update the room list
                if (table.canAGameBegin() && !table.tableActive) { // check if we can begin a game
                    table.tableActive = true; // the table is now active
                    this.beginTheGame(io, roomToJoin);
                }
            } else {
                socket.emit('cannotJoinRoom', response);
            }
            return response;
        }
    }

    createDecisionTimeout(io, room, self) { // if after the timeout the next player does not response they are auto folded
        return setTimeout(function() { self.turnDecisionTimeOut(io, room) }, PokerUtils.GetPokerTableTimeout());
    }

    turnDecisionTimeOut(io, room) {
        let table = room.table;
        let self = this;
        table.playerAction('FOLD', -1); // will assess the action, we don't need to assess response
        io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
        if (table.assistant.showdown) { // after each move we need to check if the table is ready for a showdown
            this.timeForShowdown(io, room, self);
        } else {
            table.receiveTimeout(self.createDecisionTimeout(io, room, self)); // send the table the timeout object to reset, if player responds within time limit
        }
    }

    /**
     * Begins the game with a timeout of 5 seconds
     * @param {*} io The socket of the system
     * @param {*} room The room that is to begin a game
     */
    beginTheGame(io, room) {
        let self = this;
        let table = room.table;
        setTimeout(function() { // in five seconds the game will begin
            if (table.canAGameBegin()) { // we check this again to make sure no one tried to leave in the 5 second window
                table.beginTheGame(); // the game is set up
                io.to(room.id).emit('tableState', JSON.stringify(table.getTableState())); // send to everyone the new table state
                for (let i = 0; i < table.tableSeats.length; i++) {
                    let seat = table.tableSeats[i];
                    if (seat.socketID !== -1) {
                        io.to(`${seat.socketID}`).emit('beginTheGame', JSON.stringify(seat.cards));
                    }
                }
                // now the player whos the current turn can send us a decision
                table.receiveTimeout(self.createDecisionTimeout(io, room, self)); // send the table the timeout object to reset, if player responds within time limit    
            } else {
                table.tableActive = false; // the table is now in active
            }
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
        if (room === undefined) { return; }
        let table = room.table;
        let self = this;
        if (table.isItTheirTurn(msg.userID, msg.seatID, socket.id)) {
            // there is a limited number of actions a player can take based on their current state
            // ask if they can make that move, if not then do nothing, later also disable buttons based on lack of options 
            if (table.playerAction(msg.action, msg.raiseToValue)) { // will assess the action and return a response true or false
                io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
                if (table.assistant.showdown) { // after each move we need to check if the table is ready for a showdown
                    this.timeForShowdown(io, room, self);
                } else {
                    table.receiveTimeout(self.createDecisionTimeout(io, room, self)); // send the table the timeout object to reset, if player responds within time limit
                }
            } else {
                socket.emit('badMove');
            }
        }
    }

    /**
     * Assess whether a move made by a User is valid
     * @param {Object} io The io of the system
     * @param {Object} room The room of the table
     * @param {Object} self self reference
     */
    timeForShowdown(io, room, self) {
        let table = room.table;
        if (table.assistant.showDownWithCardReveal) {
            this.beginShowingTheRemainingCommunityCards(io, room);
        } else { // only one person remains no card reveal required
            setTimeout(function() { // show the winner
                self.showWinners(io, room);
                setTimeout(function() { self.calculateAndDistributeChips(io, room); }, 1000); // calculate the chip distribution
            }, 1000);
        }
    }

    /**
     * Attempts to disconnect a User from a room
     * @param {Object} io The io of the system
     * @param {Object} socket The socket of the user
     * @param {String} msg The message request
     */
    exitRoomRequest(io, socket, msg) {
        let self = this;
        let room = this.rooms.find(room => room.id === msg.roomID);
        if (room === undefined) { return; }
        let table = room.table;

        let user = DataAccessLayer.GetCachedUsers().find(user => user.id === msg.userID);
        if (user === undefined) { return; }

        let alreadyInShowdown = table.assistant.showdown; // if a showdown is occuring at this stage then we don't need to call another showdown
        let result = table.bootPlayer(user.id, io, room); // boot the player and return any chips they had (not including pot)
        user.chips += result.chips;
        DataAccessLayer.UpdateUser(user);
        socket.emit("acountChips", user.chips);
        socket.leave(room.id);
        socket.emit('leaveRoom', { chipValueChangeBy: result.chips });
        io.to(room.id).emit('tableState', JSON.stringify(table.getTableState()));
        io.emit("receiveRoomList", this.getRoomList()); // update the room list
        if (result.newTimeout) { table.receiveTimeout(self.createDecisionTimeout(io, room, self)); }
        if (table.assistant.showdown && !alreadyInShowdown) { // after each move we need to check if the table is ready for a showdown
            this.timeForShowdown(io, room, self);
        }
    }

    /**
     * Reveal the remaining community cards, one at a time
     * @param {Object} io The io of the system
     * @param {Object} room The room the table being assessed is in
     */
    beginShowingTheRemainingCommunityCards(io, room) {
        let table = room.table;
        let count = table.assistant.getNumberOfCommunityCardsLeftToReveal();
        var self = this;

        function showCommunityCard() { // each time this runs a single community card revealed
            if (count < 1) { // we are done showing community cards now show player cards
                clearInterval(timeout);
                self.beginFlippingOverEachPlayersCards(io, room); // now begin showing player cards
            } else {
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
        let count = table.assistant.getNumberOfPlayersStillInPlay();
        let self = this;
        io.to(room.id).emit('showdown', JSON.stringify(table.getShowdownCardRevealState()));

        function flipNextPlayerCards() { // each player one at a time will either show or 'throw away' their cards depending on if they have a higher hand
            if (count < 1) {
                clearInterval(timeout);
                setTimeout(function() { // all players have show or thrown their cards, now show the winner(s)
                    self.showWinners(io, room);
                    setTimeout(function() { self.calculateAndDistributeChips(io, room); }, 1000); // calculate the chip distribution
                }, 1000);
            } else {
                table.showNextPlayerCards();
            }
            count--;
            io.to(room.id).emit('showdown', JSON.stringify(table.getShowdownCardRevealState()));
        }
        let timeout = setInterval(flipNextPlayerCards, 2000);
    }

    showWinners(io, room) {
        let winners = room.table.getWinnerSocketIDs();
        for (let i = 0; i < winners.length; i++) {
            io.to(`${winners[i]}`).emit('winner');
        }
    }

    /**
     * Redistribute chips after a winner is found
     * @param {Object} io The io of the system
     * @param {object} room The room the table being assessed is in
     */
    calculateAndDistributeChips(io, room) { // after a winner is found the chips are redistributed
        let table = room.table;
        let self = this;
        table.assistant.calculateAndDistributeChips();
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
        io.emit("receiveRoomList", this.getRoomList()); // update the room list
        if (table.canAGameBegin()) {
            self.beginTheGame(io, room);
        } else {
            table.tableActive = false;
        }
    }
}

module.exports = PokerController;