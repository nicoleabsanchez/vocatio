// Materials JavaScript - Handles favorites and filtering for documents, links, and videos
;(() => {
  const STORAGE_KEYS = {
    documents: 'savedDocuments',
    links: 'savedLinks',
    videos: 'savedVideos'
  }

  function getMaterialType() {
    const path = window.location.pathname
    if (path.includes('materiales-documentos')) return 'documents'
    if (path.includes('materiales-enlaces')) return 'links'
    if (path.includes('materiales-videos')) return 'videos'
    return 'documents'
  }

  const materialType = getMaterialType()
  const storageKey = STORAGE_KEYS[materialType]

  console.log("[v0] Materials page loaded. Type:", materialType, "Storage key:", storageKey)

  function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast-notification')
    if (existingToast) {
      existingToast.remove()
    }

    const toast = document.createElement('div')
    toast.className = `toast-notification toast-${type}`
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease;
      font-weight: 600;
    `
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    `
    document.head.appendChild(style)
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  function showConfirmModal(message, onConfirm) {
    const existingModal = document.getElementById('confirmModal')
    if (existingModal) {
      existingModal.remove()
    }

    const modal = document.createElement('div')
    modal.id = 'confirmModal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `

    modal.innerHTML = `
      <div style="background: white; padding: 32px; border-radius: 12px; max-width: 400px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 1.25rem;">Confirmar eliminación</h3>
        <p style="margin: 0 0 24px 0; color: #6b7280;">${message}</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button id="cancelBtn" style="padding: 10px 24px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 8px; cursor: pointer; font-weight: 600;">Cancelar</button>
          <button id="confirmBtn" style="padding: 10px 24px; border: none; background: #ef4444; color: white; border-radius: 8px; cursor: pointer; font-weight: 600;">Eliminar</button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    document.getElementById('cancelBtn').onclick = () => modal.remove()
    document.getElementById('confirmBtn').onclick = () => {
      onConfirm()
      modal.remove()
    }
    
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove()
    }
  }

  function getSavedMaterials() {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey)) || []
      console.log("[v0] Retrieved materials from", storageKey, ":", data)
      return data
    } catch (e) {
      console.error('Error reading saved materials:', e)
      return []
    }
  }

  function saveMaterials(materials) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(materials))
      console.log("[v0] Saved materials to", storageKey, ":", materials)
      return true
    } catch (e) {
      console.error('Error saving materials:', e)
      return false
    }
  }

  window.toggleFavorite = function(event, materialId) {
    event.stopPropagation()
    console.log("[v0] toggleFavorite called with ID:", materialId)
    
    const button = event.currentTarget
    const card = button.closest('.material-card')
    
    let savedMaterials = getSavedMaterials()
    const isAlreadySaved = savedMaterials.some(m => m.id === materialId)
    
    console.log("[v0] Material already saved?", isAlreadySaved)
    
    if (isAlreadySaved) {
      showConfirmModal('¿Estás seguro de que deseas eliminar este material de tus guardados?', () => {
        savedMaterials = savedMaterials.filter(m => m.id !== materialId)
        button.classList.remove('active')
        button.textContent = '☆'
        saveMaterials(savedMaterials)
        showToast('Material eliminado de guardados', 'info')
        
        const savedContent = document.getElementById('saved-content')
        if (savedContent && savedContent.style.display !== 'none') {
          console.log("[v0] Rendering saved materials after removing one")
          renderSavedMaterials()
        }
      })
    } else {
      const titleEl = card.querySelector('h3')
      const descEl = card.querySelector('p')
      const imageDiv = card.querySelector('.material-image')
      const viewBtn = card.querySelector('.view-details-btn')
      
      const bgImage = window.getComputedStyle(imageDiv).backgroundImage
      const imageMatch = bgImage.match(/url$$["']?([^"'()]+)["']?$$/)
      const image = imageMatch ? imageMatch[1] : ''
      
      const material = {
        id: materialId,
        title: titleEl ? titleEl.textContent.trim() : '',
        description: descEl ? descEl.textContent.trim() : '',
        image: image,
        type: materialType,
        action: viewBtn ? viewBtn.getAttribute('onclick') : ''
      }
      
      console.log("[v0] Saving material:", material)
      
      savedMaterials.push(material)
      button.classList.add('active')
      button.textContent = '★'
      saveMaterials(savedMaterials)
      showToast('Material guardado exitosamente', 'success')
      
      const savedContent = document.getElementById('saved-content')
      if (savedContent && savedContent.style.display !== 'none') {
        console.log("[v0] Rendering saved materials after adding new one")
        renderSavedMaterials()
      }
    }
  }

  function initFavoriteButtons() {
    console.log("[v0] Initializing favorite buttons")
    const savedMaterials = getSavedMaterials()
    const savedIds = savedMaterials.map(m => m.id)
    
    console.log("[v0] Saved IDs:", savedIds)
    
    const favoriteButtons = document.querySelectorAll('.favorite-btn')
    console.log("[v0] Found", favoriteButtons.length, "favorite buttons")
    
    favoriteButtons.forEach(button => {
      const onclickAttr = button.getAttribute('onclick')
      if (!onclickAttr) return
      
      const match = onclickAttr.match(/'([^']+)'/)
      if (match && savedIds.includes(match[1])) {
        console.log("[v0] Marking button as active for ID:", match[1])
        button.classList.add('active')
        button.textContent = '★'
      }
    })
  }

  window.showSuggested = function() {
    console.log("[v0] Showing suggested materials")
    document.getElementById('main-content').style.display = 'block'
    document.getElementById('saved-content').style.display = 'none'
    
    const tabs = document.querySelectorAll('.tab-button')
    tabs[0].classList.add('active')
    tabs[1].classList.remove('active')
  }

  window.showSaved = function() {
    console.log("[v0] Showing saved materials")
    document.getElementById('main-content').style.display = 'none'
    document.getElementById('saved-content').style.display = 'block'
    
    const tabs = document.querySelectorAll('.tab-button')
    tabs[0].classList.remove('active')
    tabs[1].classList.add('active')
    
    let grid = document.getElementById('saved-materials-grid')
    if (!grid) {
      const savedContent = document.getElementById('saved-content')
      grid = document.createElement('div')
      grid.className = 'materials-grid'
      grid.id = 'saved-materials-grid'
      savedContent.innerHTML = ''
      savedContent.appendChild(grid)
    }
    
    renderSavedMaterials()
  }

  function renderSavedMaterials() {
    console.log("[v0] renderSavedMaterials called")
    
    const savedContent = document.getElementById('saved-content')
    const savedMaterials = getSavedMaterials()
    const savedGrid = document.getElementById('saved-materials-grid')
    
    console.log("[v0] Saved materials to render:", savedMaterials.length)
    
    if (!savedGrid) {
      console.error("[v0] ERROR: saved-materials-grid not found in DOM")
      return
    }
    
    if (savedMaterials.length === 0) {
      console.log("[v0] No saved materials, showing empty state")
      savedGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">📚</div>
          <h3>No tienes materiales guardados</h3>
          <p>Guarda materiales para acceder a ellos más tarde</p>
        </div>
      `
      return
    }
    
    const html = savedMaterials
      .map((material) => {
        return `
          <div class="material-card">
            <div class="material-image" style="background-image: url('${material.image}');">
              <button class="favorite-btn active" onclick="toggleFavorite(event, '${material.id}')" style="color: #CDFF00;">★</button>
            </div>
            <div class="material-content">
              <h3>${material.title}</h3>
              <p>${material.description}</p>
              <div class="material-footer">
                <button class="view-details-btn" onclick="${material.action}">
                  ${materialType === 'documents' ? 'Ver Detalles' : 'Explorar recurso'}
                </button>
              </div>
            </div>
          </div>
        `
      })
      .join('')
    
    console.log("[v0] Setting HTML to saved grid")
    savedGrid.innerHTML = html
  }

  window.filterMaterials = function() {
    const searchInput = document.getElementById('search-input')
    const filter = searchInput.value.toLowerCase()
    const cards = document.querySelectorAll('#materials-grid .material-card, #saved-materials-grid .material-card')
    
    cards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase()
      const description = card.querySelector('p').textContent.toLowerCase()
      
      if (title.includes(filter) || description.includes(filter)) {
        card.style.display = ''
      } else {
        card.style.display = 'none'
      }
    })
  }

  if (materialType === 'documents') {
    window.openModal = function(docId) {
      const modal = document.getElementById('detailModal')
      if (modal) {
        modal.classList.add('active')
      }
    }

    window.closeModal = function() {
      const modal = document.getElementById('detailModal')
      if (modal) {
        modal.classList.remove('active')
      }
    }

    window.downloadDocument = function() {
      const loadingOverlay = document.getElementById('loadingOverlay')
      const successOverlay = document.getElementById('successOverlay')
      
      if (loadingOverlay) {
        loadingOverlay.classList.add('active')
      }
      
      setTimeout(() => {
        if (loadingOverlay) {
          loadingOverlay.classList.remove('active')
        }
        
        const title = document.getElementById('modal-title').textContent
        const description = document.getElementById('modal-description').textContent
        const author = document.getElementById('modal-author').textContent
        const year = document.getElementById('modal-year').textContent
        const pages = document.getElementById('modal-pages').textContent
        const level = document.getElementById('modal-level').textContent
        const rating = document.getElementById('modal-rating').textContent
        
        const content = `
========================================
${title}
========================================

DESCRIPCIÓN:
${description}

INFORMACIÓN DEL DOCUMENTO:
- Autor: ${author}
- Año de publicación: ${year}
- ${pages}
- Nivel: ${level}
- Calificación: ${rating} estrellas

========================================
Descargado desde VOCATIO
Fecha: ${new Date().toLocaleDateString('es-ES')}
========================================
        `.trim()
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        if (successOverlay) {
          successOverlay.classList.add('active')
        }
        
        setTimeout(() => {
          if (successOverlay) {
            successOverlay.classList.remove('active')
          }
        }, 2000)
      }, 2000)
    }
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFavoriteButtons)
  } else {
    initFavoriteButtons()
  }
})()
