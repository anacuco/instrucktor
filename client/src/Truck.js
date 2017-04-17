class Truck {
    constructor (containerElement) {
        this.containerElement = containerElement;
        this.svg = this.containerElement.querySelector('svg');

        this.truckLength = this.containerElement.offsetWidth;
        this.truckOffset = this.containerElement.offsetLeft;
        this.x = 0;
        this.speed = 5;

        this._direction = 1;
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
        var newLeft = this.containerElement.offsetLeft + amount; // TODO: dom access
        this.truckOffset = newLeft;
        this.containerElement.style.left = newLeft + 'px';
    }
}

module.exports = Truck;
