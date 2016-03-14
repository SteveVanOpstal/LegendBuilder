var colorConsole = require('tracer').colorConsole({
  format: "{{timestamp}} {{title}}: {{message}}",
  dateformat: "HH:MM:ss.L",
  preprocess: function(data) { data.title = padRight(data.title, 5); }
});

var timeStart;
var urlLength
exports.start = function(length) {
  timeStart = process.hrtime();
  urlLength = length;
}

var totalTime = exports.totalTime = function() {
  var diff = process.hrtime(timeStart);
  var diffMs = (diff[0] * 1e9 + diff[1]) / 1000000;
  return diffMs;
}

exports.logHttp = function(method, path, statusCode, extra) {
  method = padRight(method, 6);
  path = padLeft(path, urlLength);
  var time = padRight(totalTime() + 'ms', 13);
  if (statusCode != 200) {
    colorConsole.error('%s %s (%d) %s [%s]', method, path, statusCode, time, extra);
  }
  else {
    colorConsole.info('%s %s (%d) %s [%s]', method, path, statusCode, time, extra);
  }
}

exports.log = colorConsole.log;
exports.trace = colorConsole.trace;
exports.debug = colorConsole.debug;
exports.info = colorConsole.info;
exports.warn = colorConsole.warn;
exports.error = colorConsole.error;

function padLeft(str, length) {
  if (str.length > length - 3) {
    length -= 3;
    return '.. ' + str.slice(-length);
  }
  else {
    return (str + ' '.repeat(length)).substring(0, length);
  }
};

function padRight(str, length) {
  return (str + ' '.repeat(length)).substring(0, length);
};