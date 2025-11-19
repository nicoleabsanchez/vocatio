(function() {
  const STORAGE_KEY = 'savedDocuments';
  let currentModalId = null; // Track which document modal is open
  let currentModalData = null; // Store modal data for download
  
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

  function getDocumentDataFromCard(cardId) {
    // For saved materials, cardId is the original doc ID
    const card = document.querySelector(`[data-doc-id="${cardId}"]`) || 
                 document.querySelector(`.material-card:has([onclick*="'${cardId}'"])`);
    
    if (!card) return null;

    return {
      id: cardId,
      title: card.querySelector('h3')?.textContent || '',
      description: card.querySelector('p')?.textContent || '',
      author: 'Gladys Vergel', // This could be added as data attribute in HTML
      year: '2010',
      pages: '18 páginas',
      level: 'Básico',
      rating: '4.5',
      views: '100 vistas'
    };
  }

  window.openModal = function(materialId) {
    const modal = document.getElementById('detailModal');
    if (!modal) return;

    currentModalId = materialId;
    const documentData = getDocumentDataFromCard(materialId);
    
    if (!documentData) return;

    currentModalData = documentData;

    // Populate modal with document data
    document.getElementById('modal-title').textContent = documentData.title;
    document.getElementById('modal-description').textContent = documentData.description;
    document.getElementById('modal-author').textContent = documentData.author;
    document.getElementById('modal-year').textContent = documentData.year;
    document.getElementById('modal-pages').textContent = documentData.pages;
    document.getElementById('modal-level').textContent = documentData.level;
    document.getElementById('modal-rating').textContent = documentData.rating;
    document.getElementById('modal-views').textContent = documentData.views + ' vistas';
    
    // Get image from original card
    const card = document.querySelector(`[data-doc-id="${materialId}"]`) || 
                 document.querySelector(`.material-card:has([onclick*="'${materialId}'"])`);
    if (card) {
      const imageStyle = card.querySelector('.material-image')?.getAttribute('style') || '';
      const imageMatch = imageStyle.match(/background-image:\s*url$$'(.+?)'$$/);
      if (imageMatch) {
        document.getElementById('modal-preview-img').src = imageMatch[1];
      }
    }

    modal.classList.add('active');
    modal.style.display = 'flex';
  };

  window.closeModal = function() {
    const modal = document.getElementById('detailModal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
    currentModalId = null;
    currentModalData = null; // Clear modal data on close
  };

  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('detailModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
    }
  });

  // Toggle favorite - reads from DOM
  window.toggleFavorite = function(event, materialId) {
    event.stopPropagation();
    const btn = event.target;
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = saved.findIndex(item => item.id === materialId);
    
    if (index > -1) {
      // Remover de favoritos
      saved.splice(index, 1);
      btn.textContent = '☆';
      btn.classList.remove('active');
      showToast('Eliminado de guardados', 'info');
    } else {
      // Añadir a favoritos
      const card = document.querySelector(`[data-doc-id="${materialId}"]`) || 
                   document.querySelector(`.material-card:has([onclick*="'${materialId}'"])`);
      
      if (card) {
        const material = {
          id: materialId,
          title: card.querySelector('h3')?.textContent || '',
          description: card.querySelector('p')?.textContent || '',
          style: card.querySelector('.material-image')?.getAttribute('style') || '',
          type: 'document'
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
          <div class="empty-icon">📚</div>
          <h3>No hay materiales guardados</h3>
          <p>Guarda documentos para acceder a ellos posteriormente</p>
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

        // Update view details button to download
        const viewDetailsBtn = originalCard.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
          viewDetailsBtn.textContent = 'Descargar';
          viewDetailsBtn.className = 'view-details-btn';
          viewDetailsBtn.onclick = () => downloadDocument(material.title);
        }

        savedGrid.appendChild(originalCard);
      }
    });
  }

  // Remove favorite with confirmation modal
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
        <p style="margin: 0 0 24px 0; color: #6b7280;">¿Estás seguro de que deseas eliminar este material de guardados?</p>
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
      
      showToast('Material eliminado', 'success');
      renderSavedMaterials();
      updateFavoriteStars();
      confirmModal.remove();
    };
  };

  window.downloadDocument = function(title) {
    // First, try to use currentModalData (from open modal)
    let material = currentModalData;
    
    // If not in modal, search in localStorage (for saved materials)
    if (!material) {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      material = saved.find(m => m.title === title);
    }
    
    // If still no material found, return
    if (!material) {
      showToast('No se pudo descargar el documento', 'error');
      return;
    }
    
    const content = `DOCUMENTO GUARDADO - VOCATIO\n${'='.repeat(50)}\n\nTítulo: ${material.title}\nDescripción: ${material.description}\nAutor: ${material.author || 'No especificado'}\nAño: ${material.year || 'No especificado'}\nTipo: Documento\nFecha de descarga: ${new Date().toLocaleDateString('es-ES')}\n\n${'='.repeat(50)}\nDescargado desde: https://vocatio.com`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${material.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Documento descargado exitosamente', 'success');
  };

  // Show/hide tabs
  window.showSuggested = function() {
    document.getElementById('materials-grid').style.display = 'grid';
    document.getElementById('saved-content').style.display = 'none';
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
  };

  window.showSaved = function() {
    document.getElementById('materials-grid').style.display = 'none';
    document.getElementById('saved-content').style.display = 'block';
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderSavedMaterials();
  };

  // Filtrar materiales
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

  // Initialize on page load
  window.addEventListener('DOMContentLoaded', () => {
    renderSavedMaterials();
    updateFavoriteStars();
  });
})();
