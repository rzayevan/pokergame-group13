<template>
    <div class="outerFrame">
        <NavBar />
        <div class="tableLayoutAndDisplay">
            <div class="tableLayout">
                <div class="buttonExitTable" v-on:click='myfunction()' @mousedown= "myfunction()">
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
                    <div class="players123">
                        <PlayerSeat id="playerSeat1"
                            v-bind:classes="{betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}"
                            v-bind:dealerStatus="dealerStatuses.player1" 
                            v-bind:_id="1" 
                            v-bind:cards="playerCards.player1" 
                            v-bind:cardReveal="cardReveal"
                            v-bind:betValue="playerBets.player1"
                            v-bind:tagName="playerTagNames.player1"
                            v-bind:tagImage="playerTagImages.player1"
                            v-bind:chipTotal="playerChipTotals.player1"
                            v-bind:action="playerActions.player1"
                            v-bind:youTag="playerYouTag.player1"
                            v-bind:timer="playerTimer.player1"
                        />
                        <PlayerSeat id="playerSeat2"
                            v-bind:classes="{betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}"
                            v-bind:dealerStatus="dealerStatuses.player2" 
                            v-bind:_id="2" 
                            v-bind:cards="playerCards.player2" 
                            v-bind:cardReveal="cardReveal"
                            v-bind:betValue="playerBets.player2"
                            v-bind:tagName="playerTagNames.player2"
                            v-bind:tagImage="playerTagImages.player2"
                            v-bind:chipTotal="playerChipTotals.player2"
                            v-bind:action="playerActions.player2"
                            v-bind:youTag="playerYouTag.player2"
                            v-bind:timer="playerTimer.player2"
                        />
                        <PlayerSeat id="playerSeat3"
                            v-bind:classes="{betBox: 'betBoxA', youTag: 'youTagA', playerCards: 'playerCardsA'}"
                            v-bind:dealerStatus="dealerStatuses.player3" 
                            v-bind:_id="3" 
                            v-bind:cards="playerCards.player3" 
                            v-bind:cardReveal="cardReveal"
                            v-bind:betValue="playerBets.player3"
                            v-bind:tagName="playerTagNames.player3"
                            v-bind:tagImage="playerTagImages.player3"
                            v-bind:chipTotal="playerChipTotals.player3"
                            v-bind:action="playerActions.player3"
                            v-bind:youTag="playerYouTag.player3"
                            v-bind:timer="playerTimer.player3"
                        />
                    </div>
                    <div class="players456">
                        <PlayerSeat id="playerSeat4"
                            v-bind:classes="{betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}"
                            v-bind:dealerStatus="dealerStatuses.player4" 
                            v-bind:_id="4" 
                            v-bind:cards="playerCards.player4"
                            v-bind:cardReveal="cardReveal"
                            v-bind:betValue="playerBets.player4"
                            v-bind:tagName="playerTagNames.player4"
                            v-bind:tagImage="playerTagImages.player4"
                            v-bind:chipTotal="playerChipTotals.player4"
                            v-bind:action="playerActions.player4"
                            v-bind:youTag="playerYouTag.player4"
                            v-bind:timer="playerTimer.player4"
                        />
                        <PlayerSeat id="playerSeat5"
                            v-bind:classes="{betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}"
                            v-bind:dealerStatus="dealerStatuses.player5" 
                            v-bind:_id="5" 
                            v-bind:cards="playerCards.player5"
                            v-bind:cardReveal="cardReveal"
                            v-bind:betValue="playerBets.player5"
                            v-bind:tagName="playerTagNames.player5"
                            v-bind:tagImage="playerTagImages.player5"
                            v-bind:chipTotal="playerChipTotals.player5"
                            v-bind:action="playerActions.player5"
                            v-bind:youTag="playerYouTag.player5"
                            v-bind:timer="playerTimer.player5"
                        />
                        <PlayerSeat id="playerSeat6"
                            v-bind:classes="{betBox: 'betBoxB', youTag: 'youTagB', playerCards: 'playerCardsB'}"
                            v-bind:dealerStatus="dealerStatuses.player6" 
                            v-bind:_id="6" 
                            v-bind:cards="playerCards.player6"
                            v-bind:cardReveal="cardReveal"
                            v-bind:betValue="playerBets.player6"
                            v-bind:tagName="playerTagNames.player6"
                            v-bind:tagImage="playerTagImages.player6"
                            v-bind:chipTotal="playerChipTotals.player6"
                            v-bind:action="playerActions.player6"
                            v-bind:youTag="playerYouTag.player6"
                            v-bind:timer="playerTimer.player6"
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
                        <button class="raiseButton centerText" id="buttonMinus" v-on:click="decrementRaise()">-</button>
                        <div class="raiseValue" id="raiseValue">2000</div>
                        <input class="raiseScroll" id="slider" type="range" min="2000" max="100000" value="2000">
                        <button class="raiseButton centerText" id="buttonPlus" v-on:click="incrementRaise()">+</button>
                    </div>
                    <button class="InputButton1 centerText" id="buttonRaise">RAISE</button>
                    <button class="InputButton2 centerText" id="buttonCheckFold">CHECK/FOLD</button>
                    <button class="InputButton1 centerText" id="buttonAllIn">ALL IN</button>
                </div>
            </div>
        </div>
        <Chat v-bind:full="chatFull"/>
        <ReportPocket v-bind:full="chatFull"/>
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
    }
    .buttonExitTable img{
        width: 100%;
        height: 100%;
    }
    .tableObjects{
        position: absolute;
        width: 100%;
        height: 79%;
        margin: 5.3% 0% 0% 0%;
        background: transparent;
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
    .players123{
        position: absolute;
        width: 60%;
        height: 35%;
        margin: -2% 0% 0% 20%;
    }
    .players456{
        position: absolute;
        width: 60%;
        height: 35%;
        margin: 30% 0% 0% 20%;
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
        margin: 0% 0% 0% 75%;
    }
    #playerSeat5{
        position: absolute;
        margin: 0% 0% 0% 37.5%;
    }
    #playerSeat6{
        position: absolute;
        margin: 0% 0% 0% 0%;
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
    }
    .cheatSheetToggle img{
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
    .raiseButton{
        float: left;
        width: 20%;
        height: 100%;
        background: white;
        border: 1px solid black;
        font-weight: 700;
        font-size: 1vw;
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
            dealerStatuses: {
                player1: true,
                player2: false,
                player3: false,
                player4: false,
                player5: false,
                player6: false
            },
            playerCards: {
                player1: {card1: null, card2: null},
                player2: {card1: null, card2: null},
                player3: {card1: null, card2: null},
                player4: {card1: null, card2: null},
                player5: {card1: null, card2: null},
                player6: {card1: null, card2: null},
            },
            playerBets: {
                player1: 0,
                player2: 1000,
                player3: 2000,
                player4: 0,
                player5: 0,
                player6: 0,
            },
            playerTagNames: {
                player1: "Alex",
                player2: "Jessica",
                player3: "Mack",
                player4: "Curtis",
                player5: "John",
                player6: "Clayton",
            },
            playerTagImages: {
                // need to define some player tag icons
                //player1: require(`../../images/cards/${this.icon}.png`),
                player1: require(`../images/player_icon_1.png`),
                player2: require(`../images/player_icon_1.png`),
                player3: require(`../images/player_icon_1.png`),
                player4: require(`../images/player_icon_1.png`),
                player5: require(`../images/player_icon_1.png`),
                player6: require(`../images/player_icon_1.png`),
            },
            playerChipTotals: {
                player1: "20000",
                player2: "40000",
                player3: "60000",
                player4: "800000",
                player5: "10000",
                player6: "20",
            },
            playerActions: {
                player1: "WAITING",
                player2: "WAITING",
                player3: "THINKING",
                player4: "WAITING",
                player5: "WAITING",
                player6: "WAITING",
            },
            playerYouTag: {
                player1: false,
                player2: false,
                player3: false,
                player4: false,
                player5: false,
                player6: true,
            },
            playerTimer: {
                player1: false,
                player2: false,
                player3: true,
                player4: false,
                player5: false,
                player6: false,
            }
        };
    },
    mounted(){
        let slider = document.getElementById("slider");
        let output = document.getElementById("raiseValue");
        output.innerHTML = slider.value;

        slider.oninput = function() {
            output.innerHTML = this.value;
        }
        this.playerCards = {
                player1: {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back},
                player2: {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back},
                player3: {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back},
                player4: {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back},
                player5: {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back},
                player6: {card1: this.cardFiles._card_Back, card2: this.cardFiles._card_Back},
        }
    },
    methods:{
        myfunction(){
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
            // only the prop itself so we can't just change card1 and card2 we need to change player1
            this.playerCards.player1 = {card1: this.cardFiles._3_H, card2: this.cardFiles._2_C};
            this.playerCards.player2 = {card1: this.cardFiles._6_H, card2: this.cardFiles._10_S};
            this.playerCards.player3 = {card1: this.cardFiles._K_S, card2: this.cardFiles._3_D};
            this.playerCards.player4 = {card1: this.cardFiles._Q_C, card2: this.cardFiles._J_H};
            this.playerCards.player5 = {card1: this.cardFiles._8_C, card2: this.cardFiles._3_S};
            this.playerCards.player6 = {card1: this.cardFiles._2_D, card2: this.cardFiles._A_C};
        },


        switchDealers(){
            this.dealerStatuses = {
                player1: false,
                player2: true,
                player3: false,
                player4: false,
                player5: false,
                player6: false
            };
        },
        changeBets(){
            this.playerBets = {
                // if bet is zero then we shouldn't display anything
                player1: 0,
                player2: 0,
                player3: 1000,
                player4: 2000,
                player5: 0,
                player6: 0,
            };
        },
        changeNames(){
            this.playerTagNames = {
                player1: "Alex123",
                player2: "Jessica234",
                player3: "Mack345",
                player4: "Curtis456",
                player5: "John567",
                player6: "Clayton678",
            };
        },
        changeTagImages(){
            this.playerTagImages = {
                player1: require(`../images/player_icon_1.png`),
                player2: require(`../images/player_icon_1.png`),
                player3: require(`../images/player_icon_1.png`),
                player4: require(`../images/player_icon_1.png`),
                player5: require(`../images/player_icon_1.png`),
                player6: require(`../images/player_icon_1.png`),
            };
        },
        changeTimer1(){
            this.playerTimer = {
                player1: true,
                player2: false,
                player3: false,
                player4: false,
                player5: false,
                player6: false,
            };
        },
        changeTimer2(){
            this.playerTimer = {
                player1: false,
                player2: true,
                player3: false,
                player4: false,
                player5: false,
                player6: false,
            };
        },
        reportPlayer(){
            this.chatFull = false;
        },
        cancelReport(){
            this.chatFull = true;
        }
    }
};
</script>