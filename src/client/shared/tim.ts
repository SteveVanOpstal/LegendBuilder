'use strict';

export function tim(template: string, data: Object) {
  const pattern = new RegExp('{ ?{\\s*([a-z0-9_][\\.a-z0-9_]*)\\s*} ?}', 'gi');
  return template.replace(pattern, (_tag, token) => {
    const path = token.split('.');
    const len = path.length;

    for (let i = 0; i < len; i++) {
      const lookup = data[path[i]];

      if (lookup === undefined) {
        return '[[error]]';
      }

      if (i === len - 1) {
        return lookup;
      }
    }
  });
}
