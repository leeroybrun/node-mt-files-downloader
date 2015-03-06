var Download = require('./Download');
var Formatters = require('./Formatters');

var extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
};

/*
  ------------------------------------------
  - Downloader class
  ------------------------------------------
 */
var Downloader = function() {
	this._downloads = [];
};

Downloader.prototype._defaultOptions = {
    //To set the total number of download threads
    count: 2, //(Default: 6)

    //HTTP method
    method: 'GET', //(Default: GET)

    //HTTP port
    port: 80, //(Default: 80)

    //If no data is received the download times out. It is measured in seconds.
    timeout: 5, //(Default: 5 seconds)

    //Control the part of file that needs to be downloaded.
    range: '0-100', //(Default: '0-100')
};

Downloader.prototype.download = function(url, filePath, options) {
	var options = extend({}, this._defaultOptions, options);

	var dl = new Download();

	dl.setUrl(url);
	dl.setFilePath(filePath);
	dl.setOptions(options);

	this._downloads.push(dl);

    return dl;
};

Downloader.prototype.restart = function(filePath) {
    var dl = new Download();

    dl.setUrl(null);
    dl.setFilePath(filePath+'.mtd');
    dl.setOptions({});

    this._downloads.push(dl);

    return dl;
};

Downloader.prototype.getDownloadByUrl = function(url) {
	var dlFound = null;

	this._downloads.forEach(function(dl) {
		if(dl.url === url) {
			dlFound = dl;
		}
	});

	return dlFound;
};

Downloader.prototype.Formatters = Formatters;
Downloader.Formatters = Formatters;

module.exports = Downloader;