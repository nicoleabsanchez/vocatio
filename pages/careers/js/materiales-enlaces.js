(function() {
  const STORAGE_KEY = 'savedLinks';
  
  // Toast system for this module
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // Get all links from DOM
  function getAllLinksFromDOM() {
    const links = [];
    const cards = document.querySelectorAll('#materials-grid .material-card');
    cards.forEach((card, index) => {
      const title = card.querySelector('h3')?.textContent || '';
      const description = card.querySelector('p')?.textContent || '';
      const styleAttr = card.querySelector('.material-image')?.getAttribute('style') || '';
      const imageMatch = styleAttr.match(/background-image:\s*url$$'(.+?)'$$/);
      const image = imageMatch ? imageMatch[1] : '';
      const id = `link-${index + 1}`;
      links.push({ id, title, description, image, type: 'link' });
    });
    return links;
  }

  function updateFavoriteStars() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const allCards = document.querySelectorAll('#materials-grid .material-card');
    
    allCards.forEach(card => {
      const favBtn = card.querySelector('.favorite-btn');
      if (favBtn && favBtn.onclick) {
        const onclickAttr = favBtn.getAttribute('onclick');
        const materialIdMatch = onclickAttr?.match(/'([^']+)'/);
        if (materialIdMatch) {
          const materialId = materialIdMatch[1];
          if (saved.some(m => m.id === materialId)) {
            favBtn.textContent = '★';
            favBtn.classList.add('active');
          } else {
            favBtn.textContent = '☆';
            favBtn.classList.remove('active');
          }
        }
      }
    });
  }

  // Toggle favorite for a link
  window.toggleFavorite = function(event, materialId) {
    event.stopPropagation();
    const btn = event.target;
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = saved.findIndex(item => item.id === materialId);
    
    if (index > -1) {
      saved.splice(index, 1);
      btn.textContent = '☆';
      btn.classList.remove('active');
      showToast('Eliminado de guardados', 'info');
    } else {
      const card = document.querySelector(`[data-link-id="${materialId}"]`) || 
                   document.querySelector(`.material-card:has([onclick*="'${materialId}'"])`);
      
      if (card) {
        const material = {
          id: materialId,
          title: card.querySelector('h3')?.textContent || '',
          description: card.querySelector('p')?.textContent || '',
          style: card.querySelector('.material-image')?.getAttribute('style') || '',
          type: 'link'
        };
        saved.push(material);
        btn.textContent = '★';
        btn.classList.add('active');
        showToast('Agregado a guardados', 'success');
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    renderSavedMaterials();
    updateFavoriteStars();
  };

  function renderSavedMaterials() {
    const savedGrid = document.getElementById('saved-materials-grid');
    if (!savedGrid) return;

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    if (saved.length === 0) {
      savedGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🔗</div>
          <h3>No hay enlaces guardados</h3>
          <p>Guarda enlaces para acceder a ellos posteriormente</p>
        </div>
      `;
      return;
    }

    // Clone original cards structure for saved materials
    savedGrid.innerHTML = '';
    saved.forEach(material => {
      const originalCard = document.querySelector(`.material-card:has([onclick*="'${material.id}'"])`)?.cloneNode(true);
      
      if (originalCard) {
        // Update favorite button to show remove action
        const favBtn = originalCard.querySelector('.favorite-btn');
        if (favBtn) {
          favBtn.textContent = '★';
          favBtn.classList.add('active');
          favBtn.onclick = (e) => removeFavorite(e, material.id);
        }

        // Keep the original "Ver detalles" button functionality
        savedGrid.appendChild(originalCard);
      }
    });
  }

  window.removeFavorite = function(event, materialId) {
    event.stopPropagation();
    
    const confirmModal = document.createElement('div');
    confirmModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    `;

    confirmModal.innerHTML = `
      <div style="background: white; border-radius: 12px; padding: 32px; max-width: 400px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 1.25rem;">Confirmar eliminación</h3>
        <p style="margin: 0 0 24px 0; color: #6b7280;">¿Estás seguro de que deseas eliminar este enlace de guardados?</p>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button id="confirm-cancel" style="background: #e5e7eb; color: #374151; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">Cancelar</button>
          <button id="confirm-delete" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">Eliminar</button>
        </div>
      </div>
    `;

    document.body.appendChild(confirmModal);

    document.getElementById('confirm-cancel').onclick = () => confirmModal.remove();
    document.getElementById('confirm-delete').onclick = () => {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const filtered = saved.filter(item => item.id !== materialId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      
      showToast('Enlace eliminado', 'success');
      renderSavedMaterials();
      updateFavoriteStars();
      confirmModal.remove();
    };
  };

  // Open link
  window.openLink = function(title) {
    showToast(`Abriendo: ${title}`, 'success');
  };

  // Show suggested materials
  window.showSuggested = function() {
    document.getElementById('materials-grid').style.display = 'grid';
    document.getElementById('saved-content').style.display = 'none';
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
  };

  // Show saved materials
  window.showSaved = function() {
    document.getElementById('materials-grid').style.display = 'none';
    document.getElementById('saved-content').style.display = 'block';
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderSavedMaterials();
  };

  // Filter materials
  window.filterMaterials = function() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('#materials-grid .material-card');
    cards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = card.querySelector('p')?.textContent.toLowerCase() || '';
      const matches = title.includes(searchTerm) || description.includes(searchTerm);
      card.style.display = matches ? '' : 'none';
    });
  };

  // Initialize on page load
  window.addEventListener('DOMContentLoaded', () => {
    renderSavedMaterials();
    updateFavoriteStars();
  });
})();
