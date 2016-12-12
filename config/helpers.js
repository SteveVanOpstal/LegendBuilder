var path = require('path');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname + '\\..'].concat(args));
}

function merge(src, target) {
  if (!target) {
    return src;
  }
  for (var prop in src) {
    target[prop] = src[prop];
  }
  return target;
}

exports.root = root;
exports.merge = merge;
