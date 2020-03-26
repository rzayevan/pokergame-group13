// this is a helper class for the poker table

module.exports = class PokerPlayerSeat {
    constructor(seatID) {
        // the private info of each player
        this.socketID = -1; // the socket that is linked with this seat
        this.userID = -1;
        this.pot = 0;
        this.cards = ['', ''];
        this.madeDecision = false;
        this.ableToAct = false; // indicates whether the player still has chips to make decisions
        this.inPlay = false; // indicates whether the player is still part of the round, set to false when folded
        
        this.handRank = -1;
        
        
        // the public info of each player shared with other players, needed for poker UI
        this.seatID = seatID; // the seat id (0-5) of the poker table
        this.seatOpen = true; // indicates whether the seat is occupied by a player
        this.name = ''; // the name of the player at this seat
        this.chips = 0; // the chip total of this player
        this.bet = 0; // the current bet this player has made
        this.dealer = false; // indicates whether or not this player is the dealer
        this.icon = ''; // the icon associated with the player account
        this.action = ''; // the current action of the player (FOLDED, CHECKING, CALLING, RAISING, THINKING, ALL IN)
        this.turn = false; // indicates whether it is this players turn
        this.turnTimeLeft = 0; // the time the player has left on their turn
        // action: FOLDED and ALL IN means the player cannot make anymore decisions, skip turn
    }

    resetSeat(){ // will clear the seat of that player, (sets the seat to empty)
        this.socketID = -1;
        this.userID = -1;
        this.pot = 0;
        this.cards = ['', ''];
        this.madeDecision = false;
        this.ableToAct = false;
        this.inPlay = false;
        this.handRank = -1;
        this.seatOpen = true;
        this.name = '';
        this.chips = 0;
        this.bet = 0;
        this.dealer = false;
        this.icon = '';
        this.action = 'WAITING';
        this.turn = false;
        this.turnTimeLeft = 0;
    }

    resetPlayer(){ // will reset the player for a new game
        this.ableToAct = true;
        this.inPlay = true;
        this.dealer = false;
        this.action = 'WAITING';
        this.turn = false;
        this.pot = 0;
    }

    getChipDistributionObject(){ // a small object sent back for the chip distribution calculator to use
        return {id: this.seatID, rank: this.handRank, moneyPot: this.pot, returnPot: 0};
    }
    
    // this function will receive the action and raise value (only used during a raise)
    // it will assess whether or not the move is valid and return a yes or no reponse
    playerAction(action, currentBet, raiseToValue, bigBlind){// action the player wants to make, current bet of the table, the value the player wishes to raise to
        if(action === "CALL"){
            return this.playerCallAction(currentBet); // check if call action is allowed by the player if so then act on it
        }
        else if(action === "CHECK"){
            return this.playerCheckAction(currentBet); // check if check acion is allowed by the player if so then act on it
        }
        else if(action === "FOLD"){
            return this.playerFoldAction(); // after fold check for number of players left, if only one then the game ends without a show down and the last player collect the whole pot
        }
        else if(action === "CHECK/FOLD"){ // we first check if a check is possible, if so then check, else then fold
            if(this.bet === currentBet){
                return this.playerCheckAction(currentBet);
            }
            else{
                return this.playerFoldAction();
            }
        }
        else if(action === "RAISE"){
            return this.playerRaiseAction(currentBet, raiseToValue, bigBlind);
        }
        else if(action === "ALL IN"){
            return this.playerAllInAction(currentBet);
        }
    }

    playerCheckAction(currentBet){
        // see if the player is allowed to check, if not then send a invalid move response
        if(this.bet === currentBet){
            // the player is matched with the bet, therfore this action is allowed
            this.action = 'CHECKING';
            this.turn = false;
            this.madeDecision = true;
            return {success: true, action: this.action};
        }
        else{
            return {success: false}; // the server wil interpret false as a failed action and do nothing
        }
    }

    playerCallAction(currentBet){
        // check if the player is allowed to call, if not then send a invalid move response
        // first check if player's bet already meets the currentBet
        if(this.bet === currentBet){
            // the player is already matched with the bet (ex: they are the big blind), therfore this action is not allowed
            return {success: false}; // the server wil interpret false as a failed action and do nothing
        }
        let difference = currentBet - this.bet; // difference refers to how much more the current bet is against the player's own bet
        if(this.chips >= difference){ // player can call the current bet
            // player will now call with their chips
            if(this.chips === difference){ // can make the bet but is also going all in
                this.action = 'ALL IN';
                this.ableToAct = false; // since the player is going all in they have no more chips to bet and thus can't make any more actions
            }
            else{
                this.action = 'CALLING';
            }
            this.chips -= difference; // subtract the chips from the player
            this.bet += difference; // add them to his bet
            this.turn = false; // his turn is now over
            this.madeDecision = true; // we mark down that this player has made a decision, it is reset on a card reveal, or raise
            return {success: true, action: this.action, raiseToValue: -1};
        }
        else{
            // the player cannot call, they must either fold or go all in
            return {success: false};
        }
    }

    playerRaiseAction(currentBet, raiseToValue, bigBlind){
        // check if the player is allowed to raise, if not then send a invalid move response
        if(raiseToValue < currentBet + bigBlind){ // a minimum raise by the value of a bigblind against the current bet is needed
            return {success: false}; // the raise to value is invalid
        }
        if(this.chips + this.bet >= raiseToValue){ // player can make the bet
            if(this.chips + this.bet === raiseToValue){ // can make the raise but is also going all in
                this.action = 'ALL IN';
                this.ableToAct = false;
            }
            else{
                this.action = 'RAISING';
            }
            this.chips -= (raiseToValue - this.bet);
            this.bet = raiseToValue;
            this.turn = false;
            this.madeDecision = true;
            return {success: true, action: this.action, raiseToValue: raiseToValue};
        }
        else{
            // the player cannot make the raise
            return {success: false};
        }
    }

    playerAllInAction(currentBet){
        this.action = 'ALL IN';
        this.ableToAct = false;

        this.bet += this.chips;
        this.chips = 0;

        this.turn = false;
        this.madeDecision = true;
        if(this.bet > currentBet){ // player is raising with their all in
            return {success: true, action: this.action, raiseToValue: this.bet};
        }
        else{// player is not raising
            return {success: true, action: this.action, raiseToValue: -1};
        }
    }

    playerFoldAction(){
        // the player wants to fold
        this.action = 'FOLDED';
        this.turn = false;
        this.madeDecision = true;
        this.ableToAct = false;
        this.inPlay = false; // when the show down begins we use this to see if they can win the pot
        return {success: true, action: this.action};
    }

    addPlayerToTable(profile, socketID, chips, gameStarted){ // the profile of player, the socket of player, the seat player will use, the chips the player is bring to table
        // use the userID to join the table
        this.socketID = socketID;
        this.userID = profile.userID;
        this.ableToAct = true;
        if(!gameStarted){
            this.inPlay = true;
        }
        this.seatOpen = false;
        this.name = profile.name;
        this.chips = chips;
        this.dealer = false;
        this.icon = profile.icon;
        this.action = 'WAITING';
        this.turn = false;
    }

    getSeatState(){
        return {
            seatID: this.seatID,
            seatOpen: this.seatOpen,
            name: this.name,
            chips: this.chips,
            bet: this.bet,
            dealer: this.dealer,
            icon: this.icon,
            action: this.action,
            turn: this.turn,
            turnTimeLeft: this.turnTimeLeft
        }
    }

    isPlayerSeatAbleToAct(){
        if(!this.seatOpen && this.inPlay && this.action != 'ALL IN' && this.action != 'FOLDED'){
            // the player can make a decision
            return true;
        }
        else{
            return false;
        }
    }
};