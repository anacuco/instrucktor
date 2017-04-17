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

var Truck = function () {
    function Truck(containerElement) {
        _classCallCheck(this, Truck);

        this.containerElement = containerElement;
        this.svg = this.containerElement.querySelector('svg');

        this.truckLength = this.containerElement.offsetWidth;
        this.truckOffset = this.containerElement.offsetLeft;
        this.initialOffset = this.truckOffset;

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
            this.truckOffset = this.initialOffset + value;
            this.containerElement.style.left = this.truckOffset + 'px';
        },
        get: function get() {
            return this.truckOffset - this.initialOffset;
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var UserInterface = require('./UserInterface');
var Truck = require('./Truck');
var Keyboard = require('./Keyboard');

var game = {
    move: false,
    layer: null,
    currentOffset: null,
    viewportWidth: null,
    viewPortPadding: 100,

    init: function init() {
        game.layer = document.querySelector('#layer-0');
        game.currentOffset = game.layer.offsetLeft;

        var truckEl = document.querySelector('#user1');
        game.truck = new Truck(truckEl);

        game.viewportWidth = window.innerWidth;

        game.placePosts();
        Keyboard.bind(window);
        Keyboard.game = this;
        // TODO: add controls layer, keyboard (other other inputs) call methods there

        game.bindResize();

        var uiContainer = document.querySelector('#layer-ui');
        game.ui = new UserInterface(uiContainer, this); // this = stateContainer atm
    },

    bindResize: function bindResize() {
        window.addEventListener('resize', function (evt) {
            game.viewportWidth = window.innerWidth;

            // TODO: if truck is outside bounds, move world

            console.log(game.viewportWidth);
        });
    },

    placePosts: function placePosts() {
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

    scroll: function scroll(amount) {
        var newOffset = game.currentOffset + amount;
        game.layer.style.left = newOffset + 'px';
        game.currentOffset = newOffset;
    },

    afStep: function afStep(timestamp) {
        // console.log('frametime:', timestamp - game.afTs);
        game.afTs = timestamp;

        // console.log(game.afTs);
        game.ui.render(timestamp);

        // TODO: assume update
        if (game.move === true) {
            game.truck.move(game.truck.direction * game.truck.speed);

            if (game.truck.truckOffset < -game.currentOffset + game.viewPortPadding || game.truck.truckOffset + game.truck.truckLength > -game.currentOffset + game.viewportWidth - game.viewPortPadding) {
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

},{"./Keyboard":1,"./Truck":2,"./UserInterface":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvc3JjL0tleWJvYXJkLmpzIiwiY2xpZW50L3NyYy9UcnVjay5qcyIsImNsaWVudC9zcmMvVXNlckludGVyZmFjZS5qcyIsImNsaWVudC9zcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxXQUFXO0FBQ2IsVUFBTSxJQURPOztBQUdiLGtCQUhhLDBCQUdHLEdBSEgsRUFHUTtBQUNqQixnQkFBTyxJQUFJLE9BQVg7QUFDSSxpQkFBSyxFQUFMO0FBQ0ksd0JBQVEsR0FBUixDQUFZLE1BQVo7QUFDQTtBQUNKLGlCQUFLLEVBQUw7QUFDSSx5QkFBUyxJQUFULENBQWMsS0FBZCxDQUFvQixTQUFwQixHQUFnQyxDQUFDLENBQWpDO0FBQ0EseUJBQVMsSUFBVCxDQUFjLElBQWQsR0FBcUIsSUFBckI7QUFDQTtBQUNKLGlCQUFLLEVBQUw7QUFDSSx5QkFBUyxJQUFULENBQWMsS0FBZCxDQUFvQixTQUFwQixHQUFnQyxDQUFoQztBQUNBLHlCQUFTLElBQVQsQ0FBYyxJQUFkLEdBQXFCLElBQXJCO0FBQ0E7QUFDSixpQkFBSyxFQUFMO0FBQ0ksd0JBQVEsR0FBUixDQUFZLElBQVo7QUFDQTtBQUNKLGlCQUFLLEVBQUw7QUFDSTtBQUNBLG9CQUFJLFNBQVMsSUFBVCxDQUFjLFFBQWQsS0FBMkIsSUFBL0IsRUFBcUM7QUFDakMsNkJBQVMsSUFBVCxDQUFjLElBQWQ7QUFDSCxpQkFGRCxNQUVPO0FBQ0gsNkJBQVMsSUFBVCxDQUFjLEtBQWQ7QUFDSDtBQUNEO0FBQ0o7QUFDSSx3QkFBUSxHQUFSLENBQVksSUFBSSxPQUFoQjtBQXhCUjtBQTBCSCxLQTlCWTtBQWdDYixnQkFoQ2Esd0JBZ0NDLEdBaENELEVBZ0NNO0FBQ2Y7QUFDSCxLQWxDWTtBQW9DYixRQXBDYSxnQkFvQ1AsTUFwQ08sRUFvQ0M7QUFDVixlQUFPLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLEtBQUssY0FBeEM7QUFDQSxlQUFPLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLEtBQUssWUFBdEM7QUFDSCxLQXZDWTtBQXlDYixXQXpDYSxtQkF5Q0osTUF6Q0ksRUF5Q0k7QUFDYixlQUFPLG1CQUFQLENBQTJCLFNBQTNCLEVBQXNDLEtBQUssY0FBM0M7QUFDQSxlQUFPLG1CQUFQLENBQTJCLE9BQTNCLEVBQW9DLEtBQUssWUFBekM7QUFDSDtBQTVDWSxDQUFqQjs7QUErQ0EsT0FBTyxPQUFQLEdBQWlCLFFBQWpCOzs7Ozs7Ozs7SUMvQ00sSztBQUNGLG1CQUFhLGdCQUFiLEVBQStCO0FBQUE7O0FBQzNCLGFBQUssZ0JBQUwsR0FBd0IsZ0JBQXhCO0FBQ0EsYUFBSyxHQUFMLEdBQVcsS0FBSyxnQkFBTCxDQUFzQixhQUF0QixDQUFvQyxLQUFwQyxDQUFYOztBQUVBLGFBQUssV0FBTCxHQUFtQixLQUFLLGdCQUFMLENBQXNCLFdBQXpDO0FBQ0EsYUFBSyxXQUFMLEdBQW1CLEtBQUssZ0JBQUwsQ0FBc0IsVUFBekM7QUFDQSxhQUFLLGFBQUwsR0FBcUIsS0FBSyxXQUExQjs7QUFFQSxhQUFLLEtBQUwsR0FBYSxDQUFiOztBQUVBLGFBQUssVUFBTCxHQUFrQixDQUFsQjtBQUNIOzs7OzZCQXNCSyxNLEVBQVE7QUFDVixpQkFBSyxDQUFMLElBQVUsTUFBVjtBQUNIOzs7MEJBdEJNLEssRUFBTztBQUNWLGlCQUFLLFdBQUwsR0FBbUIsS0FBSyxhQUFMLEdBQXFCLEtBQXhDO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsS0FBdEIsQ0FBNEIsSUFBNUIsR0FBbUMsS0FBSyxXQUFMLEdBQW1CLElBQXREO0FBQ0gsUzs0QkFFUTtBQUNMLG1CQUFPLEtBQUssV0FBTCxHQUFtQixLQUFLLGFBQS9CO0FBQ0g7OzswQkFFYyxLLEVBQU87QUFDbEIsZ0JBQUksS0FBSyxVQUFMLEtBQW9CLEtBQXhCLEVBQStCO0FBQzNCLHFCQUFLLEdBQUwsQ0FBUyxZQUFULENBQXNCLE9BQXRCLEVBQStCLHVCQUFxQixLQUFyQixHQUEyQixvQkFBMUQ7QUFDSDtBQUNELGlCQUFLLFVBQUwsR0FBa0IsS0FBbEI7QUFDSCxTOzRCQUVnQjtBQUNiLG1CQUFPLEtBQUssVUFBWjtBQUNIOzs7Ozs7QUFPTCxPQUFPLE9BQVAsR0FBaUIsS0FBakI7Ozs7Ozs7OztBQ3ZDQSxPQUFPLE9BQVAsR0FBaUIsVUFBUyxJQUFULEVBQWUsR0FBZixFQUFvQjtBQUNqQyxXQUFPLEtBQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsTUFBaEIsQ0FBdUIsVUFBUyxJQUFULEVBQWUsSUFBZixFQUFxQjtBQUMvQyxlQUFPLE9BQU8sS0FBSyxJQUFMLENBQVAsR0FBb0IsU0FBM0I7QUFDSCxLQUZNLEVBRUosT0FBTyxJQUZILENBQVA7QUFHSCxDQUpEOztJQU1NLGE7QUFDRiwyQkFBYSxnQkFBYixFQUErQixjQUEvQixFQUErQztBQUFBOztBQUMzQyxhQUFLLGdCQUFMLEdBQXdCLGdCQUF4QjtBQUNBLGFBQUssY0FBTCxHQUFzQixjQUF0Qjs7QUFFQSxhQUFLLFlBQUwsR0FBb0IsS0FBSyxnQkFBTCxDQUFzQixhQUF0QixDQUFvQyxNQUFwQyxDQUFwQjtBQUNBLGFBQUssY0FBTCxHQUFzQixLQUFLLFlBQUwsQ0FBa0IsYUFBbEIsQ0FBZ0MsSUFBaEMsQ0FBdEI7O0FBRUEsYUFBSyxZQUFMLENBQWtCLGFBQWxCLENBQWdDLGFBQWhDLEVBQStDLFNBQS9DLEdBQTJELGFBQTNEO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLENBQ2I7QUFDSSxxQkFBUyxVQURiO0FBRUksbUJBQU87QUFGWCxTQURhLENBQWpCOztBQU9BLGFBQUssY0FBTCxHQUFzQixHQUF0QixDQWYyQyxDQWVoQjtBQUMzQixhQUFLLFVBQUwsR0FBa0IsQ0FBQyxLQUFLLGNBQXhCO0FBQ0EsYUFBSyxNQUFMLENBQVksQ0FBWjtBQUNIOzs7OytCQUVPLFMsRUFBVztBQUNmO0FBQ0EsZ0JBQUksS0FBSyxVQUFMLEdBQWtCLFlBQVksS0FBSyxjQUF2QyxFQUF1RDs7QUFFdkQ7O0FBRUEsZ0JBQUksT0FBTyxFQUFYOztBQUVBLGlCQUFLLElBQUksQ0FBVCxJQUFjLEtBQUssU0FBbkIsRUFBOEI7QUFDMUIsb0JBQUksUUFBUSxLQUFLLFNBQUwsQ0FBZSxDQUFmLENBQVo7O0FBRUEsd0JBQVcsTUFBTSxLQUFqQixVQUEyQixPQUFPLE9BQVAsQ0FBZSxNQUFNLEdBQXJCLEVBQTBCLEtBQUssY0FBL0IsQ0FBM0I7QUFDSDs7QUFFRCxpQkFBSyxjQUFMLENBQW9CLFNBQXBCLEdBQWdDLElBQWhDO0FBQ0EsaUJBQUssVUFBTCxHQUFrQixTQUFsQjtBQUNBO0FBQ0g7Ozs7OztBQUdMLE9BQU8sT0FBUCxHQUFpQixhQUFqQjs7Ozs7QUMvQ0EsSUFBTSxnQkFBZ0IsUUFBUSxpQkFBUixDQUF0QjtBQUNBLElBQU0sUUFBUSxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQU0sV0FBVyxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxPQUFPO0FBQ1AsVUFBTSxLQURDO0FBRVAsV0FBTyxJQUZBO0FBR1AsbUJBQWUsSUFIUjtBQUlQLG1CQUFlLElBSlI7QUFLUCxxQkFBaUIsR0FMVjs7QUFPUCxVQUFNLGdCQUFZO0FBQ2QsYUFBSyxLQUFMLEdBQWEsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQWI7QUFDQSxhQUFLLGFBQUwsR0FBcUIsS0FBSyxLQUFMLENBQVcsVUFBaEM7O0FBRUEsWUFBSSxVQUFVLFNBQVMsYUFBVCxDQUF1QixRQUF2QixDQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsSUFBSSxLQUFKLENBQVUsT0FBVixDQUFiOztBQUVBLGFBQUssYUFBTCxHQUFxQixPQUFPLFVBQTVCOztBQUVBLGFBQUssVUFBTDtBQUNBLGlCQUFTLElBQVQsQ0FBYyxNQUFkO0FBQ0EsaUJBQVMsSUFBVCxHQUFnQixJQUFoQjtBQUNBOztBQUVBLGFBQUssVUFBTDs7QUFFQSxZQUFJLGNBQWMsU0FBUyxhQUFULENBQXVCLFdBQXZCLENBQWxCO0FBQ0EsYUFBSyxFQUFMLEdBQVUsSUFBSSxhQUFKLENBQWtCLFdBQWxCLEVBQStCLElBQS9CLENBQVYsQ0FqQmMsQ0FpQmtDO0FBQ25ELEtBekJNOztBQTJCUCxnQkFBWSxzQkFBWTtBQUNwQixlQUFPLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLFVBQVUsR0FBVixFQUFlO0FBQzdDLGlCQUFLLGFBQUwsR0FBcUIsT0FBTyxVQUE1Qjs7QUFFQTs7QUFFQSxvQkFBUSxHQUFSLENBQVksS0FBSyxhQUFqQjtBQUNILFNBTkQ7QUFPSCxLQW5DTTs7QUFxQ1AsZ0JBQVksc0JBQVc7QUFDbkIsWUFBSSxlQUFlLFNBQVMsYUFBVCxDQUF1QixrQkFBdkIsQ0FBbkI7QUFDQSxZQUFJLFNBQVMsS0FBSyxLQUFMLENBQVcsV0FBeEI7QUFDQSxZQUFJLFNBQVMsS0FBSyxLQUFMLENBQVcsVUFBeEI7O0FBRUEsWUFBSSxXQUFXLFNBQVMsTUFBVCxHQUFrQixJQUFqQztBQUNBLFlBQUksYUFBYSxTQUFTLE1BQTFCOztBQUVBO0FBQ0E7O0FBRUEsYUFBSyxJQUFJLElBQUksVUFBYixFQUF5QixJQUFJLFFBQTdCLEVBQXVDLEtBQUssR0FBNUMsRUFBaUQ7QUFDN0MsZ0JBQUksT0FBTyxhQUFhLFNBQWIsRUFBWDtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxJQUFYLEdBQWtCLElBQUksSUFBdEI7QUFDQSxpQkFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixJQUF2QjtBQUNIO0FBQ0osS0FyRE07O0FBdURQLFlBQVEsZ0JBQVUsTUFBVixFQUFrQjtBQUN0QixZQUFJLFlBQVksS0FBSyxhQUFMLEdBQXFCLE1BQXJDO0FBQ0EsYUFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixJQUFqQixHQUF3QixZQUFZLElBQXBDO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLFNBQXJCO0FBQ0gsS0EzRE07O0FBNkRQLFlBQVEsZ0JBQVUsU0FBVixFQUFxQjtBQUN6QjtBQUNBLGFBQUssSUFBTCxHQUFZLFNBQVo7O0FBRUE7QUFDQSxhQUFLLEVBQUwsQ0FBUSxNQUFSLENBQWUsU0FBZjs7QUFFQTtBQUNBLFlBQUksS0FBSyxJQUFMLEtBQWMsSUFBbEIsRUFBd0I7QUFDcEIsaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixLQUFLLEtBQUwsQ0FBVyxLQUFsRDs7QUFFQSxnQkFDSSxLQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQTBCLENBQUMsS0FBSyxhQUFOLEdBQXNCLEtBQUssZUFBckQsSUFDRyxLQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQXlCLEtBQUssS0FBTCxDQUFXLFdBQXBDLEdBQW9ELENBQUMsS0FBSyxhQUFQLEdBQXdCLEtBQUssYUFBN0IsR0FBNkMsS0FBSyxlQUY1RyxFQUdFO0FBQ0UscUJBQUssTUFBTCxDQUFZLENBQUMsS0FBSyxLQUFMLENBQVcsU0FBWixHQUF3QixLQUFLLEtBQUwsQ0FBVyxLQUEvQztBQUNIO0FBQ0o7O0FBRUQsYUFBSyxVQUFMLEdBQWtCLE9BQU8scUJBQVAsQ0FBNkIsS0FBSyxNQUFsQyxDQUFsQjtBQUNILEtBakZNOztBQW1GUCxZQUFRLGtCQUFZO0FBQ2hCO0FBQ0E7QUFDSCxLQXRGTTs7QUF3RlAsc0JBQWtCLEVBeEZYLEVBd0ZlO0FBQ3RCLGNBQVUsSUF6Rkg7QUEwRlAsZ0JBQVksSUExRkw7QUEyRlAsVUFBTSxJQTNGQzs7QUE2RlAsV0FBTyxpQkFBWTtBQUNmLGVBQU8sb0JBQVAsQ0FBNEIsS0FBSyxVQUFqQztBQUNBLHNCQUFjLEtBQUssUUFBbkI7O0FBRUEsYUFBSyxRQUFMLEdBQWdCLFlBQVksS0FBSyxNQUFqQixFQUF5QixLQUFLLGdCQUE5QixDQUFoQjtBQUNBLGFBQUssVUFBTCxHQUFrQixPQUFPLHFCQUFQLENBQTZCLEtBQUssTUFBbEMsQ0FBbEI7QUFDSCxLQW5HTTs7QUFxR1AsVUFBTSxnQkFBWTtBQUNkLGVBQU8sb0JBQVAsQ0FBNEIsS0FBSyxVQUFqQztBQUNBLHNCQUFjLEtBQUssUUFBbkI7O0FBRUEsYUFBSyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0g7QUEzR00sQ0FBWDs7QUE4R0EsT0FBTyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsWUFBWTtBQUNwRCxTQUFLLElBQUw7QUFDQSxTQUFLLEtBQUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsQ0FWRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBLZXlib2FyZCA9IHtcbiAgICBnYW1lOiBudWxsLFxuXG4gICAga2V5RG93bkhhbmRsZXIgKGV2dCkge1xuICAgICAgICBzd2l0Y2goZXZ0LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Rvd24nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzc6XG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuZ2FtZS50cnVjay5kaXJlY3Rpb24gPSAtMTtcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5nYW1lLm1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5nYW1lLnRydWNrLmRpcmVjdGlvbiA9IDE7XG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuZ2FtZS5tb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwJyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDMyOlxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzcGFjZScpO1xuICAgICAgICAgICAgICAgIGlmIChLZXlib2FyZC5nYW1lLmdhbWVMb29wICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIEtleWJvYXJkLmdhbWUuc3RvcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIEtleWJvYXJkLmdhbWUuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2dC5rZXlDb2RlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBrZXlVcEhhbmRsZXIgKGV2dCkge1xuICAgICAgICAvLyBLZXlib2FyZC5nYW1lLm1vdmUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgYmluZCAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlEb3duSGFuZGxlcik7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMua2V5VXBIYW5kbGVyKTtcbiAgICB9LFxuXG4gICAgcmVsZWFzZSAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlEb3duSGFuZGxlcik7XG4gICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMua2V5VXBIYW5kbGVyKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmQ7XG4iLCJjbGFzcyBUcnVjayB7XG4gICAgY29uc3RydWN0b3IgKGNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50ID0gY29udGFpbmVyRWxlbWVudDtcbiAgICAgICAgdGhpcy5zdmcgPSB0aGlzLmNvbnRhaW5lckVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG5cbiAgICAgICAgdGhpcy50cnVja0xlbmd0aCA9IHRoaXMuY29udGFpbmVyRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgdGhpcy50cnVja09mZnNldCA9IHRoaXMuY29udGFpbmVyRWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICB0aGlzLmluaXRpYWxPZmZzZXQgPSB0aGlzLnRydWNrT2Zmc2V0O1xuXG4gICAgICAgIHRoaXMuc3BlZWQgPSA1O1xuXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IDE7XG4gICAgfVxuXG4gICAgc2V0IHggKHZhbHVlKSB7XG4gICAgICAgIHRoaXMudHJ1Y2tPZmZzZXQgPSB0aGlzLmluaXRpYWxPZmZzZXQgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50LnN0eWxlLmxlZnQgPSB0aGlzLnRydWNrT2Zmc2V0ICsgJ3B4JztcbiAgICB9XG5cbiAgICBnZXQgeCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRydWNrT2Zmc2V0IC0gdGhpcy5pbml0aWFsT2Zmc2V0O1xuICAgIH1cblxuICAgIHNldCBkaXJlY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnN2Zy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3RyYW5zZm9ybTogc2NhbGVYKCcrdmFsdWUrJyk7IHRyYW5zaXRpb246IC4xcycpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBkaXJlY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlyZWN0aW9uO1xuICAgIH1cblxuICAgIG1vdmUgKGFtb3VudCkge1xuICAgICAgICB0aGlzLnggKz0gYW1vdW50O1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcnVjaztcbiIsIk9iamVjdC5yZXNvbHZlID0gZnVuY3Rpb24ocGF0aCwgb2JqKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3Vycikge1xuICAgICAgICByZXR1cm4gcHJldiA/IHByZXZbY3Vycl0gOiB1bmRlZmluZWRcbiAgICB9LCBvYmogfHwgc2VsZilcbn1cblxuY2xhc3MgVXNlckludGVyZmFjZSB7XG4gICAgY29uc3RydWN0b3IgKGNvbnRhaW5lckVsZW1lbnQsIHN0YXRlQ29udGFpbmVyKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWxlbWVudCA9IGNvbnRhaW5lckVsZW1lbnQ7XG4gICAgICAgIHRoaXMuc3RhdGVDb250YWluZXIgPSBzdGF0ZUNvbnRhaW5lcjtcblxuICAgICAgICB0aGlzLmh1ZENvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjaHVkJyk7XG4gICAgICAgIHRoaXMudmFsdWVDb250YWluZXIgPSB0aGlzLmh1ZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCd1bCcpO1xuXG4gICAgICAgIHRoaXMuaHVkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXJOYW1lJykuaW5uZXJIVE1MID0gJ1BsYXllciBOYW1lJztcbiAgICAgICAgdGhpcy5odWRWYWx1ZXMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ2xhYmVsJzogJ3Bvc2l0aW9uJyxcbiAgICAgICAgICAgICAgICAndmFsJzogJ3RydWNrLngnLFxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIHRoaXMudXBkYXRlSW50ZXJ2YWwgPSAyMDA7IC8vIDVmcHNcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gLXRoaXMudXBkYXRlSW50ZXJ2YWw7XG4gICAgICAgIHRoaXMucmVuZGVyKDApO1xuICAgIH1cblxuICAgIHJlbmRlciAodGltZXN0YW1wKSB7XG4gICAgICAgIC8vIFRPRE86IGhhbmRsZSBvdXRzaWRlLi4uXG4gICAgICAgIGlmICh0aGlzLmxhc3RVcGRhdGUgPiB0aW1lc3RhbXAgLSB0aGlzLnVwZGF0ZUludGVydmFsKSByZXR1cm47XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LnJlc29sdmUodGhpcy5odWRWYWx1ZXNbMF0udmFsLCBnYW1lKSk7XG5cbiAgICAgICAgbGV0IGxpc3QgPSAnJztcblxuICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuaHVkVmFsdWVzKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmh1ZFZhbHVlc1tpXTtcblxuICAgICAgICAgICAgbGlzdCArPSBgJHt2YWx1ZS5sYWJlbH06ICR7T2JqZWN0LnJlc29sdmUodmFsdWUudmFsLCB0aGlzLnN0YXRlQ29udGFpbmVyKX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52YWx1ZUNvbnRhaW5lci5pbm5lckhUTUwgPSBsaXN0O1xuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSB0aW1lc3RhbXA7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd1aSB1cGRhdGUnLCB0aW1lc3RhbXApO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VySW50ZXJmYWNlO1xuIiwiY29uc3QgVXNlckludGVyZmFjZSA9IHJlcXVpcmUoJy4vVXNlckludGVyZmFjZScpO1xuY29uc3QgVHJ1Y2sgPSByZXF1aXJlKCcuL1RydWNrJyk7XG5jb25zdCBLZXlib2FyZCA9IHJlcXVpcmUoJy4vS2V5Ym9hcmQnKTtcblxudmFyIGdhbWUgPSB7XG4gICAgbW92ZTogZmFsc2UsXG4gICAgbGF5ZXI6IG51bGwsXG4gICAgY3VycmVudE9mZnNldDogbnVsbCxcbiAgICB2aWV3cG9ydFdpZHRoOiBudWxsLFxuICAgIHZpZXdQb3J0UGFkZGluZzogMTAwLFxuXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBnYW1lLmxheWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xheWVyLTAnKTtcbiAgICAgICAgZ2FtZS5jdXJyZW50T2Zmc2V0ID0gZ2FtZS5sYXllci5vZmZzZXRMZWZ0O1xuXG4gICAgICAgIGxldCB0cnVja0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VzZXIxJyk7XG4gICAgICAgIGdhbWUudHJ1Y2sgPSBuZXcgVHJ1Y2sodHJ1Y2tFbCk7XG5cbiAgICAgICAgZ2FtZS52aWV3cG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICAgICAgZ2FtZS5wbGFjZVBvc3RzKCk7XG4gICAgICAgIEtleWJvYXJkLmJpbmQod2luZG93KTtcbiAgICAgICAgS2V5Ym9hcmQuZ2FtZSA9IHRoaXM7XG4gICAgICAgIC8vIFRPRE86IGFkZCBjb250cm9scyBsYXllciwga2V5Ym9hcmQgKG90aGVyIG90aGVyIGlucHV0cykgY2FsbCBtZXRob2RzIHRoZXJlXG5cbiAgICAgICAgZ2FtZS5iaW5kUmVzaXplKCk7XG5cbiAgICAgICAgbGV0IHVpQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xheWVyLXVpJyk7XG4gICAgICAgIGdhbWUudWkgPSBuZXcgVXNlckludGVyZmFjZSh1aUNvbnRhaW5lciwgdGhpcyk7IC8vIHRoaXMgPSBzdGF0ZUNvbnRhaW5lciBhdG1cbiAgICB9LFxuXG4gICAgYmluZFJlc2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgZ2FtZS52aWV3cG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IGlmIHRydWNrIGlzIG91dHNpZGUgYm91bmRzLCBtb3ZlIHdvcmxkXG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGdhbWUudmlld3BvcnRXaWR0aCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBwbGFjZVBvc3RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBvc3RUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wbGF0ZXMgLnBvc3QnKTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IGdhbWUubGF5ZXIub2Zmc2V0V2lkdGg7XG4gICAgICAgIHZhciBvZmZzZXQgPSBnYW1lLmxheWVyLm9mZnNldExlZnQ7XG5cbiAgICAgICAgdmFyIGNodW5rRW5kID0gbGVuZ3RoICsgb2Zmc2V0ICsgNDAwMDtcbiAgICAgICAgdmFyIGNodW5rU3RhcnQgPSBsZW5ndGggKyBvZmZzZXQ7XG5cbiAgICAgICAgLy8gdmFyIGNodW5rRW5kID0gbGVuZ3RoO1xuICAgICAgICAvLyB2YXIgY2h1bmtTdGFydCA9IDA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IGNodW5rU3RhcnQ7IGkgPCBjaHVua0VuZDsgaSArPSAyMDApIHtcbiAgICAgICAgICAgIHZhciBwb3N0ID0gcG9zdFRlbXBsYXRlLmNsb25lTm9kZSgpO1xuICAgICAgICAgICAgcG9zdC5zdHlsZS5sZWZ0ID0gaSArICdweCc7XG4gICAgICAgICAgICBnYW1lLmxheWVyLmFwcGVuZENoaWxkKHBvc3QpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNjcm9sbDogZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICB2YXIgbmV3T2Zmc2V0ID0gZ2FtZS5jdXJyZW50T2Zmc2V0ICsgYW1vdW50O1xuICAgICAgICBnYW1lLmxheWVyLnN0eWxlLmxlZnQgPSBuZXdPZmZzZXQgKyAncHgnO1xuICAgICAgICBnYW1lLmN1cnJlbnRPZmZzZXQgPSBuZXdPZmZzZXQ7XG4gICAgfSxcblxuICAgIGFmU3RlcDogZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZnJhbWV0aW1lOicsIHRpbWVzdGFtcCAtIGdhbWUuYWZUcyk7XG4gICAgICAgIGdhbWUuYWZUcyA9IHRpbWVzdGFtcDtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhnYW1lLmFmVHMpO1xuICAgICAgICBnYW1lLnVpLnJlbmRlcih0aW1lc3RhbXApO1xuXG4gICAgICAgIC8vIFRPRE86IGFzc3VtZSB1cGRhdGVcbiAgICAgICAgaWYgKGdhbWUubW92ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZ2FtZS50cnVjay5tb3ZlKGdhbWUudHJ1Y2suZGlyZWN0aW9uICogZ2FtZS50cnVjay5zcGVlZCk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBnYW1lLnRydWNrLnRydWNrT2Zmc2V0IDwgKC1nYW1lLmN1cnJlbnRPZmZzZXQgKyBnYW1lLnZpZXdQb3J0UGFkZGluZylcbiAgICAgICAgICAgICAgICB8fCBnYW1lLnRydWNrLnRydWNrT2Zmc2V0ICsgZ2FtZS50cnVjay50cnVja0xlbmd0aCA+ICgoLWdhbWUuY3VycmVudE9mZnNldCkgKyBnYW1lLnZpZXdwb3J0V2lkdGggLSBnYW1lLnZpZXdQb3J0UGFkZGluZylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGdhbWUuc2Nyb2xsKC1nYW1lLnRydWNrLmRpcmVjdGlvbiAqIGdhbWUudHJ1Y2suc3BlZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2FtZS5hZkNhbGxiYWNrID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lLmFmU3RlcCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBnYW1lIHVwZGF0ZVxuICAgICAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlJyk7XG4gICAgfSxcblxuICAgIGdhbWVMb29wSW50ZXJ2YWw6IDIwLCAvLyA1MGZwc1xuICAgIGdhbWVMb29wOiBudWxsLFxuICAgIGFmQ2FsbGJhY2s6IG51bGwsXG4gICAgYWZUczogbnVsbCxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShnYW1lLmFmQ2FsbGJhY2spO1xuICAgICAgICBjbGVhckludGVydmFsKGdhbWUuZ2FtZUxvb3ApO1xuXG4gICAgICAgIGdhbWUuZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbChnYW1lLnVwZGF0ZSwgZ2FtZS5nYW1lTG9vcEludGVydmFsKTtcbiAgICAgICAgZ2FtZS5hZkNhbGxiYWNrID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lLmFmU3RlcCk7XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGdhbWUuYWZDYWxsYmFjayk7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoZ2FtZS5nYW1lTG9vcCk7XG5cbiAgICAgICAgZ2FtZS5hZkNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgZ2FtZS5nYW1lTG9vcCA9IG51bGw7XG4gICAgfVxufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgZ2FtZS5pbml0KCk7XG4gICAgZ2FtZS5zdGFydCgpO1xuXG4gICAgLy8gVE9ETzpcbiAgICAvLyBhbmltYXRpb24gc3RhcnQgdGltZVxuICAgIC8vIG1vdmUgb2JqZWN0IHRvIHRhcmdldCBwb3NpdGlvbiBwZXIgdGltZSBpbnRlcnZhbCwgcmVsYXRpdmUgdG8gc3BlZWRcbiAgICAvLyBjb250cm9scyBzZXQgb2JqZWN0IHRhcmdldCBwb3NpdGlvbiwgcmVsYXRpdmUgdG8gc3BlZWRcbiAgICAvLyBzdXNwZW5kIC8gcmVzdW1lIGFuaW1hdGlvbnNcbiAgICAvLyBzdXNwZW5kIC8gcmVzdW1lIGdhbWUgdXBkYXRlc1xufSk7XG4iXX0=
