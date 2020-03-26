module.exports = {
    calculate: function(players){
        // a sample set of players with their bets and card rankings
        let slots = this.pushPlayersIntoSlotsByRank(players);
        // the chip distribution is determined by a set of rules
        // the first rule is the pot which is represented by six individual chip slots (one for each seat)
        // the players are sorted into winning ranks, and the first group of winners each show their wagers (group because 2+ people can tie for rank),
        // first start by removing the lowest wager value (of that group) from all other player pots (include those who didn't get first)
        // also subtract this wager value from all other player wagers
        // then the total is distributed evenly amounst the ranking winners, this whole process is repeated for each ranking player until all wagers are gone
        // after all ranking winners have taken their chips the second place players repeat the process with the previous winners excluded
        // this is repeated all the way down to the losing player (who is still in play), ex: if the losing player went all in with
        // 100$ and the other five players went all in with 10$, the lowest wager amongst the winners is 10$ so that is removed from
        // each wager slot thus 90$ 0$ 0$ 0$ 0$ 0$, and then split amonst the five winners 60/5 = 12$ each, the next highest wager is the loser
        // who wagered now 90$ and he takes upto 90$ from each slot (which are now all empty)
        // thus the loser lost only 10 which got distributed among the 5 that tied
    
        
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
    pushPlayersIntoSlotsByRank: function(players){
        // sort the players into their winning ranks, a slot can have more than one player
        let slots = [];
        for(let i = 0; i < 6; i++){
            slots.push([]);
        }
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