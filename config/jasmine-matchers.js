var jasmineMatchers = require('jasmine-matchers-loader');

jasmineMatchers.add({
  toHaveEqualContent: (key, actual) => {
    return JSON.stringify(key) === JSON.stringify(actual);
  }
});
