<template>
    <div class="playerInputs"> <!--container holding all the players button options-->
        <button class="inputButton1 centerText" id="buttonFold" v-on:click="$parent.makeDecision('FOLD')">FOLD</button>
        <button class="inputButton1 centerText" id="buttonCheck" v-on:click="$parent.makeDecision('CHECK')">CHECK</button>
        <button class="inputButton1 centerText" id="buttonCall" v-on:click="$parent.makeDecision('CALL')">CALL</button>
        <RaiseToggle v-bind:bigBlind="bigBlind"/>
        <button class="inputButton1 centerText" id="buttonRaise" v-on:click="$parent.makeDecision('RAISE')">RAISE</button>
        <button class="inputButton2 centerText" id="buttonCheckFold" v-on:click="toggleCheckFoldButton()" :style="{backgroundColor: checkFold ? '#aaaaaa' : '#ffffff'}">CHECK/FOLD</button>
        <button class="inputButton1 centerText" id="buttonAllIn" v-on:click="$parent.makeDecision('ALL IN')">ALL IN</button>
    </div>
</template>

<style scoped>
    
    .playerInputs{
        float: left;
        width: 32%;
        height: 79%;
        background: transparent;
        margin: 2% 0% 0% 2%;
    }
    .inputButton1{
        float: left;
        width: 30%;
        height: 25%;
        background: white;
        border: 1px solid black;
        border-radius: 15%/30%;
        font-size: 1vw;
    }
    .inputButton2{
        float: left;
        width: 60%;
        height: 25%;
        background: white;
        border: 1px solid black;
        border-radius: 8%/30%;
        font-size: 1vw;
    }
    #buttonFold{
        margin: 0%;
    }
    #buttonCheck{
        margin: 0% 0% 0% 5%;
    }
    #buttonCall{
        margin: 0% 0% 0% 5%;
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

    img{
        width: 100%;
        height: 100%;
    }
</style>

<script>
import RaiseToggle from './RaiseToggle.vue';

export default {
    name: "PlayerInputs",
    components: {
        RaiseToggle,
    },
    props: [
        'bigBlind',
    ],
    data() {
        return {
            // TODO: bind data with props
            checkFold: false,
        }
    },
    methods:{
        toggleCheckFoldButton(){ // toggle the check/fold button, this will allow the client to automatically send an action without user input
            this.checkFold = !this.checkFold;
            this.$parent.toggleCheckFoldButton(this.checkFold);
        },
        setRaiseToValue(value){
            this.$parent.setRaiseToValue(value);
        },
    }
};
</script>