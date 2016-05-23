var Jasmine = require('jasmine');
var jasmine = new Jasmine();

require('./jasmine-matchers.js');

jasmine.loadConfig({
    spec_dir: 'dist/spec/',
    spec_files: [
        '/**/*.spec.js',
    ]
});

jasmine.execute();
