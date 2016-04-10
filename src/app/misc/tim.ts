'use strict';

export function tim(template, data) {
  let pattern = new RegExp('{ ?{\\s*([a-z0-9_][\\.a-z0-9_]*)\\s*} ?}', 'gi');

  // Merge data into the template string
  return template.replace(pattern, function(tag, token) {
    let path = token.split('.');
    let len = path.length;

    for (let i = 0; i < len; i++) {
      let lookup = data[path[i]];

      // Property not found
      if (lookup === undefined) {
        console.error('tim: ' + path[i] + ' not found in ' + tag);
        return '[[error]]';
      }

      // Return the required value
      if (i === len - 1) {
        return lookup;
      }
    }
  });
};
