/* global describe:true, it:true */
"use strict";
var Card = require('../src/Card.js');
var Rank = require('../src/Rank.js');
var Hand = require('../src/Hand.js');
var PokerRules = require('../src/PokerRules.js');
var qc = require("quick_check");
var assert = require('assert');

describe("The Poker Hand Ranking should be able to recognise", function () {

    it('a high card', function() {
        qc.forAll(cardGenerator, function(card) {
            console.log(card);
            var hand = new Hand(card, card, card, card, card);
            var result = new PokerRules().rankHand(hand);
            console.log(result);
            assert(result === Rank.HIGH_CARD);
        })
    });

    var suitGenerator =  qc.pick('D','H','C','S');// //TODO qc.pick(Suit.CLUBS, Suit.HEARTS, Suit.SPADES, Suit.DIAMOND);
    var cardGenerator = qc.constructor(Card, qc.pick(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14),  suitGenerator);
});
