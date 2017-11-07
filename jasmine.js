let Jasmine = require('jasmine');
let jasmine = new Jasmine();

require('./jasmine-matchers.js');

jasmine.loadConfig({spec_dir: 'build/spec/server', spec_files: ['main.spec.js']});

jasmine.execute();
