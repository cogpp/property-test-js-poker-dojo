function Utils() {}

Utils.isConsecutive = function (cardValues) {
    var orderedValues = cardValues.sort(sortNumber).reverse()
    for (var i = 0; i < orderedValues.length-1; i++) {
        if (orderedValues[i] - orderedValues[i+1] != 1) {
            return false;
        }
    }
    return true;
};

function sortNumber(a,b) {
    return a - b;
}

module.exports = Utils;