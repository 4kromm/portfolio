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

  const projectDetails = {
    '01': {
      title: 'SCREENSHOT - Neubrutalist Portfolio Landing',
      code: `---
// Projects.astro — neubrutalist card component
const projects = [
  { id: "01", name: "Akrom Portfolio", category: "frontend" },
  // ...
];
---
<div class="project-card border-2 border-gray-950
     shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
     hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)]
     hover:-translate-y-1 transition-all">
  <!-- thick border + hard shadow = the neubrutalist signature -->
</div>`
    },
    '02': {
      title: 'SCREENSHOT - Shopgrid Market',
      code: `// Shopgrid Market — UI/UX design tokens (Figma → dev handoff)
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
  components: [
    'ProductGrid',
    'CategoryFilter',
    'WishlistDrawer',
    'CheckoutFlow'
  ]
};`
    },
    '03': {
      title: 'SCREENSHOT - Dynamic Lobby & Matchmaking Script',
      code: `-- Roblox Lua — Lobby & Matchmaking (ServerScriptService)
local Players = game:GetService("Players")
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
    if p == player then table.remove(lobby, i) end
  end
end)`
    },
    '04': {
      title: 'SCREENSHOT - Inventory & Currency Manager',
      code: `-- Roblox Lua — DataStore-backed inventory system
local DataStoreService = game:GetService("DataStoreService")
local InventoryStore = DataStoreService:GetDataStore("PlayerInventory")

local function loadInventory(player)
  local ok, data = pcall(function()
    return InventoryStore:GetAsync(player.UserId)
  end)
  return ok and data or { coins = 0, slots = {} }
end

local function addCurrency(player, amount)
  local data = loadInventory(player)
  data.coins += amount
  InventoryStore:SetAsync(player.UserId, data)
end`
    },
    '05': {
      title: 'SCREENSHOT - Kantinku Food Ordering App UI/UX',
      code: `// Kantinku — Figma UI/UX flow spec
const flow = {
  screens: [
    "Login", "Create Account", "Home",
    "Category", "Product Detail", "Favorites",
    "Cart", "Checkout", "Edit Profile", "Payment"
  ],
  components: [
    "SearchBar", "PromoBanner", "MenuCard",
    "CartSummary", "CheckoutButton"
  ],
  style: {
    primary: "#F97316",
    radius: "16px",
    font: "Inter"
  }
};`
    },
    '06': {
      title: 'SCREENSHOT - Hopecore Edit',
      code: `// Hopecore Edit — timeline breakdown (Premiere / DaVinci Resolve)
const timeline = {
  duration: "00:00:14",
  tracks: [
    { type: "video", clips: ["k-drama_cut_01", "k-drama_cut_02"] },
    { type: "overlay", fx: ["blur-photo-transition", "grain", "vintage-LUT"] },
    { type: "text", style: "typewriter", lines: ["foto kita", "pernah"] },
    { type: "audio", track: "lofi-nostalgia.wav", fadeOut: true }
  ]
};`
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