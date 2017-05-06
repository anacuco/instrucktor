const UserInterface = require('./UserInterface');
const Truck = require('./Truck');
const Keyboard = require('./Keyboard');
const Layer = require('./Layer');
const templates = require('./Templates');

var game = {
    debug: false,
    move: true,
    layer: null,
    layer2: null,
    currentOffset: null,
    viewportWidth: null,
    viewPortPadding: 100,

    init: function () {
        templates.load(document.querySelector('#templates'));

        // layer 0: foreground
        let layer0 = document.querySelector('#layer-0');
        game.layer = new Layer(layer0);

        // layer 1: scenery

        // layer 2: near horizon (weather)
        let layer2 = document.querySelector('#layer-2');
        game.layer2 = new Layer(layer2, .04);
        // TODO: chunks of weather (clouds), infinitely moving along (not just planted on layer..)
        // (positions should come from server, everyone should see the same thing)
        game.layer2.generateClouds(0, 10000);

        // layer 3: far horizon (mountains)

        // layer 4: sky/backdrop

        // generate truck from data + template
        let truckEl = templates.get('truck');
        truckEl.id = "user1";
        game.truck = new Truck(truckEl, '016-truck-1');
        game.layer.addDynamic(game.truck);

        let hangarEl = templates.get('building');
        hangarEl.style.left = 20900 + 'px';
        let hangarItem = {
            x: 0,
            element: hangarEl
        };
        game.layer.addStatic(hangarItem);


        game.layer.update();

        let uiContainer = document.querySelector('#layer-ui');
        game.ui = new UserInterface(uiContainer, this); // this = stateContainer atm

        Keyboard.bind(window);
        Keyboard.game = this;
        // TODO: add controls layer, keyboard (other other inputs) dispatch methods there

        // TODO: viewport mgmt, game x = 0
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
        game.layer2.scroll(amount);
        game.currentOffset = game.layer.currentOffset;
    },

    afStep: function (timestamp) {
        if (game.debug === true) {
            console.log('frametime:', timestamp - game.afTs);
            var perfDate = performance.now();
        }
        game.afTs = timestamp;

        // console.log(game.afTs);
        game.ui.render(timestamp);

        // TODO: assume update
        if (game.move === true) {
            game.truck.move(game.truck.direction * game.truck.speed);

            // TODO: x-based
            let viewportLeftBound = -game.currentOffset + game.viewPortPadding;
            let viewportRightBound = -game.currentOffset + game.viewportWidth - game.viewPortPadding;
            if ( !game.truck.isWithin(viewportLeftBound, viewportRightBound)
            ) {
                // TODO: viewport tracking
                game.scroll(-game.truck.direction * game.truck.speed);
            }
        }

        if (game.debug === true) {
            console.log('step time:', performance.now() - perfDate);
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
    // controls set object target position, relative to speed, time
    // suspend / resume animations
    // suspend / resume game updates
});
