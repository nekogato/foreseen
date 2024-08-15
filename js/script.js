import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ProjectedMaterial from '../js/ProjectedMaterial.js';

let camera, scene, renderer;
let targetDom;

let objGroup;
let raycaster;
let pointer;
let objects;

let themeColor
const colorWhite = new THREE.Color(0xFFFFFF)

let textMaterial, lineMaterial;
let fontPalatinoItalic
let curPointerIndex = undefined
let rAFhideThumbnail

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let setIndex = Math.floor(Number(urlParams.get("set")))
// console.log(setIndex)

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
    {path: "ElectricityBox_20240628.obj",           id:"electricity_box",               name:"ElectricityBox",        size: 10,           shop: "A"},               // 0
    {path: "PressureCooker_Top_20240628.obj",       id:"rice_cooker",                   name:"PressureCooker_Top",        size: 0.9,          shop: "A"},               // 1
    {path: "WorkingDesk_20240628.obj",              id:"working_desk",                  name:"WorkingDesk",        size: 0.4,          shop: "B"},               // 2
    {path: "ShoeStand_20240628.obj",                id:"shoe_stretcher",                name:"ShoeStand",        size: 0.7,          shop: "C"},               // 3
    {path: "Iron_20240628.obj",                     id:"iron",                          name:"Iron",        size: 0.6,          shop: "D"},               // 4
    {path: "PearlTools_20240628.obj",               id:"pearl_tools",                   name:"PearlTools",        size: 0.3,     xRot: Math.PI/-4,      yRot: Math.PI/2,     zPos: -0.8, shop: "B"},               // 5
    {path: "Scissors_20240628.obj",                 id:"scissors",                      name:"Scissors",        size: 0.5,       xRot: Math.PI/-4,      zPos: -0.15,       shop: "D"},               // 6
    {path: "NeedlePad_20240628.obj",                id:"needle_pad",                    name:"NeedlePad",        size: 3,            shop: "E"},               // 7
    {path: "JwelleryBox_20240628.obj",              id:"jewelery_box",                  name:"JwelleryBox",        size: 0.15,         shop: "F"},               // 8
    {path: "Keys_Main_20240628.obj",                id:"key",                           name:"Keys_Main",        size: 0.4,          shop: "C"},               // 9
    {path: "Pin_20240628.obj",                      id:"pin",                           name:"Pin",               size: 0.07,    yRot: Math.PI/4,       zPos: -1,    shop: "D"},               // 10
    {path: "ShoesOBJ_20240723.obj",                 id:"boots",                         name:"Group19384",        size: 0.05,    xRot: Math.PI/-2,      zPos: -3.5,     shop: "C"},               // 11
    {path: "ShoeBagOBJ_20240724.obj",               id:"boots_with_bag",                name:"Group10136",        size: 3.5,     xRot: Math.PI/-2,     shop: "C"},               // 12
    {path: "WoodenBoxOpenOBJ_20240725.obj",         id:"wooden_tool_box_open",          name:"Group21129",        size: 0.08,    xRot: Math.PI/-2,     shop: "F"},               // 13
    {path: "WoodenBoxClosedOBJ_20240725.obj",       id:"wooden_tool_box",               name:"Group47146",        size: 0.08,    xRot: Math.PI/-2,     shop: "F"},               // 14
    {path: "ShoeRackOBJ_20240726.obj",              id:"shoe_rack",                     name:"Group57180",        size: 0.18,    xRot: Math.PI/-2,     shop: "F"},               // 15
    {path: "SewingMachineOBJ_20240727.obj",         id:"sewing_machine",                name:"Group7732",         size: 0.75,    xRot: Math.PI/-2,     shop: "E"},               // 16
    {path: "JarOfJadeOBJ_20240727.obj",             id:"jar_of_jade",                   name:"Group17388",        size: 0.15,    xRot: Math.PI/-2,     shop: "B"},               // 17
    {path: "HandDrawnShoes_OBJ_20240730.obj",       id:"handdraw_first_pair_of_shoes",  name:"Group34095",        size: 0.15,    xRot: Math.PI/-2,      zPos: -0.4,     shop: "F"},               // 18
    {path: "HandDrawnShoes2_OBJ_20240730.obj",      id:"handdraw_shoes",                name:"Group50196",        size: 0.2,     xRot: Math.PI/-2,     shop: "C"},               // 19
    {path: "HandDrawnKey_OBJ_20240730.obj",         id:"handdraw_key",                  name:"Group64819",        size: 0.18,    xRot: Math.PI/-4,     shop: "C"},               // 20
    {path: "HandDrawnNecklace_OBJ_20240730.obj",    id:"handdraw_goldfish_jewelry",     name:"Group14082",        size: 0.2,     xRot: Math.PI/-4,     zPos: -0.5,      shop: "B"},               // 21
    {path: "HandDrawnScissor_OBJ_20240730.obj",     id:"handDraw_scissors",             name:"Group8048",         size: 0.0055,   xRot: Math.PI*3/4,    zPos: -12,        shop: "D"},               // 22
]

const colorArray = [
    [new THREE.Color(0x7abbb8), new THREE.Color(0x84cfcd)],
    [new THREE.Color(0xd9b385), new THREE.Color(0xff9c24)],
    [new THREE.Color(0xd6d6d6), new THREE.Color(0xb8b8b8)],
    [new THREE.Color(0x575757), new THREE.Color(0x8c8c8c)],
    [new THREE.Color(0xacbdd3), new THREE.Color(0x95aac2)],
    [new THREE.Color(0xe0c381), new THREE.Color(0xf9c347)],
]

const posArray = [
    [{x:-0.2, z:0.3}, {x:0.3, z:-0.3}, {x:0.3, z:0.15}, {x:0, z:-0.1}, {x:-0.3, z:-0.2}],
    [{x:-0.3, z:0.3}, {x:0.3, z:-0.3}, {x:0.3, z:0.1}, {x:-0.1, z:-0.3}, {x:-0.3, z:-0.2}, {x:0, z:0.2}],
    [{x:0.2, z:0.3}, {x:0.2, z:-0.2}, {x:-0.1, z:0.1}, {x:-0.2, z:-0.1}],
    [{x:-0.25, z:0}, {x:0, z:-0.25}, {x:0.25, z:0.25}, {x:0, z:0}],
    [{x:0.1, z:0.2}, {x:-0.2, z:-0.1}],
    [{x:-0.2, z:0.2}, {x:0.2, z:0}],
]

const showSeqArray = [
    [8,13,14,15,18],       //             F
    [3,9,11,12,19,20],     //             C
    [2,5,17,21],           //             B
    [4,6,10,22],           //             D
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

let thumbnail, thumbnailLine
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
    // console.log(menuItems)
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
    resetInsideMenuButton()
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
function resetInsideMenuButton() {
    const selectedMenuItems = document.querySelectorAll(".fold-2-right .inside-menu-item.selected")
    selectedMenuItems.forEach( obj => {
        obj.classList.remove("selected")
    })
}

function fancyboxBinding() {
    // console.log("fbBinding")
    // console.log($.fancybox)

    $.fancybox.defaults.afterLoad = function() {

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
        // console.log($(".fancybox-content").height())
        // $(".fancybox-content").css( {
        //     height: $(".fancybox-content").height()+40+"px",
        //     overflow: "hidden"
        // })

        $(".fancybox-slide, .fancybox-content").on('scroll', function() {
            doscroll();
        })
        doscroll()
    }
    // console.log($.fancybox.defaults)
    $.fancybox.defaults.beforeClose = function() {
        resetMobileInsideMenuButton()
        console.log("resetclose")
    }

    
     // $.fancybox.defaults.iframe.css = {overflow: hidden}
     $.fancybox.defaults.afterClose = function() {
        window.location.hash="";
        // $(".fancybox-slide .content").height("auto")
        // $(".wrapper-fold-2 .content").height("auto")
    }
}

function resetMobileInsideMenuButton() {
    const selectedMenuItems = document.querySelectorAll(".mobile_inside-menu_wrapper .inside-menu-item.selected")
    selectedMenuItems.forEach( obj => {
        obj.classList.remove("selected")
    })
}

function mobileChangeDetailView( e ) {
    resetInsideMenuButton()
    const btn = document.querySelector(".fold-2-right .inside-menu-item[data-detail='"+ e.target.dataset.detail +"']")
    btn.classList.add("selected")

    resetMobileInsideMenuButton()
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
    updateThumbnail()
    
    // scrollObjDC();
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

    for (var i=0; i < objects.length; i++) {
        if (i<posArraySet.length) {
            objects[i].position.x = posArraySet[i].x
            objects[i].position.z = posArraySet[i].z
            gsap.fromTo( objects[i].position, {y: 2},{y:0, duration: 1 + i/objects.length * 1, ease: "power1.out"})
        }
    }

    // camera.position.x = -1;
    // camera.position.y = 2;
    // camera.position.z = 10;

    // gsap.fromTo( camera.position, 2, {x:-1, y:2, z:2}, {x:-1, y:2, z:1, onUpdate: ()=> { controls.update();}} )

    gsap.fromTo( camera.position, 4, {x:2,y:4,z:0}, {x:-1, y:4, z:4, onUpdate: ()=> { controls.update();}} )
    // gsap.fromTo( camera.position, 2, {x:0,y:10,z:0}, {x:-1, y:2, z:1, onUpdate: ()=> { controls.update();}} )
    // gsap.fromTo( camera.zoom, 10, {zoom: 1000}, {zoom: 750, onUpdate: ()=> { controls.update();}} )
}

function pickColor( i ) {
    const color1 = colorArraySet[0]
    const color2 = colorArraySet[colorArraySet.length-1]

    //console.log(color1, color2)

    const newColor = new THREE.Color(
        color1.r * (1-i) + color2.r * i,
        color1.g * (1-i) + color2.g * i,
        color1.b * (1-i) + color2.b * i,
    )

    // console.log(i, newColor)

    return  newColor
}

const mouse = { init: new THREE.Vector2(), current: new THREE.Vector2() }
const objDC = {
    force: 0,
    curX: 0,
    dampling: 0.9,
    maxForce: 20,
    multiplier: 50,
}
function initObjectsDrawer() {
    objDC.target = document.querySelector('.objects-drawer')
    objDC.slip = document.querySelector('.objects-drawer-slip')
    objDC.wrapper = document.querySelector(".objects-drawer-item-wrapper")
    objDC.content = document.querySelector(".objects-drawer-content")
    objDC.backdrop = document.querySelector(".objects-drawer-backdrop")

    if (objDC.slip !== null) objDC.slip.addEventListener("click", toggleObjectsDrawer, {passive: false})
    if (objDC.backdrop !== null) objDC.backdrop.addEventListener("click", toggleObjectsDrawer, {passive: false})

    objDC.resizeMarginBottom = () => {
        objDC.content.style.display = "block"
        objDC.contentMarginBottom = -1 * objDC.content.offsetHeight + "px"
        if (!objDC.target.classList.contains("active")) {
            objDC.target.style.marginBottom = objDC.contentMarginBottom
        }
    }

    objDC.resizeMarginBottom()
    
    if (objDC.wrapper !== null) {
    //    objDC.content.addEventListener("pointerdown", objDCPointerDown, {passive: false})
    }
}
function objDCPointerDown( e ) {
    // e.preventDefault()
    document.addEventListener("pointermove", objDCPointerMove, {passive: false})
    document.addEventListener("pointerup", objDCPointerUp)

    mouse.init = { 
        x: ( e.pageX / window.innerWidth - 0.5 ) * 2,
        xA: ( e.pageX - window.innerWidth / 2 )
    }
}
function objDCPointerMove( e ) {
    e.preventDefault()
    mouse.current.x = ( e.pageX / window.innerWidth - 0.5 ) * 2
    mouse.current.xA = e.pageX - window.innerWidth / 2
    // addObjDCForce( mouse.current.x - mouse.init.x )
    addObjDCForce( mouse.current.xA - mouse.init.xA, true )
    mouse.init.x = mouse.current.x;
    mouse.init.xA = mouse.current.xA;
    // console.log(mouse.current.xA)
}
function objDCPointerUp( e ) {
    document.removeEventListener("pointermove", objDCPointerMove)
    document.removeEventListener("pointerup", objDCPointerUp)
}
function addObjDCForce( force, multiplier ) {
    // console.log( force )
    if (multiplier) {
        objDC.force += force / 4
    } else [
        objDC.force += force * objDC.multiplier
    ]
}
function scrollObjDC() {
    if (objDC.wrapper == null) return
    objDC.curX += Math.max( -objDC.maxForce, Math.min( objDC.maxForce, objDC.force))
    objDC.curX = Math.min(0, objDC.curX)
    // console.log(window.innerWidth, objDC.wrapper.getBoundingClientRect().width, objDC.wrapper.scrollWidth)
    const maxX = (document.querySelector("html").clientWidth - objDC.wrapper.scrollWidth) - 20
    // console.log(maxX)
    objDC.curX = Math.max( objDC.curX, maxX )
    objDC.force *= objDC.dampling;
    objDC.wrapper.style.transform = "translateX(" + objDC.curX + "px)"
}

function toggleObjectsDrawer( e ) {
    e.preventDefault()
    e.stopPropagation()
    //// close drawer
    if (objDC.target.classList.contains("active")) {
        $("body").removeClass("noraycaster")
        objDC.target.classList.remove("active")
        objDC.target.style.marginBottom = objDC.contentMarginBottom
        pointer.isActive = true
    } else {
    //// open drawer
        $("body").addClass("noraycaster")
        objDC.target.classList.add("active")
        objDC.target.style.marginBottom = ""
        pointer.isActive = false
    }
}

function init() {

    targetDom = document.getElementById("threejs-canvas")

    // camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20 );

    camera = new THREE.OrthographicCamera(targetDom.getBoundingClientRect().width / - 2, targetDom.getBoundingClientRect().width/ 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 20);
    camera.zoom = 750;
    camera.position.x = -1;
    camera.position.y = 2;
    camera.position.z = 1;
    camera.updateProjectionMatrix()

    window.camera = camera

    // scene

    scene = new THREE.Scene();

    objGroup = new THREE.Group();
    scene.add(objGroup)
    objGroup.position.y = -0.125;

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

        const textureLoader = new THREE.TextureLoader();

        textMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0x000000),
            transparent: true,
            opacity: 1,
            depthWrite: false,
            depthTest: false,
        })

        for (var i=0; i<objects.length; i++) {

            const obj = objects[i]
            obj.traverse(function (child) {
                if (child.isMesh) {
                    // console.log(child.name)
                    // console.log(child.material.side)
                    // child.material = pMat.clone()
                    child.material = new THREE.MeshStandardMaterial()
                    // child.material.color = colorArraySet[i]
                    child.material.color = pickColor( i / showSeq.length )
                    child.material.side = THREE.DoubleSide
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
                    // console.log(child)
                }
            });
            obj.rotation.x = Math.PI / 2
            obj.scale.setScalar( objArray[showSeq[i]].size );
            
            // obj.updateMatrix()
            // obj.children[0].updateMatrix()
            // obj.children[0].geometry.computeBoundingBox()
            // console.log( obj.scale.y )
            // console.log( obj.children[0].geometry.boundingBox )
            // console.log( obj.children[0].geometry.boundingBox.min, obj.children[0].geometry.boundingBox.max)
            // console.log( obj.children[0].geometry.boundingBox.max.y - obj.children[0].geometry.boundingBox.min.y )
            // obj.userData.height = (obj.children[0].geometry.boundingBox.max.y - obj.children[0].geometry.boundingBox.min.y) * obj.scale.y
            // console.log( obj.userData.height )

            const aabb = new THREE.Box3();
            aabb.setFromObject( obj );
            obj.userData.height = aabb.max.y - aabb.min.y

            // obj.userData.map = thumbnailImg01;
            // you can find the thumbnail here 'c_images/objects/', but need to add the object name and shadow
            // obj.userData.map = new THREE.TextureLoader().load('c_images/objects/'+objArray[showSeq[i]].id+".png");
            textureLoader.load('../c_images/objects/'+objArray[showSeq[i]].id+".png",
                (texture) => {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    obj.userData.map = texture
                }
            );

            // const geometry = new TextGeometry( "(" + objArray[showSeq[i]].id + ")", {
            const geometry = new TextGeometry( "( " + substituteText( objArray[showSeq[i]].id ) + " )", {
                font: fontPalatinoItalic,
                size: 6,
                depth: 5,
                curveSegments: 12,
                // bevelEnabled: true,
                // bevelThickness: 10,
                // bevelSize: 8,
                // bevelOffset: 0,
                // bevelSegments: 5
            } );
            geometry.computeBoundingBox()
            geometry.translate( -geometry.boundingBox.max.x/2, 0, 0)
            
            const text = new THREE.Mesh( geometry, textMaterial)
            text.name = "text"
            text.scale.set(0.005,0.005,0.005)
            text.position.y = -0.175
            obj.userData.textObj = text

            objGroup.add(obj);
            // scene.add(obj);    
        }

        function substituteText( text ) {
            const words = text.split("_")
            
            for (let i=0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1)
            }

            return words.join(" ")
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

        initObjectsDrawer()

        render();
        animate();

    }

    const manager = new THREE.LoadingManager(loadModel);


    
    // texture
    if (isProjectedMaterialUsed) {

        const textureLoader = new THREE.TextureLoader(manager);
        // const texture = textureLoader.load( 'assets/uv_grid_opengl.jpg', 
        const texture = textureLoader.load('../assets/pink.png',
            () => {
                console.log("texture")
                render()
            });
        texture.colorSpace = THREE.SRGBColorSpace;

        const texture2 = textureLoader.load('../assets/pastel.png',
            () => {
                console.log("texture")
                render()
            });
        texture2.colorSpace = THREE.SRGBColorSpace;

        const texture3 = textureLoader.load('../assets/jade.jpg',
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
        thumbnailImg01 = textureLoader.load('../assets/thumbnail-01.png')
        thumbnailImg01.colorSpace = THREE.SRGBColorSpace;
        thumbnailImg02 = textureLoader.load('../assets/thumbnail-02.png')
        thumbnailImg02.colorSpace = THREE.SRGBColorSpace;
        thumbnailImg03 = textureLoader.load('../assets/thumbnail-03.png')
        thumbnailImg03.colorSpace = THREE.SRGBColorSpace;

        // pMat = new THREE.MeshBasicMaterial({color: new THREE.Color(0x7abbb8)})
        // pMat2 = new THREE.MeshBasicMaterial({color: new THREE.Color(0x5e9391)})
        // pMat3 = new THREE.MeshBasicMaterial({color: new THREE.Color(0x84cfcd)})

        pMat = new THREE.MeshStandardMaterial({color: colorArraySet[0]})
        pMat2 = new THREE.MeshStandardMaterial({color: colorArraySet[1]})
        pMat3 = new THREE.MeshStandardMaterial({color: colorArraySet[0]})
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

    // console.log(showSeq.length)
    objects = []
    const objectsNamesArr = []
    for (var i = 0; i < showSeq.length; i++) {
        objectsNamesArr[i] = objArray[showSeq[i]].name
        loader.load('../assets/obj/'+ objArray[showSeq[i]].path, function (obj) {   // assets/ElectricityBox_20240628.obj

            // console.log(obj)
            // object = obj;
            const objectsId = objectsNamesArr.indexOf( obj.children[0].name)
            // console.log( obj.children[0].name, objectsId)
            objects[objectsId] = obj

        }, onProgress, onError);
    }

    const fontLoader = new FontLoader(manager);

    fontLoader.load( '../c_css/fonts/Palatino_Italic.json', ( font ) => {
        fontPalatinoItalic = font
    } );


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

    document.addEventListener("pointermove", checkPointerType)
    document.addEventListener("pointermove", onPointerMove)
    // document.addEventListener("click", onPointerClick)
    renderer.domElement.addEventListener("pointerdown", trackPointerEvent)
    renderer.domElement.addEventListener("pointerup", trackPointerEvent)
    renderer.domElement.addEventListener("click", trackPointerEvent)
    // renderer.domElement.addEventListener("pointermove", trackPointerEvent)
    renderer.domElement.addEventListener("click", onPointerClick)

    onWindowResize()
}

let dPointer = {
    down: new THREE.Vector2(),
    move: new THREE.Vector2()
}
function trackPointerEvent(e) {
    // console.log(e.type)
    if (e.type == "pointerdown") {
        dPointer.isDragged = false
        dPointer.down.set(e.pageX, e.pageY)

        renderer.domElement.addEventListener("pointermove", trackPointerEvent)
    }
    if (e.type == "pointerup") {
        renderer.domElement.removeEventListener("pointermove", trackPointerEvent)
    }
    if (e.type == "pointermove" && !dPointer.isDragged) {
        dPointer.move.set(e.pageX, e.pageY)
        dPointer.distance = dPointer.move.distanceTo(dPointer.down)
        if (dPointer.distance > 10) {
            dPointer.isDragged = true;
        }
    }
}

let isPointerType
function checkPointerType( event ) {
    console.log( event.pointerType )
    if ( event.pointerType == "touch" || event.pointerType == "pen") {
        isPointerType = "touch"
    }
    if ( event.pointerType == "mouse") {
        isPointerType = "mouse"
    }
        
    document.removeEventListener("pointermove", checkPointerType)
    document.removeEventListener("pointerdown", checkPointerType)

    console.log(isPointerType)
    
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

    // console.log(pointer)
    if (isPointerType == "touch") {
        pointer.x = ( event.clientX / targetDom.getBoundingClientRect().width ) * 2 - 1;
	    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( pointer, camera );

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects( objects );

        if (intersects.length > 1) {
            const index = objects.indexOf(intersects[0].object.parent)
            if ( curPointerIndex == undefined || curPointerIndex !== index ) {
                showThumbnail(intersects[0].object.parent)
            } else {
                //console.log(intersects[0].object)
                if (curPointerIndex == index ) {
                    openObject( curPointerIndex, objArray[showSeq[curPointerIndex]].id )
                    hideThumbnail()
                }
            }
        } else {
            hideThumbnail()
        }
    } else {
        if (curPointerIndex != undefined && !dPointer.isDragged) {
            openObject( curPointerIndex, objArray[showSeq[curPointerIndex]].id )
            hideThumbnail()
        }
    } 
}

function raycast() {
    if (isPointerType == "touch") return

    if (pointer.isActive == false) {
        if ( curPointerIndex != undefined) {
            hideThumbnail()
        }
        return
    } 

    raycaster.setFromCamera( pointer, camera );

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects( objects );

    if (intersects.length > 0) {
        // console.log(intersects.length)
   
        const index = objects.indexOf(intersects[0].object.parent)
        if ( curPointerIndex !== index ) {
            showThumbnail(intersects[0].object.parent)
        }
	} else {
        if ( curPointerIndex != undefined ) {
            hideThumbnail()
        }
    }
}

function openObject( index, id ) {
    console.log(index, id)
    window.location.hash = id;
}

function RoundedRectangleGeometry( w, h, r, s ) { // width, height, radius corner, smoothness
		
	// helper const's
	const wi = w / 2 - r;		// inner width
	const hi = h / 2 - r;		// inner height
	const w2 = w / 2;			// half width
	const h2 = h / 2;			// half height
	const ul = r / w;			// u left
	const ur = ( w - r ) / w;	// u right
	const vl = r / h;			// v low
	const vh = ( h - r ) / h;	// v high	
	
	let positions = [wi, hi, 0, -wi, hi, 0, -wi, -hi, 0, wi, -hi, 0];
	
	let uvs = [ur, vh, ul, vh, ul, vl, ur, vl];
	
	let n = [
		3 * ( s + 1 ) + 3,  3 * ( s + 1 ) + 4,  s + 4,  s + 5,
		2 * ( s + 1 ) + 4,  2,  1,  2 * ( s + 1 ) + 3,
		3,  4 * ( s + 1 ) + 3,  4, 0
	];
	
	let indices = [
		n[0], n[1], n[2],  n[0], n[2],  n[3],
		n[4], n[5], n[6],  n[4], n[6],  n[7],
		n[8], n[9], n[10], n[8], n[10], n[11]
	];
	
	let phi, cos, sin, xc, yc, uc, vc, idx;
	
	for ( let i = 0; i < 4; i ++ ) {
		xc = i < 1 || i > 2 ? wi : -wi;
		yc = i < 2 ? hi : -hi;
		
		uc = i < 1 || i > 2 ? ur : ul;
		vc = i < 2 ? vh : vl;
			
		for ( let j = 0; j <= s; j ++ ) {
			phi = Math.PI / 2  *  ( i + j / s );
			cos = Math.cos( phi );
			sin = Math.sin( phi );

			positions.push( xc + r * cos, yc + r * sin, 0 );

			uvs.push( uc + ul * cos, vc + vl * sin );
					
			if ( j < s ) {
				idx =  ( s + 1 ) * i + j + 4;
				indices.push( i, idx, idx + 1 );
			}
		}
	}
		
	const geometry = new THREE.BufferGeometry( );
	geometry.setIndex( new THREE.BufferAttribute( new Uint32Array( indices ), 1 ) );
	geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );
	geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );
	
	return geometry;	
}

function initThumbnail() {
    console.log("initThumbnail")
    // const spriteMaterial = new THREE.SpriteMaterial({
    //     map: thumbnailImg01,
    //     depthTest: false,
    //     opacity: 0,
    // });
    // // spriteMaterial.sizeAttenuation = false;

    // thumbnail = new THREE.Sprite( spriteMaterial )
    // thumbnail.center.set(0.5,-0.5)
    // thumbnail.scale.setScalar(0.25)

    themeColor = pickColor(0.5)

    thumbnail = new THREE.Mesh( 
        new RoundedRectangleGeometry(0.25,0.25,0.025,18), 
        new THREE.MeshBasicMaterial({
            // color: new THREE.Color(0xCCCCCC),
            color: themeColor,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            opacity: 0,
        })
    )

    lineMaterial = new THREE.MeshBasicMaterial({ color: colorWhite, transparent: true, opacity: 0 })
    thumbnailLine = new THREE.Mesh( 
        new THREE.CylinderGeometry(0.001,0.001,0.3,32),
        lineMaterial
    )
    thumbnailLine.geometry.computeBoundingBox()
    thumbnailLine.geometry.translate(0,thumbnailLine.geometry.boundingBox.max.y,0)
    thumbnailLine.name = "thumbnail-line"
    thumbnailLine.position.y = 2

    //thumbnail.add(line)

    thumbnail.scale.setScalar(0.5)
    
    objGroup.add(thumbnailLine)
    objGroup.add(thumbnail)
}
function updateThumbnail() {
    thumbnail.quaternion.copy(camera.quaternion)
}
function showThumbnail( target ) {
    // console.log("showThumbnail")

    cancelAnimationFrame(rAFhideThumbnail)

    targetDom.style.cursor = "pointer"

    const index = objects.indexOf(target)
    curPointerIndex = index
    // console.log( index )
    // console.log("showThumbnail")

    if (thumbnail) {
        gsap.to(thumbnail.material, 0, {opacity: 1, overwrite: true})
        thumbnail.material.opacity = 1
        thumbnail.position.copy(target.position)
        thumbnailLine.position.copy(target.position)
        if (target.userData.map !== undefined) {
            thumbnail.material.map = target.userData.map
            thumbnail.material.color = colorWhite
        } else {
            thumbnail.material.map = null
            thumbnail.material.color = themeColor
        }
        thumbnail.remove(thumbnail.getObjectByName("text"))
        thumbnail.add(target.userData.textObj)
    }

    gsap.to(textMaterial, 0, {opacity: 1, overwrite: true})
    gsap.to(lineMaterial, 0, {opacity: 1, overwrite: true})
    // textMaterial.opacity = 1
    // lineMaterial.opacity = 1

    // console.log(target.userData.height)
    // const scale = 1
    // const scale = 1 - (target.userData.height / 0.3)
    // const scale = (target.userData.height ) / 0.3
    const scale = (0.1 + 0.05) /0.3
    
    // thumbnail.position.y = 0.5
    thumbnail.position.y = target.userData.height + 0.1 + 0.1
    thumbnailLine.position.y = target.userData.height - 0.05
    // thumbnailLine.position.y = target.userData.height + 0.1
    gsap.from( thumbnail.position, 0.5, {y: thumbnail.position.y - 0.05})
    gsap.fromTo( thumbnailLine.scale, 0.5, {y: scale * 0.8},{y: scale } )
    // thumbnail.position.y = pointer.y
}
function hideThumbnail() {
    // console.log("hideThumbnail", curPointerIndex)

    if (thumbnail !== undefined) {
        const dur = thumbnail.material.opacity
        gsap.to(thumbnail.material, dur, {opacity: 0, delay: 0.25, onStart: ()=> { 
            curPointerIndex = undefined
            targetDom.style.cursor = ""
         } })
        gsap.to(textMaterial, dur, {opacity: 0, delay: 0.25})
        gsap.to(lineMaterial, dur, {opacity: 0, delay: 0.25})
    }
    // if (thumbnail !== undefined && thumbnail.material.opacity > 0) {
    //     thumbnail.material.opacity -= 0.05
    //     textMaterial.opacity -= 0.05
    //     lineMaterial.opacity -= 0.05

    //     // console.log(thumbnail.material.opacity)
    //     if (thumbnail.material.opacity > 0) {
    //         rAFhideThumbnail = requestAnimationFrame(hideThumbnail)
    //     } else {
    //         thumbnail.material.opacity = 0
    //         textMaterial.opacity = 0
    //     }
    // }
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

    if (objDC !== undefined && objDC.resizeMarginBottom !== undefined) {
        // console.log(objDC.resizeMarginBottom)
        objDC.resizeMarginBottom()
    }

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

