// ============================================
// VARIABLES GLOBALES
// ============================================
let allMaterials = [];
let currentView = 'all'; // 'all' o 'favorites'

// ============================================
// FUNCIONES DE NOTIFICACIÓN
// ============================================
function showSuccessMessage(message) {
  const existingMessage = document.querySelector('.success-message');
  if (existingMessage) existingMessage.remove();
  
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #10b981;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-weight: 500;
    animation: slideDown 0.3s ease;
  `;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => successDiv.remove(), 300);
  }, 3000);
}

function showErrorMessage(message) {
  const existingMessage = document.querySelector('.error-message');
  if (existingMessage) existingMessage.remove();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ef4444;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-weight: 500;
    animation: slideDown 0.3s ease;
  `;
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => errorDiv.remove(), 300);
  }, 3000);
}

// ============================================
// FUNCIONES DE FAVORITOS
// ============================================
function getFavorites() {
  return JSON.parse(localStorage.getItem('favoriteMaterials') || '[]');
}

function saveFavorites(favorites) {
  localStorage.setItem('favoriteMaterials', JSON.stringify(favorites));
  updateFavoritesCounter();
}

function isFavorite(materialTitle) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.title === materialTitle);
}

function toggleFavorite(event, materialTitle, materialType, materialDescription) {
  event.preventDefault();
  event.stopPropagation();
  
  const button = event.currentTarget;
  let favorites = getFavorites();
  
  const materialData = {
    title: materialTitle,
    type: materialType,
    description: materialDescription,
    timestamp: new Date().toISOString()
  };
  
  const existingIndex = favorites.findIndex(fav => fav.title === materialTitle);
  
  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    button.innerHTML = '★ Guardar';
    button.classList.remove('saved');
    showSuccessMessage(`"${materialTitle}" eliminado de favoritos`);
  } else {
    favorites.push(materialData);
    button.innerHTML = '✓ Guardado';
    button.classList.add('saved');
    showSuccessMessage(`"${materialTitle}" agregado a favoritos`);
  }
  
  saveFavorites(favorites);
  
  // Si estamos en vista de favoritos, actualizar
  if (currentView === 'favorites') {
    setTimeout(() => {
      filterFavoritesView();
    }, 500);
  }
}

function filterFavoritesView() {
  const favorites = getFavorites();
  const materialCards = document.querySelectorAll('.material-card');
  
  materialCards.forEach(card => {
    const title = card.querySelector('h3').textContent;
    const isFav = favorites.some(fav => fav.title === title);
    
    if (currentView === 'favorites') {
      card.style.display = isFav ? '' : 'none';
    } else {
      card.style.display = '';
    }
  });
  
  // Mostrar mensaje si no hay favoritos
  const visibleCards = Array.from(materialCards).filter(card => card.style.display !== 'none');
  const materialsGrid = document.querySelector('.materials-grid');
  
  let emptyMessage = materialsGrid.querySelector('.empty-message');
  
  if (visibleCards.length === 0 && currentView === 'favorites') {
    if (!emptyMessage) {
      emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-message';
      emptyMessage.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray);';
      emptyMessage.innerHTML = '<h3>No tienes materiales guardados</h3><p>Guarda materiales para verlos aquí</p>';
      materialsGrid.appendChild(emptyMessage);
    }
  } else if (emptyMessage) {
    emptyMessage.remove();
  }
}

function updateFavoritesCounter() {
  const favorites = getFavorites();
  const favButton = document.getElementById('view-favorites-btn');
  
  if (favButton) {
    favButton.textContent = `Mis favoritos (${favorites.length})`;
  }
}

// ============================================
// FUNCIONES DE BÚSQUEDA
// ============================================
function createSearchBar() {
  const materialsContent = document.querySelector('.materials-content .container');
  
  if (document.getElementById('search-bar-container')) {
    return;
  }
  
  const searchContainer = document.createElement('div');
  searchContainer.id = 'search-bar-container';
  searchContainer.style.cssText = `
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  `;
  
  // Input de búsqueda
  const searchInputWrapper = document.createElement('div');
  searchInputWrapper.style.cssText = `
    flex: 1;
    min-width: 250px;
  `;
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'search-input';
  searchInput.placeholder = 'Buscar materiales por título...';
  searchInput.style.cssText = `
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--gray-light);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    background-color: white;
  `;
  
  searchInputWrapper.appendChild(searchInput);
  
  // Botones de vista
  const viewButtons = document.createElement('div');
  viewButtons.style.cssText = `
    display: flex;
    gap: 0.5rem;
  `;
  
  const allButton = document.createElement('button');
  allButton.id = 'view-all-btn';
  allButton.textContent = 'Todos los materiales';
  allButton.className = 'btn btn-primary';
  allButton.onclick = () => toggleViewMode('all');
  
  const favoritesButton = document.createElement('button');
  favoritesButton.id = 'view-favorites-btn';
  favoritesButton.textContent = 'Mis favoritos (0)';
  favoritesButton.className = 'btn btn-secondary';
  favoritesButton.onclick = () => toggleViewMode('favorites');
  
  viewButtons.appendChild(allButton);
  viewButtons.appendChild(favoritesButton);
  
  searchContainer.appendChild(searchInputWrapper);
  searchContainer.appendChild(viewButtons);
  
  const materialsGrid = materialsContent.querySelector('.materials-grid');
  materialsContent.insertBefore(searchContainer, materialsGrid);
  
  // Event listeners
  searchInput.addEventListener('keyup', function(e) {
    filterMaterials(e.target.value);
  });
  
  searchInput.addEventListener('blur', function(e) {
    if (e.target.value.trim() === '') {
      if (currentView === 'all') {
        showAllMaterials();
      } else {
        showFavorites();
      }
    }
  });
}

function filterMaterials(searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const materialCards = document.querySelectorAll('.material-card');
  
  if (normalizedSearch === '') {
    if (currentView === 'all') {
      showAllMaterials();
    } else {
      showFavorites();
    }
    return;
  }
  
  let visibleCount = 0;
  const favorites = getFavorites();
  
  materialCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const matchesSearch = title.includes(normalizedSearch);
    
    if (currentView === 'favorites') {
      const cardTitle = card.querySelector('h3').textContent;
      const isFav = favorites.some(fav => fav.title === cardTitle);
      card.style.display = (matchesSearch && isFav) ? '' : 'none';
    } else {
      card.style.display = matchesSearch ? '' : 'none';
    }
    
    if (card.style.display !== 'none') visibleCount++;
  });
  
  // Mostrar mensaje si no hay resultados
  const materialsGrid = document.querySelector('.materials-grid');
  let emptyMessage = materialsGrid.querySelector('.empty-message');
  
  if (visibleCount === 0) {
    if (!emptyMessage) {
      emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-message';
      emptyMessage.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray);';
      emptyMessage.innerHTML = '<h3>No se encontraron materiales</h3><p>Intenta con otro término de búsqueda</p>';
      materialsGrid.appendChild(emptyMessage);
    }
  } else if (emptyMessage) {
    emptyMessage.remove();
  }
}

// ============================================
// FUNCIONES DE RENDERIZADO
// ============================================
function extractMaterials() {
  const materialCards = document.querySelectorAll('.material-card');
  allMaterials = [];
  
  materialCards.forEach(card => {
    const title = card.querySelector('h3').textContent;
    const type = card.querySelector('.material-type').textContent;
    const description = card.querySelector('p').textContent;
    const image = card.querySelector('img').src;
    
    allMaterials.push({
      title,
      type,
      description,
      image
    });
  });
}

function showAllMaterials() {
  currentView = 'all';
  const materialCards = document.querySelectorAll('.material-card');
  
  materialCards.forEach(card => {
    card.style.display = '';
  });
  
  // Remover mensaje vacío si existe
  const emptyMessage = document.querySelector('.empty-message');
  if (emptyMessage) emptyMessage.remove();
  
  updateViewButtons();
  
  // Limpiar búsqueda
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
}

function showFavorites() {
  currentView = 'favorites';
  filterFavoritesView();
  updateViewButtons();
  
  // Limpiar búsqueda
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
}

function toggleViewMode(mode) {
  if (mode === 'all') {
    showAllMaterials();
  } else {
    showFavorites();
  }
}

function updateViewButtons() {
  const allBtn = document.getElementById('view-all-btn');
  const favBtn = document.getElementById('view-favorites-btn');
  
  if (currentView === 'all') {
    allBtn.className = 'btn btn-primary';
    favBtn.className = 'btn btn-secondary';
  } else {
    allBtn.className = 'btn btn-secondary';
    favBtn.className = 'btn btn-primary';
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Extraer materiales del HTML
  extractMaterials();
  
  // Crear barra de búsqueda y controles
  createSearchBar();
  
  // Actualizar contador de favoritos
  updateFavoritesCounter();
  
  // Agregar eventos a los botones de guardar existentes
  attachSaveButtonEvents();
  
  // Actualizar estado visual de los botones guardados
  updateSaveButtonsState();
  
  console.log('Materials.js inicializado correctamente');
  console.log('Total materiales:', allMaterials.length);
  console.log('Favoritos guardados:', getFavorites().length);
});

// ============================================
// FUNCIONES DE EVENTOS
// ============================================
function attachSaveButtonEvents() {
  const materialCards = document.querySelectorAll('.material-card');
  
  materialCards.forEach(card => {
    const title = card.querySelector('h3').textContent;
    const type = card.querySelector('.material-type').textContent;
    const description = card.querySelector('p').textContent;
    const saveButton = card.querySelector('.material-actions a[href="#guardar"]');
    
    if (saveButton) {
      saveButton.addEventListener('click', function(event) {
        toggleFavorite(event, title, type, description);
      });
    }
  });
}

function updateSaveButtonsState() {
  const favorites = getFavorites();
  const materialCards = document.querySelectorAll('.material-card');
  
  materialCards.forEach(card => {
    const title = card.querySelector('h3').textContent;
    const saveButton = card.querySelector('.material-actions a[href="#guardar"]');
    
    if (saveButton && isFavorite(title)) {
      saveButton.innerHTML = '✓ Guardado';
      saveButton.classList.add('saved');
    }
  });
}

// ============================================
// ESTILOS DE ANIMACIÓN
// ============================================
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
  
  .btn.saved {
    background-color: #10b981 !important;
    color: white !important;
  }
  
  @media (max-width: 768px) {
    #search-bar-container {
      flex-direction: column;
      align-items: stretch !important;
    }
    
    #search-bar-container > div {
      width: 100%;
      min-width: 100%;
    }
    
    #view-all-btn,
    #view-favorites-btn {
      width: 100%;
    }
  }
`;
document.head.appendChild(style);
