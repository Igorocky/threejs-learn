'use strict';

const ARROW_LINE = "ARROW_LINE"

function arrowCreate({color,name,width,z}) {
    const group = new THREE.Group();
    group.name = name
    group.userData = {width: width, z:z?z:0}
    const halfWidth = width/2
    group.add(createPolygon({
        name: ARROW_LINE,
        vertices:[[0,halfWidth], [10,halfWidth], [10,-halfWidth], [0,-halfWidth]],
        props: {color:color}
    }))
    return group
}

function arrowFromTo(arrow,start,end) {
    const vecToStart = vec3().subVectors(end,start)
    const length = vecToStart.length()
    const halfWidth = arrow.userData.width/2
    const z = arrow.userData.z
    const line = arrow.getObjectByName(ARROW_LINE)
    line.geometry.vertices[0].set(0,halfWidth,z)
    line.geometry.vertices[1].set(length,halfWidth,z)
    line.geometry.vertices[2].set(length,-halfWidth,z)
    line.geometry.vertices[3].set(0,-halfWidth,z)
    line.geometry.verticesNeedUpdate = true

    arrow.setRotationFromAxisAngle(EZ,EX.angleTo(vecToStart))
    arrow.position.copy(start)
}
