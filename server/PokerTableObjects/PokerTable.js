let PokerPlayerSeat = require("./PokerPlayerSeat.js");

// this is a pokerTable class which will handle the current poker table state
// it contains info on the players, community cards, bets, etc.
module.exports = class PokerTable {
    constructor(bigBlind, tableName, tableID) {
        this.tableID = tableID;
        this.tableName = tableName;
        this.numberOfTableSeats = require("./PokerUtilities.js").numberOfTableSeats;
        this.minimumNumberOfPlayersNeededToContinue = 2;
        this.flopNumber = 3;
        this.turnNumber = 4;
        this.riverNumber = 5;
        this.bigBlind = bigBlind; // the big blind of the table
        this.buyIn = bigBlind * 10;
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
        this.chatMessages = []; // a list of all chat messages, not sure if its appropriate to keep here
        this.tableActive = false; // whether or not the table is active, true when 2+ players are present
        this.gameInPlay = false;
        
         // temporary set of cards not for final design
        this.deckCards = ['A_S', '2_S', '3_S', '4_S', '5_S', '6_S', '7_S', '8_S', '9_S', '10_S', 'J_S', 'Q_S', 'K_S', 'A_C', '2_C', '3_C', '4_C', '5_C', '6_C', '7_C'];
        this.currentDeckCard = 0; // a marker to point to the current card of the deck being handled, not for final design
        this.cardsShownToAllPlayers = [ // sent to all players at the show down and updated with each players real cards on reveal
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
        ];
        this.currentPlayerSeatCardReveal = -1; // the seat id of the current player showing their cards at the show down
        this.currentRankingHand = -1;
        this.chipDistributionCalculator = require("./ChipDistributionCalculator.js");
        
        // decide which of the two to use
        this.pokerHandRankCalculator = require("./PokerHandRankCalculator.js");
        //this.pokerHandRankCalculator = require("./test.js");
    }

    getNumberOfPlayersStillInPlay(){
        let count = 0;
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].inPlay){
                count++;
            }
        }
        return count;
    }

    isTableFull(){
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].seatOpen){
                return false;
            }
        }
        return true;
    }

    isPlayerAtTable(profile){
        if(this.tableSeats.find(seat => seat.userID === profile.userID) === undefined){
            return false;
        }
        else{
            return true;
        }
    }

    getTableState(){
        let seatStates = [];
        for(let i = 0; i < this.numberOfTableSeats; i++){
            seatStates.push(this.tableSeats[i].getSeatState());
        }
        return {
            seatStates: seatStates, // all the table seat states
            communityCards: this.getCommunityCards(), // the community cards that have been shown 
            currentBet: this.currentBet, // the current bet of the table
            potTotal: this.potTotal
        };
    }

    getWinnerSocketIDs(){
        let winners = [];
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].handRank === this.currentRankingHand){
                winners.push(this.tableSeats[i].socketID);
            }
        }
        return winners;
    }

    showNextPlayerCards(){
        // we need to find the next player who's hand rank is greater than or equal to the last
        // set their cards to visible
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
            }
            else{
                this.currentPlayerSeatCardReveal++;
                if(this.currentPlayerSeatCardReveal > this.numberOfTableSeats - 1){
                    this.currentPlayerSeatCardReveal = 0;
                }
            }
        }
    }

    getShowdownCardRevealState(){ // returns an array of player cards
        return this.cardsShownToAllPlayers;
    }

    getCommunityCards(){
        let comCards = [];
        for(let i = 0; i < this.communityCardsShown; i++){
            comCards.push(this.communityCards[i]);
        }
        return comCards;
    }

    addPlayerToTable(profile, socketID){
        profile.chips -= this.buyIn;
        let emptySeat = this.tableSeats.find(tableSeat => tableSeat.seatOpen === true);
        emptySeat.addPlayerToTable(profile, socketID, this.buyIn, this.gameInPlay);
        return {seatID: emptySeat.seatID, tableName: this.tableName, tableID: this.tableID, bigBlind: this.bigBlind};
    }

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

    beginTheGame(){
        this.gameInPlay = true;
        if(this.showdown){ // this is to just change the cards of the deck, remove later and use a real card shuffler
            this.deckCards = ['A_H', '2_H', '3_H', '4_H', '5_H', '6_H', '7_H', '8_H', '9_H', '10_H', 'J_H', 'Q_H', 'K_H', 'A_D', '2_D', '3_D', '4_D', '5_D', '6_D', '7_D'];
        }
        this.showdown = false;
        this.currentDeckCard = 0;
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
        this.setplayerTurn(); // set the player to be able to make a decision
        // now distribute the cards
        // starting to the left of the dealer cards get distributed into the hands
        let numberOfCardsDealtToEachPlayer = 2;
        for(let i = 0; i < numberOfCardsDealtToEachPlayer; i++){ // each player is dealt two cards
            for(let j = 0; j < this.getNumberOfPlayersAbleToAct(); j++){ // since everyone playing is able to act at the start, this is appropriate to use
                dealerSpot = this.findNextPlayerToDistributeACard(dealerSpot); // starting one seat left of the dealer distribute a card
                this.tableSeats[dealerSpot].cards[i] = this.deckCards[this.currentDeckCard];
                this.currentDeckCard++;
            }
        }
        this.setCommunityCards();
    }

    findNextPlayerToDistributeACard(pos){ // without incrementing the turn we want to find the next player in the game, used for distributing cards
        for(let i = 0; i < this.numberOfTableSeats; i++){
            pos++;
            if(pos > this.numberOfTableSeats - 1){
                pos = 0;
            }
            if(!this.tableSeats[pos].seatOpen){
                // found the next player
                return pos;
            }
        }
    }

    findNextTurn(){ // find the next player who can make a decision
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

    makeDealer(){
        this.tableSeats[this.seatTurnID].dealer = true;
        this.dealerSeatID = this.seatTurnID;
    }

    getNumberOfPlayersAbleToAct(){ // returns the number of players still in play that can make decisions
        let count = 0;
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].ableToAct){
                count++;
            }
        }
        return count;
    }

    makeBlind(blind){
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

    setplayerTurn(){
        // setup so the current turn is ready to make a decision
        this.tableSeats[this.seatTurnID].turn = true;
    }

    setCommunityCards(){
        for(let i = 0; i < this.communityCards.length; i++){
            this.communityCards[i] = this.deckCards[this.currentDeckCard];
            this.currentDeckCard++;
        }
    }

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

    advanceTheGame(){ // will reset player bets, decisions, and the turn. called after a card reveal stage
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
        this.setplayerTurn();
    }

    playerAction(action, raiseToValue){
        let response = this.tableSeats[this.seatTurnID].playerAction(action, this.currentBet, raiseToValue, this.bigBlind);
        if(response.success){ // the action was accepted
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
        else{
            return false;
        }
    }

    playerCheckFinish(){
        if(this.allAblePlayersMadeDecision()){
            this.currentBet = 0; // the current bet is reset to zero
            if(this.getNumberOfPlayersAbleToAct() < this.minimumNumberOfPlayersNeededToContinue){
                beginTheShowDown();
                return;
            }
            // we reveal the next card(s)
            if(this.revealMoreCommunityCards()){ // we have more community cards to reveal, function updated for us
                // set the turn to the next "able" player starting with the dealer
                this.advanceTheGame();
            }
            else{
                this.beginTheShowDown();
                return;
            }
        }
        else{
            this.findNextTurn();
            this.setplayerTurn();
        }
    }

    playerCallFinish(){
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
            this.setplayerTurn();
        }
    }

    playerRaiseFinish(raiseToValue){
        this.currentBet = raiseToValue;
        // we don't check for next card reveal because now all decisions are to be reset
        for(let i = 0; i < this.numberOfTableSeats; i++){
            this.tableSeats[i].madeDecision = false;
        }
        this.tableSeats[this.seatTurnID].madeDecision = true; // all but the raiser have had their decisions reset
        this.findNextTurn();
        this.setplayerTurn();
    }

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
            this.setplayerTurn();
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
                this.setplayerTurn();
            }
        }
    }

    playerFoldFinish(){
        // the player folded, they are removed from the game
        this.cardsShownToAllPlayers[this.seatTurnID][0] = 'invisible';
        this.cardsShownToAllPlayers[this.seatTurnID][1] = 'invisible';
        if(this.allAblePlayersMadeDecision()){
            this.currentBet = 0; // the current bet is reset to zero
            // now we must check
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
            this.setplayerTurn();
            // we need to check if only one person remains in the game if so, they don't get a decision we automatically go to the showdown
            // TODO: later we automatically end the game without show down and give him all the chips (no calculation required)
            if(this.getNumberOfPlayersStillInPlay() === 1){
                this.beginTheShowDown();
            }
        }
    }

    allAblePlayersMadeDecision(){ // check if all players able to act at the table have made a decision
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].isPlayerSeatAbleToAct()){
                if(!this.tableSeats[i].madeDecision){
                    return false; // a player is able to act but has not made a decision
                }
            }
        }
        return true; // everyone that can act has made a decision
    }

    revealMoreCommunityCards(){ // we reveal community cards in the order 3 then 1 then 1, so how many we reveal now depends on how many we revealed so far
        switch(this.communityCardsShown){
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

    showOneMoreCommunityCard(){
        this.communityCardsShown++;
    }

    // now we need to finish the showdown
    beginTheShowDown(){
        // we set the seat states of the table
        for(let i = 0; i < this.numberOfTableSeats; i++){
            this.tableSeats[i].madeDecision = false; // reset decision
            this.tableSeats[i].pot += this.tableSeats[i].bet; // update each player's pot
            this.potTotal += this.tableSeats[i].bet; // update the total pot
            this.tableSeats[i].bet = 0; // reset bet
            this.tableSeats[i].turn = false;
        }

        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].inPlay){
                this.cardsShownToAllPlayers[i] = ['card_back', 'card_back'];
            }
        }
        // calculate all player card ranks
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].inPlay){
                this.tableSeats[i].handRank = this.pokerHandRankCalculator.calculate(this.communityCards, this.tableSeats[i].cards);
            }
        }
        this.currentPlayerSeatCardReveal = this.dealerSeatID; // the dealer is the first to reveal their cards
        this.showdown = true;
    }

    calculateAndDistributeChips(){
        let players = [];
        for(let i = 0; i < this.numberOfTableSeats; i++){
            players.push(this.tableSeats[i].getChipDistributionObject());
        }
        
        this.chipDistributionCalculator.calculate(players);
        for(let i = 0; i < this.numberOfTableSeats; i++){
            this.tableSeats[i].chips += players[i].returnPot;
        }
        this.potTotal = 0;
    }

    bootPlayers(){
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(this.tableSeats[i].chips === 0){
                this.tableSeats[i].resetSeat();
            }
        }
    }

    reset(){
        this.cardsShownToAllPlayers = [ // sent to all players at the show down and updated with each players real cards on reveal
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
            ['invisible', 'invisible'],
        ];
        this.currentRankingHand = -1;
        for(let i = 0; i < this.numberOfTableSeats; i++){
            if(!this.tableSeats[i].seatOpen){
                this.tableSeats[i].resetPlayer();
            }
        }
        this.gameInPlay = false;
    }
};