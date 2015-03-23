var os   = require('os');
var path = require('path');

var Downloader = require('../lib/Downloader');

var downloader = new Downloader();

var fileSavePath = path.join(os.tmpdir(), 'mtFileDlTest1.zip');

console.log('File will be resumed from '+ fileSavePath);

var dl = downloader.resumeDownload(fileSavePath);

require('./_handleEvents')(dl);
require('./_printStats')(dl);

dl.on('error', function() {
	if((''+dl.error).indexOf('Invalid file path') !== -1) {
		console.log('We cannot resume the download if the tmp file does not exists.');
		console.log('Before calling this example, you should :');
		console.log('    1. call simple-download.js');
		console.log('    2. wait for it to download a little bit of the file');
		console.log('    3. cancel by pressing Ctrl+C');
		console.log('    4. call resume-download.js again');
	}
});

dl.start();