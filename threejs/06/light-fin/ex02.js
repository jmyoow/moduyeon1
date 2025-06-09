import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----- Light 기본

// Renderer
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
// 그림자 설정
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFShadowMap; // 기본값
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.shadowMap.type = THREE.BasicShadowMap;

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
camera.position.z = 3;
scene.add(camera);

// Light
// MeshBasicMaterial은 조명(Light)가 필요 없음
// AmbientLight는 전체적인 톤을 결정
const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 10);
directionalLight.position.x = 1;
directionalLight.position.y = 5;
directionalLight.position.z = -3;
// 그림자 캐스팅(만들기)
directionalLight.castShadow = true;
// mapSize로 그림자 퀄리티 조정
directionalLight.shadow.mapSize.width = 1024; // 기본값 512
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 20;

const pointLight = new THREE.PointLight('yellow', 10, 100);
pointLight.position.set(1, 2, 1);
pointLight.castShadow = true;
scene.add( pointLight );

scene.add(directionalLight);

const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( helper );
const pointLightHelper = new THREE.PointLightHelper( pointLight, 0.5 );
scene.add( pointLightHelper );

const controls = new OrbitControls(camera, renderer.domElement);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({
//   color: 'seagreen'
// });
const material = new THREE.MeshStandardMaterial({
  color: 'seagreen'
});
const box = new THREE.Mesh(geometry, material);
box.position.y = 1.1;
// 박스에서 그림자 만들기
box.castShadow = true;
scene.add(box);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({ color: 'gray' })
);
// Math.PI는 180도
floor.rotation.x = -Math.PI/2;
// 바닥에 그림자 생기게 하기
floor.receiveShadow = true;
scene.add(floor);

window.addEventListener('resize', setSize);
renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

function animate() {
  // const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // pointLight.position.x = Math.sin(time * 0.2) * 2;
  // pointLight.position.y = Math.sin(time * 3) * 0.5 + 1;

  pointLight.position.x = Math.cos(time * 2) * 1.5;
  pointLight.position.z = Math.sin(time * 2) * 1.5;
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}