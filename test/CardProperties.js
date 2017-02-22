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
                assert.throws(function() { new Card(cardValue, char) }, Error, "Invalid suit");
            }
        })
    });

    var cardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    var cardValueGen = qc.pick(cardValues);
    var charGen = qc.char
});