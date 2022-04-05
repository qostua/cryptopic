// process.env.DISABLE_NOTIFIER = true;

const {src, dest, parallel, series, watch} = require('gulp');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

const htmlmin = require('gulp-htmlmin');
const webpHtml = require('gulp-webp-html-fix');
const retinaHtml = require('gulp-img-retina');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const tinypng = require('gulp-tinypng-compress');
const webp = require('gulp-webp');
const responsive = require('gulp-responsive');
const newer = require('gulp-newer');

const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

const scripts = () => {
	return src([
		'src/js/main.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('app.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(dest('src/js/'))
	.pipe(browserSync.stream())
}
const scriptsLibs = () => {
	return src([
		'src/js/libs.js',
	])
	.pipe(sourcemaps.init())
	.pipe(concat('app-libs.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(dest('src/js/'))
	.pipe(browserSync.stream())
}
const scriptsModernizr = () => {
	return src([
		'libs/modernizr-webp.js',
	])
	.pipe(concat('app-modernizr.js'))
	.pipe(dest('src/js/'))
}
const htmlPicture = () => {
	return src('src/*.html')
	.pipe(retinaHtml({
		suffix: {1: '', 2: '@2x'}
	}))
	.pipe(webpHtml())
	.pipe(dest('src/'))
}
const styles = () => {
  return src('src/scss/main.scss')
    .pipe(sourcemaps.init())
		.pipe(sassGlob())
    .pipe(sass({ outputStyle: 'expanded' })
		.on('error', notify.onError()))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('src/css/'))
    .pipe(browserSync.stream());
}
const svg = () => {
	return src('src/img/src/*.svg')
		.pipe(newer('src/img/'))
		.pipe(dest('src/img/'));
}
const sprite = () => {
	return src('src/img/sprite/*.svg')
		.pipe(svgSprite({ mode: { stack: { sprite: "../sprite.svg" } } }))
		.pipe(dest('src/img/'));
}
const retina = () => {
	src('src/img/src/**.jpg')
		.pipe(newer('src/img/'))
		.pipe(responsive({
			'*.*': {
				width: '50%',
				quality: 100
			}
		})
		.on('error', notify.onError()))
		.pipe(dest('src/img/'));

	src('src/img/src/**.png')
		.pipe(newer('src/img/'))
		.pipe(responsive({
			'*.*': {
				width: '50%',
				quality: 100
			}
		})
		.on('error', notify.onError()))
		.pipe(dest('src/img/'));

	src('src/img/src/**.jpg')
		.pipe(newer({dest: 'src/img/', ext: '@2x.jpg'}))
		.pipe(rename({ suffix: '@2x' }))
		.pipe(dest('src/img/'));

	return src('src/img/src/**.png')
		.pipe(newer({dest: 'src/img/', ext: '@2x.png'}))
		.pipe(rename({ suffix: '@2x' }))
		.pipe(dest('src/img/'));
}
const convertWebp = () => {
	src('src/img/src/**.{jpg,png}')
		.pipe(newer({dest: 'src/img/', ext: '.webp'}))
		.pipe(responsive({
			'*.*': {
				width: '50%',
				format: 'webp',
				quality: 100
			}
		})
		.on('error', notify.onError()))
		.pipe(dest('src/img/'));

	return src('src/img/src/**.{jpg,png}')
		.pipe(newer({dest: 'src/img/', ext: '@2x.webp'}))
		.pipe(rename({ suffix: '@2x' }))
		.pipe(responsive({
			'*.*': {
				format: 'webp',
				quality: 100
			}
		})
		.on('error', notify.onError()))
		.pipe(dest('src/img/'));
}
const fonts = () => {
  src('src/fonts/src/*.ttf')
		.pipe(newer({dest: 'src/fonts/', ext: '.woff'}))
		.pipe(ttf2woff())
		.pipe(dest('src/fonts'))
	return src('src/fonts/src/*.ttf')
		.pipe(newer({dest: 'src/fonts/', ext: '.woff2'}))
		.pipe(ttf2woff2())
		.pipe(dest('src/fonts/'))
}
const watchFiles = () => {
  browserSync.init({
        server: { baseDir: "./src" },
        cors: true,
        notify: false,
        ui: false,
    });
    watch('src/*.html').on('change', browserSync.reload);
		watch('src/scss/**/*.scss', styles);
		watch('src/img/src/*.{jpg,png}', series(retina, convertWebp));
		watch('src/img/src/*.svg', svg);
    watch('src/img/sprite/*.svg', sprite);
		watch('src/fonts/src/*.{ttf,woff,woff2}', fonts);
		watch(['src/**/*.js', '!src/**/app*.*'], scripts);
		watch(['libs/**/*.js'], scriptsLibs);
}

const cleanSrc = () => {
	return del(['src/css/*.*', 'src/fonts/*.*', 'src/img/*.*', 'src/js/*.map', 'src/js/app*.js'])
}

exports.default = parallel(htmlPicture, styles, svg, sprite, retina, convertWebp, scripts, scriptsLibs, scriptsModernizr, fonts, watchFiles);
exports.htmlPicture = htmlPicture;
exports.cleanSrc = cleanSrc;

const htmlBuild = () => {
	return src('src/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest('build'))
}
const stylesBuild = () => {
  return src('./src/css/main.css')
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest('build/css/'));
}
const svgBuild = () => {
	return src('src/img/*.svg')
		.pipe(imagemin([
			imagemin.svgo()
		]))
		.pipe(dest('build/img'));
}
const retinaBuild = () => {
	src('src/img/src/**.jpg')
		.pipe(responsive({
			'*.*': {
				width: '50%',
				quality: 100
			}
		}))
		.pipe(imagemin([
			imagemin.mozjpeg({quality: 75, progressive: true})
		]))
		.pipe(dest('build/img/'));

	src('src/img/src/**.png')
		.pipe(responsive({
			'*.*': {
				width: '50%',
				quality: 100
			}
		}))
		.pipe(tinypng({
            key: 'zMFJ4xYS9nzpH6qxDkvGdDLJjZSCGFtz',
            log: true
    }))
		.pipe(dest('build/img/'));

	src('src/img/src/**.jpg')
		.pipe(rename({ suffix: '@2x' }))
		.pipe(imagemin([
			imagemin.mozjpeg({quality: 75, progressive: true})
		]))
		.pipe(dest('build/img/'));

	return src('src/img/src/**.png')
		.pipe(rename({ suffix: '@2x' }))
		.pipe(tinypng({
            key: 'zMFJ4xYS9nzpH6qxDkvGdDLJjZSCGFtz',
            log: true
    }))
		.pipe(dest('build/img/'));
}
const convertWebpBuild = () => {
	src('src/img/src/**.{jpg,png}')
		.pipe(responsive({
			'*.*': {
				width: '50%',
				format: 'webp',
				quality: 75
			}
		}))
		.pipe(dest('build/img/'));

	return src('src/img/src/**.{jpg,png}')
		.pipe(rename({ suffix: '@2x' }))
		.pipe(responsive({
			'*.*': {
				format: 'webp',
				quality: 75
			}
		}))
		.pipe(dest('build/img/'));
}
const fontsBuild = () => {
	return src('src/fonts/*.{woff,woff2}')
	.pipe(dest('build/fonts'))
}
const resourcesBuild = () => {
  return src('src/resources/**/*')
    .pipe(dest('build/resources'))
}
const scriptsBuild = () => {
	return src('src/js/app.js')
	.pipe(uglify())
	.pipe(dest('build/js/'))
}
const scriptsLibsBuild = () => {
	return src('src/js/app-libs.js')
	.pipe(uglify())
	.pipe(dest('build/js/'))
}
const scriptsModernizrBuild = () => {
	return src('src/js/app-modernizr.js')
	.pipe(uglify())
	.pipe(dest('build/js/'))
}

const cleanBuild = () => {
	return del('build/*')
}

exports.build = series(cleanBuild, parallel(htmlBuild, stylesBuild, svgBuild, retinaBuild, convertWebpBuild, scriptsBuild, scriptsLibsBuild, scriptsModernizrBuild, resourcesBuild, fontsBuild));
exports.cleanBuild = cleanBuild;
