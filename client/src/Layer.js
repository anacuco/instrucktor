const templates = require('./Templates');

class Layer {
    // dynamic objects
    // static objects
    // as indexedarrays?
    // generated objects
    // as generators?
    constructor (containerElement, scrollFactor = 1) {
        this.containerElement = containerElement;
        this.scrollFactor = scrollFactor;

        this.width = this.containerElement.offsetWidth;
        this.initialOffset = this.containerElement.offsetLeft;
        this.currentOffset = this.initialOffset;
        this.nextOffset = this.currentOffset;

        this.staticObjects = [];
        this.dynamicObjects = [];
        this.activeObjects = [];

        // this.update();
    }

    update () {
        let chunkStart = this.width + this.currentOffset;
        let chunkEnd = chunkStart + 4000;
        this.ensureChunk(chunkStart, chunkEnd);
    }

    // TODO: paint debug chunks
    ensureChunk (start, end) {
        // find dynamic objects in chunk range
        for (let item of this.dynamicObjects) {
            if (item.currentOffset < start || item.currentOffset > end) {
                continue; // TODO: remove / cleanup
            }
            this.add(item);
        }

        // find static objects in chunk range
        for (let item of this.staticObjects) {
            // TODO: isWithin for static items
            
            this.add(item);
        }

        // generate objects in chunk range
        this.generatePosts(start, end, 200);
    }

    // TODO: index mgmt
    add (item) {
        item.active = true;
        this.activeObjects.push(item);
        this.containerElement.appendChild(item.element);
    }

    remove (item) {
        item.active = false;
        console.log(this.activeObjects.indexOf(item)); // TODO: splice from arr
        console.log(this.dynamicObjects.indexOf(item));
        this.containerElement.removeChild(item);
    }

    isValidDisplayItem (item) {
        if (typeof item.x === 'undefined') return false;
        if (typeof item.element === 'undefined') return false;

        return true;
    }

    addDynamic (item) {
        if (!this.isValidDisplayItem(item)) return false;

        this.dynamicObjects.push(item);
    }

    addStatic (item) {
        if (!this.isValidDisplayItem(item)) return false;

        this.staticObjects.push(item);
    }

    // destroy () {}

    scroll (amount) {
        this.nextOffset += amount * this.scrollFactor;
        let nextFullPixel = Math.round(this.nextOffset);
        if (this.currentOffset === nextFullPixel) return;

        this.currentOffset = nextFullPixel;
        this.nextOffset = this.currentOffset;
        this.containerElement.style.left = this.currentOffset + 'px';
    }

    generatePosts (start, end, distance) {
        for (let i = start; i < end; i += distance) {
            let post = templates.get('post');
            post.style.left = i + 'px';
            this.containerElement.appendChild(post);
        }
    }

    rand (start, end) {
        return Math.ceil(Math.random() * (end - start)) + start;
    }

    generateClouds (start, end, density) {
        for (let i = start; i < end; i += this.rand(200, 500)) {

            let post = templates.get('cloud');
            post.style.left = i + 'px';
            post.style.bottom = this.rand(200, 400) + 'px';
            post.style.width = this.rand(100, 250) + 'px';
            post.style.height = this.rand(40, 80) + 'px';
            this.containerElement.appendChild(post);
        }
    }
}

module.exports = Layer;
