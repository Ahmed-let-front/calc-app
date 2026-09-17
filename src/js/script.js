import { parse, eval as evaluateExpression } from "expression-eval";
const elements = {
  app: document.querySelector("main"),
  calculatorScreen: document.querySelector(".calculator__screen"),
  operators: ["+", "-", "/", "x"],
  theme: 0,
};
const storeThemeLocalStorage = (newVal) => {
  localStorage.setItem("theme", newVal.toString());
};
const getThemeLocalStorage = () => {
  const newTheme = localStorage.getItem("theme");
  if (!newTheme) return;
  elements.theme = newTheme;
};
const setTheme = () => {
  getThemeLocalStorage();
  const lastTheme = elements.app.getAttribute("data-theme");
  if (elements.theme === lastTheme) return;
  elements.app.setAttribute("data-theme", elements.theme);
};
const ToggleTheme = (e) => {
  const targetEl = e.target.closest(".theme-toggle__number");
  if (!targetEl) return;
  const theme = targetEl.dataset.theme;
  const lastTheme = elements.app.getAttribute("data-theme");
  if (lastTheme === theme) return;
  storeThemeLocalStorage(theme);
  elements.app.setAttribute("data-theme", theme);
};
const renderOnScreen = (key) => {
  const regex = /[0-9]/;
  const lastEl = elements.calculatorScreen.lastElementChild;
  const lastText = lastEl?.textContent || "";
  if (elements.operators.includes(key)) {
    if (elements.operators.includes(lastText)) {
      lastEl.textContent = key;
      return;
    }
    const elText = `<span class="calculator__screen-text-operators">${key}</span>`;
    elements.calculatorScreen.insertAdjacentHTML("beforeend", elText);
    return;
  }
  if (lastText.at(-1) === "." && key === ".") return;
  if (lastText === "0" && regex.test(key)) {
    lastEl.textContent = key;
    return;
  }
  if (elements.operators.includes(lastText)) {
    const elText = `<span class="calculator__screen-text">${key}</span>`;
    elements.calculatorScreen.insertAdjacentHTML("beforeend", elText);
  } else {
    lastEl.textContent += key;
  }
};
const clearScreen = () => {
  Array.from(elements.calculatorScreen.children).forEach((el) => {
    el.remove();
  });
  elements.calculatorScreen.innerHTML = `<span class="calculator__screen-text">0</span>`;
};
const returnExp = () => {
  const arrRes = Array.from(elements.calculatorScreen.children, (el) => {
    if (el.textContent === "x") el.textContent = "*";
    return el.textContent;
  });
  if (arrRes.length === 2) arrRes.push(arrRes[0]);
  return arrRes.join("");
};
const equalOperation = (key) => {
  if (key !== "=" && key !== "Enter") return;
  const ast = parse(returnExp());
  const result = evaluateExpression(ast);
  const finalRes = Number(result.toFixed(10));
  clearScreen();
  renderOnScreen(finalRes);
};
const delOperation = (key) => {
  if (key !== "del" && key !== "Backspace") return;
  const nums = Array.from(elements.calculatorScreen.children);
  const lastEl = elements.calculatorScreen.lastElementChild;
  if (lastEl.textContent.length === 1 && nums.length === 1) clearScreen();
  if (
    elements.operators.includes(lastEl.textContent) ||
    lastEl.textContent.length === 1
  ) {
    lastEl.remove();
    return;
  }
  lastEl.textContent = lastEl.textContent.slice(
    0,
    lastEl.textContent.length - 1,
  );
};
const handleKeyDelegation = (e) => {
  const targetEl = e.target.closest(".key");
  if (!targetEl) return;
  const key = targetEl.dataset.num;
  const lookupKeys = {
    "=": equalOperation,
    del: delOperation,
    reset: clearScreen,
  };
  if (lookupKeys[key]) lookupKeys[key](key);
  else renderOnScreen(key);
};
const handleDocumentClick = () => {
  document.addEventListener("click", (e) => {
    ToggleTheme(e);
    handleKeyDelegation(e);
  });
};
const hoverOnEl = (key) => {
  if (key === "Enter") key = "=";
  if (key === "Backspace") key = "del";
  const btn = document.querySelector(`[data-num="${key}"]`);
  btn.classList.add("animate-mark");
  setTimeout(() => {
    btn.classList.remove("animate-mark");
  }, 200);
};
const handleKeyPress = () => {
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    console.log(key);
    const regex = /[0-9.]+|[\+\-\=\/x*]|Backspace|Enter/;
    if (!regex.test(key)) return;
    const lookupKeys = {
      "=": equalOperation,
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
};
init();
