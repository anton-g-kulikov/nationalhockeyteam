// вызов необходимых модулей
var gulp = require('gulp');
  clean = require('gulp-clean');
  stylus = require('gulp-stylus');
  pug = require('gulp-pug');
  seq = require('run-sequence');
  watch = require('gulp-watch');
  browserSync = require('browser-sync');
  ghPages = require('gulp-gh-pages');

// конфиг путей
var config = {
    paths: {
        pug: {
            src:  ["./src/pug/**/*.pug", "!./src/pug/templates/*.pug"],
            dest: "./dist/"
        },
        stylus: {
          src:  ["./src/styl/**/*.styl", "!./src/styl/components/*.styl"],
          dest: "./dist/static/css/"
        },
        assets: {
          src:  ["./src/assets/**/*"],
          dest: "./dist/static/assets/"
        },
        addfiles: {
          src: ["./src/*", "!./src/assets", "!./src/pug", "!./src/styl"],
          dest: "./dist/"
        }
    }
}


// компиляция контента
gulp.task('pug', function() {
  gulp.src(config.paths.pug.src)
    .pipe(pug())
    .pipe(gulp.dest(config.paths.pug.dest))
});

gulp.task('stylus', function () {
  return gulp.src(config.paths.stylus.src)
    .pipe(stylus())
    .pipe(gulp.dest(config.paths.stylus.dest));
});

gulp.task('assets', function () {
  return gulp.src(config.paths.assets.src)
    .pipe(gulp.dest(config.paths.assets.dest));
});

gulp.task('addfiles', function () {
  return gulp.src(config.paths.addfiles.src)
    .pipe(gulp.dest(config.paths.addfiles.dest));
});



// базовые задачи: билд, очистка
gulp.task('default',function(){
    seq('clean',['pug','stylus','assets','addfiles']);
});

gulp.task('build', ['pug', 'stylus','assets','addfiles'], function(){});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// вотчеры и обновления браузера
gulp.task('watch', function () {
   gulp.watch(config.paths.pug.src, ['pug']);
   gulp.watch(config.paths.stylus.src, ['stylus']);
});


gulp.task('browser-sync', function () {
   var files = [
      'dist/**/*.html',
      'dist/css/**/*.css'
    ];

   browserSync.init(files, {
      open: false,
      server: {
         baseDir: './dist'
      }
   });
});

// основной таск — очистка, сборка, локальный сервер с автообновлением
gulp.task('serve',function(){
    seq(['default'],'browser-sync','watch');
});


// публикация на ГитХабПейджс
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('clean_deploy', function () {
    return gulp.src('.publish', {read: false})
        .pipe(clean());
});

gulp.task('ghPages',function(){
    seq('build','deploy',['clean_deploy']);
});
