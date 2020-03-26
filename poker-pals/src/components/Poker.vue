<template>
    <div class="outerFrame"> <!--the outer container of the entire page, used to define its size-->
        <UserNavbar /> <!-- the naviagation bar-->
        <div class="tableLayoutAndDisplay"> <!--a container to separate the table and inputs from the chat-->
            <div class="tableLayout"> <!--the container holding the entire table view-->
                <div class="buttonExitTable" v-on:click='exitTable()'> <!-- the exit table button-->
                    <img src="../images/exit_symbol.png"/>
                </div>
                <div class="tableObjects"> <!--a container to hold the table and players, keeps everything centered-->
                    <div class="tableImage"> <!--the green capsule shaped table image-->
                        <img src="../images/table.png"/>
                    </div>
                    <div class="tableItems"> <!--a container to hold the pot count and community cards-->
                        <div class="potContainer">
                            <div class="potTag">POT</div>
                            <div class="potAmount">{{ potTotal }}</div>
                        </div>
                        <div class="tableCards"> <!--the community cards container-->
                            <div class="tableCard" id="communityCard1">
                                <img v-bind:src="communityCards[0].src"/>
                            </div>
                            <div class="tableCard" id="communityCard2">
                                <img v-bind:src="communityCards[1].src"/>
                            </div>
                            <div class="tableCard" id="communityCard3">
                                <img v-bind:src="communityCards[2].src"/>
                            </div>
                            <div class="tableCard" id="communityCard4">
                                <img v-bind:src="communityCards[3].src"/>
                            </div>
                            <div class="tableCard" id="communityCard5">
                                <img v-bind:src="communityCards[4].src"/>
                            </div>
                        </div>
                        <div class="tableDeck"> <!--image showing the deck of cards, for visuals only-->
                            <img v-bind:src="cardFiles[0].src"/>
                        </div>
                    </div>
                    <div class="players"> <!--the container holding the six players at the table, each player receives a collection of props to be displayed-->
                        <PlayerSeat v-for="player in players" :key="player.id" v-bind:id='player.divID'
                            v-bind:occupied="player.occupied"
                            v-bind:classes="player.classes"
                            v-bind:dealerStatus="player.dealerStatus" 
                            v-bind:_id="player.id" 
                            v-bind:cards="player.cards" 
                            v-bind:cardReveal="cardReveal"
                            v-bind:betValue="player.bet"
                            v-bind:tagName="player.tagName"
                            v-bind:tagImage="player.tagImage"
                            v-bind:chipTotal="player.chipTotal"
                            v-bind:action="player.action"
                            v-bind:youTag="player.youTag"
                            v-bind:timer="player.timer"
                        />
                    </div>
                </div>
                <div class="blindsBox">Blinds: 1,000/2,000</div> <!--shows the blinds of this particular table, TODO later bind it to a variable-->
            </div>
            <div class="display">
                <div class="cheatSheetToggle" v-on:click="toggleCheatSheet()"> <!--a toggle to show or hide the cheat sheet-->
                    <img src="../images/cheat_sheet_icon.png"/>
                </div>
                <div class="cheatSheet" id="cheatSheet">
                    <img src="../images/cheatSheet.png"/>
                </div>
                <div class="playerCards"> <!--container holding the players personal cards-->
                    <div class="playerCard" id="playerCard1">
                        <img v-bind:src="myCards[0].src"/>
                    </div>
                    <div class="playerCard" id="playerCard2">
                        <img v-bind:src="myCards[1].src"/>
                    </div>
                </div>
                <div class="playerInputs"> <!--container holding all the players button options-->
                    <button class="inputButton1 centerText" id="buttonFold" v-on:click="makeDecision('FOLD')">FOLD</button>
                    <button class="inputButton1 centerText" id="buttonCheck" v-on:click="makeDecision('CHECK')">CHECK</button>
                    <button class="inputButton1 centerText" id="buttonCall" v-on:click="makeDecision('CALL')">CALL</button>
                    <div class="raiseToggle"> <!--the container holding the raise input, it contains two buttons, a slider, and a value display-->
                        <div class="raiseButtonOuter" id="buttonMinus" v-on:click="decrementRaise()">
                            <div class="raiseButton centerText">-</div>
                        </div>
                        <div class="raiseValue" id="raiseValue">2000</div>
                        <input class="raiseScroll" id="slider" type="range" min="2000" max="100000" value="2000">
                        <div class="raiseButtonOuter" id="buttonPlus" v-on:click="incrementRaise()">
                            <div class="raiseButton centerText">+</div>
                        </div>
                    </div>
                    <button class="inputButton1 centerText" id="buttonRaise" v-on:click="makeDecision('RAISE')">RAISE</button>
                    <button class="inputButton2 centerText" id="buttonCheckFold" v-on:click="toggleCheckFoldButton()">CHECK/FOLD</button>
                    <button class="inputButton1 centerText" id="buttonAllIn" v-on:click="makeDecision('ALL IN')">ALL IN</button>
                </div>
            </div>
        </div>
        <Chat v-bind:full="chatFull"/> <!--the chat container holding all items related to messaging other players-->
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
    
    
    
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
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
    .tableLayout{
        position: relative;
        width: 100%;
        height: 70%;
        background: #b7b7b7;
    }
    .buttonExitTable{
        position: absolute;
        width: 4%;
        height: 10%;
        margin: 1% 0% 0% 1%;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }
    .buttonExitTable:active {
        transform: translateY(4%);
    }
    .buttonExitTable img{
        float: left;
    }
    .tableObjects{
        position: absolute;
        width: 100%;
        height: 79%;
        margin: 5.3% 0% 0% 0%;
    }
    .tableImage{
        position: absolute;
        width: 78%;
        height: 75%;
        margin: 5.75% 0% 0% 11.5%;
        background: transparent;
    }
    .tableItems{
        position: absolute;
        width: 50%;
        height: 15%;
        background: transparent;
        margin: 17.75% 0% 0% 25%;
    }
    .potContainer{
        position: absolute;
        width: 25%;
        height: 100%;
        border-radius: 15%/30%;
        background: #bf214b;
        border: 1px solid black;
        margin: -0.25% 0% 0% -0.125%;
    }
    .potTag{
        color: white;
        font-size: 80%;
        margin: 0%;
        font-size: 1.25vw;
    }
    .potAmount{
        color: white;
        font-size: 1vw;
    }                   
    .tableCards{
        position: absolute;
        width: 61%;
        height: 100%;
        background: transparent;
        margin: 0% 0% 0% 25.5%;
    }
    .tableCard{
        float: left;
        width: 17.5%;
        height: 100%;
        margin: 0% 0% 0% 2%;
        border-radius: 15%;
    }
    .tableDeck{
        position: absolute;
        width: 11.5%;
        height: 100%;
        background: transparent;
        margin: 0% 0% 0% 88.5%;
        border-radius: 15%;
    }
    .players{
        position: absolute;
        width: 60%;
        height: 110%;
        margin: -2% 0% 0% 20%;
    }
    #playerSeat1{
        margin: 0%;
    }
    #playerSeat2{
        margin: 0% 0% 0% 12.5%;
    }
    #playerSeat3{
        margin: 0% 0% 0% 12.5%;
    }
    #playerSeat4{
        position: absolute;
        margin: 54% 0% 0% 75%;
    }
    #playerSeat5{
        position: absolute;
        margin: 54% 0% 0% 37.5%;
    }
    #playerSeat6{
        position: absolute;
        margin: 54% 0% 0% 0%;
    }
    .blindsBox{
        position: absolute;
        width: 20%;
        height: 6%;
        background: transparent;
        margin: 49.2% 0% 0% 80%;
        font-size: 1vw;
        text-align: center;
        font-weight: 1000;
    }
    .display{
        width: 100%;
        height: 30%;
        background: #eeeeee;
        margin: 0%;
    }
    .cheatSheetToggle{
        float: left;
        width: 3%;
        height: 14%;
        margin: 18.25% 0% 0% 1%;
        background-color: transparent;
        cursor: pointer;
    }
    .cheatSheetToggle:active {
        transform: translateY(4%);
    }
    .cheatSheetToggle img{
        float: left;
        width: 100%;
        height: 100%;
    }
    .cheatSheet{
        float: left;
        width: 30%;
        height: 90%;
        background: transparent;
        margin: 1% 0% 0% 1%;
    }
    .playerCards{
        float: left;
        width: 28%;
        height: 90%;
        background: transparent;
        margin: 1% 0% 0% 1%;
    }
    .playerCard{
        float: left;
        width: 45%;
        margin: 5.5% 0% 0% 3%;
    }
    .playerInputs{
        float: left;
        width: 32%;
        height: 79%;
        background: transparent;
        margin: 2% 0% 0% 2%;
    }
    .inputButton1{
        float: left;
        width: 30%;
        height: 25%;
        background: white;
        border: 1px solid black;
        border-radius: 15%/30%;
        font-size: 1vw;
    }
    .inputButton2{
        float: left;
        width: 60%;
        height: 25%;
        background: white;
        border: 1px solid black;
        border-radius: 8%/30%;
        font-size: 1vw;
    }
    #buttonFold{
        margin: 0%;
    }
    #buttonCheck{
        margin: 0% 0% 0% 5%;
    }
    #buttonCall{
        margin: 0% 0% 0% 5%;
    }
    .raiseToggle{
        float: left;
        width: 65%;
        height: 25%;
        margin: 6.75% 0% 0% 0%;
    }
    .raiseButtonOuter{
        float: left;
        width: 20%;
        height: 100%;
        background: black;
        cursor: pointer;
    }
    .raiseButtonOuter:active{
        transform: translateX(4%);
    }
    .raiseButton{
        width: 95%;
        height: 95%;
        background: white;
        font-weight: 700;
        font-size: 1vw;
        margin: 2.5% 0% 0% 2.5%;
    }
    #buttonMinus{
        margin: 0%;
    }
    .raiseValue{
        position: absolute;
        width: 12.25%;
        height: 3%;
        margin: 0% 0% 0% 4.25%;
        font-weight: 700;
        font-size: 1vw;
    }
    .raiseScroll{
        float: left;
        width: 60%;
        height: 40%;
        margin: 13% 0% 0% 0%;
        background: transparent;
    }
    .raiseScroll::-moz-range-thumb{
        width: 25%;
        height: 100%;
        background: #eeeeee;
        cursor: pointer;
    }
    #buttonPlus{
        margin: 0%;
    }
    #buttonRaise{
        margin: 6.75% 0% 0% 5%;
    }
    #buttonCheckFold{
        width: 65%;
        margin: 6.75% 0% 0% 0%;
    }
    #buttonAllIn{
        margin: 6.75% 0% 0% 5%;
        white-space: nowrap;
    }
    .centerText{
        display : flex;
        align-items : center;
        justify-content: center;
    }

    img{
        width: 100%;
        height: 100%;
    }
</style>

<script>

import PlayerSeat from './pokerComponents/PlayerSeat.vue';
import UserNavbar from './UserNavbar.vue';
import Chat from './pokerComponents/Chat.vue';
import ReportPocket from './pokerComponents/ReportPocket.vue';


import io from "socket.io-client";

export default {
    name: "Poker",
    components: {
        PlayerSeat,
        UserNavbar,
        Chat,
        ReportPocket,
    },
    created() {
        this.socket = io("http://localhost:3000");
    },
    data() {
        return {
            socket: {},
            userID: '',
            tableID: 0,
            seatID: '',

            checkFold: false, // a toggle that will automatically make a turn decision for you when it is your turn, first see if the player can check, if not then fold
            // right now the chat calls back to the poker page to send a report, might want to have the chat run with its own socket
            report_OffenderName: '', 
            report_OffenderMessageId: '',
            // the image resource files for the card images
            cardFiles: [ // each image resource is loaded into an array and elements can request them by either index or name
                {src: require(`../images/cards/card_back.png`), name: 'card_back'},
                {src: require(`../images/cards/empty.png`), name: 'card_empty'},
                {src: require(`../images/cards/invisible.png`), name: 'invisible'},
                {src: require(`../images/cards/A_S.png`), name: 'A_S'},
                {src: require(`../images/cards/2_S.png`), name: '2_S'},
                {src: require(`../images/cards/3_S.png`), name: '3_S'},
                {src: require(`../images/cards/4_S.png`), name: '4_S'},
                {src: require(`../images/cards/5_S.png`), name: '5_S'},
                {src: require(`../images/cards/6_S.png`), name: '6_S'},
                {src: require(`../images/cards/7_S.png`), name: '7_S'},
                {src: require(`../images/cards/8_S.png`), name: '8_S'},
                {src: require(`../images/cards/9_S.png`), name: '9_S'},
                {src: require(`../images/cards/10_S.png`), name: '10_S'},
                {src: require(`../images/cards/J_S.png`), name: 'J_S'},
                {src: require(`../images/cards/Q_S.png`), name: 'Q_S'},
                {src: require(`../images/cards/K_S.png`), name: 'K_S'},
                
                {src: require(`../images/cards/A_C.png`), name: 'A_C'},
                {src: require(`../images/cards/2_C.png`), name: '2_C'},
                {src: require(`../images/cards/3_C.png`), name: '3_C'},
                {src: require(`../images/cards/4_C.png`), name: '4_C'},
                {src: require(`../images/cards/5_C.png`), name: '5_C'},
                {src: require(`../images/cards/6_C.png`), name: '6_C'},
                {src: require(`../images/cards/7_C.png`), name: '7_C'},
                {src: require(`../images/cards/8_C.png`), name: '8_C'},
                {src: require(`../images/cards/9_C.png`), name: '9_C'},
                {src: require(`../images/cards/10_C.png`), name: '10_C'},
                {src: require(`../images/cards/J_C.png`), name: 'J_C'},
                {src: require(`../images/cards/Q_C.png`), name: 'Q_C'},
                {src: require(`../images/cards/K_C.png`), name: 'K_C'},

                {src: require(`../images/cards/A_H.png`), name: 'A_H'},
                {src: require(`../images/cards/2_H.png`), name: '2_H'},
                {src: require(`../images/cards/3_H.png`), name: '3_H'},
                {src: require(`../images/cards/4_H.png`), name: '4_H'},
                {src: require(`../images/cards/5_H.png`), name: '5_H'},
                {src: require(`../images/cards/6_H.png`), name: '6_H'},
                {src: require(`../images/cards/7_H.png`), name: '7_H'},
                {src: require(`../images/cards/8_H.png`), name: '8_H'},
                {src: require(`../images/cards/9_H.png`), name: '9_H'},
                {src: require(`../images/cards/10_H.png`), name: '10_H'},
                {src: require(`../images/cards/J_H.png`), name: 'J_H'},
                {src: require(`../images/cards/Q_H.png`), name: 'Q_H'},
                {src: require(`../images/cards/K_H.png`), name: 'K_H'},

                {src: require(`../images/cards/A_D.png`), name: 'A_D'},
                {src: require(`../images/cards/2_D.png`), name: '2_D'},
                {src: require(`../images/cards/3_D.png`), name: '3_D'},
                {src: require(`../images/cards/4_D.png`), name: '4_D'},
                {src: require(`../images/cards/5_D.png`), name: '5_D'},
                {src: require(`../images/cards/6_D.png`), name: '6_D'},
                {src: require(`../images/cards/7_D.png`), name: '7_D'},
                {src: require(`../images/cards/8_D.png`), name: '8_D'},
                {src: require(`../images/cards/9_D.png`), name: '9_D'},
                {src: require(`../images/cards/10_D.png`), name: '10_D'},
                {src: require(`../images/cards/J_D.png`), name: 'J_D'},
                {src: require(`../images/cards/Q_D.png`), name: 'Q_D'},
                {src: require(`../images/cards/K_D.png`), name: 'K_D'},
            ],
            chatFull: true, // indicates whether the chat is in full view or half view (half view when report box is open)
            cheatSheetOpen: true, // toggle to diplay cheat sheet or not
            bigBlind: 2000,
            cardReveal: false, // set to false until the show down, the players will show their cards
            potTotal: 0,
            // information to set up each player seat including css values (depending on seat position some css will change)
            // most of this will come from the server
            myCards: [{src:null}, {src:null}],
            players: [ // the intial state of all player boxes,these get updated throughout the game
                {occupied: false, classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat1', id: 1, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat2', id: 2, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat3', id: 3, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat4', id: 4, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat5', id: 5, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat6', id: 6, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
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
                this.players[i].tagName = seatStates[i].name;
                this.players[i].chipTotal = seatStates[i].chips;
                this.players[i].action = seatStates[i].action;
                this.players[i].timer = seatStates[i].turn;
            }
            for(let i = 0; i < receivedCommunityCards.length; i++){
                this.communityCards[i].src = this.cardFiles.find(file => file.name === receivedCommunityCards[i]).src;
            }
            this.potTotal = msg.potTotal;

            // on each tablestate update this code will run to see if: the player is seated, it is the players turn, the check/fold is toggled
            // if all these conditions are meet then the code will send a check/fold decision without the player's input
            // the server will either check or fold for the player automatically
            if(this.seatID !== '' && this.players[this.seatID].timer === true && this.checkFold){
                // the player wants to check, if can't then fold
                this.makeDecision('CHECK/FOLD');
            }
        });
        
        this.socket.on('yourSeatID', msg => { // each player upon joining a table will receive the id of the seat they are to sit at
            this.seatID = msg;
            this.players[this.seatID].youTag = true;
        });
        
        this.socket.on('beginTheGame', msgJSON => { // each player receives their two personal cards upon the game starting
            let msg = JSON.parse(msgJSON);
            this.myCards[0].src = this.cardFiles.find(file => file.name === msg[0]).src;
            this.myCards[1].src = this.cardFiles.find(file => file.name === msg[1]).src;
        });
        
        this.socket.on('showdown', msgJSON => { // the showdown has begun, now all player cards are being shown
            let msg = JSON.parse(msgJSON);
            for(let i = 0; i < 6; i++){
                this.players[i].cards = {
                    card1: {src: this.cardFiles.find(file => file.name === msg[i][0]).src}, 
                    card2: {src: this.cardFiles.find(file => file.name === msg[i][1]).src}
                };
            }
            this.setPlayerCardsVisibility(true); // TODO: move this to a separate socket call, it only needs to execute once
        });

        this.socket.on('winner', () => { // later add some animation to indicate that they won
            // TODO: winner animation goes here
        });

        this.socket.on('reset', () => { // after a round a new game will begin shortly, reset the table to a state that is ready for a new round
            // each player will reset the ui for a new game
            for(let i = 0; i < 6; i++){
                this.players[i].cards = {card1: {src: this.cardFiles[0].src}, card2: {src: this.cardFiles[0].src}};
            }
            for(let i = 0; i < 5; i++){
                this.communityCards[i].src = this.cardFiles[1].src;
            }
            this.setPlayerCardsVisibility(false); // all player cards in the table view are now hidden, (note these are just card_back images, they do not show the table players real cards)
        });
        // end of socket.on functions
        // set up the slider for raises
        let slider = document.getElementById("slider");
        let output = document.getElementById("raiseValue");
        output.innerHTML = slider.value;

        slider.oninput = function() {
            output.innerHTML = this.value;
        }
        // asign the standard card_back image to each of player cards inititally
        // later the server will send the true cards at the show down
        this.myCards = [{src: this.cardFiles[1].src}, {src: this.cardFiles[1].src}];
        
        for(let i = 0; i < 6; i++){
            this.players[i].cards = {card1: {src: this.cardFiles[0].src}, card2: {src: this.cardFiles[0].src}};
        }
        for(let i = 0; i < 5; i++){
            this.communityCards[i].src = this.cardFiles[1].src;
        }
    },
    methods:{
        // define all of the socket.emit methods here,
        // for now this page alone will login and join users
        // TODO: later remove and use the login and tables page
        logIn(userID){ // a temporary socket function to let a player join a table, later use real athentication
            this.userID = userID;
            this.socket.emit("logIn", this.userID);
        },
        joinTable() { // for now use this function to join into the game
            this.socket.emit("joinTable", { // we send our assigned user id
                userID: this.userID,
                tableID: this.tableID, // the table the player wants to join
            });
        },
        makeDecision(action){// upon a player clicking a game play button this function is called, the server will either accept or deny the action
            this.socket.emit("turnDecision", {
                userID: this.userID,
                tableID: this.tableID,
                seatID: this.seatID,
                action: action,
                raiseToValue: this.getRaiseToValue(), // only used if player is raising
            });
            // TODO: later use v-bind and not getElementById
            this.checkFold = false;
            let b = document.getElementById("buttonCheckFold");
            b.style.backgroundColor = '#ffffff'; // color theme for button not selected
        },
        // end of socket.emit functions
        toggleCheckFoldButton(){ // toggle the check/fold button, this will allow the client to automatically send an action without user input
            this.checkFold = !this.checkFold;
            let b = document.getElementById("buttonCheckFold");
            if(this.checkFold){
                b.style.backgroundColor = '#aaaaaa'; // color theme for button selected
            }
            else{
                b.style.backgroundColor = '#ffffff'; // color theme for button not selected
            }
        },
        exitTable(){ // allows a player to leave the table, player will forfeit any chips in the pot
            // TODO: when all pages are linked this function will be implemented
        },
        toggleCheatSheet(){
            if(this.cheatSheetOpen){
                document.getElementById('cheatSheet').style.opacity = 0.0;
            }
            else{
                document.getElementById('cheatSheet').style.opacity = 1.0;
            }
            this.cheatSheetOpen = !this.cheatSheetOpen;
        },
        incrementRaise(){
            // cap this value if it goes over what the player has left
            let slider = document.getElementById("slider");
            let output = document.getElementById("raiseValue");
            let value = parseInt(slider.value);
            // add up to the big blind to even out the number
            slider.value = (value + (this.bigBlind - (value % this.bigBlind))).toString();
            output.innerHTML = slider.value;
        },
        decrementRaise(){
            // cap this value if it goes over what the player has left
            let slider = document.getElementById("slider");
            let output = document.getElementById("raiseValue");
            let value = parseInt(slider.value);
            // subtract up to the big blind
            let remove = value % this.bigBlind;
            if(remove === 0){
                remove = this.bigBlind;
            }
            slider.value = (value - remove).toString();
            output.innerHTML = slider.value;
        },
        getRaiseToValue(){
            let slider = document.getElementById("slider");
            let value = parseInt(slider.value);
            return value;
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
