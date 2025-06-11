import * as THREE from 'three';
import { Character } from './character.js';
import { Road } from './road.js';
import { ImageUpload } from './imageUpload.js';
import { Decoration, DisplayBoard } from './decoration.js';

const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);

// Scene
const scene = new THREE.Scene();

// Raycaster 추가
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Character
const character = new Character(scene);
await character.load().catch(console.error);

// 이미지 업로드 UI 초기화
const imageUpload = new ImageUpload(character);

// 마우스 클릭 이벤트
window.addEventListener('click', (event) => {
  // 마우스 위치를 정규화된 장치 좌표로 변환
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycaster 업데이트
  raycaster.setFromCamera(mouse, camera);

  // 모든 객체와의 교차 확인
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    
    // 캐릭터 클릭 확인
    let isCharacterClicked = false;
    let currentObject = clickedObject;
    while (currentObject) {
      if (currentObject === character.characterMesh) {
        isCharacterClicked = true;
        break;
      }
      currentObject = currentObject.parent;
    }

    if (isCharacterClicked) {
      imageUpload.show();
      return;
    }
    
    // 클릭한 객체가 클릭 가능한 객체인지 확인
    currentObject = clickedObject;
    while (currentObject) {
      if (currentObject.userData.clickable) {
        if (currentObject.userData.onClick) {
          currentObject.userData.onClick();
        }
        break;
      }
      currentObject = currentObject.parent;
    }
  }
});

// Fog 추가
const fogColor = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(fogColor, 10, 30);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 1.7;
camera.position.z = 3.5;
scene.add(camera);

// 마우스 위치에 따른 카메라 회전을 위한 변수들
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
const rotationSpeed = 0.05;
const maxRotation = 0.2;

// 마우스 이벤트
window.addEventListener('mousemove', (event) => {
  // 마우스 위치를 -1에서 1 사이의 값으로 변환
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = (event.clientY / window.innerHeight) * 2 - 1;
  
  // 목표 회전값 설정 (Y축 회전 방향 반전)
  targetRotationY = -mouseX * maxRotation;
  targetRotationX = -mouseY * maxRotation;
});

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 도로 길이와 streetlight 배치 간격 설정
const roadLength = 70; // road.js의 길이와 맞춤
const interval = 12;
const leftX = -3;  // 도로 왼쪽
const rightX = 3;  // 도로 오른쪽

// Road
const road = new Road(scene, roadLength);
road.create();

// 가로등 생성
new Decoration({
  scene,
  glbPath: '/models/streetlight.glb',
  position: new THREE.Vector3(0, 0, 0),
  scale: 1,
  callback: function () {
    const pointLight = new THREE.PointLight(0xffffff, 25);
    pointLight.position.set(-1.7, 1.9, 0);
    pointLight.castShadow = true;
    this.object.add(pointLight);

    // material을 공유하기 위해 deep clone 사용
    const template = this.object.clone(true);
    
    for (let z = 5; z > -roadLength; z -= interval) {
      // 왼쪽 가로등
      const leftStreetlight = this.object.clone();
      leftStreetlight.position.set(leftX, 2, z);
      leftStreetlight.rotation.y = Math.PI;
      scene.add(leftStreetlight);
  
      // 오른쪽 가로등
      const rightStreetlight = this.object.clone();
      rightStreetlight.position.set(rightX, 2, z);
      scene.add(rightStreetlight);
    }
  }
});

// 전광판
const displayBoard = new DisplayBoard({
  scene,
  glbPath: '/models/displayBoard.glb',
  position: new THREE.Vector3(3, 2, -25)
});

// Event
window.addEventListener('resize', setSize);

// 초기 위치 설정
// 캐릭터 메쉬 초기 위치는 Character 내부에서
camera.position.z = -1.5;

let isScrolling = false; // 스크롤 중일 때 true
let scrollTimeout;
let currentZ = -5; // 시작 위치를 -5로 설정
const maxZ = 40; // 캐릭터 이동 범위는 40으로 유지

window.addEventListener('scroll', () => {
  // 스크롤한 비율을 0 ~ 1 사이 소수로 표현
  const scrollRatio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  
  // 스크롤 시작할 때 run 애니메이션
  if (!isScrolling) {
    isScrolling = true;
    character.run();
  }
  
  // 스크롤에 따라 Z 위치 업데이트 (maxZ로 제한)
  currentZ = -5 - scrollRatio * maxZ; // 시작 위치 -5에서 시작
  character.characterMesh.position.z = currentZ;
  camera.position.z = currentZ + 3.5;
  
  // 스크롤이 멈추면 idle 애니메이션으로 전환
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
    character.idle();
  }, 150);
});

// 스페이스바 점프 이벤트
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && character) {
    character.jump();
  }
});

const clock = new THREE.Clock();

animate();

function animate() {
  const delta = clock.getDelta();
  
  // 부드러운 카메라 회전
  currentRotationX += (targetRotationX - currentRotationX) * rotationSpeed;
  currentRotationY += (targetRotationY - currentRotationY) * rotationSpeed;
  
  camera.rotation.x = currentRotationX;
  camera.rotation.y = currentRotationY;

  character.update(delta);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}
