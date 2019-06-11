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

const ARROW1 = "arr1";

const arr1Base = vec3(5,10);

function renderGrowingArrow(time, state, scene, camera) {
    if (!state.inited) {
        const width = 75
        const height = 40
        scene.add(createCoordinateGrid({
            minorStep: 1, majorStep: 5,
            minX: -width, maxX: width, minY: -height, maxY: height,
            minorColor: 0xCCCCCC, majorColor: 0x333333
        }))

        scene.add(arrowCreate({color:COLORS.RED,name: ARROW1}))
        const startPosition = vec3(-40,30);
        const endPosition = vec3(40,30);
        arrowFromTo(scene.getObjectByName(ARROW1, false), arr1Base, startPosition)
        state.arr1End = new LinearMovement({startTime:time, duration:1, from:startPosition, to:endPosition})
        state.inited = true
    } else {
        const end = state.arr1End.getPositionAt(time);
        arrowFromTo(scene.getObjectByName(ARROW1, false), arr1Base, end)
    }
    return state
}