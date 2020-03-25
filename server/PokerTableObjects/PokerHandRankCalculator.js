let Card = require("./Card.js"); // later will remove the need for the card class

module.exports =  {
    calculate: function(communityCards, playerCards){
        console.log(JSON.stringify(communityCards) + ' ' + JSON.stringify(playerCards));
        let cards = new Array(7);
        for(let i = 0; i < 5; i++){ // convert the five community cards into objects the calcultor can use
            let split = communityCards[i].split("_");
            let number;
            if(split[0] === 'A'){
                number = 1;
            }
            else if(split[0] === 'J'){
                number = 11;
            }
            else if(split[0] === 'Q'){
                number = 12;
            }
            else if(split[0] === 'K'){
                number = 13;
            }
            else{
                number = parseInt(split[0]);
            }
            let suit = split[1];
            cards[i] = new Card(number, suit);
        }
        for(let i = 0; i < 2; i++){ // convert the two player cards into objects the calcultor can use
            let split = playerCards[i].split("_");
            let number;
            if(split[0] === 'A'){
                number = 1;
            }
            else if(split[0] === 'J'){
                number = 11;
            }
            else if(split[0] === 'Q'){
                number = 12;
            }
            else if(split[0] === 'K'){
                number = 13;
            }
            else{
                number = parseInt(split[0]);
            }
            let suit = split[1];
            cards[i+5] = new Card(number, suit);
        }
        console.log(JSON.stringify(cards));
        // we will iterate through the functions until one returns a positive value
        /*
        let allFunctions = [
            this.handStraightFlushValue,
            this.handQuadsValue,
            this.handFullHouseValue,
            this.handFlushValue,
            this.handStraightValue,
            this.handThreeOfAKindValue,
            this.handTwoPairValue,
            this.handSinglePairValue,
            this.handHighCardValue
        ];
        */
        // number refers to how many cards to include in the highcard calculation
        // condition refers to how that function is to return that result, each function
        // uses condition to its own definition
        let setUps = [{},{},{},{condition: false}, {condition: true}, {number: 2}, {number: 1}, {number: 3}, {number: 5, condition: true}];
        
        let result = -1;
        /*
        for(let i = 0; i < allFunctions.length; i++){
            result = allFunctions[i](cards, setUps[i]); // for some reason this is not working, claims functions are not defined
            if(result != -1){
                return result;
            }
        }
        */



        // NOTE: up until this point I have not found a way to combine all these functions into an array that i can iterate
        // through, the server crashes (claiming it cannot find my functions and thus I reverted the code back to the messy)
        // lines of 'if statments' below, do not remove the commented out code above as I might come back to this problem at a
        // later date and try to fix it.

        result = this.handStraightFlushValue(cards, setUps[0]);
        if(result !== -1){
            return result;
        }
        result = this.handQuadsValue(cards, setUps[1]);
        if(result !== -1){
            return result;
        }
        result = this.handFullHouseValue(cards, setUps[2]);
        if(result !== -1){
            return result;
        }
        result = this.handFlushValue(cards, setUps[3]);
        if(result !== -1){
            return result;
        }
        result = this.handStraightValue(cards, setUps[4]);
        if(result !== -1){
            return result;
        }
        result = this.handThreeOfAKindValue(cards, setUps[5]);
        if(result !== -1){
            return result;
        }
        result = this.handTwoPairValue(cards, setUps[6]);
        if(result !== -1){
            return result;
        }
        result = this.handSinglePairValue(cards, setUps[7]);
        if(result !== -1){
            return result;
        }
        result = this.handHighCardValue(cards, setUps[8]);
        if(result !== -1){
            return result;
        }
        console.log('poker hand rank calculator error');
        return result;
    },

    handStraightFlushValue: function(cards, setup){
        // first assess whether the hand qualifies as a flush, return the numbers that match the flush suit
        let numbers = this.handFlushValue(cards, {condition: true});
        if(numbers === -1){
            return -1;
        }
        let remainingCards = this.getRemainingCards(numbers); // convert the numbers back into card objects
        // now assess whether the remaining cards qualify as a straight
        let straightResult = this.handStraightValue(remainingCards, {condition: false});
        if(straightResult === -1){
            return -1;
        }
        let result = 0x900000 + straightResult; // hexidecimal formating
        return result;
    },

    handQuadsValue: function(cards, setup){
        let numbers = this.getTheNumbersArrayA14(cards); // we want all aces=14 (1 higher than king=13)
        numbers.sort(function(a, b){return a - b}); // sort the numbers in ascending order
        let twoToAceCount = this.getTwoToAceCount(numbers); // sort the numbers into matching number groups
        let cardNumber = this.findHighestGroup(twoToAceCount, 4);
        if(cardNumber === -1){
            return -1;
        }
        let quadResult = 0;
        for(let k = 4; k > 0; k--){
            quadResult += cardNumber * this.integerPow(16, k); // the hexidecimal result of the quads
        }
        this.removeSomeMatchingKeys(numbers, cardNumber, 4); // need a highcard, remove the quad set and search the remainer
        let remainingCards = this.getRemainingCards(numbers); // convert numbers into card objects
        let highCardResult = this.handHighCardValue(remainingCards, {number: 1, condition: false});
        let result = 0x800000 + quadResult + highCardResult; // combine results into final hexidecimal
        return result;
    },

    handFullHouseValue: function(cards, setup){
        // first find a three of a kind
        let threeOfAKindValueResult = this.handThreeOfAKindValue(cards, {number:0});
        if(threeOfAKindValueResult === -1){
            return -1;
        }
        let tripletResult = threeOfAKindValueResult.tripletResult;
        let remainingCards = threeOfAKindValueResult.remainingCards; // we will use remaining cards to find a pair
        let singlePairResult = this.handSinglePairValue(remainingCards, {number:0});
        if(singlePairResult === -1){
            return -1;
        }
        let result = 0x700000 + tripletResult * this.integerPow(16, 2) + singlePairResult; // combine results into hexidecimal format
        return result;
    },

    handFlushValue: function(cards, setup){
        // we sort the cards by suit
        let suits = [];
        suits.push([]); suits.push([]); suits.push([]); suits.push([]);
        for(let i = 0; i < cards.length; i++){
            let number = cards[i].number;
            if(number === 1){
                number = 14;
            }
            suits[Card.getSuitNumber(cards[i].suit) - 1].push(number);
        }
        let result = 0x600000;
        for(let i = 0; i < 4; i++){
            if(suits[i].length >= 5){ // found a flush
                suits[i].sort(function(a, b){return a - b});
                if(setup.condition){ // return the cards, else go further and result calculated result
                    return suits[i];
                }
                for(let k = 0; k < 5; k++){
                    result += suits[i][(suits[i].length - 1) - k] * this.integerPow(16, 4-k);
                }
                return result;
            }
        }
        return -1;
    },

    handStraightValue: function(cards, setup){
        // we are trying to find the largest sequence of cards and if 5+ then its a straight
        // first let the ace assume the value of 14 and then include a special condition to check for ace as 1 as well
        let result = -1;
        let numbers = this.getTheNumbersArrayA14(cards);
        numbers.sort(function(a, b){return a - b});
        numbers = this.removeDuplicates(numbers);
        // we start from the end and work our way down and include a special case for the ace also equal to 1
        let count = 1; // we will always have a straight of at least 1
        for(let i = numbers.length - 1; i >= 4; i--){
            // then we go further down, checking each card until either a straight or break is found
            for(let j = i - 1; j >= 0; j--){
                if(numbers[j] === numbers[i] - count){ // check if sequence still holds
                    count++;
                    if(count === 5){
                        result = 0x000000;
                        // we have a straight
                        if(setup.condition){ // we send back a straight status, or another function called this function and will set their own status
                            result = 0x500000;
                        }
                        for(let k = 0; k < 5; k++){
                            result += numbers[i-k] * this.integerPow(16, 4-k); // add the straight value in hexidecimal
                        }
                        return result;
                    }
                    else if(count === 4 && numbers[i] === 5 && numbers[numbers.length - 1] === 14){
                        // we have count of four going 2,3,4,5 and an ace, its a straight
                        result = 0x000001;
                        if(setup.condition){
                            result = 0x500001;
                        }
                        for(let k = 0; k < 4; k++){
                            result += numbers[i-k] * this.integerPow(16, 4-k);
                        }
                        return result;
                    }
                }
                else{
                    // the run ended, set i to position j
                    count = 1;
                    i = j;
                }
            }
        }
        return result;
    },

    handThreeOfAKindValue: function(cards, setup){
        let numbers = this.getTheNumbersArrayA14(cards); // get the numbers
        numbers.sort(function(a, b){return a - b}); // sort the numbers
        let twoToAceCount = this.getTwoToAceCount(numbers); // sort numbers into groups
        let cardNumber = this.findHighestGroup(twoToAceCount, 3); // find the highest group
        if(cardNumber === -1){
            return -1;
        }
        let tripletResult = 0;
        for(let k = 2; k >= 0; k--){
            tripletResult += cardNumber * this.integerPow(16, setup.number + k); // add the hexidecimal value
        }
        this.removeSomeMatchingKeys(numbers, cardNumber, 3);
        let remainingCards = this.getRemainingCards(numbers);
        
        if(setup.number === 0){ // another function called this and only wants the cards
            return {tripletResult: tripletResult, remainingCards: remainingCards};
        }
        // if we made it to this point then send back the full "3 of a kind" status
        let highCardsResult = this.handHighCardValue(remainingCards, {number: setup.number, condition: false});
        if(highCardsResult === -1){
            return -1; // error
        }
        let result = 0x400000 + tripletResult + highCardsResult;
        return result;
    },

    handTwoPairValue: function(cards, setup){
        let numbers = this.getTheNumbersArrayA14(cards); // get the numbers
        numbers.sort(function(a, b){return a - b}); // sort the numbers
        let twoToAceCount = this.getTwoToAceCount(numbers); // sort the numbers into groups
        let cardNumber = this.findHighestGroup(twoToAceCount, 2); // find first pair
        if(cardNumber === -1){
            return -1;
        }
        let firstPairResult = cardNumber * this.integerPow(16, setup.number + 3) + cardNumber * this.integerPow(16, setup.number + 2);
        this.removeSomeMatchingKeys(numbers, cardNumber, 2);
        let remainingCards = this.getRemainingCards(numbers);
        let secondPairResult = this.handSinglePairValue(remainingCards, setup); // find second pair of remaining cards
        if(secondPairResult === -1){
            return -1;
        }
        let result = 0x300000 + firstPairResult + (secondPairResult - 0x200000); // remove the single pair status
        return result;
    },

    handSinglePairValue: function(cards, setup){ // find the highest pair
        let numbers = this.getTheNumbersArrayA14(cards);
        numbers.sort(function(a, b){return a - b}); // now the array is sort low to high
        let twoToAceCount = this.getTwoToAceCount(numbers);
        let cardNumber = this.findHighestGroup(twoToAceCount, 2);
        if(cardNumber === -1){
            return -1;
        }
        let pairResult = cardNumber * this.integerPow(16, setup.number + 1) + cardNumber * this.integerPow(16, setup.number);
        if(setup.number === 0){
            return pairResult;
        }
        this.removeSomeMatchingKeys(numbers, cardNumber, 2);
        let remainingCards = this.getRemainingCards(numbers);
        let highCardResult = this.handHighCardValue(remainingCards, {number: setup.number, condition: false}); // if full house is calling this then highCardSendBack = 0, and 0 is returned
        let result = 0x200000 + pairResult + highCardResult;
        return result;
    },

    handHighCardValue: function(cards, setup){ // find the highcards
        if(setup.number > cards.length){
            return -1; // error
        }
        let numbers = new Array(cards.length);
        for(let i = 0; i < numbers.length; i++){
            numbers[i] = cards[i].number;
            if(numbers[i] === 1){
                numbers[i] = 14;
            }
        }
        numbers.sort(function(a, b){return a - b});
        let result = 0x0;
        if(setup.condition){
        result += 0x100000;
        }
        for (let i = 0; i < setup.number; i++) {
            result += numbers[(numbers.length - 1) - i] * this.integerPow(16, (setup.number - 1) - i);
        }
        return result;
    },

    integerPow: function(base, exponent){
        let result = base;
        for(let i = 1; i < exponent; i++){
            result = result * base;
        }
        if(exponent === 0){
            return 1;
        }
        else{
            return result;
        }
    },

    removeAllMatchingKeys: function(array, key){
        let newArray = array.filter(function(x){
            return x !== key;
        });
        return newArray;
    },

    removeSomeMatchingKeys: function(array, key, count){
        for(var i = array.length - 1; i >= 0; i--) {
            if(array[i] === key) {
                array.splice(i, 1);
                count--;
            }
            if(count <= 0){
                i = -1;
            }
        }
    },

    removeDuplicates: function(numbers){
        let uniqueArray = [];
        for(let i = 0; i < numbers.length; i++){
            if(uniqueArray.indexOf(numbers[i]) === -1){
                uniqueArray.push(numbers[i]);
            }
        }
        return uniqueArray;
    },

    getTheNumbersArrayA14: function(cards){
        let numbers = new Array(cards.length);
        for(let i = 0; i < numbers.length; i++){
            numbers[i] = cards[i].number;
            if(numbers[i] === 1){
                numbers[i] = 14;
            }
        }
        return numbers;
    },

    getTheNumbersArray: function(cards){
        let numbers = new Array(cards.length);
        for(let i = 0; i < numbers.length; i++){
            numbers[i] = cards[i].number;
        }
        return numbers;
    },

    getTwoToAceCount: function(numbers){
        let twoToAceCount = new Array(13).fill(0);
        for(let i = 0; i < numbers.length; i++){
            twoToAceCount[numbers[i] - 2]++;
        }
        return twoToAceCount;
    },

    findHighestGroup: function(twoToAceCount, count){
        let cardNumber = -1;
        for(let i = twoToAceCount.length - 1; i >= 0; i--){
            if(twoToAceCount[i] >= count){
                cardNumber = i + 2;
                i = 0;
            }
        }
        return cardNumber;
    },

    getRemainingCards: function(numbers){
        let remainingCards = new Array(numbers.length);
        for(let i = 0; i < remainingCards.length; i++){
            remainingCards[i] = new Card(numbers[i], 'S');
        }
        return remainingCards;
    },
};