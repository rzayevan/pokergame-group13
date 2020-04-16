<template>
        <b-row class="display" no-gutters>
            <b-col cols="4" class="cheatSheet col-lg-4 d-none d-lg-flex d-xl-flex">
                    <img alt="Poker hand ranking cheat sheet" class="img-fluid "
                         :style="{opacity: cheatSheetOpen ? '100%' : '0%'}"
                         :src="require('../../images/ImageFiles').getImage('cheat_sheet').src"/>
                <div class="cheatSheetToggle" v-on:click="toggleCheatSheet()" >
                    <img alt="cheat sheet toggle" class="img-fluid px-1"
                         :src="require('../../images/ImageFiles').getImage('cheat_sheet_icon').src"/>
                </div>
            </b-col>
            <b-col cols="6" class="playerCards col-lg-3 p-lg-3">
                <div class="playerCard" id="playerCard1">
                    <img class="img-fluid" v-bind:src="myCards[0].src"/>
                </div>
                <div class="playerCard" id="playerCard2">
                    <img class="img-fluid" v-bind:src="myCards[1].src"/>
                </div>
            </b-col>
            <b-col cols="6" class="actions col-lg-4">
                <PlayerInputs v-bind:bigBlind="bigBlind" v-bind:maxBet="maxBet"/>
            </b-col>
        </b-row>
</template>

<style scoped>
    .display {
        height: 100%;
        background-color: #f2f3f5;
    }

    .cheatSheet, .playerCards, .actions {
        display: flex;
        flex-direction: row;
        align-content: center;
        flex-wrap: wrap;
        height: 100%;
    }

    .playerCard {
        width: 50%;
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
            'myCards', 'bigBlind', 'maxBet'
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
            makeDecision(action, raise){
                this.$parent.makeDecision(action, raise);
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