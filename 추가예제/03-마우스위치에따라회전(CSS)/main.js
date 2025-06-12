const panel = document.querySelector('.panel-3d');

// 마우스 위치에 따른 패널 회전을 위한 변수들
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
const rotationSpeed = 0.05;
const maxRotation = 0.3;

animate();

window.addEventListener('mousemove', e => {

  // 마우스 위치를 -1에서 1 사이의 값으로 변환
  const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  
  // 목표 회전값 설정
  targetRotationY = mouseX * maxRotation;
  targetRotationX = -mouseY * maxRotation;
	
	const info = document.getElementById('info');
	info.innerHTML = `
    마우스 X: ${e.clientX}<br>
    마우스 Y: ${e.clientY}<br>
    목표 회전값 Y축: ${radToDeg(targetRotationY)}<br>
    목표 회전값 X축: ${radToDeg(targetRotationX)}
  `;

});

function animate() {
  currentRotationX += (targetRotationX - currentRotationX) * rotationSpeed;
  currentRotationY += (targetRotationY - currentRotationY) * rotationSpeed;

  panel.style.transform = `
    rotateX(${radToDeg(currentRotationX)}deg)
    rotateY(${radToDeg(currentRotationY)}deg)
  `;

  requestAnimationFrame(animate);
}

// CSS에서는 360도 기반의 각도를 사용하므로 radToDeg 함수로 값을 변환 후 사용
// Three.js에서는 라디안을 사용하므로 radToDeg 함수 필요 없음
function radToDeg(radian) {
  return radian * 180 / Math.PI;
}
