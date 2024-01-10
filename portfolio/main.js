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
  new THREE.SphereGeometry(20, 32, 32),
  new THREE.MeshStandardMaterial({
    emissive: 0xffff00,
    emissiveIntensity: 1,
    map: new THREE.TextureLoader().load('sun.jpg'),
    normalMap: new THREE.TextureLoader().load('normal.jpg')
  })
);
sun.name = "Sun";
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
mercury.name = "Mercury";
mercury.position.x = 19+15;
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
venus.name = "Venus";
venus.position.x = 32+15;
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
earth.name = "Earth";
earth.position.x = 49.7+15;
const earthSystem = new THREE.Group();
earthSystem.add(earth);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 10, 10),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('moon.jpg'),
    normalMap: new THREE.TextureLoader().load('moon_normal.jpg')
  })
);
moon.name = "Moon!! You have mad skills 😎";
moon.position.x = earth.position.x + 5;
const moonOrbit = new THREE.Group();




moonOrbit.add(moon);

scene.add(earthSystem,moonOrbit);


const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 20, 20),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('mars.jpg'),
    normalMap: new THREE.TextureLoader().load('mars_normal.jpg')
  })
);
mars.name = "Mars";
mars.position.x = 75+15;
const marsSystem = new THREE.Group();
marsSystem.add(mars);


scene.add(marsSystem);



const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(10, 20, 20),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('jupiter.jpg')
  })
);
jupiter.name = "Jupiter";
jupiter.position.x = 150+15;
const jupiterSystem = new THREE.Group();
jupiterSystem.add(jupiter);

scene.add(jupiterSystem);

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

// Set up variables for moon's orbit
const moonOrbitRadius = 5;

let moonOrbitAngle = 0;


document.addEventListener('click', (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = - (event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  mouse.x = mouseX;
  mouse.y = mouseY;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    //console.log(intersects[0].object);
    alert("You clicked on " + intersects[0].object.name);
  }
});



// Animation function
function animate() {
  requestAnimationFrame(animate);
  venus.rotation.y += 0.001;
  earth.rotation.y += 0.01;
  mars.rotation.y += 0.008;
  jupiter.rotation.y += 0.02;
  mercurySystem.rotation.y += EARTH_YEAR*2;
  venusSystem.rotation.y += EARTH_YEAR;
  earthSystem.rotation.y += EARTH_YEAR/2;
  marsSystem.rotation.y += EARTH_YEAR/2.5
  moonOrbit.rotation.y += EARTH_YEAR/2;
  jupiterSystem.rotation.y += EARTH_YEAR/10;


  // Update Moon's orbit around Earth
  moonOrbitAngle += 0.05;
  const earthRotation = earthSystem.rotation.y;
  
  // Calculate the position of the moon in Earth's rotated frame
  const moonOrbitX = moonOrbitRadius * Math.cos(moonOrbitAngle + earthRotation);
  const moonOrbitZ = moonOrbitRadius * Math.sin(moonOrbitAngle + earthRotation);

  // Update the moon's position considering Earth's rotation
  moon.position.x = earth.position.x + moonOrbitX;
  moon.position.z = earth.position.z + moonOrbitZ;

  // Update OrbitControls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
 
}

// Start the animation loop
animate();
