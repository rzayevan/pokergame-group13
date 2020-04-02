let PokerPlayerSeat = require("./PokerPlayerSeat.js");
let PokerUtils = require('../utilities/PokerUtils.js');
let DeckOfCards = require('./DeckOfCards.js');

class PokerTable {
    /**
     * Constructor for the PokerTable object
     * @param {Obect} pokerTableStats The pokerTableStats object
     */
    constructor(pokerTableStats){
        this.timeout = null;
        this.tableName = pokerTableStats.name;
        this.numberOfTableSeats = PokerUtils.GetNumberOfTableSeats();
        this.minimumNumberOfPlayersNeededToContinue = 2;
        this.flopNumber = 3;
        this.turnNumber = 4;
        this.riverNumber = 5;
        this.bigBlind = pokerTableStats.bigBlind; // the big blind of the table
        this.buyIn = pokerTableStats.buyIn;
        this.currentBet = 0; // current bet the table has been raised to, gets reset to zero after each card reveal
        this.seatTurnID = -1; // the seatID of the current turn
        this.dealerSeatID = -1;
        this.tableSeats = [ // the list of table seats
            new PokerPlayerSeat(0),
            new PokerPlayerSeat(1),
            new PokerPlayerSeat(2),
            new PokerPlayerSeat(3),
            new PokerPlayerSeat(4),
            new PokerPlayerSeat(5),
        ];
        this.communityCardsShown = 0; // how many community cards are visible to the table
        this.communityCards = ['', '', '', '', '']; // the community cards of the current round
        this.potTotal = 0; // total pot of the current round
        this.showdown = false; // whether or not the showdown has begun
        this.showDownWithCardReveal = true; // whether or not a card reveal will be involved
        this.chatMessages = []; // a list of all chat messages, not sure if its appropriate to keep here
        this.tableActive = false; // whether or not the table is active, true when 2+ players are present
        this.gameInPlay = false;

        this.deckCards = new DeckOfCards();
        this.cardsShownToAllPlayers = [ // sent to all players at the show down and updated with each players real cards on reveal
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
        ];
        this.currentPlayerSeatCardReveal = -1; // the seat id of the current player showing their cards at the show down
        this.currentRankingHand = -1; // the current ranking hand of the round
        this.chipDistributionCalculator = require("../controllers/ChipDistributionCalculator.js");
        this.pokerHandRankCalculator = require("../controllers/PokerHandRankCalculator.js");
    }

    /**
     * Sets the timeout for the next player
     */
    receiveTimeout(timeout){
        this.timeout = timeout;
    }

    /**
     * Returns the number of players that are still in play
     */
    getNumberOfPlayersStillInPlay() {
        let count = 0;
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].inPlay){
                count++;
            }
        }
        return count;
    }

    /**
     * Returns true if the poker table is full, otherwise it returns false
     */
    isTableFull() {
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].seatOpen){
                return false;
            }
        }
        return true;
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
        for(let i = 0; i < this.numberOfTableSeats; i++){
            seatStates.push(this.tableSeats[i].getSeatState());
        }

        // Return an object containing the current state of the table
        return {
            seatStates: seatStates, // all the table seat states
            communityCards: this.getCommunityCards(), // the community cards that have been shown 
            currentBet: this.currentBet, // the current bet of the table
            potTotal: this.potTotal
        };
    }

    /**
     * Returns the socketId for each winner
     */
    getWinnerSocketIDs() {
        let winners = [];
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].handRank === this.currentRankingHand){
                winners.push(this.tableSeats[i].socketID);
                this.tableSeats[i].action = 'WINNER';
            }
        }
        return winners;
    }

    /**
     * Determines and sets the order for each player to show their cards
     */
    showNextPlayerCards() {
        // we need to find the next player who's hand rank is greater than or equal to the last set their cards to visible
        for(let i = 0; i < this.numberOfTableSeats; i++){
            let player = this.tableSeats[this.currentPlayerSeatCardReveal];
            if(player.inPlay){
                if(player.handRank >= this.currentRankingHand){
                    this.cardsShownToAllPlayers[this.currentPlayerSeatCardReveal][0] = player.cards[0];
                    this.cardsShownToAllPlayers[this.currentPlayerSeatCardReveal][1] = player.cards[1];
                    this.currentRankingHand = player.handRank;
                }
                else{
                    this.cardsShownToAllPlayers[this.currentPlayerSeatCardReveal][0] = 'card_empty';
                    this.cardsShownToAllPlayers[this.currentPlayerSeatCardReveal][1] = 'card_empty';
                }
                this.currentPlayerSeatCardReveal++;
                if(this.currentPlayerSeatCardReveal > this.numberOfTableSeats - 1){
                    this.currentPlayerSeatCardReveal = 0;
                }
                return;
            } else {
                this.currentPlayerSeatCardReveal++;
                if(this.currentPlayerSeatCardReveal > this.numberOfTableSeats - 1){
                    this.currentPlayerSeatCardReveal = 0;
                }
            }
        }
    }

    /**
     * Returns an array of player cards that have been shown to all players
     */
    getShowdownCardRevealState() {
        return this.cardsShownToAllPlayers;
    }

    /**
     * Returns an array of community cards
     */
    getCommunityCards(){
        let comCards = [];
        for(let i = 0; i < this.communityCardsShown; i++){
            comCards.push(this.communityCards[i]);
        }
        return comCards;
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
        for(let i = 0; i < this.numberOfTableSeats; i++){
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
        this.showdown = false;
        this.showDownWithCardReveal = true;
        this.deckCards.shuffleDeck();
        this.communityCardsShown = 0;
        this.currentBet = this.bigBlind; // standard bet starts at the big blind
        // seatTurnID starts at -1 and it moves up to the next player
        this.seatTurnID = this.dealerSeatID;
        this.findNextTurn(); // will move seatTurnID to the next player in game
        this.makeDealer(); // assigns the current seatTurnID dealer status
        let dealerSpot = this.seatTurnID; // save the dealer spot for later
        this.findNextTurn();
        this.makeBlind(this.bigBlind/2); // small blind
        this.findNextTurn();
        this.makeBlind(this.bigBlind); // big blind
        this.findNextTurn();
        this.setPlayerTurn(); // set the player to be able to make a decision
        // now distribute the cards
        // starting to the left of the dealer cards get distributed into the hands
        let numberOfCardsDealtToEachPlayer = 2;
        for(let i = 0; i < numberOfCardsDealtToEachPlayer; i++){ // each player is dealt two cards
            for(let j = 0; j < this.getNumberOfPlayersAbleToAct(); j++){ // since everyone playing is able to act at the start, this is appropriate to use
                dealerSpot = this.findNextPlayerToDistributeACard(dealerSpot); // starting one seat left of the dealer distribute a card
                this.tableSeats[dealerSpot].cards[i] = this.deckCards.getCard();
            }
        }
        this.setCommunityCards();
    }

    /**
     * Determines the position of the next player to distribute cards to
     * @param {int} pos The current position
     */
    findNextPlayerToDistributeACard(pos) {
        for(let i = 0; i < this.numberOfTableSeats; i++){
            pos++;
            if(pos > this.numberOfTableSeats - 1){
                pos = 0;
            }
            if(!this.tableSeats[pos].seatOpen){
                // Found the next player
                return pos;
            }
        }
    }

    /**
     * Finds the next player who can make a decision
     */
    findNextTurn() {
        // first check if one or less players is able to make decisions
        if(this.getNumberOfPlayersAbleToAct() < this.minimumNumberOfPlayersNeededToContinue && this.allAblePlayersMadeDecision()){
            // one or less players remaining, we collect the pots and move straight to the show down
            this.beginTheShowDown();
        }
        else{
            // we have confirmed atleast one player has yet to make a decision and can act so now we find him
            // we go though all the seats until we find a player
            for(let i = 0; i < this.numberOfTableSeats; i++){
                this.seatTurnID++;
                if(this.seatTurnID > this.numberOfTableSeats - 1){
                    this.seatTurnID = 0;
                }
                if(this.tableSeats[this.seatTurnID].isPlayerSeatAbleToAct()){// found the next player
                    return;
                }
            } 
        }
    }

    /**
     * Updates the dealer seat
     */
    makeDealer() {
        this.tableSeats[this.seatTurnID].dealer = true;
        this.dealerSeatID = this.seatTurnID;
    }

    /**
     * Returns the number of players still in play that can make a decision
     */
    getNumberOfPlayersAbleToAct() {
        let count = 0;
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].ableToAct) {
                count++;
            }
        }
        return count;
    }

    /**
     * Makes a blind for a the current table seat
     * @param {int} blind The value of the blind to be made
     */
    makeBlind(blind) {
        let tableSeat = this.tableSeats[this.seatTurnID];
        // deduct up to the blind, go all in if they can't make the pay
        if(tableSeat.chips > blind){
            tableSeat.bet = blind;
            tableSeat.chips -= blind;
        }
        else{
            tableSeat.bet = tableSeat.chips;
            tableSeat.chips = 0;
            tableSeat.action = 'ALL IN';
            tableSeat.ableToAct = false;
        }
    }

    /**
     * Sets the player turn of the current seatTurnID
     */
    setPlayerTurn() {
        // setup so the current turn is ready to make a decision
        this.tableSeats[this.seatTurnID].turn = true;
    }

    /**
     * Sets the community cards
     */
    setCommunityCards() {
        for(let i = 0; i < this.communityCards.length; i++){
            this.communityCards[i] = this.deckCards.getCard();
        }
    }

    /**
     * Determines if the supplied ids correspond to the user currently playing their turn
     * @param {String} userID The uuid of the user
     * @param {*} seatID The uuid of the seat
     * @param {*} socketID The id of the socket
     */
    isItTheirTurn(userID, seatID, socketID){
        if(seatID === this.seatTurnID){ // correct seat id
            if(userID === this.tableSeats[this.seatTurnID].userID){ // correct user id
                if(socketID !== this.tableSeats[this.seatTurnID].socketID){ // correct socket id
                    this.tableSeats[this.seatTurnID].socketID = socketID;
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Resets player bets, decisions and the turn
     */
    advanceTheGame() { 
        for(let i = 0; i < this.numberOfTableSeats; i++){
            this.tableSeats[i].madeDecision = false; // reset decision
            this.tableSeats[i].pot += this.tableSeats[i].bet; // update each player's pot
            this.potTotal += this.tableSeats[i].bet; // update the total pot
            this.tableSeats[i].bet = 0; // reset bet
        }
        this.seatTurnID = this.dealerSeatID; // set current turn to dealer
        if(!this.tableSeats[this.seatTurnID].isPlayerSeatAbleToAct()){ // dealer is not able to act, find next player
            this.findNextTurn();
        }
        this.setPlayerTurn();
    }

    /**
     * Performs an action based upon the supplied values
     * @param {String} action The action to be performed
     * @param {int} raiseToValue The value to raise to, if applicable
     */
    playerAction(action, raiseToValue) {
        let response = this.tableSeats[this.seatTurnID].playerAction(action, this.currentBet, raiseToValue, this.bigBlind);
        if(response.success){ // the action was accepted
            clearTimeout(this.timeout); // player made an action, stop the timeout
            this.timeout = null;
            switch(response.action){
                case 'CHECKING':
                    this.playerCheckFinish();
                    break;
                case 'CALLING':
                    this.playerCallFinish();
                    break;
                case 'RAISING':
                    this.playerRaiseFinish(response.raiseToValue);
                    break;
                case 'ALL IN':
                    this.playerAllInFinish(response.raiseToValue);
                    break;
                default: // FOLDED
                    this.playerFoldFinish();
                    break;
            }
            return true;
        }
        return false;
    }

    /**
     * Performs the check action for the current player
     */
    playerCheckFinish() {

        if(this.allAblePlayersMadeDecision()) {
            this.currentBet = 0; // the current bet is reset to zero
            if(this.getNumberOfPlayersAbleToAct() < this.minimumNumberOfPlayersNeededToContinue) {
                beginTheShowDown();
                return;
            }
            // we reveal the next card(s)
            if(this.revealMoreCommunityCards()) { // we have more community cards to reveal, function updated for us
                // set the turn to the next "able" player starting with the dealer
                this.advanceTheGame();
                return;
            }

            // Begin the showdown
            this.beginTheShowDown();
            return;
        }

        this.findNextTurn();
        this.setPlayerTurn();
    }

    /**
     * Performs the call action for the current player
     */
    playerCallFinish() {
        if(this.allAblePlayersMadeDecision()){
            this.currentBet = 0;
            if(this.getNumberOfPlayersAbleToAct() < this.minimumNumberOfPlayersNeededToContinue){
                this.beginTheShowDown();
                return;
            }
            if(this.revealMoreCommunityCards()){
                this.advanceTheGame();
            }
            else{
                this.beginTheShowDown();
                return;
            }
        }
        else{
            this.findNextTurn();
            this.setPlayerTurn();
        }
    }

    /**
     * Performs the raise action for the current player
     * @param {int} raiseToValue The value to raise by
     */
    playerRaiseFinish(raiseToValue){
        this.currentBet = raiseToValue;
        // we don't check for next card reveal because now all decisions are to be reset
        for(let i = 0; i < this.numberOfTableSeats; i++){
            this.tableSeats[i].madeDecision = false;
        }
        this.tableSeats[this.seatTurnID].madeDecision = true; // all but the raiser have had their decisions reset
        this.findNextTurn();
        this.setPlayerTurn();
    }

    /**
     * Performs the All-In action for the current player
     * @param {int} raiseToValue The value to raise by
     */
    playerAllInFinish(raiseToValue){
        // if raise to value is -1 then it wasn't a raise
        if(raiseToValue !== -1){ // player is raising with their all in
            this.currentBet = raiseToValue;
            // we don't check for next card reveal because now all decisions are to be reset
            for(let i = 0; i < this.numberOfTableSeats; i++){
                this.tableSeats[i].madeDecision = false;
            }
            // because the player went all in, his able to act is set to false,
            // thus we don't care about his madeDecision being set to false
            this.findNextTurn();
            this.setPlayerTurn();
        }
        else{
            // player is not raising
            // now check if we are ready for the next card reveal
            if(this.allAblePlayersMadeDecision()){
                this.currentBet = 0; // the current bet is reset to zero
                if(this.getNumberOfPlayersAbleToAct() < this.minimumNumberOfPlayersNeededToContinue){
                    this.beginTheShowDown();
                    return;
                }
                // we reveal the next card(s)
                if(this.revealMoreCommunityCards()){ // we have more community cards to reveal, function updated for us
                    // set the turn to the next "able" player starting with the dealer
                    this.advanceTheGame();
                }
                else{
                    // begin the show down
                    this.beginTheShowDown();
                    return;
                }
            }
            else{
                this.findNextTurn();
                this.setPlayerTurn();
            }
        }
    }

    /**
     * Performs the fold action for the current player
     */
    playerFoldFinish() {
        // the player folded, they are removed from the game
        this.cardsShownToAllPlayers[this.seatTurnID][0] = 'invisible';
        this.cardsShownToAllPlayers[this.seatTurnID][1] = 'invisible';
        if(this.allAblePlayersMadeDecision()) {
            this.currentBet = 0; // the current bet is reset to zero
            // now we must check
            if(this.getNumberOfPlayersAbleToAct() < this.minimumNumberOfPlayersNeededToContinue) {
                this.beginTheShowDown();
                return;
            }
            // we reveal the next card(s)
            if(this.revealMoreCommunityCards()) { // we have more community cards to reveal, function updated for us
                // set the turn to the next "able" player starting with the dealer
                this.advanceTheGame();
                return;
            }
            else {
                // begin the show down
                this.beginTheShowDown();
                return;
            }
        } else { 
            this.findNextTurn();
            this.setPlayerTurn();
            // we need to check if only one person remains in the game if so, they don't get a decision we automatically go to the showdown
            // TODO: later we automatically end the game without show down and give him all the chips (no calculation required)
            if(this.getNumberOfPlayersStillInPlay() === 1){
                this.beginTheShowDown();
            }
        }
    }

    /**
     * Checks if all players able to act at the table have made a decision
     */
    allAblePlayersMadeDecision() {
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].isPlayerSeatAbleToAct() && !this.tableSeats[i].madeDecision) {
                return false; // a player is able to act but has not made a decision
            }
        }
        return true; // everyone that can act has made a decision
    }

    /**
     * Reveal the next applicable community card(s)
     */
    revealMoreCommunityCards() {
        switch(this.communityCardsShown) {
            case 0:
                this.communityCardsShown = this.flopNumber; // flop cards
                return true;
            case this.flopNumber:
                this.communityCardsShown = this.turnNumber; // turn card
                return true;
            case this.turnNumber:
                this.communityCardsShown = this.riverNumber; // river card
                return true;
            default:
                return false; // time for the show down      
        }
    }

    /**
     * Shows one more community card
     */
    showOneMoreCommunityCard() {
        this.communityCardsShown++;
    }

    /**
     * Begin the showdown event
     */
    beginTheShowDown() {
        // we set the seat states of the table
        for(let i = 0; i < this.numberOfTableSeats; i++) {
            this.tableSeats[i].madeDecision = false; // reset decision
            this.tableSeats[i].pot += this.tableSeats[i].bet; // update each player's pot
            this.potTotal += this.tableSeats[i].bet; // update the total pot
            this.tableSeats[i].bet = 0; // reset bet
            this.tableSeats[i].turn = false;
        }
        if(this.getNumberOfPlayersStillInPlay() >= 2){
            for(let i = 0; i < this.numberOfTableSeats; i++) {
                if(this.tableSeats[i].inPlay) {
                    this.cardsShownToAllPlayers[i] = ['card_back', 'card_back'];
                }
            }
            // calculate all player card ranks
            for(let i = 0; i < this.numberOfTableSeats; i++) {
                if(this.tableSeats[i].inPlay) {
                    this.tableSeats[i].handRank = this.pokerHandRankCalculator.calculatePokerHandRank(this.communityCards, this.tableSeats[i].cards);
                }
            }
            this.currentPlayerSeatCardReveal = this.dealerSeatID; // the dealer is the first to reveal their cards
        } else{ // only one player left who hasn't folded, no card reveal
            this.currentPlayerSeatCardReveal = this.dealerSeatID;
            this.currentRankingHand = 1;
            for(let i = 0; i < this.numberOfTableSeats; i++) {
                if(this.tableSeats[i].inPlay) {
                    this.tableSeats[i].handRank = 1; // the best hand rank starts at -1 so give this player something higher
                }
            }
            this.showDownWithCardReveal = false;
        }
        this.showdown = true;
    }

    /**
     * Calculates and distributes chips to players
     */
    calculateAndDistributeChips() {
        let players = [];
        for(let i = 0; i < this.numberOfTableSeats; i++) {
            players.push(this.tableSeats[i].getChipDistributionObject());
        }
        
        this.chipDistributionCalculator.calculateChipDistribution(players);
        for(let i = 0; i < this.numberOfTableSeats; i++) {
            this.tableSeats[i].chips += players[i].returnPot;
        }
        this.potTotal = 0;
    }

    /**
     * Boots players from the room
     * @param {Object} io The socket of the user
     * @param {OBject} room The object defining the room
     */
    bootPlayers(io, room){
        for(let i = 0; i < this.numberOfTableSeats; i++){
            let seat = this.tableSeats[i];
            if(!seat.seatOpen && seat.chips === 0){
                io.sockets.connected[this.tableSeats[i].socketID].leave(room.id);
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
        this.potTotal += seat.bet; // what ever they left in the bet is now part of the pot
        io.sockets.connected[seat.socketID].leave(room.id);
        seat.resetSeat();
        if(userID === this.tableSeats[this.seatTurnID].userID){ // it was their turn, find the next one
            clearTimeout(this.timeout); // player made an action, stop the timeout
            this.findNextTurn();
            this.setplayerTurn();
        }
        if(this.getNumberOfPlayersStillInPlay() === 1){ // at this point the last player does not get a turn, they just win
            this.beginTheShowDown();
        }
        return chips;
    }

    /**
     * Reset the table
     */
    reset(){
        this.cardsShownToAllPlayers = [ // sent to all players at the show down and updated with each players real cards on reveal
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
        ];
        this.communityCards = ['', '', '', '', ''];
        this.communityCardsShown = 0;
        this.currentRankingHand = -1;
        for(let i = 0; i < this.numberOfTableSeats; i++) {
            if(!this.tableSeats[i].seatOpen) {
                this.tableSeats[i].resetPlayer();
            }
        }
        this.gameInPlay = false;
    }
};

module.exports = PokerTable;