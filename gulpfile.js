const gulp = require("gulp");
const browserify = require('browserify');
const fs = require('fs');

var paths = {
    client: 'client/src/main.js',
    clientScripts: ['client/src/**/*.js'],
    clientTarget: 'client/public/client.js',
};

let presets = ["es2015"];
if (process.env.NODE_ENV !== 'development') {
    presets.push("babili");
}

gulp.task('build', () => {
    return browserify(paths.client, {debug: process.env.NODE_ENV === 'development'})
        .transform('babelify', {presets: presets})
        .bundle()
        .pipe(fs.createWriteStream(paths.clientTarget));
})

gulp.task('watch', ['build'], () => {
    gulp.watch(paths.clientScripts, ['build']);
})

gulp.task('default', ['build']);
