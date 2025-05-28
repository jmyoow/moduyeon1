const tabMenu = document.querySelector('.tab-menu');
const tabItems = document.querySelectorAll('.tab-item');

let currentIndex = 0; // 현재 활성화된 메뉴를 저장

function activateTab(index) {
  tabItems[currentIndex].classList.remove('active');
  tabItems[index].classList.add('active');
  currentIndex = index;
}

function clickItemHandler(e) {
  e.preventDefault();
  activateTab(e.target.dataset.index);
}

// index 세팅
tabItems.forEach((item, index) => {
  item.dataset.index = index; // index 세팅
});

tabMenu.addEventListener('click', clickItemHandler);

activateTab(currentIndex);