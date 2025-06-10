import { Vector2, Raycaster } from 'three';

export default class SetRaycasterClick {
	static mouse = new Vector2();

	static init({ scene, canvas, camera, callback }) {
		PreventDragClick.init(canvas);
		return new SetRaycasterClick({ scene, canvas, camera, callback });
	}

	constructor({ scene, canvas, camera, callback }) {
		const mouse = SetRaycasterClick.mouse;
		const raycaster = new Raycaster();

		canvas.addEventListener('click', e => {
			if (PreventDragClick.mouseMoved) return;

			mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);

			const intersects = raycaster.intersectObjects(scene.children);
			for (const item of intersects) {
				if (item.object.isMesh) {
					if (callback) callback(item.object);
					break;
				}
			}
		});
	}
}

class PreventDragClick {
  static mouseMoved = false; // 드래그했는지 안했는지

  static init(elem) {
    return new PreventDragClick(elem);
  }

  constructor(elem) {
    let clickStartX; // 마우스를 눌렀을 때 X좌표
    let clickStartY; // 마우스를 눌렀을 때 Y좌표
    let clickStartTime; // 마우스를 눌렀을 때 현재 시간

    elem.addEventListener('mousedown', e => {
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      clickStartTime = Date.now();
      // console.log(`clickStartX: ${clickStartX}`);
    });

    elem.addEventListener('mouseup', e => {
      const xGap = Math.abs(e.clientX - clickStartX);
      const yGap = Math.abs(e.clientY - clickStartY);
      const timeGap = Date.now() - clickStartTime;

      // console.log(`차이: ${xGap}`);

      if (
        xGap > 50 ||
        yGap > 50 ||
        timeGap > 500 // 0.5초보다 크면
      ) {
        PreventDragClick.mouseMoved = true;
      } else {
        PreventDragClick.mouseMoved = false;
      }
    });
  }
}