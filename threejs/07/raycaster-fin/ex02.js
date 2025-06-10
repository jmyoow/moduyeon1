import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import PreventDragClick from './PreventDragClick.js';

// ----- 클릭한 Mesh 판별하기

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

const ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 'orange'} )
);
ball.name = 'myBall';
scene.add(ball);

window.addEventListener('resize', setSize);
window.addEventListener('click', e => {
  // if (preventDragClick.mouseMoved) return;
  if (PreventDragClick.mouseMoved) return;

  // console.log(e.clientX, e.clientY);
  // console.log(e.clientX / window.innerWidth * 2 - 1);
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // 카메라 기준으로 ray 설정
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  for (const item of intersects) {
    if (item.object.isMesh) {
      console.log(item.object)
      // console.log(item.object.name);
      item.object.material.color.set('hotpink');
      break; // 광선에 처음 맞은 메쉬만 체크하고 반복문 빠져나옴
    }
  }
});
renderer.setAnimationLoop(animate);

// const preventDragClick = new PreventDragClick(canvas);
PreventDragClick.init(canvas);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(); // 마우스 좌표를 담을 객체

const clock = new THREE.Clock();

function animate() {
  const time = clock.getElapsedTime();

  box.position.y = Math.cos(time) * 2;
  ball.position.x = Math.sin(time) * 2;

  const origin = new THREE.Vector3(0, 0, 100);
  const direction = new THREE.Vector3(0, 0, -100);
  direction.normalize();
  raycaster.set(origin, direction); // ray 세팅

  // console.log(scene.children);
  // 먼저 모든 메쉬의 색상을 녹색으로
  // scene.children.forEach(child => {
  //   if (child.isMesh) {
  //     child.material.color.set('seagreen');
  //   }
  // });
  
  renderer.render(scene, camera);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}