const Playable = (() => {
  let active = null;

  const RANK_NAMES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const HAND_EN = {
    high: "High card",
    pair: "Pair",
    two: "Two pair",
    three: "Three of a kind",
    straight: "Straight",
    flush: "Flush",
    full: "Full house",
    four: "Four of a kind",
    straightflush: "Straight flush",
  };
  const HAND_RU = {
    high: "Старшая карта",
    pair: "Пара",
    two: "Две пары",
    three: "Сет",
    straight: "Стрит",
    flush: "Флеш",
    full: "Фулл-хаус",
    four: "Каре",
    straightflush: "Стрит-флеш",
  };

  function handName(key) {
    return (getLang() === "ru" ? HAND_RU : HAND_EN)[key] || key;
  }

  function stop() {
    if (!active) return;
    active.stopped = true;
    if (active.raf) cancelAnimationFrame(active.raf);
    active.cleanup?.();
    active.wrap?.remove();
    active = null;
  }

  function mount(container, game) {
    stop();
    if (!container || !game?.play) return;

    const wrap = document.createElement("div");
    wrap.className = "play-stage";
    wrap.innerHTML = `
      <div class="play-stage__frame">
        <div class="play-stage__media"></div>
        <div class="play-stage__hud"></div>
        <div class="play-stage__overlay"></div>
      </div>
      <p class="play-stage__help"></p>
      <div class="play-stage__touch" hidden>
        <div class="play-stick" data-stick>
          <span></span>
        </div>
        <button class="play-action" type="button" data-action>ATK</button>
      </div>
    `;
    container.appendChild(wrap);

    const media = wrap.querySelector(".play-stage__media");
    const hud = wrap.querySelector(".play-stage__hud");
    const overlay = wrap.querySelector(".play-stage__overlay");
    const help = wrap.querySelector(".play-stage__help");
    const touch = wrap.querySelector(".play-stage__touch");
    const keys = { up: false, down: false, left: false, right: false, action: false, ax: 0, ay: 0 };

    const session = {
      wrap,
      media,
      hud,
      overlay,
      help,
      touch,
      keys,
      game,
      stopped: false,
      raf: 0,
      started: false,
      startFn: null,
      cleanup: () => {},
    };
    active = session;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch && game.play.type === "canvas") touch.hidden = false;

    bindInput(session);

    if (game.play.type === "embed") {
      setupEmbed(session);
    } else {
      setupCanvas(session);
    }
  }

  function start() {
    if (!active) return;
    const btn = active.overlay.querySelector("[data-start]");
    btn?.click();
  }

  function bindInput(session) {
    const { keys, wrap, touch } = session;
    const onDown = (event) => mapKey(event.code, true, keys, event);
    const onUp = (event) => mapKey(event.code, false, keys, event);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    const stick = touch.querySelector("[data-stick]");
    const action = touch.querySelector("[data-action]");
    let pointerId = null;

    const setStick = (clientX, clientY) => {
      const rect = stick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = (clientX - cx) / (rect.width / 2);
      let dy = (clientY - cy) / (rect.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      if (len > 1) {
        dx /= len;
        dy /= len;
      }
      keys.ax = dx;
      keys.ay = dy;
      keys.left = dx < -0.3;
      keys.right = dx > 0.3;
      keys.up = dy < -0.3;
      keys.down = dy > 0.3;
      const knob = stick.querySelector("span");
      knob.style.transform = `translate(${dx * 18}px, ${dy * 18}px)`;
    };

    const endStick = () => {
      pointerId = null;
      keys.ax = keys.ay = 0;
      keys.left = keys.right = keys.up = keys.down = false;
      stick.querySelector("span").style.transform = "";
    };

    stick.addEventListener("pointerdown", (event) => {
      pointerId = event.pointerId;
      stick.setPointerCapture(event.pointerId);
      setStick(event.clientX, event.clientY);
    });
    stick.addEventListener("pointermove", (event) => {
      if (event.pointerId === pointerId) setStick(event.clientX, event.clientY);
    });
    stick.addEventListener("pointerup", endStick);
    stick.addEventListener("pointercancel", endStick);

    const press = (value) => {
      keys.action = value;
    };
    action.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      press(true);
    });
    action.addEventListener("pointerup", () => press(false));
    action.addEventListener("pointercancel", () => press(false));

    session.cleanup = () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      wrap.remove();
    };
  }

  function mapKey(code, down, keys, event) {
    const map = {
      KeyW: "up",
      ArrowUp: "up",
      KeyS: "down",
      ArrowDown: "down",
      KeyA: "left",
      ArrowLeft: "left",
      KeyD: "right",
      ArrowRight: "right",
      Space: "action",
      KeyJ: "action",
    };
    const name = map[code];
    if (!name) return;
    if (!document.body.classList.contains("project-open")) return;
    if (event) event.preventDefault();
    keys[name] = down;
  }

  function showStart(session, hint, onStart) {
    session.overlay.hidden = false;
    session.overlay.innerHTML = `
      <p>${escapeHtml(hint)}</p>
      <p class="play-stage__micro">${escapeHtml(t("play.touch"))}</p>
      <button class="btn btn--primary" type="button" data-start>${escapeHtml(t("play.start"))}</button>
    `;
    session.startFn = onStart;
    session.overlay.querySelector("[data-start]").addEventListener("click", () => {
      session.overlay.hidden = true;
      session.started = true;
      onStart();
    });
  }

  function showEnd(session, title, detail, onRetry) {
    session.overlay.hidden = false;
    session.overlay.innerHTML = `
      <p class="play-stage__end">${escapeHtml(title)}</p>
      <p>${escapeHtml(detail)}</p>
      <button class="btn btn--primary" type="button" data-start>${escapeHtml(t("play.restart"))}</button>
    `;
    session.overlay.querySelector("[data-start]").addEventListener("click", () => {
      session.overlay.hidden = true;
      onRetry();
    });
  }

  function setupEmbed(session) {
    const src = session.game.play.src;
    session.help.textContent = t("play.warHint");
    session.overlay.innerHTML = "";
    session.overlay.hidden = true;
    session.media.innerHTML = `
      <iframe
        class="play-stage__iframe"
        title="${escapeHtml(session.game.title)}"
        src="${escapeHtml(src)}"
        allow="autoplay; gamepad; keyboard-map"
        allowfullscreen
        loading="eager"
      ></iframe>
    `;
    session.hud.textContent = session.game.title;
  }

  function setupCanvas(session) {
    const canvas = document.createElement("canvas");
    canvas.className = "play-stage__canvas";
    canvas.setAttribute("tabindex", "0");
    session.media.appendChild(canvas);
    session.canvas = canvas;
    session.ctx = canvas.getContext("2d");
    resizeCanvas(session);
    const onResize = () => resizeCanvas(session);
    window.addEventListener("resize", onResize);
    const prevCleanup = session.cleanup;
    session.cleanup = () => {
      window.removeEventListener("resize", onResize);
      prevCleanup();
    };

    const starters = {
      "phantom-rivals": startPhantom,
      knightgame: startKnight,
      "pokershot-3d": startPoker,
    };
    const startGame = starters[session.game.slug] || startPhantom;
    startGame(session);
  }

  function resizeCanvas(session) {
    const canvas = session.canvas;
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(320, Math.floor(rect.width));
    const h = Math.max(240, Math.floor(rect.width * 0.56));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    session.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    session.w = w;
    session.h = h;
  }

  function loop(session, update) {
    let last = performance.now();
    const tick = (now) => {
      if (session.stopped) return;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      update(dt);
      session.raf = requestAnimationFrame(tick);
    };
    session.raf = requestAnimationFrame(tick);
  }

  function axis(keys) {
    let x = keys.ax || 0;
    let y = keys.ay || 0;
    if (keys.left) x = -1;
    if (keys.right) x = 1;
    if (keys.up) y = -1;
    if (keys.down) y = 1;
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    return { x, y };
  }

  function startPhantom(session) {
    session.help.textContent = t("play.phantomHint");
    const car = { x: 0, y: 0, a: -Math.PI / 2, v: 0 };
    let ghost = [];
    let record = [];
    let mode = "idle";
    let lap = 0;
    let armed = false;
    let time = 0;
    let ghostTime = 0;
    let ghostIndex = 0;

    const resetCar = () => {
      const { w, h } = session;
      car.x = w * 0.5;
      car.y = h * 0.78;
      car.a = -Math.PI / 2;
      car.v = 0;
    };

    const beginRecord = () => {
      mode = "record";
      lap = 0;
      armed = false;
      time = 0;
      record = [];
      resetCar();
      session.hud.textContent = t("play.phantomGo");
    };

    const beginRace = () => {
      mode = "race";
      lap = 0;
      armed = false;
      time = 0;
      ghostIndex = 0;
      resetCar();
      session.hud.textContent = t("play.phantomRace");
    };

    showStart(session, t("play.phantomHint"), beginRecord);

    loop(session, (dt) => {
      const { ctx, w, h, keys } = session;
      const cx = w / 2;
      const cy = h / 2;
      const outer = Math.min(w, h) * 0.42;
      const inner = outer * 0.52;
      const onTrack = (x, y) => {
        const r = Math.hypot(x - cx, y - cy);
        return r > inner && r < outer;
      };

      if (mode === "record" || mode === "race") {
        const steer = (keys.left ? -1 : 0) + (keys.right ? 1 : 0) + (keys.ax || 0);
        const throttle = keys.up || keys.action || keys.ay < -0.25;
        const brake = keys.down || keys.ay > 0.45;
        if (throttle) car.v += 220 * dt;
        if (brake) car.v -= 280 * dt;
        car.v *= 1 - 1.6 * dt;
        car.v = Math.max(-40, Math.min(260, car.v));
        car.a += steer * (2.4 - Math.min(1.2, car.v / 220)) * dt;
        const nx = car.x + Math.cos(car.a) * car.v * dt;
        const ny = car.y + Math.sin(car.a) * car.v * dt;
        if (onTrack(nx, ny)) {
          car.x = nx;
          car.y = ny;
        } else {
          car.v *= 0.35;
        }
        time += dt;

        const startY = cy + (outer + inner) / 2;
        const nearStart = Math.abs(car.x - cx) < 28 && Math.abs(car.y - startY) < 22;
        if (nearStart && car.v > 18 && armed) {
          armed = false;
          lap += 1;
          if (mode === "record" && lap >= 1) {
            ghost = record.slice();
            ghostTime = time;
            showEnd(session, t("play.phantomRace"), `${time.toFixed(2)}s`, beginRace);
            mode = "idle";
          } else if (mode === "race" && lap >= 1) {
            const won = time <= ghostTime + 0.05;
            showEnd(
              session,
              won ? t("play.win") : t("play.lose"),
              `${t("play.you")} ${time.toFixed(2)}s · ${t("play.ghost")} ${ghostTime.toFixed(2)}s`,
              beginRecord
            );
            mode = "idle";
          }
        }
        if (!nearStart) armed = true;

        if (mode === "record") {
          record.push({ x: car.x, y: car.y, a: car.a, t: time });
          session.hud.textContent = `${t("play.phantomGo")} · ${time.toFixed(1)}s`;
        }
        if (mode === "race") {
          while (ghostIndex < ghost.length - 1 && ghost[ghostIndex].t < time) ghostIndex += 1;
          session.hud.textContent = `${t("play.phantomRace")} · ${time.toFixed(1)}s / ${ghostTime.toFixed(1)}s`;
        }
      }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0b0d12";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(212,176,122,0.18)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i += 1) {
        ctx.beginPath();
        ctx.arc(cx, cy, inner + ((outer - inner) * i) / 7, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, outer, 0, Math.PI * 2);
      ctx.strokeStyle = "#d4b07a";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, inner, 0, Math.PI * 2);
      ctx.strokeStyle = "#7ec8c4";
      ctx.lineWidth = 3;
      ctx.stroke();

      const startY = cy + (outer + inner) / 2;
      ctx.fillStyle = "#f1ece3";
      ctx.fillRect(cx - 18, startY - 4, 36, 8);

      const drawCar = (c, color, glow) => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.a);
        ctx.shadowColor = glow;
        ctx.shadowBlur = 14;
        ctx.fillStyle = color;
        ctx.fillRect(-10, -6, 20, 12);
        ctx.fillStyle = "#111";
        ctx.fillRect(4, -4, 6, 8);
        ctx.restore();
      };

      if (mode === "race" && ghost[ghostIndex]) drawCar(ghost[ghostIndex], "#7ec8c4", "#7ec8c4");
      drawCar(car, "#d4b07a", "#efd09a");
    });
  }

  function startKnight(session) {
    session.help.textContent = t("play.knightHint");
    const TILE = 36;
    let map, player, enemies, coins, slash, wave, best, iFrames;

    const carve = (cols, rows) => {
      const grid = Array.from({ length: rows }, () => Array(cols).fill(1));
      for (let y = 1; y < rows - 1; y += 1) {
        for (let x = 1; x < cols - 1; x += 1) {
          grid[y][x] = Math.random() < 0.1 ? 1 : 0;
        }
      }
      const mx = Math.floor(cols / 2);
      const my = Math.floor(rows / 2);
      for (let y = my - 1; y <= my + 1; y += 1) {
        for (let x = mx - 1; x <= mx + 1; x += 1) {
          if (grid[y] && grid[y][x] !== undefined) grid[y][x] = 0;
        }
      }
      return grid;
    };

    const blocked = (x, y) => {
      const tx = Math.floor(x / TILE);
      const ty = Math.floor(y / TILE);
      if (ty < 0 || tx < 0 || ty >= map.length || tx >= map[0].length) return true;
      return map[ty][tx] === 1;
    };

    const spawnWave = (index) => {
      enemies = [];
      coins = [];
      const cols = map[0].length;
      const rows = map.length;
      const count = 3 + index * 2;
      const minDist = Math.min(session.w, session.h) * 0.38;
      for (let i = 0; i < count; i += 1) {
        let x;
        let y;
        let tries = 0;
        do {
          x = (1 + Math.random() * (cols - 2)) * TILE + TILE / 2;
          y = (1 + Math.random() * (rows - 2)) * TILE + TILE / 2;
          tries += 1;
        } while ((blocked(x, y) || Math.hypot(x - player.x, y - player.y) < minDist) && tries < 40);
        enemies.push({ x, y, hp: 2 + Math.floor(index / 2) });
      }
      for (let i = 0; i < 5; i += 1) {
        let x;
        let y;
        do {
          x = (1 + Math.random() * (cols - 2)) * TILE + TILE / 2;
          y = (1 + Math.random() * (rows - 2)) * TILE + TILE / 2;
        } while (blocked(x, y));
        coins.push({ x, y });
      }
    };

    const begin = () => {
      const cols = Math.max(11, Math.floor(session.w / TILE));
      const rows = Math.max(7, Math.floor(session.h / TILE));
      map = carve(cols, rows);
      player = {
        x: (cols / 2) * TILE,
        y: (rows / 2) * TILE,
        hp: 5,
        coins: 0,
        facing: 0,
        cool: 0,
      };
      slash = null;
      wave = 1;
      iFrames = 1.6;
      spawnWave(1);
      session.hud.textContent = `${t("play.wave")} 1`;
    };

    best = Number(localStorage.getItem("knight-best") || 0);
    showStart(session, t("play.knightHint"), begin);

    loop(session, (dt) => {
      const { ctx, w, h, keys } = session;
      if (!player) {
        ctx.fillStyle = "#0b0d12";
        ctx.fillRect(0, 0, w, h);
        return;
      }

      const move = axis(keys);
      const speed = 150;
      const nx = player.x + move.x * speed * dt;
      const ny = player.y + move.y * speed * dt;
      if (!blocked(nx, player.y)) player.x = nx;
      if (!blocked(player.x, ny)) player.y = ny;
      if (move.x || move.y) player.facing = Math.atan2(move.y, move.x);
      player.cool = Math.max(0, player.cool - dt);

      if (keys.action && player.cool <= 0) {
        player.cool = 0.35;
        slash = { t: 0.18, a: player.facing };
        enemies.forEach((enemy) => {
          const dx = enemy.x - player.x;
          const dy = enemy.y - player.y;
          const dist = Math.hypot(dx, dy);
          const ang = Math.atan2(dy, dx);
          let diff = Math.abs(ang - slash.a);
          diff = Math.min(diff, Math.PI * 2 - diff);
          if (dist < 54 && diff < 0.9) enemy.hp -= 1;
        });
        enemies = enemies.filter((enemy) => enemy.hp > 0);
      }
      if (slash) {
        slash.t -= dt;
        if (slash.t <= 0) slash = null;
      }

      enemies.forEach((enemy) => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = enemy.x + (dx / dist) * 70 * dt;
        const ny = enemy.y + (dy / dist) * 70 * dt;
        if (!blocked(nx, enemy.y)) enemy.x = nx;
        if (!blocked(enemy.x, ny)) enemy.y = ny;
      });

      iFrames = Math.max(0, iFrames - dt);
      if (iFrames <= 0) {
        const touching = enemies.some((enemy) => Math.hypot(enemy.x - player.x, enemy.y - player.y) < 22);
        if (touching) player.hp -= dt * 0.7;
      }

      coins = coins.filter((coin) => {
        if (Math.hypot(coin.x - player.x, coin.y - player.y) < 18) {
          player.coins += 1;
          return false;
        }
        return true;
      });

      if (enemies.length === 0 && player.hp > 0) {
        wave += 1;
        player.hp = Math.min(5, player.hp + 1);
        iFrames = 1.2;
        spawnWave(wave);
      }

      if (player.hp <= 0) {
        best = Math.max(best, player.coins);
        localStorage.setItem("knight-best", String(best));
        showEnd(
          session,
          t("play.lose"),
          `${t("play.coins")} ${player.coins} · ${t("play.best")} ${best}`,
          begin
        );
        player = null;
      } else {
        session.hud.textContent = `${t("play.wave")} ${wave} · ${t("play.hp")} ${Math.ceil(player.hp)} · ${t("play.coins")} ${player.coins}`;
      }

      ctx.fillStyle = "#10131a";
      ctx.fillRect(0, 0, w, h);
      if (!map) return;
      for (let y = 0; y < map.length; y += 1) {
        for (let x = 0; x < map[0].length; x += 1) {
          ctx.fillStyle = map[y][x] ? "#1c1712" : "#1a2230";
          ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
        }
      }
      coins.forEach((coin) => {
        ctx.fillStyle = "#efd09a";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
      enemies.forEach((enemy) => {
        ctx.fillStyle = "#c45c5c";
        ctx.fillRect(enemy.x - 9, enemy.y - 9, 18, 18);
      });
      if (player) {
        if (slash) {
          ctx.strokeStyle = "rgba(241,236,227,0.8)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(player.x, player.y, 40, slash.a - 0.8, slash.a + 0.8);
          ctx.stroke();
        }
        ctx.fillStyle = iFrames > 0 && Math.floor(iFrames * 8) % 2 === 0 ? "#f1ece3" : "#d4b07a";
        ctx.beginPath();
        ctx.arc(player.x, player.y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#7ec8c4";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x + Math.cos(player.facing) * 16, player.y + Math.sin(player.facing) * 16);
        ctx.stroke();
      }
    });
  }

  function evalPoker(cards) {
    if (cards.length < 5) return { key: "high", mult: 1 };
    const ranks = cards.map((c) => c.rank).sort((a, b) => a - b);
    const suits = cards.map((c) => c.suit);
    const counts = {};
    ranks.forEach((r) => {
      counts[r] = (counts[r] || 0) + 1;
    });
    const groups = Object.values(counts).sort((a, b) => b - a);
    const flush = suits.every((s) => s === suits[0]);
    const uniq = [...new Set(ranks)];
    let straight = uniq.length === 5 && uniq[4] - uniq[0] === 4;
    if (uniq.join() === "0,1,2,3,12") straight = true;
    if (straight && flush) return { key: "straightflush", mult: 6 };
    if (groups[0] === 4) return { key: "four", mult: 5 };
    if (groups[0] === 3 && groups[1] === 2) return { key: "full", mult: 4.2 };
    if (flush) return { key: "flush", mult: 3.4 };
    if (straight) return { key: "straight", mult: 3 };
    if (groups[0] === 3) return { key: "three", mult: 2.4 };
    if (groups[0] === 2 && groups[1] === 2) return { key: "two", mult: 2 };
    if (groups[0] === 2) return { key: "pair", mult: 1.5 };
    return { key: "high", mult: 1 };
  }

  function startPoker(session) {
    session.help.textContent = t("play.pokerHint");
    let player, enemies, bullets, pickups, cards, fire, time, wave;

    const begin = () => {
      player = { x: session.w / 2, y: session.h / 2, hp: 6, score: 0 };
      enemies = [];
      bullets = [];
      pickups = [];
      cards = [];
      fire = 0;
      time = 0;
      wave = 1;
    };

    showStart(session, t("play.pokerHint"), begin);

    loop(session, (dt) => {
      const { ctx, w, h, keys } = session;
      if (!player) {
        ctx.fillStyle = "#0b0d12";
        ctx.fillRect(0, 0, w, h);
        return;
      }

      time += dt;
      const move = axis(keys);
      player.x = Math.max(18, Math.min(w - 18, player.x + move.x * 190 * dt));
      player.y = Math.max(18, Math.min(h - 18, player.y + move.y * 190 * dt));

      if (enemies.length === 0) {
        const n = 4 + wave * 2;
        for (let i = 0; i < n; i += 1) {
          const side = Math.floor(Math.random() * 4);
          const x = side === 0 ? 20 : side === 1 ? w - 20 : Math.random() * w;
          const y = side === 2 ? 20 : side === 3 ? h - 20 : Math.random() * h;
          enemies.push({ x, y, hp: 2 + wave * 0.4 });
        }
        wave += 1;
      }

      const hand = evalPoker(cards);
      fire -= dt;
      if (enemies.length && fire <= 0) {
        let nearest = enemies[0];
        let bestD = Infinity;
        enemies.forEach((enemy) => {
          const d = Math.hypot(enemy.x - player.x, enemy.y - player.y);
          if (d < bestD) {
            bestD = d;
            nearest = enemy;
          }
        });
        const ang = Math.atan2(nearest.y - player.y, nearest.x - player.x);
        bullets.push({
          x: player.x,
          y: player.y,
          vx: Math.cos(ang) * 420,
          vy: Math.sin(ang) * 420,
          dmg: 1 * hand.mult,
        });
        fire = 0.22;
      }

      bullets.forEach((b) => {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      });
      bullets = bullets.filter((b) => b.x > -20 && b.x < w + 20 && b.y > -20 && b.y < h + 20);

      enemies.forEach((enemy) => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.hypot(dx, dy) || 1;
        enemy.x += (dx / dist) * (55 + wave * 6) * dt;
        enemy.y += (dy / dist) * (55 + wave * 6) * dt;
        if (dist < 20) player.hp -= dt * 1.1;
        bullets.forEach((b) => {
          if (Math.hypot(b.x - enemy.x, b.y - enemy.y) < 14) {
            enemy.hp -= b.dmg;
            b.x = -999;
          }
        });
      });

      const dead = enemies.filter((e) => e.hp <= 0);
      dead.forEach((e) => {
        player.score += 10;
        pickups.push({
          x: e.x,
          y: e.y,
          rank: Math.floor(Math.random() * 13),
          suit: Math.floor(Math.random() * 4),
        });
      });
      enemies = enemies.filter((e) => e.hp > 0);

      pickups = pickups.filter((p) => {
        const magnet = Math.hypot(p.x - player.x, p.y - player.y);
        if (magnet < 90) {
          p.x += (player.x - p.x) * dt * 6;
          p.y += (player.y - p.y) * dt * 6;
        }
        if (magnet < 18) {
          cards.push({ rank: p.rank, suit: p.suit });
          if (cards.length > 5) cards.shift();
          return false;
        }
        return true;
      });

      if (player.hp <= 0) {
        showEnd(session, t("play.lose"), `${t("play.score")} ${player.score} · ${handName(hand.key)}`, begin);
        player = null;
      } else {
        session.hud.textContent = `${t("play.score")} ${player.score} · ${t("play.hand")} ${handName(hand.key)} ×${hand.mult.toFixed(1)} · ${t("play.hp")} ${player.hp.toFixed(1)}`;
      }

      ctx.fillStyle = "#0c1018";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(212,176,122,0.08)";
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      pickups.forEach((p) => {
        ctx.fillStyle = ["#d4b07a", "#7ec8c4", "#c45c5c", "#d8d2c8"][p.suit];
        ctx.fillRect(p.x - 8, p.y - 11, 16, 22);
        ctx.fillStyle = "#111";
        ctx.font = "9px IBM Plex Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(RANK_NAMES[p.rank], p.x, p.y + 3);
      });
      enemies.forEach((e) => {
        ctx.fillStyle = "#5c6bc0";
        ctx.beginPath();
        ctx.arc(e.x, e.y, 11, 0, Math.PI * 2);
        ctx.fill();
      });
      bullets.forEach((b) => {
        ctx.fillStyle = "#efd09a";
        ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
      });
      if (player) {
        ctx.fillStyle = "#f1ece3";
        ctx.beginPath();
        ctx.arc(player.x, player.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#d4b07a";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      cards.forEach((c, i) => {
        const x = 12 + i * 34;
        const y = session.h - 52;
        ctx.fillStyle = ["#d4b07a", "#7ec8c4", "#c45c5c", "#d8d2c8"][c.suit];
        ctx.fillRect(x, y, 30, 40);
        ctx.fillStyle = "#111";
        ctx.font = "11px IBM Plex Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(RANK_NAMES[c.rank], x + 15, y + 24);
      });
    });
  }

  return { mount, start, stop };
})();

window.Playable = Playable;
