// this is a helper class for the poker table

class PokerPlayerSeat {
    /**
     * Constructor for the PokerPlayerSeat object
     * @param {String} seatID The uuid of the seat
     */
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
        this.icon = 'invisible'; // the icon associated with the player account
        this.action = ''; // the current action of the player (FOLDED, CHECKING, CALLING, RAISING, THINKING, ALL IN)
        this.turn = false; // indicates whether it is this players turn
        this.turnTimeLeft = 0; // the time the player has left on their turn
    }

    /**
     * Resets the seat to be empty
     */
    resetSeat() {
        this.socketID = -1;
        this.userID = -1;
        this.pot = this.bet; // what ever they left in the bet is now part of the pot
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
        this.icon = 'invisible';
        this.action = 'WAITING';
        this.turn = false;
        this.turnTimeLeft = 0;
    }

    /**
     * Resets the player to be in a new-game state
     */
    resetPlayer(){ // will reset the player for a new game
        this.handRank = -1;
        this.ableToAct = true;
        this.inPlay = true;
        this.dealer = false;
        this.action = 'WAITING';
        this.turn = false;
        this.pot = 0;
    }

    /**
     * Resets the player to be ready for next stage of the round
     */
    resetForNextStage(){
        this.madeDecision = false; // reset decision
        this.pot += this.bet; // update each player's pot
        this.bet = 0; // reset bet
        this.turn = false;
    }

    /**
     * Returns an object contraining current chip distribution for the seat
     */
    getChipDistributionObject(){
        return { 
            id: this.seatID,
            inPlay: this.inPlay, // used in a special case when only one player remains, no ranks are provided, the chips are just given to him
            rank: this.handRank,
            positionRank: -1, // used later in the chip distribution calculator, for keeping track of rank positions
            moneyPot: this.pot, 
            returnPot: 0 
        };
    }

    /**
     * Assesses whether or not a move is valid and returns a corresponding boolean
     * @param {String} action The action attempting to be performed
     * @param {int} currentBet The current bet of the table
     * @param {int} raiseToValue The value the player wishes to raise to (if applicable)
     * @param {int} bigBlind The big blind of the table
     */
    playerAction(action, currentBet, raiseToValue, bigBlind) {
        switch(action){
            case 'CALL':
                return this.playerCallAction(currentBet); // check if call action is allowed by the player if so then act on it
            case 'CHECK':
                return this.playerCheckAction(currentBet); // check if check acion is allowed by the player if so then act on it
            case 'FOLD':
                return this.playerFoldAction(); // after fold check for number of players left, if only one then the game ends without a show down and the last player collect the whole pot
            case 'CHECK/FOLD': // we first see if a check is possible, if so then check, else then fold
                return (this.bet === currentBet) ? this.playerCheckAction(currentBet) : this.playerFoldAction();
            case 'RAISE':
                return this.playerRaiseAction(currentBet, raiseToValue, bigBlind);
            default: // all in
                return this.playerAllInAction(currentBet);
        }
    }

    /**
     * Checks if the player is allowed to check, otherwise it returns an object stating it is an invalid move
     * @param {int} currentBet The current bet of the table
     */
    playerCheckAction(currentBet){
        // see if the player is allowed to check, if not then send a invalid move response
        if(this.bet === currentBet){
            // the player is matched with the bet, therfore this action is allowed
            this.action = 'CHECKING';
            this.turn = false;
            this.madeDecision = true;
            return { 
                success: true, 
                action: this.action
            };
        }
        // the server wil interpret false as a failed action and do nothing
        return {
            success: false
        }; 
    }

    /**
     * Checks if the player is allowed to perform the call action, otherwise returns an object stating it is an invalid move
     * @param {int} currentBet The current bet of the table
     */
    playerCallAction(currentBet){
        // first check if player's bet already meets the currentBet
        if(this.bet === currentBet){
            // the player is already matched with the bet (ex: they are the big blind), therfore this action is not allowed
            // the server wil interpret false as a failed action and do nothing
            return {
                success: false
            }; 
        }

        // Calculate the difference between the current bet and the players bet
        let difference = currentBet - this.bet; 

        // player can call the current bet
        if(this.chips >= difference){ // player can call the current bet
            // player will now call with their chips
            if(this.chips === difference){ // can make the bet but is also going all in
                this.action = 'ALL IN';
                this.ableToAct = false; // since the player is going all in they have no more chips to bet and thus can't make any more actions
            } else {
                this.action = 'CALLING';
            }
            this.chips -= difference; // subtract the chips from the player
            this.bet += difference; // add them to his bet
            this.turn = false; // his turn is now over
            this.madeDecision = true; // we mark down that this player has made a decision, it is reset on a card reveal, or raise
            return {
                success: true, 
                action: this.action, 
                raiseToValue: -1
            };
        }

        // the player cannot call, they must either fold or go all in
        return {
            success: false
        };
    }

    /**
     * Checks if the player is allowed to perform the raise action, otherwise returns an object stating it is an invalid move
     * @param {int} currentBet The current bet of the table
     * @param {int} raiseToValue The value the player wishes to raise to
     * @param {int} bigBlind The big blind of the table
     */
    playerRaiseAction(currentBet, raiseToValue, bigBlind){

        //If a minimum raise by the value of a bigblind against the current bet is needed
        if(raiseToValue < currentBet + bigBlind) {
            return { 
                success: false 
            }; // the raise to value is invalid
        }

        // If the player can make the bet
        if(this.chips + this.bet >= raiseToValue) { 
            if(this.chips + this.bet === raiseToValue) { // can make the raise but is also going all in
                this.action = 'ALL IN';
                this.ableToAct = false;
            } else {
                this.action = 'RAISING';
            }
            this.chips -= (raiseToValue - this.bet);
            this.bet = raiseToValue;
            this.turn = false;
            this.madeDecision = true;
            return { 
                success: true, 
                action: this.action, 
                raiseToValue: raiseToValue
            };
        }

        // The player cannot make the raise
        return {
            success: false
        };
    }

    /**
     * Checks if the player is raising with their all-in action, otherwise returns an object stating that a raise is not occuring
     * @param {*} currentBet 
     */
    playerAllInAction(currentBet){
        this.action = 'ALL IN';
        this.ableToAct = false;

        this.bet += this.chips;
        this.chips = 0;

        this.turn = false;
        this.madeDecision = true;

        // If the player is raising with their all-in
        if(this.bet > currentBet){ 
            return {
                success: true, 
                action: this.action, 
                raiseToValue: this.bet
            };
        }

        // player is not raising
        return {
            success: true, 
            action: this.action, 
            raiseToValue: -1
        };
    }

    /**
     * Performs the fold action
     */
    playerFoldAction(){
        // the player wants to fold
        this.action = 'FOLDED';
        this.turn = false;
        this.madeDecision = true;
        this.ableToAct = false;
        this.inPlay = false; // when the show down begins we use this to see if they can win the pot
        return {
            success: true, 
            action: this.action
        };
    }

    /**
     * Adds a new player to the table
     * @param {User} profile A User object containing user information for the joining user
     * @param {String} socketID The id of the users socket
     * @param {int} chips The number of chipd the player is bringing to the table
     * @param {Boolean} gameStarted A boolean stating whether or not the game has already started
     */
    addPlayerToTable(profile, socketID, chips, gameStarted) { 
        // use the userID to join the table
        this.socketID = socketID;
        this.userID = profile.id;
        this.ableToAct = true;
        this.inPlay = !gameStarted;
        this.seatOpen = false;
        this.name = profile.username;
        this.chips = chips;
        this.dealer = false;
        this.icon = /*profile.icon*/'player_icon_1'; // TODO: user.js needs to store user image icon
        this.action = 'WAITING';
        this.turn = false;
    }

    /**
     * Returns the state of the current seat
     */
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

    /**
     * Returns a boolean stating whether the player seat is able to act or not
     */
    isPlayerSeatAbleToAct(){
        if(!this.seatOpen && this.inPlay && this.action != 'ALL IN' && this.action != 'FOLDED') {
            // the player can make a decision
            return true;
        }
        
        return false;
    }
};

module.exports = PokerPlayerSeat;