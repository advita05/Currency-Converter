const BASE_URL = "https://api.frankfurter.dev/v1/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;
    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    }
    if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }
    select.appendChild(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// Flag update
function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
}

// Button click event
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  let amountInput = document.querySelector(".amount input");
  let amount = parseFloat(amountInput.value);

  if (!amount || amount <= 0) {
    amount = 1;
    amountInput.value = "1";
  }

  const fromVal = fromCurr.value;
  const toVal = toCurr.value;

  // Skip conversion if currencies are the same
  if (fromVal === toVal) {
    msg.innerText = `${amount} ${fromVal} = ${amount} ${toVal}`;
    return;
  }

  const url = `${BASE_URL}?amount=${amount}&from=${fromVal}&to=${toVal}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rate = data.rates[toVal];
    const finalAmount = rate;

    msg.innerText = `${amount} ${fromVal} = ${finalAmount.toFixed(2)} ${toVal}`;
  } catch (error) {
    msg.innerText = "Couldn't fetch exchange rate 😞";
    console.error("Error:", error);
  }
});


