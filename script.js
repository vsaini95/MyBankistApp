"using strict";
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-07-26T17:01:17.194Z",
    "2023-07-28T23:36:17.929Z",
    "2023-07-30T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

/*const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, -50, 90],
  interestRate: 1,
  pin: 4444,
};*/

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//Creating usernames******************************************************
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((mov) => mov[0])
      .join("");
  });
};
createUsername(accounts);

//formatdates**************************************************
const formatDate = function (newdate) {
  //days calculate
  const CalcdaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));
  const daysPassed = CalcdaysPassed(new Date(), newdate);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yestarday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const dt = `${newdate.getDate()}`.padStart(2, 0);
    const month = `${newdate.getMonth() + 1}`.padStart(2, 0);
    return `${dt}/${month}/${newdate.getFullYear()}`;
  }
};

//set timer*************************************************
let timer, time;
const startLogouttimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      labelWelcome.textContent = `Login to get started`;
      containerApp.style.opacity = 0;
      clearInterval(timer);
    }
    time--;
  };
  //set time
  time = 5 * 60;
  tick();
  //call timer every sec
  timer = setInterval(tick, 1000);
  return timer;
};

//displaying movements**************************************************
const diaplayMovments = function (acc, sort = false) {
  containerMovements.innerHTML = " ";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    console.log(mov);

    const newdate = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(newdate);

    let html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//calculate balalnce**********************************************************
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

const eurToUsd = 1.1;
//calculate summary************************************************************
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((cur) => cur > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} €`;

  const outcomes = acc.movements
    .filter((cur) => cur < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outcomes.toFixed(2))} €`;

  const interest = acc.movements
    .filter((cur) => cur > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((cur) => cur >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};

//const deposits = movements.filter((mov) => mov > 0);
//const withdrawals = movements.filter((mov) => mov < 0);

//Total Balance**************************************************************
//const balance = movements.reduce((acc, cur) => acc + cur, 0);
//console.log(balance);
//const account = accounts.find((acc) => acc.owner === "Sarah Smith");
//console.log(account);

//update values***************************************************************
const updateUI = function (currentAccount) {
  //display movements
  diaplayMovments(currentAccount);
  //display summary
  calcDisplaySummary(currentAccount);
  //display balance
  calcDisplayBalance(currentAccount);
};

//Implementing form**********************************************************

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;
    //set date

    const now = new Date();
    const date = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${date}/${month}/${now.getFullYear()}, ${hour}:${min}`;

    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    //checking if there is already a timer
    if (timer) clearInterval(timer);
    timer = startLogouttimer();
    updateUI(currentAccount);
  }
});

//Implementing transfer******************************************************
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //transferring ammount
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log(currentAccount);
    //add to movementsDates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    //reset timer
    clearInterval(timer);
    time = startLogouttimer();
  }
});

//requesting loan***************************************************************
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const ammount = +inputLoanAmount.value;
  if (
    ammount > 0 &&
    currentAccount.movements.some((cur) => cur > ammount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(ammount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = "";
  //reset timer
  clearInterval(timer);
  time = startLogouttimer();
});

//closing account***********************************************************
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    let index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});
//sorting functionality
let sortState = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  diaplayMovments(currentAccount, !sortState);
  sortState = !sortState;
});

