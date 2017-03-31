/**
* Created by ana on 31/03/17.
*/

var game = {
    init: function () {
        game.layer = document.querySelector('#layer-0');
        game.currentOffset = game.layer.offsetLeft;
        game.truck = document.querySelector('#user1');

        game.bindKeyboard();
    },

    bindKeyboard: function () {
        window.addEventListener('keydown', function (evt) {
            switch(evt.keyCode) {
                case 40:
                console.log('down');
                break;
                case 37:
                console.log('left');
                break;
                case 39:
                console.log('right');
                break;
                case 38:
                console.log('up');
                break;
                case 32:
                console.log('space');
                break;
                default:
                console.log(evt.keyCode);
            }
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

        for (var i = chunkStart; i < chunkEnd; i += 50) {

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

    moveTruck: function (amount) {
        var newLeft = game.truck.offsetLeft + amount;
        game.truck.setAttribute('style', 'left: '+ newLeft + 'px');
    }
};

window.addEventListener('DOMContentLoaded', function () {
    game.init();
    game.placePosts();

    var gameLoop = setInterval(function () {
        game.scroll(-1);
        game.moveTruck(1);
    }, 25);
});
