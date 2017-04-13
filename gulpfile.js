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
        .on('error', function (err) {
            console.log('\x1b[31mBuild error: %s\x1b[0m', err.message);
            this.emit('end');
        })
        .pipe(fs.createWriteStream(paths.clientTarget));
})

gulp.task('watch', ['build'], () => {
    gulp.watch(paths.clientScripts, ['build']);
})

gulp.task('default', ['build']);
