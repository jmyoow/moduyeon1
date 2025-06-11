import { PointLight } from 'three';

export class House {
	constructor({ name, gltfLoader, scene, modelSrc, x, z, height }) {
		this.x = x;
		this.z = z;
		height = height || 2;
		const houseLight = new PointLight('white', 10);

		gltfLoader.load(
			modelSrc,
			glb => {
				// 그림자
				glb.scene.traverse(child => {
					if (child.isMesh) {
						child.castShadow = true;
					}
				});
				const mesh = glb.scene;
				// mesh.castShadow = true; // glb 파일은 이렇게 하면 99.9999% 그림자 안생김
				mesh.position.set(x, height/2, z);
				scene.add(mesh);

				houseLight.position.set(x, height, z);
				scene.add(houseLight);
			}
		);
	}
}