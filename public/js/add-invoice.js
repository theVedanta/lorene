document.querySelector("#makeTax").addEventListener("click", async () => {
  if (document.querySelector(".add-tax input[name='name']").value !== "") {
    const res = await fetch(`https://lorenepay.com/tax/add`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: document.querySelector(".add-tax input[name='name']").value,
        offer: document.querySelector(".add-tax input[name='offer']").value,
      }),
    });
    const data = await res.json();
    if (data.done) {
      location.reload();
    }
  } else {
    document.querySelector(".add-tax p").textContent = "Please fill all fields";
  }
});
document.querySelector("#taxCreate").addEventListener("click", () => {
  document.querySelector(".add-tax").classList.add("add-tax-active");
  document.querySelector(".wrapper").classList.add("wrapper-active");
});
document.querySelector(".add-tax i").addEventListener("click", () => {
  document.querySelector(".add-tax").classList.remove("add-tax-active");
  document.querySelector(".wrapper").classList.remove("wrapper-active");
});

for (let inp of document.querySelectorAll("input[type='number']")) {
  inp.setAttribute("onkeypress", "return isNumberKey(event)");
}

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}

let sub = document.querySelector("#subtot");
let dis = document.querySelector("input[name='discount']");
let total = document.querySelector("#total");

const tx = (event) => {
  let subTot = 0;

  for (let priceInp of document.querySelectorAll("input[name='itemPrice']")) {
    subTot +=
      parseInt(priceInp.value) *
      parseInt(
        priceInp.parentElement.parentElement.nextElementSibling.children[0]
          .children[1].value
      );
  }

  sub.textContent = Math.floor(subTot);

  let taxVal = 0;
  let elems = document.querySelectorAll("input[name='tax']:checked");
  if (elems) {
    for (let elem of elems) {
      taxVal += parseInt(elem.value);
    }
  }
  const tax = (taxVal / 100) * (subTot - (parseInt(dis.value) / 100) * subTot);

  if (subTot !== "0") {
    total.textContent = Math.floor(
      subTot - (parseInt(dis.value) / 100) * subTot + tax
    );
  }

  if (total.textContent === "NaN") {
    total.textContent = "";
  }
};

function initPrice() {
  for (let iPrice of document.querySelectorAll("input[name='itemPrice']")) {
    iPrice.addEventListener("keyup", () => {
      const price = parseInt(iPrice.value);
      let subTot = 0;

      if (iPrice.value === "") {
        iPrice.value = "0";
      } else if (iPrice.value.charAt(0) === "0") {
        if (iPrice.value.charAt(1) !== "") {
          iPrice.value = iPrice.value.substr(1);
        }
      }

      if (price !== "0") {
        for (let priceInp of document.querySelectorAll(
          "input[name='itemPrice']"
        )) {
          subTot +=
            parseInt(priceInp.value) *
            parseInt(
              priceInp.parentElement.parentElement.nextElementSibling
                .children[0].children[1].value
            );
        }
        sub.textContent = Math.floor(subTot);
      }

      let taxVal = 0;
      let elems = document.querySelectorAll("input[name='tax']:checked");
      if (elems) {
        for (let elem of elems) {
          taxVal += parseInt(elem.value);
        }
      }

      const tax =
        (taxVal / 100) * (subTot - (parseInt(dis.value) / 100) * subTot);

      if (price !== "0") {
        total.textContent = Math.floor(
          subTot - (parseInt(dis.value) / 100) * subTot + tax
        );
      }

      if (sub.textContent === "NaN") {
        sub.textContent = "";
      }
      if (total.textContent === "NaN") {
        total.textContent = "";
      }
    });
  }

  for (let quan of document.querySelectorAll("input[name='itemQuantity']")) {
    quan.addEventListener("keyup", () => {
      const price = parseInt(
        quan.parentElement.parentElement.previousElementSibling.children[0]
          .children[1].value
      );
      let subTot = 0;

      if (quan.value === "") {
        sub.textContent = "";
        quan.value = "0";
      } else if (quan.value.charAt(0) === "0") {
        if (quan.value.charAt(1) !== "") {
          quan.value = quan.value.substr(1);
        }
      }

      if (price !== "0") {
        for (let priceInp of document.querySelectorAll(
          "input[name='itemPrice']"
        )) {
          subTot +=
            parseInt(priceInp.value) *
            parseInt(
              priceInp.parentElement.parentElement.nextElementSibling
                .children[0].children[1].value
            );
        }
        sub.textContent = Math.floor(subTot);
      }

      let taxVal = 0;
      let elems = document.querySelectorAll("input[name='tax']:checked");
      if (elems) {
        for (let elem of elems) {
          taxVal += parseInt(elem.value);
        }
      }

      const tax =
        (taxVal / 100) * (subTot - (parseInt(dis.value) / 100) * subTot);

      if (price !== "0") {
        total.textContent = Math.floor(
          subTot - (parseInt(dis.value) / 100) * subTot + tax
        );
      }

      if (sub.textContent === "NaN") {
        sub.textContent = "";
      }
      if (total.textContent === "NaN") {
        total.textContent = "";
      }
    });
  }

  dis.addEventListener("keyup", () => {
    let subTot = 0;

    for (let priceInp of document.querySelectorAll("input[name='itemPrice']")) {
      subTot +=
        parseInt(priceInp.value) *
        parseInt(
          priceInp.parentElement.parentElement.nextElementSibling.children[0]
            .children[1].value
        );
    }

    if (parseInt(dis.value) > 100) {
      dis.value = "100";
    } else if (dis.value === "") {
      dis.value = "0";
    } else if (dis.value.charAt(0) === "0") {
      if (dis.value.charAt(1) !== "") {
        dis.value = dis.value.substr(1);
      }
    }

    let taxVal = 0;
    let elems = document.querySelectorAll("input[name='tax']:checked");
    if (elems) {
      for (let elem of elems) {
        taxVal += parseInt(elem.value);
      }
    }

    const tax =
      (taxVal / 100) * (subTot - (parseInt(dis.value) / 100) * subTot);

    if (subTot !== "0") {
      total.textContent = Math.floor(
        subTot - (parseInt(dis.value) / 100) * subTot + tax
      );
    }

    if (total.textContent === "NaN") {
      total.textContent = "";
    }
  });
}

initPrice();

// Item
const addItem = document.querySelector("#add-item");
let remItems = document.querySelectorAll(".remove-item");

for (let remItem of remItems) {
  remItem.addEventListener("click", () => {
    const childLen = document.querySelector(".items").children.length;

    if (childLen === 1) {
      document.querySelector("#itEr").textContent =
        "Should have at least one Item";
    } else {
      remItem.parentElement.remove();
    }
    remItems = document.querySelectorAll(".remove-item");
    tx("eve");
  });
}

addItem.addEventListener("click", () => {
  document.querySelector("#itEr").textContent = "";
  const newItem = document.querySelector(".item").cloneNode(true);
  document.querySelector(".items").appendChild(newItem);
  remItems = document.querySelectorAll(".remove-item");

  for (let remItem of remItems) {
    remItem.addEventListener("click", () => {
      const childLen = document.querySelector(".items").children.length;

      if (childLen === 1) {
        document.querySelector("#itEr").textContent =
          "Should have at least one Item";
      } else {
        remItem.parentElement.remove();
      }

      remItems = document.querySelectorAll(".remove-item");
      tx("eve");
    });
  }

  tx("eve");

  initPrice();
});

if (document.querySelector(".paym input")) {
  let atLeastOne = false;
  document
    .querySelector("button[type='submit']")
    .addEventListener("click", (e) => {
      e.preventDefault();
      for (let inp of document.querySelectorAll(".paym input")) {
        if (inp.checked) {
          atLeastOne = true;
        }
      }

      if (
        atLeastOne &&
        document.querySelector("input[name='name']").value !== "" &&
        document.querySelector("input[name='summary']").value !== "" &&
        document.querySelector("select[name='cust']").value !== "" &&
        document.querySelector("input[name='date']").value !== "" &&
        allFilled()
      ) {
        if (document.querySelector("input[name='due']")) {
          if (document.querySelector("input[name='due']").value !== "") {
            document.querySelector("form").submit();
          }
        } else {
          document.querySelector("form").submit();
        }
      } else {
        document.querySelector("form .err").textContent =
          "Please check at least one payment mode and fill the required fields";
      }
    });
}

function allFilled() {
  let anyEmpty = false;

  for (let name of document.querySelectorAll("input[name='itemName']")) {
    if (name.value === "") {
      anyEmpty = true;
    }
  }

  for (let name of document.querySelectorAll("input[name='itemDescription']")) {
    if (name.value === "") {
      anyEmpty = true;
    }
  }

  return !anyEmpty;
}
