const tabMenu = document.querySelector('.tab-menu');
const tabItems = document.querySelectorAll('.tab-item');
const tabPanels = document.querySelectorAll('.tab-panel');

let currentItem; // 현재 활성화된 메뉴를 저장

function clickItemHandler(e) {
  e.preventDefault();
  if(currentItem) currentItem.classList.remove('active');
  e.currentTarget.classList.add('active');
  currentItem = e.currentTarget;
}

// 이벤트 바인딩
tabItems.forEach((item, index) => {
  console.log(item, index);
  item.dataset.index = index; // index 세팅
  item.addEventListener('click', clickItemHandler);
});