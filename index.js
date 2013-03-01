'use strict';

var glob = require('glob');

/**
 * Expand one or more patterns into an Array of files.
 *
 * @example
 * ```
 * expand('../*.js', function (err, jsfiles) {
 *   console.log(jsfiles);
 * })
 * ```
 * @example
 * ```
 * expand(['*.js', '../*.js'], function (err, jsfiles) {
 *   console.log(jsfiles)
 * })
 * ```
 * @param {String|Array} patterns One or more patterns to match
 * @param {Function} callback Function which accepts two parameters: err, files
 */
function expand(patterns, callback) {
	var pending,
		groups = [];

	// not an Array?  make it so!
	if (!Array.isArray(patterns)) {
		patterns = [ patterns ];
	}

	pending = patterns.length;

	// walk the patterns
	patterns.forEach(function (pattern) {
		// grab the files
		glob(pattern, function (err, files) {
			if (err) {
				return callback(err);
			}

			// add the files to the group
			groups = groups.concat(files);

			pending -= 1;
			// last pattern?
			if (!pending) {
				// done
				return callback(null, groups);
			}
		});
	});
}

module.exports = expand;
