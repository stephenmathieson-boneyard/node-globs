'use strict';

/*jshint unused:false*/

var expand,
	patterns = [],
	vows = require('vows'),
	assert = require('assert'),
	sandbox = require('sandboxed-module');

expand = sandbox.require('..', {
	requires: {
		glob: function (pattern, cb) {
			patterns.push(pattern);
			cb(null, []);
		}
	}
});

vows
	.describe('expand (mocked glob)')
	.addBatch({
		'multiple patterns': {
			topic: function () {
				var callback = this.callback,
					expected = [
						'/foo/**/*.apples',
						'/foo/bar/*.oranges',
						'**/*.grapes',
						'/baz/bang/*.cherries'
					];

				expand(expected, function (err) {
					if (err) {
						return callback(err);
					}

					callback(null, expected);
				});
			},
			'should not error': function (err, expected) {
				assert.ifError(err);
			},
			'should pass each pattern to glob': function (err, expected) {
				expected.forEach(function (pattern) {
					assert.include(patterns, pattern);
				});
			}
		}
	})
	.addBatch({
		'single pattern': {
			topic: function () {
				var callback = this.callback,
					pattern = '/foo/**/bang/**/*.apples';

				expand(pattern, function (err) {
					if (err) {
						return callback(err);
					}

					callback(null, pattern);
				});
			},
			'should not error': function (err, pattern) {
				assert.ifError(err);
			},
			'should pass the pattern to glob': function (err, pattern) {
				assert.include(patterns, pattern);
			}
		}
	})
	.export(module);
