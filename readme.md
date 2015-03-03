# [gulp](https://github.com/wearefractal/gulp)-template-compile

> Compile [Lo-Dash templates](http://lodash.com/docs#template) (should work with [Underscore templates](http://underscorejs.org/#template) too).

## Synopsis

This plugin is heavily inspired by [Sindre Sorhus](https://github.com/sindresorhus)'s [gulp-nunjucks](https://github.com/sindresorhus/gulp-nunjucks) plugin, in fact I used it as skeleton for creating this one.

## Install

Install with [npm](https://www.npmjs.org/package/gulp-template-compile)

```
npm install --save-dev gulp-template-compile
```

## Example

### `gulpfile.js`

```js
var gulp = require('gulp');
var template = require('gulp-template-compile');
var concat = require('gulp-concat');

gulp.task('default', function () {
	gulp.src('src/*.html')
		.pipe(template())
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('dist'));
});
```

## API

See the [Lo-Dash `_.template` docs](http://lodash.com/docs#template).


### template(options)

### options

Type: `Object`

#### options.name

Type: `Function`
Default: *Relative template path. Example: `templates/list.html`*

You can override the default behavior by supplying a function which gets the current [File](https://github.com/wearefractal/vinyl#constructoroptions) object and is expected to return the name.

Example:

```js
{
	name: function (file) {
		return 'tpl-' + file.relative;
	}
}
```

#### options.namespace
Type: `String`
Default: 'JST'

The namespace in which the precompiled templates will be assigned. Starting from version **1.0** you could also provide a dotted namespace that will be correctly handled, thanks to **fhawkes**. For example 'custom.namespace' will result in `window['custom']['namespace']`.

#### options.templateSettings
Type: `Object`
Default: null

[Lo-Dash `_.template` options](http://lodash.com/docs#template).

## Changelog

#### 1.0:
* **BREAKING**: Added support for custom dotted namespaces.

## Notes

If you use [grunt](http://gruntjs.com) instead of gulp, but want to perform a similar task, use [grunt-contrib-jst](https://github.com/gruntjs/grunt-contrib-jst).


## License

MIT © Emanuele Ingrosso
