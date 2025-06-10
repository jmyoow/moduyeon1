import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Decoration {
  static loader = new GLTFLoader();

  /**
   * @param {THREE.Scene} scene - three.js 씬 객체
   * @param {string} glbPath - glb 파일 경로
   * @param {THREE.Vector3} position - 위치 (THREE.Vector3)
   * @param {THREE.Vector3|number} scale - 크기 (THREE.Vector3 또는 숫자)
   * @param {function} onLoad - (선택) 로드 완료 후 콜백
   */
  constructor({ scene, glbPath, position = new THREE.Vector3(0,0,0), scale = 1, rotationDegreeY = 0, onLoad = null, callback = null }) {
    this.scene = scene;
    this.glbPath = glbPath;
    this.position = position;
    this.rotationY = THREE.MathUtils.degToRad(rotationDegreeY);
    this.scale = scale;
    this.gltf = null;
    this.object = null;
    this.onLoad = onLoad;
    this.callback = callback;
    this.load();
  }

  load() {
    const loader = Decoration.loader;
    loader.load(
      this.glbPath,
      (glb) => {
        // shadow
        glb.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
          }
        });

        this.glb = glb;
        this.object = glb.scene;
        this.object.position.copy(this.position);
        this.object.rotation.y = this.rotationY;
        if (typeof this.scale === 'number') {
          this.object.scale.set(this.scale, this.scale, this.scale);
        } else {
          this.object.scale.copy(this.scale);
        }
        this.scene.add(this.object);
        if (this.onLoad) this.onLoad(this.object);

        if (this.callback) this.callback();
      },
      undefined,
      (error) => {
        console.error('장식용 GLB 로드 실패:', error);
      }
    );
  }
}

export class DisplayBoard extends Decoration {
  constructor({ scene, glbPath, position = new THREE.Vector3(0,0,0), scale = 1, rotationDegreeY = 0, onLoad = null, callback = null }) {
    super({ 
      scene, 
      glbPath, 
      position, 
      scale, 
      rotationDegreeY, 
      onLoad, 
      callback: () => {
        this.createCanvas();
        this.loadRandomDogImage();
        if (callback) callback();
      }
    });
    this.canvas = null;
    this.ctx = null;
    this.image = null;
    this.isLoading = false;
  }

  async loadRandomDogImage() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();
      
      if (data.status === 'success') {
        this.image = new Image();
        this.image.crossOrigin = 'anonymous';
        
        this.image.onload = () => {
          this.drawImage();
          this.isLoading = false;
        };
        
        this.image.src = data.message;
      }
    } catch (error) {
      console.error('강아지 이미지 로드 실패:', error);
      this.isLoading = false;
    }
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.ctx = this.canvas.getContext('2d');
    
    // 캔버스 머티리얼 생성
    const texture = new THREE.CanvasTexture(this.canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });

    // 디스플레이 보드에 평면 추가
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.95, 1.95),
      material
    );
    plane.position.set(-1.21, 0.78, 0.08);
    
    if (this.object) {
      this.object.add(plane);
    }

    // 클릭 이벤트 추가
    this.object.userData.clickable = true;
    this.object.userData.onClick = () => {
      this.loadRandomDogImage();
    };
  }

  drawImage() {
    if (!this.ctx || !this.image) return;

    // 캔버스 초기화
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 이미지 비율 유지하며 그리기
    const aspectRatio = this.image.width / this.image.height;
    let drawWidth = this.canvas.width;
    let drawHeight = this.canvas.height;
    
    if (aspectRatio > 1) {
      drawHeight = drawWidth / aspectRatio;
    } else {
      drawWidth = drawHeight * aspectRatio;
    }
    
    const x = (this.canvas.width - drawWidth) / 2;
    const y = (this.canvas.height - drawHeight) / 2;
    
    this.ctx.drawImage(this.image, x, y, drawWidth, drawHeight);

    // 텍스트 스타일 설정
    this.ctx.font = 'bold 48px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 8;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';

    // 강아지 이름 추출 (URL에서)
    const breedName = this.image.src.split('/breeds/')[1]?.split('/')[0] || 'Dog';
    const displayName = breedName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // 텍스트 그림자 효과
    this.ctx.strokeText(displayName, this.canvas.width / 2, this.canvas.height - 20);
    this.ctx.fillText(displayName, this.canvas.width / 2, this.canvas.height - 20);

    this.ctx.textAlign = 'left';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.lineWidth = 4;
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.rotate(-20 * Math.PI / 180);
    this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    this.ctx.strokeText('RANDOM DOG', 100, 30);
    this.ctx.fillText('RANDOM DOG', 100, 30);
    this.ctx.restore();
    
    // 텍스처 업데이트
    if (this.object) {
      this.object.traverse((child) => {
        if (child.isMesh && child.material.map) {
          child.material.map.needsUpdate = true;
        }
      });
    }
  }
}