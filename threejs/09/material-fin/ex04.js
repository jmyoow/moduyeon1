import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- 텍스쳐 이미지 로드

// Renderer
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 1.5;
camera.position.z = 2;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 2);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);

// 텍스쳐 로드
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  '/textures/rock/Rock043L_1K-JPG_Color.jpg',
  () => {
    console.log('로드 완료');
  },
  () => {
    console.log('로드 중');
  },
  () => {
    console.log('로드 에러');
  }
);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  // color: 'orange'
  map: texture,
  roughness: 0,
  // metalness: 0.5
});
const box = new THREE.Mesh(geometry, material);
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