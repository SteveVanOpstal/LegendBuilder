var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter();
var collector = new istanbul.Collector();
var reporter = new istanbul.Reporter();

var glob = require('glob');

var files = glob.sync('src/server/**/*.ts');
console.log(files);

for (var index in files) {
  var file = files[index];
  var generatedCode = instrumenter.instrumentSync(file);
  console.log(generatedCode);
  collector.add(generatedCode);
}
console.log(collector);
//reporter.add('html');
reporter.addAll(['text-summary', 'json', 'html', 'lcovonly']);
reporter.write(collector, false, function () {
  console.log('All reports generated');
});
