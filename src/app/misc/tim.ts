'use strict';

export function tim(template: string, data: Object) {
  let pattern = new RegExp('{ ?{\\s*([a-z0-9_][\\.a-z0-9_]*)\\s*} ?}', 'gi');
  return template.replace(pattern, (tag, token) => {
    let path = token.split('.');
    let len = path.length;

    for (let i = 0; i < len; i++) {
      let lookup = data[path[i]];

      if (lookup === undefined) {
        console.error('tim: unresolved ' + tag + ' in ' + template);
        return '[[error]]';
      }

      if (i === len - 1) {
        return lookup;
      }
    }
  });
};
