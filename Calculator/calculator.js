const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let currentInput = "";
let shouldResetDisplay = false;

function updateDisplay() {
  display.value = currentInput || "0";
}

function clear() {
  currentInput = "";
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    // Replace display symbols with actual operators
    let expression = currentInput
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");
    
    // Prevent empty or invalid expressions
    if (!expression || /[+\-*/.]$/.test(expression)) {
      return;
    }
    
    // Safe evaluation
    const result = Function('"use strict"; return (' + expression + ')')();
    
    // Handle division by zero and invalid results
    if (!isFinite(result)) {
      currentInput = "Error";
    } else {
      // Round to avoid floating point issues
      currentInput = parseFloat(result.toFixed(10)).toString();
    }
    
    shouldResetDisplay = true;
  } catch (error) {
    currentInput = "Error";
    shouldResetDisplay = true;
  }
  updateDisplay();
}

function appendValue(value) {
  // Reset after equals
  if (shouldResetDisplay && !isOperator(value)) {
    currentInput = "";
  }
  shouldResetDisplay = false;
  
  // Prevent multiple operators in a row
  if (isOperator(value) && isOperator(currentInput.slice(-1))) {
    currentInput = currentInput.slice(0, -1) + value;
    updateDisplay();
    return;
  }
  
  // Prevent multiple decimals in one number
  if (value === ".") {
    const parts = currentInput.split(/[+\-*/×÷]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes(".")) return;
  }
  
  // Prevent leading zeros
  if (value === "0" && currentInput === "0") return;
  
  currentInput += value;
  updateDisplay();
}

function isOperator(char) {
  return ["+", "-", "*", "/", "×", "÷"].includes(char);
}

// Button clicks
buttons.forEach(button => {
  button.addEventListener("click", function() {
    const value = this.getAttribute("data-value");
    
    switch(value) {
      case "C":
        clear();
        break;
      case "DEL":
        deleteLast();
        break;
      case "=":
        calculate();
        break;
      default:
        appendValue(value);
    }
  });
});

// Keyboard support
document.addEventListener("keydown", function(e) {
  const key = e.key;
  
  if (/[0-9.]/.test(key)) {
    e.preventDefault();
    appendValue(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    e.preventDefault();
    appendValue(key);
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    e.preventDefault();
    deleteLast();
  } else if (key === "Escape") {
    e.preventDefault();
    clear();
  } else if (key === "(" || key === ")") {
    e.preventDefault();
    appendValue(key);
  }
});

// Initialize
updateDisplay();