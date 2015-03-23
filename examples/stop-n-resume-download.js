var os   = require('os');
var path = require('path');
var Downloader = require('../lib/Downloader');

// Create new downloader
var downloader = new Downloader();

var fileUrl = 'http://ipv4.download.thinkbroadband.com/100MB.zip';
var fileSavePath = path.join(os.tmpdir(), 'mtFileDlTest1.zip');
console.log('File will be downloaded from '+ fileUrl +' to '+ fileSavePath);

// Start download
var dl = downloader.download(fileUrl, fileSavePath)
		  .start();

// Import generic examples for handling events and printing stats
require('./_handleEvents')(dl);
require('./_printStats')(dl);

// Wait 10s before stopping and then 4s before resuming download
setTimeout(function() {
	console.log('DEMO - Stopping download... will be resumed in 4s');

	dl.stop();

	setTimeout(function() {
		console.log('DEMO - Resuming download...');
		dl.resume();
	}, 4000);
}, 10000);