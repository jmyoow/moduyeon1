import * as THREE from 'three';

// ----- 창 사이즈 변경에 대응하기

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
// camera.position.x = 3;
// camera.position.y = 1;
// camera.position.z = 3;
camera.position.set(3, 1, 3);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 'dodgerblue'
});
const box = new THREE.Mesh(geometry, material);
scene.add(box);

camera.lookAt(box.position);

renderer.render(scene, camera);

window.addEventListener('resize', setSize);

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}