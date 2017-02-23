var Card = require('../src/Card.js');
var PokerRules = require('../src/PokerRules.js');
var qc = require("quick_check");
var assert = require('assert');

describe("Card should", function () {
    it('only accept valid suits', function () {
        qc.forAll(cardValueGen, charGen, function (cardValue, char) {
            if (PokerRules.suits.includes(char)) {
                var card = new Card(cardValue, char);
                assert(card.getSuit() === char);
            } else {
                assert.throws(function() { new Card(cardValue, char) }, Error, "Invalid suit "+char);
            }
        })
    });

    it('only accept valid values', function () {
        qc.forAll(valueGen, suitGen, function (value, suit) {
            if (PokerRules.values.includes(value)) {
                var card = new Card(value, suit);
                assert(card.getValue() === value);
            } else {
                assert.throws(function() { new Card(value, suit) }, Error, "Invalid value "+value);
            }
        })
    });

    var cardValueGen = qc.pick(PokerRules.values);
    var suitGen = qc.pick(PokerRules.suits);
    var charGen = qc.oneOf(qc.char, suitGen);
    var valueGen = qc.oneOf(qc.int, cardValueGen);
});