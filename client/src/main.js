const UserInterface = require('./UserInterface');
const Truck = require('./Truck');
const Keyboard = require('./Keyboard');

var game = {
    move: false,
    layer: null,
    currentOffset: null,
    viewportWidth: null,
    viewPortPadding: 100,

    init: function () {
        game.layer = document.querySelector('#layer-0');
        game.currentOffset = game.layer.offsetLeft;

        let truckEl = document.querySelector('#user1');
        game.truck = new Truck(truckEl);

        game.viewportWidth = window.innerWidth;

        game.placePosts();
        Keyboard.bind(window);
        Keyboard.game = this;
        // TODO: add controls layer, keyboard (other other inputs) call methods there

        game.bindResize();

        let uiContainer = document.querySelector('#layer-ui');
        game.ui = new UserInterface(uiContainer, this); // this = stateContainer atm
    },

    bindResize: function () {
        window.addEventListener('resize', function (evt) {
            game.viewportWidth = window.innerWidth;

            // TODO: if truck is outside bounds, move world

            console.log(game.viewportWidth);
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
            post.style.left = i + 'px';
            game.layer.appendChild(post);
        }
    },

    scroll: function (amount) {
        var newOffset = game.currentOffset + amount;
        game.layer.style.left = newOffset + 'px';
        game.currentOffset = newOffset;
    },

    afStep: function (timestamp) {
        // console.log('frametime:', timestamp - game.afTs);
        game.afTs = timestamp;

        // console.log(game.afTs);
        game.ui.render(timestamp);

        // TODO: assume update
        if (game.move === true) {
            game.truck.move(game.truck.direction * game.truck.speed);

            if (
                game.truck.truckOffset < (-game.currentOffset + game.viewPortPadding)
                || game.truck.truckOffset + game.truck.truckLength > ((-game.currentOffset) + game.viewportWidth - game.viewPortPadding)
            ) {
                game.scroll(-game.truck.direction * game.truck.speed);
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
    afTs: null,

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
    game.start();

    // TODO:
    // animation start time
    // move object to target position per time interval, relative to speed
    // controls set object target position, relative to speed
    // suspend / resume animations
    // suspend / resume game updates
});
