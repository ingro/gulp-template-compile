'use strict';
var gutil = require('gulp-util');
var through = require('through');
var tpl = require('lodash.template');

module.exports = function (options) {
	options = options || {};

	return through(function (file) {
		var name = typeof options.name === 'function' && options.name(file) || file.relative;
		var namespace = options.namespace || 'JST';
		var NSwrapper = '(function() {(window["'+ namespace +'"] = window["'+ namespace +'"] || {})["'+ name.replace(/\\/g, '/') +'"] = ';
		var compiled = tpl(file.contents.toString(), false, options.templateSettings).source;

		file.contents = new Buffer(NSwrapper + compiled + '})();');
		file.path = gutil.replaceExtension(file.path, '.js');

		this.emit('data', file);
	});
};