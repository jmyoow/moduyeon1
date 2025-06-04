const menu = document.querySelector('.menu');
const content = document.querySelector('#content');

window.addEventListener('load', () => {
  // console.log(window.location.pathname);
  // "/posts"
  // 1. index 1부터 끝까지 잘래니기
  const path = window.location.pathname.slice(1);
  // 2. 슬래시를 빈 문자열로 바꾸기
  // const path = window.location.pathname.replace('/', '');
  // 3. 슬래시를 기준으로 나누기
  // const path = window.location.pathname.split('/')[1];
  // 4. 슬래시를 기준으로 나누고 마지막 요소 가져오기
  // const path = window.location.pathname.split('/').pop();
  changePage(path);
});

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
  if (!page) {
    content.textContent = `홈페이지`;
  } else {
    content.textContent = `현재 페이지: ${page}`;
  }

  // 방문 이력 남기기
  history.pushState({ page }, `Title: ${page}`, `/${page}`);
}