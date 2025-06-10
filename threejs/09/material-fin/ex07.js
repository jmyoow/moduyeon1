import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- 큐브 텍스쳐 매핑

// Renderer
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 0.7;
camera.position.z = 1.5;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 2);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
directionalLight.castShadow = true;
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);

// 텍스쳐 로드
const textureLoader = new THREE.TextureLoader();
const rightTexture = textureLoader.load('/textures/cube/right.png');
const leftTexture = textureLoader.load('/textures/cube/left.png');
const topTexture = textureLoader.load('/textures/cube/top.png');
const bottomTexture = textureLoader.load('/textures/cube/bottom.png');
const frontTexture = textureLoader.load('/textures/cube/front.png');
const backTexture = textureLoader.load('/textures/cube/back.png');

const materials = [
  new THREE.MeshBasicMaterial({ map: rightTexture }),
  new THREE.MeshBasicMaterial({ map: leftTexture }),
  new THREE.MeshBasicMaterial({ map: topTexture }),
  new THREE.MeshBasicMaterial({ map: bottomTexture }),
  new THREE.MeshBasicMaterial({ map: frontTexture }),
  new THREE.MeshBasicMaterial({ map: backTexture })
];

rightTexture.magFilter = THREE.NearestFilter;
leftTexture.magFilter = THREE.NearestFilter;
topTexture.magFilter = THREE.NearestFilter;
bottomTexture.magFilter = THREE.NearestFilter;
frontTexture.magFilter = THREE.NearestFilter;
backTexture.magFilter = THREE.NearestFilter;

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);
const box = new THREE.Mesh(geometry, materials);
box.castShadow = true;
scene.add(box);

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}