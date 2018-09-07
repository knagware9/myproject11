'use strict';
const path = require('path'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	wait = require('gulp-wait2'),
	sourcemaps = require('gulp-sourcemaps'),
	iconfont = require('gulp-iconfont');

const paths = {};
paths.jssrc = './src/js/';
paths.imgrc = './src/images/';
paths.fonticonSrc = './src/fonticon/';
paths.templates = './src/templates/';
paths.scssSrc = './src/assets/scss/';
paths.svgFontSrc = './src/assets/icons';
paths.build = './dist/';
paths.assets = './src/assets';




//scss/sass
gulp.task('sass', () => {
	gulp
		.src(path.join(paths.scssSrc, '*.scss'))
		.pipe(wait(200))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(path.join(paths.assets, 'css')));
});

//scss/sass watch
gulp.task('sass:watch', () => {
	gulp.watch(path.join(paths.scssSrc, '**/*.scss'), ['sass']);
});

//svg to icon font
gulp.task('iconfont', () => {
	let runTimestamp = Math.round(Date.now() / 1000);

	gulp.src(path.join(paths.svgFontSrc, '*.svg'))
		.pipe(iconfont({
			fontName: 'fonticon',
			normalize: true,
			fontHeight: 1001,
			prependUnicode: true, // recommended option
			formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'], // default, 'woff2' and 'svg' are available
			timestamp: runTimestamp, // recommended to get consistent builds when watching files
		}))
		.on('glyphs', function (glyphs, options) {
			console.log(glyphs, options);
		})
		.pipe(gulp.dest(path.join(paths.assets, 'fonts')));
})



gulp.task('default', ['sass:watch']);