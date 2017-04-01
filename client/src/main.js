/**
* Created by ana on 31/03/17.
*/

var game = {
    init: function () {
        game.layer = document.querySelector('#layer-0');
        game.currentOffset = game.layer.offsetLeft;
        game.truck = document.querySelector('#user1');
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
                    break;
                default:
                    console.log(evt.keyCode);
            }
        });

        window.addEventListener('keyup', function (evt) {
            game.move = false;
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

            post.setAttribute('style', 'left: ' + i + 'px');

            game.layer.appendChild(post);
        }
    },

    layer: null,
    currentOffset: null,

    scroll: function (amount) {
        var newOffset = game.currentOffset + amount;
        game.layer.setAttribute('style', 'left: ' + newOffset + 'px');
        game.currentOffset = newOffset;
    },

    truck: null,
    truckOffset: null,

    viewPortPadding: 100,

    moveTruck: function (amount) {
        var newLeft = game.truck.offsetLeft + amount;
        game.truckOffset = newLeft;
        game.truck.setAttribute('style', 'left: '+ newLeft + 'px');
    }
};

window.addEventListener('DOMContentLoaded', function () {
    game.init();
    game.placePosts();

    var gameLoop = setInterval(function () {

        if (game.move === true) {
            game.scroll(-game.direction);
            game.moveTruck(game.direction);
        }
    }, 25); // 40fps
});
