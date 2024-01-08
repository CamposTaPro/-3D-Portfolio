import './style.css'
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// nao esquecer de adicionar regions/comentarios para organizar melhor o codigo
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

const controls = new OrbitControls(camera,renderer.domElement)

var orbitRadius = 10; // for example
var date;





function addstar(){
const geometry = new THREE.SphereGeometry(0.25,24,24)
const material = new THREE.MeshStandardMaterial({emissive:0xffffff,emissiveIntensity: 1000,color:0xffffff})
const star = new THREE.Mesh(geometry,material)

const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100))
star.position.set(x,y,z)
scene.add(star)
}

Array(200).fill().forEach(addstar)

const spaceTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = spaceTexture
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30);
renderer.render(scene,camera);

const sun= new THREE.Mesh(
  new THREE.SphereGeometry(5,32,32),
  new THREE.MeshStandardMaterial({emissive: 0xffff00,emissiveIntensity: 1,
    map: new THREE.TextureLoader().load('sun.jpg'),
    normalMap: new THREE.TextureLoader().load('normal.jpg')
  }) 
);

scene.add(sun)



const mercury= new THREE.Mesh(
  new THREE.SphereGeometry(1,20,20),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('mercury.jpg'),
    normalMap: new THREE.TextureLoader().load('mercury_normal.jpg')
  }) 
);

 
scene.add(mercury)






const pointLight = new THREE.PointLight(0xffffff)
 pointLight.intensity = 1000
pointLight.position.set(0,0,0)

const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 0.5

scene.add(pointLight,ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper,gridHelper)

function animate(){
  requestAnimationFrame(animate)
  //torus.rotation.y  += 0.01;
  date = Date.now() * 0.0001;
  mercury.position.set(
    Math.cos(date) * orbitRadius,
    0,
    Math.sin(date) * orbitRadius
  );
  controls.update()
  renderer.render(scene,camera)
  
}
animate()
