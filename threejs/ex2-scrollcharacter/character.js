import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';

export class Character {
  constructor(scene) {
    this.scene = scene;
    this.characterMesh = null;
    this.mixer = null;
    this.actions = [];
  }

  createFacePlanes() {
    const planeGeometry = new THREE.PlaneGeometry(0.4, 0.4);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1,
      roughness: 1,
    });

    const plane1 = new THREE.Mesh(planeGeometry, planeMaterial);
    const plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    
    return { plane1, plane2 };
  }

  async load() {
    const gltfLoader = new GLTFLoader();
    
    const glb = await new Promise((resolve, reject) => {
      gltfLoader.load(
        '/models/character.glb',
        glb => {
          // shadow
          glb.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
            }
          });

          this.characterMesh = glb.scene.children[0];
          this.characterMesh.position.y = 0.55;
          this.characterMesh.position.z = -5;
          this.scene.add(this.characterMesh);

          const { plane1, plane2 } = this.createFacePlanes();
          this.plane1 = plane1;
          this.plane2 = plane2;
          this.setFaceTexture();
          
          // 플레인 위치 조정
          plane1.position.set(0, 0.6, 0.21); // 앞쪽 플레인
          plane2.position.set(0, 0.6, -0.21); // 뒤쪽 플레인
          
          // 메쉬의 자식으로 추가
          this.characterMesh.children[1].add(plane1);
          this.characterMesh.children[1].add(plane2);

          this.mixer = new THREE.AnimationMixer(this.characterMesh);
          this.actions[0] = this.mixer.clipAction(glb.animations[0]);
          this.actions[1] = this.mixer.clipAction(glb.animations[1]);
          
          this.actions[0].play();
          this.actions[1].stop();

          resolve(glb);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );

    });
  }

  update(delta) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  run() {
    if (this.actions[0] && this.actions[1]) {
      this.actions[0].fadeOut(0.3); // idle을 0.3초 동안 서서히 끄고
      this.actions[1].reset().fadeIn(0.3).play(); // run을 0.3초 동안 서서히 켬
    }
  }

  idle() {
    if (this.actions[0] && this.actions[1]) {
      this.actions[1].fadeOut(0.3); // run을 0.3초 동안 서서히 끄고
      this.actions[0].reset().fadeIn(0.3).play(); // idle을 0.3초 동안 서서히 켬
    }
  }

  jump() {
    gsap.to(this.characterMesh.position, {
      y: 1.5,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        // 땅으로 되돌아오는 애니메이션
        gsap.to(this.characterMesh.position, {
          y: 0.55,
          duration: 0.5,
          ease: 'power2.inOut',
        });
      }
    });
  }

  setFaceTexture() {
    const textureLoader = new THREE.TextureLoader();
    fetch('https://web-production-6707e.up.railway.app/api/photos')
      .then(response => response.json())
      .then(data => {
        const latestPhoto = data.photos[data.photos.length - 1];
        const texture = textureLoader.load(`https://web-production-6707e.up.railway.app/uploads/${latestPhoto}`);
        this.plane1.material.map = texture;
        this.plane2.material.map = texture;
      })
      .catch(error => console.error('텍스처 로딩 실패:', error));
  }
} 