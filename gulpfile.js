var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2));
var runSequence = require('run-sequence');
var fs = require('fs');

var conventionalChangelog = require('gulp-conventional-changelog');
var conventionalGithubReleaser = require('conventional-github-releaser');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var git = require('gulp-git');
var ts = require('gulp-typescript');
var changed = require('gulp-changed');
var flatten = require('gulp-flatten');
var sourcemaps = require('gulp-sourcemaps');
var shell = require('gulp-shell');

/* release */

gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('github-release', function(done) {
  conventionalGithubReleaser({
    type: "oauth",
    token: fs.readFileSync('./git.token', 'utf8')
  }, {
    preset: 'angular'
  }, done);
});

gulp.task('bump-version', function () {
  return gulp.src(['./package.json'])
    .pipe(bump({
      type: argv.major ? "major" : argv.minor ? "minor" : "patch"
    }).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('chore(release): Bumped version number'));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function (cb) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {args: '--tags'}, cb);
  });

  function getPackageJsonVersion () {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

gulp.task('release', function (callback) {
  runSequence(
    'bump-version',
    'changelog',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    'github-release',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

/* build */

const DEST = 'app/';
gulp.task('build', function () {
  var tsProject = ts.createProject('src/tsconfig.json');
  return tsProject.src(['src/**/*.ts'])
    .pipe(sourcemaps.init()) 
    .pipe(flatten())
    .pipe(changed(DEST, {extension: '.js'}))
    .pipe(ts(tsProject))
    .js
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(DEST));
});

/* start-server */

gulp.task('start-server',
  shell.task([
    'node src/server/server.js'
  ])
);

/* start-live-server */

gulp.task('start-live-server',
  shell.task([
    'live-server --port=5858 --entry-file=index.html'
  ])
);