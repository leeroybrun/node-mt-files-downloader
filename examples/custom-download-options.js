var os   = require('os');
var path = require('path');
var Downloader = require('../lib/Downloader');

// Create new downloader
var downloader = new Downloader();

var fileUrl = 'http://ipv4.download.thinkbroadband.com/20MB.zip';
var fileSavePath = path.join(os.tmpdir(), 'mtFileDlTest1.zip');
console.log('File will be downloaded from '+ fileUrl +' to '+ fileSavePath);

// Start download
var dl = downloader.download(fileUrl, fileSavePath);

// Set retry options
dl.setRetryOptions({
	maxRetries: 3,		// Default: 5
	retryInterval: 1000 // Default: 2000
});

// Set download options
dl.setOptions({
    threadsCount: 5, // Default: 2, Set the total number of download threads
    method: 'GET', 	 // Default: GET, HTTP method
    port: 80, 	     // Default: 80, HTTP port
    timeout: 5000,   // Default: 5000, If no data is received, the download times out (milliseconds)
    range: '0-100',  // Default: 0-100, Control the part of file that needs to be downloaded.
});

// Import generic examples for handling events and printing stats
require('./_handleEvents')(dl);
require('./_printStats')(dl);

dl.start();

dl.on('start', function() {
	console.log('Download started with '+ ((dl.meta.threads) ? dl.meta.threads.length : 0) +' threads.')
});