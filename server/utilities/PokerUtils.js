/**
 * The number of seats at a table
 */
const NUM_OF_TABLE_SEATS = 6;
/**
 * The high value for an ace
 */
const ACE_HIGH = 14;
/**
 * The low value for an ace
 */
const ACE_LOW = 1;
/**
 * The needed size of a hand
 */
const NEEDED_HAND_SIZE = 5;
/**
 * for the special case the five in a straight is the top card
 */
const SPECIAL_CASE_TOP_CARD = 5;
/**
 * Aces are set to 14 so if we have 4 cards in a straight (2,3,4,5) we make a special check condition (treat 14 as 1)
 */
const ACE_STRAIGHT_MARK = 4;
/**
 * The number of suits
 */
const NUMBER_OF_SUITS = 4;
/**
 * An array of poker table stats
 */
const POKER_TABLE_STATS = [
    {name: 'Greenhorn', bigBlind: 2,      buyIn: 20}, // stolen from a poker website
    {name: 'Beginner',  bigBlind: 10,     buyIn: 100},
    {name: 'Gambler',   bigBlind: 50,     buyIn: 500},
    {name: 'Pro',       bigBlind: 200,    buyIn: 2000},
    {name: 'BigFish',   bigBlind: 1000,   buyIn: 10000},
    {name: 'Master',    bigBlind: 5000,   buyIn: 50000},
    {name: 'Champion',  bigBlind: 20000,  buyIn: 200000},
    {name: 'Guru',      bigBlind: 100000, buyIn: 1000000},
    {name: 'Ultimate',  bigBlind: 500000, buyIn: 5000000}
];
/**
 * time player has to make decision
 */
const POKER_TABLE_TIMEOUT = 10000;
/**
 * Returns the NUM_OF_TABLE_SEATS constant
 */
exports.GetNumberOfTableSeats = function() {
    return NUM_OF_TABLE_SEATS;
}

/**
 * Returns the ACE_HIGH constant
 */
exports.GetAceHighValue = function() {
    return ACE_HIGH;
}

/**
 * Returns the ACE_LOW constant
 */
exports.GetAceLowValue = function() {
    return ACE_LOW;
}

/**
 * Returns the NEEDED_HAND_SIZE constant
 */
exports.GetNeededHandSize = function() {
    return NEEDED_HAND_SIZE;
}

/**
 * Returns the SPECIAL_CASE_TOP_CARD constant
 */
exports.GetSpecialCaseTopCardValue = function() {
    return SPECIAL_CASE_TOP_CARD;
}

/**
 * Returns the ACE_STRAIGHT_MARK constant
 */
exports.GetAceStraightMark = function() {
    return ACE_STRAIGHT_MARK;
}

/**
 * Returns the NUMBER_OF_SUITS constant
 */
exports.GetNumberOfSuits = function() {
    return NUMBER_OF_SUITS;
}

/**
 * Returns the POKER_TABLE_STATS constant
 */
exports.GetPokerTableStats = function() {
    return POKER_TABLE_STATS;
}

/**
 * Returns the POKER_TABLE_TIMEOUT constant
 */
exports.GetPokerTableTimeout = function() {
    return POKER_TABLE_TIMEOUT;
}