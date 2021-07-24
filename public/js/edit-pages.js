function t(event) {
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
    total.textContent = "";
  }
}

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

const remi = document.querySelector("#remI");
if (remi) {
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
}

let sl = document.querySelector("#selected").value;
if (sl === "fixed") {
  document.querySelector("#quan").style.display = "none";
  document.querySelector("input[name='price']").style.display = "inline-block";
  document.querySelector("input[name='price']").removeAttribute("disabled");
  dis.style.display = "inline-block";
  dis.previousElementSibling.style.display = "block";
  dis.nextElementSibling
    ? (dis.nextElementSibling.style.display = "inline")
    : {};
} else if (sl === "customer") {
  document.querySelector("input[name='price']").style.display = "none";
  document.querySelector("#quan").style.display = "none";
  dis.style.display = "none";
  dis.previousElementSibling.style.display = "none";
  dis.nextElementSibling ? (dis.nextElementSibling.style.display = "none") : {};
} else {
  document.querySelector("#quan").style.display = "inline-block";
  document.querySelector("input[name='price']").style.display = "inline-block";
  document.querySelector("input[name='price']").removeAttribute("disabled");
  dis.style.display = "inline-block";
  dis.previousElementSibling.style.display = "block";
  dis.nextElementSibling
    ? (dis.nextElementSibling.style.display = "inline")
    : {};
}

const pr = (event) => {
  const val = document.querySelector("select[name='priceType']").value;
  if (val === "fixed") {
    document.querySelector("#quan").style.display = "none";
    document.querySelector("input[name='price']").style.display =
      "inline-block";
    document.querySelector("input[name='price']").removeAttribute("disabled");
    dis.style.display = "inline-block";
    dis.previousElementSibling.style.display = "block";
    dis.nextElementSibling.style.display = "inline";
  } else if (val === "customer") {
    document.querySelector("input[name='price']").setAttribute("disabled", "");
    document.querySelector("input[name='price']").style.display = "none";
    document.querySelector("#quan").style.display = "none";
    dis.style.display = "none";
    dis.previousElementSibling.style.display = "none";
    dis.nextElementSibling.style.display = "none";
  } else {
    document.querySelector("#quan").style.display = "inline-block";
    document.querySelector("input[name='price']").style.display =
      "inline-block";
    document.querySelector("input[name='price']").removeAttribute("disabled");
    dis.style.display = "inline-block";
    dis.previousElementSibling.style.display = "block";
    dis.nextElementSibling.style.display = "inline";
  }
};

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
    total.textContent = "";
  }
});

priceField.addEventListener("keyup", () => {
  const price = parseInt(priceField.value);

  if (priceField.value === "") {
    total.textContent = "";
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
    total.textContent = "";
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

// IMG

// remove
let removes = document.querySelectorAll(".productRemove");
for (let rem of removes) {
  rem.addEventListener("click", () => {
    let id = rem.previousElementSibling.id;
    rem.parentElement.remove();

    if (document.querySelectorAll(".productImage").length < 1) {
      document.querySelector("input[name='img1']").setAttribute("required", "");
      document
        .querySelector("input[name='img1']")
        .parentElement.classList.add("required");
    } else {
      document.querySelector("input[name='img1']").removeAttribute("required");
      document
        .querySelector("input[name='img1']")
        .parentElement.classList.remove("required");
    }

    let inp = document.createElement("INPUT");
    inp.setAttribute("type", "number");
    inp.setAttribute("name", "toRem");
    inp.setAttribute("value", id);
    inp.style.display = "none";

    document.querySelector("form").appendChild(inp);
  });
}

// Load
const loadFile = (event, number) => {
  let image = document.getElementById(`output${number}`);
  image.src = URL.createObjectURL(event.target.files[0]);
};
