(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Keyboard = {
    game: null,

    keyDownHandler: function keyDownHandler(evt) {
        switch (evt.keyCode) {
            case 40:
                console.log('down');
                break;
            case 37:
                Keyboard.game.truck.direction = -1;
                Keyboard.game.move = true;
                break;
            case 39:
                Keyboard.game.truck.direction = 1;
                Keyboard.game.move = true;
                break;
            case 38:
                console.log('up');
                break;
            case 32:
                // console.log('space');
                if (Keyboard.game.gameLoop !== null) {
                    Keyboard.game.stop();
                } else {
                    Keyboard.game.start();
                }
                break;
            default:
                console.log(evt.keyCode);
        }
    },
    keyUpHandler: function keyUpHandler(evt) {
        // Keyboard.game.move = false;
    },
    bind: function bind(target) {
        target.addEventListener('keydown', this.keyDownHandler);
        target.addEventListener('keyup', this.keyUpHandler);
    },
    release: function release(target) {
        target.removeEventListener('keydown', this.keyDownHandler);
        target.removeEventListener('keyup', this.keyUpHandler);
    }
};

module.exports = Keyboard;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Layer = function () {
    // dynamic objects
    // static objects
    // as indexedarrays?
    // generated objects
    // as generators?
    function Layer(containerElement) {
        var scrollFactor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        _classCallCheck(this, Layer);

        this.containerElement = containerElement;
        this.scrollFactor = scrollFactor;

        this.width = this.containerElement.offsetWidth;
        this.initialOffset = this.containerElement.offsetLeft;
        this.currentOffset = this.initialOffset;

        var chunkStart = this.width + this.currentOffset;
        var chunkEnd = chunkStart + 4000;

        this.ensureChunk(chunkStart, chunkEnd);
    }

    // TODO: paint debug chunks


    _createClass(Layer, [{
        key: 'ensureChunk',
        value: function ensureChunk(start, end) {
            // find dynamic objects in chunk range
            // find static objects in chunk range

            // generate objects in chunk range
            this.generatePosts(start, end);
        }
    }, {
        key: 'scroll',
        value: function scroll(amount) {
            var newOffset = this.currentOffset + Math.round(amount * this.scrollFactor);
            if (this.currentOffset === newOffset) return;

            this.containerElement.style.left = newOffset + 'px';
            this.currentOffset = newOffset;
        }
    }, {
        key: 'generatePosts',
        value: function generatePosts(start, end) {
            var postTemplate = document.querySelector('#templates .post');

            for (var i = start; i < end; i += 200) {
                var post = postTemplate.cloneNode();
                post.style.left = i + 'px';
                this.containerElement.appendChild(post);
            }
        }
    }]);

    return Layer;
}();

module.exports = Layer;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Truck = function () {
    function Truck(containerElement) {
        _classCallCheck(this, Truck);

        this.containerElement = containerElement;
        this.svg = this.containerElement.querySelector('svg');

        this.width = this.containerElement.offsetWidth;
        this.initialOffset = this.containerElement.offsetLeft;
        this.currentOffset = this.initialOffset;

        this.speed = 5;

        this._direction = 1;
    }

    _createClass(Truck, [{
        key: 'move',
        value: function move(amount) {
            this.x += amount;
        }
    }, {
        key: 'x',
        set: function set(value) {
            this.currentOffset = this.initialOffset + value;
            this.containerElement.style.left = this.currentOffset + 'px';
        },
        get: function get() {
            return this.currentOffset - this.initialOffset;
        }
    }, {
        key: 'direction',
        set: function set(value) {
            if (this._direction !== value) {
                this.svg.setAttribute('style', 'transform: scaleX(' + value + '); transition: .1s');
            }
            this._direction = value;
        },
        get: function get() {
            return this._direction;
        }
    }]);

    return Truck;
}();

module.exports = Truck;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.resolve = function (path, obj) {
    return path.split('.').reduce(function (prev, curr) {
        return prev ? prev[curr] : undefined;
    }, obj || self);
};

var UserInterface = function () {
    function UserInterface(containerElement, stateContainer) {
        _classCallCheck(this, UserInterface);

        this.containerElement = containerElement;
        this.stateContainer = stateContainer;

        this.hudContainer = this.containerElement.querySelector('#hud');
        this.valueContainer = this.hudContainer.querySelector('ul');

        this.hudContainer.querySelector('#playerName').innerHTML = 'Player Name';
        this.hudValues = [{
            'label': 'position',
            'val': 'truck.x'
        }];

        this.updateInterval = 200; // 5fps
        this.lastUpdate = -this.updateInterval;
        this.render(0);
    }

    _createClass(UserInterface, [{
        key: 'render',
        value: function render(timestamp) {
            // TODO: handle outside...
            if (this.lastUpdate > timestamp - this.updateInterval) return;

            // console.log(Object.resolve(this.hudValues[0].val, game));

            var list = '';

            for (var i in this.hudValues) {
                var value = this.hudValues[i];

                list += value.label + ': ' + Object.resolve(value.val, this.stateContainer);
            }

            this.valueContainer.innerHTML = list;
            this.lastUpdate = timestamp;
            // console.log('ui update', timestamp);
        }
    }]);

    return UserInterface;
}();

module.exports = UserInterface;

},{}],5:[function(require,module,exports){
'use strict';

var UserInterface = require('./UserInterface');
var Truck = require('./Truck');
var Keyboard = require('./Keyboard');
var Layer = require('./Layer');

var game = {
    move: false,
    layer: null,
    currentOffset: null,
    viewportWidth: null,
    viewPortPadding: 100,

    init: function init() {
        var layer0 = document.querySelector('#layer-0');
        game.layer = new Layer(layer0);

        // TODO: add truck to layer0
        var truckEl = document.querySelector('#user1');
        game.truck = new Truck(truckEl);

        var uiContainer = document.querySelector('#layer-ui');
        game.ui = new UserInterface(uiContainer, this); // this = stateContainer atm

        Keyboard.bind(window);
        Keyboard.game = this;
        // TODO: add controls layer, keyboard (other other inputs) dispatch methods there

        // TODO: viewport mgmt
        game.viewportWidth = window.innerWidth;
        game.currentOffset = game.layer.currentOffset;
        game.bindResize();
    },

    bindResize: function bindResize() {
        window.addEventListener('resize', function (evt) {
            game.viewportWidth = window.innerWidth;

            // TODO: if truck is outside bounds, move world (debounced)

            console.log(game.viewportWidth);
        });
    },

    scroll: function scroll(amount) {
        game.layer.scroll(amount);
        game.currentOffset = game.layer.currentOffset;
    },

    afStep: function afStep(timestamp) {
        // console.log('frametime:', timestamp - game.afTs);
        game.afTs = timestamp;

        // console.log(game.afTs);
        game.ui.render(timestamp);

        // TODO: assume update
        if (game.move === true) {
            game.truck.move(game.truck.direction * game.truck.speed);

            // console.log(game.truck.currentOffset, -game.currentOffset);

            // TODO: x-based
            if (game.truck.currentOffset < -game.currentOffset + game.viewPortPadding || game.truck.currentOffset + game.truck.width > -game.currentOffset + game.viewportWidth - game.viewPortPadding) {
                game.scroll(-game.truck.direction * game.truck.speed);
            }
        }

        game.afCallback = window.requestAnimationFrame(game.afStep);
    },

    update: function update() {
        // game update
        // console.log('update');
    },

    gameLoopInterval: 20, // 50fps
    gameLoop: null,
    afCallback: null,
    afTs: null,

    start: function start() {
        window.cancelAnimationFrame(game.afCallback);
        clearInterval(game.gameLoop);

        game.gameLoop = setInterval(game.update, game.gameLoopInterval);
        game.afCallback = window.requestAnimationFrame(game.afStep);
    },

    stop: function stop() {
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

},{"./Keyboard":1,"./Layer":2,"./Truck":3,"./UserInterface":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvc3JjL0tleWJvYXJkLmpzIiwiY2xpZW50L3NyYy9MYXllci5qcyIsImNsaWVudC9zcmMvVHJ1Y2suanMiLCJjbGllbnQvc3JjL1VzZXJJbnRlcmZhY2UuanMiLCJjbGllbnQvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sV0FBVztBQUNiLFVBQU0sSUFETzs7QUFHYixrQkFIYSwwQkFHRyxHQUhILEVBR1E7QUFDakIsZ0JBQU8sSUFBSSxPQUFYO0FBQ0ksaUJBQUssRUFBTDtBQUNJLHdCQUFRLEdBQVIsQ0FBWSxNQUFaO0FBQ0E7QUFDSixpQkFBSyxFQUFMO0FBQ0kseUJBQVMsSUFBVCxDQUFjLEtBQWQsQ0FBb0IsU0FBcEIsR0FBZ0MsQ0FBQyxDQUFqQztBQUNBLHlCQUFTLElBQVQsQ0FBYyxJQUFkLEdBQXFCLElBQXJCO0FBQ0E7QUFDSixpQkFBSyxFQUFMO0FBQ0kseUJBQVMsSUFBVCxDQUFjLEtBQWQsQ0FBb0IsU0FBcEIsR0FBZ0MsQ0FBaEM7QUFDQSx5QkFBUyxJQUFULENBQWMsSUFBZCxHQUFxQixJQUFyQjtBQUNBO0FBQ0osaUJBQUssRUFBTDtBQUNJLHdCQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0E7QUFDSixpQkFBSyxFQUFMO0FBQ0k7QUFDQSxvQkFBSSxTQUFTLElBQVQsQ0FBYyxRQUFkLEtBQTJCLElBQS9CLEVBQXFDO0FBQ2pDLDZCQUFTLElBQVQsQ0FBYyxJQUFkO0FBQ0gsaUJBRkQsTUFFTztBQUNILDZCQUFTLElBQVQsQ0FBYyxLQUFkO0FBQ0g7QUFDRDtBQUNKO0FBQ0ksd0JBQVEsR0FBUixDQUFZLElBQUksT0FBaEI7QUF4QlI7QUEwQkgsS0E5Qlk7QUFnQ2IsZ0JBaENhLHdCQWdDQyxHQWhDRCxFQWdDTTtBQUNmO0FBQ0gsS0FsQ1k7QUFvQ2IsUUFwQ2EsZ0JBb0NQLE1BcENPLEVBb0NDO0FBQ1Ys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Q0UscUJBQUssTUFBTCxDQUFZLENBQUMsS0FBSyxLQUFMLENBQVcsU0FBWixHQUF3QixLQUFLLEtBQUwsQ0FBVyxLQUEvQztBQUNIO0FBQ0o7O0FBRUQsYUFBSyxVQUFMLEdBQWtCLE9BQU8scUJBQVAsQ0FBNkIsS0FBSyxNQUFsQyxDQUFsQjtBQUNILEtBbEVNOztBQW9FUCxZQUFRLGtCQUFZO0FBQ2hCO0FBQ0E7QUFDSCxLQXZFTTs7QUF5RVAsc0JBQWtCLEVBekVYLEVBeUVlO0FBQ3RCLGNBQVUsSUExRUg7QUEyRVAsZ0JBQVksSUEzRUw7QUE0RVAsVUFBTSxJQTVFQzs7QUE4RVAsV0FBTyxpQkFBWTtBQUNmLGVBQU8sb0JBQVAsQ0FBNEIsS0FBSyxVQUFqQztBQUNBLHNCQUFjLEtBQUssUUFBbkI7O0FBRUEsYUFBSyxRQUFMLEdBQWdCLFlBQVksS0FBSyxNQUFqQixFQUF5QixLQUFLLGdCQUE5QixDQUFoQjtBQUNBLGFBQUssVUFBTCxHQUFrQixPQUFPLHFCQUFQLENBQTZCLEtBQUssTUFBbEMsQ0FBbEI7QUFDSCxLQXBGTTs7QUFzRlAsVUFBTSxnQkFBWTtBQUNkLGVBQU8sb0JBQVAsQ0FBNEIsS0FBSyxVQUFqQztBQUNBLHNCQUFjLEtBQUssUUFBbkI7O0FBRUEsYUFBSyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0g7QUE1Rk0sQ0FBWDs7QUErRkEsT0FBTyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsWUFBWTtBQUNwRCxTQUFLLElBQUw7QUFDQSxTQUFLLEtBQUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsQ0FWRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBLZXlib2FyZCA9IHtcbiAgICBnYW1lOiBudWxsLFxuXG4gICAga2V5RG93bkhhbmRsZXIgKGV2dCkge1xuICAgICAgICBzd2l0Y2goZXZ0LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Rvd24nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzc6XG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuZ2FtZS50cnVjay5kaXJlY3Rpb24gPSAtMTtcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5nYW1lLm1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5nYW1lLnRydWNrLmRpcmVjdGlvbiA9IDE7XG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuZ2FtZS5tb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwJyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDMyOlxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzcGFjZScpO1xuICAgICAgICAgICAgICAgIGlmIChLZXlib2FyZC5nYW1lLmdhbWVMb29wICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIEtleWJvYXJkLmdhbWUuc3RvcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIEtleWJvYXJkLmdhbWUuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2dC5rZXlDb2RlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBrZXlVcEhhbmRsZXIgKGV2dCkge1xuICAgICAgICAvLyBLZXlib2FyZC5nYW1lLm1vdmUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgYmluZCAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlEb3duSGFuZGxlcik7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMua2V5VXBIYW5kbGVyKTtcbiAgICB9LFxuXG4gICAgcmVsZWFzZSAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlEb3duSGFuZGxlcik7XG4gICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMua2V5VXBIYW5kbGVyKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmQ7XG4iLCJjbGFzcyBMYXllciB7XG4gICAgLy8gZHluYW1pYyBvYmplY3RzXG4gICAgLy8gc3RhdGljIG9iamVjdHNcbiAgICAvLyBhcyBpbmRleGVkYXJyYXlzP1xuICAgIC8vIGdlbmVyYXRlZCBvYmplY3RzXG4gICAgLy8gYXMgZ2VuZXJhdG9ycz9cbiAgICBjb25zdHJ1Y3RvciAoY29udGFpbmVyRWxlbWVudCwgc2Nyb2xsRmFjdG9yID0gMSkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnQgPSBjb250YWluZXJFbGVtZW50O1xuICAgICAgICB0aGlzLnNjcm9sbEZhY3RvciA9IHNjcm9sbEZhY3RvcjtcblxuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5jb250YWluZXJFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICB0aGlzLmluaXRpYWxPZmZzZXQgPSB0aGlzLmNvbnRhaW5lckVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgdGhpcy5jdXJyZW50T2Zmc2V0ID0gdGhpcy5pbml0aWFsT2Zmc2V0O1xuXG4gICAgICAgIGxldCBjaHVua1N0YXJ0ID0gdGhpcy53aWR0aCArIHRoaXMuY3VycmVudE9mZnNldDtcbiAgICAgICAgbGV0IGNodW5rRW5kID0gY2h1bmtTdGFydCArIDQwMDA7XG5cbiAgICAgICAgdGhpcy5lbnN1cmVDaHVuayhjaHVua1N0YXJ0LCBjaHVua0VuZCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcGFpbnQgZGVidWcgY2h1bmtzXG4gICAgZW5zdXJlQ2h1bmsgKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgLy8gZmluZCBkeW5hbWljIG9iamVjdHMgaW4gY2h1bmsgcmFuZ2VcbiAgICAgICAgLy8gZmluZCBzdGF0aWMgb2JqZWN0cyBpbiBjaHVuayByYW5nZVxuXG4gICAgICAgIC8vIGdlbmVyYXRlIG9iamVjdHMgaW4gY2h1bmsgcmFuZ2VcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVBvc3RzKHN0YXJ0LCBlbmQpO1xuICAgIH1cblxuICAgIHNjcm9sbCAoYW1vdW50KSB7XG4gICAgICAgIHZhciBuZXdPZmZzZXQgPSB0aGlzLmN1cnJlbnRPZmZzZXQgKyBNYXRoLnJvdW5kKGFtb3VudCAqIHRoaXMuc2Nyb2xsRmFjdG9yKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9mZnNldCA9PT0gbmV3T2Zmc2V0KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50LnN0eWxlLmxlZnQgPSBuZXdPZmZzZXQgKyAncHgnO1xuICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXQgPSBuZXdPZmZzZXQ7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVQb3N0cyAoc3RhcnQsIGVuZCkge1xuICAgICAgICBsZXQgcG9zdFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXBsYXRlcyAucG9zdCcpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAyMDApIHtcbiAgICAgICAgICAgIGxldCBwb3N0ID0gcG9zdFRlbXBsYXRlLmNsb25lTm9kZSgpO1xuICAgICAgICAgICAgcG9zdC5zdHlsZS5sZWZ0ID0gaSArICdweCc7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQocG9zdCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXI7XG4iLCJjbGFzcyBUcnVjayB7XG4gICAgY29uc3RydWN0b3IgKGNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50ID0gY29udGFpbmVyRWxlbWVudDtcbiAgICAgICAgdGhpcy5zdmcgPSB0aGlzLmNvbnRhaW5lckVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG5cbiAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuY29udGFpbmVyRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgdGhpcy5pbml0aWFsT2Zmc2V0ID0gdGhpcy5jb250YWluZXJFbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgIHRoaXMuY3VycmVudE9mZnNldCA9IHRoaXMuaW5pdGlhbE9mZnNldDtcblxuICAgICAgICB0aGlzLnNwZWVkID0gNTtcblxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAxO1xuICAgIH1cblxuICAgIHNldCB4ICh2YWx1ZSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXQgPSB0aGlzLmluaXRpYWxPZmZzZXQgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50LnN0eWxlLmxlZnQgPSB0aGlzLmN1cnJlbnRPZmZzZXQgKyAncHgnO1xuICAgIH1cblxuICAgIGdldCB4ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudE9mZnNldCAtIHRoaXMuaW5pdGlhbE9mZnNldDtcbiAgICB9XG5cbiAgICBzZXQgZGlyZWN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9uICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zdmcuc2V0QXR0cmlidXRlKCdzdHlsZScsICd0cmFuc2Zvcm06IHNjYWxlWCgnK3ZhbHVlKycpOyB0cmFuc2l0aW9uOiAuMXMnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgZGlyZWN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbjtcbiAgICB9XG5cbiAgICBtb3ZlIChhbW91bnQpIHtcbiAgICAgICAgdGhpcy54ICs9IGFtb3VudDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJ1Y2s7XG4iLCJPYmplY3QucmVzb2x2ZSA9IGZ1bmN0aW9uKHBhdGgsIG9iaikge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cnIpIHtcbiAgICAgICAgcmV0dXJuIHByZXYgPyBwcmV2W2N1cnJdIDogdW5kZWZpbmVkXG4gICAgfSwgb2JqIHx8IHNlbGYpXG59XG5cbmNsYXNzIFVzZXJJbnRlcmZhY2Uge1xuICAgIGNvbnN0cnVjdG9yIChjb250YWluZXJFbGVtZW50LCBzdGF0ZUNvbnRhaW5lcikge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnQgPSBjb250YWluZXJFbGVtZW50O1xuICAgICAgICB0aGlzLnN0YXRlQ29udGFpbmVyID0gc3RhdGVDb250YWluZXI7XG5cbiAgICAgICAgdGhpcy5odWRDb250YWluZXIgPSB0aGlzLmNvbnRhaW5lckVsZW1lbnQucXVlcnlTZWxlY3RvcignI2h1ZCcpO1xuICAgICAgICB0aGlzLnZhbHVlQ29udGFpbmVyID0gdGhpcy5odWRDb250YWluZXIucXVlcnlTZWxlY3RvcigndWwnKTtcblxuICAgICAgICB0aGlzLmh1ZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjcGxheWVyTmFtZScpLmlubmVySFRNTCA9ICdQbGF5ZXIgTmFtZSc7XG4gICAgICAgIHRoaXMuaHVkVmFsdWVzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdsYWJlbCc6ICdwb3NpdGlvbicsXG4gICAgICAgICAgICAgICAgJ3ZhbCc6ICd0cnVjay54JyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUludGVydmFsID0gMjAwOyAvLyA1ZnBzXG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IC10aGlzLnVwZGF0ZUludGVydmFsO1xuICAgICAgICB0aGlzLnJlbmRlcigwKTtcbiAgICB9XG5cbiAgICByZW5kZXIgKHRpbWVzdGFtcCkge1xuICAgICAgICAvLyBUT0RPOiBoYW5kbGUgb3V0c2lkZS4uLlxuICAgICAgICBpZiAodGhpcy5sYXN0VXBkYXRlID4gdGltZXN0YW1wIC0gdGhpcy51cGRhdGVJbnRlcnZhbCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5yZXNvbHZlKHRoaXMuaHVkVmFsdWVzWzBdLnZhbCwgZ2FtZSkpO1xuXG4gICAgICAgIGxldCBsaXN0ID0gJyc7XG5cbiAgICAgICAgZm9yIChsZXQgaSBpbiB0aGlzLmh1ZFZhbHVlcykge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5odWRWYWx1ZXNbaV07XG5cbiAgICAgICAgICAgIGxpc3QgKz0gYCR7dmFsdWUubGFiZWx9OiAke09iamVjdC5yZXNvbHZlKHZhbHVlLnZhbCwgdGhpcy5zdGF0ZUNvbnRhaW5lcil9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmFsdWVDb250YWluZXIuaW5uZXJIVE1MID0gbGlzdDtcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gdGltZXN0YW1wO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndWkgdXBkYXRlJywgdGltZXN0YW1wKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlckludGVyZmFjZTtcbiIsImNvbnN0IFVzZXJJbnRlcmZhY2UgPSByZXF1aXJlKCcuL1VzZXJJbnRlcmZhY2UnKTtcbmNvbnN0IFRydWNrID0gcmVxdWlyZSgnLi9UcnVjaycpO1xuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuL0tleWJvYXJkJyk7XG5jb25zdCBMYXllciA9IHJlcXVpcmUoJy4vTGF5ZXInKTtcblxudmFyIGdhbWUgPSB7XG4gICAgbW92ZTogZmFsc2UsXG4gICAgbGF5ZXI6IG51bGwsXG4gICAgY3VycmVudE9mZnNldDogbnVsbCxcbiAgICB2aWV3cG9ydFdpZHRoOiBudWxsLFxuICAgIHZpZXdQb3J0UGFkZGluZzogMTAwLFxuXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbGF5ZXIwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xheWVyLTAnKTtcbiAgICAgICAgZ2FtZS5sYXllciA9IG5ldyBMYXllcihsYXllcjApO1xuXG4gICAgICAgIC8vIFRPRE86IGFkZCB0cnVjayB0byBsYXllcjBcbiAgICAgICAgbGV0IHRydWNrRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdXNlcjEnKTtcbiAgICAgICAgZ2FtZS50cnVjayA9IG5ldyBUcnVjayh0cnVja0VsKTtcblxuICAgICAgICBsZXQgdWlDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbGF5ZXItdWknKTtcbiAgICAgICAgZ2FtZS51aSA9IG5ldyBVc2VySW50ZXJmYWNlKHVpQ29udGFpbmVyLCB0aGlzKTsgLy8gdGhpcyA9IHN0YXRlQ29udGFpbmVyIGF0bVxuXG4gICAgICAgIEtleWJvYXJkLmJpbmQod2luZG93KTtcbiAgICAgICAgS2V5Ym9hcmQuZ2FtZSA9IHRoaXM7XG4gICAgICAgIC8vIFRPRE86IGFkZCBjb250cm9scyBsYXllciwga2V5Ym9hcmQgKG90aGVyIG90aGVyIGlucHV0cykgZGlzcGF0Y2ggbWV0aG9kcyB0aGVyZVxuXG4gICAgICAgIC8vIFRPRE86IHZpZXdwb3J0IG1nbXRcbiAgICAgICAgZ2FtZS52aWV3cG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGdhbWUuY3VycmVudE9mZnNldCA9IGdhbWUubGF5ZXIuY3VycmVudE9mZnNldDtcbiAgICAgICAgZ2FtZS5iaW5kUmVzaXplKCk7XG4gICAgfSxcblxuICAgIGJpbmRSZXNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGdhbWUudmlld3BvcnRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBpZiB0cnVjayBpcyBvdXRzaWRlIGJvdW5kcywgbW92ZSB3b3JsZCAoZGVib3VuY2VkKVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhnYW1lLnZpZXdwb3J0V2lkdGgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2Nyb2xsOiBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGdhbWUubGF5ZXIuc2Nyb2xsKGFtb3VudCk7XG4gICAgICAgIGdhbWUuY3VycmVudE9mZnNldCA9IGdhbWUubGF5ZXIuY3VycmVudE9mZnNldDtcbiAgICB9LFxuXG4gICAgYWZTdGVwOiBmdW5jdGlvbiAodGltZXN0YW1wKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdmcmFtZXRpbWU6JywgdGltZXN0YW1wIC0gZ2FtZS5hZlRzKTtcbiAgICAgICAgZ2FtZS5hZlRzID0gdGltZXN0YW1wO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGdhbWUuYWZUcyk7XG4gICAgICAgIGdhbWUudWkucmVuZGVyKHRpbWVzdGFtcCk7XG5cbiAgICAgICAgLy8gVE9ETzogYXNzdW1lIHVwZGF0ZVxuICAgICAgICBpZiAoZ2FtZS5tb3ZlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBnYW1lLnRydWNrLm1vdmUoZ2FtZS50cnVjay5kaXJlY3Rpb24gKiBnYW1lLnRydWNrLnNwZWVkKTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZ2FtZS50cnVjay5jdXJyZW50T2Zmc2V0LCAtZ2FtZS5jdXJyZW50T2Zmc2V0KTtcblxuICAgICAgICAgICAgLy8gVE9ETzogeC1iYXNlZFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGdhbWUudHJ1Y2suY3VycmVudE9mZnNldCA8ICgtZ2FtZS5jdXJyZW50T2Zmc2V0ICsgZ2FtZS52aWV3UG9ydFBhZGRpbmcpXG4gICAgICAgICAgICAgICAgfHwgZ2FtZS50cnVjay5jdXJyZW50T2Zmc2V0ICsgZ2FtZS50cnVjay53aWR0aCA+ICgoLWdhbWUuY3VycmVudE9mZnNldCkgKyBnYW1lLnZpZXdwb3J0V2lkdGggLSBnYW1lLnZpZXdQb3J0UGFkZGluZylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGdhbWUuc2Nyb2xsKC1nYW1lLnRydWNrLmRpcmVjdGlvbiAqIGdhbWUudHJ1Y2suc3BlZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2FtZS5hZkNhbGxiYWNrID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lLmFmU3RlcCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBnYW1lIHVwZGF0ZVxuICAgICAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlJyk7XG4gICAgfSxcblxuICAgIGdhbWVMb29wSW50ZXJ2YWw6IDIwLCAvLyA1MGZwc1xuICAgIGdhbWVMb29wOiBudWxsLFxuICAgIGFmQ2FsbGJhY2s6IG51bGwsXG4gICAgYWZUczogbnVsbCxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShnYW1lLmFmQ2FsbGJhY2spO1xuICAgICAgICBjbGVhckludGVydmFsKGdhbWUuZ2FtZUxvb3ApO1xuXG4gICAgICAgIGdhbWUuZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbChnYW1lLnVwZGF0ZSwgZ2FtZS5nYW1lTG9vcEludGVydmFsKTtcbiAgICAgICAgZ2FtZS5hZkNhbGxiYWNrID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lLmFmU3RlcCk7XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGdhbWUuYWZDYWxsYmFjayk7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoZ2FtZS5nYW1lTG9vcCk7XG5cbiAgICAgICAgZ2FtZS5hZkNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgZ2FtZS5nYW1lTG9vcCA9IG51bGw7XG4gICAgfVxufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgZ2FtZS5pbml0KCk7XG4gICAgZ2FtZS5zdGFydCgpO1xuXG4gICAgLy8gVE9ETzpcbiAgICAvLyBhbmltYXRpb24gc3RhcnQgdGltZVxuICAgIC8vIG1vdmUgb2JqZWN0IHRvIHRhcmdldCBwb3NpdGlvbiBwZXIgdGltZSBpbnRlcnZhbCwgcmVsYXRpdmUgdG8gc3BlZWRcbiAgICAvLyBjb250cm9scyBzZXQgb2JqZWN0IHRhcmdldCBwb3NpdGlvbiwgcmVsYXRpdmUgdG8gc3BlZWRcbiAgICAvLyBzdXNwZW5kIC8gcmVzdW1lIGFuaW1hdGlvbnNcbiAgICAvLyBzdXNwZW5kIC8gcmVzdW1lIGdhbWUgdXBkYXRlc1xufSk7XG4iXX0=
