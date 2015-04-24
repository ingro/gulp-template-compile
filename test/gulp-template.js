/* global describe, it */

// using 'with' from lodash.template is not compliant with strict mode
// 'use strict';

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

    var ts = {
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
    };

    var fixtures = [
      {
        name: 'simple',
        options: {
          templateSettings: ts,
          namespace: 'ns',
          name: function() {
            return 'simple';
          }
        },
        data: {message: 'plop'},
        method: '\n\nns[\"simple\"] = function(o) {\nvar __t, __p = \'\';\n__p += \'<p>\' +\n((__t = (o.message)) == null ? \'\' : __t) +\n\'</p>\';\nreturn __p\n};',
        result: '<p>plop</p>',
      },
      {
        name: 'multiple',
        options: {
          templateSettings: ts,
          namespace: 'ns',
          name: function() {
            return 'multiple';
          }
        },
        data: {fname: 'bob', lname: 'dylan'},
        method: 'i am lazy',
        result: '<p>bob <b>dylan</b></p>'
      },
      {
        name: 'sub_objects',
        options: {
          templateSettings: ts,
          namespace: 'ns',
          name: function() {
            return 'sub_objects';
          }
        },
        data: {identity: {firstname: 'Chad', lastname: 'Smith'}, job: {title: 'Musician', description: 'RHCP'}},
        method: 'i am lazy',
        result: '<div><p>first name Chad</p><p>last name Smith</p><p>job title Musician</p><p>job decription RHCP</p></div>'
      },
      {
        name: 'ignore_erb',
        options: {
          templateSettings: ts,
          namespace: 'ns',
          name: function() {
            return 'ignore_erb';
          }
        },
        data: {},
        method: 'i am lazy',
        result: '<p><% o.ignore me %></p>'
      },
      {
        name: 'ignore_mismatch',
        options: {
          templateSettings: ts,
          namespace: 'ns',
          name: function() {
            return 'ignore_mismatch';
          }
        },
        data: {something: 'else'},
        method: 'i am lazy',
        result: '<p></p>'
      },
      {
        name: 'condition',
        options: {
          templateSettings: ts,
          namespace: 'ns',
          name: function() {
            return 'condition';
          }
        },
        data: {message: 'hello'},
        method: 'i am lazy',
        result: '<p><b>hello</b></p>'
      },
      {
        name: 'condition',
        options: {
          templateSettings: ts,
          namespace: 'ns',
          name: function() {
            return 'condition';
          }
        },
        data: {nomessage: 'not hello'},
        method: 'i am lazy',
        result: '<p><i>nothing</i></p>'
      },
      {
        name: 'evaluate',
        options: {
          templateSettings: ts,
          namespace: 'ns',
          name: function() {
            return 'evaluate';
          }
        },
        data: {is: true},
        method: 'i am lazy',
        result: '<p>yes</p>'
      }
    ];
    for (var i = 0; i < fixtures.length; i++) {
      it('should pass fixture: ' + fixtures[i].name, function(done) {
        var that = this;
        var pathname = path.join(__dirname, 'fixtures', that.fix.name + '.html');
        fs.createReadStream(pathname).pipe(through(function(chunk, enc, callback) {
          // create a fake input file
          var fileIn = new gutil.File({
            base: __dirname,
            path: pathname,
            contents: chunk
          });

          var myTemplate = templater(that.fix.options);

          myTemplate.on('data', function(d) {

            if(that.fix.method !== 'i am lazy') {
              assert.equal(that.fix.method, d.contents.toString());
            }

            var unsafe = ';var ns = {};'
              + d.contents.toString() 
              + '\nns["' + that.fix.name + '"]('
              + JSON.stringify(that.fix.data)
              + ')';

            assert.equal(eval(unsafe), that.fix.result);


            // console.log(chunk.toString(), d.contents.toString());

            done();
          });
          myTemplate.write(fileIn);
          callback();
        })); // fs
      }.bind({fix: fixtures[i]})); // it
    }
  });
});
