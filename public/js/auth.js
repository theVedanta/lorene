let regisBtn = document.querySelector("#regisBtn");
let regis = document.querySelector("#regis");
let login = document.querySelector("#login");
let agreed = document.querySelector("#agreed");
regisBtn.disabled = true;

// Check render
changeMode();

function btnMode() {
  auth = localStorage.getItem("authType");
  if (auth === "login") {
    localStorage.setItem("authType", "regis");
  } else {
    localStorage.setItem("authType", "login");
  }
}
function changeMode() {
  auth = localStorage.getItem("authType");
  if (auth) {
    if (auth === "login") {
      login.style.display = "none";
      regis.style.display = "inline-block";
      document.querySelector(".register-form").style.display = "none";
      document.querySelector(".login-form").style.display = "block";
    } else {
      regis.style.display = "none";
      login.style.display = "inline-block";
      document.querySelector(".register-form").style.display = "block";
      document.querySelector(".login-form").style.display = "none";
    }
  } else {
    localStorage.setItem("authType", "login");
    changeMode();
  }
}

agreed.addEventListener("click", (e) => {
  if (agreed.checked) {
    regisBtn.disabled = false;
  } else {
    regisBtn.disabled = true;
  }
});

regis.addEventListener("click", (e) => {
  btnMode();
  changeMode();
  for (let er of document.querySelectorAll(".error")) {
    er.textContent = "";
    if (er.classList.contains("erActive")) {
      er.classList.remove("erActive");
    }
  }
});
login.addEventListener("click", (e) => {
  btnMode();
  changeMode();
  for (let er of document.querySelectorAll(".error")) {
    er.textContent = "";
    if (er.classList.contains("erActive")) {
      er.classList.remove("erActive");
    }
  }
});

regisBtn.addEventListener("click", (e) => {
  if (document.querySelector("input[name='name']").value.length < 3) {
    for (let er of document.querySelectorAll(".error")) {
      er.textContent = "Name too Small!";
      er.classList.add("erActive");
      for (let ac of document.querySelectorAll("erActive")) {
        ac.classList.remove("erActive");
      }
    }
    e.preventDefault();
  } else if (
    document.querySelector("input[name='phone']").value.length !== 10
  ) {
    for (let er of document.querySelectorAll(".error")) {
      er.textContent = "Invalid Phone Number";
      er.classList.add("erActive");
      for (let ac of document.querySelectorAll("erActive")) {
        ac.classList.remove("erActive");
      }
    }
    e.preventDefault();
  }
});

for (let type of document.querySelectorAll(".type h3")) {
  type.addEventListener("click", (e) => {
    document.querySelector(".typeSel").classList.remove("typeSel");
    type.classList.add("typeSel");

    let al = document.querySelector("input[name='type']").value;

    if (al === "individual") {
      document.querySelector("input[name='type']").value = "business";
    } else {
      document.querySelector("input[name='type']").value = "individual";
    }
  });
}

document.querySelector(".forgot").addEventListener("click", () => {
  document.querySelector(".mail-box").classList.add("mail-box-active");
  document.querySelector(".box").classList.add("box-active");
});

document.querySelector(".mail-box i").addEventListener("click", () => {
  document.querySelector(".mail-box").classList.remove("mail-box-active");
  document.querySelector(".box").classList.remove("box-active");
});

document.querySelector("#recover").addEventListener("click", async (e) => {
  e.preventDefault();
  if (document.querySelector(".mail-box input").value === "") {
    document.querySelector(".mailErr").textContent = "Please fill the field";
  } else {
    document.querySelector("#recover").disabled = true;
    const res = await fetch(`https://lorenepay.com/auth/forgot`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        mail: document.querySelector(".mail-box input").value,
      }),
    });
    const data = await res.json();
    if (data.done) {
      document.querySelector(".mail-box").classList.remove("mail-box-active");
      document.querySelector(".box").classList.remove("box-active");
      document.querySelector(".error").textContent =
        "Mail Sent (Do remember to check spam)";
      document.querySelector(".error").classList.add("erActive");
      document.querySelector(".error").style.background = "#6c63ff";
    } else if (data.err) {
      document.querySelector("#recover").disabled = false;
      document.querySelector(".mailErr").textContent = data.err;
    }
  }
});

setInterval(() => {
  let act = document.querySelector(".erActive");
  if (act) {
    if (!act.getAttribute("data-time")) {
      act.setAttribute("data-time", 3);
    } else {
      if (act.getAttribute("data-time") == 0) {
        act.classList.remove("erActive");
        act.removeAttribute("data-time");
      } else {
        act.setAttribute(
          "data-time",
          parseInt(act.getAttribute("data-time")) - 1
        );
      }
    }
  }
}, 1000);
