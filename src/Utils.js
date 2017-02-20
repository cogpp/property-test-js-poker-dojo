function Utils() {}

Utils.valuesInArrayAreConsecutive = function (cardValues) {
    var orderedValues = cardValues.sort(sortNumber).reverse();
    for (var i = 0; i < orderedValues.length-1; i++) {
        if (orderedValues[i] - orderedValues[i+1] != 1) {
            return false;
        }
    }
    return true;
};

Utils.filterArrayByItem = function(array, item) {
    return array.filter( function(a) { return a == item })
};

Utils.allItemsInArrayAreTheSame = function(array) {
    return new Set(array).size == 1;
};

function sortNumber(a,b) {
    return a - b;
}

module.exports = Utils;