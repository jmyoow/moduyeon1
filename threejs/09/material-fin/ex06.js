import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- 텍스쳐 변환

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
const texture = textureLoader.load('/textures/bread/3DBread002_LQ-1K-JPG_Color.jpg');

// 텍스쳐 변환
texture.wrapS = THREE.RepeatWrapping; // 가로 방향 반복
texture.wrapT = THREE.RepeatWrapping; // 세로 방향 반복

texture.offset.x = 0.3; // 0 ~ 1
texture.offset.y = 0.3;

texture.repeat.x = 2;
texture.repeat.y = 3;

texture.rotation = THREE.MathUtils.degToRad(30);
texture.center.x = 0.5; // 중앙을 기준으로 회전
texture.center.y = 0.5; // 중앙을 기준으로 회전

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);
const material = new THREE.MeshStandardMaterial({
  map: texture,
  roughness: 0.3,
  metalness: 0.3,
});
const box = new THREE.Mesh(geometry, material);
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