<template>
    <div v-if="occupied" class="container-fluid seat">
        <b-row class="actionText" no-gutters>
            <b-col cols="2">
                <Clock v-bind:timer="timer"  v-bind:timerReset="timerReset" />
            </b-col>
            <b-col cols="8">
                <p>{{action}}</p>
            </b-col>
            <div class="col-2" :style="{visibility: youTag ? 'visible' : 'hidden'}"> YOU </div>
        </b-row>
        <b-row class="userInfo text-left" no-gutters>
            <div class="ml-1 col-1">
                <img class="img-fluid" v-bind:src="accountImage.src"/>
            </div>
            <div class="pl-2 col-10 align-middle">{{ accountName }}</div>
        </b-row>
        <b-row class="chipCount text-left align-middle" no-gutters>
            <div class="ml-1 col-1">
                <img class="img-fluid" :src="require('../../images/ImageFiles').getImage('chip').src" alt="poker pal chip"/>
            </div>
            <div class="pl-2 col-10 align-middle chipCountValue">{{ chipTotal }}</div>
        </b-row>
        <b-row class="betBox" no-gutters v-show="!cardReveal">
            <b-col cols="1" class="p-1" :style="{visibility: dealerStatus ? 'visible' : 'hidden'}">
                <img class="img-fluid" :src="require('../../images/ImageFiles').getImage('dealer_icon').src"/>
            </b-col>
            <b-col cols="1"  :style="{visibility: betValue == 0 ? 'hidden' : 'visible'}">
                <img class="img-fluid bet" :src="require('../../images/ImageFiles').getImage('chip').src"/>
            </b-col>
            <b-col cols="5" class="text-left align-self-center pl-2" :style="{visibility: betValue == 0 ? 'hidden' : 'visible'}">
                {{betValue}}
            </b-col>

        </b-row>
        <b-row no-gutters v-show="cardReveal" class="player-cards">
            <div class="playerCard col-2">
                <img class="img-fluid" v-bind:src="cards.card1.src"/>
            </div>
            <div class="playerCard col-2">
                <img class="img-fluid" v-bind:src="cards.card2.src"/>
            </div>
        </b-row>
    </div>
    <div v-else class="container-fluid seat">
        <b-row no-gutters class="empty">
            <b-col cols="8" offset="2" class="align-self-center">
                Seat Open
            </b-col>
        </b-row>
    </div>
</template>

<style scoped>
    .seat {
        width: 90%;
        max-height: 100%;
        color: white;
        font-size: min(12px, 5vmin);
        vertical-align: middle;
    }

    .actionText, .userInfo, .chipCount, .betBox {
        height: 20%;
        background-color: #2f252c;
    }

    .betBox {
        background-color: transparent;
    }

    .empty {
        background-color: #2f252c;
        height: 60%;
        opacity: 75%;
        text-align: center;
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
            'occupied', 'classes', 'dealerStatus', 'cards', 'cardReveal', 'betValue', 'accountName',
            'accountImage', 'chipTotal', 'action', 'youTag', 'timer', 'timerReset'
        ],
    }
</script>