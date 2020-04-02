<template>
    <div class="outerFrame"> <!--the outer container of the entire page, used to define its size-->
        <UserNavbar /> <!-- the naviagation bar-->
        <div class="tableLayoutAndDisplay"> <!--a container to separate the table and inputs from the chat-->
            <TableLayout
                v-bind:potTotal="potTotal"
                v-bind:communityCards="communityCards"
                v-bind:players="players"
                v-bind:cardReveal="cardReveal"
                v-bind:bigBlind="bigBlind"
            />
            <Display v-bind:myCards="myCards" v-bind:bigBlind="bigBlind"/>
        </div>

        <div id="chatContainer"  v-bind:class="{ chatHalf: !chatFull}">
            <Chat v-bind:tableName="tableName" v-bind:userID="userID"/>
        </div>

        <ReportPocket v-if="!chatFull"
              v-bind:report_OffenderName="report_OffenderName"
              v-bind:report_OffenderMessageId="report_OffenderMessageId"
        /> <!--the report box that shows up upon a player requesting to report another player, takes half of the space alotted to the chat-->
    </div>
</template>

<style scoped>
    /* because borders do not accept percentages, they interfere with the scaling calculations, 
    the solution is to surround elements with an outer div with a back ground and then put another
    div inside with the elements, this simulates a black border*/

    /* Limit the chat's size*/
    #chatContainer {
        float: left;
        width: 30%;
        height: 93%;
    }

     .chatHalf {
        height: 46.5% !important;
    }

    .outerFrame{
        width: 80vw;
        height: 45vw;
    }
    .tableLayoutAndDisplay{
        position: relative;
        float: left;
        width: 70%;
        height: 93%;
    }

    img{
        width: 100%;
        height: 100%;
    }
</style>

<script>
import UserNavbar from './navbars/UserNavbar.vue';
import Chat from './pokerComponents/Chat.vue';
import ReportPocket from './pokerComponents/ReportPocket.vue';
import TableLayout from './pokerComponents/TableLayout.vue';
import Display from './pokerComponents/Display.vue';
import io from "socket.io-client";

export default {
    name: "Poker",
    components: {
        UserNavbar,
        Chat,
        ReportPocket,
        TableLayout,
        Display,
    },
    created() {
        this.socket = io("http://localhost:3000");
    },
    data() {
        return {
            socket: {},
            userID: '',
            roomID: -1,
            seatID: '',
            tableName: '', // NOTE: CANNOT USE THIS FOR MESSAGES NOW, USE ROOM ID
            checkFold: false, // a toggle that will automatically make a turn decision for you when it is your turn, first see if the player can check, if not then fold
            raiseToValue: 0, // TODO: set this based on table stakes

            // right now the chat calls back to the poker page to send a report, might want to have the chat run with its own socket
            report_OffenderName: '',
            report_OffenderMessageId: '',
            // the image resource files for the card images
            imageFiles: require("./pokerComponents/ImageFiles").imageFiles,

            chatFull: true, // indicates whether the chat is in full view or half view (half view when report box is open)
            cheatSheetOpen: true, // toggle to diplay cheat sheet or not
            bigBlind: 0,
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
        };
    },
    mounted(){
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
                this.players[i].accountImage.src = this.imageFiles.find(file => file.name === seatStates[i].icon).src;
            }
            for(let i = 0; i < receivedCommunityCards.length; i++){
                this.communityCards[i].src = this.imageFiles.find(file => file.name === receivedCommunityCards[i]).src;
            }
            this.potTotal = msg.potTotal;

            // on each tablestate update, this code will run to see if: the player is seated, it is the players turn, the check/fold is toggled
            // if all these conditions are meet then the code will send a check/fold decision without the player's input
            // the server will either check or fold for the player automatically
            if(this.seatID !== '' && this.players[this.seatID].timer === true && this.checkFold){
                // the player wants to check, if can't then fold
                this.makeDecision('CHECK/FOLD');
            }
        });

        this.socket.on('joinRoom', msg => { // each player upon joining a room will receive the id of the seat they are to sit at
            this.seatID = msg.seatID;
            this.tableName = msg.tableName;
            this.roomID = msg.roomID;
            this.bigBlind = msg.bigBlind;
            this.raiseToValue = this.bigBlind;
            this.players[this.seatID].youTag = true;
        });

        this.socket.on('leaveRoom', () => { // each player upon joining a table will receive the id of the seat they are to sit at
            this.seatID = -1;
            this.tableName = '';
            this.roomID = -1;
            this.bigBlind = 0;
            for(let i = 0; i < 6; i++){
                let player = this.players[i];
                player.occupied = false;
                player.dealerStatus = false;
                player.cards = {card1: {src: null}, card2: {src: null}};
                player.bet = 0;
                player.accountName = "";
                player.accountImage.src = this.imageFiles.find(file => file.name === 'invisible').src;
                player.chipTotal = "";
                player.action = "WAITING";
                player.youTag = false;
                player.timer = false;
            }
            this.$router.push({ name: "Tables" });
        });

        this.socket.on('beginTheGame', msgJSON => { // each player receives their two personal cards upon the game starting
            let msg = JSON.parse(msgJSON);
            this.myCards[0].src = this.imageFiles.find(file => file.name === msg[0]).src;
            this.myCards[1].src = this.imageFiles.find(file => file.name === msg[1]).src;
        });

        this.socket.on('showdown', msgJSON => { // the showdown has begun, now all player cards are being shown
            let msg = JSON.parse(msgJSON);
            for(let i = 0; i < this.players.length; i++){
                this.players[i].cards = {
                    card1: {src: this.imageFiles.find(file => file.name === msg[i][0]).src},
                    card2: {src: this.imageFiles.find(file => file.name === msg[i][1]).src}
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
            this.myCards = [{src: this.imageFiles.find(file => file.name === 'card_empty').src}, {src: this.imageFiles.find(file => file.name === 'card_empty').src}];
            for(let i = 0; i < this.players.length; i++){
                this.players[i].cards = {card1: {src: this.imageFiles.find(file => file.name === 'card_back').src}, card2: {src: this.imageFiles.find(file => file.name === 'card_back').src}};
            }
            for(let i = 0; i < this.communityCards.length; i++){
                this.communityCards[i].src = this.imageFiles.find(file => file.name === 'card_empty').src
            }
            this.setPlayerCardsVisibility(false); // all player cards in the table view are now hidden, (note these are just card_back images, they do not show the table players real cards)
        });
        // end of socket.on functions
        // asign the standard card_back image to each of player cards inititally
        // later the server will send the true cards at the show down
        this.myCards = [{src: this.imageFiles.find(file => file.name === 'card_empty').src}, {src: this.imageFiles.find(file => file.name === 'card_empty').src}];
        for(let i = 0; i < this.players.length; i++){
            this.players[i].accountImage.src = this.imageFiles.find(file => file.name === 'invisible').src;
            this.players[i].cards = {card1: {src: this.imageFiles.find(file => file.name === 'invisible').src}, card2: {src: this.imageFiles.find(file => file.name === 'invisible').src}};
        }
        for(let i = 0; i < this.communityCards.length; i++){
            this.communityCards[i].src = this.imageFiles.find(file => file.name === 'card_empty').src;
        }
    },
    methods:{
        // define all of the socket.emit methods here,
        // for now this page alone will login and join users
        // TODO: later remove and use the login and tables page
        logIn(userID){ // a temporary socket function to let a player join a table, later use real athentication
            this.userID = userID;
        },
        joinRoom(roomID) { // for now use this function to join into the game
            this.socket.emit("joinRoomRequest", { // we send our assigned user id
                userID: this.userID,
                roomID: roomID, // the room the player wants to join
            });
        },
        makeDecision(action){// upon a player clicking a game play button this function is called, the server will either accept or deny the action
            this.socket.emit("turnDecision", {
                userID: this.userID,
                roomID: this.roomID,
                seatID: this.seatID,
                action: action,
                raiseToValue: this.raiseToValue, // only used if player is raising
            });
            this.checkFold = false;
        },
        // end of socket.emit functions
        toggleCheckFoldButton(checkFold){ // toggle the check/fold button, this will allow the client to automatically send an action without user input
            this.checkFold = checkFold;
        },
        exitTable(){ // allows a player to leave the table, player will forfeit any chips in the pot
            // TODO: when all pages are linked this function will be implemented
            this.socket.emit("exitRoomRequest", {
                userID: this.userID,
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
        submitReport(selected, message, report_OffenderName, report_OffenderMessageId){
            // TODO: pass this off to the server
            // later add to reportPocket an indication the message was sent
            alert(JSON.stringify(selected) + " " + JSON.stringify(message) + " " + JSON.stringify(report_OffenderName) + " " + JSON.stringify(report_OffenderMessageId));
            this.chatFull = true;
        },
        cancelReport(){
            this.chatFull = true;
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
