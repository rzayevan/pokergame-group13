<template>
    <div class="display">
            <div class="cheatSheetToggle" v-on:click="toggleCheatSheet()"> <!--a toggle to show or hide the cheat sheet-->
            <img :src="require('../../images/ImageFiles').getImage('cheat_sheet_icon').src"/>
        </div>
        <div class="cheatSheet" :style="{visibility: cheatSheetOpen ? 'visible' : 'hidden'}">
            <img :src="require('../../images/ImageFiles').getImage('cheat_sheet').src"/>
        </div>
        <div class="playerCards"> <!--container holding the players personal cards-->
            <div class="playerCard" id="playerCard1">
                <img v-bind:src="myCards[0].src"/>
            </div>
            <div class="playerCard" id="playerCard2">
                <img v-bind:src="myCards[1].src"/>
            </div>
        </div>
        <PlayerInputs v-bind:bigBlind="bigBlind"/>
    </div>
</template>

<style scoped>
    .display{
        width: 100%;
        height: 100%;
        background: #F2F3F5;
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
    
    img{
        width: 100%;
        height: 100%;
    }
</style>

<script>
import PlayerInputs from './PlayerInputs.vue';

export default {
    name: "Display",
    components: {
        PlayerInputs,
    },
    props: [
        'myCards', 'bigBlind',
    ],
    data() {
        return {
            cheatSheetOpen: true, // toggle to diplay cheat sheet or not
        }
    },
    methods:{
        toggleCheatSheet(){
            this.cheatSheetOpen = !this.cheatSheetOpen;
        },
        makeDecision(action){
            this.$parent.makeDecision(action);
        },
        toggleCheckFoldButton(checkFold){
            this.$parent.toggleCheckFoldButton(checkFold);
        },
        setRaiseToValue(value){
            this.$parent.setRaiseToValue(value);
        }
    }
};
</script>