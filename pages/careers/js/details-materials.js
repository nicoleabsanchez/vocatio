// Materials inline functionality for career details page
; (() => {
  const materialsData = [
    {
      id: 'doc-1',
      type: 'documento',
      title: 'Guía Completa de Estructuras de Datos',
      description: 'Documento detallado sobre estructuras de datos y algoritmos fundamentales',
      icon: '📄',
      duration: '18 páginas',
      platform: 'PDF',
      pdfUrl: '#',
      author: 'Gladys Vergel',
      year: '2010'
    },
    {
      id: 'doc-2',
      type: 'documento',
      title: 'Arquitectura de Software',
      description: 'Patrones de diseño y mejores prácticas en arquitectura de sistemas',
      icon: '📄',
      duration: '25 páginas',
      platform: 'PDF',
      pdfUrl: '#',
      author: 'John Smith',
      year: '2018'
    },
    {
      id: 'link-1',
      type: 'enlace',
      title: 'Curso de Python en Coursera',
      description: 'Curso completo de programación en Python desde cero',
      icon: '🔗',
      duration: '40 horas',
      platform: 'Coursera',
      url: 'https://www.coursera.org/learn/python'
    },
    {
      id: 'link-2',
      type: 'enlace',
      title: 'Documentación Oficial de React',
      description: 'Guía oficial y completa para aprender React.js',
      icon: '🔗',
      duration: 'Autoaprendizaje',
      platform: 'React.org',
      url: 'https://react.dev/'
    },
    {
      id: 'video-1',
      type: 'video',
      title: 'Introducción a Algoritmos',
      description: 'Serie de videos explicando algoritmos fundamentales',
      icon: '🎬',
      duration: '2:30:00',
      platform: 'YouTube'
    },
    {
      id: 'video-2',
      type: 'video',
      title: 'Bases de Datos SQL',
      description: 'Tutorial completo de SQL y diseño de bases de datos',
      icon: '🎬',
      duration: '3:15:00',
      platform: 'YouTube'
    }
  ]

  let currentFilter = 'all'
  let currentView = 'suggested'
  let searchQuery = ''

  function initMaterials() {
    const grid = document.getElementById('materials-grid-inline')
    if (!grid) return

    renderMaterials()

    const tabs = document.querySelectorAll('input[name="material-tab"]')
    tabs.forEach(tab => {
      tab.addEventListener('change', function () {
        currentFilter = this.id.replace('tab-', '')
        renderMaterials()
      })
    })

    const searchInput = document.getElementById('search-materials')
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = this.value.toLowerCase()
        renderMaterials()
      })
    }

    const btnShowSuggested = document.getElementById('btn-show-suggested')
    const btnShowSaved = document.getElementById('btn-show-saved')

    if (btnShowSuggested) {
      btnShowSuggested.addEventListener('click', function () {
        currentView = 'suggested'
        btnShowSuggested.classList.add('active')
        btnShowSaved.classList.remove('active')
        renderMaterials()
      })
    }

    if (btnShowSaved) {
      btnShowSaved.addEventListener('click', function () {
        currentView = 'saved'
        btnShowSaved.classList.add('active')
        btnShowSuggested.classList.remove('active')
        renderMaterials()
      })
    }
  }

  function renderMaterials() {
    const grid = document.getElementById('materials-grid-inline')
    if (!grid) return

    grid.innerHTML = ''

    const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]')
    let materialsToShow = materialsData

    if (currentView === 'saved') {
      materialsToShow = materialsData.filter(m => savedMaterials.includes(m.id))
    }

    materialsToShow = materialsToShow.filter(material => {
      if (currentFilter === 'all') return true
      if (currentFilter === 'docs') return material.type === 'documento'
      if (currentFilter === 'links') return material.type === 'enlace'
      if (currentFilter === 'videos') return material.type === 'video'
      return true
    })

    if (searchQuery) {
      materialsToShow = materialsToShow.filter(material =>
        material.title.toLowerCase().includes(searchQuery) ||
        material.description.toLowerCase().includes(searchQuery) ||
        material.platform.toLowerCase().includes(searchQuery)
      )
    }

    materialsToShow.forEach(material => {
      const isSaved = savedMaterials.includes(material.id)
      const card = createMaterialCard(material, isSaved)
      grid.appendChild(card)
    })

    if (materialsToShow.length === 0) {
      const emptyMessage = currentView === 'saved'
        ? 'No tienes materiales guardados'
        : searchQuery
          ? `No se encontraron materiales para "${searchQuery}"`
          : 'No hay materiales de este tipo'

      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gray);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
          <h3>${emptyMessage}</h3>
        </div>
      `
    }
  }

  function createMaterialCard(material, isSaved) {
    const card = document.createElement('div')
    card.className = 'material-card-inline'
    card.setAttribute('data-type', material.type)
    card.setAttribute('data-id', material.id)

    card.innerHTML = `
      <div class="material-icon-inline">${material.icon}</div>
      <div class="material-body-inline">
        <h3>${material.title}</h3>
        <p>${material.description}</p>
        <div class="material-meta-inline">
          <span>⏱ ${material.duration}</span>
          <span>📍 ${material.platform}</span>
        </div>
        <div class="material-actions-inline">
          <button class="btn-save-material ${isSaved ? 'saved' : ''}" onclick="toggleSaveMaterial('${material.id}')">
            ${isSaved ? '✓ Guardado' : '💾 Guardar'}
          </button>
          <button class="btn-view-material" onclick="viewMaterial('${material.id}')">
            👁 Ver
          </button>
        </div>
      </div>
    `

    return card
  }

  window.toggleSaveMaterial = function (materialId) {
    const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]')
    const index = savedMaterials.indexOf(materialId)

    if (index > -1) {
      savedMaterials.splice(index, 1)
      showToast('Material eliminado de guardados', 'info')
    } else {
      savedMaterials.push(materialId)
      showToast('Material guardado correctamente', 'success')
    }

    localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials))
    renderMaterials()
  }

  window.viewMaterial = function (materialId) {
    const material = materialsData.find(m => m.id === materialId)
    if (!material) return

    if (material.type === 'documento') {
      showDocumentModal(material)
    } else if (material.type === 'video') {
      const videoSlug = materialId === 'video-1' ? 'intro-sistemas' : 'python-intro'
      window.location.href = `video-detail.html?id=${videoSlug}&ref=details`
    } else if (material.type === 'enlace') {
      window.open(material.url, '_blank')
      showToast(`Abriendo: ${material.title}`, 'info')
    }
  }

  function showDocumentModal(material) {
    const modal = document.createElement('div')
    modal.className = 'material-modal'
    modal.innerHTML = `
      <div class="material-modal-content">
        <button class="material-modal-close" onclick="this.closest('.material-modal').remove()">&times;</button>
        <div class="material-modal-body">
          <div class="material-modal-left">
            <h2>${material.title}</h2>
            <p>${material.description}</p>
            <div class="material-modal-info">
              <div><strong>Autor:</strong> ${material.author || 'Desconocido'}</div>
              <div><strong>Año:</strong> ${material.year || 'N/A'}</div>
              <div><strong>Páginas:</strong> ${material.duration}</div>
            </div>
          </div>
          <div class="material-modal-right">
            <div class="material-modal-preview">
              <div style="font-size: 4rem; color: var(--primary);">📄</div>
              <p>Vista previa del documento</p>
            </div>
            <button class="btn-download-material" onclick="downloadMaterial('${material.id}')">
              ⬇ Descargar PDF
            </button>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(modal)

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.remove()
      }
    })
  }

  window.downloadMaterial = function (materialId) {
    const material = materialsData.find(m => m.id === materialId)
    if (!material) return

    showToast(`Descargando: ${material.title}`, 'success')
  }

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
    if (!document.getElementById('toast-animations')) {
      style.id = 'toast-animations'
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
    }

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMaterials)
  } else {
    initMaterials()
  }

  console.log('[v0] Materials inline module loaded')
})()
