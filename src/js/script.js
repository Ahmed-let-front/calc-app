const elements = {
  app: document.querySelector("main"),
  calculatorScreen: document.querySelector(".calculator__screen"),
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
  console.log(key);
  const operators = ["+", "-", "/", "x"];
  const regex = /[0-9]/;
  const lastEl = elements.calculatorScreen.lastElementChild;
  const lastText = lastEl?.textContent || "";
  if (operators.includes(key)) {
    const elText = `<span class="calculator__screen-text-operators">${key}</span>`;
    elements.calculatorScreen.insertAdjacentHTML("beforeend", elText);
    return;
  }
  if (lastText.at(-1) === "." && key === ".") return;
  if (lastText === "0" && regex.test(key)) {
    lastEl.textContent = key;
    return;
  }
  if (operators.includes(lastText)) {
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
  return Array.from(
    elements.calculatorScreen.children,
    (el) => el.textContent,
  ).join("");
};
const equalOperation = (key) => {
  if (key !== "=") return;
  const result = eval(returnExp());
  const finalRes = Number(result.toFixed(10));
  clearScreen();
  renderOnScreen(finalRes);
};
const handleKeyDelegation = (e) => {
  const targetEl = e.target.closest(".key");
  if (!targetEl) return;
  const key = targetEl.dataset.num;
  const lookupKeys = {
    "=": equalOperation,
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
