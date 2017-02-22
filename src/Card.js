var PokerRules = require('../src/PokerRules.js');

function Card(value, suit) {
    if (!PokerRules.suits.includes(suit)) {
        throw new Error("Invalid suit")
    }
    this.value = value;
    this.suit = suit;
}

Card.prototype.getValue = function () {
    return this.value;
};

Card.prototype.getSuit = function () {
    return this.suit;
};

module.exports = Card;
