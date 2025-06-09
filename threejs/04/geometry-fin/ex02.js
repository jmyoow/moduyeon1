import * as THREE from 'three';

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
camera.position.set(0, 1, 1);

// Light
const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 2);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

// Mesh
const geometry = new THREE.SphereGeometry( 1, 32, 16 ); 
const material = new THREE.MeshStandardMaterial( {
  color: 'seagreen',
  // wireframe: true
  flatShading: true
} ); 
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

// 정점(Vertex) 제어
const positionArray = geometry.attributes.position.array;
console.log(positionArray);
const randomArray = [];
for (let i = 0; i < positionArray.length; i += 3) {
  // 정점(Vertex) 한 개의 x, y, z 좌표를 랜덤으로 조정
  positionArray[i] += (Math.random() - 0.5) * 0.2;
  positionArray[i + 1] += (Math.random() - 0.5) * 0.2;
  positionArray[i + 2] += (Math.random() - 0.5) * 0.2;

  randomArray[i] = (Math.random() - 0.5) * 0.2;
  randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
  randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
}

camera.lookAt(sphere.position);

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

function animate() {
  const time = clock.getElapsedTime() * 3;
  // console.log(time);

  for (let i = 0; i < positionArray.length; i += 3) {
    positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.001;
    positionArray[i + 1] += Math.sin(time + randomArray[i + 1] * 100) * 0.001;
    positionArray[i + 2] += Math.sin(time + randomArray[i + 2] * 100) * 0.001;
  }

  geometry.attributes.position.needsUpdate = true;
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}