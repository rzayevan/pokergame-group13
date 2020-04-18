<template>
    <div class="container-fluid poker-container">
        <UserNavbar class="w-100" :socket=socket :userData=userData :hideLogOut=true /> <!-- the naviagation bar-->
        <b-row class="row flex-grow-1" no-gutters>
            <b-col cols="12" class="col-lg-9">
                <b-row class="table-container m-0 p-0">
                    <TableLayout
                            v-bind:potTotal="potTotal"
                            v-bind:communityCards="communityCards"
                            v-bind:players="players"
                            v-bind:cardReveal="cardReveal"
                            v-bind:bigBlind="bigBlind"
                            v-bind:timerReset="timerReset"
                    />
                </b-row>
                <b-row class="display-container" no-gutters>
                    <Display
                            v-bind:myCards="myCards"
                            v-bind:bigBlind="bigBlind"
                            v-bind:chipTotal="players[seatID].chipTotal"
                            v-bind:bet="players[seatID].bet"
                            v-bind:turnOptions="turnOptions"
                            v-bind:flipCheckFold="flipCheckFold"
                    />
                </b-row>
            </b-col>
            <b-col cols="3" class="d-none d-lg-block" >
                <Chat v-bind:class="{ chatHalf: !chatFull}"
                      v-bind:tableName="tableName"
                      v-bind:userData="userData"
                />
                <ReportPocket v-if="!chatFull"
                      class="chatHalf"
                      v-bind:report_OffenderName="report_OffenderName"
                      v-bind:report_OffenderMessageId="report_OffenderMessageId"
                      v-bind:showForm="showForm"
                      v-bind:submittedSuccessfully="submittedSuccessfully"
                />
            </b-col>
        </b-row>
    </div>
</template>

<style scoped>
    .container-fluid {
        padding: 0;
        margin: 0;
    }

    .poker-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .table-container {
        height: 60%;
        display: flex;
    }

    .display-container {
        height: 40%;
        display: block;
    }

    .chatHalf {
        height: 50% !important;
    }
</style>

<script>
import UserNavbar from './navbars/UserNavbar.vue';
import Chat from './pokerComponents/Chat.vue';
import ReportPocket from './pokerComponents/ReportPocket.vue';
import TableLayout from './pokerComponents/TableLayout.vue';
import Display from './pokerComponents/Display.vue';

export default {
    name: "Poker",
    components: {
        UserNavbar,
        Chat,
        ReportPocket,
        TableLayout,
        Display,
    },
    props: ['authenticated', 'socket', 'userData', 'roomID', 'seatID', 'tableName', 'bigBlind'],
    data() {
        return {
            checkFold: false, // a toggle that will automatically make a turn decision for you when it is your turn, first see if the player can check, if not then fold
            flipCheckFold: false, // the value doesn't matter, player inputs is only checking if this variable changes, if so then reset checkfold
            raiseToValue: 0,
            timerReset: true, // use this as a toggle, when the value changes, all timers reset (doesn't matter if its true or false)
            // right now the chat calls back to the poker page to send a report, might want to have the chat run with its own socket
            report_OffenderName: '',
            report_OffenderMessageId: '',
            // the image resource files for the card images
            imageFiles: require("../images/ImageFiles"),
            chatFull: true, // indicates whether the chat is in full view or half view (half view when report box is open)
            submittedSuccessfully: false,
            showForm: true,
            cheatSheetOpen: true, // toggle to diplay cheat sheet or not
            cardReveal: false, // set to false until the show down, the players will show their cards
            potTotal: 0,
            // information to set up each player seat including css values (depending on seat position some css will change)
            // most of this will come from the server
            myCards: [{src:null}, {src:null}],
            players: [ // the intial state of all player boxes,these get updated throughout the game
                {occupied: false, classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat1', dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, accountName: "", accountImage: {src: null}, chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat2', dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, accountName: "", accountImage: {src: null}, chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat3', dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, accountName: "", accountImage: {src: null}, chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat4', dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, accountName: "", accountImage: {src: null}, chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat5', dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, accountName: "", accountImage: {src: null}, chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat6', dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, accountName: "", accountImage: {src: null}, chipTotal: "", action: "WAITING", youTag: false, timer: false},
            ],
            communityCards: [{src:null},{src:null},{src:null},{src:null},{src:null}], // community cards revealed at any given time
            turnOptions: {
                check: false,
                call: false,
                fold: false,
                raise: false,
                allIn: false,
            }
        };
    },
    mounted(){
        if(!this.authenticated){
            this.$router.replace({ name: "Login" });
        }
        else{
            // when navigating to this component several times we need to clear the listeners
            this.socket.removeListener("tableState");
            this.socket.removeListener("leaveRoom");
            this.socket.removeListener("beginTheGame");
            this.socket.removeListener('showdown');
            this.socket.removeListener("winner");
            this.socket.removeListener('badMove');
            this.socket.removeListener("reset");
            this.socket.removeListener("submitReportResponse");
            // define all of the socket.on methods here
            this.socket.on('tableState', msgJSON => { // on a state update the UI is updated with all relavent info that can change, this simplifies socket calls by not having a unique socket call for each type of element update
                let msg = JSON.parse(msgJSON);
                let seatStates = msg.seatStates;
                let receivedCommunityCards = msg.communityCards;
                for(let i = 0; i < this.players.length; i++){
                    this.players[i].occupied = !seatStates[i].seatOpen;
                    this.players[i].dealerStatus = seatStates[i].dealer;
                    this.players[i].bet = seatStates[i].bet;
                    this.players[i].accountName = seatStates[i].name;
                    this.players[i].chipTotal = seatStates[i].chips;
                    this.players[i].action = seatStates[i].action;
                    this.players[i].timer = seatStates[i].turn;
                    this.players[i].accountImage.src = this.imageFiles.getImage(seatStates[i].icon).src;
                }
                for(let i = 0; i < receivedCommunityCards.length; i++){
                    this.communityCards[i].src = this.imageFiles.getImage(receivedCommunityCards[i]).src;
                }
                this.potTotal = msg.potTotal;
                // on each tablestate update, this code will run to see if: the player is seated, it is the players turn, the check/fold is toggled
                // if all these conditions are meet then the code will send a check/fold decision without the player's input
                // the server will either check or fold for the player automatically
                if(this.seatID !== '' && this.players[this.seatID].timer === true && this.checkFold){
                    // the player wants to check, if can't then fold
                    this.makeDecision('CHECK/FOLD');
                    this.flipCheckFold = !this.flipCheckFold;
                }
                this.timerReset = !this.timerReset;

                if(seatStates[this.seatID].turn){ // it is your turn
                    this.turnOptions = msg.turnOptions;
                }
                else{ // all buttons except for check/fold toggle are disabled
                    this.turnOptions = {
                        check: false,
                        call: false,
                        fold: false,
                        raise: false,
                        allIn: false,
                        // note: check/fold button is available regardless of turn status
                    }
                }
            });
            this.socket.on('leaveRoom', msg => { // each player upon joining a table will receive the id of the seat they are to sit at
                for(let i = 0; i < this.players.length; i++){
                    let player = this.players[i];
                    player.occupied = false;
                    player.dealerStatus = false;
                    player.cards = {card1: {src: null}, card2: {src: null}};
                    player.bet = 0;
                    player.accountName = "";
                    player.accountImage.src = null;
                    player.chipTotal = "";
                    player.action = "WAITING";
                    player.youTag = false;
                    player.timer = false;
                }
                this.userData.chips += msg.chipValueChangeBy;
                this.$router.replace({ name: "Tables", params: {authenticated: true, socket: this.socket, userData: this.userData} });
            });
            this.socket.on('beginTheGame', cardsJSON => { // each player receives their two personal cards upon the game starting
                let cards = JSON.parse(cardsJSON);
                this.myCards[0].src = this.imageFiles.getImage(cards[0]).src;
                this.myCards[1].src = this.imageFiles.getImage(cards[1]).src;
            });
            this.socket.on('showdown', cardsJSON => { // the showdown has begun, now all player cards are being shown
                let cards = JSON.parse(cardsJSON);
                for(let i = 0; i < this.players.length; i++){
                    this.players[i].cards = {
                        card1: {src: this.imageFiles.getImage(cards[i][0]).src},
                        card2: {src: this.imageFiles.getImage(cards[i][1]).src}
                    };
                }
                this.setPlayerCardsVisibility(true); // TODO: move this to a separate socket call, it only needs to execute once
            });

            this.socket.on('winner', () => { // later add some animation to indicate that they won
                // TODO: winner animation goes here
            });

            this.socket.on('badMove', () => { // later add some animation to indicate that they won
                alert('bad move');
            });

            this.socket.on('reset', () => { // after a round a new game will begin shortly, reset the table to a state that is ready for a new round
                // each player will reset the ui for a new game
                this.myCards = [{src: this.imageFiles.getImage('card_empty').src}, {src: this.imageFiles.getImage('card_empty').src}];
                for(let i = 0; i < this.players.length; i++){
                    this.players[i].cards = {card1: {src: this.imageFiles.getImage('card_back').src}, card2: {src: this.imageFiles.getImage('card_back').src}};
                }
                for(let i = 0; i < this.communityCards.length; i++){
                    this.communityCards[i].src = this.imageFiles.getImage('card_empty').src
                }
                this.setPlayerCardsVisibility(false); // all player cards in the table view are now hidden, (note these are just card_back images, they do not show the table players real cards)
            });

            // Listen for the server's response to a report submission
            // Depending on the response, display a success or failure message
            this.socket.on('submitReportResponse', response => {
                this.showForm = false;
                this.submittedSuccessfully = response;
            });

            // end of socket.on functions
            // asign the standard card_back image to each of player cards inititally
            // later the server will send the true cards at the show down
            this.myCards = [{src: this.imageFiles.getImage('card_empty').src}, {src: this.imageFiles.getImage('card_empty').src}];
            for(let i = 0; i < this.players.length; i++){
                this.players[i].accountImage.src = this.imageFiles.getImage('invisible').src;
                this.players[i].cards = {card1: {src: this.imageFiles.getImage('invisible').src}, card2: {src: this.imageFiles.getImage('invisible').src}};
            }
            for(let i = 0; i < this.communityCards.length; i++){
                this.communityCards[i].src = this.imageFiles.getImage( 'card_empty').src;
            }
            this.raiseToValue = this.bigBlind;
            this.players[this.seatID].youTag = true;
        }
    },
    methods:{
        // define all of the socket.emit methods here,
        makeDecision(action, raise){// upon a player clicking a game play button this function is called, the server will either accept or deny the action
            this.socket.emit("turnDecision", {
                userID: this.userData.id,
                roomID: this.roomID,
                seatID: this.seatID,
                action: action,
                raiseToValue: raise, // only used if player is raising
            });
            this.checkFold = false;
        },
        // end of socket.emit functions
        toggleCheckFoldButton(checkFold){ // toggle the check/fold button, this will allow the client to automatically send an action without user input
            this.checkFold = checkFold;
        },
        exitTable(){ // allows a player to leave the table, player will forfeit any chips in the pot
            this.socket.emit("exitRoomRequest", {
                userID: this.userData.id,
                roomID: this.roomID,
                seatID: this.seatID,
            });
        },
        setRaiseToValue(value){
            this.raiseToValue = value;
        },
        setPlayerCardsVisibility(visible){
            this.cardReveal = visible;
        },
        submitReport(selected, message, report_OffenderName, report_OffenderMessageId, submittingUser){
            let reportData = {
                reportType: selected,
                reportComment: message,
                offenderUsername: report_OffenderName,
                chatMessageId: report_OffenderMessageId,
                reportingUser: submittingUser,
                roomID: this.roomID
            };

            this.socket.emit("submit report", reportData);
        },
        closeReport() {
            this.chatFull = true;
            this.showForm = true;
        },
        openReport(name, messageId){
            // called by child
            this.chatFull = false; // shrink the chat
            // set up the report with some data
            this.report_OffenderName = name;
            this.report_OffenderMessageId = messageId;
        },
    }
};
</script>
