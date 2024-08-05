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
console.log(setIndex)

if (setIndex == 0) {
    console.log(document.querySelector(".wrapper-fold-2").dataset.shop)
    setIndex = document.querySelector(".wrapper-fold-2").dataset.shop
}

// setIndex = 4

// if (window.seqIndex !== undefined && setIndex == 0) setIndex = window.seqIndex
// console.log(window.seqIndex, setIndex) 

if (setIndex == undefined || setIndex > 6 || setIndex < 1) setIndex = 1

let isShadeSet = urlParams.get("isShaded") == "false" ? false : true
// console.log(isShadeSet)

const colorArrayIndex = setIndex-1
const showSeqIndex = setIndex-1
const posArrayIndex = setIndex-1

// const objArray = [
//     {path: "ElectricityBox_20240628.obj",       size: 10},              // 0
//     {path: "Iron_20240628.obj",                 size: 0.5},             // 1
//     {path: "JwelleryBox_20240628.obj",          size: 0.15},               // 2
//     {path: "Keys_Main_20240628.obj",            size: 0.4},               // 3
//     {path: "NeedlePad_20240628.obj",            size: 3},               // 4
//     {path: "PearlTools_20240628.obj",           size: 0.3},               // 5
//     {path: "Pin_20240628.obj",                  size: 0.05},            // 6
//     {path: "PressureCooker_Top_20240628.obj",   size: 0.9},               // 7
//     {path: "Scissors_20240628.obj",             size: 0.5},               // 8
//     {path: "ShoeStand_20240628.obj",            size: 0.7},               // 9
//     {path: "WorkingDesk_20240628.obj",          size: 0.4},               // 10
// ]
const objArray = [
    {path: "ElectricityBox_20240628.obj",           name:"ElectricityBox",        size: 10,           shop: "A"},               // 0
    {path: "PressureCooker_Top_20240628.obj",       name:"PressureCooker_Top",        size: 0.9,          shop: "A"},               // 1
    {path: "WorkingDesk_20240628.obj",              name:"WorkingDesk",        size: 0.4,          shop: "B"},               // 2
    {path: "ShoeStand_20240628.obj",                name:"ShoeStand",        size: 0.7,          shop: "C"},               // 3
    {path: "Iron_20240628.obj",                     name:"Iron",        size: 0.6,          shop: "D"},               // 4
    {path: "PearlTools_20240628.obj",               name:"PearlTools",        size: 0.3,     xRot: Math.PI/-4,      yRot: Math.PI/2,     zPos: -0.8, shop: "B"},               // 5
    {path: "Scissors_20240628.obj",                 name:"Scissors",        size: 0.5,       xRot: Math.PI/-4,      zPos: -0.15,       shop: "D"},               // 6
    {path: "NeedlePad_20240628.obj",                name:"NeedlePad",        size: 3,            shop: "E"},               // 7
    {path: "JwelleryBox_20240628.obj",              name:"JwelleryBox",        size: 0.15,         shop: "F"},               // 8
    {path: "Keys_Main_20240628.obj",                name:"Keys_Main",        size: 0.4,          shop: "C"},               // 9
    {path: "Pin_20240628.obj",                      name:"Pin",               size: 0.07,    yRot: Math.PI/4,       zPos: -1,    shop: "D"},               // 10
    {path: "ShoesOBJ_20240723.obj",                 name:"Group19384",        size: 0.05,    xRot: Math.PI/-2,      zPos: -3.5,     shop: "C"},               // 11
    {path: "ShoeBagOBJ_20240724.obj",               name:"Group10136",        size: 3.5,     xRot: Math.PI/-2,     shop: "C"},               // 12
    {path: "WoodenBoxOpenOBJ_20240725.obj",         name:"Group21129",        size: 0.08,    xRot: Math.PI/-2,     shop: "F"},               // 13
    {path: "WoodenBoxClosedOBJ_20240725.obj",       name:"Group47146",        size: 0.08,    xRot: Math.PI/-2,     shop: "F"},               // 14
    {path: "ShoeRackOBJ_20240726.obj",              name:"Group57180",        size: 0.18,    xRot: Math.PI/-2,     shop: "F"},               // 15
    {path: "SewingMachineOBJ_20240727.obj",         name:"Group7732",         size: 0.75,    xRot: Math.PI/-2,     shop: "E"},               // 16
    {path: "JarOfJadeOBJ_20240727.obj",             name:"Group17388",        size: 0.15,    xRot: Math.PI/-2,     shop: "B"},               // 17
    {path: "HandDrawnShoes_OBJ_20240730.obj",       name:"Group34095",        size: 0.15,    xRot: Math.PI/-2,      zPos: -0.4,     shop: "F"},               // 18
    {path: "HandDrawnShoes2_OBJ_20240730.obj",      name:"Group50196",        size: 0.2,     xRot: Math.PI/-2,     shop: "C"},               // 19
    {path: "HandDrawnKey_OBJ_20240730.obj",         name:"Group64819",        size: 0.18,    xRot: Math.PI/-4,     shop: "C"},               // 20
    {path: "HandDrawnNecklace_OBJ_20240730.obj",    name:"Group14082",        size: 0.2,     xRot: Math.PI/-4,     zPos: -0.5,      shop: "B"},               // 21
    {path: "HandDrawnScissor_OBJ_20240730.obj",     name:"Group8048",         size: 0.0055,   xRot: Math.PI*3/4,    zPos: -12,        shop: "D"},               // 22
]

const colorArray = [
    [new THREE.Color(0x7abbb8), new THREE.Color(0x5e9391), new THREE.Color(0x84cfcd)],
    [new THREE.Color(0xffbdff), new THREE.Color(0xff9bff), new THREE.Color(0xf68af6)],
    [new THREE.Color(0xffe7ab), new THREE.Color(0xedd087), new THREE.Color(0xefca6c)],
    [new THREE.Color(0xb490e5), new THREE.Color(0x9a68df), new THREE.Color(0x763dc4)],
    [new THREE.Color(0x87d190), new THREE.Color(0x73de80), new THREE.Color(0x4fe962)],
    [new THREE.Color(0x8ec4ff), new THREE.Color(0x469bf8)],
]

const posArray = [
    [{x:-0.2, z:0.3}, {x:0.3, z:-0.3}, {x:0.3, z:0.15}, {x:0, z:-0.1}, {x:-0.3, z:-0.2}],
    // [{x:0, z:0.25}, {x:-0.25, z:-0.12}, {x:0.25, z:0.25}, {x:-0.25, z:-0.25}, {x:-0.12, z:0.12}],
    [{x:-0.3, z:0.3}, {x:0.3, z:-0.3}, {x:0.3, z:0.1}, {x:-0.1, z:-0.3}, {x:-0.3, z:-0.2}, {x:0, z:0.2}],
    // [{x:-0.25, z:0.1}, {x:0.1, z:-0.2}, {x:0.25, z:0.1}],
    [{x:0.1, z:0.3}, {x:0.2, z:-0.2}, {x:0, z:0.1}, {x:-0.2, z:-0.2}],
    // [{x:0.25, z:0.25}, {x:-0.2, z:-0.1}, {x:0.1, z:-0.15}],
    [{x:-0.25, z:0}, {x:0, z:-0.25}, {x:0.25, z:0.25}],
    [{x:0.1, z:0.2}, {x:-0.2, z:-0.1}],
    [{x:-0.2, z:0.2}, {x:0.2, z:0}],
]

const showSeqArray = [
    [8,13,14,15,18],       // [0,1,6],    F
    [3,9,11,12,19,20],     // [3,10,9],   C
    [2,5,17,21],           // [2,4,5],    B
    [4,6,10,22],           // [4,6,10,22] D
    [7,16],                //             E
    [0,1],                 //             A
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
    // animate();
    fancyboxBinding()
}
function setupInsideMenu() {
    const menuItems = document.querySelectorAll(".fold-2-right .inside-menu-item")
    console.log(menuItems)
    menuItems.forEach( obj => {
        obj.addEventListener("click", changeDetailView)
    })

    /* for mobile */

    const mobileMenuItems = document.querySelectorAll(".mobile_inside-menu_wrapper .inside-menu-item")
    mobileMenuItems.forEach( obj => {
        obj.addEventListener("click", mobileChangeDetailView)
    })
}

function changeDetailView( e ) {
    const selectedMenuItems = document.querySelectorAll(".fold-2-right .inside-menu-item.selected")
    selectedMenuItems.forEach( obj => {
        obj.classList.remove("selected")
    })
    e.target.classList.add("selected")

    const scrollins = document.querySelectorAll(".content .scrollin.startani")
    scrollins.forEach( obj => {
        obj.classList.remove("onscreen")
        obj.classList.remove("startani")
        obj.classList.add("leavescreen")
    })

    const activeDetailContent = document.querySelectorAll(".content.active")
    activeDetailContent.forEach( obj => {
        obj.classList.remove("active")
    })
    const activeContent = document.querySelector(".content.for-" + e.target.dataset.detail)
    if (activeContent !== undefined) {
        activeContent.classList.add("active")
    }

    // document.getElementsByClassName(activeContent)[0].classList.add("active")
    
    window.scrollTo({
        top: 0, 
        // behavior:"smooth"
    })

    doscroll()
}

function fancyboxBinding() {
    console.log("fbBinding")
    // console.log($.fancybox)

    $.fancybox.defaults.afterLoad = function() {
        console.log("resetInsideMenuButton")

        const scrollins = document.querySelectorAll(".fancybox-content .scrollin")
        
        scrollins.forEach( obj => {
            obj.classList.remove("onscreen")
            obj.classList.remove("startani")
            obj.classList.add("leavescreen")
        })

        // $(".fancybox-content").css( {
        //     height: "",
        //     overflow:"auto"
        // })
        console.log($(".fancybox-content").height())
        $(".fancybox-content").css( {
            height: $(".fancybox-content").height()+40+"px",
            overflow: "hidden"
        })

        $(".fancybox-slide, .fancybox-content").on('scroll', function() {
            doscroll();
        })
        doscroll()
    }
    console.log($.fancybox.defaults)
    $.fancybox.defaults.beforeClose = function() {
        console.log("resetInsideMenuButton")
    }
    
    // $.fancybox.defaults.iframe.css = {overflow: hidden}
    $.fancybox.defaults.beforeClose = function() {
        console.log("resetInsideMenuButton")
    }
    
     // $.fancybox.defaults.iframe.css = {overflow: hidden}
     $.fancybox.defaults.afterClose = function() {
        $(".fancybox-slide .content").height("auto")
        $(".wrapper-fold-2 .content").height("auto")
    }
}

function mobileChangeDetailView( e ) {
    const selectedMenuItems = document.querySelectorAll(".mobile_inside-menu_wrapper .inside-menu-item.selected")
    selectedMenuItems.forEach( obj => {
        obj.classList.remove("selected")
    })
    e.target.classList.add("selected")

    const scrollins = document.querySelectorAll(".content .scrollin.startani")
    scrollins.forEach( obj => {
        obj.classList.remove("onscreen")
        obj.classList.remove("startani")
        obj.classList.add("leavescreen")
    })

    const activeDetailContent = document.querySelectorAll(".content.active")
    activeDetailContent.forEach( obj => {
        obj.classList.remove("active")
    })
    const activeContent = document.querySelector(".content.for-" + e.target.dataset.detail)
    if (activeContent !== undefined) {
        activeContent.classList.add("active")
    }

    // fancyboxBinding()
    doscroll()
}

function animate() {
    rotateObjects()
    
    if (controls) controls.update()
    render()

    requestAnimationFrame(animate)
}

function rotateObjects() {

    for (var i = 0; i < objects.length; i++) {
        objects[i].rotation.z += 0.01 * 1;
    }

    // if (object) object.rotation.z += 0.01 * 1;
    // if (object2) object2.rotation.z += -0.01 * 1;
    // if (object3) {
    //     if (placementState == 0) object3.rotation.y += -0.01 * 1;
    //     if (placementState == 1) object3.rotation.z += -0.01 * 1;
    //     if (placementState == 2) object3.rotation.z += -0.01 * 1;
    // }
}

function changePlacement() {

    console.log("changePlacement")

    placementState++
    if (placementState > 2) placementState = 0

    // switch (placementState) {
    //     case 0:
    //         object.position.z = 0
    //         object2.position.x = 0
    //         object2.position.z = 0
    //         object3.position.x = 0
    //         object3.position.z = 0

    //         object3.rotation.z = 0
    //         break
    //     case 1:
    //         object.position.z = 0
    //         object2.position.x = -0.25
    //         object3.position.x = 0.25

    //         object3.rotation.y = 0
    //         break
    //     case 2:
    //         // object.position.x = 0
    //         // object.position.z = 0.25
    //         // object2.position.x = -0.25
    //         // object2.position.z = -0.12
    //         // object3.position.x = 0.25
    //         // object3.position.z = 0.25

    //         object.position.x = posArraySet[0].x
    //         object.position.z = posArraySet[0].z
    //         object2.position.x = posArraySet[1].x
    //         object2.position.z = posArraySet[1].z
    //         object3.position.x = posArraySet[2].x
    //         object3.position.z = posArraySet[2].z

    //         object3.rotation.y = 0
    // }

    for (var i=0; i < objects.length; i++) {
        if (i<posArraySet.length) {
            objects[i].position.x = posArraySet[i].x
            objects[i].position.z = posArraySet[i].z
        }

        // objects[i].position.set(0,0,0)
    }

    // camera.position.x = 0;
    // camera.position.y = 0;
    // camera.position.z = 1;

    camera.position.x = -1;
    camera.position.y = 2;
    camera.position.z = 1;
}

function pickColor( i ) {
    const color1 = colorArraySet[0]
    const color2 = colorArraySet[colorArraySet.length-1]

    console.log(color1, color2)

    const newColor = new THREE.Color(
        color1.r * (1-i) + color2.r * i,
        color1.g * (1-i) + color2.g * i,
        color1.b * (1-i) + color2.b * i,
    )

    console.log(i, newColor)

    return  newColor
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
        console.log(objects.length)

        for (var i=0; i<objects.length; i++) {

            const obj = objects[i]
            obj.traverse(function (child) {
                if (child.isMesh) {
                    console.log(child.name)
                    child.material = pMat.clone()
                    // child.material.color = colorArraySet[i]
                    child.material.color = pickColor( i / showSeq.length )
                    if (i == 4) {
                        // child.material.color = new THREE.Color(0xCCCCCC)
                        // console.log(child.position)
                        // window.obj = child
                    }
                    // if (i == 1) child.rotation.x = Math.PI / -2

                    if (objArray[showSeq[i]].xRot !== undefined) child.rotation.x = objArray[showSeq[i]].xRot
                    if (objArray[showSeq[i]].yRot !== undefined) child.rotation.y = objArray[showSeq[i]].yRot
                    if (objArray[showSeq[i]].zPos !== undefined) child.position.z = objArray[showSeq[i]].zPos

                } else {
                    console.log(child)
                }
            });
            obj.rotation.x = Math.PI / 2
            obj.scale.setScalar( objArray[showSeq[i]].size );
            obj.userData.map = thumbnailImg01
            scene.add(obj);    
        }

        // object.traverse(function (child) {
        //     console.log(child)
        //     if (child.isMesh) {
        //         // child.material = new THREE.MeshBasicMaterial({color: new THREE.Color("#FF0000")});
        //         // child.material.map = texture;

        //         child.material = pMat
        //     }

        // });

        // // object.position.y = - 0.95;
        // // object.scale.setScalar( 0.01 );
        // object.rotation.x = Math.PI / 2
        // // object.scale.setScalar(10);
        // object.scale.setScalar( objArray[showSeq[0]].size );
        // object.userData.map = thumbnailImg01
        // scene.add(object);


        // object2.traverse(function (child) {
        //     console.log(child)
        //     if (child.isMesh) {
        //         // child.material = new THREE.MeshBasicMaterial({color: new THREE.Color("#FF0000")});
        //         // child.material.map = texture;

        //         child.material = pMat2
        //     }

        // });

        // // object.position.y = - 0.95;
        // // object.scale.setScalar( 0.01 );
        // object2.rotation.x = Math.PI / 2
        // // object2.scale.setScalar(0.5);
        // object2.scale.setScalar( objArray[showSeq[1]].size );
        // // object2.position.x= -0.5;
        // object2.userData.map = thumbnailImg02
        // scene.add(object2);


        // object3.traverse(function (child) {
        //     console.log(child)
        //     if (child.isMesh) {
        //         // child.material = new THREE.MeshBasicMaterial({color: new THREE.Color("#FF0000")});
        //         // child.material.map = texture;

        //         child.material = pMat3
        //     }

        // });

        // // object.position.y = - 0.95;
        // // object.scale.setScalar( 0.01 );
        // object3.rotation.x = Math.PI / 2
        // object3.scale.setScalar(0.05);
        // console.log(objArray[showSeq[2]].size)
        // object3.scale.setScalar( objArray[showSeq[2]].size );
        // // object2.position.x= -0.5;
        // // object3.position.y = 0.065;
        // object3.userData.map = thumbnailImg03
        // scene.add(object3);



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
        animate();

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

    console.log(showSeq.length)
    objects = []
    const objectsNamesArr = []
    for (var i = 0; i < showSeq.length; i++) {
        objectsNamesArr[i] = objArray[showSeq[i]].name
        loader.load('assets/obj/'+ objArray[showSeq[i]].path, function (obj) {   // assets/ElectricityBox_20240628.obj

            console.log(obj)
            // object = obj;
            const objectsId = objectsNamesArr.indexOf( obj.children[0].name)
            console.log( obj.children[0].name, objectsId)
            objects[objectsId] = obj

        }, onProgress, onError);
    }

    // loader.load('assets/obj/'+ objArray[showSeq[0]].path, function (obj) {   // assets/ElectricityBox_20240628.obj

    //     object = obj;
    //     objects.push(obj)

    // }, onProgress, onError);

    // loader.load('assets/obj/'+ objArray[showSeq[1]].path, function (obj) {   // 'assets/Iron_20240628.obj'

    //     object2 = obj;
    //     objects.push(obj)

    // }, onProgress, onError);

    // loader.load('assets/obj/'+ objArray[showSeq[2]].path, function (obj) {   // 'assets/Pin_20240628.obj'

    //     object3 = obj;
    //     objects.push(obj)

    // }, onProgress, onError);


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
        ratio = 1
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

