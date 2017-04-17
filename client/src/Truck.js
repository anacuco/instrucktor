class Truck {
    constructor (containerElement) {
        this.containerElement = containerElement;
        this.svg = this.containerElement.querySelector('svg');

        this.truckLength = this.containerElement.offsetWidth;
        this.truckOffset = this.containerElement.offsetLeft;
        this.initialOffset = this.truckOffset;

        this.speed = 5;

        this._direction = 1;
    }

    set x (value) {
        this.truckOffset = this.initialOffset + value;
        this.containerElement.style.left = this.truckOffset + 'px';
    }

    get x () {
        return this.truckOffset - this.initialOffset;
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
