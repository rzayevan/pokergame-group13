<template>
    <b-container fluid class="player-inputs">
        <b-row no-gutters class="my-1">
            <b-button class="col mr-1" variant="dark" v-on:click="$parent.makeDecision('ALL IN')">ALL IN</b-button>
            <b-form-checkbox class="offset-2 col-6" switch v-model="checkFold" @change="toggleCheckFoldButton()">
                <span class="d-none d-sm-block">CHECK/FOLD</span>
                <span class="d-block d-sm-none">C/F</span>
            </b-form-checkbox>
        </b-row>
        <b-row no-gutters class="my-1">
            <!--  TODO: Limit max by the amount the user has left at this table. Handle Raise-->
            <input  class="col-8" type="number" :value="raise" :min="bigBlind"/>
            <b-button class="col" variant="dark" v-on:click="$parent.makeDecision('RAISE')">RAISE</b-button>
        </b-row>
        <b-row no-gutters class="my-1">
            <b-button class="col mr-1" variant="dark" v-on:click="$parent.makeDecision('FOLD')">FOLD</b-button>
            <b-button class="col mx-1" variant="dark" v-on:click="$parent.makeDecision('CHECK')">CHECK</b-button>
            <b-button class="col ml-1" variant="dark" v-on:click="$parent.makeDecision('CALL')">CALL</b-button>
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
            'bigBlind',
        ],
        data() {
            return {
                // TODO: bind data with props
                checkFold: false,
                raise: this.props.bigBlind()
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