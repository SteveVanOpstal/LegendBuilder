var addMatchers = require('add-matchers');

addMatchers({
  toHaveEqualContent: function(key, actual) {
    return JSON.stringify(key) === JSON.stringify(actual);
  }
});
