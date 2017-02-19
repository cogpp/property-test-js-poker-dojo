/* global describe:true, it:true */
"use strict";
var Card = require('../src/Card.js');
var Rank = require('../src/Rank.js');
var Hand = require('../src/Hand.js');
var PokerRules = require('../src/PokerRules.js');
var qc = require("quick_check");
var assert = require('assert');

describe("The Poker Hand Ranking should be able to recognise", function () {
    it('a straight flush', function() {
        qc.forAll(topCardValueInAStraight, suitGenerator, function(topValue, suit) {
            var hand = [];
            for (var i = 0; i < 5; i++) {
                hand.push(new Card(topValue-i,suit))
            }
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.STRAIGHT_FLUSH);
        })
    });


    var topCardValueInAStraight = qc.pick(6, 7, 8, 9, 10, 11, 12, 13, 14);//TODO range
    var suitGenerator =  qc.pick('D','H','C','S');// //TODO qc.pick(Suit.CLUBS, Suit.HEARTS, Suit.SPADES, Suit.DIAMOND);
    // var cardGenerator = qc.constructor(Card, valueGenerator,  suitGenerator);
    // var fiveDistinctCardValues  = qc.array.subsetOf([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], {length: 5});
});
