# globs

An extension of [glob], allowing you to provide one or more patterns to match.

## usage

```js
var globs = require('globs');

// a single pattern
globs('**/*.js', function (err, files) {
	if (err) {
		throw err;
	}

	console.log('matched:', files);
});

// multiple patterns
globs([ '**/*.js', '/foo/bar/*.coffee' ], function (err, files) {
	if (err) {
		throw err;
	}

	console.log('matched:', files);
});

```

[glob]: https://github.com/isaacs/node-glob