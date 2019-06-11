'use strict';

const ARROW_LINE = "ARROW_LINE"
const ARROW_POINTER = "ARROW_POINTER"

function arrowCreate({color,name,width,z,pointerLength}) {
    const group = new THREE.Group();
    group.name = name
    const halfWidth = width/2
    let pointerBaseHalfWidth = halfWidth*3
    pointerBaseHalfWidth = pointerBaseHalfWidth > 1 ? pointerBaseHalfWidth : 1
    group.add(createPolygon({
        name: ARROW_LINE,
        vertices:[[0,halfWidth], [10,halfWidth], [10,-halfWidth], [0,-halfWidth]],
        props: {color:color}
    }))
    group.add(createPolygon({
        name: ARROW_POINTER,
        vertices:[[0,pointerBaseHalfWidth], [pointerLength,0], [0,-pointerBaseHalfWidth]],
        props: {color:color}
    }))
    group.userData = {
        halfWidth: halfWidth,
        pointerBaseHalfWidth: pointerBaseHalfWidth,
        z:z?z:0,
        pointerLength:pointerLength
    }
    return group
}

function arrowFromTo(arrow,start,end) {
    const vecToStart = vec3().subVectors(end,start)
    const angle = EX.angleTo(vecToStart);
    const length = vecToStart.length()
    const halfWidth = arrow.userData.halfWidth
    const pointerBaseHalfWidth = arrow.userData.pointerBaseHalfWidth
    const pointerLength = arrow.userData.pointerLength
    const lineLength = length - pointerLength + 0.1
    const z = arrow.userData.z

    const line = arrow.getObjectByName(ARROW_LINE)
    line.geometry.vertices[0].set(0,halfWidth,z)
    line.geometry.vertices[1].set(lineLength,halfWidth,z)
    line.geometry.vertices[2].set(lineLength,-halfWidth,z)
    line.geometry.vertices[3].set(0,-halfWidth,z)
    _.each(line.geometry.vertices, v=>transform(v,angle,start))
    line.geometry.verticesNeedUpdate = true

    const pointer = arrow.getObjectByName(ARROW_POINTER)
    pointer.geometry.vertices[0].set(length - pointerLength,pointerBaseHalfWidth,z)
    pointer.geometry.vertices[1].set(length,0,z)
    pointer.geometry.vertices[2].set(length - pointerLength,-pointerBaseHalfWidth,z)
    _.each(pointer.geometry.vertices, v=>transform(v,angle,start))
    pointer.geometry.verticesNeedUpdate = true
}

function transform(vec,angle,start) {
    vec.applyAxisAngle(EZ,angle)
    vec.add(start)
}