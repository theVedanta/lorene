document.querySelector("#pay").addEventListener("click", () => {
  setTimeout(() => {
    document.querySelector(".wrapper").classList.add("wrapper-active");
    document.querySelector(".popup").classList.add("popup-active");
  }, 20);

  setTimeout(() => {
    document.querySelector(".wrapper-active").addEventListener("click", () => {
      document.querySelector(".popup").classList.remove("popup-active");
      document.querySelector(".wrapper").classList.remove("wrapper-active");

      setTimeout(() => {
        if (document.querySelector(".show"))
          document.querySelector(".show").classList.remove("show");

        document.querySelector(".popPay .card").classList.remove("show");
        document.querySelector(".popPay .net").classList.remove("show");
        document.querySelector(".popPay .upi").classList.remove("show");

        document.querySelector(".popUser").classList.add("show");

        document
          .querySelector(".popNavActive")
          .classList.remove("popNavActive");
        document.querySelector("#optUser").classList.add("popNavActive");

        for (let inp of document.querySelectorAll(".popup input")) {
          inp.value = "";
        }
      }, 300);
    });
  }, 100);
});

document.querySelector("#cont").addEventListener("click", () => {
  // Err Check
  if (
    document.querySelector(".popUser input[name='name']").value !== "" &&
    document.querySelector(".popUser input[name='mail']").value !== "" &&
    document.querySelector(".popUser input[name='phone']").value !== ""
  ) {
    document.querySelector(".popUser").classList.remove("show");
    document.querySelector(".popOpt").classList.add("show");
    document.querySelector(".popNavActive").classList.remove("popNavActive");
    document.querySelector("#optOpt").classList.add("popNavActive");
    document.querySelector("#optOpt").classList.add("optClick");
  } else {
    document.querySelector(".popUser .err").style.color = "rgb(216, 57, 18)";
  }
});

for (let modeBtn of document.querySelectorAll(".popOpt button")) {
  modeBtn.addEventListener("click", () => {
    document.querySelector(".popOpt").classList.remove("show");
    document.querySelector(".popPay").classList.add("show");
    document.querySelector(".popNavActive").classList.remove("popNavActive");
    document.querySelector("#optPay").classList.add("popNavActive");
    document.querySelector("#optPay").classList.add("optClick");

    document.querySelector(".popOpt input").value =
      modeBtn.getAttribute("data-value");

    const mode = document.querySelector(".popOpt input").value;

    if (document.querySelector(".popPay .show"))
      document.querySelector(".popPay .show").classList.remove("show");

    if (mode === "debit") {
      document.querySelector(".popPay .card").classList.add("show");
      document.querySelector(".popPay .card h1 span").textContent = "Debit";
    } else if (mode === "credit") {
      document.querySelector(".popPay .card").classList.add("show");
      document.querySelector(".popPay .card h1 span").textContent = "Credit";
    } else if (mode === "net") {
      document.querySelector(".popPay .net").classList.add("show");
      document.querySelector(".popPay .card").classList.remove("show");
    } else {
      document.querySelector(".popPay .upi").classList.add("show");
      document.querySelector(".popPay .card").classList.remove("show");
    }
  });
}
