const Templates = {
    containerElement: null,
    templates: {},

    load (containerElement) {
        this.containerElement = containerElement;

        // iterate over children
        for (let template of this.containerElement.children) {
            let name = template.className;

            if (typeof this.templates[name] !== 'undefined') {
                throw Error(`Template error: cannot load "${name}" twice!`);
            }

            this.templates[name] = template;
            // TODO: template configuration / strings (lazy?)
        }
    },

    get (identifier) {
        if (this.containerElement === null) {
            throw Error('Template error: no templates loaded');
        }

        if (typeof this.templates[identifier] === 'undefined') {
            throw Error(`Argument error: template "${identifier}" not found`);
        }

        return this.templates[identifier].cloneNode(true);
    }
}

module.exports = Templates;
