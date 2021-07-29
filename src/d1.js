import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xffffff)

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedBuildingTexture = textureLoader.load('textures/building_FACADE.jpg')
const bakedPropsTexture = textureLoader.load('textures/props_MISC.jpg')

bakedBuildingTexture.flipY = false
bakedBuildingTexture.encoding = THREE.sRGBEncoding

bakedPropsTexture.flipY = false
bakedPropsTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
const bakedBuildingMaterial = new THREE.MeshBasicMaterial({map: bakedBuildingTexture})
const bakedPropsMaterial = new THREE.MeshBasicMaterial({map: bakedPropsTexture})

/**
 * Model
 */
gltfLoader.load(
    './scene.glb',
    (gltf) => {
        scene.add(gltf.scene)
        console.log(gltf.scene)

        const bakedBuildingMesh = gltf.scene.children.find((child) => child.name === 'building_FACADE')
        const bakedPropsMesh = gltf.scene.children.find((child) => child.name === 'props')

        bakedBuildingMesh.material = bakedBuildingMaterial
        bakedPropsMesh.material = bakedPropsMaterial
    }
)

/**
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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

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

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()