var os = require('os');
var path = require('path');

var Downloader = require('../lib/Downloader');
var downloader = new Downloader();

// Do not touch
var dls = []; // All files needed to be downloaded
var curDls = 0; // Number of current download in progress
// End do not touch

const simultaneousDownload = 5; // As indicated by his name :)
var downloadPath = os.tmpdir(); // Download path where files has be downloaded (sorry for my bad English :( i'am french... )

// All files needed to be downloaded
var files = [
	{
		'name': 'test1.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zip'
	},
	{
		'name': 'test2.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zip'
	},
	{
		'name': 'test3.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/20MB.zip'
	},
	{
		'name': 'test4.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zip'
	},
	{
		'name': 'test5.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zip'
	},
	{
		'name': 'test6.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zip'
	},
	{
		'name': 'test7.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zip'
	},
	{
		'name': 'test8.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zip'
	},
	{
		'name': 'test9.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zip'
	},
	{
		'name': 'test10.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zip'
	},
	{
		'name': 'test11.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/20MB.zip'
	},
	{
		'name': 'test12.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zisp'
	},
	{
		'name': 'test13.zip',
		'file': 'http://ipv4.download.thinkbroadband.com/5MB.zip'
	}
]

// Init dls
files.forEach(function (item) {
	const filepath = path.join(downloadPath , item.name);
	var dl = downloader.download(item.file, filepath);
	dl.name = item.name

  // Events of current dl
	dl.on('start', function(item) {
		console.log('Download of ' + item.name + ' started !')
	});
	dl.on('end', function(item) {
		curDls--;
		console.log('Download of ' + item.name + ' finished !')
	});
	dl.on('error', function(item) {
		curDls--;
		console.log('Error with ' + item.name)
	});

	dls.push(dl)
})

// Start first dl
dls.forEach(function (item) {
	if (curDls < simultaneousDownload) {
		item.start();
		curDls++;
	}
});

var it = setInterval(function() {

	var speed = 0;
	var eta = 0;
	var progress = 0;
	console.clear();

	console.log(dls.length + ' // ' + curDls)

	dls.forEach(function (item) {

		console.log(item.status + ' // ' + item.name +
    (item.status == 3 ? '\t✅  \tfinished' : '') +
    (item.status == 1 ? '\t〽️  \tdownload in progress...' : '') +
    (item.status == 0 ? '\t💬  \twait for download' : '') +
    (item.status == 2 ? '\t⚠️  \terror, retrying ' : '') +
    (item.status == -1 ? '\t❌  \terror ' : ''));

    // Check if item can start downloaded
		if (item.status == 0 && curDls < simultaneousDownload) {
			item.start()
			curDls++;
		}

    // Calcul speed / eta / progress of all current download
		var stats = item.getStats()
		speed += stats.present.speed
		eta += stats.future.eta
		progress += stats.total.completed
	});

  // Check if we have finished to download all files
	if (curDls == 0) {
		clearInterval(it);
		return;
	}

	progress = progress / (dls.length + 1); // I don't know why +1 but it is needed x)
	eta = eta / dls.length;

	console.log('Download progress: '+ progress +' %');
	console.log('Download speed: '+ Downloader.Formatters.speed(speed));
	console.log('Download ETA: '+ Downloader.Formatters.remainingTime(eta));

}, 2000);
