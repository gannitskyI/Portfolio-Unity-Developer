const I18N = {
  en: {
    skip: "Skip to games",
    nav: {
      home: "Home",
      games: "Games",
      about: "About",
      skills: "Skills",
      experience: "Experience",
      contact: "Contact",
      menu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      hudScene: "SCENE // HERO",
      hudTech: "UNITY / C# / WEBGL",
      hudViewport: "VIEWPORT 16:9",
      eyebrow: "Available for studios & collaborations",
      ctaGames: "View my games",
      ctaContact: "Contact me",
      portraitAlt: "Portrait of Ilya Gannitsky",
      badge: "Unity developer",
    },
    games: {
      eyebrow: "Selected work",
      title: "Games",
      lead: "Play every title right here in the browser — prototypes and a full Unity WebGL build.",
      empty: "No games in this category yet.",
      featured: "Featured",
      play: "Play",
      view: "View project",
    },
    filters: {
      ALL: "All",
      WEBGL: "WebGL",
      MOBILE: "Mobile",
      UNITY: "Unity",
      CASUAL: "Casual",
      ACTION: "Action",
      OTHER: "Other",
    },
    about: {
      eyebrow: "Profile",
      title: "About me",
    },
    skills: {
      eyebrow: "Stack",
      title: "Skills",
    },
    experience: {
      eyebrow: "Track record",
      title: "Experience",
    },
    contact: {
      eyebrow: "Next step",
      title: "Let’s build something great",
      lead: "Have a project, opportunity or just want to talk game development?",
      email: "Email me",
    },
    footer: {
      copy: "Built to ship games",
    },
    project: {
      close: "Close",
      play: "Play in browser",
      playExternal: "Open original build",
      view: "View project",
      github: "GitHub",
      role: "Role",
      features: "Features",
      screenshots: "Screenshots",
      prototype: "Playable prototype of the core loop — built for this site so you can try the mechanic instantly.",
      embed: "Full Unity WebGL build, running on this page.",
    },
    play: {
      start: "Play",
      restart: "Play again",
      pause: "Paused",
      score: "Score",
      best: "Best",
      wave: "Wave",
      hp: "HP",
      coins: "Coins",
      hand: "Hand",
      ghost: "Ghost",
      you: "You",
      win: "You win",
      lose: "Game over",
      touch: "On-screen stick + buttons work on mobile.",
      phantomHint: "Drive a clean lap. Then race your ghost.",
      phantomGo: "Lap 1 — set the ghost",
      phantomRace: "Lap 2 — beat the ghost",
      knightHint: "Clear the dungeon. WASD move, slash to attack.",
      pokerHint: "Survive the arena. Collect cards — better poker hands deal more damage.",
      warHint: "Unity WebGL survivor prototype. Click to focus the game, then play.",
    },
  },
  ru: {
    skip: "К играм",
    nav: {
      home: "Главная",
      games: "Игры",
      about: "Обо мне",
      skills: "Навыки",
      experience: "Опыт",
      contact: "Контакты",
      menu: "Открыть меню",
      closeMenu: "Закрыть меню",
    },
    hero: {
      hudScene: "СЦЕНА // ГЕРОЙ",
      hudTech: "UNITY / C# / WEBGL",
      hudViewport: "ЭКРАН 16:9",
      eyebrow: "Открыт к студиям и коллаборациям",
      ctaGames: "Смотреть игры",
      ctaContact: "Связаться",
      portraitAlt: "Портрет Ильи Ганницкого",
      badge: "Unity-разработчик",
    },
    games: {
      eyebrow: "Избранные работы",
      title: "Игры",
      lead: "Во все прототипы и игры можно поиграть прямо здесь, в браузере — включая полноценную Unity WebGL-сборку.",
      empty: "В этой категории пока нет игр.",
      featured: "Избранное",
      play: "Играть",
      view: "Смотреть проект",
    },
    filters: {
      ALL: "Все",
      WEBGL: "WebGL",
      MOBILE: "Мобильные",
      UNITY: "Unity",
      CASUAL: "Казуальные",
      ACTION: "Экшен",
      OTHER: "Другое",
    },
    about: {
      eyebrow: "Профиль",
      title: "Обо мне",
    },
    skills: {
      eyebrow: "Стек",
      title: "Навыки",
    },
    experience: {
      eyebrow: "Опыт",
      title: "Опыт",
    },
    contact: {
      eyebrow: "Следующий шаг",
      title: "Давайте сделаем что-то сильное",
      lead: "Есть проект, вакансия или просто хотите поговорить про разработку игр?",
      email: "Написать на почту",
    },
    footer: {
      copy: "Сделано, чтобы выпускать игры",
    },
    project: {
      close: "Закрыть",
      play: "Играть в браузере",
      playExternal: "Открыть оригинальную сборку",
      view: "Проект",
      github: "GitHub",
      role: "Роль",
      features: "Особенности",
      screenshots: "Скриншоты",
      prototype: "Игровой прототип основного цикла — чтобы механику можно было попробовать сразу на сайте.",
      embed: "Полная Unity WebGL-сборка, запущена на этой странице.",
    },
    play: {
      start: "Играть",
      restart: "Ещё раз",
      pause: "Пауза",
      score: "Счёт",
      best: "Рекорд",
      wave: "Волна",
      hp: "HP",
      coins: "Монеты",
      hand: "Комбинация",
      ghost: "Призрак",
      you: "Вы",
      win: "Победа",
      lose: "Поражение",
      touch: "На телефоне работают стик и кнопки на экране.",
      phantomHint: "Проедьте чистый круг — затем гонка со своим призраком.",
      phantomGo: "Круг 1 — запишите призрак",
      phantomRace: "Круг 2 — обыграйте призрак",
      knightHint: "Зачистите подземелье. WASD — движение, удар — атака.",
      pokerHint: "Выживите на арене. Собирайте карты: чем сильнее покерная комбинация, тем выше урон.",
      warHint: "Unity WebGL-прототип выживалки. Кликните, чтобы сфокусировать игру.",
    },
  },
};

const LANG_KEY = "portfolio-lang";

function detectLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "ru" || saved === "en") return saved;
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("ru") ? "ru" : "en";
}

let currentLang = detectLang();

function getLang() {
  return currentLang;
}

function getPath(object, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), object);
}

function t(path) {
  return getPath(I18N[currentLang], path) || getPath(I18N.en, path) || path;
}

function loc(value) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map((item) => loc(item));
  if (typeof value === "object") {
    if ("en" in value || "ru" in value) {
      return value[currentLang] || value.en || value.ru || "";
    }
  }
  return String(value);
}

function applyStaticI18n() {
  document.documentElement.lang = currentLang === "ru" ? "ru" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = t(node.dataset.i18n);
    if (value) node.textContent = value;
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
    const attr = node.dataset.i18nAttr;
    const key = node.dataset.i18nAttrKey || node.dataset.i18n;
    if (attr && key) node.setAttribute(attr, t(key));
  });
  document.querySelectorAll(".lang__btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === currentLang);
    button.setAttribute("aria-pressed", button.dataset.lang === currentLang ? "true" : "false");
  });
  document.querySelectorAll("[data-portrait]").forEach((img) => {
    img.alt = t("hero.portraitAlt");
  });
}

function setLang(lang) {
  if (lang !== "ru" && lang !== "en") return;
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  applyStaticI18n();
  document.dispatchEvent(new CustomEvent("portfolio:lang", { detail: { lang } }));
}

window.I18N = I18N;
window.t = t;
window.loc = loc;
window.getLang = getLang;
window.setLang = setLang;
window.applyStaticI18n = applyStaticI18n;
window.getPath = getPath;
