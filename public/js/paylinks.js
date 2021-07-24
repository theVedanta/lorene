for (let i of document.querySelectorAll(".fa-copy")) {
  i.addEventListener("click", () => {
    const range = document.createRange();
    window.getSelection().removeAllRanges();
    range.selectNode(i.previousElementSibling);
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    let oldtxt = i.previousElementSibling.innerHTML;
    i.previousElementSibling.innerHTML = `Copied!`;
    setTimeout(() => (i.previousElementSibling.innerHTML = oldtxt), 750);
  });
}

document.querySelector("#create").addEventListener("click", () => {
  if (!document.querySelector(".upload")) {
    document.querySelector(".add-link").classList.add("add-link-active");
    document.querySelector(".wrapper").classList.add("wrapper-active");
  } else {
    document.querySelector(".upload").textContent =
      "Verify Account to use services";
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

document.querySelector(".fa-times").addEventListener("click", () => {
  document
    .querySelector(".add-link-active")
    .classList.remove("add-link-active");
  document.querySelector(".wrapper-active").classList.remove("wrapper-active");
});

document
  .querySelector("input[name='multiple']")
  .addEventListener("change", () => {
    document.querySelector(".cust").classList.toggle("non");
  });

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
      document.querySelector("input[name='description']") !== "" &&
      document.querySelector("input[name='amount']") !== ""
    ) {
      document.querySelector("form").submit();
    } else {
      document.querySelector("form .err").textContent =
        "Please fill all fields and check at least one payment mode";
    }
  });

document.querySelector(".link-data").style.marginTop = "-1px";
document.querySelector(".link-data").style.marginBottom = "1px";
