/* global describe:true, it:true */
"use strict";
var Card = require('../src/Card.js');
var Rank = require('../src/Rank.js');
var PokerRules = require('../src/PokerRules.js');
var Utils = require('../src/Utils.js');
var qc = require("quick_check");
var assert = require('assert');

describe("The Poker Rules should", function () {

    it('only accept a 5 card hand', function () {
        qc.forAll(multiCardGen, function (hand) {
            if (!Utils.arrayContainsDuplicateItems(hand)) {
                if (hand.length == 5) {
                    var result = new PokerRules().rankHand(hand);
                    assert(Rank.validRanks.includes(result));
                } else {
                    assert.throws(function() { new PokerRules().rankHand(hand) }, Error, "Incorrect number of cards " + hand.length);
                }
            }
        })
    });

    it('not accept duplicate cards', function () {
        qc.forAll(cardGen, cardGen, cardGen, cardGen, function (card1, card2, card3, card4) {
            assert.throws(function() {  new PokerRules().rankHand([card1, card1, card2, card3, card4]) },
                Error, "Hand contains duplicate cards");
        })
    });

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

    //Generators
    var cardValueGen = qc.pick(PokerRules.values);
    var suitGen =  qc.pick(PokerRules.suits);

    var cardGen = qc.constructor(Card,cardValueGen,suitGen);
    var topCardValueInAStraightGen = qc.except(cardValueGen,2,3,4,5);
    var handLengthGen = qc.oneOf(qc.pick(0, 5), qc.int);
    var multiCardGen = qc.arrayOf(cardGen,handLengthGen);
    var twoDistinctCardValuesGen = createGenForNDistinctCardValues(2);


    function createGenForNDistinctCardValues(n) {
        return qc.array.subsetOf(PokerRules.values, {length: n})
    }
});
