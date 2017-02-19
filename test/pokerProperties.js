/* global describe:true, it:true */
"use strict";
var Card = require('../src/Card.js');
var Rank = require('../src/Rank.js');
var Hand = require('../src/Hand.js');
var PokerRules = require('../src/PokerRules.js');
var Utils = require('../src/Utils.js');
var qc = require("quick_check");
var assert = require('assert');

describe("The Poker Hand Ranking should be able to recognise", function () {
    it('a straight flush', function() {
        qc.forAll(topCardValueInAStraight, suitGenerator, function(topValue, suit) {
            var hand = [];
            for (var i = 0; i < 5; i++) {
                hand.push(new Card(topValue-i, suit))
            }
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.STRAIGHT_FLUSH);
        })
    });

    it('four of a kind', function() {
        qc.forAll(cardValueGenerator, cardValueGenerator, suitGenerator, function(foakValue, otherValue, suit) {
            if (foakValue != otherValue) {
                var hand = [];
                PokerRules.suits.forEach( function(suit){ hand.push(new Card(foakValue, suit)) });
                hand.push(new Card(otherValue, suit));
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.FOUR_OF_A_KIND);
            }
        })
    });

    it('a full house', function() {
        qc.forAll(cardValueGenerator, cardValueGenerator, threeDistinctSuits, twoDistinctSuits, function(toakValue, pairValue, toakSuits, pairSuits) {
            if (toakValue != pairValue) {
                var hand = [];
                toakSuits.forEach( function(suit){ hand.push(new Card(toakValue, suit)) });
                pairSuits.forEach( function(suit){ hand.push(new Card(pairValue, suit)) });
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.FULL_HOUSE);
            }
        })
    });

    it('a flush', function() {
        qc.forAll(fiveDistinctCardValues, suitGenerator, function(cardValues, suit) {
            if (!Utils.isConsecutive(cardValues)) {
                var hand = [];
                cardValues.forEach( function(cardValue){ hand.push(new Card(cardValue, suit)) });
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.FLUSH);
            }
        })
    });


    var cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    var cardValueGenerator = qc.pick(cardValues);
    var topCardValueInAStraight = qc.pick(6, 7, 8, 9, 10, 11, 12, 13, 14);//TODO range
    var suitGenerator =  qc.pick(PokerRules.suits);// //TODO qc.pick(Suit.CLUBS, Suit.HEARTS, Suit.SPADES, Suit.DIAMOND);
    var threeDistinctSuits  = qc.array.subsetOf(PokerRules.suits, {length: 3});
    var twoDistinctSuits  = qc.array.subsetOf(PokerRules.suits, {length: 2});
    var fiveDistinctCardValues  = qc.array.subsetOf(cardValues, {length: 5});
    // var twoDifferentCardValues = function() {
    //     var cardValue1 = cardValueGenerator
    //     var cardValue2 = qc.except(cardValueGenerator, cardValue1)
    //     return [cardValue1, cardValue2]
    // }

    // var cardGenerator = qc.constructor(Card, valueGenerator,  suitGenerator);
    // var fiveDistinctCardValues  = qc.array.subsetOf([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], {length: 5});
});
