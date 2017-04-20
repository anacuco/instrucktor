class Truck {
    constructor (containerElement) {
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

    set x (value) {
        this.currentOffset = this.initialOffset + value;
        this.containerElement.style.left = this.currentOffset + 'px'; // TODO: only if 'active' on layer
        this._x = value;
    }

    get x () {
        // return this.currentOffset - this.initialOffset;
        return this._x;
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

    get element () {
        return this.containerElement;
    }

    isWithin (start, end) {
        return this.currentOffset > start && this.currentOffset + this.width < end;
    }
}

module.exports = Truck;
