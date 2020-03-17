<template>
    <div>
        <div class="box">
            <input class="rank" type="text" id="player1r" size="1">
            <input class="rank" type="text" id="player2r" size="1">
            <input class="rank" type="text" id="player3r" size="1">
            <input class="rank" type="text" id="player4r" size="1">
            <input class="rank" type="text" id="player5r" size="1">
            <input class="rank" type="text" id="player6r" size="1">
        </div>
        <div class="box">
            <input type="text" id="player1" size="10">
            <input type="text" id="player2" size="10">
            <input type="text" id="player3" size="10">
            <input type="text" id="player4" size="10">
            <input type="text" id="player5" size="10">
            <input type="text" id="player6" size="10">
        </div>
        <div class="box">
            <button v-on:click="calculate()">get number</button>
            <p id="result">0</p>
        </div>
    </div>
</template>

<style scoped>

    .box{
        width: 923px;
        margin: auto;
    }
    .rank{
        margin: 0px 0px 0px 53px;
    }

</style>

<script>

export default {
    name: "ChipDistributionCalculator",
    mounted(){

    },
    methods:{
        calculate(){
            
            let players = [
                {id: 1, rank: 0x500000, moneyPot: 10, returnPot: 0},
                {id: 2, rank: 0x900000, moneyPot: 3, returnPot: 0},
                {id: 3, rank: 0x600000, moneyPot: 3, returnPot: 0},
                {id: 4, rank: 0x900000, moneyPot: 2, returnPot: 0},
                {id: 5, rank: 0x700000, moneyPot: 1, returnPot: 0},
                {id: 6, rank: 0x800000, moneyPot: 4, returnPot: 0}
            ];
            
            let slots = [];
            slots.push([]);
            slots.push([]);
            slots.push([]);
            slots.push([]);
            slots.push([]);
            slots.push([]);
            
            players.sort(function(a, b){return b.rank - a.rank});
            let rankTag = -1;
            for(let i = 0; i < players.length; i++){
                if(players[i].rank === rankTag){
                    // this player matches the previous player in rank
                    rankTag = players[i].rank;
                    players[i].rank = players[i-1].rank;
                }
                else{
                    if(i !== 0){
                        rankTag = players[i].rank;
                        players[i].rank = players[i-1].rank + 1;
                    }
                    else{
                        rankTag = players[i].rank;
                        players[i].rank = 1;
                    }
                }
            }
            for(let i = 0; i < players.length; i++){
                slots[players[i].rank - 1].push({
                    id: players[i].id,
                    rank: players[i].rank,
                    moneyPot: players[i].moneyPot,
                    returnPot: 0
                });
            }
            console.log(JSON.stringify(slots));



            // the chip distribution is determined by a set of rules
            // the first rule is the pot is represented by six individual chip slots (one for each seat)
            // the players are sorted into winning ranks, and the first group of winners each show their wagers,

            // the lowest wager starts first by removing that wager value from all other players (include those who didn't get first)
            for(let i = 0; i < slots.length; i++){
                let winners = slots[i]; // this is now an array of all players at a particular rank
                winners.sort(function(a, b){return a.moneyPot - b.moneyPot});
                console.log('winners for: ' + i + ' ' + JSON.stringify(winners));
                for(let j = 0; j < winners.length; j++){
                    let potToRemove = winners[j].moneyPot;
                    console.log('winner: ' + j + ' money: ' + winners[j].moneyPot + ' ' + potToRemove);
                    let removeTotal = 0;
                    removeTotal = this.removeUpToValue(slots, potToRemove);
                    console.log('removeTotal: ' + removeTotal);
                    // all players have had their individual pots reducted
                    // divide the pot up amongst the winners left
                    let portion = removeTotal/(winners.length - j);
                    for(let k = j; k < winners.length; k++){
                        winners[k].returnPot += portion; // portion is added
                    }
                }

            }
            console.log("the results: " + JSON.stringify(slots));
            // remove the lowest wager from the player pots




            // then each slot is reduced upto the wager and then it is distributed evenly amounst the winners, then the second highest
            // wager will show and the process is repeated
            // after all winners have taken their chips the second place players repeat the process with the winnners excluded
            // this is repeated all the way down to the losing player (who is still in play), think if the losing player went all in with
            // 100$ and the other five players went all in with 10$, the lowest wager amongst the winners is 10$ so that is removed from
            // each slot thus 90$ 0$ 0$ 0$ 0$ 0$, and then split amonst the five winners 60/5 = 12$ each, then the next place is the loser
            // who wagered now 90$ and he takes upto 90$ from each slot (which are now all empty)
           
        },
        removeUpToValue(slots, value){
            let totalMoneyRemoved = 0;
            //let player;
            for(let i = 0; i < slots.length; i++){
                for(let j = 0; j < slots[i].length; j++){
                    let player = slots[i][j];
                    if(player.moneyPot >= value){
                        let moneyRemoved = value;
                        player.moneyPot -= moneyRemoved;
                        totalMoneyRemoved += moneyRemoved;
                    }
                    else{
                        let moneyRemoved = player.moneyPot;
                        player.moneyPot = 0;
                        totalMoneyRemoved += moneyRemoved;
                    }
                }
            }
            return totalMoneyRemoved;
        }
    }
};
</script>