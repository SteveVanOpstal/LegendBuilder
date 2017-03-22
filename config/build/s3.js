let s3 = require('s3');
let glob = require('glob');
let helpers = require('../helpers');

function error(done, message) {
  return (err) => {
    console.error('S3: ' + message + ', \'', err.stack + '\'');
    done(true);
  }
}

function progress(actor, message) {
  return () => {
    if (actor.progressTotal > 0) {
      console.log(
          'S3: ' + message + '.. ' + actor.progressAmount + '/' + actor.progressTotal + ' (' +
          (actor.progressAmount / actor.progressTotal) * 100 + '%)');
    }
  }
}

function end(done, message) {
  return () => {
    console.log('S3: ' + message);
    done(false);
  }
}

function deleteFiles(client, remoteDir, done) {
  deleter = client.deleteDir({Bucket: process.env.ARTIFACTS_BUCKET, Prefix: remoteDir});

  deleter.on('error', error(done, 'unable to delete'));
  deleter.on('progress', progress(deleter, 'deleting'));
  deleter.on('end', end(done, 'files deleted'));
}

function uploadFile(client, file, remoteFile, done) {
  uploader = client.uploadFile({
    localFile: file,
    deleteRemoved: true,
    s3Params: helpers.merge({Bucket: process.env.ARTIFACTS_BUCKET, Key: remoteFile})
  });

  uploader.on('error', error(done, 'unable to sync (' + file + ')'));
  uploader.on('progress', progress(uploader, 'uploading (' + file + ')'));
  uploader.on('end', end(done, 'artifact upload succesfull'));
}

function uploadFiles(client, dir, remoteDir, done) {
  let files = glob.sync(dir + '**/*', {nodir: true});
  for (let file of files) {
    remoteFile = remoteDir + file.substring(file.indexOf(dir) + dir.length);
    uploadFile(client, file, remoteFile, done);
  }
}

function cleanDirectory(dir) {
  dir = dir.replace(/^(\.)/, '');
  dir = dir.replace(/^(\/)/, '');
  if (dir.substring(dir.length - 1) !== '/') {
    dir += '/';
  }
  return dir;
}

let client = s3.createClient({
  s3Options: {
    accessKeyId: process.env.ARTIFACTS_KEY,
    secretAccessKey: process.env.ARTIFACTS_SECRET,
    region: 'eu-west-1'
  }
});

module.exports = {
  upload: (dir, remoteDir, done) => {
    if (typeof done !== 'function') {
      done = (err) => {};
    }

    if (!dir) {
      console.error('directory argument required `node s3.js ./dir/');
      return;
    } else {
      dir = cleanDirectory(dir);
      console.log('uploading files from: ' + dir);
    }

    if (!remoteDir) {
      remoteDir = '';
      console.log('uploading files to: root');
    } else {
      remoteDir = cleanDirectory(remoteDir);
      console.log('uploading files to: ' + remoteDir);
    }

    uploadFiles(client, dir, remoteDir, done);
  },
  delete: (remoteDir, done) => {
    if (typeof done !== 'function') {
      done = (err) => {};
    }

    if (!remoteDir) {
      remoteDir = '';
      console.log('deleting files in: root');
    } else {
      console.log('deleting files in: ' + remoteDir);
    }

    deleteFiles(client, remoteDir, done);
  }
};

if (require.main === module) {
  if (process.argv[2] === '--upload') {
    module.exports.upload(process.argv[3], process.argv[4]);
  } else if (process.argv[2] === '--delete') {
    module.exports.delete(process.argv[3]);
  } else {
    console.error('unknown mode');
  }
}
