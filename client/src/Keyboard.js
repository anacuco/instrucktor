const Keyboard = {
    game: null,

    keyDownHandler (evt) {
        switch(evt.keyCode) {
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

    keyUpHandler (evt) {
        // Keyboard.game.move = false;
    },

    bind (target) {
        target.addEventListener('keydown', this.keyDownHandler);
        target.addEventListener('keyup', this.keyUpHandler);
    },

    release (target) {
        target.removeEventListener('keydown', this.keyDownHandler);
        target.removeEventListener('keyup', this.keyUpHandler);
    }
}

module.exports = Keyboard;
