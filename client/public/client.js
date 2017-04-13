(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
* Created by ana on 31/03/17.
*/

Object.resolve = function (path, obj) {
    return path.split('.').reduce(function (prev, curr) {
        return prev ? prev[curr] : undefined;
    }, obj || self);
};

var ui = {
    uiContainer: null,
    hudContainer: null,
    values: [{
        'label': 'position',
        'val': 'truckOffset'
    }],

    init: function init() {
        ui.uiContainer = document.querySelector('#layer-ui');
        ui.hudContainer = ui.uiContainer.querySelector('#hud');

        ui.hudContainer.querySelector('#playerName').innerHTML = 'Player Name';
        ui.valueContainer = ui.hudContainer.querySelector('ul');

        ui.render(0);
    },

    updateInterval: 200, // 5fps
    lastUpdate: -self.updateInterval,
    render: function render(timestamp) {
        if (ui.lastUpdate > timestamp - ui.updateInterval) return;

        // console.log(Object.resolve(ui.values[0].val, game));

        var list = '';

        for (var i in ui.values) {
            var value = ui.values[i];

            list += value.label + ': ' + Object.resolve(value.val, game);
        }

        ui.valueContainer.innerHTML = list;

        ui.lastUpdate = timestamp;
        // console.log('ui update', timestamp);
    }
};

var game = {
    init: function init() {
        game.layer = document.querySelector('#layer-0');
        game.currentOffset = game.layer.offsetLeft;
        game.truck = document.querySelector('#user1');
        game.truckLength = game.truck.offsetWidth;
        game.truckOffset = game.truck.offsetLeft;

        game.viewportWidth = window.innerWidth;

        game.placePosts();
        game.bindKeyboard();
        game.bindResize();

        ui.init();
    },

    direction: 1,
    move: false,
    viewportWidth: null,

    bindResize: function bindResize() {
        window.addEventListener('resize', function (evt) {
            game.viewportWidth = window.innerWidth;

            // TODO: if truck is outside bounds, move world

            console.log(game.viewportWidth);
        });
    },

    bindKeyboard: function bindKeyboard() {
        window.addEventListener('keydown', function (evt) {
            switch (evt.keyCode) {
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

    layer: null,
    currentOffset: null,

    scroll: function scroll(amount) {
        var newOffset = game.currentOffset + amount;
        game.layer.style.left = newOffset + 'px';
        game.currentOffset = newOffset;
    },

    truck: null,
    truckOffset: null,
    viewPortPadding: 100,

    moveTruck: function moveTruck(amount) {
        var newLeft = game.truck.offsetLeft + amount;
        game.truckOffset = newLeft;
        game.truck.style.left = newLeft + 'px';
    },

    speed: 5,
    truckLength: 0,

    afStep: function afStep(timestamp) {

        game.afTs = timestamp;

        // console.log(game.afTs);
        ui.render(timestamp);

        // TODO: assume update
        if (game.move === true) {

            game.moveTruck(game.direction * game.speed);

            if (game.truckOffset < -game.currentOffset + game.viewPortPadding || game.truckOffset + game.truckLength > -game.currentOffset + game.viewportWidth - game.viewPortPadding) {
                game.scroll(-game.direction * game.speed);
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
    // object target position change per time interval
    // set object position to amount of position change per interval relative to animation time passed
    // suspend / resume animations
    // suspend / resume game updates
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLFVBQVMsSUFBVCxFQUFlLEdBQWYsRUFBb0I7QUFDakMsV0FBTyxLQUFLLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLE1BQWhCLENBQXVCLFVBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUI7QUFDL0MsZUFBTyxPQUFPLEtBQUssSUFBTCxDQUFQLEdBQW9CLFNBQTNCO0FBQ0gsS0FGTSxFQUVKLE9BQU8sSUFGSCxDQUFQO0FBR0gsQ0FKRDs7QUFNQSxJQUFJLEtBQUs7QUFDTCxpQkFBYSxJQURSO0FBRUwsa0JBQWMsSUFGVDtBQUdMLFlBQVEsQ0FDSjtBQUNJLGlCQUFTLFVBRGI7QUFFSSxlQUFPO0FBRlgsS0FESSxDQUhIOztBQVVMLFVBQU0sZ0JBQVk7QUFDZCxXQUFHLFdBQUgsR0FBaUIsU0FBUyxhQUFULENBQXVCLFdBQXZCLENBQWpCO0FBQ0EsV0FBRyxZQUFILEdBQWtCLEdBQUcsV0FBSCxDQUFlLGFBQWYsQ0FBNkIsTUFBN0IsQ0FBbEI7O0FBRUEsV0FBRyxZQUFILENBQWdCLGFBQWhCLENBQThCLGFBQTlCLEVBQTZDLFNBQTdDLEdBQXlELGFBQXpEO0FBQ0EsV0FBRyxjQUFILEdBQW9CLEdBQUcsWUFBSCxDQUFnQixhQUFoQixDQUE4QixJQUE5QixDQUFwQjs7QUFFQSxXQUFHLE1BQUgsQ0FBVSxDQUFWO0FBQ0gsS0FsQkk7O0FBb0JMLG9CQUFnQixHQXBCWCxFQW9CZ0I7QUFDckIsZ0JBQVksQ0FBQyxLQUFLLGNBckJiO0FBc0JMLFlBQVEsZ0JBQVUsU0FBVixFQUFxQjtBQUN6QixZQUFJLEdBQUcsVUFBSCxHQUFnQixZQUFZLEdBQUcsY0FBbkMsRUFBbUQ7O0FBRW5EOztBQUVBLFlBQUksT0FBTyxFQUFYOztBQUVBLGFBQUssSUFBSSxDQUFU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QyxLQUFLLGFBQVAsR0FBd0IsS0FBSyxhQUE3QixHQUE2QyxLQUFLLGVBRmhHLEVBR0U7QUFDRSxxQkFBSyxNQUFMLENBQVksQ0FBQyxLQUFLLFNBQU4sR0FBa0IsS0FBSyxLQUFuQztBQUNIO0FBQ0o7O0FBRUQsYUFBSyxVQUFMLEdBQWtCLE9BQU8scUJBQVAsQ0FBNkIsS0FBSyxNQUFsQyxDQUFsQjtBQUNILEtBbklNOztBQXFJUCxZQUFRLGtCQUFZO0FBQ2hCO0FBQ0E7QUFDSCxLQXhJTTs7QUEwSVAsc0JBQWtCLEVBMUlYLEVBMEllO0FBQ3RCLGNBQVUsSUEzSUg7QUE0SVAsZ0JBQVksSUE1SUw7QUE2SVAsVUFBTSxJQTdJQzs7QUErSVAsV0FBTyxpQkFBWTtBQUNmLGVBQU8sb0JBQVAsQ0FBNEIsS0FBSyxVQUFqQztBQUNBLHNCQUFjLEtBQUssUUFBbkI7O0FBRUEsYUFBSyxRQUFMLEdBQWdCLFlBQVksS0FBSyxNQUFqQixFQUF5QixLQUFLLGdCQUE5QixDQUFoQjtBQUNBLGFBQUssVUFBTCxHQUFrQixPQUFPLHFCQUFQLENBQTZCLEtBQUssTUFBbEMsQ0FBbEI7QUFDSCxLQXJKTTs7QUF1SlAsVUFBTSxnQkFBWTtBQUNkLGVBQU8sb0JBQVAsQ0FBNEIsS0FBSyxVQUFqQztBQUNBLHNCQUFjLEtBQUssUUFBbkI7O0FBRUEsYUFBSyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0g7QUE3Sk0sQ0FBWDs7QUFnS0EsT0FBTyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsWUFBWTtBQUNwRCxTQUFLLElBQUw7QUFDQSxTQUFLLEtBQUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsQ0FWRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiogQ3JlYXRlZCBieSBhbmEgb24gMzEvMDMvMTcuXG4qL1xuXG5PYmplY3QucmVzb2x2ZSA9IGZ1bmN0aW9uKHBhdGgsIG9iaikge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cnIpIHtcbiAgICAgICAgcmV0dXJuIHByZXYgPyBwcmV2W2N1cnJdIDogdW5kZWZpbmVkXG4gICAgfSwgb2JqIHx8IHNlbGYpXG59XG5cbnZhciB1aSA9IHtcbiAgICB1aUNvbnRhaW5lcjogbnVsbCxcbiAgICBodWRDb250YWluZXI6IG51bGwsXG4gICAgdmFsdWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgICdsYWJlbCc6ICdwb3NpdGlvbicsXG4gICAgICAgICAgICAndmFsJzogJ3RydWNrT2Zmc2V0JyxcbiAgICAgICAgfVxuICAgIF0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVpLnVpQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xheWVyLXVpJyk7XG4gICAgICAgIHVpLmh1ZENvbnRhaW5lciA9IHVpLnVpQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNodWQnKTtcblxuICAgICAgICB1aS5odWRDb250YWluZXIucXVlcnlTZWxlY3RvcignI3BsYXllck5hbWUnKS5pbm5lckhUTUwgPSAnUGxheWVyIE5hbWUnO1xuICAgICAgICB1aS52YWx1ZUNvbnRhaW5lciA9IHVpLmh1ZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCd1bCcpO1xuXG4gICAgICAgIHVpLnJlbmRlcigwKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlSW50ZXJ2YWw6IDIwMCwgLy8gNWZwc1xuICAgIGxhc3RVcGRhdGU6IC1zZWxmLnVwZGF0ZUludGVydmFsLFxuICAgIHJlbmRlcjogZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuICAgICAgICBpZiAodWkubGFzdFVwZGF0ZSA+IHRpbWVzdGFtcCAtIHVpLnVwZGF0ZUludGVydmFsKSByZXR1cm47XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LnJlc29sdmUodWkudmFsdWVzWzBdLnZhbCwgZ2FtZSkpO1xuXG4gICAgICAgIGxldCBsaXN0ID0gJyc7XG5cbiAgICAgICAgZm9yIChsZXQgaSBpbiB1aS52YWx1ZXMpIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHVpLnZhbHVlc1tpXTtcblxuICAgICAgICAgICAgbGlzdCArPSBgJHt2YWx1ZS5sYWJlbH06ICR7T2JqZWN0LnJlc29sdmUodmFsdWUudmFsLCBnYW1lKX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgdWkudmFsdWVDb250YWluZXIuaW5uZXJIVE1MID0gbGlzdDtcblxuICAgICAgICB1aS5sYXN0VXBkYXRlID0gdGltZXN0YW1wO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndWkgdXBkYXRlJywgdGltZXN0YW1wKTtcbiAgICB9XG59XG5cbnZhciBnYW1lID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2FtZS5sYXllciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsYXllci0wJyk7XG4gICAgICAgIGdhbWUuY3VycmVudE9mZnNldCA9IGdhbWUubGF5ZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgZ2FtZS50cnVjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1c2VyMScpO1xuICAgICAgICBnYW1lLnRydWNrTGVuZ3RoID0gZ2FtZS50cnVjay5vZmZzZXRXaWR0aDtcbiAgICAgICAgZ2FtZS50cnVja09mZnNldCA9IGdhbWUudHJ1Y2sub2Zmc2V0TGVmdDtcblxuICAgICAgICBnYW1lLnZpZXdwb3J0V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgICAgICBnYW1lLnBsYWNlUG9zdHMoKTtcbiAgICAgICAgZ2FtZS5iaW5kS2V5Ym9hcmQoKTtcbiAgICAgICAgZ2FtZS5iaW5kUmVzaXplKCk7XG5cbiAgICAgICAgdWkuaW5pdCgpO1xuICAgIH0sXG5cbiAgICBkaXJlY3Rpb246IDEsXG4gICAgbW92ZTogZmFsc2UsXG4gICAgdmlld3BvcnRXaWR0aDogbnVsbCxcblxuICAgIGJpbmRSZXNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGdhbWUudmlld3BvcnRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBpZiB0cnVjayBpcyBvdXRzaWRlIGJvdW5kcywgbW92ZSB3b3JsZFxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhnYW1lLnZpZXdwb3J0V2lkdGgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYmluZEtleWJvYXJkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgc3dpdGNoKGV2dC5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Rvd24nKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzNzpcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xlZnQnKTtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5kaXJlY3Rpb24gPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5tb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS50cnVjay5xdWVyeVNlbGVjdG9yKCdzdmcnKS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3RyYW5zZm9ybTogc2NhbGVYKC0xKTsgdHJhbnNpdGlvbjogLjFzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzk6XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyaWdodCcpO1xuICAgICAgICAgICAgICAgICAgICBnYW1lLmRpcmVjdGlvbiA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGdhbWUubW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGdhbWUudHJ1Y2sucXVlcnlTZWxlY3Rvcignc3ZnJykuc2V0QXR0cmlidXRlKCdzdHlsZScsICd0cmFuc2Zvcm06IHNjYWxlWCgxKTsgdHJhbnNpdGlvbjogLjFzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cCcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDMyOlxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3BhY2UnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWUuZ2FtZUxvb3AgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2dC5rZXlDb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgLy8gZ2FtZS5tb3ZlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBwbGFjZVBvc3RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBvc3RUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wbGF0ZXMgLnBvc3QnKTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IGdhbWUubGF5ZXIub2Zmc2V0V2lkdGg7XG4gICAgICAgIHZhciBvZmZzZXQgPSBnYW1lLmxheWVyLm9mZnNldExlZnQ7XG5cbiAgICAgICAgdmFyIGNodW5rRW5kID0gbGVuZ3RoICsgb2Zmc2V0ICsgNDAwMDtcbiAgICAgICAgdmFyIGNodW5rU3RhcnQgPSBsZW5ndGggKyBvZmZzZXQ7XG5cbiAgICAgICAgLy8gdmFyIGNodW5rRW5kID0gbGVuZ3RoO1xuICAgICAgICAvLyB2YXIgY2h1bmtTdGFydCA9IDA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IGNodW5rU3RhcnQ7IGkgPCBjaHVua0VuZDsgaSArPSAyMDApIHtcbiAgICAgICAgICAgIHZhciBwb3N0ID0gcG9zdFRlbXBsYXRlLmNsb25lTm9kZSgpO1xuICAgICAgICAgICAgcG9zdC5zdHlsZS5sZWZ0ID0gaSArICdweCc7XG4gICAgICAgICAgICBnYW1lLmxheWVyLmFwcGVuZENoaWxkKHBvc3QpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGxheWVyOiBudWxsLFxuICAgIGN1cnJlbnRPZmZzZXQ6IG51bGwsXG5cbiAgICBzY3JvbGw6IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgdmFyIG5ld09mZnNldCA9IGdhbWUuY3VycmVudE9mZnNldCArIGFtb3VudDtcbiAgICAgICAgZ2FtZS5sYXllci5zdHlsZS5sZWZ0ID0gbmV3T2Zmc2V0ICsgJ3B4JztcbiAgICAgICAgZ2FtZS5jdXJyZW50T2Zmc2V0ID0gbmV3T2Zmc2V0O1xuICAgIH0sXG5cbiAgICB0cnVjazogbnVsbCxcbiAgICB0cnVja09mZnNldDogbnVsbCxcbiAgICB2aWV3UG9ydFBhZGRpbmc6IDEwMCxcblxuICAgIG1vdmVUcnVjazogZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICB2YXIgbmV3TGVmdCA9IGdhbWUudHJ1Y2sub2Zmc2V0TGVmdCArIGFtb3VudDtcbiAgICAgICAgZ2FtZS50cnVja09mZnNldCA9IG5ld0xlZnQ7XG4gICAgICAgIGdhbWUudHJ1Y2suc3R5bGUubGVmdCA9IG5ld0xlZnQgKyAncHgnO1xuICAgIH0sXG5cbiAgICBzcGVlZDogNSxcbiAgICB0cnVja0xlbmd0aDogMCxcblxuICAgIGFmU3RlcDogZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuXG4gICAgICAgIGdhbWUuYWZUcyA9IHRpbWVzdGFtcDtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhnYW1lLmFmVHMpO1xuICAgICAgICB1aS5yZW5kZXIodGltZXN0YW1wKTtcblxuICAgICAgICAvLyBUT0RPOiBhc3N1bWUgdXBkYXRlXG4gICAgICAgIGlmIChnYW1lLm1vdmUgPT09IHRydWUpIHtcblxuICAgICAgICAgICAgZ2FtZS5tb3ZlVHJ1Y2soZ2FtZS5kaXJlY3Rpb24gKiBnYW1lLnNwZWVkKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGdhbWUudHJ1Y2tPZmZzZXQgPCAoLWdhbWUuY3VycmVudE9mZnNldCArIGdhbWUudmlld1BvcnRQYWRkaW5nKVxuICAgICAgICAgICAgICAgIHx8IGdhbWUudHJ1Y2tPZmZzZXQgKyBnYW1lLnRydWNrTGVuZ3RoID4gKCgtZ2FtZS5jdXJyZW50T2Zmc2V0KSArIGdhbWUudmlld3BvcnRXaWR0aCAtIGdhbWUudmlld1BvcnRQYWRkaW5nKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZ2FtZS5zY3JvbGwoLWdhbWUuZGlyZWN0aW9uICogZ2FtZS5zcGVlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnYW1lLmFmQ2FsbGJhY2sgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWUuYWZTdGVwKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGdhbWUgdXBkYXRlXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd1cGRhdGUnKTtcbiAgICB9LFxuXG4gICAgZ2FtZUxvb3BJbnRlcnZhbDogMjAsIC8vIDUwZnBzXG4gICAgZ2FtZUxvb3A6IG51bGwsXG4gICAgYWZDYWxsYmFjazogbnVsbCxcbiAgICBhZlRzOiBudWxsLFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGdhbWUuYWZDYWxsYmFjayk7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoZ2FtZS5nYW1lTG9vcCk7XG5cbiAgICAgICAgZ2FtZS5nYW1lTG9vcCA9IHNldEludGVydmFsKGdhbWUudXBkYXRlLCBnYW1lLmdhbWVMb29wSW50ZXJ2YWwpO1xuICAgICAgICBnYW1lLmFmQ2FsbGJhY2sgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWUuYWZTdGVwKTtcbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoZ2FtZS5hZkNhbGxiYWNrKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChnYW1lLmdhbWVMb29wKTtcblxuICAgICAgICBnYW1lLmFmQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICBnYW1lLmdhbWVMb29wID0gbnVsbDtcbiAgICB9XG59O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBnYW1lLmluaXQoKTtcbiAgICBnYW1lLnN0YXJ0KCk7XG5cbiAgICAvLyBUT0RPOlxuICAgIC8vIGFuaW1hdGlvbiBzdGFydCB0aW1lXG4gICAgLy8gb2JqZWN0IHRhcmdldCBwb3NpdGlvbiBjaGFuZ2UgcGVyIHRpbWUgaW50ZXJ2YWxcbiAgICAvLyBzZXQgb2JqZWN0IHBvc2l0aW9uIHRvIGFtb3VudCBvZiBwb3NpdGlvbiBjaGFuZ2UgcGVyIGludGVydmFsIHJlbGF0aXZlIHRvIGFuaW1hdGlvbiB0aW1lIHBhc3NlZFxuICAgIC8vIHN1c3BlbmQgLyByZXN1bWUgYW5pbWF0aW9uc1xuICAgIC8vIHN1c3BlbmQgLyByZXN1bWUgZ2FtZSB1cGRhdGVzXG59KTtcbiJdfQ==
