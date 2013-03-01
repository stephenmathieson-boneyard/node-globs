# expand

An extension of [glob], allowing you to provide one or more patterns to match.

## usage

```js
var expand = require('expand');

// a single pattern
expand('**/*.js', function (err, files) {
	if (err) {
		throw err;
	}

	console.log('matched:', files);
});

// multiple patterns
expand([ '**/*.js', '/foo/bar/*.coffee' ], function (err, files) {
	if (err) {
		throw err;
	}

	console.log('matched:', files);
});

```

[glob]: https://github.com/isaacs/node-glob