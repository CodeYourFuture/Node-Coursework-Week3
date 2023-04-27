/**
 * Autoincrementing Counter
 * @constructor
 */
var PrivateAutoincrementer = function() {
	var id = 0;

	/**
	 * Generate a unique ID
	 * @param {Function} cb The callback
	 */
	this.generate = function(cb) {
		var self = this;
		id++;
		if (typeof(cb) == typeof(function(){})) cb(id);
		return id;
	};

};

/**
 * UUID Singleton
 */

var Autoincrementer = (function () {
	var instance = null;
	return {
		shared: function () {
			if ( instance === null ) {
				instance = new PrivateAutoincrementer();
			}
			return instance;
		}
	};
})();

if (typeof(module) === typeof(undefined)) window.module = {};
module.exports = Autoincrementer;
