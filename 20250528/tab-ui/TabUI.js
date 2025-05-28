export class TabUI {
  constructor(menuTextArray, selector, index = 0) {
    this.menuTextArray = menuTextArray;
    this.menuItemArray = []; // li.menu-item 객체들을 담을 배열
    this.currentIndex = index;
    this.container = document.querySelector(selector);

    this.initDOM();
    this.activateTab(this.currentIndex);
  }

  activateTab(index) {
    // console.log('activateTab!!', index);
    // console.log(index, !index);
    if (index !== 0 && !index) return;
    // 0은 false로 판정되므로 특별히 처리. 0일 경우는 잘 동작하도록..

    // 현재 활성화된 아이템 비활성화
    this.menuItemArray[this.currentIndex].classList.remove('active');
    // 현재 클릭한 아이템 활성화
    this.menuItemArray[index].classList.add('active');
    this.currentIndex = index;
  }

  initDOM() {
    // HTML 구조 만들기
    const tabMenu = document.createElement('ul');
    tabMenu.classList.add('tab-menu');

    this.menuTextArray.forEach((text, index) => {
      // console.log(text, index)
      const li = document.createElement('li');
      li.textContent = text;
      li.dataset.index = index;
      li.classList.add('tab-item');
      // li.className = 'tab-item';
      tabMenu.append(li);
      this.menuItemArray.push(li);
    });

    this.container.append(tabMenu);

    // 이벤트
    tabMenu.addEventListener('click', (event) => {
      // console.log(event.target.dataset.index);
      // event.target.classList.add('active');
      
      // 1
      if (event.target.classList.contains('tab-item')) {
        const index = event.target.dataset.index;
        this.activateTab(index);
      }

      // 2
      // if (!event.target.classList.contains('tab-item')) return;
      // const index = event.target.dataset.index;
      // this.activateTab(index);

      // 3
      // if (!event.target.classList.contains('tab-item')) {
      //   throw new Error('잘못 클릭했어 너');
      // }
      // const index = event.target.dataset.index;
      // this.activateTab(index);
    });
  }
}