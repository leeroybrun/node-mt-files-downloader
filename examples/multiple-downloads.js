var Downloader = require('../lib/Downloader');
var path = require('path');
var os = require('os');

var registerDlEvents = function(num, dl) {
	dl.on('start', function() {
		console.log('EVENT - Download '+ num +' started !');
	});

	dl.on('error', function() {
		console.log('EVENT - Download '+ num +' error !');
		console.log(dl.error);
	});

	dl.on('end', function() {
		console.log('EVENT - Download '+ num +' finished !');

		console.log(dl.getStats());
	});

	dl.on('retry', function() {
		console.log('EVENT - Download '+ num +' error, retrying...');
	});

	var timer = setInterval(function() {
		if(dl.status == 0) {
			console.log('Download '+ num +' not started.');
		} else if(dl.status == 1) {
			var stats = dl.getStats();
			console.log('Download  '+ num +' progress:');
			console.log('Download progress: '+ stats.total.completed +' %');
			console.log('Download speed: '+ Downloader.Formatters.speed(stats.present.speed));
			console.log('Download time: '+ Downloader.Formatters.elapsedTime(stats.present.time));
			console.log('Download ETA: '+ Downloader.Formatters.remainingTime(stats.future.eta));
		} else if(dl.status == 2) {
			console.log('Download '+ num +' error... retrying');
		} else if(dl.status == 3) {
			console.log('Download '+ num +' completed !');
		} else if(dl.status == -1) {
			console.log('Download '+ num +' error : '+ dl.error);
		}

		console.log('------------------------------------------------');

		if(dl.status === -1 || dl.status === 3) {
			clearInterval(timer);
			timer = null;
		}
	}, 1000);
};

var downloader = new Downloader();

var fileUrl1 = 'http://ipv4.download.thinkbroadband.com/512MB.zip';
var fileSavePath1 = path.join(os.tmpdir(), 'mtFileDlTest1.zip');
var fileUrl2 = 'http://ipv4.download.thinkbroadband.com/200MB.zip';
var fileSavePath2 = path.join(os.tmpdir(), 'mtFileDlTest2.zip');

console.log('First file will be downloaded from '+ fileUrl1 +' to '+ fileSavePath1);
console.log('Second file will be downloaded from '+ fileUrl2 +' to '+ fileSavePath2);

var dl1 = downloader.download(fileUrl1, fileSavePath1)
		  .start();

var dl2 = downloader.download(fileUrl2, fileSavePath2)
		  .start();

registerDlEvents(1, dl1);
registerDlEvents(2, dl2);

