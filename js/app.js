function getPath(object, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), object);
}

function applyConfig() {
  const config = window.CONFIG || {};
  document.querySelectorAll("[data-config]").forEach((node) => {
    const value = getPath(config, node.dataset.config);
    if (typeof value === "string" && value) node.textContent = value;
  });

  if (config.seo?.title) document.title = config.seo.title;
}

function renderAbout() {
  const about = CONFIG.about || {};
  const focus = document.getElementById("about-focus");
  const comps = document.getElementById("competencies");

  if (focus) {
    focus.innerHTML = (about.focus || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
  }

  if (comps) {
    comps.innerHTML = (about.competencies || [])
      .map(
        (item) => `
        <div class="comp">
          <span>${escapeHtml(item.name)}</span>
          <div class="comp__bar" style="--lvl:${item.level}"><i></i></div>
        </div>`
      )
      .join("");
  }
}

function renderSkills() {
  const root = document.getElementById("skills-grid");
  if (!root) return;
  root.innerHTML = (CONFIG.skills || [])
    .map(
      (group) => `
      <article class="skill-group">
        <h3>${escapeHtml(group.title)}</h3>
        <div class="skill-group__items">
          ${(group.items || [])
            .map((item) => `<span class="skill">${escapeHtml(item)}</span>`)
            .join("")}
        </div>
      </article>`
    )
    .join("");
}

function renderExperience() {
  const root = document.getElementById("timeline");
  if (!root) return;
  root.innerHTML = (CONFIG.experience || [])
    .map(
      (item) => `
      <li>
        <div class="timeline__period">${escapeHtml(item.period)}</div>
        <h3>${escapeHtml(item.role)}</h3>
        <p class="timeline__place">${escapeHtml(item.place)}</p>
        <ul>${(item.points || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
      </li>`
    )
    .join("");
}

function renderContact() {
  const root = document.getElementById("contact-actions");
  if (!root) return;
  const social = CONFIG.social || {};
  const items = [];

  if (CONFIG.email) {
    items.push(`<a class="btn btn--primary" href="mailto:${escapeHtml(CONFIG.email)}">Email me</a>`);
  }
  if (social.telegram) {
    items.push(`<a class="btn btn--ghost" href="${escapeHtml(social.telegram)}" target="_blank" rel="noopener">Telegram</a>`);
  }
  if (social.github) {
    items.push(`<a class="btn btn--ghost" href="${escapeHtml(social.github)}" target="_blank" rel="noopener">GitHub</a>`);
  }
  if (social.linkedin) {
    items.push(`<a class="btn btn--ghost" href="${escapeHtml(social.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
  }
  if (social.itch) {
    items.push(`<a class="btn btn--ghost" href="${escapeHtml(social.itch)}" target="_blank" rel="noopener">itch.io</a>`);
  }
  if (social.twitter) {
    items.push(`<a class="btn btn--ghost" href="${escapeHtml(social.twitter)}" target="_blank" rel="noopener">X</a>`);
  }
  if (social.youtube) {
    items.push(`<a class="btn btn--ghost" href="${escapeHtml(social.youtube)}" target="_blank" rel="noopener">YouTube</a>`);
  }

  root.innerHTML = items.join("");
}

function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle?.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });

  const sections = ["home", "games", "about", "skills", "experience", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const spy = () => {
    const fromTop = window.scrollY + 96;
    let current = "home";
    sections.forEach((section) => {
      if (section.offsetTop <= fromTop) current = section.id;
    });
    links?.querySelectorAll("a").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", spy, { passive: true });
  spy();
}

function initReveals() {
  const nodes = document.querySelectorAll(".section, .game-card");
  nodes.forEach((node) => node.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  nodes.forEach((node) => io.observe(node));
}

function initClock() {
  const node = document.querySelector("[data-hud-clock]");
  if (!node) return;
  const tick = () => {
    node.textContent = new Date().toISOString().slice(11, 19);
  };
  tick();
  setInterval(tick, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  renderGames(window.GAMES || []);
  renderAbout();
  renderSkills();
  renderExperience();
  renderContact();
  initFilters();
  initProject();
  initNav();
  initReveals();
  initClock();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
