var Downloader = require('../lib/Downloader');
var format = require('../lib/Formatters');

var downloader = new Downloader();

var dl = downloader.downloadFile('http://ipv4.download.thinkbroadband.com/5MB.zip', 'testFileDownload.zip');

dl.on('start', function() {
	console.log('Download started !');
});

dl.on('error', function() {
	console.log('Download error !');
	console.log(dl.error);
});

dl.on('end', function() {
	console.log('Download finished !');
});

var timer = setInterval(function() {
	var stats = dl.getStats();
	console.log('Download progress: '+ stats.total.completed +' %');
	console.log('Download speed: '+ format.speedFormater(stats.present.speed));
	console.log('Download time: '+ format.elapsedTimeFormater(stats.present.time));
	console.log('Download ETA: '+ format.remainingTimeFormater(stats.future.eta));
	console.log('------------------------------------------------');

	if(dl.status === -1 || dl.status === 2) {
		clearInterval(timer);
		timer = null;
	}
}, 1000);