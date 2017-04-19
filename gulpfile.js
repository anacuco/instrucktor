const gulp = require("gulp");
const browserify = require('browserify');
const fs = require('fs');

if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = 'production';
}

var paths = {
    client: 'client/src/main.js',
    clientScripts: ['client/src/**/*.js'],
    clientTarget: 'client/public/client.js',
};

let presets = ["es2016"];
let config = {debug: process.env.NODE_ENV === 'development'};
if (process.env.NODE_ENV === 'production') {
    presets.push("babili");
}

gulp.task('build', () => {
    return browserify(paths.client, config)
        .transform('babelify', {presets: presets})
        .bundle()
        .on('error', function (err) {
            console.log('\x1b[31mBuild error: %s\x1b[0m', err.message);
            this.emit('end');
        })
        .pipe(fs.createWriteStream(paths.clientTarget));
})

gulp.task('monitor-build', () => {
    let currentSize = fs.statSync(paths.clientTarget).size;

    gulp.watch(paths.clientTarget, (evt) => {
        if (evt.type === 'changed') {
            setTimeout(() => {
                let stat = fs.statSync(paths.clientTarget);
                // console.log('changed stat', stat);
                let size = stat.size;
                let change = Math.round(((stat.size / currentSize * 100) - 100) * 10) / 10;
                let date = new Date();
                let logMessage = `[${date}] build size: ${size}`;
                fs.appendFileSync(`monitor-build-${process.env.NODE_ENV}.log`, logMessage + '\r\n');
                currentSize = stat.size;
                console.log(`build size: ${Math.round((size / 1024) * 10) / 10} Kb - change: ${change}%`);
            }, 500); // size is empty on 'changed' :(
        }
    })
})

gulp.task('watch', ['monitor-build', 'build'], () => {
    gulp.watch(paths.clientScripts, ['build']);
})

gulp.task('default', ['build']);
