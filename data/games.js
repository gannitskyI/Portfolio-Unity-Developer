const GAMES = window.GAMES = [
  // ---------------------------------------------------------------------------
  // Add a new game here.
  // 1. Copy one of the objects below.
  // 2. Change title, slug, description, image, categories, platforms, etc.
  // 3. Put cover.webp (and optional screenshots) into assets/games/<slug>/
  // 4. Commit and push. GitHub Pages will update automatically.
  // ---------------------------------------------------------------------------
  {
    title: "Phantom Rivals",
    slug: "phantom-rivals",
    description:
      "Top-down racing for Yandex Games. Players take turns, then race against a ghost of the previous run.",
    longDescription:
      "A browser racing game built in Unity for the Yandex Games platform. The core twist is turn-based racing: one player drives a lap, then the next player races against a ghost recording of that run. The project includes car selection, a shop, AI opponents, lap and checkpoint flow, mobile controls and Yandex Games SDK integration.",
    image: "assets/games/phantom-rivals/cover.webp",
    screenshots: [],
    video: "",
    genre: "Racing",
    categories: ["WEBGL", "UNITY", "ACTION"],
    platforms: ["WebGL", "Yandex Games", "Mobile"],
    technologies: ["Unity", "C#", "WebGL", "DOTween", "A* Pathfinding", "Yandex Games SDK"],
    status: "Published",
    featured: true,
    role: "Solo developer — gameplay, systems, UI, publishing",
    features: [
      "Ghost racing: take turns, then compete against a recorded run",
      "Car selection, shop and progression",
      "AI opponents with path following",
      "Mobile-ready controls and WebGL build",
      "Yandex Games SDK (ads, rewards, platform services)",
    ],
    links: {
      play: "",
      project: "",
      github: "https://github.com/gannitskyI/Phantom-Rivals_",
    },
  },
  {
    title: "KnightGame",
    slug: "knightgame",
    description:
      "Top-down dungeon action for Yandex Games. Explore rooms, collect coins, fight enemies and upgrade your knight.",
    longDescription:
      "A 2D top-down dungeon crawler published for Yandex Games. You control a knight through tiled rooms, collecting coins, avoiding hazards and fighting enemies. The project covers player combat, shop upgrades, mobile joystick controls, localization and the Yandex Games SDK.",
    image: "assets/games/knightgame/cover.webp",
    screenshots: [
      "assets/games/knightgame/screenshots/01.webp",
      "assets/games/knightgame/screenshots/02.webp",
      "assets/games/knightgame/screenshots/03.webp",
      "assets/games/knightgame/screenshots/04.webp",
    ],
    video: "assets/games/knightgame/gameplay.mp4",
    genre: "Action",
    categories: ["WEBGL", "UNITY", "ACTION", "CASUAL", "MOBILE"],
    platforms: ["WebGL", "Yandex Games", "Mobile"],
    technologies: ["Unity", "C#", "WebGL", "uGUI", "Yandex Games SDK"],
    status: "Published",
    featured: false,
    role: "Solo developer — gameplay, systems, UI, publishing",
    features: [
      "Top-down dungeon exploration and combat",
      "Collectibles, hazards and enemy encounters",
      "Knight shop and upgrades",
      "Mobile joystick controls",
      "Yandex Games SDK integration",
    ],
    links: {
      play: "",
      project: "",
      github: "https://github.com/gannitskyI/KnightGame",
    },
  },
  {
    title: "PokerShot 3D",
    slug: "pokershot-3d",
    description:
      "A 3D arena hybrid: auto-shooter combat mixed with poker hands, chips and combo scoring.",
    longDescription:
      "An experimental 3D prototype that mixes arena auto-shooter combat with poker evaluation. Waves of enemies, chip pickups, combo effects and a poker hand HUD sit on top of a Unity Addressables setup. Currently in active development as an arena prototype.",
    image: "assets/games/pokershot-3d/cover.webp",
    screenshots: [],
    video: "",
    genre: "Action",
    categories: ["UNITY", "ACTION", "WEBGL"],
    platforms: ["WebGL"],
    technologies: ["Unity", "C#", "Addressables", "DOTween"],
    status: "In development",
    featured: false,
    role: "Solo developer — gameplay, combat systems, UI",
    features: [
      "Auto-shooter combat in a 3D arena",
      "Poker hand evaluation tied to gameplay",
      "Chip magnet collectibles and combo effects",
      "Wave spawning and run state flow",
      "Addressables-based content loading",
    ],
    links: {
      play: "",
      project: "",
      github: "https://github.com/gannitskyI/PokerShot3D",
    },
  },
  {
    title: "Telegram War",
    slug: "telegram-war",
    description:
      "A Telegram Mini App survivor prototype: waves of enemies, upgrades and a structured game loop.",
    longDescription:
      "A Unity WebGL prototype built for Telegram Mini Apps. The player survives waves of enemies, collects experience and picks upgrades between rounds. The codebase is organized around a game state machine, service locator, enemy factory/pool and Addressables. A playable build is hosted on Vercel.",
    image: "assets/games/telegram-war/cover.webp",
    screenshots: [],
    video: "",
    genre: "Action",
    categories: ["WEBGL", "UNITY", "ACTION", "MOBILE", "OTHER"],
    platforms: ["WebGL", "Telegram"],
    technologies: ["Unity", "C#", "WebGL", "Addressables", "Telegram Mini Apps"],
    status: "Playable demo",
    featured: false,
    role: "Solo developer — architecture, combat, systems",
    features: [
      "Wave-based survivor loop with difficulty scaling",
      "Upgrade selection between rounds",
      "Enemy factory, pooling and combat pipeline",
      "Game state machine (menu, gameplay, game over)",
      "Telegram WebApp bootstrap for Mini App play",
    ],
    links: {
      play: "https://telegram-war.vercel.app",
      project: "https://telegram-war.vercel.app",
      github: "https://github.com/gannitskyI/TelegramWar",
    },
  },
];
