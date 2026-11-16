"use strict";

const slider = document.querySelector("#ratio");
const percentage = document.querySelector("#ratio-value");
const price = document.querySelector("#off-peak");
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function updateDemo() {
  const ratio = Number(slider.value);
  percentage.textContent = `${ratio}%`;
  price.replaceChildren(document.createTextNode(currency.format(1.5 * ratio / 100)));
  const unit = document.createElement("span");
  unit.textContent = "/kWh";
  price.append(unit);
  slider.setAttribute("aria-valuetext", `${ratio}% da tarifa de ponta`);
}

slider.addEventListener("input", updateDemo);
updateDemo();
