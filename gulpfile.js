const { watch, src, dest } = require('gulp');
const browserSync = require("browser-sync");
const cache = require("gulp-cached"); // 캐시에 저장된 파일과 비교 후 내용이 변견된 파일만 통과
const sourceMaps = require("gulp-sourcemaps");
const gulpSass = require('gulp-sass')(require('sass'));
const include = require("gulp-file-include");

// watch file list
const watcher = {}
let PATH = null;

function getPath(value){
  return new Promise((resolve) => {
    resolve({
      input: 'src/',
      output: 'dist/',
    })
  })
}

function server() {
  browserSync.init({
    directory: true,
    open: true,
    server: {
      baseDir: "./",
    },
    port: 85,
  });
}

console.log('__dirname',__dirname)
console.log('split', __dirname.split("com2us")[0]);
console.log('place', __dirname.split("com2us")[0].replace(/\\/g, "/"));
let dir = __dirname.split("com2us")[0].replace(/\\/g, "/");
function html(){
  return new Promise((resolve, reject) => {
    try {
      watcher["html"] = [
        PATH.input + "*.html/",
        PATH.input + "**/*.html"
      ];
      watcher["html"].push("!" + PATH.input + "include/*.html/");
      watcher["html"].push("!" + PATH.input + "**/include/*.html");

      src(watcher.html)
        .on("error", function(err){
          console.log(err.toString());
        })
        .pipe(include({
          context: {
            
            SRC: `${dir}com2us/docs/src/`
          },
          prefix: "@@",
          basepath: "@file",
          
        }))
        .pipe(cache("html"))
        .pipe(dest(PATH.output))
        .pipe(browserSync.reload({ stream: true }));
      resolve();
    } catch(e){
      reject(e);
    }
  })
}

// function js(){
//   return new Promise((resolve, reject) => {
//     try {
//       watcher["js"] = [PATH.input + "js/*"];
//       src(watcher["js"])
//         // .pipe(sourceMaps.init())
//         .on("error", function(err){
//           console.log(err)
//         })
//         // .pipe(sourceMaps.write("./"))
//         .pipe(dest(PATH.output + "js"));
//       resolve();
//     } catch(e) {
//       reject(e);
//     }
//   })
// }

function scss(){
  return new Promise((resolve, reject) => {
    try {
      watcher["scss"] = [PATH.input + "scss/*.scss", PATH.input + "scss/**/*.scss"];
      src(watcher["scss"])
        // .pipe(sourceMaps.init())
        .pipe(
          gulpSass({
            sourceComments: true,
            outputStyle: "compressed",
          })
        )
        .on("error", function(err){
          console.log(err)
        })
        // .pipe(sourceMaps.write("./"))
        .pipe(dest(PATH.output + "css/"));
      resolve();
    } catch(e) {
      reject(e);
    }
  })
}

async function com2us(){
  PATH = await getPath();
  // await js();
  await scss();
  await html();
  // watch(watcher["js"], js);
  watch(watcher["scss"], scss);
  watch(watcher["html"], html);
  server();
}

exports.com2us = com2us;