async function loadComponents() {
  const elements = document.querySelectorAll('[data-component]');
  if (elements.length === 0) return;

  const loadPromises = Array.from(elements).map(async (el) => {
    const file = el.getAttribute('data-component');
    if (!file) return;
    try {
      const response = await fetch(file);
      if (response.ok) {
        const html = await response.text();
        el.outerHTML = html;
      }
    } catch (err) {
      console.warn(`Could not load component ${file}:`, err);
    }
  });

  await Promise.all(loadPromises);
}

function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuClose = document.getElementById('mobile-menu-close');
  const overlay = document.getElementById('mobile-menu-overlay');
  const drawer = document.getElementById('mobile-menu-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !overlay || !drawer) return;

  function openMenu() {
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      drawer.classList.remove('translate-y-4');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.add('opacity-0');
    drawer.classList.add('translate-y-4');
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  menuBtn.addEventListener('click', () => {
    if (overlay.classList.contains('hidden')) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  if (menuClose) menuClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      closeMenu();
    }
  });
}

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const toggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');
  const iconSpan = document.getElementById('theme-icon');
  const iconSpanMobile = document.getElementById('theme-icon-mobile');

  function updateThemeUI(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      if (iconSpan) iconSpan.textContent = '🌙';
      if (iconSpanMobile) iconSpanMobile.textContent = '🌙';
    } else {
      document.documentElement.classList.remove('dark');
      if (iconSpan) iconSpan.textContent = '☀️';
      if (iconSpanMobile) iconSpanMobile.textContent = '☀️';
    }
  }

  // Determine initial state based on html class
  const isDarkInitial = document.documentElement.classList.contains('dark');
  updateThemeUI(isDarkInitial);

  function handleToggle(e) {
    if (e) e.preventDefault();
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    const newDarkState = !isCurrentlyDark;
    localStorage.setItem('akrom-theme', newDarkState ? 'dark' : 'light');
    updateThemeUI(newDarkState);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', handleToggle);
  if (toggleBtnMobile) toggleBtnMobile.addEventListener('click', handleToggle);
}

function initBabelTicker() {
  const phraseEl = document.getElementById('babel-phrase');
  const tagEl = document.getElementById('babel-tag');
  if (!phraseEl || !tagEl) return;

  const phrases = [
    { label: 'IDN', text: 'Halo dunia!' },
    { label: 'GO', text: 'fmt.Println("Gopher 1.24")' },
    { label: 'TS', text: 'const dev: Dev = "akrom";' },
    { label: 'PY', text: 'print(f"Async Engine {v2}")' },
    { label: 'RS', text: 'println!("Hello Rust!");' },
    { label: 'REZE', text: 'Reze Cafe Lo-Fi' },
    { label: 'JPN', text: 'こんにちは、世界！' },
    { label: 'RUS', text: 'Привет, мир!' },
    { label: 'CPP', text: 'std::cout << "Akrom System";' },
    { label: 'DOCKER', text: 'docker compose up -d --build' },
    { label: 'SQL', text: 'SELECT * FROM innovations;' },
    { label: 'GIT', text: 'git commit -m "feat: ship fast"' },
    { label: 'SYS', text: 'exit code 0 (success)' },
    { label: 'INF', text: 'while(alive) { build(); }' },
    { label: 'PING', text: '404: sleep not found' }
  ];

  let currentIndex = 0;

  function updatePhrase(index) {
    const item = phrases[index % phrases.length];
    phraseEl.textContent = item.text;
    tagEl.textContent = item.label;
  }

  updatePhrase(0);

  setInterval(() => {
    phraseEl.classList.add('opacity-0');
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % phrases.length;
      updatePhrase(currentIndex);
      phraseEl.classList.remove('opacity-0');
    }, 250);
  }, 2200);
}
