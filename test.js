'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var tpl = require('./index');

it('should precompile lodash templates', function(cb) {

	var stream = tpl();

	stream.on('data', function (file) {
		assert.equal(file.path, __dirname + '\\fixture\\fixture.js');
		assert.equal(file.relative, 'fixture\\fixture.js');
		assert(/["JST"]/.test(file.contents.toString()));
		assert(/["fixture\/fixture.html"]/.test(file.contents.toString()));
		cb();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/fixture/fixture.html',
		contents: new Buffer('<h1><%= test %></h1>')
	}));
});

it('should support supplying custom name in a callback', function (cb) {

	var stream = tpl(
	{
		name: function (file) {
			return 'custom';
		}
	});

	stream.on('data', function (file) {
		assert(/["JST"]["custom"]/.test(file.contents.toString()));
		cb();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/fixture/fixture.html',
		contents: new Buffer('<h1><%= test %></h1>')
	}));
});

it('should support supplying a custom namespace', function (cb) {

	var stream = tpl(
	{
		namespace: 'customNS',
	});

	stream.on('data', function (file) {
		assert(/window\["customNS"\]/.test(file.contents.toString()));
		cb();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/fixture/fixture.html',
		contents: new Buffer('<h1><%= test %></h1>')
	}));
});

it('should support dot paths in namespace', function (cb) {

	var stream = tpl(
	{
		namespace: 'custom.namespace'
	});

	stream.on('data', function (file) {
		assert(/window\["custom"\]\["namespace"\]/.test(file.contents.toString()));
		cb();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/fixture/fixture.html',
		contents: new Buffer('<h1><%= test %></h1>')
	}));
});