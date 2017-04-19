const UserInterface = require('./UserInterface');
const Truck = require('./Truck');
const Keyboard = require('./Keyboard');
const Layer = require('./Layer');
const templates = require('./Templates');

var game = {
    move: false,
    layer: null,
    currentOffset: null,
    viewportWidth: null,
    viewPortPadding: 100,

    init: function () {
        templates.load(document.querySelector('#templates'));

        let layer0 = document.querySelector('#layer-0');
        game.layer = new Layer(layer0);

        // TODO: add truck to layer0
        let truckEl = document.querySelector('#user1');
        game.truck = new Truck(truckEl);

        let uiContainer = document.querySelector('#layer-ui');
        game.ui = new UserInterface(uiContainer, this); // this = stateContainer atm

        Keyboard.bind(window);
        Keyboard.game = this;
        // TODO: add controls layer, keyboard (other other inputs) dispatch methods there

        // TODO: viewport mgmt
        game.viewportWidth = window.innerWidth;
        game.currentOffset = game.layer.currentOffset;
        game.bindResize();
    },

    bindResize: function () {
        window.addEventListener('resize', function (evt) {
            game.viewportWidth = window.innerWidth;

            // TODO: if truck is outside bounds, move world (debounced)

            console.log(game.viewportWidth);
        });
    },

    scroll: function (amount) {
        game.layer.scroll(amount);
        game.currentOffset = game.layer.currentOffset;
    },

    afStep: function (timestamp) {
        // console.log('frametime:', timestamp - game.afTs);
        game.afTs = timestamp;

        // console.log(game.afTs);
        game.ui.render(timestamp);

        // TODO: assume update
        if (game.move === true) {
            game.truck.move(game.truck.direction * game.truck.speed);

            // console.log(game.truck.currentOffset, -game.currentOffset);

            // TODO: x-based
            if (
                game.truck.currentOffset < (-game.currentOffset + game.viewPortPadding)
                || game.truck.currentOffset + game.truck.width > ((-game.currentOffset) + game.viewportWidth - game.viewPortPadding)
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
