// ============================================
// VARIABLES GLOBALES
// ============================================
const BASE_FILE_SIZE = 0.5; // MB
const SIZE_PER_SECTION = 0.5; // MB por sección

// Cargar datos del test vocacional
let testResults = null;
function loadTestResults() {
  const stored = localStorage.getItem('vocatioTestResults');
  if (stored) {
    testResults = JSON.parse(stored);
    // Actualizar la página con los datos del test
    updateResultsDisplay();
  }
}

function updateResultsDisplay() {
  if (!testResults) return;
  
  // Mapeo de categorías del test a labels de UI
  const categoryLabels = {
    'Tecnología': 'Tecnología',
    'Ciencias': 'Ingeniería',  // Ciencias mapeado a Ingeniería en UI
    'Arte': 'Arte y Diseño',    // Arte mapeado a Arte y Diseño en UI
    'Negocios': 'Negocios'      // Negocios se mantiene igual
  };
  
  // Obtener porcentajes del test y ordenarlos de mayor a menor
  const affinity = testResults.porcentajes || {};
  const sortedAffinity = Object.entries(affinity)
    .sort((a, b) => b[1] - a[1])  // Ordenar descendente
    .slice(0, 3);  // Tomar top 3
  
  // Actualizar cada affinity-item con los valores ordenados
  const affinityItems = document.querySelectorAll('.affinity-item');
  affinityItems.forEach((item, index) => {
    if (sortedAffinity[index]) {
      const [categoryKey, percentage] = sortedAffinity[index];
      const displayLabel = categoryLabels[categoryKey] || categoryKey;
      
      const labels = item.querySelectorAll('span');
      if (labels[0]) labels[0].textContent = displayLabel;
      if (labels[1]) labels[1].textContent = percentage + '%';
      
      // Actualizar barra de progreso
      const progressBar = item.querySelector('.progress-bar-fill');
      if (progressBar) progressBar.style.width = percentage + '%';
    }
  });
  
  // Actualizar carreras recomendadas
  if (testResults.recomendaciones && testResults.recomendaciones.length > 0) {
    const recommendedList = document.querySelector('.recommended-careers');
    if (recommendedList) {
      recommendedList.innerHTML = testResults.recomendaciones.map(career => 
        `<div class="career-item"><strong>${career}</strong></div>`
      ).join('');
    }
  }
}

// Cargar resultados al iniciar
document.addEventListener('DOMContentLoaded', function() {
  loadTestResults();
  
  // Agregar listener al botón Personalizar
  const personalizeBtn = document.querySelector('a.btn-share[href="./results.html"]');
  if (personalizeBtn) {
    personalizeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Navegar a us20
      window.location.href = '../careers/us20-compartir-resultados-en-redes-sociales-p1.html';
    });
  }
});

// ============================================
// FUNCIONES DE HISTORIAL
// ============================================
function saveDownloadHistory(sections, fileName) {
  const downloads = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
  
  downloads.push({
    date: new Date().toISOString(),
    sections: sections,
    fileName: fileName,
    testDate: '10 de enero, 2025'
  });
  
  // Mantener solo los últimos 10 downloads
  if (downloads.length > 10) {
    downloads.shift();
  }
  
  localStorage.setItem('downloadHistory', JSON.stringify(downloads));
}

function getDownloadHistory() {
  return JSON.parse(localStorage.getItem('downloadHistory') || '[]');
}

function saveTestHistory(profile, areas, careers) {
  const tests = JSON.parse(localStorage.getItem('testHistory') || '[]');
  
  tests.push({
    date: new Date().toISOString(),
    profile: profile,
    areas: areas,
    careers: careers
  });
  
  localStorage.setItem('testHistory', JSON.stringify(tests));
}

function getTestHistory() {
  return JSON.parse(localStorage.getItem('testHistory') || '[]');
}

// ============================================
// FUNCIONES DE EMAIL
// ============================================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendReportByEmail() {
  const email = prompt('Ingresa tu correo electrónico para recibir el reporte:');
  
  if (!email) return;
  
  if (validateEmail(email)) {
    // Simular envío (en producción conectar con backend)
    alert(`✅ Reporte enviado exitosamente a ${email}\n\nRevisalo en tu bandeja de entrada en los próximos minutos.`);
    
    // Guardar en historial de emails
    const emailHistory = JSON.parse(localStorage.getItem('emailHistory') || '[]');
    emailHistory.push({ 
      email, 
      date: new Date().toISOString(),
      sections: getSelectedSections()
    });
    
    if (emailHistory.length > 20) {
      emailHistory.shift();
    }
    
    localStorage.setItem('emailHistory', JSON.stringify(emailHistory));
  } else {
    alert('⚠️ Por favor ingresa un correo electrónico válido');
  }
}

function getSelectedSections() {
  const checkboxes = document.querySelectorAll('input[name="sections"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

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
// FUNCIONES DE VALIDACIÓN MEJORADAS
// ============================================
function validateSections() {
  const checkboxes = document.querySelectorAll('input[name="sections"]');
  const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
  const errorMessage = document.getElementById('sections-error');
  const downloadBtn = document.getElementById('download-btn');
  const previewBtn = document.getElementById('preview-btn');
  
  if (checkedBoxes.length === 0) {
    errorMessage.style.display = 'flex';
    errorMessage.innerHTML = '⚠️ <strong style="margin-left: 0.5rem;">Selecciona al menos una sección para continuar</strong>';
    downloadBtn.disabled = true;
    downloadBtn.style.opacity = '0.5';
    downloadBtn.style.cursor = 'not-allowed';
    previewBtn.disabled = true;
    previewBtn.style.opacity = '0.5';
    previewBtn.style.cursor = 'not-allowed';
    return false;
  } else {
    errorMessage.style.display = 'none';
    downloadBtn.disabled = false;
    downloadBtn.style.opacity = '1';
    downloadBtn.style.cursor = 'pointer';
    previewBtn.disabled = false;
    previewBtn.style.opacity = '1';
    previewBtn.style.cursor = 'pointer';
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
async function startDownload() {
  // Ocultar botones y mostrar progreso
  document.getElementById('preview-btn').style.display = 'none';
  document.getElementById('cancel-btn').style.display = 'none';
  document.getElementById('download-btn').style.display = 'none';
  
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  progressContainer.style.display = 'block';
  
  try {
    // Fase 1: Recopilando datos
    progressText.textContent = 'Recopilando datos...';
    progressFill.style.width = '20%';
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fase 2: Generando gráficos
    progressText.textContent = 'Generando gráficos...';
    progressFill.style.width = '40%';
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fase 3: Creando PDF
    progressText.textContent = 'Creando PDF...';
    progressFill.style.width = '70%';
    await generatePDFReport();
    
    // Fase 4: Finalizando
    progressText.textContent = 'Finalizando...';
    progressFill.style.width = '100%';
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Éxito
    progressText.textContent = '✓ ¡Descarga completada!';
    progressText.style.color = '#10b981';
    
    // Guardar preferencias
    const selectedSections = getSelectedSections();
    saveDownloadPreferences(selectedSections);
    
    // Cerrar modal después de 1.5 segundos
    setTimeout(() => {
      closeModal();
      progressText.style.color = '#666';
      document.getElementById('preview-btn').style.display = 'block';
      document.getElementById('cancel-btn').style.display = 'block';
      document.getElementById('download-btn').style.display = 'block';
    }, 1500);
    
  } catch (error) {
    console.error('Error al generar PDF:', error);
    progressText.textContent = '✗ Error al generar el reporte';
    progressText.style.color = '#ef4444';
    progressFill.style.background = '#ef4444';
    
    setTimeout(() => {
      closeModal();
      progressText.style.color = '#666';
      progressFill.style.background = 'linear-gradient(90deg, #6c5ce7 0%, #a29bfe 100%)';
      document.getElementById('preview-btn').style.display = 'block';
      document.getElementById('cancel-btn').style.display = 'block';
      document.getElementById('download-btn').style.display = 'block';
      alert('Hubo un error al generar el reporte. Por favor, inténtalo de nuevo.');
    }, 2000);
  }
}

async function generatePDFReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const selectedSections = getSelectedSections();
  const currentDate = new Date();
  const fileName = `VOCATIO_Reporte_${currentDate.toISOString().split('T')[0]}.pdf`;
  
  // Configuración de colores
  const primaryColor = [108, 92, 231]; // #6c5ce7
  const textColor = [26, 26, 26];
  const grayColor = [102, 102, 102];
  
  let yPosition = 20;
  
  // ========== HEADER ==========
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('VOCATIO', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'normal');
  doc.text('Reporte de Test Vocacional', 105, 30, { align: 'center' });
  
  yPosition = 50;
  
  // ========== FECHA ==========
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text(`Fecha de generación: ${currentDate.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })}`, 105, yPosition, { align: 'center' });
  
  yPosition += 15;
  
  // ========== PERFIL VOCACIONAL ==========
  if (selectedSections.includes('profile')) {
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('Tu Perfil Vocacional', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(20);
    doc.setTextColor(...textColor);
    doc.setFont(undefined, 'bold');
    doc.text('Analítico-Sistemático', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.setFont(undefined, 'normal');
    const profileDesc = 'Tienes una capacidad excepcional para el análisis lógico y la resolución de problemas\ncomplejos. Tu pensamiento estructurado te permite abordar desafíos de manera sistemática.';
    doc.text(profileDesc, 20, yPosition);
    yPosition += 20;
  }
  
  // ========== ÁREAS DE AFINIDAD ==========
  if (selectedSections.includes('affinity')) {
    // Capturar la sección de afinidad si existe
    const affinitySection = document.querySelector('.affinity-section');
    
    if (affinitySection) {
      try {
        const canvas = await html2canvas(affinitySection, {
          scale: 2,
          logging: false,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        
        doc.setFontSize(16);
        doc.setTextColor(...primaryColor);
        doc.setFont(undefined, 'bold');
        doc.text('Áreas de Mayor Afinidad', 20, yPosition);
        yPosition += 10;
        
        // Agregar imagen del gráfico
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (yPosition + imgHeight > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.error('Error al capturar gráfico:', error);
        // Fallback a texto
        addAffinityTextVersion(doc, yPosition, primaryColor, textColor, grayColor);
        yPosition += 50;
      }
    } else {
      addAffinityTextVersion(doc, yPosition, primaryColor, textColor, grayColor);
      yPosition += 50;
    }
  }
  
  // ========== CARRERAS RECOMENDADAS ==========
  if (selectedSections.includes('careers')) {
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('Carreras Recomendadas', 20, yPosition);
    yPosition += 10;
    
    const careers = [
      { name: 'Ingeniería de Sistemas', match: '95%', duration: '5 años' },
      { name: 'Ciencia de Datos', match: '88%', duration: '4 años' },
      { name: 'Ingeniería Industrial', match: '85%', duration: '5 años' },
      { name: 'Arquitectura de Software', match: '82%', duration: '4 años' },
      { name: 'Ingeniería Mecatrónica', match: '78%', duration: '5 años' }
    ];
    
    careers.forEach((career, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${career.name}`, 25, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(...grayColor);
      doc.setFont(undefined, 'normal');
      doc.text(`Compatibilidad: ${career.match} | Duración: ${career.duration}`, 25, yPosition + 5);
      
      yPosition += 12;
    });
    
    yPosition += 8;
  }
  
  // ========== ANÁLISIS DETALLADO ==========
  if (selectedSections.includes('analysis')) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('Análisis Detallado', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont(undefined, 'normal');
    
    const analysis = [
      'Fortalezas Identificadas:',
      '• Pensamiento lógico y estructurado',
      '• Alta capacidad de análisis',
      '• Resolución efectiva de problemas complejos',
      '• Habilidades matemáticas avanzadas',
      '',
      'Áreas de Desarrollo:',
      '• Comunicación interpersonal',
      '• Trabajo en equipo multidisciplinario',
      '• Gestión de proyectos'
    ];
    
    analysis.forEach(line => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
    
    yPosition += 8;
  }
  
  // ========== COMPARACIÓN CON TESTS ANTERIORES ==========
  if (selectedSections.includes('comparison')) {
    const testHistory = getTestHistory();
    
    if (testHistory.length > 1) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(...primaryColor);
      doc.setFont(undefined, 'bold');
      doc.text('Comparación con Tests Anteriores', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.setFont(undefined, 'normal');
      doc.text('Evolución de tus intereses y afinidades:', 20, yPosition);
      yPosition += 8;
      
      const current = testHistory[testHistory.length - 1];
      const previous = testHistory[testHistory.length - 2];
      
      doc.setFontSize(10);
      doc.setTextColor(...grayColor);
      doc.text('Test Anterior → Test Actual', 25, yPosition);
      yPosition += 6;
      
      if (current.areas && previous.areas) {
        Object.keys(current.areas).forEach(area => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          const diff = current.areas[area] - (previous.areas[area] || 0);
          const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
          const color = diff > 0 ? [16, 185, 129] : diff < 0 ? [239, 68, 68] : grayColor;
          
          doc.setTextColor(...color);
          doc.text(`${area}: ${previous.areas[area] || 0}% ${arrow} ${current.areas[area]}%`, 25, yPosition);
          yPosition += 6;
        });
      }
      
      yPosition += 8;
    } else {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(...grayColor);
      doc.setFont(undefined, 'italic');
      doc.text('Realiza más tests para ver la comparación con resultados anteriores.', 20, yPosition);
      yPosition += 15;
    }
  }
  
  // ========== RECOMENDACIONES DE ESTUDIO ==========
  if (selectedSections.includes('recommendations')) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('Recomendaciones de Estudio', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont(undefined, 'normal');
    
    const recommendations = [
      'Cursos sugeridos para fortalecer tu perfil:',
      '',
      '1. Fundamentos de Programación (Python/Java)',
      '   Plataforma: Coursera, edX',
      '   Duración: 8 semanas',
      '',
      '2. Pensamiento Analítico y Resolución de Problemas',
      '   Plataforma: LinkedIn Learning',
      '   Duración: 4 semanas',
      '',
      '3. Matemáticas para Ingeniería',
      '   Plataforma: Khan Academy',
      '   Duración: 12 semanas',
      '',
      'Recursos adicionales:',
      '• Libros recomendados en tu área',
      '• Podcasts de profesionales del sector',
      '• Comunidades online especializadas'
    ];
    
    recommendations.forEach(line => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 5;
    });
  }
  
  // ========== FOOTER EN TODAS LAS PÁGINAS ==========
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Línea decorativa
    doc.setDrawColor(...grayColor);
    doc.setLineWidth(0.5);
    doc.line(20, 285, 190, 285);
    
    // Texto del footer
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text('Generado por VOCATIO - Tu plataforma de orientación vocacional', 105, 290, { align: 'center' });
    doc.text(`Página ${i} de ${pageCount}`, 190, 290, { align: 'right' });
  }
  
  // Guardar el PDF
  doc.save(fileName);
  
  // Guardar en historial
  saveDownloadHistory(selectedSections, fileName);
  
  return fileName;
}

function addAffinityTextVersion(doc, yPos, primaryColor, textColor, grayColor) {
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.setFont(undefined, 'bold');
  doc.text('Áreas de Mayor Afinidad', 20, yPos);
  yPos += 10;
  
  const areas = [
    { name: 'Ingeniería', percentage: 80 },
    { name: 'Tecnología', percentage: 60 },
    { name: 'Negocios', percentage: 20 }
  ];
  
  areas.forEach(area => {
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.setFont(undefined, 'bold');
    doc.text(`• ${area.name}`, 25, yPos);
    
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...grayColor);
    doc.text(`${area.percentage}%`, 180, yPos, { align: 'right' });
    
    yPos += 7;
  });
  
  return yPos;
}

// ============================================
// FUNCIÓN DE VISTA PREVIA MEJORADA
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
  
  // Crear modal de vista previa
  const previewModal = document.createElement('div');
  previewModal.className = 'modal-overlay active';
  previewModal.id = 'preview-modal-temp';
  
  const count = selectedSections.length;
  const size = (BASE_FILE_SIZE + (count * SIZE_PER_SECTION)).toFixed(1);
  
  previewModal.innerHTML = `
    <div class="modal-content" style="max-width: 700px;">
      <div class="modal-header">
        <h2>📄 Vista Previa del Reporte</h2>
        <button class="modal-close" onclick="document.getElementById('preview-modal-temp').remove()">&times;</button>
      </div>
      <div class="modal-body">
        <div style="background: linear-gradient(135deg, #6c5ce7, #a78bfa); padding: 2rem; border-radius: 12px; color: white; text-align: center; margin-bottom: 1.5rem;">
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">VOCATIO</h3>
          <p style="margin: 0; opacity: 0.9;">Reporte de Test Vocacional</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0; color: #1a1a1a; font-size: 1.125rem;">Contenido del reporte:</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${selectedSections.map((section, index) => `
              <div style="display: flex; gap: 1rem; align-items: start;">
                <div style="width: 32px; height: 32px; background: #6c5ce7; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">
                  ${index + 1}
                </div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 0.25rem;">${section.title}</div>
                  <div style="color: #666; font-size: 0.875rem;">${section.description}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 0.875rem; color: #2e7d32; margin-bottom: 0.25rem;">Secciones incluidas</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #1b5e20;">${count}</div>
          </div>
          <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 0.875rem; color: #1565c0; margin-bottom: 0.25rem;">Tamaño estimado</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #0d47a1;">${size} MB</div>
          </div>
        </div>
        
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <div style="font-weight: 600; color: #856404; margin-bottom: 0.5rem;">💡 Nota importante:</div>
          <div style="color: #856404; font-size: 0.875rem;">
            El PDF incluirá gráficos visuales, análisis detallado y recomendaciones personalizadas.
            Este es un documento profesional que podrás compartir con orientadores o instituciones educativas.
          </div>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button onclick="document.getElementById('preview-modal-temp').remove()" class="btn btn-secondary">Cerrar</button>
          <button onclick="document.getElementById('preview-modal-temp').remove(); document.getElementById('download-form').dispatchEvent(new Event('submit', { cancelable: true }))" class="btn btn-primary">Descargar ahora</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(previewModal);
  
  // Cerrar al hacer clic fuera
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
      previewModal.remove();
    }
  });
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
      showShareOptions();
    });
  }
  
  // Guardar datos del test actual en historial (simulación)
  const testData = {
    profile: 'Analítico-Sistemático',
    areas: {
      'Ingeniería': 80,
      'Tecnología': 60,
      'Negocios': 20
    },
    careers: ['Ingeniería de Sistemas', 'Ciencia de Datos', 'Ingeniería Industrial']
  };
  saveTestHistory(testData.profile, testData.areas, testData.careers);
  
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
// FUNCIONES DE COMPARTIR MEJORADAS
// ============================================
function showShareOptions() {
  const shareModal = document.createElement('div');
  shareModal.className = 'modal-overlay active';
  shareModal.id = 'share-modal-temp';
  
  shareModal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header">
        <h2>Compartir Resultados</h2>
        <button class="modal-close" onclick="document.getElementById('share-modal-temp').remove()">&times;</button>
      </div>
      <div class="modal-body">
        <p style="color: #666; margin-bottom: 1.5rem;">Elige cómo deseas compartir tus resultados:</p>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <button onclick="shareViaWhatsApp(); document.getElementById('share-modal-temp').remove();" class="btn btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </button>
          
          <button onclick="sendReportByEmail(); document.getElementById('share-modal-temp').remove();" class="btn btn-secondary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Enviar por Email
          </button>
          
          <button onclick="copyLinkToClipboard(); document.getElementById('share-modal-temp').remove();" class="btn btn-secondary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Copiar enlace
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(shareModal);
  
  shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
      shareModal.remove();
    }
  });
}

function shareViaWhatsApp() {
  const message = `VOCATIO - Mis Resultados

Test Vocacional - 10 de enero, 2025

*Perfil Vocacional:* Analítico-Sistemático

*Áreas de Mayor Afinidad:*
• Ingeniería: 80%
• Tecnología: 60%
• Negocios: 20%

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
  
  window.open(whatsappUrl, '_blank');
  console.log('Compartir por WhatsApp activado');
}

function copyLinkToClipboard() {
  const link = window.location.href;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(() => {
      alert('✓ Enlace copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar:', err);
      fallbackCopyTextToClipboard(link);
    });
  } else {
    fallbackCopyTextToClipboard(link);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    alert('✓ Enlace copiado al portapapeles');
  } catch (err) {
    console.error('Error al copiar:', err);
    alert('No se pudo copiar el enlace');
  }
  
  document.body.removeChild(textArea);
}

