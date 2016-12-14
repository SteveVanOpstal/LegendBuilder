// core-js
import 'core-js';
import 'core-js/es6';

// shims_for_ie
import '../../config/shims_for_IE.js';

// zone.js
import 'zone.js/dist/zone';

if (ENV !== 'production') {
  Error.stackTraceLimit = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}
