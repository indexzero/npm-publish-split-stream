'use strict';

var assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    zlib = require('zlib'),
    tar = require('tar'),
    PublishSplitStream = require('../');

var fixturesDir = path.join(__dirname, 'fixtures');

describe('npm-publish-split-stream simple', function () {
  it('should provide a valid tarball from a good request', function (done) {
    var parser = tar.Parse();
    var files = {};

    parser.on('entry', function (e) {
      files[e.path] = e;
    }).on('end', function () {
      assert.deepEqual(Object.keys(files), [
        'package/package.json',
        'package/.npmignore',
        'package/README.md',
        'package/LICENSE',
        'package/index.js',
        'package/test/simple.test.js'
      ]);

      done();
    });

    fs.createReadStream(path.join(fixturesDir, 'payload.json'))
      .pipe(new PublishSplitStream())
      .pipe(zlib.Unzip())
      .pipe(parser);
  });
});
