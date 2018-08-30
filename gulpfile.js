const
	gulp = require('gulp'),
	header = require('gulp-header'),
	rename = require("gulp-rename"),
	terser = require('gulp-terser'),
	babel = require('gulp-babel'),
	gutil = require('gulp-util'),
	pkg = require('./package.json'),
	now = new Date();

const banner = {
	long: `/**
 * -------------------------------------------------------------------
 * <%= pkg.name %>
 * <%= pkg.description %>
 *
 * @author <%= pkg.author %>
 * @version v<%= pkg.version %>
 * @link <%= pkg.homepage %>
 * @license <%= pkg.license %>
 * -------------------------------------------------------------------
 */
`+'\n',
	short: `/*! <%= pkg.name %> v<%= pkg.version %> | (c) ${now.getFullYear()} <%= pkg.author %> | <%= pkg.license %> license | <%= pkg.homepage %> */`+'\n',
};

const getBanner = (type = 'long') => ({
	value: banner[type], options: { pkg }
});
const getName = (isMin = false, type = '') => {
	return [
		'onscroll-effect',
		type,
		isMin ? 'min' : '',
		'js'
	]
		.filter(Boolean)
		.join('.');
};

const runIf = (condition, task, ...opt) => (condition ? task : gutil.noop)(...opt);

const tasks = [], list = [
	{
		name: 'es6',
		head: getBanner(),
		file: getName(false, 'es6')
	},
	{
		name: 'es6:min',
		head: getBanner('short'),
		file: getName(true, 'es6')
	},
	{
		name: 'es5',
		head: getBanner(),
		file: getName()
	},
	{
		name: 'es5:min',
		head: getBanner('short'),
		file: getName(true)
	}
].forEach(({ name, head, file }) => {
	tasks.push(name);
	gulp.task(name, () => {
		return gulp.src('src/index.js')
			.pipe( rename(file) )
			.pipe( runIf(name.includes('es5'), babel, { presets: ['env'] }) )
			.pipe( runIf(name.includes('min'), terser) )
			.pipe( header(head.value, head.options) )
			.pipe( gulp.dest('dist') );
	});
});

gulp.task('default', tasks);
