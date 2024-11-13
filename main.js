import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import countries from "./countries.geo.json";
// import countries from "./custom.geo.json";

import TWEEN from "@tweenjs/tween.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Load textures for Earth, Moon, Clouds, and Marker icon
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("/earth.png");
const moonTexture = textureLoader.load("/moon1.png");
const cloudTexture = textureLoader.load("/clouds4.jpg");
const markerIcon = textureLoader.load("/marker-icon.png");
// Load the background texture
const cosmosTexture = textureLoader.load("/milkyway.jpg");

// Create a large sphere around the scene for the background
const backgroundGeometry = new THREE.SphereGeometry(500, 64, 64);
const backgroundMaterial = new THREE.MeshBasicMaterial({
  map: cosmosTexture,
  side: THREE.BackSide, // Render inside of the sphere
  color: new THREE.Color(0x132636), // Adjust color to darken the texture
});
const backgroundSphere = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
scene.add(backgroundSphere);

// Earth geometry and material with texture
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({
  map: earthTexture,
  wireframe: false,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Cloud layer geometry and material
const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
const cloudMaterial = new THREE.MeshBasicMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.3,
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

// Moon geometry and material with texture
const moonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({
  map: moonTexture,
  wireframe: false,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = -2;
scene.add(moon);

camera.position.z = 3;

// start
// Function to convert latitude, longitude to 3D coordinates (XYZ)
// Convert latitude and longitude to XYZ coordinates
function latLonToXYZ(lat, lon, radius) {
  // Convert latitude to polar angle (phi), where 90° is the top (North Pole)
  const phi = (90 - lat) * (Math.PI / 180); // Latitude to phi (0 to pi)

  // Convert longitude to azimuthal angle (theta) and adjust for Three.js coordinate system
  // Three.js uses the standard mathematical coordinate system where:
  // - Longitude goes from -π to +π (equivalent to -180° to +180°)
  // - Positive longitude is to the right of the Prime Meridian (East), negative to the left (West)
  const theta = lon * (Math.PI / -180); // Longitude to theta (-π to π)

  // Convert spherical coordinates (phi, theta) to Cartesian coordinates (x, y, z)
  const x = radius * Math.sin(phi) * Math.cos(theta); // X = radius * sin(phi) * cos(theta)
  const y = radius * Math.cos(phi); // Y = radius * cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta); // Z = radius * sin(phi) * sin(theta)

  return new THREE.Vector3(x, y, z); // Return the 3D position
}

// Function to load and parse GeoJSON country borders and plot them on the globe
function addCountryBorders(countries) {
  countries.features.forEach((country) => {
    const coordinates = country.geometry.coordinates;

    // Flatten the geoJSON coordinates if it's nested
    const flatCoordinates = flattenCoordinates(coordinates);

    // Convert the coordinates to 3D positions on the globe
    const points = flatCoordinates.map(([lon, lat]) => {
      const { x, y, z } = latLonToXYZ(lat, lon, 1.01); // Radius slightly larger than Earth
      return new THREE.Vector3(x, y, z);
    });

    // Create a line for the country borders
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.7,
    });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
  });
}

// Helper function to flatten nested coordinates in GeoJSON (if any)
function flattenCoordinates(coords) {
  if (coords[0][0] instanceof Array) {
    return coords[0]; // If it's nested, just return the inner array
  }
  return coords; // Otherwise, return the array directly
}

// Example usage to plot countries on the globe
const radius = 5; // Radius of the globe

// Example locations: New York City, Paris, Tokyo
const locations = [
  { name: "Bahawalpur", lat: 29.3544, lon: 71.6911 },
  { name: "New York City", lat: 40.7128, lon: -74.006 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
];

addCountryBorders(countries);

// end

/// Create markers and name labels for locations
const markers = [];
const names = [];
locations.forEach((location) => {
  const { lat, lon, name } = location;
  const markerPosition = latLonToXYZ(lat, lon, 1.03); // Slightly larger radius than Earth

  // Create a sprite for the marker
  const markerMaterial = new THREE.SpriteMaterial({ map: markerIcon });
  const marker = new THREE.Sprite(markerMaterial);

  // Position the marker at the 3D coordinates
  marker.position.set(markerPosition.x, markerPosition.y, markerPosition.z);
  marker.scale.set(0.05, 0.05, 0.05); // Adjust size of the marker to be smaller

  // Add the marker to the scene
  scene.add(marker);
  markers.push(marker);

  // Create the name label using THREE.TextGeometry or CanvasTexture
  const textCanvas = document.createElement("canvas");
  const context = textCanvas.getContext("2d");
  context.font = "24px Arial";
  context.fillStyle = "white";
  context.fillText(name, 10, 50); // Adjust position of the name text
  const nameTexture = new THREE.CanvasTexture(textCanvas);

  const nameMaterial = new THREE.SpriteMaterial({ map: nameTexture });
  const nameSprite = new THREE.Sprite(nameMaterial);

  // Position the name label slightly above the marker, adjust the offset if needed
  nameSprite.position.set(
    markerPosition.x,
    markerPosition.y + 0.03, // Adjust position of name label closer to the marker
    markerPosition.z
  );
  nameSprite.scale.set(0.3, 0.3, 1); // Adjust the scale of the name text

  // Add the name label to the scene
  scene.add(nameSprite);
  names.push(nameSprite);
});

// Handle mouse click to detect marker or name click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedLocation = null;

function onMouseClick(event) {
  // Normalize mouse coordinates to [-1, 1] range
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.update();
  raycaster.setFromCamera(mouse, camera);

  // Check if any marker or name is clicked
  const intersectsMarkers = raycaster.intersectObjects(markers);
  const intersectsNames = raycaster.intersectObjects(names);

  // If any marker is clicked
  if (intersectsMarkers.length > 0) {
    selectedLocation = intersectsMarkers[0].object;
    zoomToLocation(selectedLocation.position);
  }

  // If any name is clicked
  if (intersectsNames.length > 0) {
    selectedLocation = intersectsNames[0].object;
    zoomToLocation(selectedLocation.position);
  }
}

function zoomToLocation(position) {
  // Smoothly zoom to the location
  const targetPosition = new THREE.Vector3(position.x, position.y, position.z);
  const zoomSpeed = 0.05; // Adjust the speed of the zoom
  const zoomDuration = 1000; // Duration of the zoom in milliseconds

  // Move camera towards the selected location
  new TWEEN.Tween(camera.position)
    .to(
      { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z + 2 },
      zoomDuration
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}

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
controls.panSpeed = 0.5;
controls.enablePan = false;
controls.screenSpacePanning = false;
controls.enableKeys = false;
controls.minDistance = 1.8; // Minimum zoom distance (adjust to your preference)
controls.maxDistance = 5; // Maximum zoom distance (adjust as needed)

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);

  clouds.rotation.y += 0.001; // Rotate clouds slightly slower for effect
  backgroundSphere.rotation.y += 0;

  controls.update();
  TWEEN.update(); // Update tween animations
}
animate();

// Add event listener for mouse click
window.addEventListener("click", onMouseClick, false);
