function getPath(object, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), object);
}

function applyConfig() {
  const config = window.CONFIG || {};
  document.querySelectorAll("[data-config]").forEach((node) => {
    const value = getPath(config, node.dataset.config);
    if (typeof value === "string" && value) node.textContent = value;
  });

  const nameNode = document.querySelector(".hero__name");
  if (nameNode && config.name) {
    nameNode.innerHTML = config.name
      .split(" ")
      .map((part) => `<span>${escapeHtml(part)}</span>`)
      .join("");
  }

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
      .map((item) => {
        const ticks = Array.from({ length: 5 }, (_, index) =>
          `<i class="${index < item.level ? "is-on" : ""}"></i>`
        ).join("");
        return `
        <div class="comp">
          <span>${escapeHtml(item.name)}</span>
          <div class="comp__ticks" aria-label="${item.level} of 5">${ticks}</div>
        </div>`;
      })
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

function icon(name) {
  const icons = {
    mail: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm8 7 8-5H4z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9.04 15.3 8.9 19.1c.4 0 .58-.17.79-.38l1.9-1.84 3.94 2.9c.72.4 1.24.19 1.43-.67l2.6-12.24c.23-1.04-.38-1.45-1.07-1.2L3.7 10.16c-1 .4-.99.96-.17 1.22l4.1 1.28 9.52-6c.45-.27.86-.12.52.18z"/></svg>',
    github: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6.5 9H4v11h2.5zM5.25 3.5A1.75 1.75 0 1 0 5.26 7a1.75 1.75 0 0 0 0-3.5zM20 20h-2.5v-5.8c0-1.38-.03-3.16-1.93-3.16-1.93 0-2.23 1.5-2.23 3.06V20H11V9h2.4v1.5h.03c.33-.63 1.15-1.3 2.37-1.3 2.54 0 3.2 1.67 3.2 3.84z"/></svg>',
  };
  return icons[name] || "";
}

function renderContact() {
  const root = document.getElementById("contact-actions");
  if (!root) return;
  const social = CONFIG.social || {};
  const items = [];

  if (CONFIG.email) {
    items.push(`<a class="btn btn--primary" href="mailto:${escapeHtml(CONFIG.email)}">${icon("mail")} Email me</a>`);
  }
  if (social.telegram) {
    items.push(`<a class="btn btn--ghost" href="${escapeHtml(social.telegram)}" target="_blank" rel="noopener">${icon("telegram")} Telegram</a>`);
  }
  if (social.github) {
    items.push(`<a class="btn btn--ghost" href="${escapeHtml(social.github)}" target="_blank" rel="noopener">${icon("github")} GitHub</a>`);
  }
  if (social.linkedin) {
    items.push(`<a class="btn btn--ghost" href="${escapeHtml(social.linkedin)}" target="_blank" rel="noopener">${icon("linkedin")} LinkedIn</a>`);
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
  nodes.forEach((node, index) => {
    if (node.classList.contains("game-card")) {
      node.style.transitionDelay = `${Math.min(index, 6) * 70}ms`;
    }
    io.observe(node);
  });
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
