# npm-publish-split-stream
Splits an npm publish request using jsonstream and duplexify.

## Usage

``` js
var PublishSplitStream = require('npm-publish-split-stream');
var http = require('http');
var zlib = require('zlib');
var tar = require('tar');
var concat = require('concat-stream');

http.createServer(function (req, res) {
  //
  // Create a tar parser and listen for
  // entries from it.
  //
  var parser = tar.Parse();
  parser.on('entry', function (e) {
    // read the entire entry and log the contents.
    e.pipe(concat({ encoding: 'string' }, function (content) {
      console.log(e.path, content)
    }));
  });

  //
  // Parse the tarball from our request and then
  // process it.
  //
  req.pipe(new PublishSplitStream())
    .pipe(zlib.Unzip())
    .pipe(parser);
});
```

##### Author: [Charlie Robbins](https://github.com/indexzero)
##### Contributors: [Martijn Swaagman](https://github.com/swaagie), [Arnout Kazemier](https://github.com/3rd-eden)
##### LICENSE: MIT
