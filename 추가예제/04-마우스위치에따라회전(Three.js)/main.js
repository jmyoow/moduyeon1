import * as THREE from 'three';

// Renderer
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
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
camera.position.set(0, 0, 3);

// Light
const spotLight = new THREE.SpotLight('white', 100);
spotLight.position.set(1, 3, 3);
scene.add(spotLight);

// Mesh
const geometry = new THREE.PlaneGeometry(3, 3);
const material = new THREE.MeshStandardMaterial({
  color: 'dodgerblue',
  roughness: 0.1,
  metalness: 0.3
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 마우스 위치에 따른 패널 회전을 위한 변수들
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
const rotationSpeed = 0.05;
const maxRotation = 0.3; // 최대 회전각 설정
window.addEventListener('mousemove', e => {
  // 마우스 위치를 -1에서 1 사이의 값으로 변환
  const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  
  // 목표 회전값 설정
  targetRotationY = -mouseX * maxRotation;
  targetRotationX = -mouseY * maxRotation;
	
	document.getElementById('info').innerHTML = `
    마우스 X: ${e.clientX}<br>
    마우스 Y: ${e.clientY}<br>
    목표 회전값 Y축: ${targetRotationY}<br>
    목표 회전값 X축: ${targetRotationX}
  `;

});

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta(); // animate의 실행 간격

  // 카메라 회전
  currentRotationX += (targetRotationX - currentRotationX) * rotationSpeed;
  currentRotationY += (targetRotationY - currentRotationY) * rotationSpeed;
  camera.rotation.x = currentRotationX;
  camera.rotation.y = currentRotationY;

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', setSize);
function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}