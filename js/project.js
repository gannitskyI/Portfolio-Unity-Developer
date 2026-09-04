function getGameBySlug(slug) {
  return (window.GAMES || []).find((game) => game.slug === slug);
}

const THEATER_MS = 380;
let theaterTimer = 0;
let theaterClosing = false;

function isPortraitGame(game) {
  return game?.play?.orientation === "portrait";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function openProject(slug) {
  const game = getGameBySlug(slug);
  const root = document.getElementById("project");
  const body = document.getElementById("project-body");
  if (!game || !root || !body) return;

  closeTheater(true);

  const links = game.links || {};
  const canPlay = Boolean(game.play);
  const actions = [
    canPlay
      ? `<button class="btn btn--primary" type="button" data-open-play>${escapeHtml(t("project.play"))}</button>`
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
  const poster = canPlay
    ? `<button class="project__poster" type="button" data-open-play aria-label="${escapeHtml(t("project.play"))}">
        <img src="${escapeHtml(game.image)}" alt="${escapeHtml(game.title)}">
        <span class="project__poster-cta">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M8 5.14v13.72L19.44 12z"/></svg>
          ${escapeHtml(t("play.start"))}
        </span>
      </button>`
    : "";

  body.innerHTML = `
    ${poster}
    <div class="project__content">
      <header class="project__intro">
        <p class="eyebrow">${escapeHtml(loc(game.status) || "")}</p>
        <h2 id="project-title">${escapeHtml(game.title)}</h2>
        <div class="project__meta">
          <span>${escapeHtml(loc(game.genre) || "")}</span>
          <span>${escapeHtml((game.platforms || []).join(" · "))}</span>
          <span>${escapeHtml((game.technologies || []).join(" · "))}</span>
        </div>
      </header>
      <p class="project__lead">${escapeHtml(loc(game.longDescription || game.description))}</p>
      <p class="project__note">${escapeHtml(playNote)}</p>
      <div class="project__actions">${actions}</div>
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
      ${shots ? `<section class="project__shots"><h3>${escapeHtml(t("project.screenshots"))}</h3><div class="shots">${shots}</div></section>` : ""}
      ${video}
    </div>
  `;

  body.querySelectorAll("[data-open-play]").forEach((node) => {
    node.addEventListener("click", () => openTheater(game));
  });

  root.hidden = false;
  document.body.classList.add("project-open");
}

function openTheater(game) {
  if (!game?.play) return;
  const theater = document.getElementById("play-theater");
  const screen = document.getElementById("play-theater-screen");
  const phone = document.getElementById("play-phone");
  const hint = document.getElementById("play-theater-hint");
  if (!theater || !screen || !phone) return;

  theaterClosing = false;
  window.clearTimeout(theaterTimer);
  if (window.Playable) window.Playable.stop();
  screen.innerHTML = "";

  const portrait = isPortraitGame(game);
  phone.classList.toggle("phone--portrait", portrait);
  phone.classList.toggle("phone--landscape", !portrait);
  hint.textContent = game.play.hint ? t(game.play.hint) : t(game.play.type === "embed" ? "play.warHint" : "play.touch");

  theater.hidden = false;
  document.body.classList.add("play-theater-open");
  requestAnimationFrame(() => {
    theater.classList.add("is-open");
    requestAnimationFrame(() => {
      if (window.Playable) {
        window.Playable.mount(screen, game);
        window.Playable.start();
      }
    });
  });
}

function closeTheater(immediate) {
  const theater = document.getElementById("play-theater");
  if (!theater || theater.hidden) {
    if (window.Playable) window.Playable.stop();
    document.body.classList.remove("play-theater-open");
    return;
  }
  if (theaterClosing && !immediate) return;

  const finish = () => {
    theaterClosing = false;
    theater.classList.remove("is-open", "is-closing");
    theater.hidden = true;
    if (window.Playable) window.Playable.stop();
    const screen = document.getElementById("play-theater-screen");
    if (screen) screen.innerHTML = "";
    document.body.classList.remove("play-theater-open");
  };

  if (immediate || prefersReducedMotion()) {
    window.clearTimeout(theaterTimer);
    finish();
    return;
  }

  theaterClosing = true;
  theater.classList.remove("is-open");
  theater.classList.add("is-closing");
  window.clearTimeout(theaterTimer);
  theaterTimer = window.setTimeout(finish, THEATER_MS);
}

function hideProject() {
  closeTheater(true);
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
  document.getElementById("play-theater-close")?.addEventListener("click", () => closeTheater());
  document.getElementById("play-theater")?.addEventListener("click", (event) => {
    if (event.target.id === "play-theater") closeTheater();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (document.body.classList.contains("play-theater-open")) {
      closeTheater();
      return;
    }
    closeProject();
  });
  window.addEventListener("hashchange", routeFromHash);
  routeFromHash();
}

window.openProject = openProject;
window.routeFromHash = routeFromHash;
