'use strict';

function render({rootElemId, cameraHeight, onKeyDown, onLeftClick, initialState, render}) {
    const clock = new THREE.Clock()

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene()

    // create a camera, which defines where we're looking at.
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

    // create a renderer and set the size
    const renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0xFFFFFF, 1.0)
    renderer.setSize(window.innerWidth, window.innerHeight)

    // position and point the camera
    camera.position.set(0,0,cameraHeight)
    camera.up = new THREE.Vector3(0,1,0)
    camera.lookAt(new THREE.Vector3(0,0,0))

    // add the output of the renderer to the html element
    document.getElementById(rootElemId).appendChild(renderer.domElement)
    if (onKeyDown) {
        document.addEventListener( "keydown", onKeyDown)
    }
    if (onLeftClick) {
        document.addEventListener("click", onLeftClick)
    }

    let state = initialState?initialState:{}

    function loop() {
        state = render(clock.getElapsedTime(), state, scene, camera)
        renderer.render(scene, camera)
        requestAnimationFrame(loop)
    }

    loop()

}

function createLine({x1,y1,x2,y2,color}) {
    const lineMaterial = new THREE.LineBasicMaterial( { color: color} );
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( x1, y1, 0) );
    geometry.vertices.push(new THREE.Vector3( x2, y2, 0) );
    return new THREE.Line( geometry, lineMaterial );
}

function createCoordinateGrid({scene, minorStep, majorStep, minX, maxX, minY, maxY, minorColor, majorColor}) {
    function drawLines({continueCondition, ix1,iy1,ix2,iy2,dx,dy,iCnt}) {
        let x1 = ix1
        let x2 = ix2
        let y1 = iy1
        let y2 = iy2
        let cnt = iCnt
        while (continueCondition(x1,y1)) {
            scene.add(createLine({x1:x1,y1:y1,x2:x2,y2:y2,color:cnt % majorStep == 0?majorColor:minorColor}))
            x1+=dx
            x2+=dx
            y1+=dy
            y2+=dy
            cnt++
        }
    }

    drawLines({continueCondition: (x1,y1) => x1>=minX, ix1:0,iy1:minY,ix2:0,iy2:maxY,dx:-minorStep,dy:0,iCnt:0})
    drawLines({continueCondition: (x1,y1) => x1<=maxX, ix1:minorStep,iy1:minY,ix2:minorStep,iy2:maxY,dx:minorStep,dy:0,iCnt:1})
    drawLines({continueCondition: (x1,y1) => y1>=minY, ix1:minX,iy1:0,ix2:maxX,iy2:0,dx:0,dy:-minorStep,iCnt:0})
    drawLines({continueCondition: (x1,y1) => y1<=maxY, ix1:minX,iy1:minorStep,ix2:maxX,iy2:minorStep,dx:0,dy:minorStep,iCnt:1})
}

function createPolygon({vertices, props}) {
    let verticesSize = _.size(vertices);
    let shape = new THREE.Shape();

    shape.moveTo.apply(shape, vertices[verticesSize-1]);
    for (let i = 0; i < verticesSize; i++) {
        shape.lineTo.apply(shape, vertices[i]);
    }

    var geometry = new THREE.ShapeGeometry(shape);
    var material = new THREE.MeshBasicMaterial( { color: props.color, side: THREE.DoubleSide } );

    return new THREE.Mesh( geometry, material );
}

const __raycaster = new THREE.Raycaster();
const __mouse = new THREE.Vector2();
const __planeX = new THREE.Plane(new THREE.Vector3(0,0,1), 0);
const ___intersects = new THREE.Vector3();
function getCoordsOfMousePointer(event, camera) {
    __mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    __mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    __raycaster.setFromCamera( __mouse, camera );
    __raycaster.ray.intersectPlane(__planeX, ___intersects);
    // console.log("intersects = " + JSON.stringify(intersects));
    return {x:intersects.x, y:intersects.y}
}
