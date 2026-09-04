function getGameBySlug(slug) {
  return (window.GAMES || []).find((game) => game.slug === slug);
}

function openProject(slug) {
  const game = getGameBySlug(slug);
  const root = document.getElementById("project");
  const body = document.getElementById("project-body");
  if (!game || !root || !body) return;

  const links = game.links || {};
  const actions = [
    links.play ? `<a class="btn btn--primary" href="${escapeHtml(links.play)}" target="_blank" rel="noopener">Play</a>` : "",
    links.project ? `<a class="btn btn--ghost" href="${escapeHtml(links.project)}" target="_blank" rel="noopener">View project</a>` : "",
    links.github ? `<a class="btn btn--ghost" href="${escapeHtml(links.github)}" target="_blank" rel="noopener">GitHub</a>` : "",
  ].join("");

  const shots = (game.screenshots || [])
    .map((src, index) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(game.title)} screenshot ${index + 1}" loading="lazy">`)
    .join("");

  const features = (game.features || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const video = game.video
    ? `<div class="project__video"><video controls playsinline preload="metadata" poster="${escapeHtml(game.image)}"><source src="${escapeHtml(game.video)}" type="video/mp4"></video></div>`
    : "";

  body.innerHTML = `
    <div class="project__hero">
      <img src="${escapeHtml(game.image)}" alt="${escapeHtml(game.title)}">
    </div>
    <div class="project__content">
      <p class="eyebrow">${escapeHtml(game.status || "")}</p>
      <h2 id="project-title">${escapeHtml(game.title)}</h2>
      <div class="project__meta">
        <span>${escapeHtml(game.genre || "")}</span>
        <span>${escapeHtml((game.platforms || []).join(" · "))}</span>
        <span>${escapeHtml((game.technologies || []).join(" · "))}</span>
      </div>
      <p>${escapeHtml(game.longDescription || game.description)}</p>
      <div class="project__actions">${actions}</div>
      <div class="project__grid">
        <div>
          <h3>Role</h3>
          <p>${escapeHtml(game.role || "")}</p>
        </div>
        <div>
          <h3>Features</h3>
          <ul>${features}</ul>
        </div>
      </div>
      ${shots ? `<h3>Screenshots</h3><div class="shots">${shots}</div>` : ""}
      ${video}
    </div>
  `;

  root.hidden = false;
  document.body.classList.add("project-open");
}

function hideProject() {
  const root = document.getElementById("project");
  if (root) root.hidden = true;
  document.body.classList.remove("project-open");
}

function closeProject() {
  hideProject();
  if (location.hash.startsWith("#/game/")) {
    history.replaceState(null, "", location.pathname + location.search + "#games");
  }
}

function routeFromHash() {
  const match = location.hash.match(/^#\/game\/([^/]+)/);
  if (match) {
    openProject(decodeURIComponent(match[1]));
  } else {
    hideProject();
  }
}

function initProject() {
  document.getElementById("project-close")?.addEventListener("click", closeProject);
  document.getElementById("project")?.addEventListener("click", (event) => {
    if (event.target.id === "project") closeProject();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProject();
  });
  window.addEventListener("hashchange", routeFromHash);
  routeFromHash();
}
