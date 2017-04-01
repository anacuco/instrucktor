(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
* Created by ana on 31/03/17.
*/

var game = {
    init: function init() {
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

    bindResize: function bindResize() {
        window.addEventListener('resize', function (evt) {
            game.viewportWidth = window.innerWidth;

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

            // post.setAttribute('style', 'left: ' + i + 'px');
            post.style.left = i + 'px';

            game.layer.appendChild(post);
        }
    },

    layer: null,
    currentOffset: null,

    scroll: function scroll(amount) {
        var newOffset = game.currentOffset + amount;
        // game.layer.setAttribute('style', 'left: ' + newOffset + 'px');
        game.layer.style.left = newOffset + 'px';
        game.currentOffset = newOffset;
    },

    truck: null,
    truckOffset: null,

    viewPortPadding: 100,

    moveTruck: function moveTruck(amount) {
        var newLeft = game.truck.offsetLeft + amount;
        game.truckOffset = newLeft;
        // game.truck.setAttribute('style', 'left: '+ newLeft + 'px');
        game.truck.style.left = newLeft + 'px';
    },

    speed: 5,
    truckLength: 0,

    afStep: function afStep(timestamp) {

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
    game.placePosts();

    game.start();

    // animation start time
    // object target position change per time interval
    // set object position to amount of position change per interval relative to animation time passed
    // suspend / resume animations
    // suspend / resume game updates
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBSUEsSUFBSSxPQUFPO0FBQ1AsVUFBTSxnQkFBWTtBQUNkLGFBQUssS0FBTCxHQUFhLFNBQVMsYUFBVCxDQUF1QixVQUF2QixDQUFiO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLEtBQUssS0FBTCxDQUFXLFVBQWhDO0FBQ0EsYUFBSyxLQUFMLEdBQWEsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWI7QUFDQSxhQUFLLFdBQUwsR0FBbUIsS0FBSyxLQUFMLENBQVcsV0FBOUI7QUFDQSxhQUFLLFdBQUwsR0FBbUIsS0FBSyxLQUFMLENBQVcsVUFBOUI7O0FBRUEsYUFBSyxhQUFMLEdBQXFCLE9BQU8sVUFBNUI7O0FBRUEsYUFBSyxZQUFMO0FBQ0EsYUFBSyxVQUFMO0FBQ0gsS0FaTTs7QUFjUCxlQUFXLENBZEo7QUFlUCxVQUFNLEtBZkM7QUFnQlAsbUJBQWUsSUFoQlI7O0FBa0JQLGdCQUFZLHNCQUFZO0FBQ3BCLGVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsVUFBVSxHQUFWLEVBQWU7QUFDN0MsaUJBQUssYUFBTCxHQUFxQixPQUFPLFVBQTVCOztBQUVBLG9CQUFRLEdBQVIsQ0FBWSxLQUFLLGFBQWpCO0FBQ0gsU0FKRDtBQUtILEtBeEJNOztBQTBCUCxrQkFBYyx3QkFBWTtBQUN0QixlQUFPLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFVBQVUsR0FBVixFQUFlO0FBQzlDLG9CQUFPLElBQUksT0FBWDtBQUNJLHFCQUFLLEVBQUw7QUFDSSw0QkFBUSxHQUFSLENBQVksTUFBWjtBQUNBO0FBQ0oscUJBQUssRUFBTDtBQUNJO0FBQ0EseUJBQUssU0FBTCxHQUFpQixDQUFDLENBQWxCO0FBQ0EseUJBQUssSUFBTCxHQUFZLElBQVo7QUFDQSx5QkFBSyxLQUFMLENBQVcsYUFBWCxD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QUFRLGtCQUFZO0FBQ2hCO0FBQ0E7QUFDSCxLQXJJTTs7QUF1SVAsc0JBQWtCLEVBdklYLEVBdUllO0FBQ3RCLGNBQVUsSUF4SUg7QUF5SVAsZ0JBQVksSUF6SUw7O0FBMklQLFdBQU8saUJBQVk7QUFDZixlQUFPLG9CQUFQLENBQTRCLEtBQUssVUFBakM7QUFDQSxzQkFBYyxLQUFLLFFBQW5COztBQUVBLGFBQUssUUFBTCxHQUFnQixZQUFZLEtBQUssTUFBakIsRUFBeUIsS0FBSyxnQkFBOUIsQ0FBaEI7QUFDQSxhQUFLLFVBQUwsR0FBa0IsT0FBTyxxQkFBUCxDQUE2QixLQUFLLE1BQWxDLENBQWxCO0FBQ0gsS0FqSk07O0FBbUpQLFVBQU0sZ0JBQVk7QUFDZCxlQUFPLG9CQUFQLENBQTRCLEtBQUssVUFBakM7QUFDQSxzQkFBYyxLQUFLLFFBQW5COztBQUVBLGFBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNBLGFBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNIO0FBekpNLENBQVg7O0FBNEpBLE9BQU8sZ0JBQVAsQ0FBd0Isa0JBQXhCLEVBQTRDLFlBQVk7QUFDcEQsU0FBSyxJQUFMO0FBQ0EsU0FBSyxVQUFMOztBQUVBLFNBQUssS0FBTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsQ0FYRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiogQ3JlYXRlZCBieSBhbmEgb24gMzEvMDMvMTcuXG4qL1xuXG52YXIgZ2FtZSA9IHtcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdhbWUubGF5ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbGF5ZXItMCcpO1xuICAgICAgICBnYW1lLmN1cnJlbnRPZmZzZXQgPSBnYW1lLmxheWVyLm9mZnNldExlZnQ7XG4gICAgICAgIGdhbWUudHJ1Y2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdXNlcjEnKTtcbiAgICAgICAgZ2FtZS50cnVja0xlbmd0aCA9IGdhbWUudHJ1Y2sub2Zmc2V0V2lkdGg7XG4gICAgICAgIGdhbWUudHJ1Y2tPZmZzZXQgPSBnYW1lLnRydWNrLm9mZnNldExlZnQ7XG5cbiAgICAgICAgZ2FtZS52aWV3cG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICAgICAgZ2FtZS5iaW5kS2V5Ym9hcmQoKTtcbiAgICAgICAgZ2FtZS5iaW5kUmVzaXplKCk7XG4gICAgfSxcblxuICAgIGRpcmVjdGlvbjogMSxcbiAgICBtb3ZlOiBmYWxzZSxcbiAgICB2aWV3cG9ydFdpZHRoOiBudWxsLFxuXG4gICAgYmluZFJlc2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgZ2FtZS52aWV3cG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGdhbWUudmlld3BvcnRXaWR0aCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBiaW5kS2V5Ym9hcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBzd2l0Y2goZXZ0LmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZG93bicpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbGVmdCcpO1xuICAgICAgICAgICAgICAgICAgICBnYW1lLmRpcmVjdGlvbiA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBnYW1lLm1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBnYW1lLnRydWNrLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAndHJhbnNmb3JtOiBzY2FsZVgoLTEpOyB0cmFuc2l0aW9uOiAuMXMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGdhbWUuZGlyZWN0aW9uID0gMTtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5tb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS50cnVjay5xdWVyeVNlbGVjdG9yKCdzdmcnKS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3RyYW5zZm9ybTogc2NhbGVYKDEpOyB0cmFuc2l0aW9uOiAuMXMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzI6XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzcGFjZScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZS5nYW1lTG9vcCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZ0LmtleUNvZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAvLyBnYW1lLm1vdmUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHBsYWNlUG9zdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcG9zdFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXBsYXRlcyAucG9zdCcpO1xuICAgICAgICB2YXIgbGVuZ3RoID0gZ2FtZS5sYXllci5vZmZzZXRXaWR0aDtcbiAgICAgICAgdmFyIG9mZnNldCA9IGdhbWUubGF5ZXIub2Zmc2V0TGVmdDtcblxuICAgICAgICB2YXIgY2h1bmtFbmQgPSBsZW5ndGggKyBvZmZzZXQgKyA0MDAwO1xuICAgICAgICB2YXIgY2h1bmtTdGFydCA9IGxlbmd0aCArIG9mZnNldDtcblxuICAgICAgICAvLyB2YXIgY2h1bmtFbmQgPSBsZW5ndGg7XG4gICAgICAgIC8vIHZhciBjaHVua1N0YXJ0ID0gMDtcblxuICAgICAgICBmb3IgKHZhciBpID0gY2h1bmtTdGFydDsgaSA8IGNodW5rRW5kOyBpICs9IDIwMCkge1xuXG4gICAgICAgICAgICB2YXIgcG9zdCA9IHBvc3RUZW1wbGF0ZS5jbG9uZU5vZGUoKTtcblxuICAgICAgICAgICAgLy8gcG9zdC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2xlZnQ6ICcgKyBpICsgJ3B4Jyk7XG4gICAgICAgICAgICBwb3N0LnN0eWxlLmxlZnQgPSBpICsgJ3B4JztcblxuICAgICAgICAgICAgZ2FtZS5sYXllci5hcHBlbmRDaGlsZChwb3N0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBsYXllcjogbnVsbCxcbiAgICBjdXJyZW50T2Zmc2V0OiBudWxsLFxuXG4gICAgc2Nyb2xsOiBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIHZhciBuZXdPZmZzZXQgPSBnYW1lLmN1cnJlbnRPZmZzZXQgKyBhbW91bnQ7XG4gICAgICAgIC8vIGdhbWUubGF5ZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICdsZWZ0OiAnICsgbmV3T2Zmc2V0ICsgJ3B4Jyk7XG4gICAgICAgIGdhbWUubGF5ZXIuc3R5bGUubGVmdCA9IG5ld09mZnNldCArICdweCc7XG4gICAgICAgIGdhbWUuY3VycmVudE9mZnNldCA9IG5ld09mZnNldDtcbiAgICB9LFxuXG4gICAgdHJ1Y2s6IG51bGwsXG4gICAgdHJ1Y2tPZmZzZXQ6IG51bGwsXG5cbiAgICB2aWV3UG9ydFBhZGRpbmc6IDEwMCxcblxuICAgIG1vdmVUcnVjazogZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICB2YXIgbmV3TGVmdCA9IGdhbWUudHJ1Y2sub2Zmc2V0TGVmdCArIGFtb3VudDtcbiAgICAgICAgZ2FtZS50cnVja09mZnNldCA9IG5ld0xlZnQ7XG4gICAgICAgIC8vIGdhbWUudHJ1Y2suc2V0QXR0cmlidXRlKCdzdHlsZScsICdsZWZ0OiAnKyBuZXdMZWZ0ICsgJ3B4Jyk7XG4gICAgICAgIGdhbWUudHJ1Y2suc3R5bGUubGVmdCA9IG5ld0xlZnQgKyAncHgnO1xuICAgIH0sXG5cbiAgICBzcGVlZDogNSxcbiAgICB0cnVja0xlbmd0aDogMCxcblxuICAgIGFmU3RlcDogZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuXG4gICAgICAgIC8vIFRPRE86IGFzc3VtZSB1cGRhdGVcbiAgICAgICAgaWYgKGdhbWUubW92ZSA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICBnYW1lLm1vdmVUcnVjayhnYW1lLmRpcmVjdGlvbiAqIGdhbWUuc3BlZWQpO1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZ2FtZS50cnVja09mZnNldCA8ICgtZ2FtZS5jdXJyZW50T2Zmc2V0ICsgZ2FtZS52aWV3UG9ydFBhZGRpbmcpXG4gICAgICAgICAgICAgICAgfHwgZ2FtZS50cnVja09mZnNldCArIGdhbWUudHJ1Y2tMZW5ndGggPiAoKC1nYW1lLmN1cnJlbnRPZmZzZXQpICsgZ2FtZS52aWV3cG9ydFdpZHRoIC0gZ2FtZS52aWV3UG9ydFBhZGRpbmcpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBnYW1lLnNjcm9sbCgtZ2FtZS5kaXJlY3Rpb24gKiBnYW1lLnNwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdhbWUuYWZDYWxsYmFjayA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZS5hZlN0ZXApO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gZ2FtZSB1cGRhdGVcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3VwZGF0ZScpO1xuICAgIH0sXG5cbiAgICBnYW1lTG9vcEludGVydmFsOiAyMCwgLy8gNTBmcHNcbiAgICBnYW1lTG9vcDogbnVsbCxcbiAgICBhZkNhbGxiYWNrOiBudWxsLFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGdhbWUuYWZDYWxsYmFjayk7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoZ2FtZS5nYW1lTG9vcCk7XG5cbiAgICAgICAgZ2FtZS5nYW1lTG9vcCA9IHNldEludGVydmFsKGdhbWUudXBkYXRlLCBnYW1lLmdhbWVMb29wSW50ZXJ2YWwpO1xuICAgICAgICBnYW1lLmFmQ2FsbGJhY2sgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWUuYWZTdGVwKTtcbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoZ2FtZS5hZkNhbGxiYWNrKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChnYW1lLmdhbWVMb29wKTtcblxuICAgICAgICBnYW1lLmFmQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICBnYW1lLmdhbWVMb29wID0gbnVsbDtcbiAgICB9XG59O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBnYW1lLmluaXQoKTtcbiAgICBnYW1lLnBsYWNlUG9zdHMoKTtcblxuICAgIGdhbWUuc3RhcnQoKTtcblxuICAgIC8vIGFuaW1hdGlvbiBzdGFydCB0aW1lXG4gICAgLy8gb2JqZWN0IHRhcmdldCBwb3NpdGlvbiBjaGFuZ2UgcGVyIHRpbWUgaW50ZXJ2YWxcbiAgICAvLyBzZXQgb2JqZWN0IHBvc2l0aW9uIHRvIGFtb3VudCBvZiBwb3NpdGlvbiBjaGFuZ2UgcGVyIGludGVydmFsIHJlbGF0aXZlIHRvIGFuaW1hdGlvbiB0aW1lIHBhc3NlZFxuICAgIC8vIHN1c3BlbmQgLyByZXN1bWUgYW5pbWF0aW9uc1xuICAgIC8vIHN1c3BlbmQgLyByZXN1bWUgZ2FtZSB1cGRhdGVzXG59KTtcbiJdfQ==
