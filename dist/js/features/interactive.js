function initLofiPlayer() {
  const playBtn = document.getElementById('lofi-play-btn');
  const statusEl = document.getElementById('lofi-status');
  const eqEl = document.getElementById('lofi-eq');

  if (!playBtn) return;

  let isPlaying = false;

  const localAudioPath = 'assets/audio/evangelionlofi.mp3';
  const fallbackStream = 'https://stream.zeno.fm/f3wvbbqmdg8uv';

  const audio = new Audio(localAudioPath);
  audio.volume = 0.5;

  playBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        playBtn.textContent = '⏸ PAUSE';
        if (statusEl) statusEl.textContent = 'EVANGELION LO-FI: PLAYING';
        if (eqEl) eqEl.classList.remove('hidden');
      }).catch(err => {
        console.log('Local evangelionlofi.mp3 fallback to stream:', err);
        audio.src = fallbackStream;
        audio.play().then(() => {
          isPlaying = true;
          playBtn.textContent = '⏸ PAUSE';
          if (statusEl) statusEl.textContent = 'EVANGELION LO-FI: PLAYING';
          if (eqEl) eqEl.classList.remove('hidden');
        }).catch(e => console.error('Audio play error:', e));
      });
    } else {
      audio.pause();
      isPlaying = false;
      playBtn.textContent = '▶ PLAY';
      if (statusEl) statusEl.textContent = 'EVANGELION LO-FI: PAUSED';
      if (eqEl) eqEl.classList.add('hidden');
    }
  });
}

function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockEl.textContent = `${timeStr} WIB [UTC+7]`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('email-toast');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = copyBtn.getAttribute('data-email') || 'ahmadradityaakrom0@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      if (toast) {
        toast.classList.remove('hidden', 'opacity-0');
        setTimeout(() => {
          toast.classList.add('opacity-0');
          setTimeout(() => toast.classList.add('hidden'), 300);
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy email: ', err);
    });
  });
}

function initGifFallbacks() {
  const petImgs = document.querySelectorAll('.pet-gif-img');

  const svgDogFallback = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="none"/><g fill="%23030712"><rect x="8" y="10" width="16" height="12" rx="3" fill="%23FACC15" stroke="%23030712" stroke-width="2"/><rect x="20" y="8" width="6" height="6" fill="%23FF4D8D" stroke="%23030712" stroke-width="1.5"/><circle cx="23" cy="11" r="1" fill="%23030712"/><rect x="10" y="22" width="3" height="5" fill="%23030712"/><rect x="19" y="22" width="3" height="5" fill="%23030712"/></g></svg>`;

  petImgs.forEach(img => {
    img.addEventListener('error', () => {
      img.src = svgDogFallback;
    });
  });
}
