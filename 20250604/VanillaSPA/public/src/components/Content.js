export default function Content({ appElem, state }) {
  this.state = state;
  this.container = document.createElement('div');
  this.container.classList.add('content');
  appElem.appendChild(this.container);

  this.template = () => {
    if (!this.state || this.state.length === 0) {
      return '<p class="no-data">데이터가 없습니다.</p>';
    }
    // map 함수를 사용하여 각 아이템을 처리하고 문자열로 변환
    return this.state.map(item => {
      console.log(item);
      if (item.email) {
        // users 데이터인 경우
        return `<div class="item user-item">
          <h3>${item.name}</h3>
          <p>${item.email}</p>
          <p>${item.phone}</p>
        </div>`;
      } else {
        // 기타 데이터인 경우
        return `<div class="item">
          <h3>${item.title || item.name || ''}</h3>
          <p>${item.body || item.email || ''}</p>
        </div>`;
      }
    }).join('');
  };

  this.render = () => {
    this.container.innerHTML = this.template();
  };

  this.setState = state => {
    this.state = state;
    this.render();
  };
  
  this.render();
}