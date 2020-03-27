module.exports = {
    calculate: function(players){
        // a sample set of players with their bets and card rankings
        let numberOfTableSeats = require("./PokerUtilities.js").numberOfTableSeats;
        let slots = this.pushPlayersIntoSlotsByRank(players, numberOfTableSeats);

        for(let i = 0; i < slots.length; i++){ // for each slot of winners distribute their chips
            let winners = slots[i]; // this is now an array of all players at a particular rank
            winners.sort(function(a, b){return a.moneyPot - b.moneyPot}); // sort by their pot wagers
            for(let j = 0; j < winners.length; j++){ // remove the lowest wager from the pots and divide it amongst the winners
                let potToRemove = winners[j].moneyPot;
                let removeTotal = 0;
                removeTotal = this.removeUpToValue(slots, potToRemove);
                // all players have had their individual pot wagers reduced
                // divide the pot up amongst the winners left
                let portion = removeTotal/(winners.length - j);
                for(let k = j; k < winners.length; k++){
                    winners[k].returnPot += portion; // portion is added to each winner
                }
            }
        }
        players.sort(function(a, b){return a.id - b.id}); // resort players by id now
    },
    pushPlayersIntoSlotsByRank: function(players, numberOfTableSeats){
        // sort the players into their winning ranks, a slot can have more than one player
        let slots = [];
        for(let i = 0; i < numberOfTableSeats; i++){
            slots.push([]);
        }
        players.sort(function(a, b){return b.rank - a.rank}); // sort by rank, high to low
        let rankTag = -1;
        for(let i = 0; i < players.length; i++){
            if(players[i].rank === rankTag){
                // this player matches the previous player in rank
                rankTag = players[i].rank;
                players[i].rank = players[i-1].rank;
            }
            else{// this player does not match the previous rank
                if(i !== 0){ // move them down one rank
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
            slots[players[i].rank - 1].push(players[i]);
        }
        return slots;
    },
    removeUpToValue: function(slots, value){
        // each player will have their pot wages reduced by the current wager, 
        // then the total is returned for redistribution
        let totalMoneyRemoved = 0;
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
};