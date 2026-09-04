# Ilya Gannitsky — Game Developer Portfolio

Personal portfolio for GitHub Pages. Dark, cinematic, and built so you can add a new game without touching HTML.

Live stack: HTML, CSS, JavaScript. No build step, no server.

## Local preview

Open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

Any other static server works. Double-opening `index.html` as a file can block some assets in strict browsers, so a local server is better.

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Choose `main` (or your default branch) and folder `/ (root)`.
5. Save. After a minute the site is at:

`https://<username>.github.io/<repository>/`

The site uses relative paths, so it also works in a project subdirectory.

## Where to change contacts and personal info

Edit **`data/config.js`** only.

There you can change:

- name, role, tagline, summary
- email
- Telegram, GitHub, LinkedIn (and optional itch / X / YouTube)
- About text, focus list, competency bars
- Skills
- Experience

Empty links are hidden automatically. If `email` is empty, the Email button is not shown.

## HOW TO ADD A NEW GAME

You do **not** need to edit HTML.

### 1. Create a folder

```
assets/games/my-new-game/
```

Use a short slug: lowercase, hyphens, no spaces.

### 2. Add a cover

Put a wide image here:

```
assets/games/my-new-game/cover.webp
```

Recommended: 1600×900 or similar, WebP or JPG.

### 3. Add screenshots (optional)

```
assets/games/my-new-game/screenshots/01.webp
assets/games/my-new-game/screenshots/02.webp
```

You can also add a gameplay video:

```
assets/games/my-new-game/gameplay.mp4
```

Keep videos short and compressed (a few MB).

### 4. Open `data/games.js`

### 5. Copy an existing game object

Paste a new object into the `GAMES` array. A comment in the file marks the place.

### 6. Fill in your information

```js
{
  title: "My New Game",
  slug: "my-new-game",
  description: "One short sentence for the card.",
  longDescription: "Longer text for the project page.",
  image: "assets/games/my-new-game/cover.webp",
  screenshots: [
    "assets/games/my-new-game/screenshots/01.webp"
  ],
  video: "",
  genre: "Action",
  categories: ["WEBGL", "UNITY", "ACTION"],
  platforms: ["WebGL", "Android"],
  technologies: ["Unity", "C#", "WebGL"],
  status: "Published",
  featured: false,
  role: "Solo developer — gameplay, systems, UI",
  features: [
    "Feature one",
    "Feature two"
  ],
  links: {
    play: "https://...",
    project: "",
    github: "https://github.com/..."
  }
}
```

`slug` must match the folder name.

Available filter categories:

`WEBGL` · `MOBILE` · `UNITY` · `CASUAL` · `ACTION` · `OTHER`

Set `featured: true` to make a project span the full gallery width.

Leave `play`, `project` or `github` empty if you do not have a link yet.

### 7. Commit and push

```bash
git add assets/games/my-new-game data/games.js
git commit -m "Add My New Game"
git push
```

### 8. GitHub Pages updates automatically

Wait for the Pages build to finish, then refresh the site.

## Images you should replace

These covers are placeholders (key art), except KnightGame, which uses real gameplay frames:

| File | What to put there |
| --- | --- |
| `assets/games/phantom-rivals/cover.webp` | Real cover or screenshot of Phantom Rivals |
| `assets/games/pokershot-3d/cover.webp` | Real cover or screenshot of PokerShot 3D |
| `assets/games/telegram-war/cover.webp` | Real cover or screenshot of Telegram War |
| `assets/games/knightgame/cover.webp` | Already a real capture. Replace if you have a better one |
| `assets/games/*/screenshots/` | Extra in-game screenshots |
| `assets/images/og.jpg` | Social preview image (1200×630) |
| `assets/icons/favicon.svg` | Your own favicon if you want |

Also add playable links in `data/games.js` when a Yandex Games / store page is ready (`links.play`).

Add your email in `data/config.js`.

## Project structure

```
.
├── index.html
├── 404.html
├── css/
│   ├── style.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── games.js
│   ├── filters.js
│   └── project.js
├── data/
│   ├── games.js      ← all games
│   └── config.js     ← name, contacts, about, skills
├── assets/
│   ├── games/
│   ├── images/
│   └── icons/
└── README.md
```

Game details open as an overlay (`#/game/your-slug`). That works on GitHub Pages without extra routing.
