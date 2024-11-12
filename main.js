import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Load textures for Earth and Moon
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("/earth.png"); 
const moonTexture = textureLoader.load("/moon1.png"); 

// Earth geometry and material with texture
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({
  map: earthTexture,
  wireframe: false,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Moon geometry and material with texture
const moonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({
  map: moonTexture,
  wireframe: false,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = -2;
scene.add(moon);

camera.position.z = 5;

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.autoRotate = true;
controls.zoomSpeed = 0.5;
controls.enablePan = false;
controls.screenSpacePanning = false;
controls.enableKeys = false;

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
  // moon.rotation.x += 0.01;
  // moon.rotation.y += 0.01;

  // earth.rotation.x += 0.01;
  // earth.rotation.y += 0.01;

  controls.update();
}
animate();
