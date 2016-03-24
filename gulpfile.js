var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2));
var runSequence = require('run-sequence');
var fs = require('fs');

var conventionalChangelog = require('gulp-conventional-changelog');
var conventionalGithubReleaser = require('conventional-github-releaser');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var git = require('gulp-git');

/* release */

gulp.task('changelog', function() {
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
    token: fs.readFileSync('./.git.token', 'utf8')
  }, {
      preset: 'angular'
    }, done);
});

gulp.task('reddit-release', shell.task(['python src/reddit/release.py']));

gulp.task('bump-version', function() {
  return gulp.src(['./package.json'])
    .pipe(bump({
      type: argv.major ? "major" : argv.minor ? "minor" : argv.patch ? "patch" : "prerelease",
      preid: 'alpha'
    }).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function() {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('chore(release): Bumped version number'));
});

gulp.task('push-changes', function(cb) {
  git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function(cb) {
  var version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  git.tag(version, 'Created Tag for version: ' + version, function(error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', { args: '--tags' }, cb);
  });
});

gulp.task('release', function(callback) {
  runSequence(
    'bump-version',
    'changelog',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    'github-release',
    'reddit-release',
    function(error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});
