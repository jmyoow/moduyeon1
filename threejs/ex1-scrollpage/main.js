import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { House } from './House.js';
import gsap from 'gsap';

// ----- 주제: 스크롤에 따라 움직이는 3D 페이지

// Renderer
const canvas = document.querySelector('#three-canvas');
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
scene.background = new THREE.Color('white');

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(-5, 2, 25);
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight('white', 2000);
spotLight.position.set(0, 15, 50);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 200;
scene.add(spotLight);

const gltfLoader = new GLTFLoader();

// Mesh
const floorMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100),
	new THREE.MeshStandardMaterial({ color: 'white' })
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

const houses = [];
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: -5, z: 20, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/Raccoon.glb', x: 7, z: 10, height: 0.5 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: -10, z: 0, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: 10, z: -10, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: -5, z: -20, height: 2 }));

// 이벤트
window.addEventListener('scroll', setSection);
window.addEventListener('resize', setSize);

// 그리기
const clock = new THREE.Clock();
renderer.setAnimationLoop(draw);

function draw() {
	const delta = clock.getDelta();

	renderer.render(scene, camera);
}

let currentSection = 0;
function setSection() {
	const newSection = Math.round(window.scrollY / window.innerHeight);
	// Math.floor 내림
	// Math.round 반올림
	// Math.ceil 올림

	if (currentSection !== newSection) {
		console.log('animation!!');
		console.log(`currentSection: ${currentSection}, newSection: ${newSection}`);
		gsap.to(
			camera.position,
			{
				duration: 1,
				x: houses[newSection].x,
				z: houses[newSection].z + 5,
			}
		);
		currentSection = newSection;
	}
}

function setSize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}
