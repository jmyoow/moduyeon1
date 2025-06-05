export default function Menu({ appElem, state, onClick }) {
  this.state = state;
  this.onClick = onClick;

  this.container = document.createElement('div');
  this.container.classList.add('menu');
  appElem.appendChild(this.container);

  this.template = () => {
    return `
      <a class="menu-item" href="#" id="posts">게시물</a>
      <a class="menu-item" href="#" id="comments">댓글</a>
      <a class="menu-item" href="#" id="albums">앨범</a>
      <a class="menu-item" href="#" id="todos">할일</a>
      <a class="menu-item" href="#" id="users">사용자</a>
    `;
  }

  this.render = () => {
    this.container.innerHTML = this.template();

    const currentMenu = document.getElementById(this.state);
    if (currentMenu) currentMenu.classList.add('active');

    this.container.querySelectorAll('.menu-item').forEach(menuItem => {
      menuItem.addEventListener('click', e => {
        e.preventDefault();
        this.onClick(menuItem.id);
      });
    });
  };

  this.setState = state => {
    this.state = state;
    this.render();
  };

  this.render();
}