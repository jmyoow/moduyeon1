import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import SetRaycasterClick from './SetRaycasterClick.js';

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

// Renderer
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
camera.position.z = 10;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 2);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
directionalLight.castShadow = true;
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();

// Mesh
// 메쉬 바닥
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 'lightgray',
  roughness: 0.8,
  metalness: 0.3,
  side: THREE.DoubleSide
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.name = 'floor';
floor.receiveShadow = true;
scene.add(floor);

const geometry = new THREE.BoxGeometry(1, 2, 1);
const material = new THREE.MeshStandardMaterial({
  color: 'seagreen',
  roughness: 0,
  metalness: 0.3
});
const box = new THREE.Mesh(geometry, material);
box.name = 'myBox';
box.castShadow = true;
scene.add(box);

window.addEventListener('resize', setSize);

SetRaycasterClick.init({
  scene,
  canvas,
  camera,
  callback: (object) => {
    // console.log(object.name);
    // object.material.color.set('hotpink');
  }
});

renderer.setAnimationLoop(animate);
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