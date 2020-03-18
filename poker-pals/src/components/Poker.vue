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
                                <img src="../images/cards/empty.png"/>
                            </div>
                            <div class="tableCard" id="communityCard2">
                                <img src="../images/cards/empty.png"/>
                            </div>
                            <div class="tableCard" id="communityCard3">
                                <img src="../images/cards/empty.png"/>
                            </div>
                            <div class="tableCard" id="communityCard4">
                                <img src="../images/cards/empty.png"/>
                            </div>
                            <div class="tableCard" id="communityCard5">
                                <img src="../images/cards/empty.png"/>
                            </div>
                        </div>
                        <div class="tableDeck">
                            <img src="../images/cards/card_back.png"/>
                        </div>
                    </div>
                    <div class="players">
                        <PlayerSeat v-for="player in players" :key="player.id" v-bind:id='player.divID'
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
                        <img src="../images/cards/6_H.png"/>
                    </div>
                    <div class="playerCard" id="playerCard2">
                        <img src="../images/cards/7_H.png"/>
                    </div>
                </div>
                <div class="playerInputs">
                    <button class="InputButton1 centerText" id="buttonFold">FOLD</button>
                    <button class="InputButton1 centerText" id="buttonCheck">CHECK</button>
                    <button class="InputButton1 centerText" id="buttonCall">CALL</button>
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
                    <button class="InputButton1 centerText" id="buttonRaise">RAISE</button>
                    <button class="InputButton2 centerText" id="buttonCheckFold">CHECK/FOLD</button>
                    <button class="InputButton1 centerText" id="buttonAllIn">ALL IN</button>
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

export default {
    name: "Poker",
    components: {
        PlayerSeat,
        NavBar,
        Chat,
        ReportPocket,
    },
    data() {
        return {
            report_OffenderName: '',
            report_OffenderMessageId: '',
            cardFiles: {
                _card_Back: require(`../images/cards/card_back.png`),
                _A_S: require(`../images/cards/A_S.png`),
                _2_S: require(`../images/cards/2_S.png`),
                _3_S: require(`../images/cards/3_S.png`),
                _4_S: require(`../images/cards/4_S.png`),
                _5_S: require(`../images/cards/5_S.png`),
                _6_S: require(`../images/cards/6_S.png`),
                _7_S: require(`../images/cards/7_S.png`),
                _8_S: require(`../images/cards/8_S.png`),
                _9_S: require(`../images/cards/9_S.png`),
                _10_S: require(`../images/cards/10_S.png`),
                _J_S: require(`../images/cards/J_S.png`),
                _Q_S: require(`../images/cards/Q_S.png`),
                _K_S: require(`../images/cards/K_S.png`),
                
                _A_C: require(`../images/cards/A_C.png`),
                _2_C: require(`../images/cards/2_C.png`),
                _3_C: require(`../images/cards/3_C.png`),
                _4_C: require(`../images/cards/4_C.png`),
                _5_C: require(`../images/cards/5_C.png`),
                _6_C: require(`../images/cards/6_C.png`),
                _7_C: require(`../images/cards/7_C.png`),
                _8_C: require(`../images/cards/8_C.png`),
                _9_C: require(`../images/cards/9_C.png`),
                _10_C: require(`../images/cards/10_C.png`),
                _J_C: require(`../images/cards/J_C.png`),
                _Q_C: require(`../images/cards/Q_C.png`),
                _K_C: require(`../images/cards/K_C.png`),

                _A_H: require(`../images/cards/A_H.png`),
                _2_H: require(`../images/cards/2_H.png`),
                _3_H: require(`../images/cards/3_H.png`),
                _4_H: require(`../images/cards/4_H.png`),
                _5_H: require(`../images/cards/5_H.png`),
                _6_H: require(`../images/cards/6_H.png`),
                _7_H: require(`../images/cards/7_H.png`),
                _8_H: require(`../images/cards/8_H.png`),
                _9_H: require(`../images/cards/9_H.png`),
                _10_H: require(`../images/cards/10_H.png`),
                _J_H: require(`../images/cards/J_H.png`),
                _Q_H: require(`../images/cards/Q_H.png`),
                _K_H: require(`../images/cards/K_H.png`),

                _A_D: require(`../images/cards/A_D.png`),
                _2_D: require(`../images/cards/2_D.png`),
                _3_D: require(`../images/cards/3_D.png`),
                _4_D: require(`../images/cards/4_D.png`),
                _5_D: require(`../images/cards/5_D.png`),
                _6_D: require(`../images/cards/6_D.png`),
                _7_D: require(`../images/cards/7_D.png`),
                _8_D: require(`../images/cards/8_D.png`),
                _9_D: require(`../images/cards/9_D.png`),
                _10_D: require(`../images/cards/10_D.png`),
                _J_D: require(`../images/cards/J_D.png`),
                _Q_D: require(`../images/cards/Q_D.png`),
                _K_D: require(`../images/cards/K_D.png`),
            },
            chatFull: true,
            cheatSheetOpen: true,
            bigBlind: 2000,
            cardReveal: false,

            // information to set up each player seat including css values (depending on seat position some css will change)
            // most of this will come from the server
            players: [
                {classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat1', id: 1, dealerStatus: true, cards: {card1: null, card2: null}, bet: 0, tagName: "Alex", tagImage: require(`../images/player_icon_1.png`), chipTotal: "20000", action: "WAITING", youTag: false, timer: false},
                {classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat2', id: 2, dealerStatus: false, cards: {card1: null, card2: null}, bet: 1000, tagName: "Jessica", tagImage: require(`../images/player_icon_1.png`), chipTotal: "40000", action: "WAITING", youTag: false, timer: false},
                {classes: {betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}, divID: 'playerSeat3', id: 3, dealerStatus: false, cards: {card1: null, card2: null}, bet: 2000, tagName: "Mack", tagImage: require(`../images/player_icon_1.png`), chipTotal: "60000", action: "THINKING", youTag: false, timer: true},
                {classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat4', id: 1, dealerStatus: false, cards: {card1: null, card2: null}, bet: 0, tagName: "Curtis", tagImage: require(`../images/player_icon_1.png`), chipTotal: "80000", action: "WAITING", youTag: false, timer: false},
                {classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat5', id: 2, dealerStatus: false, cards: {card1: null, card2: null}, bet: 0, tagName: "John", tagImage: require(`../images/player_icon_1.png`), chipTotal: "10000", action: "WAITING", youTag: false, timer: false},
                {classes: {betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}, divID: 'playerSeat6', id: 3, dealerStatus: false, cards: {card1: null, card2: null}, bet: 0, tagName: "Clayton", tagImage: require(`../images/player_icon_1.png`), chipTotal: "20", action: "WAITING", youTag: true, timer: false},
            ],
            //player1: require(`../../images/cards/${this.icon}.png`),
        };
    },
    mounted(){
        let slider = document.getElementById("slider");
        let output = document.getElementById("raiseValue");
        output.innerHTML = slider.value;

        slider.oninput = function() {
            output.innerHTML = this.value;
        }
        this.players[0].cards = {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back};
        this.players[1].cards = {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back};
        this.players[2].cards = {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back};
        this.players[3].cards = {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back};
        this.players[4].cards = {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back};
        this.players[5].cards = {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back};
    },
    methods:{
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
        revealCommunityCard(cardNumber, cardImageName){
            let communityCard = document.getElementById('communityCard' + cardNumber.toString());
            communityCard.getElementsByTagName('img')[0].src = 
                require(`../images/cards/${cardImageName}.png`);
        },
        showPlayerCards(){
            this.cardReveal = true;
        },
        revealPlayerCards(){
            // when a child looks for prop change they do not inspect the elements inside those props
            // only the prop itself so we can't just change card1 and card2 we need to change player.cards
            this.players[0].cards = {card1: this.cardFiles._3_H, card2: this.cardFiles._2_C};
            this.players[1].cards = {card1: this.cardFiles._6_H, card2: this.cardFiles._10_S};
            this.players[2].cards = {card1: this.cardFiles._K_S, card2: this.cardFiles._3_D};
            this.players[3].cards = {card1: this.cardFiles._Q_C, card2: this.cardFiles._J_H};
            this.players[4].cards = {card1: this.cardFiles._8_C, card2: this.cardFiles._3_S};
            this.players[5].cards = {card1: this.cardFiles._2_D, card2: this.cardFiles._A_C};
        },
        reportPlayer(){
            this.chatFull = false;
        },
        submitReport(selected, message, report_OffenderName, report_OffenderMessageId){
            // pass this off to the server
            alert(JSON.stringify(selected) + " " + JSON.stringify(message) + " " + JSON.stringify(report_OffenderName) + " " + JSON.stringify(report_OffenderMessageId));
            this.chatFull = true;
        },
        cancelReport(){
            this.chatFull = true;
        },
        openReport(name, messageId){
            // called by child
            this.chatFull = false;
            this.report_OffenderName = name;
            this.report_OffenderMessageId = messageId;
        },
        sendReport(){
            // send a report
        },

        // these next functions are for testing they are linked up the the temporary buttons in the chat
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
        }
    }
};
</script>