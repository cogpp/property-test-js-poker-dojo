function PokerRules() {
    var HIGH_CARD = 'high card';
}

PokerRules.prototype.rankHand = function(hand) {
   return this.HIGH_CARD;
};

module.exports = PokerRules;