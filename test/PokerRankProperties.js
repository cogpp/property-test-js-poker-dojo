/* global describe:true, it:true */
"use strict";
var Card = require('../src/Card.js');
var Rank = require('../src/Rank.js');
var PokerRules = require('../src/PokerRules.js');
var Utils = require('../src/Utils.js');
var qc = require("quick_check");
var assert = require('assert');

describe("The Poker Rules should", function () {
    it('rank a straight flush', function() {
        qc.forAll(topCardValueInAStraightGen, suitGen, function(topValue, suit) {
            var hand = [];
            for (var i = 0; i < 5; i++) {
                hand.push(new Card(topValue-i, suit))
            }
            var result = new PokerRules().rankHand(hand);
            assert(result === Rank.STRAIGHT_FLUSH);
        })
    });

    it('rank four of a kind', function() {
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

    it('rank a full house', function() {
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

    it('rank a flush', function() {
        qc.forAll(fiveDistinctCardValuesGen, suitGen, function(cardValues, suit) {
            if (!Utils.valuesInArrayAreConsecutive(cardValues)) {
                var hand = [];
                cardValues.forEach( function(cardValue){ hand.push(new Card(cardValue, suit)) });
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.FLUSH);
            }
        })
    });


    it('rank a straight', function() {
        qc.forAll(topCardValueInAStraightGen, fiveSuitsGen, function(topValue, suits) {
            if (!Utils.allItemsInArrayAreTheSame(suits)) {
                var hand = [];
                var i = 0;
                suits.forEach( function(suit) { hand.push(new Card(topValue - i++, suit)) });
                var result = new PokerRules().rankHand(hand);
                assert(result === Rank.STRAIGHT);
            }
        })
    });

    it('rank three of a kind', function() {
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

    it('rank two pair', function() {
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

    it('rank a pair', function() {
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

    it('rank high card', function() {
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

    it('rank any hand of cards', function() {
        qc.forAll(fiveCardGen, function(hand) {
            if (Utils.arrayContainsDuplicateItems(hand)) {
                var result = new PokerRules().rankHand(hand);
                assert(Rank.validRanks.includes(result));
            }
        })
    });

    it('only accept a 5 card hand', function () {
        qc.forAll(multiCardGen, function (hand) {
            if (hand.length == 5) {
                var result = new PokerRules().rankHand(hand);
                assert(Rank.validRanks.includes(result));
            } else {
                assert.throws(function() {  new PokerRules().rankHand(hand) }, Error, "Incorrect number of cards "+hand.length);
            }
        })
    });

    //Generators
    var cardValues = PokerRules.values;
    var cardValueGen = qc.pick(cardValues);
    var topCardValueInAStraightGen = qc.pick([6, 7, 8, 9, 10, 11, 12, 13, 14]);
    var suitGen =  qc.pick(PokerRules.suits);
    var threeDistinctSuitsGen = createGenForNDistinctSuits(3);
    var twoDistinctSuitsGen = createGenForNDistinctSuits(2);
    var twoDistinctCardValuesGen = createGenForNDistinctCards(2);
    var threeDistinctCardValuesGen = createGenForNDistinctCards(3);
    var fourDistinctCardValuesGen = createGenForNDistinctCards(4);
    var fiveDistinctCardValuesGen = createGenForNDistinctCards(5);
    var twoSuitsGen = qc.arrayOf(suitGen, {length: 2});
    var threeSuitsGen = qc.arrayOf(suitGen, {length: 3});
    var fiveSuitsGen = qc.arrayOf(suitGen, {length: 5});
    var cardGen = qc.constructor(Card, cardValueGen, suitGen);
    var fiveCardGen = qc.arrayOf(cardGen, {length: 5});

    var handLengthGen = qc.oneOf(qc.pick(0, 5), qc.int);
    var multiCardGen = qc.arrayOf(cardGen, {length: handLengthGen});


    function createGenForNDistinctSuits(n) {
        return qc.array.subsetOf(PokerRules.suits, {length: n});
    }

    function createGenForNDistinctCards(n) {
        return qc.array.subsetOf(cardValues, {length: n});
    }
});
