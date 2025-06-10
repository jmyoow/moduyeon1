import { PointLight } from 'three';

export class House {
	constructor({ gltfLoader, scene, modelSrc, x, z, height }) {
		this.x = x;
		this.z = z;
		height = height || 2;
		const houseLight = new PointLight('white', 10);

		gltfLoader.load(
			modelSrc,
			glb => {
				glb.scene.traverse(child => {
					if (child.isMesh) {
						child.castShadow = true;
					}
				});
				const mesh = glb.scene;
				mesh.position.set(x, height/2, z);
				scene.add(mesh);

				houseLight.position.set(x, height, z);
				scene.add(houseLight);
			}
		);
	}
}