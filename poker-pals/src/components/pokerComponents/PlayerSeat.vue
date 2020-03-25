<template>
    <div class="playerSeat"> <!--a player seat for the table UI, it changes very often depending on the table state-->
        <div v-if="occupied" class="border1" :style="{ background: playerTurnBackground }">
            <div class="box">
                <div class="action">
                    <div class="actionText">{{ action }}</div>
                </div>
                <Clock v-bind:timer="timer"/> <!--the clock timer-->
                <div class="identification">
                    <div class="idImage">
                        <img v-bind:src="tagImage"/>
                    </div>
                    <div class="idName">{{ tagName }}</div>
                </div>
                <div class="chipCount">
                    <div class="chipImage">
                        <img src="../../images/chip.png"/>
                    </div>
                    <div class="chipCountValue">{{ chipTotal }}</div>
                </div>
            </div>
        </div>
        <div v-if="occupied" v-bind:class= classes.betBox>
            <div class="betImage" :style="{ opacity: betValueStatus.opacity }">
                <img src="../../images/chip.png"/>
            </div>
            <div class="betValue">
                <div class="betValueText" :style="{ opacity: betValueStatus.opacity }">{{ betValueStatus.betValue }}</div>
            </div>
            <div class="dealerIcon" :style="{ opacity: dealerChipOpacity }">
                <img src="../../images/dealer_icon.png" />
            </div>
        </div>
        <div v-if="occupied" v-bind:class= classes.youTag :style="{ opacity: youTagOpacity }">
            <div class="youTagText">YOU</div>
        </div>
        <div v-if="occupied" v-bind:class= classes.playerCards :style="{ opacity: cardRevealOpacity }">
            <div class="playerCard">
                <img v-bind:src="cards.card1.src"/>
            </div>
            <div class="playerCard">
                <img v-bind:src="cards.card2.src"/>
            </div>
        </div>
        <div v-if="!occupied" class="seatOpen"> <!--when a seat is not occupied this will show, just an empty white box-->
            <div class="seatOpenBox">
                <div class="seatOpenText">Seat Open</div>
            </div>
        </div>
    </div>
</template>

<style scoped>

    .seatOpen{
        position: relative;
        width: 90%;
        height: 40%;
        background: black;
        border-radius: 15%;
        margin: 25% 0% 0% 10%;
    }
    .seatOpenBox{
        position: relative;
        width: 95%;
        height: 90%;
        background: white;
        border-radius: 15%;
        margin: 0% 0% 0% 2.5%;
        top: 5%;
    }
    .seatOpenText{
        position: absolute;
        width: 100%;
        font-size: 1vw;
        margin: 10% 0% 0% 0%;
    }


    .playerSeat{
        float: left;
        position: relative;
        width: 25%;
        height: 31.82%;
    }
    .border1{
        position: relative;
        width: 90%;
        height: 60%;
        background: black;
        border-radius: 15%;
        margin: 15% 0% 0% 10%;
    }
    .box{
        position: relative;
        width: 90%;
        height: 90%;
        background: white;
        border-radius: 15%;
        margin: 0% 0% 0% 5%;
        top: 5%;
    }
    .youTagA{
        position: absolute;
        width: 50%;
        height: 24%;
        background: #01B0D9;
        margin: -77% 0% 0% 29%;
        border-radius: 15%/30%;
        border: 1px solid black;
        color: white;
        font-size: 1.25vw;
    }
    .youTagB{
        position: absolute;
        width: 50%;
        height: 24%;
        background: #01B0D9;
        margin: -5% 0% 0% 29%;
        border-radius: 15%/30%;
        border: 1px solid black;
        color: white;
        font-size: 1.25vw;
    }

    .youTagText{
        width: 100%;
        height: 70%;
        margin: 0% 0% 0% 0%;
    }
    .action{
        position: absolute;
        width: 100%;
        height: 34%;
        background: #bf214b;
        border-top-left-radius: 15% 30%;
        border-top-right-radius: 15% 30%;
        font-size: 70%;
        color: white;
    }
    .actionText{
        margin: 0% 0% 0% 0%;
        font-size: 1vw;
    }
    .identification{
        position: absolute;
        width: 100%;
        height: 33%;
        background: transparent;
        margin: 22% 0% 0% 0%;
    }
    .idImage{
        position: absolute;
        width: 20%;
        height: 90%;
        background: transparent;
        margin: 1% 0% 0% 3%;
    }
    .idImage img{
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0% 0% 0% -50%;
    }
    .idName{
        position: absolute;
        width: 77%;
        height: 50%;
        font-size: 50%;
        background: transparent;
        margin: 0% 0% 0% 23%;
        font-weight: 700;
        text-align: left;
        font-size: 1vw;
    }
    .chipCount{
        position: absolute;
        width: 100%;
        height: 33%;
        background: transparent;
        margin: 43% 0% 0% 0%;
        border-bottom-left-radius: 15% 30%;
        border-bottom-right-radius: 15% 30%;
    }
    .chipImage{
        position: absolute;
        width: 20%;
        height: 90%;
        background: transparent;
        border-bottom-left-radius: 30% 30%;
        margin: 0% 0% 0% 3%;
    }
    .chipImage img{
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0% 0% 0% -50%;
    }
    .chipCountValue{
        position: absolute;
        width: 77%;
        height: 50%;
        font-size: 50%;
        background: transparent;
        margin: 0% 0% 0% 23%;
        font-weight: 700;
        text-align: left;
        font-size: 1vw;
    }

    .betBoxA{
        position: absolute;
        width: 80%;
        height: 18%;
        margin: 0% 0% 0% 14%;
    }
    .betBoxB{
        position: absolute;
        width: 80%;
        height: 18%;
        margin: -75% 0% 0% 14%;
    }

    .betImage{
        float: left;
        width: 20%;
        height: 90%;
        margin: 2% 0% 0% 2%;
    }
    .betImage img{
        position: absolute;
        width: 20%;
        height: 90%;
        margin: 0% 0% 0% -10%;
    }
    .betValue{
        float: left;
        width: 49%;
        height: 70%;
        margin: 3% 0% 0% 5%;
        font-size: 1.5vw;
    }
    .betValueText{
        text-align: left;
        color: white;
        font-size: 60%;
    }
    .dealerIcon{
        float: left;
        width: 20%;
        height: 90%;
        margin: 2% 0% 0% 4%;
    }
    .dealerIcon img{
        position: absolute;
        width: 20%;
        height: 90%;
        margin: 0% 0% 0% -10%;
    }

    .playerCardsA{
        position: absolute;
        width: 80%;
        height: 45%;
        margin: -2% 0% 0% 15%;
    }
    .playerCardsB{
        position: absolute;
        width: 80%;
        height: 45%;
        margin: -98% 0% 0% 15%;
    }

    .playerCard{
        float: left;
        width: 45%;
        height: 100%;
        margin: 0% 0% 0% 3%;
    }
    .playerCard img{
        width: 100%;
        height: 100%;
    }
</style>

<script>
import Clock from './Clock.vue';

export default {
    name: "PlayerSeat",
    components: {
        Clock,
    },
    props: [
        'occupied', 'classes', 'dealerStatus', '_id', 'cards', 'cardReveal', 'betValue', 'tagName',
        'tagImage', 'chipTotal', 'action', 'youTag', 'timer', 'active'
    ],
    data() {
        return { // various items to set based on the props
            dealerChipOpacity: this.dealerStatus ? 1.0 : 0.0, // show who is the current dealer
            cardRevealOpacity: this.cardReveal ? 1.0 : 0.0, // upon the show down the player cards are revealed
            betValueStatus: {opacity: this.betValue === 0 ? 0.0 : 1.0, betValue: this.betValue}, // display bet when made
            youTagOpacity: this.youTag ? 1.0 : 0.0, // tag indicating which seat belows to you
            playerTurnBackground: this.timer ? 'black' : 'transparent', // on player turn the black outline will be present
        };
    },
    mounted(){
        
    },
    watch: { // watch for these values to change
        dealerStatus: function(){
            this.dealerChipOpacity = this.dealerStatus ? 1.0 : 0.0;
        },
        cardReveal: function(){
            this.cardRevealOpacity = this.cardReveal ? 1.0 : 0.0;
        },
        betValue: function(){
            this.betValueStatus = {opacity: this.betValue === 0 ? 0.0 : 1.0, betValue: this.betValue};
        },
        youTag: function(){
            this.youTagOpacity = this.youTag ? 1.0 : 0.0;
        },
        timer: function(){
            this.playerTurnBackground = this.timer ? 'black' : 'transparent';
        },
    },
    methods:{

    }
}
</script>