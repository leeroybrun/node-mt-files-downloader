var mtd = require('mt-downloader');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Download = function() {
    EventEmitter.call(this);

    this._reset();

    this.url = '';
    this.filePath = '';
    this.options = {};
    this.meta = {};

    this._retryOptions = {
        _nbRetries: 0,
        maxRetries: 5,
        retryInterval: 5000
    };

    // Bind all _computeStats functions to parent "this"
    for(var k in this._computeStats) {
        this._computeStats[k] = this._computeStats[k].bind(this);
    }
};

util.inherits(Download, EventEmitter);

Download.prototype._reset = function(first_argument) {
    this.status = 0; // -1 = error, 0 = not started, 1 = started (downloading), 2 = error, retrying, 3 = finished
    this.error = '';

    this.stats = {
        time: {
            start: 0,
            end: 0
        },
        total: {
            size: 0,
            downloaded: 0,
            completed: 0
        },
        past: {
            downloaded: 0
        },
        present: {
            downloaded: 0,
            time: 0,
            speed: 0
        },
        future: {
            remaining: 0,
            eta: 0
        },
        threadStatus: {
            idle: 0,
            open: 0,
            closed: 0,
            failed: 0
        }
    };
};

Download.prototype.setUrl = function(url) {
	this.url = url;

    return this;
};

Download.prototype.setFilePath = function(filePath) {
	this.filePath = filePath;

    return this;
};

Download.prototype.setOptions = function(options) {
	this.options = options;

    return this;
};

Download.prototype.setRetryOptions = function(options) {
    this._retryOptions.maxRetries = options.maxRetries || 3;
    this._retryOptions.retryInterval = options.retryInterval || 2000;

    return this;
};

Download.prototype.setMeta = function(meta) {
	this.meta = meta;

    return this;
};

Download.prototype.setStatus = function(status) {
	this.status = status;

    return this;
};

Download.prototype.setError = function(error) {
	this.error = error;

    return this;
};

Download.prototype._computeStats = {

    _downloaded: function() {
        var downloaded = 0;
        this.meta.threads.forEach(function(thread) {
            downloaded += thread.position - thread.start;
        });

        return downloaded;
    },

    // Should be called on start, set the start timestamp (in seconds)
    startTime: function() {
        this.stats.time.start = Math.floor(Date.now() / 1000);
    },

    // Should be called on end, set the end timestamp (in seconds)
    endTime: function() {
        this.stats.time.end = Math.floor(Date.now() / 1000);
    },

    // Should be called on start, count size already downloaded (eg. resumed download)
    pastDownloaded: function() {
        this.stats.past.downloaded = this._computeStats._downloaded();
    },

    // Should be called on start compute total size
    totalSize: function() {
        var threads = this.meta.threads;

        this.stats.total.size = threads[threads.length-1].end - threads[0].start;
    },

    all: function() {
        this._computeStats.totalSize();
        this._computeStats.presentTime();
        this._computeStats.totalDownloaded();
        this._computeStats.presentDownloaded();
        this._computeStats.totalCompleted();
        this._computeStats.futureRemaining();
        this._computeStats.presentSpeed();
        this._computeStats.futureEta();
        this._computeStats.threadStatus();
    },

    presentTime: function() {
        this.stats.present.time = Math.floor(Date.now() / 1000) - this.stats.time.start;
    },

    totalDownloaded: function() {
        this.stats.total.downloaded = this._computeStats._downloaded();
    },

    presentDownloaded: function() {
        this.stats.present.downloaded = this.stats.total.downloaded - this.stats.past.downloaded;
    },

    totalCompleted: function() {
        this.stats.total.completed = Math.floor((this.stats.total.downloaded) * 1000 / this.stats.total.size) / 10;
    },

    futureRemaining: function() {
        this.stats.future.remaining = this.stats.total.size - this.stats.total.downloaded;
    },

    presentSpeed: function() {
        this.stats.present.speed = this.stats.present.downloaded / this.stats.present.time;
    },

    futureEta: function() {
        this.stats.future.eta = this.stats.future.remaining / this.stats.present.speed;
    },

    threadStatus: function() {
        var self = this;

        this.stats.threadStatus = {
            idle: 0,
            open: 0,
            closed: 0,
            failed: 0
        };

        this.meta.threads.forEach(function(thread) {
            self.stats.threadStatus[thread.connection]++;
        });
    }
};

Download.prototype.getStats = function() {
    if(!this.meta.threads) {
        return this.stats;
    }

    this._computeStats.all();

    return this.stats;
};

Download.prototype.start = function() {
	var self = this;

    self._reset();
    self._retryOptions._nbRetries = 0;

	this.options.onStart = function(meta) {
		self.setStatus(1);
		self.setMeta(meta);

        self.setUrl(meta.url);

        self._computeStats.startTime();
        self._computeStats.pastDownloaded();
        self._computeStats.totalSize();

        self.emit('start', self);
	};

	this.options.onEnd = function(err, result) {
        if(err && self._retryOptions._nbRetries < self._retryOptions.maxRetries) {
            self.setStatus(2);
            self._retryOptions._nbRetries++;

            setTimeout(function() {
                self.restart();

                self.emit('retry', self);
            }, self._retryOptions.retryInterval);
        } else if(err) {
            self._computeStats.endTime();

			self.setError(err);
			self.setStatus(-1);

            self.emit('error', self);
		} else {
            self._computeStats.endTime();

			self.setStatus(3);

            self.emit('end', self);
		}
	};

	this._downloader = new mtd(this.filePath, this.url, this.options);

	this._downloader.start();

    return this;
};

Download.prototype.restart = function() {
    this._reset();

    var filePath = this.filePath;
    if (!filePath.match(/\.mtd$/)) {
        filePath += '.mtd';
    }

	this._downloader = new mtd(filePath, null, this.options);

	this._downloader.start();

    return this;
};

module.exports = Download;