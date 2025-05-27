const road = document.querySelector('.road');
// let carY = 0;

// 클래스 정의
class Car {
  static carY = 0;

  constructor(name, type='🚗') {
    this.type = type;
    this.name = name;
    this.x = 0;
    console.log(`${this.name} ${this.type} 생성`);

    this.init();
  }

  init() {
    this.element = document.createElement('span');
    this.element.classList.add('car');
    this.element.style.top = Car.carY + 'px';
    this.element.innerHTML = `
      ${this.type}
      <small class="car-name">${this.name}</small>
    `;
    road.append(this.element);

    Car.carY += 30;

    this.element.addEventListener('click', this.drive.bind(this));
    // bind는 메서드의 호출 객체를 지정하는 역할. 여기서는 this를 사용하도록
    // bind를 사용하지 않으면, 이벤트핸들러로 동작하는 drive 메서드 내부에서 this는 this.element를 가리키게 되는 문제가 있어서 사용했음.
  }

  drive() {
    // console.log(this);
    // console.log(`${this.name} ${this.type} 운행중`);
    this.x += 20;
    this.element.style.transform = `translateX(${-this.x}px)`;
  }
}

class PoliceCar extends Car {
  constructor(name, type='🚓') {
    super(name, type);
    this.element.addEventListener('dblclick', this.chase.bind(this));
  }

  chase() {
    this.x += 100;
    this.element.style.transform = `translateX(${-this.x}px)`;
    console.log(`${this.name} ${this.type} 추격!!!`);
  }
}

// UI 이벤트
const controls = document.querySelector('.controls');
const inputCarName = document.querySelector('.input-car-name');
controls.addEventListener('click', e => {
  // console.log(e.target);
  // console.log(e.target.dataset.type)
  const carName = inputCarName.value ? inputCarName.value : '남의차';

  switch (e.target.dataset.type) {
    case 'car':
      new Car(carName);
      break;
    case 'police-car':
      new PoliceCar(carName);
      break;
  }
});

inputCarName.addEventListener('focus', e => {
  e.target.select();
});