var Rank = require('../src/Rank.js');

function PokerRules() {}

PokerRules.prototype.rankHand = function(hand) {
   return Rank.HIGH_CARD;
};

module.exports = PokerRules;