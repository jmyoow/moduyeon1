import Menu from './components/Menu.js';
import Content from './components/Content.js';
import { request } from './components/api.js';

// 메인 애플리케이션 컴포넌트
export default function App(appElem) {
  // 애플리케이션의 전체 상태를 관리
  this.state = {
    currentMenu: window.location.pathname.split('/').pop() || 'posts', // 현재 선택된 메뉴
    items: [], // API에서 가져온 데이터
    limit: 10 // 한 번에 가져올 데이터 개수
  };

  // 메뉴 컴포넌트 초기화
  const menu = new Menu({
    appElem,
    initialState: '',
    onClick: async (menuName) => {
      // 메뉴 클릭 시 URL을 변경하고 데이터를 업데이트합니다
      history.pushState(null, `${menuName}`, menuName);
      this.updateContent(menuName);
    }
  });

  // 콘텐츠 컴포넌트 초기화
  const content = new Content({
    appElem,
    initialState: []
  });

  // 상태 업데이트 함수
  this.setState = (state) => {
    this.state = state;
    menu.setState(this.state.currentMenu);
    content.setState(this.state.items);
  };

  // 콘텐츠 업데이트 함수
  this.updateContent = async (menuName) => {
    const items = await request(menuName, this.state.limit);
    this.setState({
      ...this.state,
      currentMenu: menuName,
      items
    });
  };

  // 브라우저 뒤로가기/앞으로가기 처리
  window.addEventListener('popstate', async e => {
    this.updateContent(window.location.pathname.split('/').pop() || 'posts');
  });

  // 초기 데이터 로드
  const init = async () => {
    try {
      this.updateContent(this.state.currentMenu);
    } catch (error) {
      console.error('초기화 에러:', error);
    }
  };

  init();
}