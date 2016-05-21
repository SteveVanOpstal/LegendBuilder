var jasmineMatchers = require('jasmine-matchers-loader');

jasmineMatchers.add({
  toHaveEqualContent: function(key, actual) {
    return JSON.stringify(key) === JSON.stringify(actual);
  }
});
