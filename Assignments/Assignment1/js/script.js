// get data asynchronusly to not block the event loop
async function getData() {
  const res = await fetch("./js/data.json");
  const data = await res.json();
  return data.users;
}

// create an email for users by merging their first and lastname with a dot
function createEmail(str) {
  let tmp = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === " ") {
      tmp += ".";
    } else {
      tmp += str[i];
    }
  }

  tmp += "@example.com";

  return tmp.toLowerCase();
}

// create proper pagination for current page from the user list
function paginateResults(users, current) {
  let list = "";
  let count = (current - 1) * 10;
  let max = count + 10;

  while (count < max && count < users.length) {
    const name = users[count].name;
    const image = users[count].image;
    const joined = users[count].joined;
    const email = createEmail(name);

    list += `<li class="contact-item cf">
    <div class="contact-details">
    <img class="avatar" src=${image}>
    <h3>${name}</h3>
    <span class="email">${email}</span>
    </div>
    <div class="joined-details">
    <span class="date">Joined ${joined}</span>
    </div>
    </li>`;

    count++;
  }

  return list;
}

// main function to add all the required html
async function addHTML() {
  const users = await getData();
  const totalPages = Math.ceil(users.length / 10);
  const total = document.querySelector(".page-header h3");
  const contactList = document.querySelector(".contact-list");

  // add total
  total.innerHTML = `Total: ${users.length}`;

  // add page numbers
  let pages = "";

  for (let i = 0; i < totalPages; i++) {
    if (i == 0) {
      pages += `<li><a class="active">${i + 1}</a></li>`;
    } else {
      pages += `<li><a>${i + 1}</a></li>`;
    }
  }
  const pagination = `<div class="pagination"><ul>${pages}</ul></div>`;
  contactList.insertAdjacentHTML("afterend", pagination);

  // set the first 10 results
  contactList.innerHTML = paginateResults(users, 1);

  const buttons = document.querySelectorAll(".pagination ul li a");

  // event listeners
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const tmp = document.querySelector(".pagination ul .active");
      tmp.classList.remove("active");
      this.classList.add("active");
      const current = this.innerHTML;
      contactList.innerHTML = paginateResults(users, current);
    });
  });
}

addHTML();

// Sources
// How to use fetch to get the data from data.json: https://www.w3schools.com/js/js_api_fetch.asp
