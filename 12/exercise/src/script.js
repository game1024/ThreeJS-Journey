import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();
const debugObject = {
  size: 0.5,
  tube: 0.1,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const fontLoader = new FontLoader();

const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

fontLoader.load("/textures/fonts/Fira Code_Regular.json", (font) => {
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const textGeometryAttribute = {
    font: font,
    size: debugObject.size,
    height: 0.1,
    curveSegments: 3,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  };

  const textGeometry = new TextGeometry(
    "Hello Game1024!",
    textGeometryAttribute
  );
  textGeometry.center();

  const mesh = new THREE.Mesh(textGeometry, material);

  scene.add(mesh);

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.1, 20, 45);
  const donutMeshs = [];
  for (let i = 0; i < 300; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
    donutMeshs.push(donut);
  }

  // Debug UI
  gui
    .add(debugObject, "size")
    .min(0.5)
    .max(3)
    .step(0.1)
    .onFinishChange((value) => {
      textGeometry.dispose();
      textGeometryAttribute.size = value;
      mesh.geometry = new TextGeometry(
        "Hello Game1024！",
        textGeometryAttribute
      );
      mesh.geometry.center();
    });

  gui
    .add(debugObject, "tube")
    .min(0.05)
    .max(0.3)
    .step(0.001)
    .onFinishChange((value) => {
      donutGeometry.dispose();
      const geometry = new THREE.TorusGeometry(
        0.3,
        debugObject.tube,
        20,
        45
      );
      for (let index in donutMeshs) {
        donutMeshs[index].geometry = geometry
      }
    });
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
