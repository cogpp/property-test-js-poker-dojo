var Rank = require('../src/Rank.js');
var Utils = require('./Utils.js');

function PokerRules() {}

PokerRules.prototype.rankHand = function(hand) {
   if (hand.length != 5) {
       throw new Error("Incorrect number of cards "+hand.length)
   }
   var values = hand.map( function(card){ return card.value });
   var isStraight = Utils.valuesInArrayAreConsecutive(values);
   var isFlush = new Set(hand.map( function(card){ return card.suit })).size == 1;
   var frequencyMapOfValues = this.groupByFrequencyOfCardValues(values);
   var frequencies = Object.values(frequencyMapOfValues);
   if (isStraight && isFlush) {
      return Rank.STRAIGHT_FLUSH;
   } else if (frequencies.includes(4)) {
      return Rank.FOUR_OF_A_KIND;
   } else if (frequencies.includes(3) && frequencies.includes(2)) {
       return Rank.FULL_HOUSE;
   } else if (isFlush) {
       return Rank.FLUSH;
   } else if (isStraight) {
       return Rank.STRAIGHT;
   } else if (frequencies.includes(3)) {
       return Rank.THREE_OF_A_KIND;
   } else if (frequencies.includes(2) && Utils.filterArrayByItem(frequencies, 2).length == 2) {
       return Rank.TWO_PAIR;
   } else if (frequencies.includes(2) && Utils.filterArrayByItem(frequencies, 2).length == 1) {
       return Rank.PAIR;
   } else {
       return Rank.HIGHEST_CARD;
   }
};


PokerRules.prototype.groupByFrequencyOfCardValues = function (cardValues) {
    var valueTally = {};
    cardValues.forEach( function (value) { if (value in valueTally) valueTally[value] ++; else valueTally[value] = 1; } );
    return Object.values(valueTally);
};

PokerRules.suits = ['D','H','C','S'];
PokerRules.values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

module.exports = PokerRules;
