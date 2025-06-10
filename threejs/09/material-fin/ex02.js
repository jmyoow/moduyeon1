import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- 각지게 표현하기: flatShading

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
camera.position.z = 4;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 2);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);

// Mesh
const geometry = new THREE.SphereGeometry(1, 16, 16);
// 성능 좋음, 무반사
const material1 = new THREE.MeshLambertMaterial({
  color: 'deepskyblue',
  flatShading: true
});
// 중간 성능, 반사(어설픔)
const material2 = new THREE.MeshPhongMaterial({
  color: 'deepskyblue',
  shininess: 100, // 반짝임 정도
  specular: new THREE.Color(0x666666), // 흰색일 수록 빛나는 강도가 세짐
  flatShading: true
});
// 조금 무거움, 리얼한 반사(현실적)
const material3 = new THREE.MeshStandardMaterial({
  color: 'deepskyblue',
  roughness: 0.3, // 0 ~ 1
  metalness: 0.2,
  flatShading: true
});

const mesh1 = new THREE.Mesh(geometry, material1);
const mesh2 = new THREE.Mesh(geometry, material2);
const mesh3 = new THREE.Mesh(geometry, material3);
mesh1.position.x = -2;
mesh2.position.x = 0;
mesh3.position.x = 2;
scene.add(mesh1, mesh2, mesh3);

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