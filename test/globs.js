'use strict';

//jshint unused:false

var vows = require('vows'),
  assert = require('assert'),
  glob = require('glob'),
  globs = require('../');

function none(pattern, options) {
  return {
    topic: function () {
      if (options) {
        globs(pattern, options, this.callback);
      } else {
        globs(pattern, this.callback);
      }
    },
    'should not error': function (err, actual) {
      assert.ifError(err);
    },
    'should produce empty result': function (err, actual, expected) {
      assert.deepEqual(actual, []);
    }
  };
}

function single(pattern, options) {
  return {
    topic: function () {
      var p = Array.isArray(pattern) ? pattern[0] : pattern
        , callback = this.callback;

      // eh - it's just tests...
      if (options) {
        glob(p, options, function (err, expected) {
          if (err) {
            return callback(err);
          }

          globs(pattern, options, function (err, actual) {
            if (err) {
              return callback(err);
            }

            callback(null, actual, expected);
          });
        });
      } else {
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
      }
    },
    'should not error': function (err, actual, expected) {
      assert.ifError(err);
    },
    'should match glob\'s output': function (err, actual, expected) {
      assert.deepEqual(actual, expected);
    }
  };
}

function multiple(options) {
  return {
    topic: function () {
      var callback = this.callback
        , pattern = './fixtures/*.js'
        , patterns = [
          './fixtures/a.js',
          './fixtures/b.js',
          './fixtures/c.js'
        ];

      if (options) {

        glob(pattern, options, function (err, expected) {
          if (err) {
            return callback(err);
          }

          globs(patterns, options, function (err, actual) {
            if (err) {
              return callback(err);
            }

            callback(null, actual, expected);
          });
        });

      } else {

        glob(pattern, function (err, expected) {
          if (err) {
            return callback(err);
          }

          globs(patterns, function (err, actual) {
            if (err) {
              return callback(err);
            }

            callback(null, actual, expected);
          });
        });
      }
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
    'no pattern': {
      'as string': none(''),
      'as array': none([]),
      'with options': none('', { cwd: __dirname + '/fixtures' })
    }
  })
  .addBatch({
    'single pattern': {
      'as string': single('./fixtures/*.js'),
      'as array': single(['./fixtures/a.js']),
      'with options': single('./*.js', { cwd: __dirname + '/fixtures' })
    }
  })
  .addBatch({
    'multiple patterns': {
      'options': multiple({ cwd: __dirname }),
      'no options': multiple()
    }
  })
  .addBatch({
    'sync': {
      'single': {
        topic: function () {
          var actual = globs.sync('./fixtures/*.js', { cwd: __dirname })
            , expected = glob.sync('./fixtures/*.js', { cwd: __dirname });

          this.callback(null, actual, expected);
        },
        'should support a single pattern': function (err, actual, expected) {
          assert.deepEqual(actual, expected);
        }
      },
      'multiple': {
        topic: function () {
          var patterns = [ './fixtures/*.js', './fixtures/b.js' ]
            , actual = globs.sync(patterns, { cwd: __dirname })
            , expected = [
              './fixtures/a.js',
              './fixtures/b.js',
              './fixtures/c.js',
              './fixtures/b.js'
            ];

          this.callback(null, actual, expected);
        },
        'should support multiple patterns': function (err, actual, expected) {
          assert.deepEqual(actual, expected);
        }
      }
    }
  })
  .export(module);
