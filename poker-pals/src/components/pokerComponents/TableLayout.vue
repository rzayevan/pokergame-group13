<template>
    <div class="tableLayout"> <!--the container holding the entire table view-->
        <div class="buttonExitTable" v-on:click='$parent.exitTable()'> <!-- the exit table button-->
            <img :src="require('../../images/ImageFiles').getImage('exit_symbol').src"/>
        </div>
        <div class="tableObjects"> <!--a container to hold the table and players, keeps everything centered-->
            <div class="tableImage"> <!--the green capsule shaped table image-->
                <img :src="require('../../images/ImageFiles').getImage('table').src"/>
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
                    <img :src="require('../../images/ImageFiles').getImage('card_back').src"/>
                </div>
            </div>
            <div class="players"> <!--the container holding the six players at the table, each player receives a collection of props to be displayed-->
                <PlayerSeat v-for="player in players" :key="player.id" v-bind:id='player.divID'
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
                    v-bind:timerReset="timerReset"
                />
            </div>
        </div>
        <div class="blindsBox">Blinds: {{ bigBlind/2 }}/{{ bigBlind }}</div> <!--shows the blinds of this particular table, TODO later bind it to a variable-->
    </div>
</template>

<style scoped>
    .tableLayout {
        width: 100%;
        height: 100%;
        background-color: #b7b7b7;
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
        font-weight: 900;
    }
    img{
        width: 100%;
        height: 100%;
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
    ],
};
</script>