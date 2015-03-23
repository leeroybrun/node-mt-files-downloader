var os   = require('os');
var path = require('path');

var Downloader = require('../lib/Downloader');

var downloader = new Downloader();

var fileUrl = 'http://ipv4.download.thinkbroadband.com/100MB.zip';
var fileSavePath = path.join(os.tmpdir(), 'mtFileDlTest1.zip');

console.log('File will be downloaded from '+ fileUrl +' to '+ fileSavePath);

var dl = downloader.download(fileUrl, fileSavePath)
		  .start();

require('./_handleEvents')(dl);
require('./_printStats')(dl);

// Wait 10s before destroying download
setTimeout(function() {
	console.log('DEMO - Destroying download...');

	dl.destroy();

	console.log('Downloads in manager: '+ downloader.getDownloads().length);

	if(downloader.removeDownloadByFilePath(dl.filePath)) {
		console.log('Download removed from manager !');
	} else {
		console.log('Error when trying to remove download from manager !');
	}

	console.log('Downloads in manager: '+ downloader.getDownloads().length);
}, 10000);

