// this class will most likely be removed from the final design, it was built primarly for testing the
// intial poker hand rank calculator which had its own UI
class Card {
    // Creates a Card object
    constructor(number, suit) {
        // The number of the card
        this.number = number;
        // The suit of the card
        this.suit = suit;
    }

    static getSuitNumber(suit){
        switch(suit) {
            case 'S':
                return 1;
            case 'C':
                return 2;
            case 'H':
                return 3;
            default:
                return 4;
        } 
    }
}

module.exports = Card;