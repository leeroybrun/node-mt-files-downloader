module.exports = function(dl, num) {
	num = num || 1;

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

	dl.on('stopped', function() {
		console.log('EVENT - Download '+ num +' stopped...');
	});

	dl.on('destroyed', function() {
		console.log('EVENT - Download '+ num +' destroyed...');
	});
};