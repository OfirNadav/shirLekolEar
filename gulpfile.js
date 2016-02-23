
var gulp = require('gulp'),
 sass = require('gulp-sass'),
 connect = require('gulp-connect'),
 open = require('gulp-open'),
 autoprefixer = require('gulp-autoprefixer');

gulp.task('open', function(){
  gulp.src('./app/index.html')
  .pipe(open({uri: 'http://localhost:9000'}));
});

gulp.task('connectDev', function () {
  connect.server({
    root: ['./app'],
    port: 9000,
    livereload: true
  });
});


gulp.task('sass', function () {
  return gulp.src('./app/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./app/css'))
     .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src('./app/**/**/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/**/**/*.html'], ['html']);
  gulp.watch('./app/css/**/*.scss', ['sass']);
});


gulp.task('dev', ['connectDev', 'open','watch']);