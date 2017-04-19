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

        let chunkStart = this.width + this.currentOffset;
        let chunkEnd = chunkStart + 4000;

        this.ensureChunk(chunkStart, chunkEnd);
    }

    // TODO: paint debug chunks
    ensureChunk (start, end) {
        // find dynamic objects in chunk range
        // find static objects in chunk range

        // generate objects in chunk range
        this.generatePosts(start, end, 200);
    }

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
