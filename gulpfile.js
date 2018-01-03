var gulp = require('gulp'),
    del = require('del'),
    merge = require('merge-stream'),

    tsc = require('gulp-typescript'),
    tsProject = tsc.createProject('tsconfig.json'),
    SystemBuilder = require('systemjs-builder'),
    jsMinify = require('gulp-uglify'),

    mocha = require('gulp-mocha'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),

    scssLint = require('gulp-scss-lint'),
    sass = require('gulp-sass'),
    cssPrefixer = require('gulp-autoprefixer'),
    cssMinify = require('gulp-cssnano');

gulp.task('clean', () => {
    return del('dist');
});

gulp.task('shims', () => {
    return gulp.src([
            'node_modules/core-js/client/shim.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/reflect-metadata/Reflect.js'
        ])
        .pipe(concat('shims.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('system-build', [ 'tsc' ], () => {
    var builder = new SystemBuilder();

    return builder.loadConfig('system.config.js')
        .then(() => builder.buildStatic('app', 'dist/js/bundle.js', {
            production: false,
            rollup: false
        }))
        .then(() => del('build'));
});

gulp.task('tsc', () => {
    del('build');

    return gulp.src('src/app/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('build/'));
});

gulp.task('html', () => {
    return gulp.src('src/**/**.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', () => {
    return gulp.src('src/images/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('minify', () => {
    var js = gulp.src('dist/js/bundle.js')
        .pipe(jsMinify())
        .pipe(gulp.dest('dist/js/'));

    var css = gulp.src('dist/css/styles.css')
        .pipe(cssMinify())
        .pipe(gulp.dest('dist/css/'));

    return merge(js, css);
});


gulp.task('scss', () => {
    return gulp.src('src/scss/main.scss')
        .pipe(sass({
            precision: 10,
            includePaths: 'node_modules/node-normalize-scss'
        }))
        .pipe(concat('styles.css'))
        .pipe(cssPrefixer())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('default', [
    'shims',
    'scss',
    'system-build',
    'html',
    'images'
]);

