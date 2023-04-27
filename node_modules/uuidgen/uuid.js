/**
 * UUID Generator
 * @constructor
 */
var PrivateUUID = function() {
	// TODO
	var queue = [];

	var queueIsRunning = false;

	var id = 0;

	/**
	 * Queue a new UUID to be generated.
	 */
	var getUUID = function(cb) {
		// var d = new Date().getTime();
		var d = Date.now();
		// println(d);
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	};

	/**
	 * Run the queue.
	 */
	var runQueue = function() {
		var self = this;
		if (queueIsRunning) return;

		queueIsRunning = true;
		advanceQueue();
	};

	/**
	 * Advance the queue.
	 */
	var advanceQueue = function() {
		var self = this;

		if (queue.length == 0) {
			queueIsRunning = false;
			return;
		}
		setTimeout(function(){

			var cb = queue.shift();
			var uuid = getUUID();
			
			if (cb) cb(uuid);
			advanceQueue();
		}, 1);
	};

	/**
	 * Queue a new UUID to be generated.
	 * @param {Function} cb The callback
	 */
	this.generate = function(cb) {
		var self = this;
		queue.push(cb);
		runQueue();
	};
};

/**
 * UUID Singleton
 */

var UUID = (function () {
	var instance = null;
	return {
		shared: function () {
			if ( instance === null ) {
				instance = new PrivateUUID();
			}
			return instance;
		}
	};
})();

var module = module || {};
module.exports = module.exports || {};
module.exports = UUID;
