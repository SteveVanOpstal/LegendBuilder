var s3 = require('s3');
var glob = require('glob');
var helpers = require('../../helpers');

function error(done, message) {
  return function(err) {
    console.error('S3: ' + message + ', \'', err.stack + '\'');
    if (typeof done === 'function') {
      done(true);
    }
  }
}

function progress(actor, message) {
  return function() {
    if (actor.progressTotal > 0) {
      console.log(
          'S3: ' + message + '.. ' + actor.progressAmount + '/' + actor.progressTotal + ' (' +
          (actor.progressAmount / actor.progressTotal) * 100 + '%)');
    }
  }
}

function end(done, message) {
  return function() {
    console.log('S3: ' + message);
    if (typeof done === 'function') {
      done(false);
    }
  }
}

function deleteFiles(client, done) {
  deleter = client.deleteDir({Bucket: process.env.ARTIFACTS_BUCKET});

  deleter.on('error', error(done, 'unable to delete'));
  deleter.on('progress', progress(deleter, 'deleting'));
  deleter.on('end', end(done, 'files deleted'));
}

function uploadFile(client, file, remoteFile, params, done) {
  uploader = client.uploadFile({
    localFile: file,
    deleteRemoved: true,
    s3Params: helpers.merge(
        {
          Bucket: process.env.ARTIFACTS_BUCKET,
          Key: remoteFile,
          CacheControl: 'public, max-age=172800'
        },
        params)
  });

  uploader.on('error', error(done, 'unable to sync (' + file + ')'));
  uploader.on('progress', progress(uploader, 'uploading (' + file + ')'));
  uploader.on('end', end(done, 'artifact upload succesfull'));
}

function uploadFiles(client) {
  let files = glob.sync('./build/dist/client/**/*', {nodir: true});
  let base = 'build/dist/client/';
  let skip = [];

  // gzipped javascript files
  for (let file of files) {
    remoteFile = file.substring(file.indexOf(base) + base.length);

    if (file.indexOf('.gz') === file.length - 3) {
      remoteFile = remoteFile.substring(0, remoteFile.length - 3);
      skip.push(remoteFile);
      uploadFile(
          client, file, remoteFile,
          {ContentEncoding: 'gzip', ContentType: 'application/javascript'});
    }
  }

  // other files
  for (let file of files) {
    remoteFile = file.substring(file.indexOf(base) + base.length);

    if (file.indexOf('.gz') === file.length - 3) {
      continue;
    }

    if (!skip.some(function(skipFile) {
          return skipFile === remoteFile;
        })) {
      uploadFile(client, file, remoteFile);
    }
  }
}

module.exports = {
  upload: function(done) {
    if (process.env.TRAVIS_PULL_REQUEST) {
      done(false);
      return;
    }

    var client = s3.createClient({
      s3Options: {
        accessKeyId: process.env.ARTIFACTS_KEY,
        secretAccessKey: process.env.ARTIFACTS_SECRET,
        region: 'eu-west-1'
      }
    });

    deleteFiles(client, function(error) {
      if (!error) {
        uploadFiles(client);
      }
    });
  }
};


if (require.main === module) {
  module.exports.upload();
}
