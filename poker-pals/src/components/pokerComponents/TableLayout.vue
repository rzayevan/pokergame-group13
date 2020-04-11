<template>
    <div class="container-fluid tableLayout"> <!--the container holding the entire table view-->
        <div class="row no-gutters exit">
            <div class="col-1">
                <img v-on:click='$parent.exitTable()' class="p-2"
                     src="https://img.icons8.com/ios-filled/100/000000/door-opened.png"
                     alt="leave table"
                />
            </div>
        </div>
        <div class="row no-gutters players">
            <div class="col-10 ">

            </div>
        </div>
        <div class="row no-gutters table">
            <div class="col-1 potContainer m-2 p-2 align-items-end">
                <p>
                    POT <br>
                    {{ potTotal }}
                </p>
            </div>
            <div class="col-10 cards d-inline-flex justify-content-sm-around">
                <div class="tableCard col-2" id="communityCard1" style="background-color: red">
                    <img v-bind:src="communityCards[0].src"/>
                </div>
                <div class="tableCard col-2" id="communityCard2" style="background-color: orange">
                    <img v-bind:src="communityCards[1].src"/>
                </div>
                <div class="tableCard col-2" id="communityCard3" style="background-color: yellow">
                    <img v-bind:src="communityCards[2].src"/>
                </div>
                <div class="tableCard col-2" id="communityCard4" style="background-color: green">
                    <img v-bind:src="communityCards[3].src"/>
                </div>
                <div class="tableCard col-2" id="communityCard5" style="background-color: blue">
                    <img v-bind:src="communityCards[4].src"/>
                </div>
                <div class="tableDeck"> <!--image showing the deck of cards, for visuals only-->
                    <img :src="require('../../images/ImageFiles').getImage('card_back').src" style="background-color: indigo"/>
                </div>
            </div>
        </div>
        <div class="row no-gutters players">
            <div class="col-10 offset-1">

            </div>
        </div>
        <div class="row no-gutters info">
            <div class="col-10 offset-1">

            </div>
        </div>

        <!--                <div class="tableDeck"> &lt;!&ndash;image showing the deck of cards, for visuals only&ndash;&gt;-->
        <!--                    <img :src="require('../../images/ImageFiles').getImage('card_back').src"/>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--            <div class="players"> &lt;!&ndash;the container holding the six players at the table, each player receives a collection of props to be displayed&ndash;&gt;-->
        <!--                <PlayerSeat v-for="player in players" :key="player.id" v-bind:id='player.divID'-->
        <!--                    v-bind:occupied="player.occupied"-->
        <!--                    v-bind:classes="player.classes"-->
        <!--                    v-bind:dealerStatus="player.dealerStatus" -->
        <!--                    v-bind:cards="player.cards" -->
        <!--                    v-bind:cardReveal="cardReveal"-->
        <!--                    v-bind:betValue="player.bet"-->
        <!--                    v-bind:accountName="player.accountName"-->
        <!--                    v-bind:accountImage="player.accountImage"-->
        <!--                    v-bind:chipTotal="player.chipTotal"-->
        <!--                    v-bind:action="player.action"-->
        <!--                    v-bind:youTag="player.youTag"-->
        <!--                    v-bind:timer="player.timer"-->
        <!--                />-->
        <!--            </div>-->
        <!--        </div>-->
        <!--        <div class="blindsBox">Blinds: {{ bigBlind/2 }}/{{ bigBlind }}</div> &lt;!&ndash;shows the blinds of this particular table, TODO later bind it to a variable&ndash;&gt;-->
    </div>
</template>

<style scoped>
    .tableLayout {
        width: 100%;
        height: 100%;
        background-color: #348c44;
    }
    .exit {
        max-height: 15%;
        background-color: wheat;
    }

    .exit div {
        height: 100%;
    }

    .exit div img {
        float: left;
        cursor: pointer;
        max-height: 100%;
    }

    .players {
        height: 20%;
        background-color: palevioletred;
    }

    .table {
        height: 30%;
        background-color: #2f252c;
        margin: 0;
        align-items: center;
    }

    .potContainer {
        background-color: #f2f3f5;
        max-height: 100%;
        font-size: 2vmin;
    }

    .cards {
        height: 100%;
        background-color: lawngreen;
    }

    .tableCard {
        height: 100%;
        background-color: orange;
    }

    .tableCard img {
        /*max-height: 100%;*/
        /*max-width: 100%;*/
    }

    .info {
        height: 15%;
        background-color: wheat;
    }

    img {
        max-width: 100%;
        max-height: 100%;

    }
    .buttonExitTable{
        /*position: absolute;*/
        /*width: 4%;*/
        /*height: 10%;*/
        /*margin: 1% 0% 0% 1%;*/
        /*background-color: transparent;*/
        /*border: none;*/
        /*cursor: pointer;*/
    }
    .buttonExitTable:active {
        /*transform: translateY(4%);*/
    }
    .buttonExitTable img{
        /*float: left;*/
    }
    .tableObjects{
        /*position: absolute;*/
        /*width: 100%;*/
        /*height: 79%;*/
        /*margin: 5.3% 0% 0% 0%;*/
    }
    .tableImage{
        /*position: absolute;*/
        /*width: 78%;*/
        /*height: 75%;*/
        /*margin: 5.75% 0% 0% 11.5%;*/
        /*background: transparent;*/
    }
    .tableItems{
        /*position: absolute;*/
        /*width: 50%;*/
        /*height: 15%;*/
        /*background: transparent;*/
        /*margin: 17.75% 0% 0% 25%;*/
    }
    .potContainer{
        /*position: absolute;*/
        /*width: 25%;*/
        /*height: 100%;*/
        /*border-radius: 15%/30%;*/
        /*background: #bf214b;*/
        /*border: 1px solid black;*/
        /*margin: -0.25% 0% 0% -0.125%;*/
    }
    .potTag{
        /*color: white;*/
        /*font-size: 80%;*/
        /*margin: 0%;*/
        /*font-size: 1.25vw;*/
    }
    .potAmount{
        /*color: white;*/
        /*font-size: 1vw;*/
    }
    .tableCards{
        /*position: absolute;*/
        /*width: 61%;*/
        /*height: 100%;*/
        /*background: transparent;*/
        /*margin: 0% 0% 0% 25.5%;*/
    }
    .tableCard{
        /*float: left;*/
        /*width: 17.5%;*/
        /*height: 100%;*/
        /*margin: 0% 0% 0% 2%;*/
        /*border-radius: 15%;*/
    }
    .tableDeck{
        /*position: absolute;*/
        /*width: 11.5%;*/
        /*height: 100%;*/
        /*background: transparent;*/
        /*margin: 0% 0% 0% 88.5%;*/
        /*border-radius: 15%;*/
    }
    .players{
        /*position: absolute;*/
        /*width: 60%;*/
        /*height: 110%;*/
        /*margin: -2% 0% 0% 20%;*/
    }
    #playerSeat1{
        /*margin: 0%;*/
    }
    #playerSeat2{
        /*margin: 0% 0% 0% 12.5%;*/
    }
    #playerSeat3{
        /*margin: 0% 0% 0% 12.5%;*/
    }
    #playerSeat4{
        /*position: absolute;*/
        /*margin: 54% 0% 0% 75%;*/
    }
    #playerSeat5{
        /*position: absolute;*/
        /*margin: 54% 0% 0% 37.5%;*/
    }
    #playerSeat6{
        /*position: absolute;*/
        /*margin: 54% 0% 0% 0%;*/
    }
    .blindsBox{
        /*position: absolute;*/
        /*width: 20%;*/
        /*height: 6%;*/
        /*background: transparent;*/
        /*margin: 49.2% 0% 0% 80%;*/
        /*font-size: 1vw;*/
        /*text-align: center;*/
        /*font-weight: 1000;*/
    }
    /*img{*/
    /*    !*width: 100%;*!*/
    /*    !*height: 100%;*!*/
    /*}*/
</style>
<script>
// import PlayerSeat from './PlayerSeat.vue';

export default {
    name: "TableLayout",
    components: {
        // PlayerSeat,
    },
    props: [
        'potTotal', 'communityCards', 'players', 'cardReveal', 'bigBlind', 'timerReset',
    ],
};
</script>