module.exports = class DeckOfCards {
    constructor(){
        this.cards = [ // the initial state of the deck
            'A_S', '2_S', '3_S', '4_S', '5_S', '6_S', '7_S', '8_S', '9_S', '10_S', 'J_S', 'Q_S', 'K_S', 
            'A_C', '2_C', '3_C', '4_C', '5_C', '6_C', '7_C', '8_C', '9_C', '10_C', 'J_C', 'Q_C', 'K_C', 
            'A_H', '2_H', '3_H', '4_H', '5_H', '6_H', '7_H', '8_H', '9_H', '10_H', 'J_H', 'Q_H', 'K_H', 
            'A_D', '2_D', '3_D', '4_D', '5_D', '6_D', '7_D', '8_D', '9_D', '10_D', 'J_D', 'Q_D', 'K_D', 
        ];
        this.currentDeckCard = 0; // a marker to point to the current card (by index) of the deck being handled
    }

    shuffleDeck(){ // shuffles the deck
        /* Randomize array in-place using Durstenfeld shuffle algorithm */
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
        this.currentDeckCard = 0; // after a shuffle the pointer return to 0
    }

    getCard(){ // returns the current card pointed to and increments to the next card
        let cardToReturn = this.cards[this.currentDeckCard];
        this.currentDeckCard++;
        return cardToReturn;
    }
};