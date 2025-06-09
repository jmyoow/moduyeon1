import * as THREE from 'three';

// ----- rotation

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

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 'dodgerblue'
});
const box = new THREE.Mesh(geometry, material);
scene.add(box);

// camera.lookAt(box.position);

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

camera.lookAt(box.position);

// 라디안(Radian): 360도는 2파이
// box.rotation.y = 0.3;
// box.rotation.y = THREE.MathUtils.degToRad(45);

box.rotation.reorder('YXZ');
setTimeout(() => {
  box.rotation.y = THREE.MathUtils.degToRad(45);
  setTimeout(() => {
    box.rotation.x = THREE.MathUtils.degToRad(30);
  }, 1000);
}, 1000);

function animate() {
  const delta = clock.getDelta();

  // box.rotation.y += THREE.MathUtils.degToRad(delta*100);
  // box.rotation.y += delta;
  // box.rotation.y += delta;
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}