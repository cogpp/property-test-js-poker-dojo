# property-test-js-poker-dojo
Poker Dojo based around Property Tests in JS 

## Poker
A poker deck contains 52 cards where each card has a value and a suit. 

Value can be either 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack(11), Queen(12), King(13), Ace(14) and suit can be of Club(C), Diamond(D), Heart(H), or Spade(S).

Each poker hand contains 5 cards. The following all the examples of poker hands (from highest to lowest): 

- Straight Flush: 5 cards of the same suit with consecutive values. 

- Four of a Kind: 4 cards with the same value.

- Full House: 3 cards of the same value, with the remaining 2 cards forming a pair.

- Flush: Hand contains 5 cards of the same suit.

- Straight: Hand contains 5 cards with consecutive values.

- Three of a Kind: Three of the cards in the hand have the same value.

- Two Pairs: The hand contains 2 different pairs.
 
- Pair: 2 of the 5 cards in the hand have the same value.

- High Card: Hands which do not fit any higher category are ranked by the value of their highest card.

## Property Tests
Property tests are a way of running many inputs against your system in order to increase code coverage and test against edge cases.
In this exercise we will be using _quick_check.js_

https://github.com/gampleman/quick_check.js

https://quickcheckjs.readme.io/docs/array-generators

## Getting Started
To pull down the dependencies, run from the project root:

```npm install```  

This project is currently set up to run the tests using mocha, feel free to reimplement using your preferred JS testing framework. 

You will find that the basic implementation is there for you. Your task is to use property tests to make sure the rank algorithm is correct.
This has been started for you in PokerRankProperties.js.

To run the tests:
 
```npm test```

## Further Reading
This was based on a similar exercise using ScalaCheck 
 
https://github.com/HolyHaddock/scalacheck-example