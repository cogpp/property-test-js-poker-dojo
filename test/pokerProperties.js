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
        qc.forAll(twoDistinctCardValues, suitGenerator, function(values, suit) {
            var foakValue = values[0];
            var otherValue = values[1];
            var hand = [];
            PokerRules.suits.forEach( function(suit){ hand.push(new Card(foakValue, suit)) });
            hand.push(new Card(otherValue, suit));
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.FOUR_OF_A_KIND);
        })
    });

    it('a full house', function() {
        qc.forAll(twoDistinctCardValues, threeDistinctSuits, twoDistinctSuits, function(values, toakSuits, pairSuits) {
            var toakValue = values[0];
            var pairValue = values[1];
            var hand = [];
            toakSuits.forEach( function(suit){ hand.push(new Card(toakValue, suit)) });
            pairSuits.forEach( function(suit){ hand.push(new Card(pairValue, suit)) });
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.FULL_HOUSE);
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
            if (!Utils.allItemsInArrayAreTheSame(suits)) {
                var hand = [];
                for (var i = 0; i < 5; i++) {
                    hand.push(new Card(topValue-i, suits[i]))
                }
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.STRAIGHT);
            }
        })
    });

    it('three of a kind', function() {
        qc.forAll(threeDistinctCardValues, threeDistinctSuits, twoSuits, function(values, toakSuits, otherSuits) {
            var toakValue = values[0];
            var hand = [];
            toakSuits.forEach( function(suit) { hand.push(new Card(toakValue, suit)) }  );
            hand.push(new Card(values[1], otherSuits[0]));
            hand.push(new Card(values[2], otherSuits[1]));
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.THREE_OF_A_KIND);
        })
    });

    it('two pair', function() {
        qc.forAll(threeDistinctCardValues, twoDistinctSuits, twoDistinctSuits, suitGenerator, function(cardValues, firstPairSuits, secondPairSuits, otherSuit) {
            var firstPairValue = cardValues[0];
            var secondPairValue = cardValues[1];
            var hand = [];
            firstPairSuits.forEach( function(suit) { hand.push(new Card(firstPairValue, suit ))});
            secondPairSuits.forEach( function(suit) { hand.push(new Card(secondPairValue, suit ))});
            hand.push(new Card(cardValues[2], otherSuit));
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.TWO_PAIR);
        })
    });

    it('a pair', function() {
        qc.forAll(fourDistinctCardValues, twoDistinctSuits, threeSuits, function(cardValues, pairSuits, otherSuits) {
            var pairValue = cardValues[0];
            var hand = [];
            pairSuits.forEach( function(suit) { hand.push(new Card(pairValue, suit ))});
            hand.push(new Card(cardValues[1], otherSuits[0]));
            hand.push(new Card(cardValues[2], otherSuits[1]));
            hand.push(new Card(cardValues[3], otherSuits[2]));
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.PAIR);
        })
    });

    it('high card', function() {
        qc.forAll(fiveDistinctCardValues, fiveSuits, function(cardValues, suits) {
            if (!Utils.allItemsInArrayAreTheSame(suits) && !Utils.valuesInArrayAreConsecutive(cardValues)) {
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

    var cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    var cardValueGenerator = qc.int.between(1, 14);
    var topCardValueInAStraight = qc.int.between(6, 14);
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
