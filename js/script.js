import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

let isPointerType

let setIndex = document.querySelector(".wrapper-fold-2").dataset.shop
if (setIndex == undefined || setIndex > 6 || setIndex < 1) setIndex = 1

const colorArrayIndex = setIndex-1
const showSeqIndex = setIndex-1
const posArrayIndex = setIndex-1

const objArray = [
    {path: "ElectricBoxOBJ_V2_20240806.obj",           id:"electricity_box",               name:"ElectricBoxOBJ_V2_20240806",        size: 0.1, xRot: Math.PI/-2,          shop: "A"},               // 0
    {path: "PressureCooker_Top_20240628.obj",       id:"rice_cooker",                   name:"PressureCooker_Top",        size: 0.9,          shop: "A"},               // 1
    {path: "WorkingDeskOBJ_V2_20240805.obj",        id:"working_desk",                  name:"WorkingDeskOBJ_V2_20240805",        size: 0.4,    xRot: Math.PI/-2,          shop: "B"},               // 2
    {path: "ShoeStand_20240628.obj",                id:"shoe_stretcher",                name:"ShoeStand",        size: 0.7,          shop: "C"},               // 3
    {path: "IronOBJ_V2_20240805.obj",                     id:"iron",                          name:"IronOBJ_V2_20240805",        size: 0.18,  xRot: Math.PI/-2,        shop: "D"},               // 4
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
    {path: "SewingMachineOBJ_V2_20240805.obj",         id:"sewing_machine",                name:"SewingMachineOBJ_V2_20240805.003",         size: 1,    xRot: Math.PI/-2,     shop: "E"},               // 16
    {path: "JarOfJadeOBJ_20240727.obj",             id:"jar_of_jade",                   name:"Group17388",        size: 0.15,    xRot: Math.PI/-2,     shop: "B"},               // 17
    {path: "HandDrawnShoe1_OBJ_V2_20240905.obj",       id:"handdraw_first_pair_of_shoes",  name:"HandDrawnShoe1_OBJ_20240905",        size: 0.15,    xRot: Math.PI/-2,      zPos: -0.8,     shop: "F"},               // 18
    {path: "HandDrawnShoe2_OBJ_V2_20240905.obj",      id:"handdraw_shoes",                name:"HandDrawnShoe2_OBJ_V2_20240905",        size: 0.18,     xRot: Math.PI/-2,     shop: "C"},               // 19
    {path: "HandDrawnKeyOBJ_V2_20240905.obj",         id:"handdraw_key",                  name:"HandDrawnKeyOBJ_20240905",        size: 0.15,    yRot: Math.PI/-4,  zPos: -1,   shop: "C"},               // 20
    {path: "HandDrawnGoldFishNecklace_OBJ_20240830.obj",    id:"handdraw_goldfish_jewelry",     name:"HandDrawnGoldFishNecklace_OBJ_20240830",        size: 0.25,    xRot: Math.PI/-2, xPos:3.3, zPos: 1,      shop: "B"},               // 21
    {path: "HandDrawnScissorOBJ_20240828.obj",     id:"handDraw_scissors",             name:"HandDrawnScissor_OBJ",         size: 0.08,   xRot: Math.PI*3/4,    zPos: -1.5,  xPos:5,      shop: "D"},               // 22
    {path: "HandDrawn_SewingMachineOBJ_20240806.obj",     id:"handdraw_sewing_machine",             name:"HandDrawn_SewingMachineOBJ_20240806",         size: 0.08,   xRot: Math.PI/-2,     shop: "E"},               // 23
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
    [{x:-0.2, z:0.3}, {x:0.3, z:-0.3}, {x:0.3, z:0.15}, {x:0, z:-0.1}, {x:-0.3, z:-0.3}],
    [{x:-0.3, z:0.3}, {x:0.3, z:-0.3}, {x:0.3, z:0.1}, {x:-0.1, z:-0.3}, {x:-0.3, z:0}, {x:0, z:0.2}],
    [{x:0.2, z:0.3}, {x:0.2, z:-0.2}, {x:-0.1, z:0.1}, {x:-0.2, z:-0.2}],
    [{x:-0.25, z:0}, {x:0, z:-0.25}, {x:0.25, z:0.25}, {x:0, z:0.1}],
    [{x:0.2, z:0.3}, {x:0, z:-0.3}, {x:-0.1, z:0.2}],
    [{x:-0.2, z:0.2}, {x:0.2, z:0}],
]

const showSeqArray = [
    [8,13,14,15,18],       //             F
    [3,9,11,12,19,20],     //             C
    [2,5,17,21],           //             B
    [4,6,10,22],           //             D
    [7,16,23],                //             E
    [0,1],                 //             A
]

const colorArraySet = colorArray[colorArrayIndex]
const posArraySet = posArray[posArrayIndex]
const showSeq = showSeqArray[showSeqIndex]

let thumbnail, thumbnailLine

let hemisphereLight

let controls;

const isShadeEnabled = true

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
    
    window.scrollTo({
        top: 0, 
        // behavior:"smooth"
    })

    pauseVideo()

    doscroll()
}
function pauseVideo() {
    const iframeVideo = document.querySelector(".for-video iframe");
    if (iframeVideo !== null) {
        iframeVideo.contentWindow.postMessage(
            '{"event":"command", "func": "pauseVideo", "args":""}',
            "*"
        );
    }
}
function resetInsideMenuButton() {
    const selectedMenuItems = document.querySelectorAll(".fold-2-right .inside-menu-item.selected")
    selectedMenuItems.forEach( obj => {
        obj.classList.remove("selected")
    })
}

function fancyboxBinding() {
    $.fancybox.defaults.preventCaptionOverlap = true;
    $.fancybox.defaults.afterLoad = function() {
        
        pointer.isActive = false

        const scrollins = document.querySelectorAll(".fancybox-content .scrollin")
        
        scrollins.forEach( obj => {
            obj.classList.remove("onscreen")
            obj.classList.remove("startani")
            obj.classList.add("leavescreen")
        })

        $(".fancybox-slide, .fancybox-content").on('scroll mousewheel', function() {
            doscroll();
        })
        doscroll()
    }
    
    $.fancybox.defaults.beforeClose = function() {
        pointer.isActive = true
        resetMobileInsideMenuButton()
    }

     $.fancybox.defaults.afterClose = function() {
        window.location.hash="";
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
        //if(!$("body").hasClass("hovershopitem")){
            objects[i].rotation.z += 0.01 * 1;
        //}
    }

}

function changePlacement() {

    for (var i=0; i < objects.length; i++) {
        if (i<posArraySet.length) {
            objects[i].position.x = posArraySet[i].x
            objects[i].position.z = posArraySet[i].z
            gsap.fromTo( objects[i].position, {y: 2},{y:0, duration: 1 + i/objects.length * 1, ease: "power1.out"})
        }
    }
    controls.update();
    //gsap.fromTo( camera.position, 4, {x:2,y:4,z:0}, {x:-1, y:4, z:4, onUpdate: ()=> { controls.update();}} )
}

function pickColor( i ) {
    const color1 = colorArraySet[0]
    const color2 = colorArraySet[colorArraySet.length-1]

    const newColor = new THREE.Color(
        color1.r * (1-i) + color2.r * i,
        color1.g * (1-i) + color2.g * i,
        color1.b * (1-i) + color2.b * i,
    )

    return  newColor
}

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
}


function toggleObjectsDrawer( e ) {
    e.preventDefault()
    e.stopPropagation()
    //// close drawer
    if (objDC.target.classList.contains("active")) {
        $("body").removeClass("noraycaster")
        $("body").removeClass("compensate-for-scrollbar")

        objDC.target.classList.remove("active")
        objDC.target.style.marginBottom = objDC.contentMarginBottom
        pointer.isActive = true
    } else {
    //// open drawer
        $("body").addClass("noraycaster")
        $("body").addClass("compensate-for-scrollbar")
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
    camera.position.y = 4;
    camera.position.z = 4;
    camera.updateProjectionMatrix()

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

        // console.log("loadModel")
        // console.log(objects.length)

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
                    child.material = new THREE.MeshStandardMaterial()
                    child.material.color = pickColor( i / showSeq.length )
                    child.material.side = THREE.DoubleSide

                    if (objArray[showSeq[i]].xRot !== undefined) child.rotation.x = objArray[showSeq[i]].xRot
                    if (objArray[showSeq[i]].yRot !== undefined) child.rotation.y = objArray[showSeq[i]].yRot
                    if (objArray[showSeq[i]].zPos !== undefined) child.position.z = objArray[showSeq[i]].zPos
                    if (objArray[showSeq[i]].xPos !== undefined) child.position.x = objArray[showSeq[i]].xPos
                    if (objArray[showSeq[i]].yPos !== undefined) child.position.y = objArray[showSeq[i]].yPos

                }
            });
            obj.rotation.x = Math.PI / 2
            obj.scale.setScalar( objArray[showSeq[i]].size );
            
            const aabb = new THREE.Box3();
            aabb.setFromObject( obj );
            obj.userData.height = aabb.max.y - aabb.min.y

            textureLoader.load('../c_images/objects/'+objArray[showSeq[i]].id+".jpg",
                (texture) => {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    obj.userData.map = texture
                }
            );

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
        }

        function substituteText( text ) {
            const words = text.split("_")
            
            for (let i=0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1)
            }

            return words.join(" ")
        }

        initThumbnail()
        changePlacement()
        initObjectsDrawer()

        render();
        animate();

    }

    const manager = new THREE.LoadingManager(loadModel);

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

    document.addEventListener("pointermove", checkPointerType)
    document.addEventListener("pointerdown", checkPointerType)
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

function checkPointerType( event ) {
    // console.log( event.pointerType )
    if ( event.pointerType == "touch" || event.pointerType == "pen") {
        isPointerType = "touch"
    }
    if ( event.pointerType == "mouse") {
        isPointerType = "mouse"
    }
        
    document.removeEventListener("pointermove", checkPointerType)
    document.removeEventListener("pointerdown", checkPointerType)

    // console.log(isPointerType)
    
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
                $("body").addClass("hovershopitem")
                controls.autoRotate = false
                showThumbnail(intersects[0].object.parent)
            } else {
                //console.log(intersects[0].object)
                if (curPointerIndex == index ) {
                    openObject( curPointerIndex )
                    $("body").removeClass("hovershopitem")
                    controls.autoRotate = true
                    hideThumbnail()
                }
            }
        } else {
            hideThumbnail()
        }
    } else {
        if (curPointerIndex != undefined && !dPointer.isDragged) {
            openObject( curPointerIndex )
            $("body").removeClass("hovershopitem")
            controls.autoRotate = true
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
            $("body").addClass("hovershopitem")
            controls.autoRotate = false
            showThumbnail(intersects[0].object.parent)
        }
	} else {
        if ( curPointerIndex != undefined ) {
            $("body").removeClass("hovershopitem")
            controls.autoRotate = true
            hideThumbnail()
        }
    }
}

function openObject( index ) {
    window.location.hash = objArray[showSeq[index]].id;
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
    // console.log("initThumbnail")

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

    targetDom.style.cursor = "pointer"

    const index = objects.indexOf(target)
    curPointerIndex = index

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
    
    const scale = (0.1 + 0.05) /0.3
    
    thumbnail.position.y = target.userData.height + 0.1 + 0.1
    thumbnailLine.position.y = target.userData.height - 0.05
    
    gsap.from( thumbnail.position, 0.5, {y: thumbnail.position.y - 0.05})
    gsap.fromTo( thumbnailLine.scale, 0.5, {y: scale * 0.8},{y: scale } )
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
}

function onWindowResize() {
    let ratio = 1
    if (window.innerWidth < 480) {
        ratio = 1
    }

    if (window.innerWidth < 1024) {
        pauseVideo()
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
}