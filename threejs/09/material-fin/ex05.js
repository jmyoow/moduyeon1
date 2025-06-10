import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- MeshStandardMaterial에 여러가지 효과 적용하기

// Renderer
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 0.7;
camera.position.z = 1.5;
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

// 텍스쳐 로드
const textureLoader = new THREE.TextureLoader();
const textureColor = textureLoader.load('/textures/rock/Rock043L_1K-JPG_Color.jpg');
// 텍스쳐 생성이 완료되면 실행되는 콜백함수에서 안전하게 매핑 설정을 할 수도 있음
// const textureColor = textureLoader.load(
//   '/textures/rock/Rock043L_1K-JPG_Color.jpg',
//   texture => {
//     material.map = texture;
//     material.map.needsUpdate = true;
//   }
// );
const textureNormal = textureLoader.load('/textures/rock/Rock043L_1K-JPG_NormalDX.jpg');
const textureAO = textureLoader.load('/textures/rock/Rock043L_1K-JPG_AmbientOcclusion.jpg');
const textureDisplacement = textureLoader.load('/textures/rock/Rock043L_1K-JPG_Displacement.jpg');
const textureRoughness = textureLoader.load('/textures/rock/Rock043L_1K-JPG_Roughness.jpg');

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);
const material = new THREE.MeshStandardMaterial({
  // wireframe: true,
  // color: 'orange',
  map: textureColor,
  roughness: 0.3,
  metalness: 0.3,
  side: THREE.DoubleSide,
  
  // 표면의 세부적인 요철 표현용 텍스쳐. 빛 반응을 이용해서 입체감 줌.
  normalMap: textureNormal,
  // 픽셀마다 거칠기 정도를 조정. 밝은 영역은 거칠고 어두운 영역은 매끈하게.
  roughnessMap: textureRoughness,
  // Ambient Occlusion(환경 음영) 텍스쳐. 어두운 틈에서 빛이 덜 들어오게.
  aoMap: textureAO,
  aoMapIntensity: 1.5,
  displacementMap: textureDisplacement,
  displacementScale: 0.1,
  displacementBias: -0.05
});
const box = new THREE.Mesh(geometry, material);
box.castShadow = true;
scene.add(box);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5, 100, 100),
  new THREE.MeshStandardMaterial({
    // wireframe: true,
    color: '#ccc',
    side: THREE.DoubleSide,
    map: textureColor,
    roughness: 0.3,
    metalness: 0.3,
    normalMap: textureNormal,
    displacementMap: textureDisplacement,
    displacementScale: 0.3,
    displacementBias: -0.05
  } )
);
floor.rotation.x = -Math.PI/2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}