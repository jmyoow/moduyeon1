const menu = document.querySelector('.menu');
const content = document.querySelector('#content');

menu.addEventListener('click', e => {
  if (e.target.nodeName !== 'A') return;

  e.preventDefault(); // 이벤트 기본 동작 취소
  console.log(e.target.id);
  // console.log(e.target.getAttribute('href'));
  changePage(e.target.id);
});

// 뒤로가기/앞으로가기 하면 발생
window.addEventListener('popstate', e => {
  console.log(e.state);
  content.textContent = `현재 페이지: ${e.state.page}`;
});

function changePage(page) {
  content.textContent = `현재 페이지: ${page}`;

  // 방문 이력 남기기
  history.pushState({ page }, `Title: ${page}`, `/${page}`);
}