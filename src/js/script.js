const elements = {
  app: document.querySelector("main"),
  calculatorScreenText: document.querySelector(".calculator__screen-text"),
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
  elements.calculatorScreenText.textContent += key;
};
const clearScreen = () => {
  elements.calculatorScreenText.textContent = "";
};
const equalOperation = (key) => {
  if (key !== "=") return;
  console.log(elements.calculatorScreenText.textContent);
  const result = eval(elements.calculatorScreenText.textContent);
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
