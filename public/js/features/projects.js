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
  const modalCode = document.getElementById('modal-code');
  const inspectBtns = document.querySelectorAll('.inspect-project-btn');

  if (!modal || !closeBtn) return;

  // data buat modal inspect code, id nya harus sama kayak data-id di card
  const projectDetails = {
    '01': {
      title: 'akrom-portfolio2 / Projects.astro',
      code: `<div class="project-card border-2 border-gray-950 rounded-3xl
     shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
     hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)]
     hover:-translate-y-1 transition-all">
  <!-- card project, style neubrutalism -->
  <h3>Neubrutalist Portfolio Landing</h3>
</div>`
    },
    '02': {
      title: 'shopgrid-market / theme.js',
      code: `// design tokens dari figma
const theme = {
  colors: {
    primary: '#FF4D8D',
    accent: '#0038FF',
    surface: '#FFFFFF',
    background: '#FAFAFA'
  },
  typography: {
    heading: 'Oswald, sans-serif',
    body: 'Space Mono, monospace'
  },
  components: ['ProductGrid', 'CategoryFilter', 'WishlistDrawer', 'CheckoutFlow']
};`
    },
    '03': {
      title: 'lobby-system / LobbyManager.lua',
      code: `local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local lobby = {}

Players.PlayerAdded:Connect(function(player)
  table.insert(lobby, player)
  RS.RemoteEvents.LobbyUpdated:FireAllClients(#lobby)

  if #lobby >= 4 then
    startMatch(lobby)
    lobby = {}
  end
end)

Players.PlayerRemoving:Connect(function(player)
  for i, p in ipairs(lobby) do
    if p == player then
      table.remove(lobby, i)
    end
  end
end)`
    },
    '04': {
      title: 'inventory-system / InventoryStore.lua',
      code: `local DataStoreService = game:GetService("DataStoreService")
local InventoryStore = DataStoreService:GetDataStore("PlayerInventory")

local function loadInventory(player)
  local ok, data = pcall(function()
    return InventoryStore:GetAsync(player.UserId)
  end)
  if ok and data then
    return data
  end
  return { coins = 0, slots = {} }
end

local function addCurrency(player, amount)
  local data = loadInventory(player)
  data.coins += amount
  InventoryStore:SetAsync(player.UserId, data)
end`
    },
    '05': {
      title: 'kantinku / flow.js',
      code: `const flow = {
  screens: [
    "Login", "Create Account", "Home", "Category",
    "Product Detail", "Favorites", "Cart",
    "Checkout", "Edit Profile", "Payment"
  ],
  components: ["SearchBar", "PromoBanner", "MenuCard", "CartSummary", "CheckoutButton"],
  style: {
    primary: "#F97316",
    radius: "16px",
    font: "Inter"
  }
};`
    },
    '06': {
      title: 'hopecore-edit / timeline.json',
      code: `{
  "duration": "00:00:14",
  "tracks": [
    { "type": "video", "clips": ["kdrama_cut_01", "kdrama_cut_02"] },
    { "type": "overlay", "fx": ["blur-transition", "grain", "vintage-lut"] },
    { "type": "text", "style": "typewriter", "lines": ["foto kita", "pernah"] },
    { "type": "audio", "track": "lofi-nostalgia.wav", "fadeOut": true }
  ]
}`
    }
  };

  inspectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id') || '01';
      const details = projectDetails[id] || projectDetails['01'];
      if (modalTitle) modalTitle.textContent = details.title;
      if (modalCode) modalCode.textContent = details.code;
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