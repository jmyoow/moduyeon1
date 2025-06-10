import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import SetRaycasterClick from './SetRaycasterClick.js';

// Raycaster 설정과 PreventDragClick을 한꺼번에 하는
// SetRaycasterClick 모듈 사용

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
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 'seagreen'
});
const box = new THREE.Mesh(geometry, material);
box.name = 'myBox'; // 레이캐스터에서 확인해보려고 설정한 이름
scene.add(box);

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

SetRaycasterClick.init({
  scene,
  canvas,
  camera,
  callback: (object) => {
    // 클릭한 Mesh(object)에 대한 작업
    console.log(object.name);
    object.material.color.set('hotpink');
  }
});

const clock = new THREE.Clock();

function animate() {
  const time = clock.getElapsedTime();
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}