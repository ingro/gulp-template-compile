/* global describe, it */

'use strict';

var fs = require('fs');
var path = require('path');

var assert = require('assert');
var template = require('lodash.template');

var fixtures = function (glob) { return path.join(__dirname, 'fixtures', glob); };

describe('lodash.template compatibility', function(){
  describe('trivial methods', function(){
  
    it('should return a compiled result', function() {
      var hello = template('hello <%= user %>!')({ 'user': 'gasp' });
      assert.equal('hello gasp!', hello);
    });

    it('should be able to use a variable', function() {
      var data = {'user': 'gasp'};
      var salut = template('hello <%= o.user %>!', {variable: 'o'})(data);
      assert.equal('hello gasp!', salut);
    });

    it('should be able to use two variables', function() {
      var data = {'one': 'john', 'two': 'lisa'};
      var two = template('hello <%= o.one %> and <%= o.two %>!', {variable: 'o'})(data);
      assert.equal('hello john and lisa!', two);
    });

    it('should be able to ignore a missing parameter', function() {
      var data = {'one': 'john'};
      var missing = template('hello <%= o.one %> and <%= o.two %>!', {variable: 'o'})(data);
      assert.equal('hello john and !', missing);
    });


    it('should be able to use custom delimiters', function() {
      var options = {interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g};
      var data = {'user': 'gasp'};
      var mustache = template('hello {{ user }}!', options)(data);
      assert.equal('hello gasp!', mustache);
    });

    it('should be able to use custom delimiters and variable', function() {
      var options = {
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g,
        variable: 'o'
      };
      var data = {'user': 'gasp'};
      var render = template('hello {{ o.user }}!', options)(data);
      assert.equal('hello gasp!', render);
    });

  });

  describe('generator', function(){
    it('should return an uncompiled result', function() {
      var hello = template('hello <%= user %>!');
      var uncompiled = "function(obj) {\nobj || (obj = {});\nvar __t, __p = '';\nwith (obj) {\n__p += 'hello ' +\n((__t = ( user )) == null ? '' : __t) +\n'!';\n\n}\nreturn __p\n}";
      assert.equal(uncompiled, hello.source);
    });
  });
})