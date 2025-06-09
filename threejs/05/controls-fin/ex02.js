import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

// ----- TrackballControls

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
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// camera.position.y = 1.5;
camera.position.z = -0.5;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 2);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

// Controls
const controls = new TrackballControls( camera, renderer.domElement );
controls.noZoom = true;

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 'seagreen',
  side: THREE.DoubleSide // 양면이 다 보이도록
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();

  controls.update(); // enableDamping으로 부드럽게 처리할 때 필요
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}