function Card(value, suit) {
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
