var os   = require('os');
var path = require('path');

var Downloader = require('../lib/Downloader');

var downloader = new Downloader();

var fileSavePath = path.join(os.tmpdir(), 'mtFileDlTest1.zip');

console.log('File will be resumed from '+ fileSavePath);

var dl = downloader.resumeDownload(fileSavePath);

require('./_handleEvents')(dl);
require('./_printStats')(dl);

dl.start();