# Corps

Streaming HTTP request body parser

`npm install corps`

## Usage

```javascript
var body = require('corps');

http.createServer(function(req, res) {
	body.auto(req).map(function(data) {
		res.end(data.greeting + "world");
	});
}).listen(3000);
```

```bash
$ curl -X POST -D '{"greeting": "salutations"}' -H 'Content-type: application/json' localhost:8000

salutations world

$ curl -X POST -D 'greeting=what+ho' -H 'Content-type: application/x-www-form-urlencoded' localhost:8000

what ho world
```

## API

#### `auto :: Request → Stream Params`
Sniffs `Content-type` and parses the request body with the appropriate parser. Knows about `application/json` and `application/x-www-form-urlencoded` to begin with. Everything else is left as raw strings. To teach it about other formats, add to `mimeParsers`.

#### `json`, `query`, `raw`
Individual parsers that comprise `auto`. Use one of these if you know what format the data will be in.

#### `mimeParsers :: Map ContentType (Request → Stream Params)`
A map of `Content-type`s to parsers. A parser is a function that takes a request and returns a stream containing a single parameters object.

#### `bodyParams :: (String → Stream Params) → Request → Stream Params`
Lets a parser that works on strings work with request streams.

#### `handleError :: (String → Params) → String → Stream Params
Wraps a simple parser (that could throw errors) such as `JSON.parse` in a stream that handles exceptions.

## Licence
MIT.
