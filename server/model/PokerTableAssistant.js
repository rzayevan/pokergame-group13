let DeckOfCards = require('./DeckOfCards.js');

module.exports = class PokerTableAssistant {
    constructor(tableSeats, bigBlind){
        this.tableSeats = tableSeats; // the seats at the poker table
        this.bigBlind = bigBlind;
        this.deckCards = new DeckOfCards();
        this.cardsShownToAllPlayers = []; // sent to all players at the show down and updated with each players real cards on reveal
        for(let i = 0; i < tableSeats.length; i++){
            this.cardsShownToAllPlayers.push(['invisible', 'invisible']);
        }
        this.numberOfCardsDealtToEachPlayer = 2;
        this.communityCardsShown = 0; // how many community cards are visible to the table
        this.communityCards = ['', '', '', '', '']; // the community cards of the current round
        this.minimumNumberOfPlayersNeededToContinue = 2;
        this.showdown = false; // whether or not the showdown has begun
        this.showDownWithCardReveal = true; // whether or not a card reveal will be involved
        this.flopNumber = 3;
        this.turnNumber = 4;
        this.riverNumber = 5;
        this.currentBet = 0; // current bet the table has been raised to, gets reset to zero after each card reveal
        this.seatTurnID = -1; // the seatID of the current turn
        this.dealerSeatID = -1; // the seatID of the current dealer, even if dealer leaves this value persists
        this.currentPlayerSeatCardReveal = 0; // the seat id of the current player showing their cards at the show down
        this.currentRankingHand = -1; // the current ranking hand of the round
        this.chipDistributionCalculator = require("../controllers/ChipDistributionCalculator.js");
        this.pokerHandRankCalculator = require("../controllers/PokerHandRankCalculator.js");
    }

    /**
     * Returns an array of the shown community cards
     */
    getCommunityCards(){
        let comCards = [];
        for(let i = 0; i < this.communityCardsShown; i++){
            comCards.push(this.communityCards[i]);
        }
        return comCards;
    }

    /**
     * Finds the next player who can make a decision
     */
    findNextTurn() { // will look for the next player that can act, it is confirmed beforehand such a player exists
        // we go though all the seats until we find a player
        for(let i = 0; i < this.tableSeats.length; i++){
            this.seatTurnID++;
            if(this.seatTurnID > this.tableSeats.length - 1){ this.seatTurnID = 0; }
            if(this.tableSeats[this.seatTurnID].isPlayerSeatAbleToAct()){// found the next player
                return;
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
        this.tableSeats[this.seatTurnID].action = 'THINKING';
    }

    getPlayerTurnOptions() { // for the current player's turn get list of options available
        return this.tableSeats[this.seatTurnID].getTurnOptions(this.currentBet, this.bigBlind);
    }

    wasItTheirTurn(userID){
        if(this.seatTurnID === -1){ // the game hasn't even started
            return false;
        }
        return userID === this.tableSeats[this.seatTurnID].userID;
    }

    /**
     * Sets the community cards
     */
    setPlayerCards() {
        for(let i = 0; i < this.tableSeats.length; i++){
            if(this.tableSeats[i].inPlay){
                this.tableSeats[i].cards[0] = this.deckCards.getCard();
                this.tableSeats[i].cards[1] = this.deckCards.getCard();
            }
        }
    }

        /**
     * Sets the community cards
     */
    setCommunityCards() {
        for(let i = 0; i < this.communityCards.length; i++){
            this.communityCards[i] = this.deckCards.getCard();
        }
    }

    getNumberOfCommunityCardsLeftToReveal(){
        return this.communityCards.length - this.communityCardsShown;
    }

    /**
     * Returns the number of players that are still in play
     */
    getNumberOfPlayersStillInPlay() {
        let count = 0;
        for(let i = 0; i < this.tableSeats.length; i++){
            if(this.tableSeats[i].inPlay){
                count++;
            }
        }
        return count;
    }

    /**
     * Function that begins the game at the current table
     */
    beginTheGame(){
        this.deckCards.shuffleDeck();
        this.setPlayerCards();// each player is dealt two cards, from the server perspective the order of the cards doesn't matter
        this.setCommunityCards();

        this.currentBet = this.bigBlind; // standard bet starts at the big blind
        
        this.seatTurnID = this.dealerSeatID; // we start from the previous dealer position
        this.findNextTurn(); // will move seatTurnID to the next player in game
        this.makeDealer(); // assigns the current seatTurnID dealer status

        this.findNextTurn();
        this.makeBlind(this.bigBlind/2); // small blind

        this.findNextTurn();
        this.makeBlind(this.bigBlind); // big blind

        this.findNextTurn();
        this.setPlayerTurn(); // set the player to be able to make a decision
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
                if(socketID !== this.tableSeats[this.seatTurnID].socketID){ // disconnects happen, correct the socket id
                    this.tableSeats[this.seatTurnID].socketID = socketID;
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if all players able to act at the table have made a decision
     */
    allAblePlayersMadeDecision() {
        for(let i = 0; i < this.tableSeats.length; i++){
            if(this.tableSeats[i].isPlayerSeatAbleToAct() && !this.tableSeats[i].madeDecision) {
                return false; // a player is able to act but has not made a decision
            }
        }
        return true; // everyone that can act has made a decision
    }

    /**
     * Returns the number of players still in play that can make a decision
     */
    getNumberOfPlayersAbleToAct() {
        let count = 0;
        for(let i = 0; i < this.tableSeats.length; i++){
            if(this.tableSeats[i].ableToAct) {
                count++;
            }
        }
        return count;
    }

    /**
     * Resets player bets, decisions and the turn
     */
    advanceTheGame() { 
        this.revealMoreCommunityCards();
        this.seatTurnID = this.dealerSeatID; // set current turn to dealer
        if(!this.tableSeats[this.seatTurnID].isPlayerSeatAbleToAct()){ // dealer is not able to act, find next player
            this.findNextTurn();
        }
        this.setPlayerTurn();
    }

    /**
     * Reveal the next applicable community card(s)
     */
    revealMoreCommunityCards() {
        switch(this.communityCardsShown) {
            case 0:
                this.communityCardsShown = this.flopNumber; // flop cards
                break;
            case this.flopNumber:
                this.communityCardsShown = this.turnNumber; // turn card
                break;
            case this.turnNumber:
                this.communityCardsShown = this.riverNumber; // river card
                break;
            default:
                break; // time for the show down      
        }
    }

    /**
     * Performs the aftermath of a player check action
     */
    playerCheckFinish() {
        if(this.allAblePlayersMadeDecision()) { // for the current stage of play, all able players have made a decision
            this.currentBet = 0; // the current bet is reset to zero
            for(let i = 0; i < this.tableSeats.length; i++){
                this.tableSeats[i].resetForNextStage(); // each player resets themselves and sends back their bet for the pot total
            }
            if(this.getNumberOfPlayersAbleToAct() < this.minimumNumberOfPlayersNeededToContinue) {
                this.beginTheShowDown();
            }
            else if(this.communityCardsShown < this.riverNumber) { // we have more community cards to reveal
                this.advanceTheGame();// set the turn to the next "able" player starting with the dealer
            }
            else{
                this.beginTheShowDown();
            }
        }
        else{
            this.findNextTurn();
            this.setPlayerTurn();
        }
    }

    /**
     * Performs the call action for the current player
     */
    playerCallFinish() {
        if(this.allAblePlayersMadeDecision()){
            this.currentBet = 0;
            for(let i = 0; i < this.tableSeats.length; i++){
                this.tableSeats[i].resetForNextStage(); // each player resets themselves and sends back their bet for the pot total
            }
            if(this.getNumberOfPlayersAbleToAct() < this.minimumNumberOfPlayersNeededToContinue){
                this.beginTheShowDown();
            }
            else if(this.communityCardsShown < this.riverNumber){
                this.advanceTheGame();
            }
            else{
                this.beginTheShowDown();
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
        for(let i = 0; i < this.tableSeats.length; i++){
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
            for(let i = 0; i < this.tableSeats.length; i++){
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
                for(let i = 0; i < this.tableSeats.length; i++){
                    this.tableSeats[i].resetForNextStage(); // each player resets themselves and sends back their bet for the pot total
                }
                if(this.getNumberOfPlayersAbleToAct() < this.minimumNumberOfPlayersNeededToContinue){
                    this.beginTheShowDown();
                }
                else if(this.communityCardsShown < this.riverNumber){ // we have more community cards to reveal
                    this.advanceTheGame();
                }
                else{
                    this.beginTheShowDown();
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
        if(this.allAblePlayersMadeDecision()) {
            this.currentBet = 0; // the current bet is reset to zero
            for(let i = 0; i < this.tableSeats.length; i++){
                this.tableSeats[i].resetForNextStage(); // each player resets themselves and sends back their bet for the pot total
            }
            if(this.getNumberOfPlayersAbleToAct() < this.minimumNumberOfPlayersNeededToContinue) {
                this.beginTheShowDown();
            }
            else if(this.communityCardsShown < this.riverNumber) { // we have more community cards to reveal, function updated for us
                this.advanceTheGame();
            }
            else {
                this.beginTheShowDown();
            }
        }
        else if(this.getNumberOfPlayersStillInPlay() === 1){
            // we need to check if only one person remains in the game if so, they don't get a decision we automatically go to the showdown
            // TODO: later we automatically end the game without show down and give him all the chips (no calculation required)
            this.beginTheShowDown();
        }
        else { 
            this.findNextTurn();
            this.setPlayerTurn();
        }
    }

    /**
     * Begin the showdown event
     */
    beginTheShowDown() {
        // we set the seat states of the table
        this.currentBet = 0;
        for(let i = 0; i < this.tableSeats.length; i++){
            this.tableSeats[i].resetForNextStage(); // each player resets themselves and sends back their bet for the pot total
        }
        if(this.getNumberOfPlayersStillInPlay() >= 2){ // a card reveal showdown
            for(let i = 0; i < this.tableSeats.length; i++) {
                if(this.tableSeats[i].inPlay) {
                    this.cardsShownToAllPlayers[i] = ['card_back', 'card_back']; // up until this point they have been invisible
                }
            }
            // calculate all player card ranks
            for(let i = 0; i < this.tableSeats.length; i++) {
                if(this.tableSeats[i].inPlay) {
                    this.tableSeats[i].handRank = this.pokerHandRankCalculator.calculatePokerHandRank(this.communityCards, this.tableSeats[i].cards);
                }
            }
            this.currentPlayerSeatCardReveal = this.dealerSeatID; // the dealer is the first to reveal their cards
        } else{ // only one player left who hasn't folded, no card reveal
            this.showDownWithCardReveal = false;
            this.currentRankingHand = 1;
            for(let i = 0; i < this.tableSeats.length; i++){
                if(this.tableSeats[i].inPlay){
                    this.tableSeats[i].handRank = this.currentRankingHand; // everyone else is stuck at -1, to satisfy the chip distribution calculator we need the seat still in play to have the best handrank
                }
            }
        }
        this.showdown = true;
    }

    /**
     * Shows one more community card
     */
    showOneMoreCommunityCard() { // called by the server if some community cards are not yet shown at the showdown
        this.communityCardsShown++;
    }

    /**
     * Returns an array of player cards that have been shown to all players
     */
    getShowdownCardRevealState() {
        return this.cardsShownToAllPlayers;
    }

    /**
     * Determines and sets the order for each player to show their cards
     */
    showNextPlayerCards() {
        // we need to find the next player who's hand rank is greater than or equal to the last set their cards to visible
        for(let i = 0; i < this.tableSeats.length; i++){
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
                i = this.tableSeats.length;
            }
            this.currentPlayerSeatCardReveal++;
            if(this.currentPlayerSeatCardReveal > this.tableSeats.length - 1){
                this.currentPlayerSeatCardReveal = 0;
            }
        }
    }

    /**
     * Calculates and distributes chips to players
     */
    calculateAndDistributeChips() {
        let players = [];
        for(let i = 0; i < this.tableSeats.length; i++) {
            players.push(this.tableSeats[i].getChipDistributionObject());
        }
        this.chipDistributionCalculator.calculateChipDistribution(players);
        for(let i = 0; i < this.tableSeats.length; i++) {
            this.tableSeats[i].chips += players[i].returnPot;
            this.tableSeats[i].pot = 0; // after calculating chips their pots are reset
        }
    }

    /**
     * Reset the table
     */
    reset(){
        for(let i = 0; i < this.cardsShownToAllPlayers.length; i++){
            this.cardsShownToAllPlayers[i] = ['invisible', 'invisible'];
        }
        this.communityCards = ['', '', '', '', ''];
        this.communityCardsShown = 0;
        this.currentRankingHand = -1;
        for(let i = 0; i < this.tableSeats.length; i++) {
            if(!this.tableSeats[i].seatOpen) {
                this.tableSeats[i].resetPlayer();
            }
        }
        this.showdown = false;
        this.showDownWithCardReveal = true;
        this.seatTurnID = -1;
        this.currentPlayerSeatCardReveal = 0;
    }
};