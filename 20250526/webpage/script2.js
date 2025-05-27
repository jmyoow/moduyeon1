const tabMenu = document.querySelector('.tab-menu');
const tabItems = document.querySelectorAll('.tab-item');
const tabPanels = document.querySelectorAll('.tab-panel');

let currentIndex = 0; // 현재 활성화된 메뉴를 저장

function activateTab(index) {
  tabItems[currentIndex].classList.remove('active');
  tabItems[index].classList.add('active');
  tabPanels[currentIndex].classList.remove('active');
  tabPanels[index].classList.add('active');
  currentIndex = index;
}

function clickItemHandler(e) {
  e.preventDefault();
  // console.log(e.currentTarget.dataset.index);
  activateTab(e.currentTarget.dataset.index);
}

// 이벤트 바인딩
tabItems.forEach((item, index) => {
  // console.log(item, index);
  item.dataset.index = index; // index 세팅
  item.addEventListener('click', clickItemHandler);
});

activateTab(currentIndex);