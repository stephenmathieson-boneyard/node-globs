'use strict';

/*jshint unused:false*/

var vows = require('vows'),
	assert = require('assert'),
	glob = require('glob'),
	globs = require('../');

function single(pattern) {
	return {
		topic: function () {
			var p = Array.isArray(pattern) ? pattern[0] : pattern,
				callback = this.callback;

			glob(p, function (err, expected) {
				if (err) {
					return callback(err);
				}

				globs(pattern, function (err, actual) {
					if (err) {
						return callback(err);
					}

					callback(null, actual, expected);
				});
			});
		},
		'should not error': function (err, actual, expected) {
			assert.ifError(err);
		},
		'should match glob\'s output': function (err, actual, expected) {
			assert.deepEqual(actual, expected);
		}
	};
}

vows
	.describe('globs')
	.addBatch({
		'single pattern': {
			'as string': single('./fixtures/*.js'),
			'as array': single(['./fixtures/a.js'])
		}
	})
	.addBatch({
		'multiple patterns': {
			topic: function () {
				var callback = this.callback;

				glob('./fixtures/*.js', function (err, expected) {
					if (err) {
						return callback(err);
					}

					var patterns = [
						'./fixtures/a.js',
						'./fixtures/b.js',
						'./fixtures/c.js'
					];

					globs(patterns, function (err, actual) {
						if (err) {
							return callback(err);
						}

						callback(null, actual, expected);
					});
				});
			},
			'should not error': function (err, actual, expected) {
				assert.ifError(err);
			},
			'should match glob\'s output': function (err, actual, expected) {
				assert.deepEqual(actual, expected);
			}
		}
	})
	.export(module);
