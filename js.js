function loadRepository() {
  if (inputBox.value) {
    suggestionBox.replaceChildren();
    repositoryRequest(inputBox.value);
    searchWrapper.classList.add("active");
  } else {
    suggestionBox.replaceChildren();
    searchWrapper.classList.remove("active");
  }
}

async function repositoryRequest(searchValue) {
  let repository;
  try {
    const res = await fetch(`${URL}?q=${searchValue}&per_page=5&page=1`);
    const data = await res.json();
    repository = data.items;
    repository.forEach((repo) => {
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

  suggestionBox.insertAdjacentElement("beforeend", element);
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

const URL = "https://api.github.com/search/repositories";

const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("#repositoryInput");
const suggestionBox = searchWrapper.querySelector(".autocom-box");
const suggestionList = document.querySelector(".repository");

inputBox.addEventListener("keyup", debounce(loadRepository, 500));

suggestionBox.addEventListener("click", function (event) {
  const li = event.target;
  const repoElement = createElementHepler("li", "repository__item");
  suggestionList.append(repoElement);

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
  suggestionBox.replaceChildren();
});

suggestionList.addEventListener("click", function (event) {
  const btn = event.target.closest(".close-icon");
  if (btn) {
    const card = btn.closest(".repository__item");
    card.remove();
  }
});
