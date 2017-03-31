/**
 * Created by ana on 31/03/17.
 */

var game = {
  init: function () {
    game.layer = document.querySelector('#layer-0');
    game.currentOffset = game.layer.offsetLeft;
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
  }
};

window.addEventListener('DOMContentLoaded', function () {
  game.init();
  game.placePosts();


  var animate = setInterval(function () {
    game.scroll(-1);
  }, 25);
});
