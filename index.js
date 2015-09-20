'use strict';

var stream = require('stream'),
    util = require('util'),
    duplexify = require('duplexify'),
    jsonstream = require('JSONStream');

/*
 * function PublishSplitStream ()
 * Splits out the tarball portion of an "npm publish" request
 */
module.exports = function PublishSplitStream() {
  if (!(this instanceof PublishSplitStream)) { return new PublishSplitStream(); }

  var self = this;
  this.stream = duplexify();

  var parser = jsonstream.parse('_attachments.*.data');
  parser.on('data', function (d) {
    self.stream.setReadable(new Content(new Buffer(d, 'base64')));
  });

  this.stream.setWritable(parser);
  return this.stream;
};

/*
 * A simple readable stream for passing through a buffer
 * that has already been read into memory
 */
function Content(str) {
  stream.Readable.call(this);

  this.push(Array.isArray(str) ? str.join('') : str);
  this.push(null);
}

//
// Inherit from Readable Stream and provide a _read stub.
//
util.inherits(Content, stream.Readable);
Content.prototype._read = function noop() {};
