'use strict';

class LinearChange {
    constructor({startTime, duration, from, to}) {
        this.startTime = startTime
        this.duration = duration
        this.from = from
        this.to = to
    }

    getValueAt(time) {
        if (time <= this.startTime) {
            return this.from
        }
        const timeElapsedPct = (time - this.startTime)/this.duration
        if (timeElapsedPct >= 1) {
            return this.to
        }
        return this.from + (this.to - this.from)*timeElapsedPct
    }
}

class LinearMovement {
    constructor({startTime, duration, from, to}) {
        this.xChange = new LinearChange({startTime:startTime, duration:duration, from:from.x, to:to.x})
        this.yChange = new LinearChange({startTime:startTime, duration:duration, from:from.y, to:to.y})
        this.zChange = new LinearChange({startTime:startTime, duration:duration, from:from.z, to:to.z})
    }

    getPositionAt(time) {
        return vec3(this.xChange.getValueAt(time),this.yChange.getValueAt(time),this.zChange.getValueAt(time))
    }
}