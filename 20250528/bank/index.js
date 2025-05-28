import BankAccount from './BankAccount.js';

const account = new BankAccount(loadBalance());

const amountInput = document.getElementById('amount-input');
const depositBtn = document.getElementById('deposit-btn');
const withdrawBtn = document.getElementById('withdraw-btn');
const balance = document.getElementById('balance');
const log = document.getElementById('log');

function addLog(text) {
  const li = document.createElement('li');
  const now = new Date();
  const time = now.toLocaleTimeString();
  li.textContent = `[${time}] ${text}`;
  // log.append(li);
  log.prepend(li);
}

function updateBalance() {
  const amount = account.getBalance();
  balance.innerHTML = `현재 잔액: ${amount.toLocaleString()}원`;
  saveBalance(amount);
}

function saveBalance(amount) {
  localStorage.setItem('myBalance', amount);
}

function loadBalance() {
  return localStorage.getItem('myBalance')*1 || 0;
}

depositBtn.addEventListener('click', () => {
  const amount = amountInput.value*1; // 숫자로 변환
  account.deposit(amount);
  updateBalance();
  addLog(`${amount} 입금`);
  amountInput.value = '';
});

withdrawBtn.addEventListener('click', () => {
  const amount = amountInput.value*1; // 숫자로 변환
  account.withdraw(amount);
  updateBalance();
  addLog(`${amount} 출금`);
  amountInput.value = '';
});

updateBalance();