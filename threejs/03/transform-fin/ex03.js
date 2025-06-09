import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- 그룹 만들기

// Renderer
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
// 고해상도 지원
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75, // 시야각 field of view
  window.innerWidth / window.innerHeight, // 종횡비 aspect
  0.1, // near
  1000 // far
);
camera.position.set(0, 1, 3);

// Light
const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 2);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

// Conrols
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Mesh
const group = new THREE.Group();
scene.add(group);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1, 8, 8),
  new THREE.MeshStandardMaterial({ color: 'seagreen' })
);
// earth.position.set(0, 0, 0);
group.add(earth);

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshStandardMaterial({
  color: 'dodgerblue'
});
const box = new THREE.Mesh(geometry, material);
box.position.set(1.1, 0, 0);
group.add(box);

const geometry2 = new THREE.BoxGeometry(0.2, 0.6, 0.2);
const material2 = new THREE.MeshStandardMaterial({
  color: 'yellow'
});
const box2 = new THREE.Mesh(geometry, material);
box2.position.set(0, 0, 1.3);
group.add(box2);

camera.lookAt(earth.position);

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();

  controls.update();

  // group.rotation.y += delta;
  // group.position.y += delta;
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}