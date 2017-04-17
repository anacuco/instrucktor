Object.resolve = function(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined
    }, obj || self)
}

class UserInterface {
    constructor (containerElement, stateContainer) {
        this.containerElement = containerElement;
        this.stateContainer = stateContainer;

        this.hudContainer = this.containerElement.querySelector('#hud');
        this.valueContainer = this.hudContainer.querySelector('ul');

        this.hudContainer.querySelector('#playerName').innerHTML = 'Player Name';
        this.hudValues = [
            {
                'label': 'position',
                'val': 'truckOffset',
            }
        ];

        this.updateInterval = 200; // 5fps
        this.lastUpdate = -this.updateInterval;
        this.render(0);
    }

    render (timestamp) {
        // TODO: handle outside...
        if (this.lastUpdate > timestamp - this.updateInterval) return;

        // console.log(Object.resolve(this.hudValues[0].val, game));

        let list = '';

        for (let i in this.hudValues) {
            let value = this.hudValues[i];

            list += `${value.label}: ${Object.resolve(value.val, this.stateContainer)}`;
        }

        this.valueContainer.innerHTML = list;
        this.lastUpdate = timestamp;
        // console.log('ui update', timestamp);
    }
}

module.exports = UserInterface;
