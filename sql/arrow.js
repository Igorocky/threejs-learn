'use strict';

const ARROW_LINE = "ARROW_LINE"
const ARROW_POINTER = "ARROW_POINTER"

function arrowCreate({color,name,width,z,pointerLength}) {
    const group = new THREE.Group();
    group.name = name
    const halfWidth = width/2
    let pointerBaseHalfWidth = halfWidth*3
    pointerBaseHalfWidth = pointerBaseHalfWidth > 1 ? pointerBaseHalfWidth : 1
    group.userData = {
        halfWidth: halfWidth,
        pointerBaseHalfWidth: pointerBaseHalfWidth,
        z:z?z:0,
        pointerLength:pointerLength
    }
    group.add(createPolygon({
        name: ARROW_LINE,
        vertices: _.map(createArrowVertices(vec3(0,0), vec3(10,0), group.userData), v=>[v.x,v.y]),
        props: {color:color}
    }))
    return group
}

function createArrowVertices(start, end, userData) {
    const arrVec = vec3().subVectors(end,start)
    const length = arrVec.length()
    const lineLength = length - userData.pointerLength
    const norm = arrVec.clone().normalize().applyAxisAngle(EZ, THREE.Math.degToRad(90))
    const v0 = norm.clone().multiplyScalar(userData.halfWidth).add(start)
    const v1 = v0.clone().add(arrVec.clone().setLength(lineLength))
    const v6 = norm.clone().negate().multiplyScalar(userData.halfWidth).add(start)
    const v5 = v6.clone().add(arrVec.clone().setLength(lineLength))
    const pointerBaseDiffHalfWidth = userData.pointerBaseHalfWidth-userData.halfWidth
    const v2 = v1.clone().add(norm.clone().multiplyScalar(pointerBaseDiffHalfWidth))
    const v4 = v5.clone().add(norm.clone().negate().multiplyScalar(pointerBaseDiffHalfWidth))
    return [v0,v1,v2,end.clone(),v4,v5,v6]
}

function arrowFromTo(arrow,start,end) {
    const line = arrow.getObjectByName(ARROW_LINE)
    const verts = createArrowVertices(start, end, arrow.userData)
    for (let i = 0; i < verts.length; i++) {
        line.geometry.vertices[i].copy(verts[i])
    }
    line.geometry.verticesNeedUpdate = true
}
