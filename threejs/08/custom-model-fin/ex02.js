import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ----- glb 애니메이션

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
scene.background = new THREE.Color('lightblue');

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 2);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);

// Loader
const gltfLoader = new GLTFLoader();
let mixer; // 애니메이션 믹서를 담을 변수

// Mesh
gltfLoader.load(
  // '/models/character.glb',
  '/models/robot.glb',
  glb => {
    console.log(glb);
    // console.log(glb.scene); // Group
    // console.log(glb.scene.children[0]); // Mesh
    const character = glb.scene;
    scene.add(character);
    // scene.add(glb.scene.children[0]);
    
    mixer = new THREE.AnimationMixer(character);
    const actions = [];
    actions[0] = mixer.clipAction(glb.animations[0]);
    actions[1] = mixer.clipAction(glb.animations[1]);
    // actions[1].repetitions = 2;
    // actions[0].play(); 
    actions[1].play();
  },
  undefined,
  error => {
    console.log('로드 실패');
  }
);

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  
  // glb 애니메이션
  if(mixer) mixer.update(delta);

  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}