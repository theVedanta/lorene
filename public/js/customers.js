let form = document.querySelector(".form-box");
document.querySelector("#create").addEventListener("click", () => {
  if (!document.querySelector(".upload")) {
    form.classList.add("form-box-active");
    document.querySelector(".wrapper").classList.add("wrapper-active");
  } else {
    document.querySelector(".upload").textContent =
      "Verify Account to use services";
  }
});

document.querySelector(".fa-times").addEventListener("click", () => {
  form.classList.remove("form-box-active");
  document.querySelector(".wrapper-active").classList.remove("wrapper-active");
});

let titles = [];
for (let td of document.querySelectorAll(".businessName")) {
  titles.push(td.textContent.toLowerCase());
}

let search = document.querySelector("#search");
search.addEventListener("keyup", () => {
  let usrInp = search.value.trim();
  let matches = getMatches(usrInp);

  if (usrInp == "") {
    document.querySelector(".no-data-hold").style.display = "none";
    document.querySelector(".no-hr").style.display = "none";
    for (let tr of document.querySelectorAll("tbody tr")) {
      tr.style.display = "table-row";
    }
  } else {
    document.querySelector(".no-data-hold").style.display = "none";
    document.querySelector(".no-hr").style.display = "none";
    for (let tr of document.querySelectorAll("tbody tr")) {
      tr.style.display = "none";
    }
  }

  let oneMatch = false;

  for (let match of matches) {
    for (let title of titles) {
      if (match == title) {
        oneMatch = true;
        for (let td of document.querySelectorAll(".businessName")) {
          if (td.textContent.toLowerCase() == title) {
            td.parentElement.style.display = "table-row";
          }
        }
      }
    }
  }

  if (!oneMatch) {
    document.querySelector(".no-data-hold").style.display = "flex";
    document.querySelector(".no-hr").style.display = "block";
  }
});

function getMatches(input) {
  let matchList = [];

  for (let i = 0; i < titles.length; i++) {
    if (titles[i].toLowerCase().indexOf(input.toLowerCase()) != -1) {
      matchList.push(titles[i]);
    }
  }

  return matchList;
}
