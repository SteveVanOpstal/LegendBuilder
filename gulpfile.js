var gulp = require('gulp');
var runSequence = require('run-sequence');
var conventionalChangelog = require('gulp-conventional-changelog');
var conventionalGithubReleaser = require('conventional-github-releaser');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var git = require('gulp-git');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var ts = require('gulp-typescript');
const changed = require('gulp-changed');
var flatten = require('gulp-flatten');

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
    token: '683abd0417d2a12d54b175bb781f4858a4db9f9a'
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
    .pipe(git.commit('[Prerelease] Bumped version number'));
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

const DEST = 'app/';
gulp.task('compile', function () {
  var tsProject = ts.createProject('src/tsconfig.json');
  return tsProject.src(['src/**/*.ts'])
    .pipe(flatten())
    .pipe(changed(DEST, {extension: '.js'}))
    .pipe(ts(tsProject))
    .js
    .pipe(gulp.dest(DEST));
});