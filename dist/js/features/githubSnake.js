function initGithubSnakeMatrix() {
  const gridEl = document.getElementById('githubMatrixGrid');
  const wrapper = document.getElementById('matrixWrapper');
  const counterEl = document.getElementById('eatenCounter');

  if (!gridEl || !wrapper || !counterEl) return;

  const cols = 52;
  const rows = 7;
  const colors = {
    0: '#E2E8F0',
    1: '#86EFAC',
    2: '#4ADE80',
    3: '#22C55E',
    4: '#15803D',
    pink: '#FF4D8D',
    head: '#FACC15',
    body: '#166534'
  };

  const directions = [[1,0], [0,1], [-1,0], [0,-1]];

  let tiles = [];
  let tileData = [];
  let snake = [];
  let prevSnakePositions = [];
  let eatenCount = 0;
  let intervalId = null;

  function indexFromXY(x, y) {
    return x * rows + y;
  }

  function resizeGrid() {
    const availableWidth = Math.max(280, wrapper.clientWidth - 28);
    const tileSize = Math.max(7, Math.min(13, Math.floor((availableWidth - (cols - 1) * 3) / cols)));
    gridEl.style.gridTemplateColumns = `repeat(${cols}, ${tileSize}px)`;
    gridEl.style.gridTemplateRows = `repeat(${rows}, ${tileSize}px)`;
    gridEl.style.gap = '3px';
    return tileSize;
  }

  async function fetchGithubData() {
    try {
      const res = await fetch('https://github-contributions-api.jogruber.de/v4/4kromm');
      if (res.ok) {
        const json = await res.json();
        if (json.contributions && json.contributions.length > 0) {
          const recent = json.contributions.slice(-364);
          return recent.map(c => c.level);
        }
      }
    } catch (e) {
      console.log('GitHub API fallback to enriched graph:', e);
    }
    return null;
  }

  function generateEnrichedMatrix(apiLevels) {
    const matrix = [];
    const totalCells = cols * rows;

    let hasRealData = false;
    if (apiLevels && apiLevels.length === totalCells) {
      const nonZeroCount = apiLevels.filter(l => l > 0).length;
      if (nonZeroCount > 0) {
        hasRealData = true;
      }
    }

    for (let i = 0; i < totalCells; i++) {
      let level = 0;
      if (apiLevels && apiLevels[i] !== undefined) {
        level = apiLevels[i];
      }
      matrix.push(level);
    }

    let pinksAdded = 0;
    while (pinksAdded < 4) {
      const rIdx = Math.floor(Math.random() * totalCells);
      if (matrix[rIdx] === 0 || matrix[rIdx] === 1) {
        matrix[rIdx] = 'pink';
        pinksAdded++;
      }
    }

    const currentGreenCount = matrix.filter(l => typeof l === 'number' && l > 0).length;
    if (currentGreenCount < 20) {
      let added = 0;
      const targetToAdd = 22 - currentGreenCount;
      while (added < targetToAdd) {
        const rIdx = Math.floor(Math.random() * totalCells);
        if (matrix[rIdx] === 0) {
          matrix[rIdx] = Math.floor(Math.random() * 4) + 1;
          added++;
        }
      }
    }

    return matrix;
  }

  async function buildTiles() {
    gridEl.innerHTML = '';
    tiles = [];
    tileData = [];

    const tileSize = resizeGrid();
    const apiData = await fetchGithubData();
    const matrixData = generateEnrichedMatrix(apiData);

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const idx = indexFromXY(c, r);
        const rawVal = matrixData[idx];
        let tileColor = colors[0];
        let isPink = false;

        if (rawVal === 'pink') {
          tileColor = colors.pink;
          isPink = true;
        } else if (colors[rawVal]) {
          tileColor = colors[rawVal];
        }

        const div = document.createElement('div');
        div.className = 'matrix-tile rounded-[2px] transition-all duration-150';
        div.style.width = `${tileSize}px`;
        div.style.height = `${tileSize}px`;
        div.style.background = tileColor;
        div.dataset.x = c;
        div.dataset.y = r;
        div.dataset.eaten = '0';

        gridEl.appendChild(div);
        tiles.push(div);
        tileData.push({
          color: tileColor,
          isEaten: false,
          isPink: isPink,
          level: rawVal
        });
      }
    }

    snake = [
      { x: 12, y: 3 },
      { x: 11, y: 3 },
      { x: 10, y: 3 },
      { x: 9, y: 3 },
      { x: 8, y: 3 },
      { x: 7, y: 3 }
    ];

    prevSnakePositions = [];
    eatenCount = 76;
    counterEl.textContent = `${String(eatenCount).padStart(3, '0')} DOTS`;
  }

  function renderSnake() {
    prevSnakePositions.forEach(idx => {
      const tile = tiles[idx];
      const data = tileData[idx];
      if (tile && data) {
        tile.style.background = data.isEaten ? colors[0] : data.color;
        tile.style.transform = '';
        tile.style.boxShadow = '';
        tile.style.borderRadius = '2px';
      }
    });
    prevSnakePositions = [];

    snake.forEach((seg, i) => {
      const idx = indexFromXY(seg.x, seg.y);
      const tile = tiles[idx];
      if (tile) {
        if (i === 0) {
          tile.style.background = colors.head;
          tile.style.transform = 'scale(1.25)';
          tile.style.boxShadow = '0 0 8px rgba(250,204,21,0.9)';
          tile.style.borderRadius = '3px';
          tile.style.zIndex = '10';
        } else {
          tile.style.background = colors.body;
          tile.style.transform = 'scale(1.05)';
          tile.style.borderRadius = '2.5px';
          tile.style.zIndex = '5';
        }
        prevSnakePositions.push(idx);
      }
    });
  }

  function findNearestFood() {
    const head = snake[0];
    let nearest = null;
    let minDist = Infinity;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const idx = indexFromXY(c, r);
        const data = tileData[idx];
        if (data && !data.isEaten && data.color !== colors[0]) {
          const dist = Math.abs(head.x - c) + Math.abs(head.y - r);
          if (dist < minDist) {
            minDist = dist;
            nearest = { x: c, y: r };
          }
        }
      }
    }
    return nearest;
  }

  function moveSnake() {
    const head = snake[0];
    const neck = snake[1];

    const target = findNearestFood();

    const validMoves = directions.filter(([dx, dy]) => {
      const nx = head.x + dx;
      const ny = head.y + dy;

      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return false;
      if (neck && nx === neck.x && ny === neck.y) return false;

      const hitsBody = snake.slice(0, -1).some(s => s.x === nx && s.y === ny);
      return !hitsBody;
    });

    if (validMoves.length === 0) {
      buildTiles().then(() => renderSnake());
      return;
    }

    let bestMove = validMoves[0];
    if (target) {
      let minTargetDist = Infinity;
      validMoves.forEach(([dx, dy]) => {
        const nx = head.x + dx;
        const ny = head.y + dy;
        const dist = Math.abs(nx - target.x) + Math.abs(ny - target.y);
        if (dist < minTargetDist) {
          minTargetDist = dist;
          bestMove = [dx, dy];
        }
      });
    } else {
      bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    const nextX = head.x + bestMove[0];
    const nextY = head.y + bestMove[1];
    const nextIdx = indexFromXY(nextX, nextY);
    const data = tileData[nextIdx];

    let ateFood = false;
    if (data && !data.isEaten && data.color !== colors[0]) {
      data.isEaten = true;
      ateFood = true;
      eatenCount++;
      counterEl.textContent = `${String(eatenCount).padStart(3, '0')} DOTS`;
    }

    snake.unshift({ x: nextX, y: nextY });

    if (!ateFood) {
      snake.pop();
    } else if (snake.length > 9) {
      snake.pop();
    }

    renderSnake();
  }

  async function init() {
    clearInterval(intervalId);
    await buildTiles();
    renderSnake();
    intervalId = setInterval(moveSnake, 110);
  }

  init();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeGrid();
    }, 200);
  });
}
