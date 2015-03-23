var os   = require('os');
var path = require('path');

var Downloader = require('../lib/Downloader');

var downloader = new Downloader();

var fileUrl = 'http://ipv4.download.thinkbroadband.com/512MB.zip';
var fileSavePath = path.join(os.tmpdir(), 'mtFileDlTest1.zip');

console.log('File will be downloaded from '+ fileUrl +' to '+ fileSavePath);

var dl = downloader.download(fileUrl, fileSavePath)
		  .start();

dl.on('start', function() {
	console.log('EVENT - Download started !');
});

dl.on('error', function() {
	console.log('EVENT - Download error !');
	console.log(dl.error);
});

dl.on('end', function() {
	console.log('EVENT - Download finished !');

	console.log(dl.getStats());
});

dl.on('retry', function() {
	console.log('EVENT - Download error, retrying...');
});

dl.on('stopped', function() {
	console.log('EVENT - Download stopped...');
});

// Wait 10s before stopping and resuming download
setTimeout(function() {
	console.log('DEMO - Stopping download... will be resumed in 4s');

	dl.stop();

	setTimeout(function() {
		console.log('DEMO - Resuming download...');
		dl.resume();
	}, 4000);
}, 10000);

var timer = setInterval(function() {
	if(dl.status == 0) {
		console.log('Download not started.');
	} else if(dl.status == 1) {
		var stats = dl.getStats();
		console.log('Download progress: '+ stats.total.completed +' %');
		console.log('Download speed: '+ Downloader.Formatters.speed(stats.present.speed));
		console.log('Download time: '+ Downloader.Formatters.elapsedTime(stats.present.time));
		console.log('Download ETA: '+ Downloader.Formatters.remainingTime(stats.future.eta));
	} else if(dl.status == 2) {
		console.log('Download error... retrying');
	} else if(dl.status == 3) {
		console.log('Download completed !');
	} else if(dl.status == -1) {
		console.log('Download error : '+ dl.error);
	} else if(dl.status == -2) {
		console.log('Download stopped.');
	}

	console.log('------------------------------------------------');

	if(dl.status === -1 || dl.status === 3) {
		clearInterval(timer);
		timer = null;
	}
}, 1000);