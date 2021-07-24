async function tx(id, elem) {
  const res = await fetch(`https://lorenepay.com/tax/toggle/${id}`, {
    method: "PUT",
  });
  const data = await res.json();
  if (data.done === "yes") {
    if (elem.previousElementSibling.textContent === "Disabled") {
      elem.previousElementSibling.textContent = "Enabled";
      elem.innerHTML = "<i class='fas fa-eye-slash'></i>";
    } else {
      elem.previousElementSibling.textContent = "Disabled";
      elem.innerHTML = "<i class='fas fa-eye'></i>";
    }
  }
}

async function td(id, elem) {
  const res = await fetch(`https://lorenepay.com/tax/delete/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (data.done) {
    elem.parentElement.parentElement.remove();
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
    } else if (data.err) {
      document.querySelector(".add-tax p").textContent = data.err;
    }
  } else {
    document.querySelector(".add-tax p").textContent = "Please fill all fields";
  }
});

document.querySelector("#editTax").addEventListener("click", async () => {
  if (document.querySelector(".edit-tax input[name='name']").value !== "") {
    let editVal = document.querySelector("#editVal").textContent;
    const res = await fetch(`https://lorenepay.com/tax/edit/${editVal}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: document.querySelector(".edit-tax input[name='name']").value,
        offer: document.querySelector(".edit-tax input[name='offer']").value,
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

function te(name, offer, id) {
  document.querySelector(".edit-tax").classList.add("edit-tax-active");
  document.querySelector(".wrapper").classList.add("wrapper-active");

  document.querySelector(".edit-tax input[name='name']").value = name;
  document.querySelector(".edit-tax input[name='offer']").value = offer;
  document.querySelector("#editVal").textContent = id;
}

const logoUpload = (event) => {
  let image = document.getElementById("#logo");
  image.src = URL.createObjectURL(event.target.files[0]);
};

const btn = document.querySelector("#search");
if (btn) {
  btn.addEventListener("click", async () => {
    let ifsc = document.querySelector("input[name='ifsc']").value;

    if (ifsc !== "") {
      const res = await fetch("https://lorenepay.com/settings/find", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ifsc: ifsc }),
      });
      const data = await res.json();

      if (data.error) {
        document.querySelector("#error").textContent = data.error;
        document.querySelector(".card").scrollTo(0, 0);
      } else {
        document.querySelector(".bankDetails").style.display = "block";
        document.querySelector("#bankName").value = data.bankName;
        document.querySelector("#bankBranch").value = data.bankBranch;
        document.querySelector("#bankAddress").value = data.bankAddress;
        document
          .querySelector("input[name='ifsc']")
          .setAttribute("readonly", "");
      }
    }
  });
}

const btns = document.querySelectorAll(".acc-pages button");
for (let btn of btns) {
  btn.addEventListener("click", () => {
    document.querySelector(".acc-act").classList.remove("acc-act");
    btn.classList.add("acc-act");

    let btnVal = document.querySelector(".acc-act").textContent;

    if (btnVal === "Address") {
      document.querySelector(".address").style.display = "inline-block";
      document.querySelector(".bank").style.display = "none";
      document.querySelector(".logo-up").style.display = "none";
      document.querySelector(".tax").style.display = "none";
    } else if (btnVal === "Bank Info") {
      document.querySelector(".address").style.display = "none";
      document.querySelector(".bank").style.display = "inline-block";
      document.querySelector(".logo-up").style.display = "none";
      document.querySelector(".tax").style.display = "none";
    } else if (btnVal === "Logo") {
      document.querySelector(".address").style.display = "none";
      document.querySelector(".bank").style.display = "none";
      document.querySelector(".logo-up").style.display = "inline-block";
      document.querySelector(".tax").style.display = "none";
    } else {
      document.querySelector(".address").style.display = "none";
      document.querySelector(".bank").style.display = "none";
      document.querySelector(".logo-up").style.display = "none";
      document.querySelector(".tax").style.display = "inline-block";
    }
  });
}

let remBtn = document.querySelector("#remove-logo");
if (remBtn) {
  remBtn.addEventListener("click", () => {
    remBtn.parentElement.parentElement.style.display = "none";
    let inp = document.createElement("INPUT");
    inp.setAttribute("type", "text");
    inp.setAttribute("name", "remLogo");
    inp.setAttribute("value", "remove");
    inp.style.display = "none";
    document.querySelector(".logo-up form").append(inp);
  });
}

let togg = document.querySelectorAll(".toggle");
for (let btn of togg) {
  if (btn.previousElementSibling.textContent.trim() === "true") {
    btn.previousElementSibling.textContent = "Enabled";
    btn.innerHTML = "<i class='fas fa-eye-slash'></i>";
    btn.setAttribute("title", "Disable Tax");
  } else {
    btn.previousElementSibling.textContent = "Disabled";
    btn.innerHTML = "<i class='fas fa-eye'></i>";
    btn.setAttribute("title", "Enable Tax");
  }
}

document.querySelector("#taxCreate").addEventListener("click", () => {
  document.querySelector(".add-tax").classList.add("add-tax-active");
  document.querySelector(".wrapper").classList.add("wrapper-active");
});

document.querySelector(".add-tax i").addEventListener("click", () => {
  document.querySelector(".add-tax").classList.remove("add-tax-active");
  document.querySelector(".wrapper").classList.remove("wrapper-active");
});

document.querySelector(".edit-tax i").addEventListener("click", () => {
  document.querySelector(".edit-tax").classList.remove("edit-tax-active");
  document.querySelector(".wrapper").classList.remove("wrapper-active");
});

let disss = document.querySelectorAll("input[name='offer']");
if (disss) {
  for (let dis of disss) {
    dis.addEventListener("keyup", () => {
      if (parseInt(dis.value) > 100) {
        dis.value = "100";
      } else if (dis.value === "") {
        dis.value = "0";
      } else if (dis.value.charAt(0) === "0") {
        if (dis.value.charAt(1) !== "") {
          dis.value = dis.value.substr(1);
        }
      }
    });
  }
}
