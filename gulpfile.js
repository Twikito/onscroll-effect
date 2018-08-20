const
	gulp = require('gulp'),
	header = require('gulp-header'),
	rename = require("gulp-rename"),
	terser = require('gulp-terser'),
	babel = require('gulp-babel'),
	pkg = require('./package.json'),
	now = new Date();

const
	shortBanner = `/*! <%= pkg.name %> v<%= pkg.version %> | (c) ${now.getFullYear()} <%= pkg.author %> | <%= pkg.license %> license | <%= pkg.homepage %> */`+'\n',
	longBanner = `/**
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
`+'\n';


gulp.task('es6', () => gulp.src('src/index.js')
	.pipe( header(longBanner, { pkg : pkg }) )
	.pipe( rename('onscroll-effect.es6.js') )
	.pipe( gulp.dest('dist') )
	.pipe( terser() )
);

gulp.task('es6:min', () => gulp.src('src/index.js')
	.pipe( terser() )
	.pipe( header(shortBanner, { pkg : pkg }) )
	.pipe( rename('onscroll-effect.es6.min.js') )
	.pipe( gulp.dest('dist') )
);

gulp.task('es5', () => gulp.src('src/index.js')
	.pipe( babel({ presets: ['env'] }) )
	.pipe( header(longBanner, { pkg : pkg }) )
	.pipe( rename('onscroll-effect.js') )
	.pipe( gulp.dest('dist') )
	.pipe( terser() )
);

gulp.task('es5:min', () => gulp.src('src/index.js')
	.pipe( babel({ presets: ['env'] }) )
	.pipe( terser() )
	.pipe( header(shortBanner, { pkg : pkg }) )
	.pipe( rename('onscroll-effect.min.js') )
	.pipe( gulp.dest('dist') )
);

gulp.task('default', ['es6', 'es6:min', 'es5', 'es5:min']);
