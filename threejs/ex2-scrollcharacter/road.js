import * as THREE from 'three';

export class Road {
  constructor(scene, roadLength) {
    this.scene = scene;
    this.roadLength = roadLength;
    this.roadWidth = 20;
    this.roadHeight = 0.1;
    this.roadColor = '#aaa';
    this.visibleLength = 40;
  }

  create() {
    const geometry = new THREE.BoxGeometry(this.roadWidth, this.roadHeight, this.roadLength);
    const material = new THREE.MeshLambertMaterial({ 
      color: this.roadColor
    });
    
    const road = new THREE.Mesh(geometry, material);
    road.position.z = -this.roadLength / 2;
    road.position.y = -0.05;
    road.receiveShadow = true;
    
    this.scene.add(road);

    // 랜덤한 무늬 생성
    this.createRoadPattern();
    
    this.createGuardrail();

    return road;
  }

  createRoadPattern() {
    const patternCount = 100;
    const minSize = 0.5;
    const maxSize = 2;

    for (let i = 0; i < patternCount; i++) {
      const width = Math.random() * (maxSize - minSize) + minSize;
      const length = Math.random() * (maxSize - minSize) + minSize;
      
      const x = (Math.random() - 0.5) * (this.roadWidth - width);
      const z = -this.roadLength + Math.random() * this.roadLength;
      
      const patternGeometry = new THREE.PlaneGeometry(width, length);
      const patternMaterial = new THREE.MeshLambertMaterial({
        color: '#999'
      });

      const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
      pattern.rotation.x = -Math.PI / 2;
      pattern.position.set(x, 0.01, z);
      pattern.receiveShadow = true;

      this.scene.add(pattern);
    }
  }

  createGuardrail() {
    // 난간 생성
    const railingWidth = 0.2;
    const railingHeight = 1;
    const railingDepth = this.roadLength;
    const railingColor = 0xffffff;

    // 왼쪽 난간
    const railingGeometry = new THREE.BoxGeometry(railingWidth, railingHeight, railingDepth);
    const railingMaterial = new THREE.MeshStandardMaterial({
      color: railingColor,
      transparent: true,
      opacity: 0.9,
      metalness: 0.5,
      roughness: 0.1
    });
    const leftRailing = new THREE.Mesh(railingGeometry, railingMaterial);
    leftRailing.position.set(-2.5, railingHeight/2, -railingDepth/2);
    leftRailing.castShadow = true;
    leftRailing.receiveShadow = true;
    this.scene.add(leftRailing);

    // 오른쪽 난간
    const rightRailing = new THREE.Mesh(railingGeometry, railingMaterial);
    rightRailing.position.set(2.5, railingHeight/2, -railingDepth/2);
    rightRailing.castShadow = true;
    rightRailing.receiveShadow = true;
    this.scene.add(rightRailing);
  }
} 