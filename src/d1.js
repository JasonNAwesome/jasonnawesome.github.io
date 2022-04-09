import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { gsap } from 'gsap'

/**/
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
/**/

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//const background_color = 0x5567ee
const background_color = 0x000000
scene.background = new THREE.Color(background_color)

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

const homeSection = document.getElementById('home')
const socialSection = document.getElementById('social')
const computerSection = document.getElementById('computer')
const artSection = document.getElementById('art') 

const titleElement = document.querySelector('.title-gif')
const titleLinkElement = document.getElementById('title-link')
console.log(titleLinkElement)

const cameraHome = new THREE.Vector3(-10, 12, 10) // CAMERA HOME
const targetHome = new THREE.Vector3(5, 6, -5) // TARGET HOME
let cameraCoord = cameraHome.clone()
let cameraTarget = targetHome.clone()

const emailImage = require("../static/gifs/email.gif");
const codeImage = require("../static/gifs/code.gif");
const hmm = require("../static/gifs/construction.gif");

function clickActions(meshPos, changers, secNum) {
    // Update camera positions
    let mesh_vec = new THREE.Vector3()
    const chg_vec = new THREE.Vector3().fromArray(changers)
    if(meshPos === cameraHome) {
        cameraCoord.set(cameraHome.x,cameraHome.y,cameraHome.z)
        camera.position.set(cameraCoord.x, cameraCoord.y, cameraCoord.z)
        controls.target.set(targetHome.x, targetHome.y, targetHome.z)

        camera.fov = 45
        camera.zoom = 1
        camera.updateProjectionMatrix()
        controls.autoRotateSpeed = 2
        controls.maxAzimuthAngle = Infinity
        controls.minAzimuthAngle = Infinity

        titleElement.style.backgroundImage = 'url(static/images/hello.gif)'
        console.log()
    }
    else {
        meshPos.getCenter(mesh_vec)
        let mesh_orbit = mesh_vec.clone()
        mesh_orbit.add(chg_vec)

        camera.fov = 100
        cameraCoord.set(mesh_orbit.x,mesh_orbit.y,mesh_orbit.z)
        camera.position.set(cameraCoord.x, cameraCoord.y, cameraCoord.z)

        controls.autoRotateSpeed = 0.1
        cameraTarget.set(mesh_vec.x,mesh_vec.y,mesh_vec.z)
        controls.target.set(cameraTarget.x, cameraTarget.y, cameraTarget.z)
        camera.zoom = 2

        camera.lookAt(cameraTarget)
        camera.updateProjectionMatrix()

        if(secNum === 1) {
            titleElement.style.backgroundImage = 'url(static/images/email.gif)'
            titleElement.style.
            titleLinkElement.href = 'https://twitter.com/jsn404'
        }
        if(secNum === 2) {
            titleElement.style.backgroundImage = 'url(static/images/code.gif)'
            titleLinkElement.href = 'https://github.com/jeibloo'
        }
        if(secNum === 3) {
            titleElement.style.backgroundImage = 'url(static/images/construction.gif)'
            titleLinkElement.href = 'https://twitter.com/jsn404'
        }
    }
}

homeSection.addEventListener('click', function() {clickActions(cameraHome, [0,0,0])});
socialSection.addEventListener('click', function() {clickActions(phoneMeshPos, [-0.95, 0.35, 0.5], 1)});
computerSection.addEventListener('click', function() {clickActions(compMeshPos, [0.25, 0, 1], 2)});
artSection.addEventListener('click', function() {clickActions(bboardMeshPos, [0, -0.55, 1.5], 3)});

/**
 * Loaders
 */
// Manager
const loadingScreenElement = document.querySelector('.loading-screen')
const navigationScreenElement = document.querySelector('.navigation-screen')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 4, value: 0 })
        loadingScreenElement.classList.add("end")
        navigationScreenElement.classList.add("loaded")
        titleElement.classList.add("loaded")
        scene.updateMatrixWorld(true)
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {}
)
// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)

// Draco loader
const dracoLoader = new DRACOLoader(loadingManager)
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
let bakedTextures;
const bakedBuildingTexture = textureLoader.load('textures/building.jpg')
const bakedPropsTexture = textureLoader.load('textures/props.jpg')
const bakedPhoneTexture = textureLoader.load('textures/phone.jpg')
const bakedBBoardTexture = textureLoader.load('textures/bb.jpg')
const bakedCompTexture = textureLoader.load('textures/compscreen.jpg')
bakedTextures = [bakedBuildingTexture, bakedPropsTexture, bakedPhoneTexture, bakedBBoardTexture, bakedCompTexture]

bakedTextures.forEach(element => {
    element.flipY = false
    element.encoding = THREE.sRGBEncoding
});

/**
 * Materials
 */
const bakedBuildingMaterial = new THREE.MeshBasicMaterial({map: bakedBuildingTexture})
const bakedPropsMaterial = new THREE.MeshBasicMaterial({map: bakedPropsTexture})
const bakedPhoneMaterial = new THREE.MeshBasicMaterial({map: bakedPhoneTexture})
const bakedBBoardMaterial = new THREE.MeshBasicMaterial({map: bakedBBoardTexture})
const bakedCompMaterial = new THREE.MeshBasicMaterial({map: bakedCompTexture})

/**
 * Model
 */
// BUILDING
gltfLoader.load(
    './building.glb',
    (gltf) => {
        scene.add(gltf.scene)

        const bakedBuildingMesh = gltf.scene.children.find((child) => child.name === 'building_base_TXTR')
        bakedBuildingMesh.material = bakedBuildingMaterial
    }
)
// PROPS
gltfLoader.load(
    './props.glb',
    (gltf) => {
        scene.add(gltf.scene)

        const bakedPropsMesh = gltf.scene.children.find((child) => child.name === 'props_misc_TXTR')

        bakedPropsMesh.material = bakedPropsMaterial
    }
)
// PHONE
let phoneMeshPos = new THREE.Box3()
gltfLoader.load(
    './phone.glb',
    (gltf) => {
        scene.add(gltf.scene)

        const bakedPhoneMesh = gltf.scene.children.find((child) => child.name === 'phone_receiver_TXTR')
        phoneMeshPos.setFromObject(bakedPhoneMesh)

        bakedPhoneMesh.material = bakedPhoneMaterial
    }
)
// BULLETINBOARD
let bboardMeshPos = new THREE.Box3()
gltfLoader.load(
    './bb.glb',
    (gltf) => {
        scene.add(gltf.scene)

        const bakedBBoardMesh = gltf.scene.children.find((child) => child.name === 'bulletin_board_cork_TXTR')
        bboardMeshPos.setFromObject(bakedBBoardMesh) 

        bakedBBoardMesh.material = bakedBBoardMaterial
    }
)
// COMPUTER SCREEN
let compMeshPos = new THREE.Box3()
gltfLoader.load(
    './compscreen.glb',
    (gltf) => {
        scene.add(gltf.scene)

        const bakedCompMesh = gltf.scene.children.find((child) => child.name === 'computer_monitor_screen_TXTR')
        compMeshPos.setFromObject(bakedCompMesh)

        bakedCompMesh.material = bakedCompMaterial
    }
)

// STARS TEST thanks Marco!
const r = 1.5, starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];

const vertices1 = [];
const vertices2 = [];

const vertex = new THREE.Vector3();

for ( let i = 0; i < 250; i ++ ) {
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    vertex.multiplyScalar( r );

    vertices1.push( vertex.x, vertex.y, vertex.z );
}

for ( let i = 0; i < 1500; i ++ ) {
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    vertex.multiplyScalar( r );
    vertices2.push( vertex.x, vertex.y, vertex.z );
}

starsGeometry[ 0 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
starsGeometry[ 1 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );

const starsMaterials = [
    new THREE.PointsMaterial( { color: 0x88FFAA, size: 2*2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0x55AAFF, size: 1, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2*2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
];

for ( let i = 10; i < 30; i ++ ) {
    const stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

    stars.rotation.x = Math.random() * 6;
    stars.rotation.y = Math.random() * 6;
    stars.rotation.z = Math.random() * 6;
    stars.scale.setScalar( i * 10 );

    stars.matrixAutoUpdate = false;
    stars.updateMatrix();

    scene.add( stars );
}

/*
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(cameraCoord.x, cameraCoord.y, cameraCoord.z)
camera.rotateY(90)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(cameraTarget.x, cameraTarget.y, cameraTarget.z)
controls.autoRotate = true
controls.update()

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: false
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Post processing
 */
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

let pixelPass = new ShaderPass( PixelShader );
pixelPass.uniforms[ 'resolution' ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
pixelPass.uniforms[ 'resolution' ].value.multiplyScalar( window.devicePixelRatio );
pixelPass.uniforms[ 'pixelSize' ].value = 3;
effectComposer.addPass(pixelPass);

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammaCorrectionPass)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
