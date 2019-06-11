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
let arrow1

function renderGrowingArrow(time, state, scene, camera) {
    if (!state.inited) {
        const width = 75
        const height = 40
        scene.add(createCoordinateGrid({
            minorStep: 1, majorStep: 5,
            minX: -width, maxX: width, minY: -height, maxY: height,
            minorColor: 0xCCCCCC, majorColor: 0x333333
        }))

        arrow1 = arrowCreate({color:COLORS.RED,name: ARROW1,width:0.5,pointerLength:3})
        arrow1.material.transparent = true
        arrow1.material.needsUpdate = true
        scene.add(arrow1)
        const startPosition = vec3(-40,40)
        const endPosition = vec3(50,-30)
        arrowFromTo(scene.getObjectByName(ARROW1, false), arr1Base, startPosition)
        const duration1 = 2
        const duration2 = 0.5
        state.arr1End = new LinearMovement({startTime:time, duration:duration1, from:startPosition, to:endPosition})
        state.arr1Opacity = new LinearChange({startTime:time+duration1, duration:duration2, from:1, to:0})
        state.inited = true
    } else {
        arrowFromTo(arrow1, arr1Base, state.arr1End.getValueAt(time))
        arrow1.material.opacity = state.arr1Opacity.getValueAt(time)
        arrow1.material.needsUpdate = true
    }
    return state
}