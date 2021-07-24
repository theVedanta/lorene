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

const dis = document.querySelector("input[name='discount']");
const total = document.querySelector("#total");
const priceField = document.querySelector("input[name='price']");

const loadFile = (event) => {
  let image = document.getElementById("output");
  image.src = URL.createObjectURL(event.target.files[0]);
};
const loadFile2 = (event) => {
  let image = document.getElementById("output2");
  image.src = URL.createObjectURL(event.target.files[0]);
};
const loadFile3 = (event) => {
  let image = document.getElementById("output3");
  image.src = URL.createObjectURL(event.target.files[0]);
};

const pr = (event) => {
  const val = document.querySelector("select[name='priceType']").value;
  if (val === "fixed") {
    document.querySelector("#quan").style.display = "none";
    document.querySelector("input[name='price']").parentElement.style.display =
      "block";
    document.querySelector("input[name='price']").removeAttribute("disabled");
    dis.style.display = "inline-block";
    dis.previousElementSibling.style.display = "block";
    dis.nextElementSibling.style.display = "inline";
  } else if (val === "customer") {
    document.querySelector("input[name='price']").setAttribute("disabled", "");
    document.querySelector("input[name='price']").parentElement.style.display =
      "none";
    document.querySelector("#quan").style.display = "none";
    dis.style.display = "none";
    dis.previousElementSibling.style.display = "none";
    dis.nextElementSibling.style.display = "none";
  } else {
    document.querySelector("#quan").style.display = "inline-block";
    document.querySelector("input[name='price']").parentElement.style.display =
      "block";
    document.querySelector("input[name='price']").removeAttribute("disabled");
    dis.style.display = "inline-block";
    dis.previousElementSibling.style.display = "block";
    dis.nextElementSibling.style.display = "inline";
  }
};

const tx = (event) => {
  const price = parseInt(priceField.value);
  let taxVal = 0;
  let elems = document.querySelectorAll("input[name='tax']:checked");
  if (elems) {
    for (let elem of elems) {
      taxVal += parseInt(elem.value);
    }
  }
  const tax = (taxVal / 100) * (price - (parseInt(dis.value) / 100) * price);
  if (price !== "0") {
    total.textContent = Math.floor(
      price - (parseInt(dis.value) / 100) * price + tax
    );
  }

  if (total.textContent === "NaN") {
    total.textContent = "0";
  }
};

const remt = document.querySelector("#remT");
remt.addEventListener("click", () => {
  if (remt.textContent === "Remove") {
    document.querySelector("textarea[name='terms']").style.display = "none";
    remt.textContent = "Add";
  } else {
    document.querySelector("textarea[name='terms']").style.display =
      "inline-block";
    remt.textContent = "Remove";
  }
});

const remi = document.querySelector("#remI");
remi.addEventListener("click", () => {
  if (remi.textContent === "Remove") {
    document.querySelector(".icons").style.display = "none";
    remi.textContent = "Add";
    document.querySelector("input[name='social']").value = "no";
  } else {
    document.querySelector(".icons").style.display = "block";
    remi.textContent = "Remove";
    document.querySelector("input[name='social']").value = "yes";
  }
});

const remcs = document.querySelectorAll("#remC");

for (let remc of remcs) {
  remc.addEventListener("click", () => {
    if (remc.textContent === "Remove") {
      remc.previousElementSibling.style.display = "none";
      remc.textContent = "Add";
    } else {
      remc.previousElementSibling.style.display = "inline-block";
      remc.textContent = "Remove";
    }
  });
}

dis.addEventListener("keyup", () => {
  const price = parseInt(priceField.value);

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
  const tax = (taxVal / 100) * (price - (parseInt(dis.value) / 100) * price);
  if (price !== "0") {
    total.textContent = Math.floor(
      price - (parseInt(dis.value) / 100) * price + tax
    );
  }

  if (total.textContent === "NaN") {
    total.textContent = "0";
  }
});

priceField.addEventListener("keyup", () => {
  const price = parseInt(priceField.value);

  if (priceField.value === "") {
    total.textContent = "0";
    priceField.value = "0";
  } else if (priceField.value.charAt(0) === "0") {
    if (priceField.value.charAt(1) !== "") {
      priceField.value = priceField.value.substr(1);
    }
  }

  let taxVal = 0;
  let elems = document.querySelectorAll("input[name='tax']:checked");
  if (elems) {
    for (let elem of elems) {
      taxVal += parseInt(elem.value);
    }
  }
  const tax = (taxVal / 100) * (price - (parseInt(dis.value) / 100) * price);
  if (price !== "0") {
    total.textContent = Math.floor(
      price - (parseInt(dis.value) / 100) * price + tax
    );
  }

  if (total.textContent === "NaN") {
    total.textContent = "0";
  }
});

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}

for (let inp of document.querySelectorAll("input[type='number']")) {
  inp.setAttribute("onkeypress", "return isNumberKey(event)");
}
