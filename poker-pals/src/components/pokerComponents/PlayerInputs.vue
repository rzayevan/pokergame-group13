<template>
    <b-container fluid class="player-inputs">
        <b-row no-gutters class="my-1">
            <b-button :disabled="!turnOptions.allIn" class="col mr-1" variant="dark" v-on:click="$parent.makeDecision('ALL IN', 0)">ALL IN</b-button>
            <b-form-checkbox id="checkFoldButton" class="offset-2 col-6" switch v-model="checkFold" @change="toggleCheckFoldButton()">
                <span class="d-none d-sm-block">CHECK/FOLD</span>
                <span class="d-block d-sm-none">C/F</span>
            </b-form-checkbox>
        </b-row>
        <b-row no-gutters class="my-1">
            <input id="raiseValue" class="col-8" type="number" :value="raise" :min="bigBlind" :step="bigBlind" :max="chipTotal + bet"/>
            <b-button :disabled="!turnOptions.raise" class="col" variant="dark" v-on:click="makeDecision()">RAISE</b-button>
        </b-row>
        <b-row no-gutters class="my-1">
            <b-button :disabled="!turnOptions.fold" class="col mr-1" variant="dark" v-on:click="$parent.makeDecision('FOLD', 0)">FOLD</b-button>
            <b-button :disabled="!turnOptions.check" class="col mx-1" variant="dark" v-on:click="$parent.makeDecision('CHECK', 0)">CHECK</b-button>
            <b-button :disabled="!turnOptions.call" class="col ml-1" variant="dark" v-on:click="$parent.makeDecision('CALL', 0)">CALL</b-button>
        </b-row>
    </b-container>
</template>

<style scoped>
    .player-inputs .btn  {
        font-size: min(12px, 5vmin);
    }
</style>

<script>
    export default {
        name: "PlayerInputs",
        components: {
        },
        props: [
            'bigBlind', 'chipTotal', 'bet', 'turnOptions', 'flipCheckFold',
        ],
        data() {
            return {
                checkFold: false,
                raise: this.props.bigBlind()
            }
        },
        watch: {
            flipCheckFold: function () {
                this.checkFold = false;
                this.$parent.toggleCheckFoldButton(this.checkFold);
                document.getElementById("checkFoldButton").toggled = false;
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
            makeDecision(){
                //TODO: error check for a number
                let value = parseInt(document.getElementById("raiseValue").value);
                this.$parent.makeDecision('RAISE', value);
            }
        }
    };
</script>