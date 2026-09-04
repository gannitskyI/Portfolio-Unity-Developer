let currentFilter = "ALL";
let filtersBound = false;

function initFilters() {
  const buttons = document.querySelectorAll(".filter");
  const empty = document.getElementById("games-empty");
  if (filtersBound) {
    applyFilter(currentFilter, empty);
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      currentFilter = filter;
      buttons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      applyFilter(filter, empty);
    });
  });
  filtersBound = true;
  applyFilter(currentFilter, empty);
}

function applyFilter(filter, empty) {
  const cards = document.querySelectorAll(".game-card");
  let visible = 0;
  const emptyNode = empty || document.getElementById("games-empty");

  cards.forEach((card) => {
    const categories = (card.dataset.categories || "").split(",");
    const show = filter === "ALL" || categories.includes(filter);
    card.classList.toggle("is-hidden", !show);
    card.classList.toggle("is-showing", show);
    if (show) visible += 1;
  });

  if (emptyNode) emptyNode.hidden = visible > 0;
}

window.getCurrentFilter = () => currentFilter;
