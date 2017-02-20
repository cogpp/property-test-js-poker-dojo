function Rank() {}

Rank.STRAIGHT_FLUSH = 0;
Rank.FOUR_OF_A_KIND = 1;
Rank.FULL_HOUSE = 2;
Rank.FLUSH = 3;
Rank.STRAIGHT = 4;
Rank.THREE_OF_A_KIND = 5;
Rank.TWO_PAIR = 6;
Rank.PAIR = 7;
Rank.HIGHEST_CARD = 8;

Rank.validRanks = [Rank.STRAIGHT_FLUSH, Rank.FOUR_OF_A_KIND, Rank.FULL_HOUSE, Rank.FLUSH, Rank.STRAIGHT, Rank.THREE_OF_A_KIND, Rank.TWO_PAIR, Rank.PAIR, Rank.HIGHEST_CARD];

module.exports = Rank;