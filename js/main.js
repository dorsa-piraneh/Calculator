/* ========================================================================================
                                     DOM ELEMENTS
======================================================================================== */
const themeBtns = document.querySelectorAll('.theme-btn');
const buttons = document.querySelectorAll('.buttons button');
const expressionDisplay = document.querySelector('.expression-display');
const display = document.querySelector('.display');

/* ========================================================================================
                                     INITIAL STATE
======================================================================================== */

let currentNumber = '0';
let previousNumber = null;
let operator = null;
let shouldResetCurrent = false;

let lastOperator = null;
let lastDigit = null;

const MAX_DIGITS = 9;

/* ========================================================================================
                                      FUNCTIONS
======================================================================================== */
const handleDigits = (digit) => {
  // Start a new number after operator or equal
  if (shouldResetCurrent) {
    currentNumber = digit;
    shouldResetCurrent = false;
    updateDisplay();
    return;
  }

  // Replace initial zero with first digit
  if (currentNumber === '0') {
    currentNumber = digit;
  } else {
    if (currentNumber.replace('.', '').length >= MAX_DIGITS) return;
    currentNumber += digit;
  }
  updateDisplay();
};

const handleOperator = (op) => {
  // یعنی کاربر قبل از این یک عملگر زده است
  if (operator && !shouldResetCurrent) {
    calculate();
  }

  previousNumber = currentNumber;
  operator = op;
  shouldResetCurrent = true;

  expressionDisplay.textContent = `${Number(previousNumber).toLocaleString()} ${operator}`;
};

const calculate = () => {
  let result = 0;

  // First time pressing =
  if (operator && previousNumber != null) {
    const previous = +previousNumber;
    const current = +currentNumber;

    switch (operator) {
      case '+':
        result = previous + current;
        break;

      case '-':
        result = previous - current;
        break;

      case '×':
        result = previous * current;
        break;

      case '/':
        result = previous / current;
        break;

      default:
        return;
    }

    lastOperator = operator;
    lastDigit = current;

    expressionDisplay.textContent = `${previous.toLocaleString()} ${operator} ${current.toLocaleString()} =`;

    // Repeated =
  } else if (lastOperator && lastDigit != null) {
    const current = +currentNumber;

    switch (lastOperator) {
      case '+':
        result = current + lastDigit;
        break;

      case '-':
        result = current - lastDigit;
        break;

      case '×':
        result = current * lastDigit;
        break;

      case '/':
        result = current / lastDigit;
        break;

      default:
        return;
    }

    if (String(current).replace('.', '').length > MAX_DIGITS) {
      expressionDisplay.textContent = `${current.toExponential(4)} ${lastOperator} ${lastDigit.toLocaleString()} =`;
    } else {
      expressionDisplay.textContent = `${current.toLocaleString()} ${lastOperator} ${lastDigit.toLocaleString()} =`;
    }

    // Do nothing if there is no operation to repeat
  } else {
    return;
  }

  currentNumber = String(result);
  previousNumber = null;
  operator = null;
  shouldResetCurrent = true;

  if (currentNumber.replace('.', '').length > MAX_DIGITS) {
    display.textContent = `${Number(currentNumber).toExponential(4)}`;
  } else {
    display.textContent = `${Number(currentNumber).toLocaleString()}`;
  }
};

const handleEqual = () => {
  calculate();
};

const handleClear = () => {
  currentNumber = '0';
  previousNumber = null;
  operator = null;
  shouldResetCurrent = false;

  lastOperator = null;
  lastDigit = null;

  expressionDisplay.textContent = '';
  display.textContent = '0';
};

const handlePercent = () => {
  let current = +currentNumber;
  const previous = previousNumber;

  if (operator === '+' || operator === '-') {
    current = previous * (current / 100);
  } else if (operator === '×' || operator === '/') {
    current = current / 100;
  } else {
    current = current / 100;
  }

  currentNumber = String(current);
  updateDisplay();
};

const handleBackspace = () => {
  if (shouldResetCurrent) return;

  if (currentNumber.length == 1) {
    currentNumber = '0';
  } else {
    currentNumber = currentNumber.slice(0, -1);
  }

  updateDisplay();
};

const handleDecimal = () => {
  if (shouldResetCurrent) {
    currentNumber = '0.';
    shouldResetCurrent = false;
    display.textContent = currentNumber;
  }

  if (!currentNumber.includes('.')) {
    currentNumber += '.';
    display.textContent = currentNumber;
  }
};

const updateDisplay = () => {
  if (currentNumber.includes('.')) {
    display.textContent = currentNumber;
  } else {
    display.textContent = Number(currentNumber).toLocaleString();
  }
};
/* ========================================================================================
                                      EVENT LISTENERS
======================================================================================== */
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;

  themeBtns.forEach((themeBtn) => {
    if (themeBtn.dataset.themeName == savedTheme) {
      themeBtn.classList.add('active');
    }
  });
});

themeBtns.forEach((themeBtn) => {
  themeBtn.addEventListener('click', (event) => {
    const themeName = event.target.closest('.theme-btn').dataset.themeName;

    themeBtns.forEach((btn) => {
      btn.classList.remove('active');
    });
    themeBtn.classList.add('active');

    document.documentElement.dataset.theme = themeName;
    localStorage.setItem('theme', themeName);
  });
});

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    const value = btn.dataset.value;

    switch (type) {
      case 'digit':
        handleDigits(value);
        break;

      case 'operator':
        handleOperator(value);
        break;

      case 'equal':
        handleEqual();
        break;

      case 'clear':
        handleClear();
        break;

      case 'percent':
        handlePercent();
        break;

      case 'backspace':
        handleBackspace();
        break;

      case 'decimal':
        handleDecimal();
        break;

      default:
        return;
    }
  });
});
