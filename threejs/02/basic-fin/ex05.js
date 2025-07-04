import * as THREE from 'three';

// ----- 애니메이션

// Renderer
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
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

// Light
const spotLight = new THREE.SpotLight('white', 100);
spotLight.position.set(1, 3, 3);
scene.add(spotLight);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 'dodgerblue'
});
const box = new THREE.Mesh(geometry, material);
scene.add(box);

camera.lookAt(box.position);

// renderer.render(scene, camera);

window.addEventListener('resize', setSize);

const clock = new THREE.Clock();

function animate() {
  // const time = clock.getElapsedTime();
  const delta = clock.getDelta(); // animate의 실행 간격
  // console.log(delta);

  if (box.position.y > 3) box.position.y = 0;
  // box.position.y += 0.01;
  // box.position.y = time;
  box.position.y += delta * 3;

  renderer.render(scene, camera);
  // window.requestAnimationFrame(animate);
}
// animate();
renderer.setAnimationLoop(animate);

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}