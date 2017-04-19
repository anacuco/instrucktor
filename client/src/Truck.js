class Truck {
    constructor (containerElement) {
        this.containerElement = containerElement;
        this.svg = this.containerElement.querySelector('svg');

        this.width = this.containerElement.offsetWidth;
        this.initialOffset = this.containerElement.offsetLeft;
        this.currentOffset = this.initialOffset;

        this.speed = 5;

        this._direction = 1;
    }

    set x (value) {
        this.currentOffset = this.initialOffset + value;
        this.containerElement.style.left = this.currentOffset + 'px';
    }

    get x () {
        return this.currentOffset - this.initialOffset;
    }

    set direction (value) {
        if (this._direction !== value) {
            this.svg.setAttribute('style', 'transform: scaleX('+value+'); transition: .1s');
        }
        this._direction = value;
    }

    get direction () {
        return this._direction;
    }

    move (amount) {
        this.x += amount;
    }
}

module.exports = Truck;
