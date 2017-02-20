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
        qc.forAll(topCardValueInAStraightGen, suitGen, function(topValue, suit) {
            var hand = [];
            for (var i = 0; i < 5; i++) {
                hand.push(new Card(topValue-i, suit))
            }
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.STRAIGHT_FLUSH);
        })
    });

    it('four of a kind', function() {
        qc.forAll(twoDistinctCardValuesGen, suitGen, function(values, suit) {
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
        qc.forAll(twoDistinctCardValuesGen, threeDistinctSuitsGen, twoDistinctSuitsGen, function(values, toakSuits, pairSuits) {
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
        qc.forAll(fiveDistinctCardValuesGen, suitGen, function(cardValues, suit) {
            if (!Utils.valuesInArrayAreConsecutive(cardValues)) {
                var hand = [];
                cardValues.forEach( function(cardValue){ hand.push(new Card(cardValue, suit)) });
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.FLUSH);
            }
        })
    });


    it('a straight', function() {
        qc.forAll(topCardValueInAStraightGen, fiveSuitsGen, function(topValue, suits) {
            if (!Utils.allItemsInArrayAreTheSame(suits)) {
                var hand = [];
                var i = 0;
                suits.forEach( function(suit) { hand.push(new Card(topValue - i--, suit)) });
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.STRAIGHT);
            }
        })
    });

    it('three of a kind', function() {
        qc.forAll(threeDistinctCardValuesGen, threeDistinctSuitsGen, twoSuitsGen, function(values, toakSuits, otherSuits) {
            var toakValue = values[0];
            var hand = [];
            toakSuits.forEach( function(suit) { hand.push(new Card(toakValue, suit)) });
            hand.push(new Card(values[1], otherSuits[0]));
            hand.push(new Card(values[2], otherSuits[1]));
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.THREE_OF_A_KIND);
        })
    });

    it('two pair', function() {
        qc.forAll(threeDistinctCardValuesGen, twoDistinctSuitsGen, twoDistinctSuitsGen, suitGen, function(cardValues, firstPairSuits, secondPairSuits, otherSuit) {
            var firstPairValue = cardValues[0];
            var secondPairValue = cardValues[1];
            var hand = [];
            firstPairSuits.forEach( function(suit) { hand.push(new Card(firstPairValue, suit )) });
            secondPairSuits.forEach( function(suit) { hand.push(new Card(secondPairValue, suit )) });
            hand.push(new Card(cardValues[2], otherSuit));
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.TWO_PAIR);
        })
    });

    it('a pair', function() {
        qc.forAll(fourDistinctCardValuesGen, twoDistinctSuitsGen, threeSuitsGen, function(cardValues, pairSuits, otherSuits) {
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
        qc.forAll(fiveDistinctCardValuesGen, fiveSuitsGen, function(cardValues, suits) {
            if (!Utils.allItemsInArrayAreTheSame(suits) && !Utils.valuesInArrayAreConsecutive(cardValues)) {
                var hand = [];
                var suitIndex = 0;
                cardValues.forEach(function (value) { hand.push(new Card(value, suits[suitIndex++])) });
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.HIGHEST_CARD);
            }
        })
    });

    it('that all cards values can be ranked', function() {
        qc.forAll(handGen, function(hand) {
            if (Utils.arrayContainsDuplicateItems(hand)) {
                var result = new PokerRules().rankHand(hand);
                assert(Rank.validRanks.includes(result));
            }
        })
    });

    //Generators
    var cardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    var cardValueGen = qc.pick(cardValues);
    var topCardValueInAStraightGen = qc.pick([6, 7, 8, 9, 10, 11, 12, 13, 14]);
    var suitGen =  qc.pick(PokerRules.suits);// //TODO qc.pick(Suit.CLUBS, Suit.HEARTS, Suit.SPADES, Suit.DIAMOND);
    var threeDistinctSuitsGen  = qc.array.subsetOf(PokerRules.suits, {length: 3});//TODO put in a method
    var twoDistinctSuitsGen  = qc.array.subsetOf(PokerRules.suits, {length: 2});
    var twoDistinctCardValuesGen  = qc.array.subsetOf(cardValues, {length: 2});
    var threeDistinctCardValuesGen  = qc.array.subsetOf(cardValues, {length: 3});
    var fourDistinctCardValuesGen  = qc.array.subsetOf(cardValues, {length: 4});
    var fiveDistinctCardValuesGen  = qc.array.subsetOf(cardValues, {length: 5});
    var twoSuitsGen = qc.arrayOf(suitGen, {length: 2});
    var threeSuitsGen = qc.arrayOf(suitGen, {length: 3});
    var fiveSuitsGen = qc.arrayOf(suitGen, {length: 5});
    var cardGen = qc.constructor(Card, cardValueGen, suitGen);
    var handGen = qc.arrayOf(cardGen, {length: 5});
});
