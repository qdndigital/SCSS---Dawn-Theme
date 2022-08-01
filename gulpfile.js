const { dest, series, src, parallel, watch } = require("gulp");
const concat = require("gulp-concat");
const jshint = require("gulp-jshint");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const minify = require("gulp-minify");
const cleancss = require("gulp-clean-css");
const browserSync = require('browser-sync').create();
const babel = require("gulp-babel");

function scss() {
  return src("./src/scss/**/*.scss")
    .pipe(plumber())
    .pipe(rename(function (path) { 
      if (path.basename.startsWith('_')) {
        // remove _*.scss
        path.basename = path.basename.slice(1);
         // add prefix (parent folder + file name .scss)
        path.basename = path.dirname + "-" + path.basename
      }
      // dirname
      path.dirname = './'
    }))
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./assets"))
    .pipe(browserSync.stream());
}

function minifyCss() {
  return src("./assets/*.css")
    .pipe(cleancss({ compatibility: "ie8" }))
    .pipe(dest("./assets"));
}


function initBrowserSync() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });

  const reload = browserSync.reload;
  watch("./src/**/*.scss", scss).on('change', reload);
}

//==== Define complex task ======
//const js = series(compileJs);
const css = series(scss, minifyCss);

// Watch files with browserSync
const watchBrowser = series(
  parallel(css),
  initBrowserSync,
);

// Export file
exports.watchBrowser = watchBrowser;
//exports.js = js;
exports.css = css;
exports.default = css;