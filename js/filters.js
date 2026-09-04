function initFilters() {
  const buttons = document.querySelectorAll(".filter");
  const empty = document.getElementById("games-empty");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      applyFilter(filter, empty);
    });
  });
}

function applyFilter(filter, empty) {
  const cards = document.querySelectorAll(".game-card");
  let visible = 0;

  cards.forEach((card) => {
    const categories = (card.dataset.categories || "").split(",");
    const show = filter === "ALL" || categories.includes(filter);
    card.classList.toggle("is-hidden", !show);
    card.classList.toggle("is-showing", show);
    if (show) visible += 1;
  });

  if (empty) empty.hidden = visible > 0;
}
