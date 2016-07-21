var Jasmine = require('jasmine');
var jasmine = new Jasmine();

require('./jasmine-matchers.js');

jasmine.loadConfig({spec_dir: 'dist/spec/server', spec_files: ['main.spec.js']});

jasmine.execute();
