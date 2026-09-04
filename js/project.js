function getGameBySlug(slug) {
  return (window.GAMES || []).find((game) => game.slug === slug);
}

function openProject(slug) {
  const game = getGameBySlug(slug);
  const root = document.getElementById("project");
  const body = document.getElementById("project-body");
  if (!game || !root || !body) return;

  if (window.Playable) window.Playable.stop();

  const links = game.links || {};
  const actions = [
    game.play
      ? `<button class="btn btn--primary" type="button" id="project-play">${escapeHtml(t("project.play"))}</button>`
      : "",
    links.play
      ? `<a class="btn btn--ghost" href="${escapeHtml(links.play)}" target="_blank" rel="noopener">${escapeHtml(t("project.playExternal"))}</a>`
      : "",
    links.project && links.project !== links.play
      ? `<a class="btn btn--ghost" href="${escapeHtml(links.project)}" target="_blank" rel="noopener">${escapeHtml(t("project.view"))}</a>`
      : "",
    links.github
      ? `<a class="btn btn--ghost" href="${escapeHtml(links.github)}" target="_blank" rel="noopener">${escapeHtml(t("project.github"))}</a>`
      : "",
  ].join("");

  const shots = (game.screenshots || [])
    .map((src, index) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(game.title)} screenshot ${index + 1}" loading="lazy">`)
    .join("");

  const features = (game.features || [])
    .map((item) => `<li>${escapeHtml(loc(item))}</li>`)
    .join("");

  const video = game.video
    ? `<div class="project__video"><video controls playsinline preload="metadata" poster="${escapeHtml(game.image)}"><source src="${escapeHtml(game.video)}" type="video/mp4"></video></div>`
    : "";

  const playNote = game.play?.type === "embed" ? t("project.embed") : t("project.prototype");
  const repo = game.repo || {};
  const repoFacts = repo.product
    ? `<div class="project__repo">
        <h3>${escapeHtml(t("project.repo"))}</h3>
        <dl>
          <div><dt>${escapeHtml(t("project.product"))}</dt><dd>${escapeHtml(repo.product)}</dd></div>
          <div><dt>${escapeHtml(t("project.studio"))}</dt><dd>${escapeHtml(repo.studio || "GannaGames")}</dd></div>
          <div><dt>${escapeHtml(t("project.unity"))}</dt><dd>${escapeHtml(repo.unity || "")}</dd></div>
          <div><dt>${escapeHtml(t("project.version"))}</dt><dd>${escapeHtml(repo.version || "")}</dd></div>
          <div><dt>${escapeHtml(t("project.githubRepo"))}</dt><dd><a href="${escapeHtml(links.github || "#")}" target="_blank" rel="noopener">${escapeHtml(repo.github || "")}</a></dd></div>
        </dl>
      </div>`
    : "";

  body.innerHTML = `
    <div class="project__play" id="project-play-root"></div>
    <div class="project__content">
      <p class="eyebrow">${escapeHtml(loc(game.status) || "")}</p>
      <h2 id="project-title">${escapeHtml(game.title)}</h2>
      <div class="project__meta">
        <span>${escapeHtml(loc(game.genre) || "")}</span>
        <span>${escapeHtml((game.platforms || []).join(" · "))}</span>
        <span>${escapeHtml((game.technologies || []).join(" · "))}</span>
      </div>
      <p>${escapeHtml(loc(game.longDescription || game.description))}</p>
      <p class="project__note">${escapeHtml(playNote)}</p>
      <div class="project__actions">${actions}</div>
      ${repoFacts}
      <div class="project__grid">
        <div>
          <h3>${escapeHtml(t("project.role"))}</h3>
          <p>${escapeHtml(loc(game.role) || "")}</p>
        </div>
        <div>
          <h3>${escapeHtml(t("project.features"))}</h3>
          <ul>${features}</ul>
        </div>
      </div>
      ${shots ? `<h3>${escapeHtml(t("project.screenshots"))}</h3><div class="shots">${shots}</div>` : ""}
      ${video}
    </div>
  `;

  const playRoot = document.getElementById("project-play-root");
  if (playRoot && window.Playable && game.play) {
    window.Playable.mount(playRoot, game);
  }

  document.getElementById("project-play")?.addEventListener("click", () => {
    playRoot?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.Playable?.start?.();
  });

  root.hidden = false;
  document.body.classList.add("project-open");
}

function hideProject() {
  const root = document.getElementById("project");
  if (window.Playable) window.Playable.stop();
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

window.openProject = openProject;
window.routeFromHash = routeFromHash;
