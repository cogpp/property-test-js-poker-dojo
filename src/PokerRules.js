var Rank = require('../src/Rank.js');

function PokerRules() {}

PokerRules.prototype.rankHand = function(hand) {
   var sortedValues = hand.map( function(card){ return card.value }).sort(sortNumber).reverse()
   var isStraight = this.isConsecutive(sortedValues)
   var isFlush = new Set(hand.map( function(card){ return card.suit })).size == 1;
   if (isStraight && isFlush) {
      return Rank.STRAIGHT_FLUSH;
   }
   return -1;
};

PokerRules.prototype.isConsecutive = function (cardValues) {
    //TODO order by top down
    for (var i = 0; i < cardValues.length-1; i++) {
        if (cardValues[i] - cardValues[i+1] != 1) {
            return false;
        }
    }
    return true;
};

function sortNumber(a,b) {
    return a - b;
}

module.exports = PokerRules;
