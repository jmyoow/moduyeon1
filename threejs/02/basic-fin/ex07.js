import * as THREE from 'three';
import gsap from 'gsap';

// ----- 라이브러리를 이용한 애니메이션

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

window.addEventListener('resize', setSize);

renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

// gsap.to(
//   box.position, // 바꿀 객체(오브젝트)
//   {
//     duration: 1,
//     z: 3
//   }
// );

gsap.from(
  box.position, // 바꿀 객체(오브젝트)
  {
    duration: 1,
    ease: "elastic",
    z: 3
  }
);

function animate() {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}