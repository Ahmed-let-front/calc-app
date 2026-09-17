const elements = {
  app: document.querySelector("main"),
  calculatorScreen: document.querySelector(".calculator__screen"),
  operators: ["+", "-", "/", "x"],
};
const ToggleTheme = (e) => {
  const targetEl = e.target.closest(".theme-toggle__number");
  if (!targetEl) return;
  const theme = targetEl.dataset.theme;
  const lastTheme = elements.app.getAttribute("data-theme");
  if (lastTheme === theme) return;
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
  if (key !== "=") return;
  const result = eval(returnExp());
  const finalRes = Number(result.toFixed(10));
  clearScreen();
  renderOnScreen(finalRes);
};
const delOperation = (key) => {
  if (key !== "del") return;
  const lastEl = elements.calculatorScreen.lastElementChild;
  if (elements.operators.includes(lastEl.textContent)) return;
  if (lastEl.textContent.length === 1) return;
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
  console.log(key);
};
const handleDocumentClick = () => {
  document.addEventListener("click", (e) => {
    ToggleTheme(e);
    handleKeyDelegation(e);
  });
};
const init = () => {
  handleDocumentClick();
};
init();
