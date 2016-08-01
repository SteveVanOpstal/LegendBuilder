// core-js
import 'core-js';

// shims_for_ie
import '../../config/shims_for_ie.js';

// zone.js
import 'zone.js/dist/zone';

if (ENV !== 'production') {
  Error.stackTraceLimit = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}
