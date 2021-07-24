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

let titles = [];
for (let td of document.querySelectorAll(".name-data")) {
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
        for (let td of document.querySelectorAll(".name-data")) {
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

// Dropdown
let drops = document.querySelectorAll(".drop-opt");
for (let drop of drops) {
  drop.addEventListener("click", () => {
    if (
      document.querySelector(".drop-links-active") &&
      document.querySelector(".drop-links-active") !== drop.nextElementSibling
    ) {
      document
        .querySelector(".drop-links-active")
        .classList.remove("drop-links-active");
    }
    drop.nextElementSibling.classList.toggle("drop-links-active");
  });
}

const box = document.querySelector(".add-tax");

function record(name, sum, due, id) {
  box.classList.add("add-tax-active");
  document.querySelector(".wrapper").classList.add("wrapper-active");

  document.querySelector(".add-tax input[name='name']").value = name;
  document.querySelector(".add-tax input[name='sum']").value = sum;
  document.querySelector(".add-tax input[name='due']").value = due;
  box.setAttribute("action", `/invoices/record/${id}?_method=PUT`);
}

document.querySelector(".add-tax i").addEventListener("click", () => {
  box.classList.remove("add-tax-active");
  document.querySelector(".wrapper").classList.remove("wrapper-active");
});
