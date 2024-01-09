// Import styles and Three.js library
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Initialize Three.js components
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
const controls = new OrbitControls(camera, renderer.domElement);

// Global variables
let orbitRadius_mercury = 10; // for example
let orbitRadius_venus = 14; // for example
let date;

// Add stars to the scene
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ emissive: 0xffffff, emissiveIntensity: 1000, color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(1000).fill().forEach(addStar);

// Load space texture and set it as the background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
//scene.background = spaceTexture;

// Configure renderer settings
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set initial camera position
camera.position.setZ(30);

// Render the initial frame
renderer.render(scene, camera);

// Create and add the sun to the scene
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshStandardMaterial({
    emissive: 0xffff00,
    emissiveIntensity: 1,
    map: new THREE.TextureLoader().load('sun.jpg'),
    normalMap: new THREE.TextureLoader().load('normal.jpg')
  })
);
const solarSystem = new THREE.Group();
solarSystem.add(sun);

scene.add(solarSystem);

// Create and add Mercury to the scene
const mercury = new THREE.Mesh(
  new THREE.SphereGeometry(1, 20, 20),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('mercury.jpg'),
    normalMap: new THREE.TextureLoader().load('mercury_normal.jpg')
  })
);
mercury.position.x = 16;
const mercurySystem = new THREE.Group();
mercurySystem.add(mercury);
scene.add(mercurySystem);


const venus = new THREE.Mesh(
  new THREE.SphereGeometry(2, 20, 20),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('venus.jpg'),
    normalMap: new THREE.TextureLoader().load('venus_normal.jpg')
  })
);
venus.position.x = 32;
const venusSystem = new THREE.Group();
venusSystem.add(venus);

scene.add(venusSystem);


const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 20, 20),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('earth.jpg'),
    normalMap: new THREE.TextureLoader().load('earth_normal.jpg')
  })
);
earth.position.x = 48;
const earthSystem = new THREE.Group();
earthSystem.add(earth);


scene.add(earthSystem);


// Create and add lights to the scene
const pointLight = new THREE.PointLight(0xffffff);
pointLight.intensity = 1000;
pointLight.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 1.5;

scene.add(pointLight, ambientLight);

// Create helpers for lights
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

const EARTH_YEAR = 2 * Math.PI *(1/60)*(1/60);
// Animation function
function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.01;
  mercurySystem.rotation.y += EARTH_YEAR*2;
  venusSystem.rotation.y += EARTH_YEAR;
  earthSystem.rotation.y += EARTH_YEAR/2;

  // Update OrbitControls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
 
}

// Start the animation loop
animate();
