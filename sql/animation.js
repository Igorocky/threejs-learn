'use strict';

class LinearMovement {
    constructor({startTime, duration, from, to}) {
        this.startTime = startTime
        this.duration = duration
        this.from = from
        this.to = to
        this.getPositionAt = this.getPositionAt.bind(this)
    }

    getPositionAt(time) {
        const timeElapsedPct = (time - this.startTime)/this.duration
        if (timeElapsedPct > 1) {
            return this.to
        }
        return this.from.clone().add(
            vec3().subVectors(this.to,this.from).multiplyScalar(timeElapsedPct)
        )
    }
}