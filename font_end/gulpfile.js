const gulp = require('gulp');
const jade = require('gulp-jade');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const util = require('gulp-util');
const sass = require('gulp-ruby-sass');
const minifycss = require('gulp-minify-css');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
	// gulp-inject和wiredep   

const Version = '1.0.0';
const buildDate = util.date(  Date.now(), 'isoDate') + " " + util.date(Date.now() , 'isoTime');
const banner = ['/*\n * Version: ', Version, '\n * Author: xioYown \n * Updated: ', buildDate, '\n*/\n'].join('');

const debug = true;

const path = {
	jade: './src/views',
	js: './src/assets/js',
	sass: './src/assets/sass',
	css: './src/assets/css',
	images: './src/assets/images'
};
const dist = {
	static: '../static/vendor',
	views: 	'../views'
};

const config = {
	min: debug ? '' : '.min',
	description: 'blog',
	keywords: 'xioYown blog node koa web'
};
gulp.task('jade', function () {
	gulp.src(path.jade + '/*.jade')
	.pipe(jade({
		locals: {
			config: config,
			stamp: '?v=' + new Date().valueOf()
		},
		pretty: false
	}))
	.pipe(gulp.dest(dist.views))
	.pipe(connect.reload () )
});

gulp.task('sass', function () {
	sass([path.sass + '/*.scss'])
	.pipe(autoprefixer({
		browsers: ['last 40 versions', 'safari 5', 'opera 12.1', 'ios 6', 'android 4']
	}))
	.pipe(gulp.dest( dist.static + '/css'))
	.pipe(connect.reload())
});

gulp.task('minSass', function () {
	sass([path.sass + '/*.scss'], {
		style: 'compressed'
	})
	.pipe(autoprefixer({
		browsers: ['last 40 versions', 'safari 5', 'opera 12.1', 'ios 6', 'android 4']
	}))
	.pipe(gulp.dest( dist.static + '/css'))
	.pipe(connect.reload())
});

gulp.task('js', function () {
	gulp.src(path.js + '/*.js')
	.pipe(header(banner))
	.pipe(gulp.dest(dist.static + '/js'))
	.pipe(connect.reload())
});

gulp.task('minJs', function () {
	gulp.src(path.js + '/*.js')
	.pipe(uglify())
	.pipe(header(banner))
	// .pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest( dist.static + '/js' ))
	.pipe(connect.reload())
});

gulp.task('images', function () {
	gulp.src(path.images + '/*.*')
	.pipe(gulp.dest(dist.static + '/images'))
});
/* 热启配置 */
gulp.task('connect', function () {
	 connect.server({
		host: '127.0.0.1',
		port: 2020,
		livereload: true
	 });
 });

gulp.task('default', function(){
	gulp.watch([path.jade + '/*.jade'], ['jade']);
	gulp.watch([path.js + '/base/*.js'], ['base']);
	gulp.watch([path.js + '/*.js'], 	  ['js']);
	gulp.watch([path.sass + '/mixin/*.scss', path.sass + '/*.scss'], ['sass']);
});
// 热启动
gulp.task('hot', ['connect','default']);
// 打包任务
gulp.task('all', ['sass', 'js', 'images']);
// min任务
gulp.task('min', ['minSass', 'minJs', 'images']);
