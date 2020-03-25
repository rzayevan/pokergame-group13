<template>
    <div class="outerFrame">
        <NavBar />
        <div class="tableLayoutAndDisplay">
            <div class="tableLayout">
                <div class="buttonExitTable" v-on:click='exitTable()'>
                    <img src="../images/exit_symbol.png"/>
                </div>
                <div class="tableObjects">
                    <div class="tableImage">
                        <img src="../images/table.png"/>
                    </div>
                    <div class="tableItems">
                        <div class="potCount">
                            <div class="potTag">POT</div>
                            <div class="potAmount">14,000</div>
                        </div>
                        <div class="tableCards">
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
                        <div class="tableDeck">
                            <img v-bind:src="cardFiles[0].src"/>
                        </div>
                    </div>
                    <div class="players">
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
                <div class="blindsBox">Blinds: 1,000/2,000</div>
            </div>
            <div class="display">
                <div class="cheatSheetToggle" v-on:click="toggleCheatSheet()">
                    <img src="../images/cheat_sheet_icon.png"/>
                </div>
                <div class="cheatSheet" id="cheatSheet">
                    <img src="../images/cheatSheet.png"/>
                </div>
                <div class="playerCards">
                    <div class="playerCard" id="playerCard1">
                        <img v-bind:src="myCards[0].src"/>
                    </div>
                    <div class="playerCard" id="playerCard2">
                        <img v-bind:src="myCards[1].src"/>
                    </div>
                </div>
                <div class="playerInputs">
                    <button class="InputButton1 centerText" id="buttonFold" v-on:click="makeDecision('FOLD')">FOLD</button>
                    <button class="InputButton1 centerText" id="buttonCheck" v-on:click="makeDecision('CHECK')">CHECK</button>
                    <button class="InputButton1 centerText" id="buttonCall" v-on:click="makeDecision('CALL')">CALL</button>
                    <div class="raiseToggle">
                        <div class="raiseButtonOuter" id="buttonMinus" v-on:click="decrementRaise()">
                            <div class="raiseButton centerText">-</div>
                        </div>
                        <div class="raiseValue" id="raiseValue">2000</div>
                        <input class="raiseScroll" id="slider" type="range" min="2000" max="100000" value="2000">
                        <div class="raiseButtonOuter" id="buttonPlus" v-on:click="incrementRaise()">
                            <div class="raiseButton centerText">+</div>
                        </div>
                    </div>
                    <button class="InputButton1 centerText" id="buttonRaise" v-on:click="makeDecision('RAISE')">RAISE</button>
                    <button class="InputButton2 centerText" id="buttonCheckFold" v-on:click="toggleCheckFoldButton()">CHECK/FOLD</button>
                    <button class="InputButton1 centerText" id="buttonAllIn" v-on:click="makeDecision('ALL IN')">ALL IN</button>
                </div>
            </div>
        </div>
        <Chat v-bind:full="chatFull"/>
        <ReportPocket v-if="!chatFull"
            v-bind:report_OffenderName="report_OffenderName" 
            v-bind:report_OffenderMessageId="report_OffenderMessageId"
        />
    </div>
</template>

<style scoped>
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
        /*position: absolute;*/
        width: 80vw;
        height: 45vw;
    }
    .tableLayoutAndDisplay{
        position: relative;
        float: left;
        width: 70%;
        height: 93%;
        background: purple;
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
        width: 100%;
        height: 100%;
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
    .tableImage img{
        width: 100%;
        height: 100%;
    }
    .tableItems{
        position: absolute;
        width: 50%;
        height: 15%;
        background: transparent;
        margin: 17.75% 0% 0% 25%;
    }
    .potCount{
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
        margin: 0% 0% 0% 0%;
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
    .tableCard img{
        width: 100%;
        height: 100%;
    }
    .tableDeck{
        position: absolute;
        width: 11.5%;
        height: 100%;
        background: transparent;
        margin: 0% 0% 0% 88.5%;
        border-radius: 15%;
    }
    .tableDeck img{
        width: 100%;
        height: 100%;
    }
    .players{
        position: absolute;
        width: 60%;
        height: 110%;
        margin: -2% 0% 0% 20%;
    }
    #playerSeat1{
        margin: 0% 0% 0% 0%;
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
        margin: 0% 0% 0% 0%;
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
    .cheatSheet img{
        width: 100%;
        height: 100%;
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
    .playerCard img{
        width: 100%;
        height: 100%;
    }
    .playerInputs{
        float: left;
        width: 32%;
        height: 79%;
        background: transparent;
        margin: 2% 0% 0% 2%;
    }
    .InputButton1{
        float: left;
        width: 30%;
        height: 25%;
        background: white;
        border: 1px solid black;
        border-radius: 15%/30%;
        font-size: 1vw;
    }
    .InputButton2{
        float: left;
        width: 60%;
        height: 25%;
        background: white;
        border: 1px solid black;
        border-radius: 8%/30%;
        font-size: 1vw;
    }
    #buttonFold{
        margin: 0% 0% 0% 0%;
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
        margin: 0% 0% 0% 0%;
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
        margin: 0% 0% 0% 0%;
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
</style>

<script>

import PlayerSeat from './pokerComponents/PlayerSeat.vue';
import NavBar from './pokerComponents/NavBar.vue';
import Chat from './pokerComponents/Chat.vue';
import ReportPocket from './pokerComponents/ReportPocket.vue';


import io from "socket.io-client";

export default {
    name: "Poker",
    components: {
        PlayerSeat,
        NavBar,
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
            seatID: '',

            checkFold: false,

            report_OffenderName: '',
            report_OffenderMessageId: '',
            // the image resource files for the card images
            cardFiles: [
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

            // information to set up each player seat including css values (depending on seat position some css will change)
            // most of this will come from the server
            myCards: [{src:null}, {src:null}],
            players: [
                {occupied: false, classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat1', id: 1, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat2', id: 2, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat3', id: 3, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat4', id: 4, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat5', id: 5, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
                {occupied: false, classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat6', id: 6, dealerStatus: false, cards: {card1: {src: null}, card2: {src: null}}, bet: 0, tagName: "", tagImage: require(`../images/player_icon_1.png`), chipTotal: "", action: "WAITING", youTag: false, timer: false},
            ],
            communityCards: [{src:null},{src:null},{src:null},{src:null},{src:null}],
        };
    },
    mounted(){
        // define all of the socket.on methods here
        this.socket.on('tableState', msgJSON => {
            let msg = JSON.parse(msgJSON);
            let seatStates = msg.seatStates;
            let receivedCommunityCards = msg.communityCards;
            console.log(JSON.stringify(seatStates) + ' ' + JSON.stringify(receivedCommunityCards));
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

            if(this.seatID !== '' && this.players[this.seatID].timer === true && this.checkFold){
                // the player wants to check, if can't then fold
                this.makeDecision('CHECK/FOLD');
            }
        });
        
        this.socket.on('yourSeatID', msg => {
            this.seatID = msg;
            this.players[this.seatID].youTag = true;
        });
        
        this.socket.on('beginTheGame', msgJSON => {
            let msg = JSON.parse(msgJSON);
            this.myCards[0].src = this.cardFiles.find(file => file.name === msg[0]).src;
            this.myCards[1].src = this.cardFiles.find(file => file.name === msg[1]).src;
        });
        
        this.socket.on('showdownCardRevealState', msgJSON => {
            let msg = JSON.parse(msgJSON);
            for(let i = 0; i < 6; i++){
                this.players[i].cards = {
                    card1: {src: this.cardFiles.find(file => file.name === msg[i][0]).src}, 
                    card2: {src: this.cardFiles.find(file => file.name === msg[i][1]).src}
                };
            }
            this.showPlayerCards(); // move this to a separate socket call, it only needs to execute once
        });

        this.socket.on('winner', msg => {
            console.log('winner ' + msg);
        });

        this.socket.on('reset', msg => {
            console.log(msg);
            // each player will reset the ui for a new game
            this.players[0].cards = {card1: {src: this.cardFiles[0].src}, card2: {src: this.cardFiles[0].src}};
            this.players[1].cards = {card1: {src: this.cardFiles[0].src}, card2: {src: this.cardFiles[0].src}};
            this.players[2].cards = {card1: {src: this.cardFiles[0].src}, card2: {src: this.cardFiles[0].src}};
            this.players[3].cards = {card1: {src: this.cardFiles[0].src}, card2: {src: this.cardFiles[0].src}};
            this.players[4].cards = {card1: {src: this.cardFiles[0].src}, card2: {src: this.cardFiles[0].src}};
            this.players[5].cards = {card1: {src: this.cardFiles[0].src}, card2: {src: this.cardFiles[0].src}};

            this.communityCards = [
                {src: this.cardFiles[1].src}, 
                {src: this.cardFiles[1].src}, 
                {src: this.cardFiles[1].src}, 
                {src: this.cardFiles[1].src}, 
                {src: this.cardFiles[1].src}
            ];
            this.hidePlayerCards();
        });











        
        let slider = document.getElementById("slider");
        let output = document.getElementById("raiseValue");
        output.innerHTML = slider.value;

        slider.oninput = function() {
            output.innerHTML = this.value;
        }
        // asign the standard card_back image to each of player cards inititally
        // later the server will send the true cards at the show down
        this.myCards = [{src: this.cardFiles[1].src}, {src: this.cardFiles[1].src}];
        
        this.players[0].cards = {card1: {src: this.cardFiles[2].src}, card2: {src: this.cardFiles[2].src}};
        this.players[1].cards = {card1: {src: this.cardFiles[2].src}, card2: {src: this.cardFiles[2].src}};
        this.players[2].cards = {card1: {src: this.cardFiles[2].src}, card2: {src: this.cardFiles[2].src}};
        this.players[3].cards = {card1: {src: this.cardFiles[2].src}, card2: {src: this.cardFiles[2].src}};
        this.players[4].cards = {card1: {src: this.cardFiles[2].src}, card2: {src: this.cardFiles[2].src}};
        this.players[5].cards = {card1: {src: this.cardFiles[2].src}, card2: {src: this.cardFiles[2].src}};

        this.communityCards = [
            {src: this.cardFiles[1].src}, 
            {src: this.cardFiles[1].src}, 
            {src: this.cardFiles[1].src}, 
            {src: this.cardFiles[1].src}, 
            {src: this.cardFiles[1].src}
        ];
    },
    methods:{
        // define all of the socket.emit methods here
        logIn(userID){
            this.userID = userID;
            this.socket.emit("logIn", this.userID);
        },
        joinTable() { // for now use this function to join into the game
            this.socket.emit("joinTable", { // we send our assigned user id
                userID: this.userID,
                tableID: 0, // the table the player wants to join
            });
        },
        makeDecision(action){
            this.socket.emit("turnDecision", {
                userID: this.userID,
                seatID: this.seatID,
                action: action,
                raiseToValue: this.getRaiseToValue(), // only used if player is raising
            });
        },




        toggleCheckFoldButton(){
            this.checkFold = !this.checkFold;
            let b = document.getElementById("buttonCheckFold");
            if(this.checkFold){
                b.style.backgroundColor = '#aaaaaa';
            }
            else{
                b.style.backgroundColor = '#ffffff';
            }
        },
        exitTable(){
            //v-on:click='myfunction()' @mousedown: style= "{ opacity: 0.5 }"
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
                remove = 2000;
            }
            slider.value = (value - remove).toString();
            output.innerHTML = slider.value;
        },
        getRaiseToValue(){
            let slider = document.getElementById("slider");
            let value = parseInt(slider.value);
            return value;
        },
        revealCommunityCard(cardNumber, cardImageName){
            let communityCard = document.getElementById('communityCard' + cardNumber.toString());
            communityCard.getElementsByTagName('img')[0].src = 
                require(`../images/cards/${cardImageName}.png`);
        },
        showPlayerCards(){
            this.cardReveal = true;
        },
        hidePlayerCards(){
            this.cardReveal = false;
        },
        revealPlayerCards(){
            // when a child looks for prop change they do not inspect the elements inside those props
            // only the prop itself so we can't just change card1 and card2 we need to change player.cards
            this.players[0].cards = {card1: this.cardFiles.find(card => card.name === '3_H'), card2: this.cardFiles.find(card => card.name === '2_C')};
            this.players[1].cards = {card1: this.cardFiles.find(card => card.name === '6_H'), card2: this.cardFiles.find(card => card.name === '10_S')};
            this.players[2].cards = {card1: this.cardFiles.find(card => card.name === 'K_S'), card2: this.cardFiles.find(card => card.name === '3_D')};
            this.players[3].cards = {card1: this.cardFiles.find(card => card.name === 'Q_C'), card2: this.cardFiles.find(card => card.name === 'J_H')};
            this.players[4].cards = {card1: this.cardFiles.find(card => card.name === '8_C'), card2: this.cardFiles.find(card => card.name === '3_S')};
            this.players[5].cards = {card1: this.cardFiles.find(card => card.name === '2_D'), card2: this.cardFiles.find(card => card.name === 'A_C')};
        },
        submitReport(selected, message, report_OffenderName, report_OffenderMessageId){
            // pass this off to the server
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
        sendReport(){
            // send a report
        },

        // these next functions are for testing, they are linked up the the temporary buttons in the chat
        switchDealers(){
            this.players[0].dealerStatus = false;
            this.players[1].dealerStatus = true;
            this.players[2].dealerStatus = false;
            this.players[3].dealerStatus = false;
            this.players[4].dealerStatus = false;
            this.players[5].dealerStatus = false;
        },
        changeBets(){
            this.players[0].bet = 0;
            this.players[1].bet = 0;
            this.players[2].bet = 1000;
            this.players[3].bet = 2000;
            this.players[4].bet = 0;
            this.players[5].bet = 0;
        },
        changeNames(){
            this.players[0].tagName = "Alex123";
            this.players[1].tagName = "Jessica234";
            this.players[2].tagName = "Mack345";
            this.players[3].tagName = "Curtis456";
            this.players[4].tagName = "John567";
            this.players[5].tagName = "Clayton678";
        },
        changeTagImages(){
            this.players[0].tagImage = require(`../images/player_icon_1.png`);
            this.players[1].tagImage = require(`../images/player_icon_1.png`);
            this.players[2].tagImage = require(`../images/player_icon_1.png`);
            this.players[3].tagImage = require(`../images/player_icon_1.png`);
            this.players[4].tagImage = require(`../images/player_icon_1.png`);
            this.players[5].tagImage = require(`../images/player_icon_1.png`);
        },
        changeTimer1(){
            this.players[0].timer = true;
            this.players[1].timer = false;
            this.players[2].timer = false;
            this.players[3].timer = false;
            this.players[4].timer = false;
            this.players[5].timer = false;
        },
        changeTimer2(){
            this.players[0].timer = false;
            this.players[1].timer = true;
            this.players[2].timer = false;
            this.players[3].timer = false;
            this.players[4].timer = false;
            this.players[5].timer = false;
        },

        /*
        updatePlayerCardsTest(){
            this.cardsShownToAllPlayers = [ // sent to all players at the show down and updated with each players real cards on reveal
                this.players[0].cards = {card1: {src: this.cardFiles.find(file => file.name === msg[0][0])}, card2: {src: this.cardFiles.find(file => file.name === msg[0][1])}},
                this.players[1].cards = {card1: {src: this.cardFiles.find(file => file.name === msg[1][0])}, card2: {src: this.cardFiles.find(file => file.name === msg[1][1])}},
                this.players[2].cards = {card1: {src: this.cardFiles.find(file => file.name === msg[2][0])}, card2: {src: this.cardFiles.find(file => file.name === msg[2][1])}},
                this.players[3].cards = {card1: {src: this.cardFiles.find(file => file.name === msg[3][0])}, card2: {src: this.cardFiles.find(file => file.name === msg[3][1])}},
                this.players[4].cards = {card1: {src: this.cardFiles.find(file => file.name === msg[4][0])}, card2: {src: this.cardFiles.find(file => file.name === msg[4][1])}},
                this.players[5].cards = {card1: {src: this.cardFiles.find(file => file.name === msg[5][0])}, card2: {src: this.cardFiles.find(file => file.name === msg[5][1])}},
            ];
        }
        */
    }
};
</script>