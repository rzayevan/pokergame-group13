<template>
    <div class="raiseToggle"> <!--the container holding the raise input, it contains two buttons, a slider, and a value display-->
        <div class="raiseButtonOuter" id="buttonMinus" v-on:click="decrementRaise()">
            <div class="raiseButton centerText">-</div>
        </div>
        <div class="raiseValue">{{ raiseValue }}</div>
        <input class="raiseScroll" id="slider" type="range" v-bind:min="bigBlind" v-bind:max="bigBlind*20" v-bind:value="raiseValue"> <!--TODO: set these using props-->
        <div class="raiseButtonOuter" id="buttonPlus" v-on:click="incrementRaise()">
            <div class="raiseButton centerText">+</div>
        </div>
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
    name: "RaiseToggle",
    props: [
        'bigBlind',
    ],
    data() {
        return {
            raiseValue: this.bigBlind,
        }
    },
    watch: { // TODO: when page navigation is implemented this wont be needed as big blind will already be set upon the page being created
        bigBlind: function (val) {
            this.raiseValue = val;
        },
    },
    methods:{
        incrementRaise(){ // need to get the value of the slider itself, getElementById seems to be the only thing that works
            // cap this value if it goes over what the player has left
            let slider = document.getElementById("slider");
            let value = parseInt(slider.value);
            // add up to the big blind to even out the number
            slider.value = (value + (this.bigBlind - (value % this.bigBlind))).toString();
            this.raiseValue = slider.value;
            this.setRaiseToValue();
        },
        decrementRaise(){
            // cap this value if it goes over what the player has left
            let slider = document.getElementById("slider");
            let value = parseInt(slider.value);
            // subtract up to the big blind
            let remove = value % this.bigBlind;
            if(remove === 0){
                remove = this.bigBlind;
            }
            slider.value = (value - remove).toString();
            this.raiseValue = slider.value;
            this.setRaiseToValue();
        },
        setRaiseToValue(){
            let slider = document.getElementById("slider");
            let value = parseInt(slider.value);
            this.$parent.setRaiseToValue(value);
        },
    }
};
</script>