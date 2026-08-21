function initDinoGame() {
  const canvas = document.getElementById('dinoCanvas');
  const wrapper = document.getElementById('dinoCanvasWrapper');
  if (!canvas || !wrapper) return;

  const btnMinimize = document.getElementById('dinoBtnMinimize');
  const btnMaximize = document.getElementById('dinoBtnMaximize');
  const btnClose = document.getElementById('dinoBtnClose');
  const themeBadge = document.getElementById('dinoThemeBadge');
  const modeLabel = document.getElementById('dinoModeLabel');
  const sysStatus = document.getElementById('dinoSysStatus');
  const autopilotBadge = document.getElementById('dinoAutopilotBadge');

  const ctx = canvas.getContext('2d');

  const dinoSprites = {
    idle: new Image(),
    run: new Image(),
    ground: new Image(),
    cloud: new Image(),
    moon: new Image(),
    stars: new Image(),
    bird: new Image(),
    cactiBig: [new Image(), new Image(), new Image()],
    cactiSmall: [new Image(), new Image(), new Image()]
  };

  dinoSprites.idle.src = 'assets/dino/dinoIdle.png';
  dinoSprites.run.src = 'assets/dino/dinoRun.png';
  dinoSprites.ground.src = 'assets/dino/ground.png';
  dinoSprites.cloud.src = 'assets/dino/cloud.png';
  dinoSprites.moon.src = 'assets/dino/moon.png';
  dinoSprites.stars.src = 'assets/dino/stars.png';
  dinoSprites.bird.src = 'assets/dino/enemyBird.png';

  for (let i = 0; i < 3; i++) {
    dinoSprites.cactiBig[i].src = `assets/dino/cactuses_big_${i + 1}.png`;
    dinoSprites.cactiSmall[i].src = `assets/dino/cactuses_small_${i + 1}.png`;
  }

  function resizeCanvas() {
    canvas.width = wrapper.clientWidth - 8;
    canvas.height = wrapper.clientHeight - 8;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let autoPilot = true;
  let isPaused = false;
  let isGameOver = false;

  const scale = 0.42;

  let dino = {
    x: 28,
    y: 0,
    width: 88 * scale,
    height: 94 * scale,
    vy: 0,
    gravity: 0.65,
    jumpPower: -10.5,
    isGrounded: true
  };

  let obstacles = [];
  let clouds = [];
  let starsList = [];
  let frameCount = 0;
  let score = 0;
  let highScore = 1280;
  let gameSpeed = 2.5;
  let groundX = 0;
  let legDistance = 0;
  let nightMode = false;

  function initStars() {
    starsList = [
      { x: 40, y: 15, phase: 0 },
      { x: 120, y: 28, phase: 1 },
      { x: 200, y: 12, phase: 2 },
      { x: 290, y: 22, phase: 0 },
      { x: 370, y: 16, phase: 1 }
    ];
  }
  initStars();

  function resetGame() {
    const groundY = canvas.height - 18;
    dino.height = 94 * scale;
    dino.width = 88 * scale;
    dino.y = groundY - dino.height;
    dino.vy = 0;
    dino.isGrounded = true;
    obstacles = [];
    clouds = [];
    score = 0;
    gameSpeed = 2.5;
    groundX = 0;
    legDistance = 0;
    frameCount = 0;
    isGameOver = false;
    isPaused = false;
    updateUIStatus();
  }

  function toggleAutoPilot() {
    autoPilot = !autoPilot;
    if (isGameOver) resetGame();
    updateUIStatus();
  }

  function togglePause() {
    isPaused = !isPaused;
    updateUIStatus();
  }

  function updateUIStatus() {
    if (modeLabel) {
      modeLabel.textContent = autoPilot ? 'DINO_RUNNER // AUTO_PILOT' : 'DINO_RUNNER // MANUAL_MODE';
    }
    if (autopilotBadge) {
      if (autoPilot) {
        autopilotBadge.textContent = 'AUTO_PILOT // ACTIVE';
        autopilotBadge.className = 'bg-[#0038FF] text-white px-2.5 py-0.5 font-black rounded border border-gray-950 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:opacity-90 transition-opacity';
      } else {
        autopilotBadge.textContent = 'MANUAL // ACTIVE';
        autopilotBadge.className = 'bg-[#FF4D8D] text-white px-2.5 py-0.5 font-black rounded border border-gray-950 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:opacity-90 transition-opacity';
      }
    }
    if (sysStatus) {
      if (isGameOver) {
        sysStatus.textContent = 'SYS_STATUS: GAME OVER (404)';
      } else if (isPaused) {
        sysStatus.textContent = 'SYS_STATUS: PAUSED (304)';
      } else {
        sysStatus.textContent = 'SYS_STATUS: 200 OK';
      }
    }
    if (themeBadge) {
      themeBadge.textContent = nightMode ? 'NIGHT_MODE' : 'DAY_MODE';
    }
  }

  if (autopilotBadge) autopilotBadge.addEventListener('click', toggleAutoPilot);
  if (btnMaximize) btnMaximize.addEventListener('click', toggleAutoPilot);
  if (btnMinimize) btnMinimize.addEventListener('click', togglePause);
  if (btnClose) btnClose.addEventListener('click', resetGame);

  resetGame();

  function jump() {
    if (isGameOver) {
      resetGame();
      return;
    }
    if (isPaused) {
      isPaused = false;
      updateUIStatus();
      return;
    }
    if (dino.isGrounded) {
      dino.vy = dino.jumpPower;
      dino.isGrounded = false;
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      const dinoBox = canvas.getBoundingClientRect();
      if (dinoBox.top < window.innerHeight && dinoBox.bottom > 0) {
        e.preventDefault();
        jump();
      }
    }
  });

  canvas.addEventListener('click', jump);

  function createRandomObstacle(groundY) {
    const isBird = score > 150 && Math.random() < 0.3;
    if (isBird) {
      const w = 92 * scale;
      const h = 77 * scale;
      const flyLow = Math.random() > 0.5;
      return {
        type: 'bird',
        x: canvas.width + 10,
        y: flyLow ? groundY - h - 4 : groundY - h - 22,
        width: w,
        height: h
      };
    } else {
      const isBig = Math.random() > 0.45;
      const typeIdx = Math.floor(Math.random() * 3);
      let origW, origH, img;
      if (isBig) {
        img = dinoSprites.cactiBig[typeIdx];
        origW = [50, 100, 150][typeIdx];
        origH = [96, 96, 98][typeIdx];
      } else {
        img = dinoSprites.cactiSmall[typeIdx];
        origW = [34, 68, 102][typeIdx];
        origH = [70, 70, 70][typeIdx];
      }
      const w = origW * scale;
      const h = origH * scale;
      return {
        type: 'cactus',
        img: img,
        x: canvas.width + 10,
        y: groundY - h + 2,
        width: w,
        height: h
      };
    }
  }

  function gameLoop() {
    const groundY = canvas.height - 18;

    nightMode = Math.floor(score / 350) % 2 === 1;
    updateUIStatus();

    ctx.fillStyle = nightMode ? '#090D16' : '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (nightMode) {
      ctx.filter = 'invert(0.9) hue-rotate(180deg)';
    }

    const groundTileW = 2400 * scale;
    const groundTileH = 26 * scale;
    const gx = groundX % groundTileW;
    if (dinoSprites.ground.complete) {
      ctx.drawImage(dinoSprites.ground, 0, 0, 2400, 26, -gx, groundY - 4, groundTileW, groundTileH);
      ctx.drawImage(dinoSprites.ground, 0, 0, 2400, 26, -gx + groundTileW, groundY - 4, groundTileW, groundTileH);
    } else {
      ctx.strokeStyle = nightMode ? '#F4F2EB' : '#030712';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();
    }

    if (frameCount % 130 === 0) {
      clouds.push({
        x: canvas.width + 20,
        y: 8 + Math.random() * 28,
        width: 92 * scale,
        height: 27 * scale
      });
    }
    for (let i = clouds.length - 1; i >= 0; i--) {
      const cl = clouds[i];
      if (!isPaused && !isGameOver) cl.x -= 0.8;
      if (dinoSprites.cloud.complete) {
        ctx.drawImage(dinoSprites.cloud, cl.x, cl.y, cl.width, cl.height);
      }
      if (cl.x + cl.width < 0) clouds.splice(i, 1);
    }

    if (nightMode) {
      if (dinoSprites.moon.complete) {
        const moonPhase = Math.floor(score / 80) % 7;
        ctx.drawImage(dinoSprites.moon, moonPhase * 20, 0, 20, 40, canvas.width - 65, 10, 20 * scale * 1.8, 40 * scale * 1.8);
      }
      if (dinoSprites.stars.complete) {
        starsList.forEach((st, idx) => {
          const starFrame = Math.floor((frameCount + idx * 10) / 15) % 3;
          const sx = (st.x + canvas.width - 400) % (canvas.width || 400);
          ctx.drawImage(dinoSprites.stars, 0, starFrame * 9, 9, 9, sx, st.y, 9, 9);
        });
      }
    }

    if (!isPaused && !isGameOver) {
      frameCount++;
      score += 0.15;
      if (score > highScore) highScore = Math.floor(score);

      gameSpeed = 2.5 + Math.min(score / 60, 7.0);

      groundX += gameSpeed;
      if (dino.isGrounded) {
        legDistance += gameSpeed;
      }

      dino.vy += dino.gravity;
      dino.y += dino.vy;

      if (dino.y >= groundY - dino.height) {
        dino.y = groundY - dino.height;
        dino.vy = 0;
        dino.isGrounded = true;
      }

      if (autoPilot && obstacles.length > 0) {
        const nearest = obstacles[0];
        const dist = nearest.x - (dino.x + dino.width);
        const jumpThreshold = 20 + gameSpeed * 5.8;

        if (dist > 0 && dist < jumpThreshold && dino.isGrounded) {
          jump();
        }
      }

      const minInterval = Math.max(35, Math.floor(100 - gameSpeed * 5));
      if (frameCount % minInterval === 0 && Math.random() > 0.22) {
        obstacles.push(createRandomObstacle(groundY));
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;

        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
        } else {
          const marginX = 5;
          const marginY = 5;
          if (
            dino.x + marginX < obs.x + obs.width &&
            dino.x + dino.width - marginX > obs.x &&
            dino.y + marginY < obs.y + obs.height &&
            dino.y + dino.height > obs.y + marginY
          ) {
            if (!autoPilot) {
              isGameOver = true;
              updateUIStatus();
            }
          }
        }
      }
    }

    obstacles.forEach((obs) => {
      if (obs.type === 'bird') {
        const birdFrame = Math.floor(frameCount / 6) % 2;
        if (dinoSprites.bird.complete) {
          ctx.drawImage(dinoSprites.bird, birdFrame * 92, 0, 92, 77, obs.x, obs.y, obs.width, obs.height);
        }
      } else if (obs.img && obs.img.complete) {
        ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height);
      }
    });

    if (isGameOver) {
      if (dinoSprites.idle.complete) {
        ctx.drawImage(dinoSprites.idle, 0, 0, 88, 92, dino.x, dino.y, dino.width, dino.height);
      }
    } else if (!dino.isGrounded) {
      if (dinoSprites.run.complete) {
        ctx.drawImage(dinoSprites.run, 0, 0, 88, 94, dino.x, dino.y, dino.width, dino.height);
      }
    } else {
      const runFrame = Math.floor(legDistance / 14) % 4;
      if (dinoSprites.run.complete) {
        ctx.drawImage(dinoSprites.run, runFrame * 88, 0, 88, 94, dino.x, dino.y, dino.width, dino.height);
      }
    }

    ctx.restore();

    const strokeColor = nightMode ? '#F4F2EB' : '#030712';
    ctx.fillStyle = strokeColor;
    ctx.font = 'bold 10px "Space Mono", monospace';
    const displayScore = Math.floor(score);
    ctx.fillText(`HI ${String(highScore).padStart(5, '0')}  ${String(displayScore).padStart(5, '0')}`, canvas.width - 125, 16);

    if (isGameOver) {
      ctx.fillStyle = '#FF4D8D';
      ctx.font = 'bold 11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER - CLICK TO RESTART', canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'left';
    } else if (isPaused) {
      ctx.fillStyle = nightMode ? '#F4F2EB' : '#030712';
      ctx.font = 'bold 10px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED - PRESS _ TO RESUME', canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'left';
    }

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
