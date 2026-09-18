import { parse, eval as evaluateExpression } from 'expression-eval';
const elements = {
  app: document.querySelector('main'),
  calculatorScreen: document.querySelector('.calculator__screen'),
  operators: ['+', '-', '/', 'x'],
  theme: 0,
  themeToggle: document.querySelector('.theme-toggle'),
};
const storeThemeLocalStorage = newVal => {
  localStorage.setItem('theme', newVal.toString());
};
const delAnyInputCheked = () => {
  const inpts = document.querySelectorAll('input[name="theme"]');
  inpts.forEach(el => (el.checked = false));
};
const getThemeLocalStorage = () => {
  const newTheme = localStorage.getItem('theme');
  if (!newTheme) return;
  elements.theme = newTheme;
  delAnyInputCheked();
  const inputToCheck = document.querySelector(`input[name="theme"][value="${elements.theme}"]`);
  inputToCheck.checked = true;
};
const setTheme = () => {
  getThemeLocalStorage();
  const lastTheme = elements.app.getAttribute('data-theme');
  if (elements.theme === lastTheme) return;
  elements.app.setAttribute('data-theme', elements.theme);
};
const ToggleTheme = e => {
  const targetEl = e.target;
  const theme = targetEl.value;
  const lastTheme = elements.app.getAttribute('data-theme');
  if (lastTheme === theme) return;
  storeThemeLocalStorage(theme);
  elements.app.setAttribute('data-theme', theme);
};
const renderOnScreen = key => {
  const regex = /[0-9]/;
  const lastEl = elements.calculatorScreen.lastElementChild;
  const lastText = lastEl?.textContent || '';
  const arrRes = Array.from(elements.calculatorScreen.children, el => el.textContent);
  if (elements.operators.includes(key)) {
    if (elements.operators.includes(lastText)) {
      lastEl.textContent = key;
      return;
    }
    if (arrRes.length >= 3) {
      arrRes.pop();
      equalOperation('=');
      renderOnScreen(key);
      return;
    }
    const elText = `<span class="calculator__screen-text-operators">${key}</span>`;
    elements.calculatorScreen.insertAdjacentHTML('beforeend', elText);
    return;
  }
  if (lastText.includes('.') && key === '.') return;
  if (lastText === '0' && regex.test(key)) {
    lastEl.textContent = key;
    return;
  }
  if (elements.operators.includes(lastText)) {
    const elText = `<span class="calculator__screen-text">${key}</span>`;
    elements.calculatorScreen.insertAdjacentHTML('beforeend', elText);
  } else {
    lastEl.textContent += key;
  }
};
const clearScreen = () => {
  Array.from(elements.calculatorScreen.children).forEach(el => {
    el.remove();
  });
  elements.calculatorScreen.innerHTML = `<span class="calculator__screen-text">0</span>`;
};
const returnExp = () => {
  const arrRes = Array.from(elements.calculatorScreen.children, el => {
    if (el.textContent === 'x') el.textContent = '*';
    return el.textContent;
  });
  if (arrRes.length === 2) arrRes.push(arrRes[0]);
  return arrRes;
};
const equalOperation = key => {
  if (key !== '=' && key !== 'Enter') return;
  const res = returnExp();
  if (res.length === 1) return;
  const ast = parse(res.join(''));
  const result = evaluateExpression(ast);
  const finalRes = Number(result.toFixed(10));
  clearScreen();
  renderOnScreen(finalRes);
};
const delOperation = key => {
  if (key !== 'del' && key !== 'Backspace') return;
  const nums = Array.from(elements.calculatorScreen.children);
  const lastEl = elements.calculatorScreen.lastElementChild;
  if (lastEl.textContent.length === 1 && nums.length === 1) clearScreen();
  if (elements.operators.includes(lastEl.textContent) || lastEl.textContent.length === 1) {
    lastEl.remove();
    return;
  }
  lastEl.textContent = lastEl.textContent.slice(0, lastEl.textContent.length - 1);
};
const handleKeyDelegation = e => {
  const targetEl = e.target.closest('.key');
  if (!targetEl) return;
  const key = targetEl.dataset.num;
  const lookupKeys = {
    '=': equalOperation,
    del: delOperation,
    reset: clearScreen,
  };
  if (lookupKeys[key]) lookupKeys[key](key);
  else renderOnScreen(key);
};
const handleDocumentClick = () => {
  document.addEventListener('click', e => {
    handleKeyDelegation(e);
  });
};
const handleTheme = () => {
  elements.themeToggle.addEventListener('change', ToggleTheme);
};
const hoverOnEl = key => {
  if (key === 'Enter') key = '=';
  if (key === 'Backspace') key = 'del';
  const btn = document.querySelector(`[data-num="${key}"]`);
  btn.classList.add('animate-mark');
  setTimeout(() => {
    btn.classList.remove('animate-mark');
  }, 200);
};
const handleKeyPress = () => {
  document.addEventListener('keydown', e => {
    const key = e.key === '*' ? 'x' : e.key;
    const regex = /^([0-9.+\-\/x=]|Backspace|Enter)$/;
    if (!regex.test(key)) return;
    if (key === 'Enter') e.preventDefault();
    const lookupKeys = {
      '=': equalOperation,
      Enter: equalOperation,
      Backspace: delOperation,
      reset: clearScreen,
    };
    if (lookupKeys[key]) lookupKeys[key](key);
    else renderOnScreen(key);
    hoverOnEl(key);
  });
};
const init = () => {
  setTheme();
  handleDocumentClick();
  handleKeyPress();
  handleTheme();
};
init();
