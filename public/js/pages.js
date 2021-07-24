let btns = document.querySelectorAll(".toggle");
for (let btn of btns) {
  if (btn.previousElementSibling.textContent.trim() === "true") {
    btn.previousElementSibling.textContent = "Enabled";
    btn.innerHTML = "<i class='fas fa-eye-slash'></i>";
    btn.setAttribute("title", "Disable Page");
  } else {
    btn.previousElementSibling.textContent = "Disabled";
    btn.innerHTML = "<i class='fas fa-eye'></i>";
    btn.setAttribute("title", "Enable Page");
  }
}

let toggle = async (id, elem) => {
  const res = await fetch(`https://lorenepay.com/pages/toggle/${id}`, {
    method: "PUT",
  });
  const data = await res.json();
  if (data.done === "yes") {
    if (elem.previousElementSibling.textContent === "Enabled") {
      elem.innerHTML = "<i class='fas fa-eye'></i>";
      elem.previousElementSibling.textContent = "Disabled";
      elem.setAttribute("title", "Enable Page");
    } else {
      elem.innerHTML = "<i class='fas fa-eye-slash'></i>";
      elem.previousElementSibling.textContent = "Enabled";
      elem.setAttribute("title", "Disable Page");
    }
  }
};

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
