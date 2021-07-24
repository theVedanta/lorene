const quantity = document.querySelector("input[name='quantity']");
function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}
if (quantity) {
  quantity.setAttribute("onkeypress", "return isNumberKey(event)");
}

// vars
let isTax = false;
let isDis = false;
let tax = 0;
let discount = 0;
let price = 0;

if (document.querySelector("#tax")) {
  tax = parseInt(document.querySelector("#tax").textContent);
  isTax = true;
}
if (document.querySelector("#disc")) {
  discount = parseInt(document.querySelector("#disc").textContent);
  isDis = true;
}
if (document.querySelector("#price")) {
  price = parseInt(document.querySelector("#price").textContent);
}
let total = parseInt(document.querySelector("#total").textContent);

if (quantity) {
  quantity.addEventListener("keyup", () => {
    if (quantity.value === "") {
      quantity.value = "0";
    } else if (quantity.value.charAt(0) === "0") {
      if (quantity.value.charAt(1) !== "") {
        quantity.value = quantity.value.substr(1);
      }
    }

    let totalPrice = 0;
    totalPrice = price * parseInt(quantity.value);

    if (isDis) {
      let disAmount = (discount / 100) * totalPrice;
      totalPrice -= disAmount;
    }

    if (isTax) {
      let taxAmount = (tax / 100) * totalPrice;
      totalPrice += taxAmount;
    }

    document.querySelector("#total").textContent = totalPrice;
  });
}

let cp = document.querySelector("#cp");
if (cp) {
  cp.addEventListener("keyup", () => {
    if (cp.value === "") {
      cp.value = "0";
    } else if (cp.value.charAt(0) === "0") {
      if (cp.value.charAt(1) !== "") {
        cp.value = cp.value.substr(1);
      }
    } else if (parseInt(cp.value) > 9999999999) {
      cp.value = 9999999999;
    }

    let totalPrice = 0;
    totalPrice = parseInt(cp.value);

    if (isTax) {
      let taxAmount = (tax / 100) * totalPrice;
      totalPrice += taxAmount;
    }

    document.querySelector("#total").textContent = totalPrice;
  });
}
