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

gulp.task('monitor-build', () => {
    let currentSize = fs.statSync(paths.clientTarget).size;

    gulp.watch(paths.clientTarget, (evt) => {
        if (evt.type === 'changed') {
            setTimeout(() => {
                let stat = fs.statSync(paths.clientTarget);
                // console.log('changed stat', stat);
                let size = Math.round(stat.size / 1024);
                let change = Math.round(((stat.size / currentSize * 100) - 100) * 10) / 10;
                let date = new Date();
                let message = `[${date}] build size: ${size} Kb - change: ${change}%`;

                fs.appendFileSync('monitor-build.log', message + '\r\n');
                currentSize = stat.size;
                console.log(message);
            }, 500); // size is empty on 'changed' :(
        }
    })
})

gulp.task('watch', ['monitor-build', 'build'], () => {
    gulp.watch(paths.clientScripts, ['build']);
})

gulp.task('default', ['build']);
