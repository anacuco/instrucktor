/**
* Created by ana on 31/03/17.
*/

var game = {
    init: function () {
        game.layer = document.querySelector('#layer-0');
        game.currentOffset = game.layer.offsetLeft;
        game.truck = document.querySelector('#user1');
        game.truckLength = game.truck.offsetWidth;
        game.truckOffset = game.truck.offsetLeft;

        game.viewportWidth = window.innerWidth;

        game.bindKeyboard();
        game.bindResize();
    },

    direction: 1,
    move: false,
    viewportWidth: null,

    bindResize: function () {
        window.addEventListener('resize', function (evt) {
            game.viewportWidth = window.innerWidth;

            console.log(game.viewportWidth);
        });
    },

    bindKeyboard: function () {
        window.addEventListener('keydown', function (evt) {
            switch(evt.keyCode) {
                case 40:
                    console.log('down');
                    break;
                case 37:
                    // console.log('left');
                    game.direction = -1;
                    game.move = true;
                    game.truck.querySelector('svg').setAttribute('style', 'transform: scaleX(-1); transition: .1s');
                    break;
                case 39:
                    // console.log('right');
                    game.direction = 1;
                    game.move = true;
                    game.truck.querySelector('svg').setAttribute('style', 'transform: scaleX(1); transition: .1s');
                    break;
                case 38:
                    console.log('up');
                    break;
                case 32:
                    // console.log('space');
                    if (game.gameLoop !== null) {
                        game.stop();
                    } else {
                        game.start();
                    }
                    break;
                default:
                    console.log(evt.keyCode);
            }
        });

        window.addEventListener('keyup', function (evt) {
            // game.move = false;
        });
    },

    placePosts: function() {
        var postTemplate = document.querySelector('#templates .post');
        var length = game.layer.offsetWidth;
        var offset = game.layer.offsetLeft;

        var chunkEnd = length + offset + 4000;
        var chunkStart = length + offset;

        // var chunkEnd = length;
        // var chunkStart = 0;

        for (var i = chunkStart; i < chunkEnd; i += 200) {

            var post = postTemplate.cloneNode();

            // post.setAttribute('style', 'left: ' + i + 'px');
            post.style.left = i + 'px';

            game.layer.appendChild(post);
        }
    },

    layer: null,
    currentOffset: null,

    scroll: function (amount) {
        var newOffset = game.currentOffset + amount;
        // game.layer.setAttribute('style', 'left: ' + newOffset + 'px');
        game.layer.style.left = newOffset + 'px';
        game.currentOffset = newOffset;
    },

    truck: null,
    truckOffset: null,

    viewPortPadding: 100,

    moveTruck: function (amount) {
        var newLeft = game.truck.offsetLeft + amount;
        game.truckOffset = newLeft;
        // game.truck.setAttribute('style', 'left: '+ newLeft + 'px');
        game.truck.style.left = newLeft + 'px';
    },

    speed: 5,
    truckLength: 0,

    afStep: function (timestamp) {

        // TODO: assume update
        if (game.move === true) {

            game.moveTruck(game.direction * game.speed);

            if (
                game.truckOffset < (-game.currentOffset + game.viewPortPadding)
                || game.truckOffset + game.truckLength > ((-game.currentOffset) + game.viewportWidth - game.viewPortPadding)
            ) {
                game.scroll(-game.direction * game.speed);
            }
        }

        game.afCallback = window.requestAnimationFrame(game.afStep);
    },

    update: function () {
        // game update
        // console.log('update');
    },

    gameLoopInterval: 20, // 50fps
    gameLoop: null,
    afCallback: null,

    start: function () {
        window.cancelAnimationFrame(game.afCallback);
        clearInterval(game.gameLoop);

        game.gameLoop = setInterval(game.update, game.gameLoopInterval);
        game.afCallback = window.requestAnimationFrame(game.afStep);
    },

    stop: function () {
        window.cancelAnimationFrame(game.afCallback);
        clearInterval(game.gameLoop);

        game.afCallback = null;
        game.gameLoop = null;
    }
};

window.addEventListener('DOMContentLoaded', function () {
    game.init();
    game.placePosts();

    game.start();

    // animation start time
    // object target position change per time interval
    // set object position to amount of position change per interval relative to animation time passed
    // suspend / resume animations
    // suspend / resume game updates
});
