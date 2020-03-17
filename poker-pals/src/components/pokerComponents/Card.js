class Card {
    constructor(number, suit) {
        this.number = number;
        this.suit = suit;
    }
    
    static getSuit(number){
        if(number === 1){
            return 'S';
        }
        else if(number === 2){
            return 'C';
        }
        else if(number === 3){
            return 'H';
        }
        else{
            return 'D';
        }
    }
    
    static getSuitNumber(suit){
        if(suit === 'S'){
            return 1;
        }
        else if(suit === 'C'){
            return 2;
        }
        else if(suit === 'H'){
            return 3;
        }
        else{
            return 4;
        }
    }
}

export default Card;