import { Car, PoliceCar } from './Car.js';

// const road = document.querySelector('.road');

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