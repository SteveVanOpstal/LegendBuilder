'use strict';

var path = '[a-z0-9_][\\.a-z0-9_]*';

export function tim(template, data) {
  var pattern = new RegExp(exports.start + '\\s*(' + path + ')\\s*' + exports.end, 'gi');

  // Merge data into the template string
  return template.replace(pattern, function(tag, token) {
    var path = token.split('.'),
      len = path.length,
      lookup = data,
      i = 0;

    for (; i < len; i++) {
      lookup = lookup[path[i]];

      // Property not found
      if (lookup === undefined) {
        console.error('tim: ' + path[i] + ' not found in ' + tag);
        return false;
      }

      // Return the required value
      if (i === len - 1) {
        return lookup;
      }
    }
  });
};
