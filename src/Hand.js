function Hand(cards) {
    this.cards = cards
}

Hand.prototype.getCards = function () {
    return this.cards;
};

module.exports = Hand;
