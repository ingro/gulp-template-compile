/* global describe, it */

'use strict';

var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');

var assert = require('assert');
var templater = require('../index');

describe('gulp-template-compile', function() {
  describe('in buffer mode', function() {
    it('should precompile a template', function(done) {

      // create the fake file
      var pathname = path.join(__dirname, 'fixtures', 'simple.html');
      var fakeFile = new gutil.File({
        base: __dirname,
        path: pathname,
        contents: new Buffer('<p>{{ message }}</p>')
      });

      // Create a prefixer plugin stream
      var myTemplate = templater();

      // write the fake file to it
      myTemplate.write(fakeFile);
      // fakeFile.pipe(myPrefixer).pipe(process.stddout);

      // wait for the file to come back out
      myTemplate.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), "\n\ntpl[\"fixtures/simple.html\"] = function(obj) {\nobj || (obj = {});\nvar __t, __p = '';\nwith (obj) {\n__p += '<p>{{ message }}</p>';\n\n}\nreturn __p\n};");
        done();
      });

    });
    it('should be able to set a name', function() {

      var pathname = path.join(__dirname, 'fixtures', 'simple.html');
      var fakeFile = new gutil.File({
        base: __dirname,
        path: pathname,
        contents: new Buffer('<p>{{ message }}</p>')
      });

      var myTemplate = templater({
        name:function(){
          return 'custom';
        }
      });
      myTemplate.write(fakeFile);
      myTemplate.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());
        // check the contents
        assert.equal(file.contents.toString('utf8'), "\n\ntpl[\"custom\"] = function(obj) {\nobj || (obj = {});\nvar __t, __p = '';\nwith (obj) {\n__p += '<p>{{ message }}</p>';\n\n}\nreturn __p\n};");
      });
    });

    it('should be able to cope with a lot of options', function() {

      var options = {
        templateSettings: {
          // <%-escape%>
          // becomes {{{ }}}
          // between {{{ and }}} <p>hello</p> becomes &lt;p&gt;hello&lt;p&gt;
          escape:      /\{\{\{([\s\S]+?)\}\}\}/g,
          // <%evaluate%>
          // becomes {{# }}
          // {{# console.log("blah") }}
          evaluate:    /\{\{#([\s\S]+?)\}\}/g,
          // <%=interpolate%>
          // becomes {{ }}
          // <b>hello</b> becomes <b>hello</b>
          interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g,
          variable: 'o'
        },
        namespace: '_vdk.templates',
        name: function (file) {
          var f = file.relative;
          // remove extension and 'templates/'
          f = f.substr(0, f.lastIndexOf('.')) || f;
          return f;
        }
      };

      var pathname = path.join(__dirname, 'fixtures', 'simple.html');
      var fakeFile = new gutil.File({
        base: __dirname,
        path: pathname,
        contents: new Buffer('<p>{{ o.message }}</p>')
      });

      var myTemplate = templater(options);
      myTemplate.write(fakeFile);
      myTemplate.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());
        // check the contents
        assert.equal(file.contents.toString('utf8'), "\n\n_vdk[\"templates\"][\"fixtures/simple\"] = function(o) {\nvar __t, __p = '';\n__p += '<p>' +\n((__t = (o.message)) == null ? '' : __t) +\n'</p>';\nreturn __p\n};");
      });
    });

  });

});
