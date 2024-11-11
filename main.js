import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// sphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// boxGeometry
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  opacity: 1,
  alphaHash: 0.5,
  wireframe: false,
}); // opacity, wireframe true means wireframe will be visible, false means wireframe will not be visible, and its optional argument.
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -2;
scene.add(cube);

camera.position.z = 5;

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Orbit Controls update function for the camera and renderer
const controls = new OrbitControls(camera, renderer.domElement);
// for smooth object movement we need to enable damping
controls.enableDamping = true; // enable damping for how long object take to stop after user stops moving the object (default is false)
controls.dampingFactor = 0.25; // damping factor (0.25 = 25%) for smooth camera movement
controls.autoRotate = true; // automatically rotate the object
// controls.autoRotateSpeed = 0.5; // auto rotation speed
// controls.enableZoom = true; // enable zoom in and out
controls.zoomSpeed = 0.5; // zoom speed
// controls.zoomToCursor = true; // zoom to cursor position (default is false)
controls.enablePan = false; // enable pan in and out (default is true) for object movement
controls.panSpeed = 0.5; // pan speed
controls.screenSpacePanning = false; // pan in screen space (default is false)
controls.enableKeys = false; // enable keys for object movement (default is true)
// controls.enableRotate = false; // user can not control object if its false (default is true)

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  controls.update();
}
animate();
// renderer.setAnimationLoop(animate);
