import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- HDRI Environment

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
const texture = textureLoader.load(
  '/textures/IndoorEnvironmentHDRI013_2K-TONEMAPPED.jpg',
  texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  }
);

// Mesh
const geometry = new THREE.SphereGeometry(0.5, 64, 64);
const material = new THREE.MeshStandardMaterial({
  roughness: 0,
  metalness: 1
});
const mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
scene.add(mesh);

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