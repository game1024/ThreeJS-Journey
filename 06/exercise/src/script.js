import * as THREE from 'three'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')


// Sizes
const sizes = {
    width: 800,
    height: 600
}

const cursor = {
    x:0,
    y:0,
}

window.addEventListener('mousemove', (event)=>{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Camera
    camera.position.x = Math.cos(cursor.x * 2 * Math.PI) * 5
    camera.position.z = Math.sin(cursor.x * 2 * Math.PI) * 5
    camera.position.y = cursor.y * 10
    camera.lookAt(mesh.position)

    // Update objects
    //mesh.rotation.y = elapsedTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()