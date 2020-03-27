<template>
    <div class="playerSeat"> <!--a player seat for the table UI, it changes very often depending on the table state-->
        <div v-if="occupied" class="border1" :style="{background: timer ? 'black' : 'transparent'}">
            <div class="box">
                <div class="action">
                    <div class="actionText">{{ action }}</div>
                </div>
                <Clock v-bind:timer="timer"/> <!--the clock timer-->
                <div class="identification">
                    <div class="accountImage">
                        <img v-bind:src="accountImage"/>
                    </div>
                    <div class="accountName">{{ accountName }}</div>
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
            <div class="betImage" :style="{visibility: betValue === 0 ? 'hidden' : 'visible'}">
                <img src="../../images/chip.png"/>
            </div>
            <div class="betValue">
                <div class="betValueText" :style="{visibility: betValue === 0 ? 'hidden' : 'visible'}">{{ betValue }}</div>
            </div>
            <div class="dealerIcon" :style="{visibility: dealerStatus ? 'visible' : 'hidden'}">
                <img src="../../images/dealer_icon.png" />
            </div>
        </div>
        <div v-if="occupied" v-bind:class= classes.youTag :style="{visibility: youTag ? 'visible' : 'hidden'}">
            <div class="youTagText">YOU</div>
        </div>
        <div v-if="occupied" v-bind:class= classes.playerCards :style="{visibility: cardReveal ? 'visible' : 'hidden'}">
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
        margin: 0%;
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
        margin: 0%;
        font-size: 1vw;
    }
    .identification{
        position: absolute;
        width: 100%;
        height: 33%;
        background: transparent;
        margin: 22% 0% 0% 0%;
    }
    .accountImage{
        position: absolute;
        width: 20%;
        height: 90%;
        background: transparent;
        margin: 1% 0% 0% 3%;
    }
    .accountImage img{
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0% 0% 0% -50%;
    }
    .accountName{
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
        'occupied', 'classes', 'dealerStatus', '_id', 'cards', 'cardReveal', 'betValue', 'accountName',
        'accountImage', 'chipTotal', 'action', 'youTag', 'timer', 'active'
    ],
}
</script>