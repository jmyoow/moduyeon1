let currentSection = 0;

window.addEventListener('scroll', e => {

	document.getElementById('info').innerHTML = `
		현재 스크롤 위치(window.scrollY): ${window.scrollY}<br>
		현재 스크롤 위치 / 브라우저 창 높이: ${window.scrollY / window.innerHeight}
	`;

  const newSection = Math.round(window.scrollY / window.innerHeight);

  if (currentSection !== newSection) {
		console.log('새 섹션 진입');
		console.log(`currentSection: ${currentSection}, newSection: ${newSection}`);
		
		currentSection = newSection;

    // 섹션이 바뀌면 실행할 코드 작성
    
	}
});