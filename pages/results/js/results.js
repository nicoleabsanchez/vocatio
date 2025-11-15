// ============================================
// VARIABLES GLOBALES
// ============================================
const BASE_FILE_SIZE = 0.5; // MB
const SIZE_PER_SECTION = 0.5; // MB por sección

// ============================================
// FUNCIONES DE LOCALSTORAGE
// ============================================
function saveDownloadPreferences(selectedSections) {
  localStorage.setItem('downloadPreferences', JSON.stringify(selectedSections));
}

function loadDownloadPreferences() {
  const saved = localStorage.getItem('downloadPreferences');
  return saved ? JSON.parse(saved) : null;
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================
function validateSections() {
  const checkboxes = document.querySelectorAll('input[name="sections"]');
  const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
  const errorMessage = document.getElementById('sections-error');
  const downloadBtn = document.getElementById('download-btn');
  
  if (checkedBoxes.length === 0) {
    errorMessage.style.display = 'block';
    downloadBtn.disabled = true;
    downloadBtn.style.backgroundColor = '#ccc';
    return false;
  } else {
    errorMessage.style.display = 'none';
    downloadBtn.disabled = false;
    downloadBtn.style.backgroundColor = '#6c5ce7';
    return true;
  }
}

function updateSectionsCount() {
  const checkboxes = document.querySelectorAll('input[name="sections"]');
  const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
  const count = checkedBoxes.length;
  
  document.getElementById('sections-count').textContent = count;
  
  return count;
}

function updateFileSize() {
  const count = updateSectionsCount();
  const estimatedSize = BASE_FILE_SIZE + (count * SIZE_PER_SECTION);
  
  document.getElementById('file-size-estimate').textContent = `${estimatedSize.toFixed(1)} MB`;
}

// ============================================
// FUNCIONES DEL MODAL
// ============================================
function openModal() {
  const modal = document.getElementById('download-modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Cargar preferencias guardadas
  const savedPreferences = loadDownloadPreferences();
  if (savedPreferences) {
    const checkboxes = document.querySelectorAll('input[name="sections"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = savedPreferences.includes(checkbox.value);
    });
  }
  
  // Actualizar contador y tamaño
  updateFileSize();
  validateSections();
}

function closeModal() {
  const modal = document.getElementById('download-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  
  // Resetear progreso si existe
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  progressContainer.style.display = 'none';
  progressFill.style.width = '0%';
  
  // Mostrar botones del footer
  document.getElementById('preview-btn').style.display = 'block';
  document.getElementById('cancel-btn').style.display = 'block';
  document.getElementById('download-btn').style.display = 'block';
}

// ============================================
// FUNCIONES DE SELECCIÓN
// ============================================
function selectAll() {
  const checkboxes = document.querySelectorAll('input[name="sections"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
  });
  updateFileSize();
  validateSections();
}

function deselectAll() {
  const checkboxes = document.querySelectorAll('input[name="sections"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  updateFileSize();
  validateSections();
}

// ============================================
// FUNCIONES DE DESCARGA
// ============================================
function startDownload() {
  // Ocultar botones y mostrar progreso
  document.getElementById('preview-btn').style.display = 'none';
  document.getElementById('cancel-btn').style.display = 'none';
  document.getElementById('download-btn').style.display = 'none';
  
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  progressContainer.style.display = 'block';
  progressText.textContent = 'Generando reporte...';
  
  // Animar progreso de 0% a 100% en 3 segundos
  let progress = 0;
  const interval = setInterval(() => {
    progress += 2;
    progressFill.style.width = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      progressText.textContent = '¡Descarga completada!';
      progressText.style.color = '#10b981';
      
      // Guardar preferencias
      const checkboxes = document.querySelectorAll('input[name="sections"]:checked');
      const selectedSections = Array.from(checkboxes).map(cb => cb.value);
      saveDownloadPreferences(selectedSections);
      
      // Simular descarga del archivo
      simulateFileDownload();
      
      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        closeModal();
        // Resetear para siguiente uso
        progressText.style.color = '#666';
        document.getElementById('preview-btn').style.display = 'block';
        document.getElementById('cancel-btn').style.display = 'block';
        document.getElementById('download-btn').style.display = 'block';
      }, 1500);
    }
  }, 60); // 3000ms / 50 iteraciones = 60ms por iteración
}

function simulateFileDownload() {
  // Crear un blob de ejemplo para simular descarga
  const checkboxes = document.querySelectorAll('input[name="sections"]:checked');
  const selectedSections = Array.from(checkboxes).map(cb => {
    const label = document.querySelector(`label[for="${cb.id}"] .checkbox-label`);
    return label.textContent;
  });
  
  const content = `
VOCATIO - Reporte de Resultados
================================

Fecha: ${new Date().toLocaleDateString('es-ES', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric' 
})}

Secciones incluidas:
${selectedSections.map((section, index) => `${index + 1}. ${section}`).join('\n')}

Este es un reporte de ejemplo generado por VOCATIO.
Para ver el reporte completo, espera la implementación del sistema de generación de PDF.
  `;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VOCATIO_Reporte_${new Date().getTime()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// ============================================
// FUNCIÓN DE VISTA PREVIA
// ============================================
function showPreview() {
  const checkboxes = document.querySelectorAll('input[name="sections"]:checked');
  
  if (checkboxes.length === 0) {
    alert('⚠️ Selecciona al menos una sección para ver la vista previa');
    return;
  }
  
  const selectedSections = Array.from(checkboxes).map(cb => {
    const label = document.querySelector(`label[for="${cb.id}"]`);
    const title = label.querySelector('.checkbox-label').textContent;
    const description = label.querySelector('.section-description').textContent;
    return { title, description };
  });
  
  let previewContent = '📄 Vista previa del reporte:\n\n';
  previewContent += 'Incluirá las siguientes secciones:\n\n';
  
  selectedSections.forEach((section, index) => {
    previewContent += `${index + 1}. ${section.title}\n   ${section.description}\n\n`;
  });
  
  const count = selectedSections.length;
  const size = (BASE_FILE_SIZE + (count * SIZE_PER_SECTION)).toFixed(1);
  previewContent += `\nTotal: ${count} secciones\n`;
  previewContent += `Tamaño estimado: ${size} MB`;
  
  alert(previewContent);
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Evento para abrir modal
  const downloadButton = document.querySelector('.btn-download');
  if (downloadButton) {
    downloadButton.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }
  
  // Evento para compartir por WhatsApp
  const shareButton = document.querySelector('.btn-share');
  if (shareButton) {
    shareButton.addEventListener('click', function(e) {
      e.preventDefault();
      shareViaWhatsApp();
    });
  }
  
  // Evento para cerrar modal (X)
  const closeButton = document.querySelector('.modal-close');
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }
  
  // Evento para cerrar modal (overlay)
  const modalOverlay = document.getElementById('download-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }
  
  // Eventos para checkboxes
  const checkboxes = document.querySelectorAll('input[name="sections"]');
  checkboxes.forEach(checkbox => {
    // Evento change para actualizar contador y validar
    checkbox.addEventListener('change', function() {
      updateFileSize();
      validateSections();
    });
    
    // Evento blur para validación adicional
    checkbox.addEventListener('blur', function() {
      validateSections();
    });
  });
  
  // Botón seleccionar todo
  const selectAllBtn = document.getElementById('select-all-btn');
  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', selectAll);
  }
  
  // Botón deseleccionar todo
  const deselectAllBtn = document.getElementById('deselect-all-btn');
  if (deselectAllBtn) {
    deselectAllBtn.addEventListener('click', deselectAll);
  }
  
  // Botón vista previa
  const previewBtn = document.getElementById('preview-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', showPreview);
  }
  
  // Botón cancelar
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }
  
  // Evento submit del formulario
  const downloadForm = document.getElementById('download-form');
  if (downloadForm) {
    downloadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validación completa antes de descargar
      if (!validateSections()) {
        return;
      }
      
      // Iniciar proceso de descarga
      startDownload();
    });
  }
  
  console.log('Results.js inicializado correctamente');
  console.log('Sistema de descarga personalizada listo');
});

// ============================================
// FUNCIÓN DE COMPARTIR POR WHATSAPP
// ============================================
function shareViaWhatsApp() {
  const message = `VOCATIO - Mis Resultados

Test Vocacional - 10 de enero, 2025

*Perfil Vocacional:* Analítico-Sistemático

*Áreas de Mayor Afinidad:*
• Tecnología: 95%
• Ciencias: 88%
• Matemáticas: 85%

*Carreras Recomendadas:*
1. Ingeniería de Sistemas
2. Ciencia de Datos
3. Ingeniería Industrial
4. Arquitectura de Software
5. Ingeniería Mecatrónica

Descubre tu vocación con VOCATIO - Tu plataforma de orientación vocacional

🔗 Visita: https://nicoleabsanchez.github.io/vocatio/`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  // Abrir WhatsApp en nueva ventana
  window.open(whatsappUrl, '_blank');
  
  console.log('Compartir por WhatsApp activado');
}

