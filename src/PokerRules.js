var Rank = require('../src/Rank.js');

function PokerRules() {}

PokerRules.prototype.rankHand = function(hand) {
   var sortedValues = hand.map( function(card){ return card.value }).sort(sortNumber).reverse();
   var isStraight = this.isConsecutive(sortedValues);
   var isFlush = new Set(hand.map( function(card){ return card.suit })).size == 1;
   var frequencyMapOfValues = this.groupByFrequencyOfCardValues(sortedValues);
   var frequencies = Object.values(frequencyMapOfValues)
   if (isStraight && isFlush) {
      return Rank.STRAIGHT_FLUSH;
   } else if (frequencies.includes(4)) {
      return Rank.FOUR_OF_A_KIND;
   } else if (frequencies.includes(3) && frequencies.includes(2)) {
       return Rank.FULL_HOUSE;
   }
   return -1;
};


PokerRules.prototype.groupByFrequencyOfCardValues = function (cardValues) {
    var valueTally = {};
    cardValues.forEach( function (value) { if (value in valueTally) valueTally[value] ++; else valueTally[value] = 1; } );
    return Object.values(valueTally);
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

PokerRules.suits = ['D','H','C','S'];

module.exports = PokerRules;
