function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-[#0038FF]', 'text-white');
        b.classList.add('bg-white', 'text-gray-950');
      });
      btn.classList.remove('bg-white', 'text-gray-950');
      btn.classList.add('bg-[#0038FF]', 'text-white');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const inspectBtns = document.querySelectorAll('.inspect-project-btn');

  if (!modal || !closeBtn) return;

  const projectDetails = {
    '01': {
      title: 'portfolio',
      image: '/assets/images/projects/Portfolio.jpg'
    },
    '02': {
      title: 'shopgrid-market / theme.js',
      image: '/assets/images/projects/shopgrid-market.png'
    },
    '03': {
      title: 'gameplay & matchmaking system',
      image: '/assets/images/projects/spy.jpg'
    },
    '04': {
      title: 'inventory-system',
      image: '/assets/images/projects/inventory-system.png'
    },
    '05': {
      title: 'kantinku ui/ux design',
      image: '/assets/images/projects/kantinku.png'
    },
    '06': {
      title: 'reels edit',
      image: '/assets/images/projects/reels.jpg'
    }
  };

  inspectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id') || '01';
      const details = projectDetails[id] || projectDetails['01'];
      if (modalTitle) modalTitle.textContent = details.title;
      if (modalImage) {
        modalImage.src = details.image;
        modalImage.alt = details.title;
      }
      modal.classList.remove('hidden');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}