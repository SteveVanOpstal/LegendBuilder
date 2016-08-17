var s3 = require('s3');

module.exports = {
  upload: function(done) {
    var client = s3.createClient({
      s3Options: {
        accessKeyId: process.env.ARTIFACTS_KEY,
        secretAccessKey: process.env.ARTIFACTS_SECRET,
        region: 'eu-west-1'
      }
    });

    var uploader = client.uploadDir({
      localDir: 'build/dist/client/',
      deleteRemoved: true,
      s3Params: {Bucket: process.env.ARTIFACTS_BUCKET}
    });

    uploader.on('error', function(err) {
      console.error('S3: unable to sync, \'', err.stack + '\'');
      if (done) {
        done(false);
      }
    });
    uploader.on('progress', function() {
      if (uploader.progressTotal > 0) {
        console.log(
            'S3: uploading.. ' + uploader.progressAmount + '/' + uploader.progressTotal + ' (' +
            (uploader.progressAmount / uploader.progressTotal) * 100 + '%)');
      }
    });
    uploader.on('end', function() {
      console.log('S3: artifact upload succesfull');
      if (done) {
        done(true);
      }
    });
  }
};


if (require.main === module) {
  module.exports.upload();
}
