export default class MiniAlert {
  static fire({ title = "알림", message = "", onClose = null} = {}) {
    // DOM 구조 만들기
    const backdrop = document.createElement('div');
    // backdrop.classList.add('mini-alert-backdrop');
    backdrop.className = 'mini-alert-backdrop';

    const modal = document.createElement('div');
    modal.className = 'mini-alert';

    modal.innerHTML = `
      <div class="mini-alert-content">
        <h2 class="mini-alert-title">${title}</h2>
        <p class="mini-alert-message">${message}</p>
        <button class="mini-alert-close-btn">확인</button>
      </div>
    `;

    backdrop.append(modal);
    document.body.append(backdrop);

    // 이벤트
    const closeBtn = modal.querySelector('.mini-alert-close-btn');
    closeBtn.addEventListener('click', () => {
      backdrop.remove();
      // console.log(typeof onClose);
      if (typeof onClose === 'function') onClose();
    });
  }
}
