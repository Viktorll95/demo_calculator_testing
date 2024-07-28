"use strict";

// const btn0 = document.querySelector(".btn__0");
// const btn1 = document.querySelector(".btn__1");
// const btn2 = document.querySelector(".btn__2");
// const btn3 = document.querySelector(".btn__3");
// const btn4 = document.querySelector(".btn__4");
// const btn5 = document.querySelector(".btn__5");
// const btn6 = document.querySelector(".btn__6");
// const btn7 = document.querySelector(".btn__7");
// const btn8 = document.querySelector(".btn__8");
// const btn9 = document.querySelector(".btn__9");

const numBtn = document.querySelectorAll(".num__btn");

const btnAdd = document.querySelector(".btn__add");
const btnSub = document.querySelector(".btn__sub");
const btnMult = document.querySelector(".btn__mult");
const btnDiv = document.querySelector(".btn__Div");
const btnCalc = document.querySelector(".btn__calc");
const btnC = document.querySelector(".btn__c");
const btnDot = document.querySelector(".btn__dot");

const userInput = document.querySelector(".user__input");
// const displCalcs = document.querySelector(".display__calculations");

// Formats all of the buttons in the same way
const allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
  btn.classList.add("format-btn");
}

// Selects all number button from 0-9 and adds an event listener to button 'i'
// Adds the number of the pressed button to the "userInput" field
for (let i = 0; i < 10; i++) {
  document.querySelector(`.btn__${i}`).addEventListener("click", function () {
    userInput.value += i;
  });
}

// Select all operation buttons and adds an event listener
const btnsOp = document.querySelectorAll(".btn__op");
for (let btnOp of btnsOp) {
  btnOp.addEventListener("click", function () {
    // Check if the previous sign is numerical. And if it isn't, no number should be able to enter.
    const lastInpt = userInput.value.split("")[userInput.value.length - 1];
    if (
      ["+", "-", "*", "/"].includes(lastInpt) ||
      (userInput.value.length === 0 &&
        ["+", "*", "/"].includes(btnOp.textContent))
    ) {
    } else {
      userInput.value += btnOp.textContent;
    }
  });
}
/////////////////////////////////////////
const lastIncludesOperations = function () {
  const lastInpt = userInput.value.split("")[userInput.value.length - 1];
  return ["+", "-", "*", "/"].includes(lastInpt);
};

// Removes all content from the display
btnC.addEventListener("click", function () {
  userInput.value = "";
});

// Here goes all the calculations
btnCalc.addEventListener("click", function () {
  userInput.value = calculate(userInput.value);
});

btnDot.addEventListener("click", function () {
  // console.log(userInput.value[userInput.value.length - 1]);

  //The bool checks if the last inputed symbol is a number
  //TODO: The second bool should split the inputed value into just groups of numbers (should be splitted on operation) and it should check the last line of strings and if it contains a dot ('.') then the dot should not be added to the value.
  const userInputNumArr = userInput.value.match(/-?\d+(\.\d+)?/g);

  console.log(userInputNumArr);
  if (
    !lastIncludesOperations() &&
    !userInputNumArr[userInputNumArr.length - 1].includes(".")
  )
    userInput.value += ".";
});

///////////////////////////////////////////////////////////////
// The code that does the actual calculations:
// const example = "20+10+20*10*20/10-5-4*20/4"; // Expected output: 405
const example = "10+10*10*10-10*11"; // Expected output: 405

const calculate = function (numStr) {
  const multiRdy = numStr
    .split("+")
    .join("_+_")
    .split("-")
    .join("_-_")
    .split("/")
    .join("_/_")
    .split("_");

  const postMulti = multiRdy
    .map((num) => {
      if (["+", "-", "/"].includes(num)) return num;
      else return num.split("*").reduce((prod, num) => prod * Number(num), 1);
    })
    .join("");

  const divReady = postMulti
    .split("+")
    .join("_+_")
    .split("-")
    .join("_-_")
    .split("_");

  const postDiv = divReady.map((num) => {
    if (["+", "-"].includes(num)) return num;
    else {
      const numArr = num.split("/");
      if (numArr.length === 1) return num;
      else {
        return numArr.reduce((quot, num, i) => {
          if (i === 0) {
            quot = num;
            return quot;
          } else {
            return quot / num;
          }
        }, 0);
      }
    }
  });

  const postSub = postDiv.map((num, i, arr) => {
    let n = "";
    if (!["+", "-"].includes(num)) {
      n = Number(num);
      if (arr[i - 1] === "-") return n * -1;
      else return num;
    } else return num;
  });

  let summary = 0;

  const final = postSub.reduce((sum, num) => {
    if (["+", "-"].includes(num)) return sum;
    else {
      summary += Number(num);
      sum += Number(num);
      return sum;
    }
  }, 0);

  return final;
};
/////////////////////////////////////

const prioPerant = function (numStr) {
  return numStr
    .split("(")
    .join("_(_")
    .split(")")
    .join("_)_")
    .split("_")
    .filter((num) => num !== "")
    .reduce((numArr, expr, i, arr) => {
      if ((arr[i - 1] === "(", arr[i + 1] === ")")) {
        numArr.push(calculate(expr));
      } else if (expr === "(" || expr === ")") {
      } else {
        numArr.push(expr);
      }
      return numArr;
    }, [])
    .join("");
};

console.log(prioPerant("(432+321)*3+32-2"));
