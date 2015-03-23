var Downloader = require('../lib/Downloader');
var path = require('path');
var os = require('os');

var handleEvents = require('./_handleEvents');
var printStats = require('./_printStats');

var registerDlEvents = function(num, dl) {
	handleEvents(dl, num);
	printStats(dl, num);
};

var downloader = new Downloader();

var fileUrl1 = 'http://ipv4.download.thinkbroadband.com/200MB.zip';
var fileSavePath1 = path.join(os.tmpdir(), 'mtFileDlTest1.zip');
var fileUrl2 = 'http://ipv4.download.thinkbroadband.com/100MB.zip';
var fileSavePath2 = path.join(os.tmpdir(), 'mtFileDlTest2.zip');

console.log('First file will be downloaded from '+ fileUrl1 +' to '+ fileSavePath1);
console.log('Second file will be downloaded from '+ fileUrl2 +' to '+ fileSavePath2);

var dl1 = downloader.download(fileUrl1, fileSavePath1)
		  .start();

var dl2 = downloader.download(fileUrl2, fileSavePath2)
		  .start();

registerDlEvents(1, dl1);
registerDlEvents(2, dl2);

