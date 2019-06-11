'use strict';

const ARROW_LINE = "ARROW_LINE"

function arrowCreate({color,name}) {
    const group = new THREE.Group();
    group.name = name
    group.add(createLine({start:vec3(0,0), end:vec3(1,0), color:color,name:ARROW_LINE}))
    return group
}

function arrowFromTo(arrow,start,end) {
    const line = arrow.getObjectByName(ARROW_LINE)
    line.geometry.vertices[0].copy(start)
    line.geometry.vertices[1].copy(end)
    line.geometry.verticesNeedUpdate = true
}