import * as THREE from 'three';
import gsap from 'gsap';

// ----- Geometry

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
camera.position.set(0, 0, 1);

// Light
const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 3);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

// Mesh
const geometry = new THREE.PlaneGeometry(5, 5, 32, 32); 
const material = new THREE.MeshStandardMaterial( {
  color: 'seagreen',
  // wireframe: true,
  flatShading: true
} ); 
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

// 정점 배열
const positionAttr = geometry.attributes.position;
const positionArray = positionAttr.array;
const originalArray = positionArray.slice(); // 원본 복사
const targetArray = positionArray.slice(); // 목표 위치 (gsap용)

// targetArray의 좌표를 살짝 흔들리도록 갱신 (gsap 애니메이션)
for (let i = 0; i < targetArray.length; i += 3) {
  const offset = (Math.random() - 0.5) * 0.2;

  gsap.to(targetArray, {
    [i]: originalArray[i] + offset,
    [i + 1]: originalArray[i + 1] + offset,
    [i + 2]: originalArray[i + 2] + offset,
    duration: 2 + Math.random() * 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

function animate() {
  for (let i = 0; i < positionArray.length; i++) {
    positionArray[i] = targetArray[i];
  }

  positionAttr.needsUpdate = true;
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}