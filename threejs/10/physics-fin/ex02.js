import * as THREE from 'three';
import * as CANNON from 'cannon-es';
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
camera.position.y = 3;
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
const floorGeometry = new THREE.PlaneGeometry(100, 100);
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

// Cannon (물리 설정)
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // 지구의 중력가속도
// 성능 개선
// world.allowSleep = true;
// 움직임이 거의 없어진 body는 테스트를 안함

// world.broadphase = new CANNON.SAPBroadphase(world);
// 멀리 떨어진 body 끼리는 알아서 충돌 체크 안함
// 고정된 body가 많을 경우도 효과적
// 많은 개수의 오브젝트가 대부분 활발히 움직일 때는 오히려 성능에 악영향

world.defaultContactMaterial.friction = 0.3; // 월드의 기본 마찰력
world.defaultContactMaterial.restitution = 0.3; // 월드의 기본 반발력

// 캐논 바닥
const floorShape = new CANNON.Plane(100, 100);
const floorBody = new CANNON.Body({
  mass: 0, // 위치가 고정
  shape: floorShape
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2); // x축 기준으로 -90도 회전
floorBody.position.y = -1;
world.addBody(floorBody);

window.addEventListener('resize', setSize);
window.addEventListener('click', createBox);

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
  const delta = clock.getDelta();

  world.step(1/60, delta, 3);
  
  // 메쉬가 바디의 위치를 따라가도록
  for (const body of bodies) {
    const mesh = scene.getObjectByName(body.name);
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
  }

  renderer.render(scene, camera);
}

const bodies = []; // 캐논 바디들을 담음
let count = 0;
function createBox() {
  // Mesh
  count++;
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 1, 0.2),
    new THREE.MeshStandardMaterial({
      color: `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`,
      roughness: 0,
      metalness: 0.3
    })
  );
  box.name = `box-${count}`;
  box.castShadow = true;
  scene.add(box);

  // Body
  const boxShape = new CANNON.Box(new CANNON.Vec3(0.3, 0.5, 0.1));
  const boxBody = new CANNON.Body({
    mass: 1,
    shape: boxShape
  });
  boxBody.name = `box-${count}`;
  boxBody.position.y = 5;
  world.addBody(boxBody);
  bodies.push(boxBody);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}