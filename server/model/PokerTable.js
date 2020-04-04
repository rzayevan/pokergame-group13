let PokerPlayerSeat = require("./PokerPlayerSeat.js");
let PokerUtils = require('../utilities/PokerUtils.js');
let PokerTableAssistant = require('./PokerTableAssistant.js');

class PokerTable {
    /**
     * Constructor for the PokerTable object
     * @param {Object} pokerTableStat The pokerTableStat object
     */
    constructor(pokerTableStat){
        this.bigBlind = pokerTableStat.bigBlind; // the big blind of the table
        this.buyIn = pokerTableStat.buyIn;
        this.timeout = null; // table will clear this if action taken within time limit
        this.tableName = pokerTableStat.name;
        this.tableSeats = []; // the list of table seats
        for(let i = 0; i < PokerUtils.GetNumberOfTableSeats(); i++){
            this.tableSeats.push(new PokerPlayerSeat(i));
        }
        this.assistant = new PokerTableAssistant(this.tableSeats, this.bigBlind);
        this.gameInPlay = false;
        this.tableActive = false; // whether or not the table is active, true when 2+ players are present
    }

    /**
     * Sets the timeout for the next player
     */
    receiveTimeout(timeout){
        clearTimeout(this.timeout);
        this.timeout = timeout;
    }

    /**
     * Returns true if the poker table is full, otherwise it returns false
     */
    isTableFull() {
        for(let i = 0; i < this.tableSeats.length; i++){
            if(this.tableSeats[i].seatOpen){
                return false;
            }
        }
        return true;
    }

    getNumberOfFullSeats(){
        let count = 0;
        for(let i = 0; i < this.tableSeats.length; i++){
            if(!this.tableSeats[i].seatOpen){
                count++;
            }
        }
        return count;
    }

    /**
     * Returns true if the player is at the current Table, else it returns false
     * @param {User} profile The User object for the given user    
     */
    isPlayerAtTable(profile){
        if(this.tableSeats.find(seat => seat.userID === profile.id) === undefined){
            return false;
        }
        return true;
    }

    /**
     * Returns the current state of the table
     */
    getTableState() {
        let seatStates = [];

        // Iterate through each seat of the table and add its state to seatStates
        for(let i = 0; i < this.tableSeats.length; i++){
            seatStates.push(this.tableSeats[i].getSeatState());
        }
        let potTotal = 0;
        for(let i = 0; i < this.tableSeats.length; i++){
            potTotal += this.tableSeats[i].pot;
        }
        // Return an object containing the current state of the table
        return {
            seatStates: seatStates, // all the table seat states
            communityCards: this.assistant.getCommunityCards(), // the community cards that have been shown 
            currentBet: this.currentBet, // the current bet of the table
            potTotal: potTotal
        };
    }

    /**
     * Returns the socketId for each winner
     */
    getWinnerSocketIDs() {
        let winners = [];
        for(let i = 0; i < this.tableSeats.length; i++){
            if(this.tableSeats[i].handRank === this.assistant.currentRankingHand){
                winners.push(this.tableSeats[i].socketID);
                this.tableSeats[i].action = 'WINNER';
            }
        }
        return winners;
    }

    /**
     * Adds the provided User to the table
     * @param {User} profile The User object of the new player
     * @param {String} socketID The socketID of the new player
     */
    addPlayerToTable(profile, socketID){
        let emptySeat = this.tableSeats.find(tableSeat => tableSeat.seatOpen === true);
        emptySeat.addPlayerToTable(profile, socketID, this.buyIn, this.gameInPlay);
        return {seatID: emptySeat.seatID, tableName: this.tableName, bigBlind: this.bigBlind};
    }

    /**
     * Returns a boolean stating whether or not a game can begin
     */
    canAGameBegin(){
        let count = 0;
        for(let i = 0; i < this.tableSeats.length; i++){
            if(!this.tableSeats[i].seatOpen){
                count++;
                if(count > 1){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Function that begins the game at the current table
     */
    beginTheGame(){
        this.gameInPlay = true;
        this.assistant.beginTheGame();
    }
    
    /**
     * Determines if the supplied ids correspond to the user currently playing their turn
     * @param {String} userID The uuid of the user
     * @param {*} seatID The uuid of the seat
     * @param {*} socketID The id of the socket
     */
    isItTheirTurn(userID, seatID, socketID){
        return this.assistant.isItTheirTurn(userID, seatID, socketID);
    }

    /**
     * Performs an action based upon the supplied values
     * @param {String} action The action to be performed
     * @param {int} raiseToValue The value to raise to, if applicable
     */
    playerAction(action, raiseToValue) {
        let response = this.tableSeats[this.assistant.seatTurnID].playerAction(action, this.assistant.currentBet, raiseToValue, this.bigBlind);
        if(response.success){ // the action was accepted
            clearTimeout(this.timeout); // player made an action, stop the timeout
            this.timeout = null; // not sure if needed
            switch(response.action){
                case 'CHECKING':
                    this.assistant.playerCheckFinish();
                    break;
                case 'CALLING':
                    this.assistant.playerCallFinish();
                    break;
                case 'RAISING':
                    this.assistant.playerRaiseFinish(response.raiseToValue);
                    break;
                case 'ALL IN':
                    this.assistant.playerAllInFinish(response.raiseToValue);
                    break;
                default: // FOLDED
                    this.assistant.playerFoldFinish();
                    break;
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * Shows one more community card
     */
    showOneMoreCommunityCard() {
        this.assistant.showOneMoreCommunityCard();
    }

    /**
     * Returns an array of player cards that have been shown to all players
     */
    getShowdownCardRevealState() {
        return this.assistant.getShowdownCardRevealState();
    }


    /**
     * Determines and sets the order for each player to show their cards
     */
    showNextPlayerCards() {
        this.assistant.showNextPlayerCards();
    }

    /**
     * Calculates and distributes chips to players
     */
    calculateAndDistributeChips() {
        this.assistant.calculateAndDistributeChips();
    }

    /**
     * Boots players from the room
     * @param {Object} io The socket of the user
     * @param {OBject} room The object defining the room
     */
    bootPlayers(io, room){
        for(let i = 0; i < this.tableSeats.length; i++){
            let seat = this.tableSeats[i];
            if(!seat.seatOpen && seat.chips === 0){
                io.sockets.connected[this.tableSeats[i].socketID].leave(room.id);
                io.sockets.connected[this.tableSeats[i].socketID].emit('leaveRoom');
                this.tableSeats[i].resetSeat();
            }
        }
    }

    /**
     * Boot a specific player from the table
     * @param {String} userID The uuid of the user
     * @param {Object} io The socket of the user
     * @param {Object} room The room of the table
     */
    bootPlayer(userID, io, room){
        let seat = this.tableSeats.find(seat => seat.userID === userID);
        let chips = seat.chips;
        let socket = io.sockets.connected[seat.socketID];
        if(socket !== undefined){socket.leave(room.id);} // if it was undefined then it was a disconnect (so the socket has already left the room)
        let itWasTheirTurn = false;
        if(this.assistant.wasItTheirTurn(userID)){ itWasTheirTurn = true; } // it was their turn
        seat.resetSeat();
        let newTimeout = false;
        if(itWasTheirTurn){ // it was their turn, find the next one
            clearTimeout(this.timeout); // player made an action, stop the timeout
            this.assistant.playerFoldFinish(); // because it was their turn we can treat it like a fold
            if(!this.assistant.showdown){ newTimeout = true; } // it was their turn but we are not in a show down we continue with a new timeout
        }
        return {chips: chips, newTimeout: newTimeout};
    }
    
    /**
     * Reset the table
     */
    reset(){
        this.assistant.reset();
        this.gameInPlay = false;
    }
};

module.exports = PokerTable;