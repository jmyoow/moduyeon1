export default class MiniAlert {
  /**
   * @typedef {Object} MiniAlertOptions
   * @property {string} [title] - 모달 제목
   * @property {string} [message] - 모달 메시지
   * @property {Function} [onClose] - 닫힐 때 호출되는 콜백 함수
   * @property {boolean} [onCloseBackdrop] - 배경 클릭 시 닫을지 여부
   */

  /**
   * 간단한 알림 모달을 보여줌
   * @param {MiniAlertOptions} [options]
   */
  // jsdoc 주석
  static fire({ title = "알림", message = "", onClose = null, onCloseBackdrop = true } = {}) {
    // CSS
    if (!document.getElementById('mini-alert-style')) {
      const style = document.createElement('style');
      style.id = 'mini-alert-style';
      style.textContent = `
        .mini-alert-backdrop {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0; left: 0; bottom: 0; right: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.4);
        }

        .mini-alert {
          min-width: 150px;
          max-width: 300px;
          padding: 2rem;
          border-radius: 8px;
          background: white;
          box-shadow: rgba(0, 0, 0, 0.2) 15px 15px 0;
        }
      `;
      document.head.append(style);
    }

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

    if (onCloseBackdrop) {
      backdrop.addEventListener('click', () => {
        backdrop.remove();
        if (typeof onClose === 'function') onClose();
      });

      // 이벤트 버블링 차단
      modal.addEventListener('click', e => e.stopPropagation());
    }
  }
}

window.MiniAlert = MiniAlert; // 외부에서 접근 가능하게