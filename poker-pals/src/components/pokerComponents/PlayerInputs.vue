<template>
    <div class="playerInputs"> <!--container holding all the players button options-->
        <button class="inputButton1 centerText" id="buttonFold" v-on:click="$parent.makeDecision('FOLD')">FOLD</button>
        <button class="inputButton1 centerText" id="buttonCheck" v-on:click="$parent.makeDecision('CHECK')">CHECK</button>
        <button class="inputButton1 centerText" id="buttonCall" v-on:click="$parent.makeDecision('CALL')">CALL</button>
        <div class="raiseToggle"> <!--the container holding the raise input, it contains two buttons, a slider, and a value display-->
            <div class="raiseButtonOuter" id="buttonMinus" v-on:click="decrementRaise()">
                <div class="raiseButton centerText">-</div>
            </div>
            <div class="raiseValue" id="raiseValue">2000</div>
            <input class="raiseScroll" id="slider" type="range" min="2000" max="100000" value="2000"> <!--TODO: set these using props-->
            <div class="raiseButtonOuter" id="buttonPlus" v-on:click="incrementRaise()">
                <div class="raiseButton centerText">+</div>
            </div>
        </div>
        <button class="inputButton1 centerText" id="buttonRaise" v-on:click="$parent.makeDecision('RAISE')">RAISE</button>
        <button class="inputButton2 centerText" id="buttonCheckFold" v-on:click="toggleCheckFoldButton()">CHECK/FOLD</button>
        <button class="inputButton1 centerText" id="buttonAllIn" v-on:click="$parent.makeDecision('ALL IN')">ALL IN</button>
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
        margin: 0%;
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
        margin: 0%;
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

export default {
    name: "PlayerInputs",
    props: [
        'bigBlind',
    ],
    data() {
        return {
            // TODO: bind data with props
            checkFold: false,
        }
    },
    mounted(){
        // TODO:
    },
    watch: {
        // TODO:
    },
    methods:{
        toggleCheckFoldButton(){ // toggle the check/fold button, this will allow the client to automatically send an action without user input
            this.checkFold = !this.checkFold;
            let b = document.getElementById("buttonCheckFold");
            if(this.checkFold){
                b.style.backgroundColor = '#aaaaaa'; // color theme for button selected
            }
            else{
                b.style.backgroundColor = '#ffffff'; // color theme for button not selected
            }
            this.$parent.toggleCheckFoldButton(this.checkFold);
        },
        incrementRaise(){
            // cap this value if it goes over what the player has left
            let slider = document.getElementById("slider");
            let output = document.getElementById("raiseValue");
            let value = parseInt(slider.value);
            // add up to the big blind to even out the number
            slider.value = (value + (this.bigBlind - (value % this.bigBlind))).toString();
            output.innerHTML = slider.value;
            this.sendRaiseToValue();
        },
        decrementRaise(){
            // cap this value if it goes over what the player has left
            let slider = document.getElementById("slider");
            let output = document.getElementById("raiseValue");
            let value = parseInt(slider.value);
            // subtract up to the big blind
            let remove = value % this.bigBlind;
            if(remove === 0){
                remove = this.bigBlind;
            }
            slider.value = (value - remove).toString();
            output.innerHTML = slider.value;
            this.sendRaiseToValue();
        },
        sendRaiseToValue(){
            let slider = document.getElementById("slider");
            let value = parseInt(slider.value);
            this.$parent.setRaiseToValue(value);
            return value;
        },
    }
};
</script>