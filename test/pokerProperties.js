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
            if (!Utils.valuesInArrayAreConsecutive(cardValues)) {
                var hand = [];
                cardValues.forEach( function(cardValue){ hand.push(new Card(cardValue, suit)) });
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.FLUSH);
            }
        })
    });


    it('a straight', function() {
        qc.forAll(topCardValueInAStraight, fiveSuits, function(topValue, suits) {
            if (!allTheSameSuits(suits)) {
                var hand = [];
                for (var i = 0; i < 5; i++) {
                    hand.push(new Card(topValue-i, suits[i]))
                }
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.STRAIGHT);
            }
        })
    });

    //TODO find a better way to assign the card values
    it('three of a kind', function() {
        qc.forAll(cardValueGenerator, twoDistinctCardValues, threeDistinctSuits, twoSuits, function(toakValue, otherValues, toakSuits, otherSuits) {
            if (!otherValues.includes(toakValue)) {
                var hand = [];
                hand.push(new Card(toakValue, toakSuits[0]));
                hand.push(new Card(toakValue, toakSuits[1]));
                hand.push(new Card(toakValue, toakSuits[2]));
                hand.push(new Card(otherValues[0], otherSuits[0]));
                hand.push(new Card(otherValues[1], otherSuits[1]));
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.THREE_OF_A_KIND);
            }
        })
    });

    it('two pair', function() {
        qc.forAll(threeDistinctCardValues, twoDistinctSuits, twoDistinctSuits, suitGenerator, function(cardValues, firstPairSuits, secondPairSuits, otherSuit) {
            var hand = [];
            hand.push(new Card(cardValues[0], firstPairSuits[0]));
            hand.push(new Card(cardValues[0], firstPairSuits[1]));
            hand.push(new Card(cardValues[1], secondPairSuits[0]));
            hand.push(new Card(cardValues[1], secondPairSuits[1]));
            hand.push(new Card(cardValues[2], otherSuit));
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.TWO_PAIR);
        })
    });

    it('a pair', function() {
        qc.forAll(fourDistinctCardValues, twoDistinctSuits, threeSuits, function(cardValues, pairSuits, otherSuits) {
            var hand = [];
            hand.push(new Card(cardValues[0], pairSuits[0]));
            hand.push(new Card(cardValues[0], pairSuits[1]));
            hand.push(new Card(cardValues[1], otherSuits[0]));
            hand.push(new Card(cardValues[2], otherSuits[1]));
            hand.push(new Card(cardValues[3], otherSuits[2]));
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.PAIR);
        })
    });

    it('high card', function() {
        qc.forAll(fiveDistinctCardValues, fiveSuits, function(cardValues, suits) {
            if (!allTheSameSuits(suits) && !Utils.valuesInArrayAreConsecutive(cardValues)) {
                var hand = [];
                var suitIndex = 0;
                cardValues.forEach(function (value) {
                    hand.push(new Card(value, suits[suitIndex++]))
                });
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.HIGHEST_CARD);
            }
        })
    });


    function allTheSameSuits(suits) {
        return new Set(suits).size == 1;
    }

    var cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    var cardValueGenerator = qc.pick(cardValues);
    var topCardValueInAStraight = qc.pick(6, 7, 8, 9, 10, 11, 12, 13, 14);//TODO range
    var suitGenerator =  qc.pick(PokerRules.suits);// //TODO qc.pick(Suit.CLUBS, Suit.HEARTS, Suit.SPADES, Suit.DIAMOND);
    var threeDistinctSuits  = qc.array.subsetOf(PokerRules.suits, {length: 3});//TODO put in a method
    var twoDistinctSuits  = qc.array.subsetOf(PokerRules.suits, {length: 2});
    var twoDistinctCardValues  = qc.array.subsetOf(cardValues, {length: 2});
    var threeDistinctCardValues  = qc.array.subsetOf(cardValues, {length: 3});
    var fourDistinctCardValues  = qc.array.subsetOf(cardValues, {length: 4});
    var fiveDistinctCardValues  = qc.array.subsetOf(cardValues, {length: 5});
    var twoSuits = qc.arrayOf(suitGenerator, {length: 2});
    var threeSuits = qc.arrayOf(suitGenerator, {length: 3});
    var fiveSuits = qc.arrayOf(suitGenerator, {length: 5});
});
