export default class BankAccount {
  #balance;
  #maxWithdraw = 10000000;

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount > this.#maxWithdraw) {
      Swal.fire(`1회 출금 한도를 초과했어요(${this.#maxWithdraw}).`);
      throw new Error(`1회 출금 한도를 초과했어요(${this.#maxWithdraw}).`);
    }

    if (amount > this.#balance) {
      // alert('잔액이 부족합니다.');
      Swal.fire("잔액이 부족합니다.");
      // return;
      throw new Error('잔액이 부족합니다.');
    }
    this.#balance -= amount;
  }

  getBalance() {
    return this.#balance;
  }
}
