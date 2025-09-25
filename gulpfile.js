const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const partial = require("gulp-html-partial");
const browserSync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const fs = require("fs-extra");
const path = require("path");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const plumber = require("gulp-plumber");
const webpack = require("webpack-stream");

// Modified error handler
function errorHandler(error) {
  console.error(error.message);
  this.emit("end");
}

function compileSCSS() {
  return gulp
    .src("src/scss/*.scss")
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
}

function processHTML() {
  return gulp
    .src(["src/templates/**/*.html", "!src/templates/components/**", "!src/templates/layout/**"])
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(
      partial({
        basePath: "src/templates/",
        tagName: "partial",
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
}

function minifyCSS() {
  return gulp
    .src("src/scss/*.scss")
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer({ overrideBrowserslist: ["last 2 versions"] })]))
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
}

function bundleJS() {
  const entries = {}; // Create an object to store dynamic entries

  // Read all JS files in src/js and subdirectories
  fs.readdirSync("src/js").forEach((file) => {
    if (path.extname(file) === ".js") {
      const name = path.basename(file, ".js"); // Get file name without extension
      entries[name] = `./src/js/${file}`; // Add to entries
    }
  });

  return gulp
    .src("src/js/**/*.js")
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(
      webpack({
        mode: "production",
        entry: entries, // Dynamic entries for all JS files
        output: {
          filename: "[name].js", // Each file will be output separately
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
}

function concatVendorJS() {
  return gulp
    .src("src/js/vendors/*.js")
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(concat("core.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/vendors"))
    .pipe(browserSync.stream());
}

function copyImages() {
  return gulp
    .src("src/images/**/*", { encoding: false })
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(gulp.dest("dist/images"))
    .pipe(browserSync.stream());
}

function copyFonts() {
  return gulp
    .src("src/fonts/**/*", { encoding: false })
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(gulp.dest("dist/fonts"))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    open: true, //
  });

  gulp.watch("src/scss/**/*.scss", gulp.series(compileSCSS, minifyCSS));
  gulp.watch("src/templates/**/*.html", gulp.series(processHTML));
  gulp.watch("src/js/**/*.js", gulp.series(bundleJS, concatVendorJS));
  gulp.watch("src/js/components/**/*.js", bundleJS);
  gulp
    .watch("src/images/**/*")
    .on("change", browserSync.reload)
    .on("add", copyImages)
    .on("unlink", function (filepath) {
      const filePathFromSrc = path.relative(path.resolve("src/images"), filepath);
      const destFilePath = path.resolve("dist/images", filePathFromSrc);
      fs.unlink(destFilePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return;
        }
        console.log("File deleted successfully:", destFilePath);
      });
    });

  gulp
    .watch("src/fonts/**/*", copyFonts)
    .on("change", browserSync.reload)
    .on("add", copyFonts)
    .on("unlink", function (filepath) {
      const filePathFromSrc = path.relative(path.resolve("src/fonts"), filepath);
      const destFilePath = path.resolve("dist/fonts", filePathFromSrc);
      fs.unlink(destFilePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return;
        }
        console.log("File deleted successfully:", destFilePath);
      });
    });

  console.log("Watching for changes...");
}

exports.build = gulp.series(
  gulp.parallel(compileSCSS, processHTML, copyImages, copyFonts),
  gulp.parallel(minifyCSS, bundleJS, concatVendorJS)
);

exports.watch = gulp.series(exports.build, watch);
exports.default = gulp.series(exports.build, exports.watch);
