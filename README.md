# Multi Threaded Files Downloader

This module wrap the [mt-downloader](https://www.npmjs.com/package/mt-downloader) module and let you :

- Manage multiple downloads
- Get stats
- Auto-retry (continue) a download in case of error (ie. network error)
- Manually restart a download
- Get notified by events when a download start, fail, retry or complete

## Install

	npm install mt-file-downloader

## Usage

Require the module :

	var Downloader = require('mt-file-downloader');

Create a new Downloader instance :

	var downloader = new Downloader();

Create a new download :

	var dl = downloader.download('FILE_URL', 'FILE_SAVE_PATH');

Start the download :

	dl.start();

## Events

You can then listen to those events :

- `dl.on('start', function(dl) { ... });`
- `dl.on('error', function(dl) { ... });`
- `dl.on('end', function(dl) { ... });`
- `dl.on('retry', function(dl) { ... });`

## Downloader object

### Methods

- download(URL, FILE_SAVE_PATH, [options])
    - URL : URL of the file to download
    - FILE_SAVE_PATH : where to save the file (including filename !)
    - options : optional, passed directly to Download object
        - autoStart : (true|false) should we automatically start the download ?
- getDownloadByUrl(url) : get a specified download by URL

### Formatters methods

The Downloader object exposes some formatters for the stats as static methods :

- Downloader.Formatters.speed(speed)
- Downloader.Formatters.elapsedTime(seconds)
- Downloader.Formatters.remainingTime(seconds)

## Download object

### Properties

- status : 
    - -1 = error
    - 0 = not started
    - 1 = started (downloading)
    - 2 = error, retrying
    - 3 = finished
- url
- filePath
- options
- meta

### Methods

- setUrl(url) : set the download URL
- setFilePath(path) : set the download file save path
- setOptions(options) : set the download options
- setRetryOptions(options) : set the retry options
    - maxRetries: max number of retries before considering the download as failed
    - retryInterval: interval (milliseconds) between each retry
- setMeta(meta) : set download metadata
- setStatus(status) : set download status
- setError(error) : set error message for download
- getStats() : compute and get stats for the download
- start() : start download
- restart() : restart (continue) download

## TODO

- Validate data (setters)