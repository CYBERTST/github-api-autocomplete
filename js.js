const URL = "https://api.github.com/search/repositories";

const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("#repoInput");
const suggBox = searchWrapper.querySelector(".autocom-box");
const suggList = document.querySelector(".repos");

inputBox.addEventListener("keyup", debounce(loadRepos, 500));

suggBox.addEventListener("click", function (event) {
  const li = event.target;
  const repoElement = createElementHepler("li", "repos__item");
  suggList.append(repoElement);

  const textColumn = createElementHepler("div", "text-container");
  const textLineName = createElementHepler("div", "text-line-name");
  textLineName.textContent = "Name: " + li.textContent;
  const textLineOwner = createElementHepler("div", "text-line-owner");
  textLineOwner.textContent = "Owner: " + li.dataset.owner;
  const textLineStars = createElementHepler("div", "text-line-stars");
  textLineStars.textContent = "Stars: " + li.dataset.stars;
  textColumn.append(textLineName);
  textColumn.append(textLineOwner);
  textColumn.append(textLineStars);

  repoElement.append(textColumn);

  const buttonClose = createElementHepler("button", "close-icon");
  repoElement.append(buttonClose);
  inputBox.value = "";
  suggBox.replaceChildren();
});

suggList.addEventListener("click", function (event) {
  const btn = event.target.closest(".close-icon");
  if (btn) {
    const card = btn.closest(".repos__item");
    card.remove();
  }
});

function loadRepos() {
  if (inputBox.value) {
    suggBox.replaceChildren();
    reposRequest(inputBox.value);
    searchWrapper.classList.add("active");
  } else {
    suggBox.replaceChildren();
    searchWrapper.classList.remove("active");
  }
}

async function reposRequest(searchValue) {
  let repos;
  try {
    const res = await fetch(`${URL}?q=${searchValue}&per_page=5&page=1`);
    const data = await res.json();
    repos = data.items;
    repos.forEach((repo) => {
      createItem(repo);
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}

function createItem(repo) {
  const element = document.createElement("li");
  element.textContent = repo.name;
  element.dataset.owner = repo.owner.login;
  element.dataset.stars = repo.stargazers_count;

  suggBox.insertAdjacentElement("beforeend", element);
}

function createElementHepler(elementTag, elementClass) {
  const element = document.createElement(elementTag);
  if (elementClass) {
    element.classList.add(elementClass);
  }
  return element;
}

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
