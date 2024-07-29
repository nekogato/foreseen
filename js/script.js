import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ProjectedMaterial from '../js/ProjectedMaterial.js';

let camera, scene, renderer;
let targetDom;

let raycaster;
let pointer;
let objects = [];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let setIndex = Math.floor(Number(urlParams.get("set")))
// console.log(setIndex)

if (setIndex == 0) {
    console.log(document.querySelector(".wrapper-fold-2").dataset.shop)
    setIndex = document.querySelector(".wrapper-fold-2").dataset.shop
}

// if (window.seqIndex !== undefined && setIndex == 0) setIndex = window.seqIndex
// console.log(window.seqIndex, setIndex) 

if (setIndex == undefined || setIndex > 5 || setIndex < 1) setIndex = 1

let isShadeSet = urlParams.get("isShaded") == "false" ? false : true
// console.log(isShadeSet)

const colorArrayIndex = setIndex-1
const showSeqIndex = setIndex-1
const posArrayIndex = setIndex-1

const objArray = [
    {path: "ElectricityBox_20240628.obj",       size: 10},              // 0
    {path: "Iron_20240628.obj",                 size: 0.5},             // 1
    {path: "JwelleryBox_20240628.obj",          size: 0.15},               // 2
    {path: "Keys_Main_20240628.obj",            size: 0.4},               // 3
    {path: "NeedlePad_20240628.obj",            size: 3},               // 4
    {path: "PearlTools_20240628.obj",           size: 0.3},               // 5
    {path: "Pin_20240628.obj",                  size: 0.05},            // 6
    {path: "PressureCooker_Top_20240628.obj",   size: 0.9},               // 7
    {path: "Scissors_20240628.obj",             size: 0.5},               // 8
    {path: "ShoeStand_20240628.obj",            size: 0.7},               // 9
    {path: "WorkingDesk_20240628.obj",          size: 0.4},               // 10
]

const colorArray = [
    [new THREE.Color(0x7abbb8), new THREE.Color(0x5e9391), new THREE.Color(0x84cfcd)],
    [new THREE.Color(0xffbdff), new THREE.Color(0xff9bff), new THREE.Color(0xf68af6)],
    [new THREE.Color(0xffe7ab), new THREE.Color(0xedd087), new THREE.Color(0xefca6c)],
    [new THREE.Color(0xb490e5), new THREE.Color(0x9a68df), new THREE.Color(0x763dc4)],
    [new THREE.Color(0x87d190), new THREE.Color(0x73de80), new THREE.Color(0x4fe962)],
]

const posArray = [
    [{x:0, z:0.25}, {x:-0.25, z:-0.12}, {x:0.25, z:0.25}],
    [{x:-0.25, z:0.1}, {x:0.1, z:-0.2}, {x:0.25, z:0.1}],
    [{x:0.25, z:0.25}, {x:-0.2, z:-0.1}, {x:0.1, z:-0.15}],
    [{x:-0.25, z:0}, {x:0, z:-0.25}, {x:0.25, z:0.25}],
    [{x:0.25, z:0.25}, {x:0, z:0}, {x:-0.25, z:-0.25}],
]

const showSeqArray = [
    [9,2,0],       // [0,1,6],
    [3,10,9],
    [5, 10, 2],    // [2,4,5],
    [8,7,0],
    [3,7,5],
]

// const colorArraySet = colorArray[colorArray.length-1]
// const colorArraySet = colorArray[Math.floor(Math.random()*colorArray.length)]
const colorArraySet = colorArray[colorArrayIndex]

// const posArraySet = posArray[posArray.length-1]
const posArraySet = posArray[posArrayIndex]

// const showSeq = [0, 1, 6]
// const showSeq = [3, 10, 9]
const showSeq = showSeqArray[showSeqIndex]

let object, object2, object3;
let pMat, pMat2, pMat3;

let thumbnail
let thumbnailImg01, thumbnailImg02, thumbnailImg03;

let hemisphereLight

let controls;

let placementState = 0;

const isProjectedMaterialUsed = false
const isShadeEnabled = isShadeSet

document.addEventListener("DOMContentLoaded", DOMContentLoaded)

function DOMContentLoaded() {
    setupInsideMenu()
    init();
    animate();
}
function setupInsideMenu() {
    const menuItems = document.querySelectorAll(".inside-menu-item")
    console.log(menuItems)
    menuItems.forEach( obj => {
        obj.addEventListener("click", changeDetailView)
    })
}
function changeDetailView( e ) {
    const selectedMenuItems = document.querySelectorAll(".inside-menu-item.selected")
    selectedMenuItems.forEach( obj => {
        obj.classList.remove("selected")
    })
    e.target.classList.add("selected")

    const activeDetailContent = document.querySelectorAll(".content.active")
    activeDetailContent.forEach( obj => {
        obj.classList.remove("active")
    })
    const activeContent = document.querySelector(".content.for-" + e.target.dataset.detail)
    if (activeContent !== undefined) {
        activeContent.classList.add("active")
    }
    // document.getElementsByClassName(activeContent)[0].classList.add("active")
    
    // window.scrollTo({
    //     top: 0, 
    //     // behavior:"smooth"
    // })
}
function animate() {
    if (object) object.rotation.z += 0.01 * 1;
    if (object2) object2.rotation.z += -0.01 * 1;
    if (object3) {
        if (placementState == 0) object3.rotation.y += -0.01 * 1;
        if (placementState == 1) object3.rotation.z += -0.01 * 1;
        if (placementState == 2) object3.rotation.z += -0.01 * 1;
    }

    if (controls) controls.update()
    render()

    requestAnimationFrame(animate)
}

function changePlacement() {

    console.log("changePlacement")

    placementState++
    if (placementState > 2) placementState = 0

    switch (placementState) {
        case 0:
            object.position.z = 0
            object2.position.x = 0
            object2.position.z = 0
            object3.position.x = 0
            object3.position.z = 0

            object3.rotation.z = 0
            break
        case 1:
            object.position.z = 0
            object2.position.x = -0.25
            object3.position.x = 0.25

            object3.rotation.y = 0
            break
        case 2:
            // object.position.x = 0
            // object.position.z = 0.25
            // object2.position.x = -0.25
            // object2.position.z = -0.12
            // object3.position.x = 0.25
            // object3.position.z = 0.25

            object.position.x = posArraySet[0].x
            object.position.z = posArraySet[0].z
            object2.position.x = posArraySet[1].x
            object2.position.z = posArraySet[1].z
            object3.position.x = posArraySet[2].x
            object3.position.z = posArraySet[2].z

            object3.rotation.y = 0
    }

    // camera.position.x = 0;
    // camera.position.y = 0;
    // camera.position.z = 1;

    camera.position.x = -1;
    camera.position.y = 2;
    camera.position.z = 1;
}

function init() {

    targetDom = document.getElementById("threejs-canvas")

    // camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20 );

    camera = new THREE.OrthographicCamera(targetDom.getBoundingClientRect().width / - 2, targetDom.getBoundingClientRect().width/ 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 20);
    camera.zoom = 1000;
    camera.position.x = -1;
    camera.position.y = 2;
    camera.position.z = 1;
    camera.updateProjectionMatrix()

    window.camera = camera

    // scene

    scene = new THREE.Scene();

    if (isShadeEnabled) {
        hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0xCCCCCC, 4);
        scene.add( hemisphereLight );

        cameraChange()
    } else {
        const ambientLight = new THREE.AmbientLight( 0xffffff, 4 );
        scene.add( ambientLight );

        // const pointLight = new THREE.PointLight( 0xffffff, 15 );
        // camera.add( pointLight );
    }
    
    scene.add(camera);

    raycaster = new THREE.Raycaster()
    pointer = new THREE.Vector2(-2,-2)

    // manager

    function loadModel() {

        console.log("loadModel")

        object.traverse(function (child) {
            console.log(child)
            if (child.isMesh) {
                // child.material = new THREE.MeshBasicMaterial({color: new THREE.Color("#FF0000")});
                // child.material.map = texture;

                child.material = pMat
            }

        });

        // object.position.y = - 0.95;
        // object.scale.setScalar( 0.01 );
        object.rotation.x = Math.PI / 2
        // object.scale.setScalar(10);
        object.scale.setScalar( objArray[showSeq[0]].size );
        object.userData.map = thumbnailImg01
        scene.add(object);


        object2.traverse(function (child) {
            console.log(child)
            if (child.isMesh) {
                // child.material = new THREE.MeshBasicMaterial({color: new THREE.Color("#FF0000")});
                // child.material.map = texture;

                child.material = pMat2
            }

        });

        // object.position.y = - 0.95;
        // object.scale.setScalar( 0.01 );
        object2.rotation.x = Math.PI / 2
        // object2.scale.setScalar(0.5);
        object2.scale.setScalar( objArray[showSeq[1]].size );
        // object2.position.x= -0.5;
        object2.userData.map = thumbnailImg02
        scene.add(object2);


        object3.traverse(function (child) {
            console.log(child)
            if (child.isMesh) {
                // child.material = new THREE.MeshBasicMaterial({color: new THREE.Color("#FF0000")});
                // child.material.map = texture;

                child.material = pMat3
            }

        });

        // object.position.y = - 0.95;
        // object.scale.setScalar( 0.01 );
        object3.rotation.x = Math.PI / 2
        object3.scale.setScalar(0.05);
        console.log(objArray[showSeq[2]].size)
        object3.scale.setScalar( objArray[showSeq[2]].size );
        // object2.position.x= -0.5;
        // object3.position.y = 0.065;
        object3.userData.map = thumbnailImg03
        scene.add(object3);



        // const cube = new THREE.Mesh(
        //     new THREE.BoxGeometry(),
        //     new THREE.MeshBasicMaterial({
        //         map: texture
        //     })
        // )

        // cube.position.x = -1
        // scene.add( cube )

        initThumbnail()

        placementState = 2 -1
        changePlacement()

        render();

    }

    const manager = new THREE.LoadingManager(loadModel);


    
    // texture
    if (isProjectedMaterialUsed) {

        const textureLoader = new THREE.TextureLoader(manager);
        // const texture = textureLoader.load( 'assets/uv_grid_opengl.jpg', 
        const texture = textureLoader.load('assets/pink.png',
            () => {
                console.log("texture")
                render()
            });
        texture.colorSpace = THREE.SRGBColorSpace;

        const texture2 = textureLoader.load('assets/pastel.png',
            () => {
                console.log("texture")
                render()
            });
        texture2.colorSpace = THREE.SRGBColorSpace;

        const texture3 = textureLoader.load('assets/jade.jpg',
            () => {
                console.log("texture")
                render()
            });
        texture3.colorSpace = THREE.SRGBColorSpace;

        pMat = new ProjectedMaterial({
            camera,
            texture2: texture,
            color: '#37E140',
        })

        pMat2 = new ProjectedMaterial({
            camera,
            texture2: texture2,
            color: '#37E140',
        })

        pMat3 = new ProjectedMaterial({
            camera,
            texture2: texture3,
            color: '#37E140',
        })
    } else {
        const textureLoader = new THREE.TextureLoader(manager);
        thumbnailImg01 = textureLoader.load('assets/thumbnail-01.png')
        thumbnailImg01.colorSpace = THREE.SRGBColorSpace;
        thumbnailImg02 = textureLoader.load('assets/thumbnail-02.png')
        thumbnailImg02.colorSpace = THREE.SRGBColorSpace;
        thumbnailImg03 = textureLoader.load('assets/thumbnail-03.png')
        thumbnailImg03.colorSpace = THREE.SRGBColorSpace;

        // pMat = new THREE.MeshBasicMaterial({color: new THREE.Color(0x7abbb8)})
        // pMat2 = new THREE.MeshBasicMaterial({color: new THREE.Color(0x5e9391)})
        // pMat3 = new THREE.MeshBasicMaterial({color: new THREE.Color(0x84cfcd)})

        pMat = new THREE.MeshStandardMaterial({color: colorArraySet[0]})
        pMat2 = new THREE.MeshStandardMaterial({color: colorArraySet[1]})
        pMat3 = new THREE.MeshStandardMaterial({color: colorArraySet[2]})
    }

    // model

    function onProgress(xhr) {

        if (xhr.lengthComputable) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log('model ' + percentComplete.toFixed(2) + '% downloaded');

        }

    }

    function onError() { }

    const loader = new OBJLoader(manager);
    loader.load('assets/'+ objArray[showSeq[0]].path, function (obj) {   // assets/ElectricityBox_20240628.obj

        object = obj;
        objects.push(obj)

    }, onProgress, onError);

    loader.load('assets/'+ objArray[showSeq[1]].path, function (obj) {   // 'assets/Iron_20240628.obj'

        object2 = obj;
        objects.push(obj)

    }, onProgress, onError);

    loader.load('assets/'+ objArray[showSeq[2]].path, function (obj) {   // 'assets/Pin_20240628.obj'

        object3 = obj;
        objects.push(obj)

    }, onProgress, onError);


    //

    renderer = new THREE.WebGLRenderer({ antialias: true});
    // renderer.alpha = true
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( targetDom.getBoundingClientRect().width, Math.floor(window.innerHeight));
    renderer.setClearColor(0xbbbfc0)
    // renderer.setClearColor(0x7abbb8)
    
    targetDom.appendChild(renderer.domElement)
    // document.body.appendChild(renderer.domElement);

    //

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true
    controls.enablePan = false
    controls.maxZoom = 1500;
    controls.minZoom = 750;
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.addEventListener('change', cameraChange);

    controls.autoRotate = true

    //

    window.addEventListener('resize', onWindowResize);
    // document.addEventListener( 'dblclick', changePlacement );
    document.getElementById("debug-autoRotate").addEventListener("change", inputChange)
    document.getElementById("debug-center").addEventListener("change", inputChange)
    document.getElementById("debug-series").addEventListener("change", inputChange)
    document.getElementById("debug-shifted").addEventListener("change", inputChange)

    document.addEventListener("pointermove", onPointerMove)
    document.addEventListener("click", onPointerClick)

    onWindowResize()
}

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	// pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	// pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    pointer.x = ( event.clientX / targetDom.getBoundingClientRect().width ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // raycast()

    // console.log(pointer.x, pointer.y)
}

function onPointerClick( event ) {

    raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 1 ) {
        switch (intersects[ 0 ].object.parent) {
            case object:
                // console.log("1")
                openObject(0)
                window.openObject(0)
                break
            case object2:
                // console.log("2")
                openObject(1)
                window.openObject(1)
                break
            case object3:
                // console.log("3")
                openObject(2)
                window.openObject(2)
                break
        }
    }
}

function raycast() {
    raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( objects );

    // console.log(intersects.length)

	for ( let i = 0; i < intersects.length; i ++ ) {
        if (intersects[ i ].object === object) {
            console.log("1")
        }

        switch (intersects[ i ].object.parent) {
            case object:
                // console.log("1")
                showThumbnail(object)
                break
            case object2:
                // console.log("2")
                showThumbnail(object2)
                break
            case object3:
                // console.log("3")
                showThumbnail(object3)
                break
        }

		// intersects[ i ].object.material.color.set( 0xff0000 );
	}

    if ( intersects.length < 1 ) {
        hideThumbnail()
    }

    // if ( intersects.length < 1) {
    //     // console.log(highlightedObjects)
    //     if (object && object.userData !== undefined) {
    //         console.log(object.userData.originalColor)
    //         if (object.userData.originalColor !== undefined && !object.userData.mouseover) {
    //             object.material.color.set(object.userData.originalColor)
    //             object.userData.mouseover = false
    //         }
    //     }
    //     if (object2 && object2.userData !== undefined) {
    //         if (object2.userData.originalColor !== undefined && !object2.userData.mouseover) {
    //             object2.material.color.set(object2.userData.originalColor)
    //             object2.userData.mouseover = false
    //         }
    //     }
    //     if (object3 && object3.userData !== undefined) {
    //         if (object3.userData.originalColor !== undefined && !object3.userData.mouseover) {
    //             object3.material.color.set(object23userData.originalColor)
    //             object3.userData.mouseover = false
    //         }
    //     }
    // }
}

function openObject( index ) {
    console.log("openObject", index)
}

function initThumbnail() {
    console.log("initThumbnail")
    const spriteMaterial = new THREE.SpriteMaterial({
        map: thumbnailImg01,
        depthTest: false,
        opacity: 0,
    });
    // spriteMaterial.sizeAttenuation = false;

    thumbnail = new THREE.Sprite( spriteMaterial )
    thumbnail.center.set(0.5,-0.5)
    thumbnail.scale.setScalar(0.25)
    scene.add(thumbnail)
}
function showThumbnail( target ) {
    targetDom.style.cursor = "pointer"
    // console.log("showThumbnail")
    if (thumbnail) {
        thumbnail.material.opacity = 1
        thumbnail.position.copy(target.position)
        thumbnail.material.map = target.userData.map
    }
    
    // thumbnail.position.y += 0.5
    // thumbnail.position.y = pointer.y
}
function hideThumbnail() {
    targetDom.style.cursor = ""
    if (thumbnail !== undefined && thumbnail.material.opacity > 0) {
        thumbnail.material.opacity -= 0.01

        // console.log(thumbnail.material.opacity)
        if (thumbnail.material.opacity > 0) {
            requestAnimationFrame(hideThumbnail)
        } else {
            thumbnail.material.opacity = 0
        }
    }
}

function inputChange(e) {
    console.log(e)
    console.log(e.target.checked, e.target.name, e.target.value)

    switch (e.target.name) {
        case "autoRotate_chkbox":
            controls.autoRotate = e.target.checked
            break
        case "placement_radiobtn":
            if (e.target.value == "center") placementState = 0 - 1
            if (e.target.value == "series") placementState = 1 - 1
            if (e.target.value == "shifted") placementState = 2 - 1
            changePlacement()
            break
    }
}

function onWindowResize() {
    let ratio = 1
    if (window.innerWidth < 480) {
        ratio = 0.7
    }

    if (camera.isOrthographicCamera) {
        camera.left = targetDom.getBoundingClientRect().width / - 2
        camera.right = targetDom.getBoundingClientRect().width / 2
        camera.top = window.innerHeight / 2 * ratio
        camera.bottom = window.innerHeight / - 2 * ratio

        camera.updateProjectionMatrix();
    } else {
        camera.aspect = window.innerWidth / ( window.innerHeight * ratio );
        camera.updateProjectionMatrix();
    }

    renderer.setSize(targetDom.getBoundingClientRect().width, window.innerHeight * ratio);

    render()
}

function cameraChange() {
    if (hemisphereLight) {
        hemisphereLight.position.copy(camera.position.clone().normalize())
    }
}

function render() {
    raycast()
    renderer.render(scene, camera);
    if (isProjectedMaterialUsed) updatePMatCamera()

}
function updatePMatCamera() {
    pMat.uniforms.viewMatrixCamera.value = camera.matrixWorldInverse.clone()
    pMat.uniforms.projectionMatrixCamera.value = camera.projectionMatrix.clone()
    pMat.uniforms.modelMatrixCamera.value = camera.matrixWorld.clone()
    pMat.uniforms.projPosition.value = camera.position.clone()

    pMat2.uniforms.viewMatrixCamera.value = camera.matrixWorldInverse.clone()
    pMat2.uniforms.projectionMatrixCamera.value = camera.projectionMatrix.clone()
    pMat2.uniforms.modelMatrixCamera.value = camera.matrixWorld.clone()
    pMat2.uniforms.projPosition.value = camera.position.clone()

    pMat3.uniforms.viewMatrixCamera.value = camera.matrixWorldInverse.clone()
    pMat3.uniforms.projectionMatrixCamera.value = camera.projectionMatrix.clone()
    pMat3.uniforms.modelMatrixCamera.value = camera.matrixWorld.clone()
    pMat3.uniforms.projPosition.value = camera.position.clone()
}
