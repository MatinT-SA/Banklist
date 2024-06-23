/***** Mock Data ********/
const account1 = {
    client: 'Matin Taherzadeh',
    pin: 1234,
    interestRate: 1.2,
    transactions: [500, -200, 1500, -700, 800, 250, -100, 1300],
};

const account2 = {
    client: 'Roger Federer',
    pin: 1235,
    interestRate: 1.5,
    transactions: [7000, -3000, 4500, -1500, 2000, -1200, 1000, -500],
};

const account3 = {
    client: 'Rafael Nadal',
    pin: 1236,
    interestRate: 0.7,
    transactions: [100, -500, 800, -400, 250, -50, 700, -300],
};

const account4 = {
    client: 'Novak Djokovic',
    pin: 1237,
    interestRate: 1,
    transactions: [300, 900, -200, 400, 150, -100, 800, 50],
};

const accounts = [account1, account2, account3, account4];

const labelIntroSentence = document.querySelector('.intro-sentence');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelOverviewIn = document.querySelector('.overview__value--in');
const labelOverviewOut = document.querySelector('.overview__value--out');
const labelOverviewInterest = document.querySelector('.overview__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLogins = document.querySelectorAll('.login__input');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const errorMessage = document.querySelector('.error-message');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/***** Display Error message ********/
const showErrorMessage = function (message) {
    errorMessage.innerHTML = `<i class="fa-solid fa-times-circle error-icon"></i> ${message}`;
    errorMessage.classList.add('visible');

    setTimeout(() => {
        errorMessage.classList.remove('visible');
    }, 3000);
};

/***** Hide Error message ********/
const hideErrorMessage = function () {
    errorMessage.classList.remove('visible');
};

/***** Displaying Transactions ********/
const displayTransactions = function (transactions) {
    containerTransactions.innerHTML = '';

    transactions.forEach(function (tran, i) {
        const type = tran > 0 ? 'deposit' : 'withdrawal';
        const html = `
            <div class="transactions__row">
                <div class="transactions__type transactions__type--${type}">${i + 1} ${type}</div>
                <div class="transactions__value">${tran}</div>
            </div>
        `;
        containerTransactions.insertAdjacentHTML('afterbegin', html);
    })
}

/***** Displaying Balance ********/
const displayBalance = function (accounts) {
    const balanceAcc = accounts.reduce((acc, cur) => acc + cur);
    labelBalance.textContent = `${balanceAcc} $`;
}

/***** Displaying Overview ********/
const calcDisplayOverview = function (accs) {
    const income = accs.transactions
        .filter(tran => tran > 0)
        .reduce((acc, tran) => acc + tran, 0);

    const outcome = Math.abs(accs.transactions
        .filter(tran => tran < 0)
        .reduce((acc, tran) => acc + tran, 0));

    // in our Banklist, only interests more than 4% will be considered as a user's total interest amount
    const interest = accs.transactions
        .filter(tran => tran > 0)
        .map(dep => (dep * accs.interestRate) / 100)
        .filter(int => int >= 4)
        .reduce((acc, int) => acc + int, 0);

    labelOverviewIn.textContent = `${income} $`;
    labelOverviewOut.textContent = `${outcome} $`;
    labelOverviewInterest.textContent = `${interest} $`;
}

/***** Username ********/
const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.client
            .toLowerCase()
            .split(" ")
            .map(word => word[0]
            ).join("");
    });
};

createUsernames(accounts);

/***** Login ********/
let currentAccount;

btnLogin.addEventListener('click', function (e) {
    e.preventDefault();

    hideErrorMessage(); // Hide error message initially

    // Check username
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

    if (!currentAccount) {
        // Show error message if username doesn't exist
        showErrorMessage('Username doesn\'t exist');
        return; // Exit function early
    }

    // Continue with PIN validation if username exists
    if (currentAccount.pin === Number(inputLoginPin.value)) {
        const firstName = currentAccount.client.split(' ')[0];
        labelIntroSentence.textContent = (currentAccount.username === 'rn') ? `Hey, Rafa!` : `Hello Again, ${firstName}`;

        containerApp.style.opacity = 1;

        inputLogins.forEach(input => {
            input.value = '';
            input.blur();
        });

        displayTransactions(currentAccount.transactions);
        displayBalance(currentAccount.transactions);
        calcDisplayOverview(currentAccount);
    } else {
        // Show error message if PIN is incorrect
        showErrorMessage('The PIN is incorrect');
    }
});
