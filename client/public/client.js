(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Keyboard = {
    game: null,

    keyDownHandler(evt) {
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

    keyUpHandler(evt) {
        // Keyboard.game.move = false;
    },

    bind(target) {
        target.addEventListener('keydown', this.keyDownHandler);
        target.addEventListener('keyup', this.keyUpHandler);
    },

    release(target) {
        target.removeEventListener('keydown', this.keyDownHandler);
        target.removeEventListener('keyup', this.keyUpHandler);
    }
};

module.exports = Keyboard;

},{}],2:[function(require,module,exports){
const templates = require('./Templates');

class Layer {
    // dynamic objects
    // static objects
    // as indexedarrays?
    // generated objects
    // as generators?
    constructor(containerElement, scrollFactor = 1) {
        this.containerElement = containerElement;
        this.scrollFactor = scrollFactor;

        this.width = this.containerElement.offsetWidth;
        this.initialOffset = this.containerElement.offsetLeft;
        this.currentOffset = this.initialOffset;

        this.dynamicObjects = [];
        this.activeObjects = [];

        // this.update();
    }

    update() {
        let chunkStart = this.width + this.currentOffset;
        let chunkEnd = chunkStart + 4000;
        this.ensureChunk(chunkStart, chunkEnd);
    }

    // TODO: paint debug chunks
    ensureChunk(start, end) {
        // find dynamic objects in chunk range
        for (let item of this.dynamicObjects) {
            if (item.currentOffset < start || item.currentOffset > end) {
                continue; // TODO: remove
            }
            this.add(item);

            // console.log(this.activeObjects.indexOf(item));
            // console.log(this.dynamicObjects.indexOf(item));
            // console.log(this.dynamicObjects[0] === this.activeObjects[0]);
        }

        // find static objects in chunk range

        // generate objects in chunk range
        this.generatePosts(start, end, 200);
    }

    // TODO: index mgmt
    add(item) {
        item.active = true;
        this.activeObjects.push(item);
        this.containerElement.appendChild(item.element);
    }

    remove(item) {
        item.active = false;
        console.log(this.activeObjects.indexOf(item)); // TODO: splice from arr
        console.log(this.dynamicObjects.indexOf(item));
        this.containerElement.removeChild(item);
    }

    addDynamic(item) {
        // verify
        if (typeof item.x === 'undefined') return false;
        if (typeof item.element === 'undefined') return false;

        this.dynamicObjects.push(item);
    }

    // destroy () {}

    scroll(amount) {
        var newOffset = this.currentOffset + Math.round(amount * this.scrollFactor);
        if (this.currentOffset === newOffset) return;

        this.containerElement.style.left = newOffset + 'px';
        this.currentOffset = newOffset;
    }

    generatePosts(start, end, distance) {
        for (let i = start; i < end; i += distance) {
            let post = templates.get('post');
            post.style.left = i + 'px';
            this.containerElement.appendChild(post);
        }
    }
}

module.exports = Layer;

},{"./Templates":3}],3:[function(require,module,exports){
const Templates = {
    containerElement: null,
    templates: {},

    load(containerElement) {
        this.containerElement = containerElement;

        // iterate over children
        for (let template of this.containerElement.children) {
            let name = template.className;

            if (typeof this.templates[name] !== 'undefined') {
                throw Error(`Template error: cannot load "${name}" twice!`);
            }

            this.templates[name] = template;
            // TODO: template configuration / strings (lazy?)
        }
    },

    get(identifier) {
        if (this.containerElement === null) {
            throw Error('Template error: no templates loaded');
        }

        if (typeof this.templates[identifier] === 'undefined') {
            throw Error(`Argument error: template "${identifier}" not found`);
        }

        return this.templates[identifier].cloneNode(true);
    }
};

module.exports = Templates;

},{}],4:[function(require,module,exports){
class Truck {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.svg = this.containerElement.querySelector('svg');
        // this.width = this.containerElement.offsetWidth;
        this.width = 100;

        // TODO: initial offest = x = 0 = game center, not truck css position
        // this.initialOffset = this.containerElement.offsetLeft;
        this.initialOffset = 20100;
        this.currentOffset = this.initialOffset;
        this.speed = 5;
        this._x = 0;
        this._direction = 1;
    }

    set x(value) {
        this.currentOffset = this.initialOffset + value;
        this.containerElement.style.left = this.currentOffset + 'px'; // TODO: only if 'active' on layer
        this._x = value;
    }

    get x() {
        // return this.currentOffset - this.initialOffset;
        return this._x;
    }

    set direction(value) {
        if (this._direction !== value) {
            this.svg.setAttribute('style', 'transform: scaleX(' + value + '); transition: .1s');
        }
        this._direction = value;
    }

    get direction() {
        return this._direction;
    }

    move(amount) {
        this.x += amount;
    }

    get element() {
        return this.containerElement;
    }
}

module.exports = Truck;

},{}],5:[function(require,module,exports){
Object.resolve = function (path, obj) {
    return path.split('.').reduce(function (prev, curr) {
        return prev ? prev[curr] : undefined;
    }, obj || self);
};

class UserInterface {
    constructor(containerElement, stateContainer) {
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

    render(timestamp) {
        // TODO: handle outside...
        if (this.lastUpdate > timestamp - this.updateInterval) return;

        // console.log(Object.resolve(this.hudValues[0].val, game));

        let list = '';

        for (let i in this.hudValues) {
            let value = this.hudValues[i];

            list += `${value.label}: ${Object.resolve(value.val, this.stateContainer)}`;
        }

        this.valueContainer.innerHTML = list;
        this.lastUpdate = timestamp;
        // console.log('ui update', timestamp);
    }
}

module.exports = UserInterface;

},{}],6:[function(require,module,exports){
const UserInterface = require('./UserInterface');
const Truck = require('./Truck');
const Keyboard = require('./Keyboard');
const Layer = require('./Layer');
const templates = require('./Templates');

var game = {
    debug: false,
    move: true,
    layer: null,
    currentOffset: null,
    viewportWidth: null,
    viewPortPadding: 100,

    init: function () {
        templates.load(document.querySelector('#templates'));

        let layer0 = document.querySelector('#layer-0');
        game.layer = new Layer(layer0);

        // generate truck from data + template
        let truckEl = templates.get('truck');
        truckEl.id = "user1";
        game.truck = new Truck(truckEl);
        game.layer.addDynamic(game.truck);
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
            if (game.truck.currentOffset < -game.currentOffset + game.viewPortPadding || game.truck.currentOffset + game.truck.width > -game.currentOffset + game.viewportWidth - game.viewPortPadding) {
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

},{"./Keyboard":1,"./Layer":2,"./Templates":3,"./Truck":4,"./UserInterface":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvc3JjL0tleWJvYXJkLmpzIiwiY2xpZW50L3NyYy9MYXllci5qcyIsImNsaWVudC9zcmMvVGVtcGxhdGVzLmpzIiwiY2xpZW50L3NyYy9UcnVjay5qcyIsImNsaWVudC9zcmMvVXNlckludGVyZmFjZS5qcyIsImNsaWVudC9zcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE1BQU0sV0FBVztBQUNiLFVBQU0sSUFETzs7QUFHYixtQkFBZ0IsR0FBaEIsRUFBcUI7QUFDakIsZ0JBQU8sSUFBSSxPQUFYO0FBQ0ksaUJBQUssRUFBTDtBQUNJLHdCQUFRLEdBQVIsQ0FBWSxNQUFaO0FBQ0E7QUFDSixpQkFBSyxFQUFMO0FBQ0kseUJBQVMsSUFBVCxDQUFjLEtBQWQsQ0FBb0IsU0FBcEIsR0FBZ0MsQ0FBQyxDQUFqQztBQUNBLHlCQUFTLElBQVQsQ0FBYyxJQUFkLEdBQXFCLElBQXJCO0FBQ0E7QUFDSixpQkFBSyxFQUFMO0FBQ0kseUJBQVMsSUFBVCxDQUFjLEtBQWQsQ0FBb0IsU0FBcEIsR0FBZ0MsQ0FBaEM7QUFDQSx5QkFBUyxJQUFULENBQWMsSUFBZCxHQUFxQixJQUFyQjtBQUNBO0FBQ0osaUJBQUssRUFBTDtBQUNJLHdCQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0E7QUFDSixpQkFBSyxFQUFMO0FBQ0k7QUFDQSxvQkFBSSxTQUFTLElBQVQsQ0FBYyxRQUFkLEtBQTJCLElBQS9CLEVBQXFDO0FBQ2pDLDZCQUFTLElBQVQsQ0FBYyxJQUFkO0FBQ0gsaUJBRkQsTUFFTztBQUNILDZCQUFTLElBQVQsQ0FBYyxLQUFkO0FBQ0g7QUFDRDtBQUNKO0FBQ0ksd0JBQVEsR0FBUixDQUFZLElBQUksT0FBaEI7QUF4QlI7QUEwQkgsS0E5Qlk7O0FBZ0NiLGlCQUFjLEdBQWQsRUFBbUI7QUFDZjtBQUNILEtBbENZOztBQW9DYixTQUFNLE1BQU4sRUFBYztB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LFNBQUssSUFBTDtBQUNBLFNBQUssS0FBTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSCxDQVZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IEtleWJvYXJkID0ge1xuICAgIGdhbWU6IG51bGwsXG5cbiAgICBrZXlEb3duSGFuZGxlciAoZXZ0KSB7XG4gICAgICAgIHN3aXRjaChldnQua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZG93bicpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzNzpcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5nYW1lLnRydWNrLmRpcmVjdGlvbiA9IC0xO1xuICAgICAgICAgICAgICAgIEtleWJvYXJkLmdhbWUubW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgIEtleWJvYXJkLmdhbWUudHJ1Y2suZGlyZWN0aW9uID0gMTtcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5nYW1lLm1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndXAnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzI6XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3NwYWNlJyk7XG4gICAgICAgICAgICAgICAgaWYgKEtleWJvYXJkLmdhbWUuZ2FtZUxvb3AgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgS2V5Ym9hcmQuZ2FtZS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgS2V5Ym9hcmQuZ2FtZS5zdGFydCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZ0LmtleUNvZGUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGtleVVwSGFuZGxlciAoZXZ0KSB7XG4gICAgICAgIC8vIEtleWJvYXJkLmdhbWUubW92ZSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBiaW5kICh0YXJnZXQpIHtcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleURvd25IYW5kbGVyKTtcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5rZXlVcEhhbmRsZXIpO1xuICAgIH0sXG5cbiAgICByZWxlYXNlICh0YXJnZXQpIHtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleURvd25IYW5kbGVyKTtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5rZXlVcEhhbmRsZXIpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZDtcbiIsImNvbnN0IHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vVGVtcGxhdGVzJyk7XG5cbmNsYXNzIExheWVyIHtcbiAgICAvLyBkeW5hbWljIG9iamVjdHNcbiAgICAvLyBzdGF0aWMgb2JqZWN0c1xuICAgIC8vIGFzIGluZGV4ZWRhcnJheXM/XG4gICAgLy8gZ2VuZXJhdGVkIG9iamVjdHNcbiAgICAvLyBhcyBnZW5lcmF0b3JzP1xuICAgIGNvbnN0cnVjdG9yIChjb250YWluZXJFbGVtZW50LCBzY3JvbGxGYWN0b3IgPSAxKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWxlbWVudCA9IGNvbnRhaW5lckVsZW1lbnQ7XG4gICAgICAgIHRoaXMuc2Nyb2xsRmFjdG9yID0gc2Nyb2xsRmFjdG9yO1xuXG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNvbnRhaW5lckVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIHRoaXMuaW5pdGlhbE9mZnNldCA9IHRoaXMuY29udGFpbmVyRWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXQgPSB0aGlzLmluaXRpYWxPZmZzZXQ7XG5cbiAgICAgICAgdGhpcy5keW5hbWljT2JqZWN0cyA9IFtdO1xuICAgICAgICB0aGlzLmFjdGl2ZU9iamVjdHMgPSBbXTtcblxuICAgICAgICAvLyB0aGlzLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZSAoKSB7XG4gICAgICAgIGxldCBjaHVua1N0YXJ0ID0gdGhpcy53aWR0aCArIHRoaXMuY3VycmVudE9mZnNldDtcbiAgICAgICAgbGV0IGNodW5rRW5kID0gY2h1bmtTdGFydCArIDQwMDA7XG4gICAgICAgIHRoaXMuZW5zdXJlQ2h1bmsoY2h1bmtTdGFydCwgY2h1bmtFbmQpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHBhaW50IGRlYnVnIGNodW5rc1xuICAgIGVuc3VyZUNodW5rIChzdGFydCwgZW5kKSB7XG4gICAgICAgIC8vIGZpbmQgZHluYW1pYyBvYmplY3RzIGluIGNodW5rIHJhbmdlXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5keW5hbWljT2JqZWN0cykge1xuICAgICAgICAgICAgaWYgKGl0ZW0uY3VycmVudE9mZnNldCA8IHN0YXJ0IHx8IGl0ZW0uY3VycmVudE9mZnNldCA+IGVuZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBUT0RPOiByZW1vdmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWRkKGl0ZW0pO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmFjdGl2ZU9iamVjdHMuaW5kZXhPZihpdGVtKSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmR5bmFtaWNPYmplY3RzLmluZGV4T2YoaXRlbSkpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5keW5hbWljT2JqZWN0c1swXSA9PT0gdGhpcy5hY3RpdmVPYmplY3RzWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpbmQgc3RhdGljIG9iamVjdHMgaW4gY2h1bmsgcmFuZ2VcblxuICAgICAgICAvLyBnZW5lcmF0ZSBvYmplY3RzIGluIGNodW5rIHJhbmdlXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQb3N0cyhzdGFydCwgZW5kLCAyMDApO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGluZGV4IG1nbXRcbiAgICBhZGQgKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmFjdGl2ZU9iamVjdHMucHVzaChpdGVtKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGl0ZW0uZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlIChpdGVtKSB7XG4gICAgICAgIGl0ZW0uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYWN0aXZlT2JqZWN0cy5pbmRleE9mKGl0ZW0pKTsgLy8gVE9ETzogc3BsaWNlIGZyb20gYXJyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZHluYW1pY09iamVjdHMuaW5kZXhPZihpdGVtKSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWxlbWVudC5yZW1vdmVDaGlsZChpdGVtKTtcbiAgICB9XG5cbiAgICBhZGREeW5hbWljIChpdGVtKSB7XG4gICAgICAgIC8vIHZlcmlmeVxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0ueCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5keW5hbWljT2JqZWN0cy5wdXNoKGl0ZW0pO1xuICAgIH1cblxuICAgIC8vIGRlc3Ryb3kgKCkge31cblxuICAgIHNjcm9sbCAoYW1vdW50KSB7XG4gICAgICAgIHZhciBuZXdPZmZzZXQgPSB0aGlzLmN1cnJlbnRPZmZzZXQgKyBNYXRoLnJvdW5kKGFtb3VudCAqIHRoaXMuc2Nyb2xsRmFjdG9yKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9mZnNldCA9PT0gbmV3T2Zmc2V0KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50LnN0eWxlLmxlZnQgPSBuZXdPZmZzZXQgKyAncHgnO1xuICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXQgPSBuZXdPZmZzZXQ7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVQb3N0cyAoc3RhcnQsIGVuZCwgZGlzdGFuY2UpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IGRpc3RhbmNlKSB7XG4gICAgICAgICAgICBsZXQgcG9zdCA9IHRlbXBsYXRlcy5nZXQoJ3Bvc3QnKTtcbiAgICAgICAgICAgIHBvc3Quc3R5bGUubGVmdCA9IGkgKyAncHgnO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKHBvc3QpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyO1xuIiwiY29uc3QgVGVtcGxhdGVzID0ge1xuICAgIGNvbnRhaW5lckVsZW1lbnQ6IG51bGwsXG4gICAgdGVtcGxhdGVzOiB7fSxcblxuICAgIGxvYWQgKGNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50ID0gY29udGFpbmVyRWxlbWVudDtcblxuICAgICAgICAvLyBpdGVyYXRlIG92ZXIgY2hpbGRyZW5cbiAgICAgICAgZm9yIChsZXQgdGVtcGxhdGUgb2YgdGhpcy5jb250YWluZXJFbGVtZW50LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IHRlbXBsYXRlLmNsYXNzTmFtZTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnRlbXBsYXRlc1tuYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihgVGVtcGxhdGUgZXJyb3I6IGNhbm5vdCBsb2FkIFwiJHtuYW1lfVwiIHR3aWNlIWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1tuYW1lXSA9IHRlbXBsYXRlO1xuICAgICAgICAgICAgLy8gVE9ETzogdGVtcGxhdGUgY29uZmlndXJhdGlvbiAvIHN0cmluZ3MgKGxhenk/KVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldCAoaWRlbnRpZmllcikge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXJFbGVtZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVGVtcGxhdGUgZXJyb3I6IG5vIHRlbXBsYXRlcyBsb2FkZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy50ZW1wbGF0ZXNbaWRlbnRpZmllcl0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgQXJndW1lbnQgZXJyb3I6IHRlbXBsYXRlIFwiJHtpZGVudGlmaWVyfVwiIG5vdCBmb3VuZGApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzW2lkZW50aWZpZXJdLmNsb25lTm9kZSh0cnVlKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGVtcGxhdGVzO1xuIiwiY2xhc3MgVHJ1Y2sge1xuICAgIGNvbnN0cnVjdG9yIChjb250YWluZXJFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWxlbWVudCA9IGNvbnRhaW5lckVsZW1lbnQ7XG4gICAgICAgIHRoaXMuc3ZnID0gdGhpcy5jb250YWluZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgICAvLyB0aGlzLndpZHRoID0gdGhpcy5jb250YWluZXJFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICB0aGlzLndpZHRoID0gMTAwO1xuXG4gICAgICAgIC8vIFRPRE86IGluaXRpYWwgb2ZmZXN0ID0geCA9IDAgPSBnYW1lIGNlbnRlciwgbm90IHRydWNrIGNzcyBwb3NpdGlvblxuICAgICAgICAvLyB0aGlzLmluaXRpYWxPZmZzZXQgPSB0aGlzLmNvbnRhaW5lckVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgdGhpcy5pbml0aWFsT2Zmc2V0ID0gMjAxMDA7XG4gICAgICAgIHRoaXMuY3VycmVudE9mZnNldCA9IHRoaXMuaW5pdGlhbE9mZnNldDtcbiAgICAgICAgdGhpcy5zcGVlZCA9IDU7XG4gICAgICAgIHRoaXMuX3ggPSAwO1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAxO1xuICAgIH1cblxuICAgIHNldCB4ICh2YWx1ZSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXQgPSB0aGlzLmluaXRpYWxPZmZzZXQgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50LnN0eWxlLmxlZnQgPSB0aGlzLmN1cnJlbnRPZmZzZXQgKyAncHgnOyAvLyBUT0RPOiBvbmx5IGlmICdhY3RpdmUnIG9uIGxheWVyXG4gICAgICAgIHRoaXMuX3ggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgeCAoKSB7XG4gICAgICAgIC8vIHJldHVybiB0aGlzLmN1cnJlbnRPZmZzZXQgLSB0aGlzLmluaXRpYWxPZmZzZXQ7XG4gICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgIH1cblxuICAgIHNldCBkaXJlY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnN2Zy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3RyYW5zZm9ybTogc2NhbGVYKCcrdmFsdWUrJyk7IHRyYW5zaXRpb246IC4xcycpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBkaXJlY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlyZWN0aW9uO1xuICAgIH1cblxuICAgIG1vdmUgKGFtb3VudCkge1xuICAgICAgICB0aGlzLnggKz0gYW1vdW50O1xuICAgIH1cblxuICAgIGdldCBlbGVtZW50ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyRWxlbWVudDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJ1Y2s7XG4iLCJPYmplY3QucmVzb2x2ZSA9IGZ1bmN0aW9uKHBhdGgsIG9iaikge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cnIpIHtcbiAgICAgICAgcmV0dXJuIHByZXYgPyBwcmV2W2N1cnJdIDogdW5kZWZpbmVkXG4gICAgfSwgb2JqIHx8IHNlbGYpXG59XG5cbmNsYXNzIFVzZXJJbnRlcmZhY2Uge1xuICAgIGNvbnN0cnVjdG9yIChjb250YWluZXJFbGVtZW50LCBzdGF0ZUNvbnRhaW5lcikge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnQgPSBjb250YWluZXJFbGVtZW50O1xuICAgICAgICB0aGlzLnN0YXRlQ29udGFpbmVyID0gc3RhdGVDb250YWluZXI7XG5cbiAgICAgICAgdGhpcy5odWRDb250YWluZXIgPSB0aGlzLmNvbnRhaW5lckVsZW1lbnQucXVlcnlTZWxlY3RvcignI2h1ZCcpO1xuICAgICAgICB0aGlzLnZhbHVlQ29udGFpbmVyID0gdGhpcy5odWRDb250YWluZXIucXVlcnlTZWxlY3RvcigndWwnKTtcblxuICAgICAgICB0aGlzLmh1ZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjcGxheWVyTmFtZScpLmlubmVySFRNTCA9ICdQbGF5ZXIgTmFtZSc7XG4gICAgICAgIHRoaXMuaHVkVmFsdWVzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdsYWJlbCc6ICdwb3NpdGlvbicsXG4gICAgICAgICAgICAgICAgJ3ZhbCc6ICd0cnVjay54JyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUludGVydmFsID0gMjAwOyAvLyA1ZnBzXG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IC10aGlzLnVwZGF0ZUludGVydmFsO1xuICAgICAgICB0aGlzLnJlbmRlcigwKTtcbiAgICB9XG5cbiAgICByZW5kZXIgKHRpbWVzdGFtcCkge1xuICAgICAgICAvLyBUT0RPOiBoYW5kbGUgb3V0c2lkZS4uLlxuICAgICAgICBpZiAodGhpcy5sYXN0VXBkYXRlID4gdGltZXN0YW1wIC0gdGhpcy51cGRhdGVJbnRlcnZhbCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5yZXNvbHZlKHRoaXMuaHVkVmFsdWVzWzBdLnZhbCwgZ2FtZSkpO1xuXG4gICAgICAgIGxldCBsaXN0ID0gJyc7XG5cbiAgICAgICAgZm9yIChsZXQgaSBpbiB0aGlzLmh1ZFZhbHVlcykge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5odWRWYWx1ZXNbaV07XG5cbiAgICAgICAgICAgIGxpc3QgKz0gYCR7dmFsdWUubGFiZWx9OiAke09iamVjdC5yZXNvbHZlKHZhbHVlLnZhbCwgdGhpcy5zdGF0ZUNvbnRhaW5lcil9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmFsdWVDb250YWluZXIuaW5uZXJIVE1MID0gbGlzdDtcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gdGltZXN0YW1wO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndWkgdXBkYXRlJywgdGltZXN0YW1wKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlckludGVyZmFjZTtcbiIsImNvbnN0IFVzZXJJbnRlcmZhY2UgPSByZXF1aXJlKCcuL1VzZXJJbnRlcmZhY2UnKTtcbmNvbnN0IFRydWNrID0gcmVxdWlyZSgnLi9UcnVjaycpO1xuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuL0tleWJvYXJkJyk7XG5jb25zdCBMYXllciA9IHJlcXVpcmUoJy4vTGF5ZXInKTtcbmNvbnN0IHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vVGVtcGxhdGVzJyk7XG5cbnZhciBnYW1lID0ge1xuICAgIGRlYnVnOiBmYWxzZSxcbiAgICBtb3ZlOiB0cnVlLFxuICAgIGxheWVyOiBudWxsLFxuICAgIGN1cnJlbnRPZmZzZXQ6IG51bGwsXG4gICAgdmlld3BvcnRXaWR0aDogbnVsbCxcbiAgICB2aWV3UG9ydFBhZGRpbmc6IDEwMCxcblxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGVtcGxhdGVzLmxvYWQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXBsYXRlcycpKTtcblxuICAgICAgICBsZXQgbGF5ZXIwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xheWVyLTAnKTtcbiAgICAgICAgZ2FtZS5sYXllciA9IG5ldyBMYXllcihsYXllcjApO1xuXG4gICAgICAgIC8vIGdlbmVyYXRlIHRydWNrIGZyb20gZGF0YSArIHRlbXBsYXRlXG4gICAgICAgIGxldCB0cnVja0VsID0gdGVtcGxhdGVzLmdldCgndHJ1Y2snKTtcbiAgICAgICAgdHJ1Y2tFbC5pZCA9IFwidXNlcjFcIjtcbiAgICAgICAgZ2FtZS50cnVjayA9IG5ldyBUcnVjayh0cnVja0VsKTtcbiAgICAgICAgZ2FtZS5sYXllci5hZGREeW5hbWljKGdhbWUudHJ1Y2spO1xuICAgICAgICBnYW1lLmxheWVyLnVwZGF0ZSgpO1xuXG4gICAgICAgIGxldCB1aUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsYXllci11aScpO1xuICAgICAgICBnYW1lLnVpID0gbmV3IFVzZXJJbnRlcmZhY2UodWlDb250YWluZXIsIHRoaXMpOyAvLyB0aGlzID0gc3RhdGVDb250YWluZXIgYXRtXG5cbiAgICAgICAgS2V5Ym9hcmQuYmluZCh3aW5kb3cpO1xuICAgICAgICBLZXlib2FyZC5nYW1lID0gdGhpcztcbiAgICAgICAgLy8gVE9ETzogYWRkIGNvbnRyb2xzIGxheWVyLCBrZXlib2FyZCAob3RoZXIgb3RoZXIgaW5wdXRzKSBkaXNwYXRjaCBtZXRob2RzIHRoZXJlXG5cbiAgICAgICAgLy8gVE9ETzogdmlld3BvcnQgbWdtdCwgZ2FtZSB4ID0gMFxuICAgICAgICBnYW1lLnZpZXdwb3J0V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgZ2FtZS5jdXJyZW50T2Zmc2V0ID0gZ2FtZS5sYXllci5jdXJyZW50T2Zmc2V0O1xuICAgICAgICBnYW1lLmJpbmRSZXNpemUoKTtcbiAgICB9LFxuXG4gICAgYmluZFJlc2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgZ2FtZS52aWV3cG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IGlmIHRydWNrIGlzIG91dHNpZGUgYm91bmRzLCBtb3ZlIHdvcmxkIChkZWJvdW5jZWQpXG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGdhbWUudmlld3BvcnRXaWR0aCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzY3JvbGw6IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgZ2FtZS5sYXllci5zY3JvbGwoYW1vdW50KTtcbiAgICAgICAgZ2FtZS5jdXJyZW50T2Zmc2V0ID0gZ2FtZS5sYXllci5jdXJyZW50T2Zmc2V0O1xuICAgIH0sXG5cbiAgICBhZlN0ZXA6IGZ1bmN0aW9uICh0aW1lc3RhbXApIHtcbiAgICAgICAgaWYgKGdhbWUuZGVidWcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmcmFtZXRpbWU6JywgdGltZXN0YW1wIC0gZ2FtZS5hZlRzKTtcbiAgICAgICAgICAgIHZhciBwZXJmRGF0ZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB9XG4gICAgICAgIGdhbWUuYWZUcyA9IHRpbWVzdGFtcDtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhnYW1lLmFmVHMpO1xuICAgICAgICBnYW1lLnVpLnJlbmRlcih0aW1lc3RhbXApO1xuXG4gICAgICAgIC8vIFRPRE86IGFzc3VtZSB1cGRhdGVcbiAgICAgICAgaWYgKGdhbWUubW92ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZ2FtZS50cnVjay5tb3ZlKGdhbWUudHJ1Y2suZGlyZWN0aW9uICogZ2FtZS50cnVjay5zcGVlZCk7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IHgtYmFzZWRcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBnYW1lLnRydWNrLmN1cnJlbnRPZmZzZXQgPCAoLWdhbWUuY3VycmVudE9mZnNldCArIGdhbWUudmlld1BvcnRQYWRkaW5nKVxuICAgICAgICAgICAgICAgIHx8IGdhbWUudHJ1Y2suY3VycmVudE9mZnNldCArIGdhbWUudHJ1Y2sud2lkdGggPiAoKC1nYW1lLmN1cnJlbnRPZmZzZXQpICsgZ2FtZS52aWV3cG9ydFdpZHRoIC0gZ2FtZS52aWV3UG9ydFBhZGRpbmcpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiB2aWV3cG9ydCB0cmFja2luZ1xuICAgICAgICAgICAgICAgIGdhbWUuc2Nyb2xsKC1nYW1lLnRydWNrLmRpcmVjdGlvbiAqIGdhbWUudHJ1Y2suc3BlZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdhbWUuZGVidWcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGVwIHRpbWU6JywgcGVyZm9ybWFuY2Uubm93KCkgLSBwZXJmRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZS5hZkNhbGxiYWNrID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lLmFmU3RlcCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBnYW1lIHVwZGF0ZVxuICAgICAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlJyk7XG4gICAgfSxcblxuICAgIGdhbWVMb29wSW50ZXJ2YWw6IDIwLCAvLyA1MGZwc1xuICAgIGdhbWVMb29wOiBudWxsLFxuICAgIGFmQ2FsbGJhY2s6IG51bGwsXG4gICAgYWZUczogbnVsbCxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShnYW1lLmFmQ2FsbGJhY2spO1xuICAgICAgICBjbGVhckludGVydmFsKGdhbWUuZ2FtZUxvb3ApO1xuXG4gICAgICAgIGdhbWUuZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbChnYW1lLnVwZGF0ZSwgZ2FtZS5nYW1lTG9vcEludGVydmFsKTtcbiAgICAgICAgZ2FtZS5hZkNhbGxiYWNrID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lLmFmU3RlcCk7XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGdhbWUuYWZDYWxsYmFjayk7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoZ2FtZS5nYW1lTG9vcCk7XG5cbiAgICAgICAgZ2FtZS5hZkNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgZ2FtZS5nYW1lTG9vcCA9IG51bGw7XG4gICAgfVxufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgZ2FtZS5pbml0KCk7XG4gICAgZ2FtZS5zdGFydCgpO1xuXG4gICAgLy8gVE9ETzpcbiAgICAvLyBhbmltYXRpb24gc3RhcnQgdGltZVxuICAgIC8vIG1vdmUgb2JqZWN0IHRvIHRhcmdldCBwb3NpdGlvbiBwZXIgdGltZSBpbnRlcnZhbCwgcmVsYXRpdmUgdG8gc3BlZWRcbiAgICAvLyBjb250cm9scyBzZXQgb2JqZWN0IHRhcmdldCBwb3NpdGlvbiwgcmVsYXRpdmUgdG8gc3BlZWQsIHRpbWVcbiAgICAvLyBzdXNwZW5kIC8gcmVzdW1lIGFuaW1hdGlvbnNcbiAgICAvLyBzdXNwZW5kIC8gcmVzdW1lIGdhbWUgdXBkYXRlc1xufSk7XG4iXX0=
