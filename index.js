var S3FS = require('s3fs')
var fs = require('fs')
var exec = require('child_process').exec,
  async = require('async'),
  child;

// NOTE: retry
function errorHandler(func) {
  return function(err, stdout, stderr) {
    if (err) {
      console.log(err);
      return;
    }
    func();
  }
}

function S3Storage (opts) {
  if (!opts.bucket) throw new Error('bucket is required')
  if (!opts.secretAccessKey) throw new Error('secretAccessKey is required')
  if (!opts.accessKeyId) throw new Error('accessKeyId is required')
  if (!opts.region) throw new Error('region is required')
  if (!opts.dirname) throw new Error('dirname is required')

  this.options = opts
  this.getFilename = (opts.filename || getFilename)
  this.s3fs = new S3FS(opts.bucket, opts)
}

function getFilename() {
  return new Date() + ".zip";
}

S3Storage.prototype._handleFile = function (file, cb) {
  var that = this;
  var filename = new Date();
  var filePath = that.options.dirname + '/' + filename
  var outStream = that.s3fs.createWriteStream(filePath)

  var fileStream = fs.createReadStream(file);

  fileStream.pipe(outStream)

  outStream.on('error', cb)
  outStream.on('finish', function () {
    cb(null, { size: outStream.bytesWritten, key: filePath })
  })
}

exec('mongodump -d euro_sports -o backup', errorHandler(function() {
  console.log('done dump!!!');
  exec('ls', errorHandler(function(){
    exec('zip -r backup.zip backup', errorHandler(function(){
      console.log('done zip!!!');

      var s3 = new S3Storage({
        bucket: "fox-build-your-f1",
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        accessKeyId: process.env.ACCESS_KEY_ID,
        region: "ap-southeast-1",
        dirname: "backup"
      });

      s3._handleFile('backup.zip', function(err, results) {
        if (err) {
          console.log(err);
        }
        exec('rm -rf backup && rm backup.zip', errorHandler(function(){
        }));
      });
    }))
  }))
}));

