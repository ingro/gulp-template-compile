# [gulp](https://github.com/wearefractal/gulp)-template-compile

> Compile [Lo-Dash templates](http://lodash.com/docs#template)

## Install

Install with [npm](https://npmjs.org/package/gulp-template)

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

The namespace in which the precompiled templates will be assigned.

#### options.templateSettings
Type: `Object`
Default: null

[Lo-Dash `_.template` options](http://lodash.com/docs#template).


## Notes

If you use [grunt](http://gruntjs.com) instead of gulp, but want to perform a similar task, use [grunt-contrib-jst](https://github.com/gruntjs/grunt-contrib-jst).


## License

MIT © Emanuele Ingrosso