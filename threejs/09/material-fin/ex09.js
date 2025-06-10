import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- Canvas Material

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

// Canvas Texture
const texCanvas = document.createElement('canvas');
const texContext = texCanvas.getContext('2d');
texCanvas.width = 500;
texCanvas.height = 500;
const canvasTexture = new THREE.CanvasTexture(texCanvas);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  map: canvasTexture,
  roughness: 0.2,
  metalness: 0.2
});
const mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
scene.add(mesh);

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

function animate() {
  const time = clock.getElapsedTime();

  // 캔버스 그림 그리기
  texContext.fillStyle = 'yellow';
  texContext.fillRect(0, 0, 500, 500);
  texContext.fillStyle = 'dodgerblue';
  texContext.fillRect(time*50, 100, 150, 150);

  material.map.needsUpdate = true;
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}