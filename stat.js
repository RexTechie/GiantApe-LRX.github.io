(function() {
  function reduce(array, combine, start) {
    var current = start;
    for (var element of array) {
      current = combine(current, element);
    }
    return current;
  }

  var max = function(data) {
    return reduce(data, (cur, ele) => (cur > ele.credit ? cur : ele.credit));
  };
  window.my = { max: max };
})();
