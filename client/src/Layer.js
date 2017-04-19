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

    addDynamic (item) {
        // verify
        if (typeof item.x === 'undefined') return false;
        if (typeof item.element === 'undefined') return false;

        this.dynamicObjects.push(item);
    }

    // destroy () {}

    scroll (amount) {
        var newOffset = this.currentOffset + Math.round(amount * this.scrollFactor);
        if (this.currentOffset === newOffset) return;

        this.containerElement.style.left = newOffset + 'px';
        this.currentOffset = newOffset;
    }

    generatePosts (start, end, distance) {
        for (let i = start; i < end; i += distance) {
            let post = templates.get('post');
            post.style.left = i + 'px';
            this.containerElement.appendChild(post);
        }
    }
}

module.exports = Layer;
