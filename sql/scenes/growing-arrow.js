'use strict'

function initGrowingArrow() {
    render({
        rootElemId:"WebGL-output",
        cameraHeight: 100,
        onKeyDown:null,
        onLeftClick:null,
        initialState:null,
        render:renderGrowingArrow
    })
}

function renderGrowingArrow(time, state, scene, camera) {
    if (!state.inited) {
        const width = 75
        const height = 40
        createCoordinateGrid({
            scene:scene, minorStep:1, majorStep:5,
            minX:-width, maxX:width, minY:-height, maxY:height,
            minorColor:0xCCCCCC, majorColor:0x333333
        })
        state.inited = true
    }
    return state
}