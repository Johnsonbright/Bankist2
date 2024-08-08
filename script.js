'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Victor Eke',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';
// Sorting
  const sortmovs = sort ? movements.slice().sort((a,b) => a - b) : movements;
  
  sortmovs.forEach(function (mov, i){
  const type = (mov > 0) ? 'deposit' : 'withdrawal';
 const html = 
        ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1}  ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`

        containerMovements.insertAdjacentHTML('afterbegin', html)
});
}


// reduce method

const createDisplayBal = function(accs){
  accs.balance = accs.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent= `${accs.balance}€`;

};


// chaining methods on the in, out and interest
const calcDisplaySummary = function(accs) {
  const incomes = accs.movements.filter((acc)=> acc > 0).reduce((acc,cur)=> acc + cur,0);
  const expenses = accs.movements.filter((acc) => acc < 0).reduce((acc,cur) => acc + cur, 0);
  const interest = accs.movements.filter((deposit) => deposit >  0)
  .map((deposit) => deposit * accs.interestRate/100)
  .filter((int,i,arr) =>{ 
    return int >= 1})
  .reduce((acc,int) => acc + int,0);


  labelSumIn.textContent = `${Math.ceil(incomes)}€`;
  labelSumOut.textContent = `${Math.abs(Math.trunc(expenses))}€`;
  labelSumInterest.textContent = `${Math.trunc(interest)}€`;
}


// creating username
const createUsername = function(accs) {
  accs.forEach((acc)=> {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name.at(0)).join('');
  });
};
createUsername(accounts);

const updateUI = function(accs) {
  // Display Movements
  displayMovements(accs.movements);
// Display Balance
  createDisplayBal(accs);

  // Display summary
  calcDisplaySummary(accs);
};

let currentAccount;
btnLogin.addEventListener('click', function(e) {
e.preventDefault();


currentAccount= accounts.find(acc => acc.username === inputLoginUsername.value);


if (currentAccount?.pin === Number(inputLoginPin.value )) {
 
 // welcome message
 labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  // Opacity = 100 for visibility
  containerApp.style.opacity = 100;
  // empty  log-in info 
  inputLoginUsername.value = inputLoginPin.value = '';
inputLoginPin.blur();

// update UI
updateUI(currentAccount);

};

});

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
const amount = Number(inputTransferAmount.value);
const receiver = accounts.find(acc => 
  acc.username === inputTransferTo.value
) ;


if(amount > 0 && currentAccount.balance >= amount && receiver && receiver?.username !== currentAccount.username ) {

  // Doing the transfer
currentAccount.movements.push(-amount);
receiver.movements.push(amount);

//updated UI
updateUI(currentAccount);

inputTransferAmount.value = inputTransferTo.value = ''
};


});

// Loan button 
btnLoan.addEventListener('click',function(e) {
e.preventDefault();

const amount = Number(inputLoanAmount.value);

if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
// Add Movement
currentAccount.movements.push(amount);

  // Update UI
  updateUI(currentAccount);

  // empty input
  inputLoanAmount.value = '';
}

})

// Close Button
btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  const closeUserName = accounts.find(acc => acc.username === inputCloseUsername.value);
  const closePin = accounts.find(acc => acc.pin === Number(inputClosePin.value));

  if (closeUserName && closePin) {

    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    // Delete Account
    accounts.splice(index, 1)

    //Hide UI
    containerApp.style.opacity = 0;


  }
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
 
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// LECTURES

const movements = [200,450,-400,3000,-650,-130,70,1300];
const eurToUsd = 1.1;



// Empty arrays * Fill Method
const arr = [1,2,3,4,5,6,7];
console.log(new Array(2,4,6,8,10,12,14))
arr.fill(23,3,5);
console.log(arr);


const x = new Array(8);
console.log(x);
x.fill(1,1,5);
console.log(x);

//Array.from
// const y = Array.from({length:10}, ()=> 2);
// console.log(y);

// const z = Array.from({length: 5}, (_,i) => i + 1);
// console.log(z)

// const random  = Array.from({length:2}, (curr,_) =>  Math.random(curr) * 100 );
// console.log(random);

labelBalance.addEventListener('click', function(e) {const movementUI = Array.from( document.querySelectorAll('.movements__value'),el => Number(el.textContent.replace(`€`, '') )
);
console.log(movementUI);
});

// looking for a deposit that is greater than or equal to 1000
const numDeposits = accounts.flatMap(acc => acc.movements )
.reduce((count,cur) => (cur >= 1000 ? count + 1 : count ), 0);
console.log(numDeposits);

//Prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

// EXAMPLE
// const {deposit, withdrawal} = accounts.flatMap(acc=> acc.movements ).reduce((summary, mov)=> {
//   // mov > 0 ? summary.deposit += mov : summary.withdrawal += mov;
//   summary[mov > 0 ? 'deposit' : 'withdrawal'] += mov
//   return summary;
// }, {deposit: 0, withdrawal: 0});

// console.log(deposit, withdrawal);

// //  EXAMPLE
// const convertTitleCase = function(title) {
// const capitalize = str => str[0].toUpperCase() + str.slice(1)

//   const exemptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

//   const titleCase = title.toLowerCase().split(' ').map(word => exemptions.includes(word) ? word : capitalize(word)).join(' ')  ;
//   return capitalize(titleCase)
// };
// console.log(convertTitleCase('this is a nice title'))
// console.log(convertTitleCase('this is a LONG title'))
// console.log(convertTitleCase('and here is another title with an EXAMPLE'))


//QUIZ
const dogs = [
  {weight: 22, curFood: 250, owners: ['Alice', 'Bob']},
  {weight: 8, curFood: 200, owners: ['Matilda']},
  {weight: 13, curFood: 275, owners: ['Sarah', 'John']},
  {weight: 32, curFood: 340, owners: ['Michael']},
];

//1.
  dogs.forEach(dog => { ;
    dog.recommendFood = Math.trunc(dog.weight ** 0.75 * 28)}
  )
console.log(...dogs);

//2.
 const sarahDog = dogs.find(dog => dog.owners
.includes('Sarah'));

console.log(sarahDog);
console.log(`Sarah's Dog is eating too ${sarahDog.curFood > sarahDog.recommendFood ? 'much': 'little'}`)
// 3
const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recommendFood).flatMap(dog => dog.owners)
console.log(ownersEatTooMuch)

const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recommendFood).flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

//4.

console.log(`${ownersEatTooMuch.join(' and ')}'s dog eats too much` );

console.log(`${ownersEatTooLittle.join(' and ')}'s dog eats too little` );


//5.
console.log(dogs.some(dog=> dog.recommendFood === dog.curFood ));

const checkEatingOkay = (dog => dog.curFood >   dog.recommendFood * 0.90  && dog.curFood < dog.recommendFood * 1.10);
//6.
console.log(dogs.some(checkEatingOkay))

//7.
const dogEatingOkay = dogs.filter(checkEatingOkay);
console.log(dogEatingOkay);

// 8.
const sortRecommended = dogs.slice().sort((a,b)=> a.recommendFood- b.recommendFood) ;

console.log(sortRecommended)
// LECTURES

