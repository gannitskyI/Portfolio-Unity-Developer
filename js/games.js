function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderGames(games) {
  const grid = document.getElementById("games-grid");
  if (!grid) return;

  grid.innerHTML = games
    .map((game) => {
      const categories = (game.categories || []).join(",");
      const platforms = (game.platforms || []).join(" · ");
      const tech = (game.technologies || [])
        .slice(0, 4)
        .map((item) => `<span class="chip">${escapeHtml(item)}</span>`)
        .join("");
      const featured = game.featured
        ? `<span class="game-card__featured">Featured</span>`
        : "";
      const cta = game.links?.play ? "Play" : "View project";

      return `
        <a class="game-card${game.featured ? " is-featured" : ""}"
           href="#/game/${escapeHtml(game.slug)}"
           data-slug="${escapeHtml(game.slug)}"
           data-categories="${escapeHtml(categories)}">
          <div class="game-card__media">
            <img src="${escapeHtml(game.image)}" alt="${escapeHtml(game.title)} cover" loading="${game.featured ? "eager" : "lazy"}" decoding="async" ${game.featured ? 'fetchpriority="high"' : ""}>
            <div class="game-card__shade"></div>
          </div>
          <div class="game-card__body">
            <div class="game-card__top">
              <span class="game-card__status">${escapeHtml(game.status || "")}</span>
              ${featured}
            </div>
            <h3>${escapeHtml(game.title)}</h3>
            <p class="game-card__meta">${escapeHtml(game.genre || "")} · ${escapeHtml(platforms)}</p>
            <p class="game-card__desc">${escapeHtml(game.description)}</p>
            <div class="game-card__tech">${tech}</div>
            <span class="game-card__cta">${cta}</span>
          </div>
        </a>
      `;
    })
    .join("");
}
