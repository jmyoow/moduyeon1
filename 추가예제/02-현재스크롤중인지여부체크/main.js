let isScrolling = false; // 스크롤 중일 때 true
let scrollTimeout;

window.addEventListener('scroll', e => {
	
	const info = document.getElementById('info');
	info.textContent = '스크롤 중..';

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
    info.textContent = '스크롤 멈춤!';
  }, 150);
});