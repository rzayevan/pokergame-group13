<template>
    <div class="table">
        <b-row class="players" no-gutters>
            <div class="col-1 exit">
                <img class="img-fluid"  v-on:click='$parent.exitTable()'
                     src="https://img.icons8.com/ios-filled/100/000000/door-opened.png"
                     alt="leave table"
                />
            </div>
            <div class="col-10 d-inline-flex">
                <PlayerSeat
                        v-for="player in players.slice(0, 3)"
                        :key="player.id" v-bind:id='player.divID'
                        v-bind:occupied="player.occupied"
                        v-bind:classes="player.classes"
                        v-bind:dealerStatus="player.dealerStatus"
                        v-bind:cards="player.cards"
                        v-bind:cardReveal="cardReveal"
                        v-bind:betValue="player.bet"
                        v-bind:accountName="player.accountName"
                        v-bind:accountImage="player.accountImage"
                        v-bind:chipTotal="player.chipTotal"
                        v-bind:action="player.action"
                        v-bind:youTag="player.youTag"
                        v-bind:timer="player.timer"
                />
            </div>
        </b-row>
        <b-row class="table-items" no-gutters>
            <div class="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1 col-12 mr-auto cards d-inline-flex ">
                <div class="potContainer col p-2">
                    <p>
                        POT <br>
                        {{ potTotal }}
                    </p>
                </div>
                <div class="tableCard col" id="communityCard1">
                    <img class="img-fluid" v-bind:src="communityCards[0].src"/>
                </div>
                <div class="tableCard col" id="communityCard2">
                    <img class="img-fluid"  v-bind:src="communityCards[1].src"/>
                </div>
                <div class="tableCard col" id="communityCard3" >
                    <img class="img-fluid"  v-bind:src="communityCards[2].src"/>
                </div>
                <div class="tableCard col" id="communityCard4">
                    <img class="img-fluid"  v-bind:src="communityCards[3].src"/>
                </div>
                <div class="tableCard col" id="communityCard5">
                    <img class="img-fluid"  v-bind:src="communityCards[4].src"/>
                </div>
                <div class="tableCard col" id="deck" >
                    <img class="img-fluid"  :src="require('../../images/ImageFiles').getImage('card_back').src" />
                </div>
            </div>
        </b-row>
        <b-row class="players" no-gutters>
            <div class="col-10 offset-1 d-inline-flex">
                <PlayerSeat v-for="player in players.slice(3,6)"
                            :key="player.id" v-bind:id='player.divID'
                            v-bind:occupied="player.occupied"
                            v-bind:classes="player.classes"
                            v-bind:dealerStatus="player.dealerStatus"
                            v-bind:cards="player.cards"
                            v-bind:cardReveal="cardReveal"
                            v-bind:betValue="player.bet"
                            v-bind:accountName="player.accountName"
                            v-bind:accountImage="player.accountImage"
                            v-bind:chipTotal="player.chipTotal"
                            v-bind:action="player.action"
                            v-bind:youTag="player.youTag"
                            v-bind:timer="player.timer"
                />
            </div>
        </b-row>
        <b-row class="info" no-gutters>
            <b-col cols="4" offset="7" class="align-self-center">
                Blinds: {{ bigBlind/2 }}/{{ bigBlind }}
                <!--TODO later bind it to a variable-->
            </b-col>
        </b-row>
    </div>
</template>

<style scoped>
    .table {
        height: 100%;
        width: 100%;
        background-color: #348c44;
        font-size: min(14px, 5vmin);
    }

    .exit img {
        cursor: pointer;
    }

    .potContainer {
        border: 2px solid;
        font-weight: 900;
        color: black;
        height: 50%;
        align-self: center;
    }

    .players {
        height: 32.5%;
        max-height: 30%;
    }

    .table-items {
        height: 30%;
    }

    .info {
        height: 5%;
        text-align: right;
        font-weight: bold;
        color: black;
    }

    .exit img {
        width: 50%;
    }
</style>
<script>
    import PlayerSeat from './PlayerSeat.vue';
    export default {
        name: "TableLayout",
        components: {
            PlayerSeat,
        },
        props: [
            'potTotal', 'communityCards', 'players', 'cardReveal', 'bigBlind', 'timerReset',
        ]
    };
</script>