// ============================================
// VARIABLES GLOBALES
// ============================================
const BASE_FILE_SIZE = 0.5; // MB
const SIZE_PER_SECTION = 0.5; // MB por sección

// Datos aleatorios para resultados
const PERFILES = [
  'Analítico-Sistemático',
  'Creativo-Innovador',
  'Social-Humanista',
  'Emprendedor-Dinámico',
  'Científico-Investigador',
  'Artístico-Expresivo'
];

const AREAS_CONOCIMIENTO = [
  'Ingeniería',
  'Tecnología',
  'Negocios',
  'Arte y Diseño',
  'Ciencias Sociales',
  'Ciencias Naturales',
  'Salud',
  'Humanidades'
];

const CARRERAS_POR_AREA = {
  'Ingeniería': ['Ingeniería de Sistemas', 'Ingeniería Industrial', 'Ingeniería Mecatrónica', 'Ingeniería Civil', 'Ingeniería Electrónica'],
  'Tecnología': ['Ciencia de Datos', 'Desarrollo de Software', 'Ciberseguridad', 'Inteligencia Artificial', 'Arquitectura de Software'],
  'Negocios': ['Administración de Empresas', 'Marketing Digital', 'Finanzas', 'Economía', 'Comercio Internacional'],
  'Arte y Diseño': ['Diseño Gráfico', 'Diseño UX/UI', 'Arquitectura', 'Diseño Industrial', 'Artes Visuales'],
  'Ciencias Sociales': ['Psicología', 'Sociología', 'Trabajo Social', 'Antropología', 'Comunicación Social'],
  'Ciencias Naturales': ['Biología', 'Química', 'Física', 'Matemáticas', 'Ciencias Ambientales'],
  'Salud': ['Medicina', 'Enfermería', 'Nutrición', 'Fisioterapia', 'Odontología'],
  'Humanidades': ['Derecho', 'Filosofía', 'Historia', 'Lenguas Modernas', 'Educación']
};

// Variable para almacenar resultados generados
let testResults = null;

// Función para generar resultados aleatorios
function generateRandomResults() {
  // Seleccionar perfil aleatorio
  const perfil = PERFILES[Math.floor(Math.random() * PERFILES.length)];
  
  // Generar 3 áreas aleatorias con porcentajes
  const areasSeleccionadas = [];
  const areasDisponibles = [...AREAS_CONOCIMIENTO];
  
  for (let i = 0; i < 3; i++) {
    const index = Math.floor(Math.random() * areasDisponibles.length);
    areasSeleccionadas.push(areasDisponibles.splice(index, 1)[0]);
  }
  
  // Generar porcentajes decrecientes (primera área más alta)
  const porcentajes = {};
  let porcentajeBase = Math.floor(Math.random() * 21) + 70; // 70-90%
  
  areasSeleccionadas.forEach((area, index) => {
    porcentajes[area] = porcentajeBase;
    porcentajeBase = Math.max(20, porcentajeBase - Math.floor(Math.random() * 16) - 15); // Decremento de 15-30%
  });
  
  // Generar carreras recomendadas basadas en las áreas
  const carrerasRecomendadas = [];
  areasSeleccionadas.forEach(area => {
    const carrerasArea = CARRERAS_POR_AREA[area] || [];
    if (carrerasArea.length > 0) {
      const carrera = carrerasArea[Math.floor(Math.random() * carrerasArea.length)];
      if (!carrerasRecomendadas.includes(carrera)) {
        carrerasRecomendadas.push(carrera);
      }
    }
  });
  
  // Asegurar que tengamos al menos 3 carreras
  while (carrerasRecomendadas.length < 3) {
    const todasCarreras = Object.values(CARRERAS_POR_AREA).flat();
    const carreraRandom = todasCarreras[Math.floor(Math.random() * todasCarreras.length)];
    if (!carrerasRecomendadas.includes(carreraRandom)) {
      carrerasRecomendadas.push(carreraRandom);
    }
  }
  
  return {
    perfil: perfil,
    porcentajes: porcentajes,
    areas: areasSeleccionadas,
    recomendaciones: carrerasRecomendadas.slice(0, 5),
    fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  };
}

// Cargar datos del test vocacional
function loadTestResults() {
  // Generar resultados aleatorios cada vez que se carga la página
  testResults = generateRandomResults();
  
  // Guardar en localStorage para mantener consistencia durante la sesión
  sessionStorage.setItem('currentTestResults', JSON.stringify(testResults));
  
  // Actualizar la página con los datos generados
  updateResultsDisplay();
}

function updateResultsDisplay() {
  if (!testResults) return;
  
  // Actualizar perfil vocacional
  const perfilElement = document.querySelector('.profile-type');
  if (perfilElement) {
    perfilElement.textContent = testResults.perfil;
  }
  
  // Actualizar fecha del test
  const fechaElements = document.querySelectorAll('h2');
  fechaElements.forEach(el => {
    if (el.textContent.includes('Test Vocacional')) {
      el.textContent = `Test Vocacional - ${testResults.fecha}`;
    }
  });
  
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
      
      const labels = item.querySelectorAll('span');
      if (labels[0]) labels[0].textContent = categoryKey;
      if (labels[1]) labels[1].textContent = percentage + '%';
      
      // Actualizar barra de progreso
      const progressBar = item.querySelector('.progress-bar-fill');
      if (progressBar) progressBar.style.width = percentage + '%';
    }
  });
  
  // Actualizar carreras recomendadas
  if (testResults.recomendaciones && testResults.recomendaciones.length > 0) {
    const careerBadges = document.querySelector('.career-badges');
    if (careerBadges) {
      careerBadges.innerHTML = testResults.recomendaciones.map(career => 
        `<span class="career-badge">${career}</span>`
      ).join('');
    }
  }
  
  // Actualizar historial con datos aleatorios anteriores
  updateHistorySection();
}


// Función para actualizar el historial con datos aleatorios
function updateHistorySection() {
  // Generar test anterior aleatorio
  const perfilAnterior = PERFILES[Math.floor(Math.random() * PERFILES.length)];
  
  const areasAnteriores = [];
  const areasDisponibles = [...AREAS_CONOCIMIENTO];
  for (let i = 0; i < 3; i++) {
    const index = Math.floor(Math.random() * areasDisponibles.length);
    areasAnteriores.push(areasDisponibles.splice(index, 1)[0]);
  }
  
  const porcentajesAnteriores = {};
  let porcentaje = Math.floor(Math.random() * 21) + 70;
  areasAnteriores.forEach(area => {
    porcentajesAnteriores[area] = porcentaje;
    porcentaje = Math.max(20, porcentaje - Math.floor(Math.random() * 16) - 15);
  });
  
  const carrerasAnteriores = [];
  areasAnteriores.forEach(area => {
    const carrerasArea = CARRERAS_POR_AREA[area] || [];
    if (carrerasArea.length > 0) {
      const carrera = carrerasArea[Math.floor(Math.random() * carrerasArea.length)];
      if (!carrerasAnteriores.includes(carrera)) {
        carrerasAnteriores.push(carrera);
      }
    }
  });
  
  // Actualizar el historial en el HTML
  const historyProfile = document.querySelector('.history-profile');
  if (historyProfile) {
    historyProfile.textContent = `Perfil: ${perfilAnterior}`;
  }
  
  const areasList = document.querySelector('.areas-list');
  if (areasList) {
    areasList.innerHTML = areasAnteriores.map((area, index) => 
      `<li><span class="dot"></span> ${area} (${porcentajesAnteriores[area]}%)</li>`
    ).join('');
  }
  
  const careerTags = document.querySelector('.career-tags');
  if (careerTags) {
    careerTags.innerHTML = carrerasAnteriores.slice(0, 3).map(career => 
      `<span class="career-tag">${career}</span>`
    ).join('');
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
    alert('⚠ Por favor ingresa un correo electrónico válido');
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
    errorMessage.innerHTML = '⚠ <strong style="margin-left: 0.5rem;">Selecciona al menos una sección para continuar</strong>';
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
  
  // Usar los datos aleatorios generados
  const datos = testResults || generateRandomResults();
  
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
  doc.text(`Fecha de generación: ${datos.fecha}`, 105, yPosition, { align: 'center' });
  
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
    doc.text(datos.perfil, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.setFont(undefined, 'normal');
    const profileDesc = getProfileDescription(datos.perfil);
    
    // Calcular líneas necesarias para la descripción
    const lines = doc.splitTextToSize(profileDesc, 170);
    doc.text(lines, 20, yPosition);
    yPosition += (lines.length * 5) + 10;
  }
  
  // ========== ÁREAS DE AFINIDAD ==========
  if (selectedSections.includes('affinity')) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('Áreas de Mayor Afinidad', 20, yPosition);
    yPosition += 12;
    
    const sortedAreas = Object.entries(datos.porcentajes).sort((a, b) => b[1] - a[1]);
    
    sortedAreas.forEach(([area, percentage]) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.setFont(undefined, 'bold');
      doc.text(`- ${area}`, 25, yPosition);
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(...grayColor);
      doc.text(`${percentage}%`, 180, yPosition, { align: 'right' });
      
      // Dibujar barra de progreso
      const barWidth = 150;
      const barHeight = 6;
      const fillWidth = (barWidth * percentage) / 100;
      
      doc.setDrawColor(224, 224, 224);
      doc.setFillColor(224, 224, 224);
      doc.roundedRect(25, yPosition + 3, barWidth, barHeight, 3, 3, 'F');
      
      doc.setFillColor(...primaryColor);
      doc.roundedRect(25, yPosition + 3, fillWidth, barHeight, 3, 3, 'F');
      
      yPosition += 16;
    });
    
    yPosition += 8;
  }
  
  // ========== CARRERAS RECOMENDADAS ==========
  if (selectedSections.includes('careers')) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('Carreras Recomendadas', 20, yPosition);
    yPosition += 10;
    
    datos.recomendaciones.forEach((career, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${career}`, 25, yPosition);
      
      const compatibilidad = 95 - (index * 5);
      const duracion = Math.floor(Math.random() * 2) + 4; // 4 o 5 años
      
      doc.setFontSize(10);
      doc.setTextColor(...grayColor);
      doc.setFont(undefined, 'normal');
      doc.text(`Compatibilidad: ${compatibilidad}% | Duracion: ${duracion} anos`, 25, yPosition + 5);
      
      yPosition += 15;
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
    
    const analysis = getAnalysisForProfile(datos.perfil);
    
    analysis.forEach(line => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Calcular si es una línea larga que necesita múltiples líneas
      const textLines = doc.splitTextToSize(line, 170);
      doc.text(textLines, 20, yPosition);
      
      // Ajustar yPosition según el número de líneas
      if (textLines.length > 1) {
        yPosition += (textLines.length * 5) + 1;
      } else {
        yPosition += line === '' ? 3 : 6;
      }
    });
    
    yPosition += 8;
  }
  
  // ========== COMPARACIÓN CON TESTS ANTERIORES ==========
  if (selectedSections.includes('comparison')) {
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
    
    // Generar datos comparativos aleatorios
    const areasComparacion = datos.areas.slice(0, 3);
    areasComparacion.forEach(area => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      
      const porcentajeActual = datos.porcentajes[area];
      const porcentajeAnterior = Math.max(20, porcentajeActual - Math.floor(Math.random() * 21) + 10);
      const diff = porcentajeActual - porcentajeAnterior;
      const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '->';
      const color = diff > 0 ? [16, 185, 129] : diff < 0 ? [239, 68, 68] : grayColor;
      
      doc.setTextColor(...color);
      doc.text(`${area}: ${porcentajeAnterior}% ${arrow} ${porcentajeActual}%`, 25, yPosition);
      yPosition += 6;
    });
    
    yPosition += 8;
  }
  
  // ========== RECOMENDACIONES DE ESTUDIO ==========
  if (selectedSections.includes('recommendations')) {
    if (yPosition > 180) {
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
    
    const recommendations = getRecommendationsForAreas(datos.areas);
    
    recommendations.forEach(line => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Calcular líneas necesarias
      const textLines = doc.splitTextToSize(line, 170);
      doc.text(textLines, 20, yPosition);
      
      // Ajustar espaciado
      if (line === '' || line.startsWith('===')) {
        yPosition += 3;
      } else if (textLines.length > 1) {
        yPosition += (textLines.length * 4.5) + 1;
      } else {
        yPosition += 5;
      }
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

// Función para obtener descripción del perfil
function getProfileDescription(perfil) {
  const descripciones = {
    'Analítico-Sistemático': 'Destacas por tu excepcional capacidad de análisis lógico y resolución de problemas complejos.\nTu enfoque metódico y sistemático te permite descomponer situaciones complejas en componentes\nmanejables. Esta habilidad es fundamental en campos como ingeniería, ciencias exactas y tecnología.\n\nCaracterísticas principales: pensamiento crítico desarrollado, alta precisión en el trabajo,\nexcelente capacidad de abstracción y orientación a resultados medibles.',
    'Creativo-Innovador': 'Tu mente creativa y capacidad para pensar de manera divergente te permiten generar\nideas originales y soluciones innovadoras. Tienes facilidad para conectar conceptos aparentemente\ndistantes y crear propuestas disruptivas. Esta cualidad es esencial en diseño, artes, marketing\ny emprendimiento.\n\nCaracterísticas principales: pensamiento lateral, alta adaptabilidad, capacidad de visualización,\ny habilidad para cuestionar el status quo.',
    'Social-Humanista': 'Posees una destacada inteligencia emocional y habilidades interpersonales que te permiten\nconectar profundamente con las personas. Tu empatía y sensibilidad social te impulsan a contribuir\nal bienestar colectivo. Sobresales en campos como educación, trabajo social, psicología y\nrecursos humanos.\n\nCaracterísticas principales: alta empatía, excelente comunicación interpersonal, capacidad de\nescucha activa y compromiso con causas sociales.',
    'Emprendedor-Dinámico': 'Tu espíritu emprendedor y capacidad para tomar iniciativas te distinguen en entornos\ndinámicos. Tienes facilidad para identificar oportunidades, asumir riesgos calculados y liderar\nproyectos innovadores. Destacas en negocios, gestión de proyectos y startups tecnológicas.\n\nCaracterísticas principales: visión estratégica, alta tolerancia al riesgo, capacidad de liderazgo,\ny orientación a resultados comerciales.',
    'Científico-Investigador': 'Tu curiosidad intelectual y rigor metodológico te impulsan a explorar fenómenos y\ncontribuir al avance del conocimiento. Disfrutas del proceso de investigación, formulación de\nhipótesis y experimentación. Sobresales en investigación científica, desarrollo tecnológico y\nacademia.\n\nCaracterísticas principales: pensamiento crítico avanzado, paciencia investigativa, atención al\ndetalle y pasión por el descubrimiento.',
    'Artístico-Expresivo': 'Tu sensibilidad artística y capacidad expresiva te permiten comunicar ideas, emociones\ny conceptos a través de diversos medios creativos. Tienes una percepción estética desarrollada\ny facilidad para trabajar con simbolismos y metáforas. Destacas en artes visuales, música,\nliteratura y diseño creativo.\n\nCaracterísticas principales: alta sensibilidad estética, capacidad de expresión emocional,\noriginalidad en la creación y apreciación por la belleza.'
  };
  
  return descripciones[perfil] || 'Perfil único con características especiales que te distinguen en tu área de interés.\nTu combinación de habilidades te prepara para contribuir de manera significativa en tu campo elegido.';
}

// Función para obtener análisis del perfil
function getAnalysisForProfile(perfil) {
  const analisis = {
    'Analítico-Sistemático': [
      'FORTALEZAS IDENTIFICADAS:',
      '',
      '- Pensamiento lógico y estructurado: Capacidad excepcional para descomponer problemas complejos',
      '  en componentes manejables y encontrar soluciones eficientes.',
      '',
      '- Alta capacidad de análisis: Habilidad para procesar grandes cantidades de información',
      '  e identificar patrones, tendencias y relaciones causa-efecto.',
      '',
      '- Resolución sistemática de problemas: Enfoque metodológico que garantiza consistencia',
      '  y precisión en los resultados obtenidos.',
      '',
      '- Habilidades matemáticas y cuantitativas: Facilidad para trabajar con números, fórmulas',
      '  y modelos abstractos.',
      '',
      '- Atención al detalle: Capacidad para mantener altos estándares de precisión en el trabajo.',
      '',
      'ÁREAS DE DESARROLLO RECOMENDADAS:',
      '',
      '- Habilidades de comunicación: Desarrollar la capacidad de explicar conceptos técnicos',
      '  a audiencias no especializadas de manera clara y accesible.',
      '',
      '- Inteligencia emocional: Fortalecer la empatía y comprensión de perspectivas diferentes',
      '  en entornos colaborativos.',
      '',
      '- Flexibilidad y adaptabilidad: Aprender a ajustar enfoques cuando las situaciones',
      '  requieren soluciones menos estructuradas.',
      '',
      '- Gestión de proyectos: Desarrollar habilidades de liderazgo y coordinación de equipos',
      '  multidisciplinarios.',
      '',
      'RECOMENDACIONES ESPECÍFICAS:',
      '',
      '-> Participa en proyectos colaborativos que te permitan trabajar con perfiles diversos',
      '-> Toma cursos de comunicación efectiva y presentaciones técnicas',
      '-> Busca oportunidades de mentoría para desarrollar habilidades de liderazgo',
      '-> Practica la escucha activa en reuniones y discusiones de equipo'
    ],
    'Creativo-Innovador': [
      'FORTALEZAS IDENTIFICADAS:',
      '',
      '- Pensamiento divergente: Capacidad excepcional para generar múltiples soluciones',
      '  creativas a un mismo problema.',
      '',
      '- Innovación disruptiva: Habilidad para cuestionar lo establecido y proponer enfoques',
      '  revolucionarios en diferentes contextos.',
      '',
      '- Adaptabilidad: Facilidad para ajustarte a cambios y encontrar oportunidades en',
      '  situaciones impredecibles.',
      '',
      '- Visión futurista: Capacidad para anticipar tendencias y visualizar posibilidades',
      '  antes que otros.',
      '',
      '- Síntesis de ideas: Habilidad para conectar conceptos aparentemente no relacionados',
      '  y crear propuestas originales.',
      '',
      'ÁREAS DE DESARROLLO RECOMENDADAS:',
      '',
      '- Organización y planificación: Desarrollar sistemas para estructurar tu creatividad',
      '  y llevar ideas a la ejecución.',
      '',
      '- Disciplina metodológica: Aprender a seguir procesos establecidos cuando la situación',
      '  lo requiere.',
      '',
      '- Análisis cuantitativo: Fortalecer habilidades para evaluar ideas con datos y métricas',
      '  objetivas.',
      '',
      '- Gestión del tiempo: Mejorar la capacidad de priorizar y cumplir con plazos establecidos.',
      '',
      'RECOMENDACIONES ESPECÍFICAS:',
      '',
      '-> Utiliza herramientas de gestión de proyectos para organizar tus ideas creativas',
      '-> Aprende metodologías ágiles como Design Thinking y Scrum',
      '-> Complementa tu creatividad con cursos de análisis de datos',
      '-> Establece rutinas que equilibren la exploración creativa con la ejecución práctica'
    ],
    'Social-Humanista': [
      'FORTALEZAS IDENTIFICADAS:',
      '',
      '- Inteligencia emocional avanzada: Capacidad excepcional para comprender y gestionar',
      '  emociones propias y ajenas.',
      '',
      '- Habilidades de comunicación: Facilidad para expresar ideas de manera clara, empática',
      '  y persuasiva.',
      '',
      '- Empatía profunda: Capacidad natural para ponerte en el lugar de otros y comprender',
      '  sus perspectivas y necesidades.',
      '',
      '- Construcción de relaciones: Habilidad para crear y mantener conexiones significativas',
      '  con personas diversas.',
      '',
      '- Compromiso social: Motivación genuina por contribuir al bienestar colectivo y',
      '  generar impacto positivo.',
      '',
      'ÁREAS DE DESARROLLO RECOMENDADAS:',
      '',
      '- Pensamiento analítico: Desarrollar habilidades para evaluar situaciones con datos',
      '  y evidencia objetiva.',
      '',
      '- Toma de decisiones difíciles: Fortalecer la capacidad de priorizar objetivos cuando',
      '  hay conflictos de intereses.',
      '',
      '- Competencias digitales: Aprender a usar tecnología y análisis de datos en contextos',
      '  sociales.',
      '',
      '- Gestión de límites: Desarrollar la capacidad de establecer límites saludables en',
      '  el trabajo con personas.',
      '',
      'RECOMENDACIONES ESPECÍFICAS:',
      '',
      '-> Toma cursos de estadística aplicada a ciencias sociales',
      '-> Aprende metodologías de investigación cualitativa y cuantitativa',
      '-> Desarrolla habilidades de autocuidado y gestión del estrés',
      '-> Complementa tu formación con conocimientos de psicología organizacional'
    ],
    'Emprendedor-Dinámico': [
      'FORTALEZAS IDENTIFICADAS:',
      '',
      '- Visión estratégica: Capacidad para identificar oportunidades de negocio y tendencias',
      '  de mercado antes que otros.',
      '',
      '- Liderazgo natural: Habilidad para inspirar, motivar y dirigir equipos hacia objetivos',
      '  ambiciosos.',
      '',
      '- Tolerancia al riesgo: Disposición para asumir riesgos calculados y aprender de los',
      '  fracasos.',
      '',
      '- Orientación a resultados: Enfoque en lograr metas concretas y generar valor tangible',
      '  rápidamente.',
      '',
      '- Networking efectivo: Facilidad para crear redes de contactos estratégicos y',
      '  aprovechar oportunidades.',
      '',
      'ÁREAS DE DESARROLLO RECOMENDADAS:',
      '',
      '- Gestión financiera: Profundizar en análisis financiero, presupuestos y control',
      '  de costos.',
      '',
      '- Paciencia estratégica: Desarrollar la capacidad de esperar el momento adecuado antes',
      '  de actuar.',
      '',
      '- Escucha del equipo: Fortalecer la capacidad de considerar opiniones diversas antes',
      '  de decidir.',
      '',
      '- Gestión operativa: Mejorar habilidades en procesos, sistemas y operaciones del día',
      '  a día.',
      '',
      'RECOMENDACIONES ESPECÍFICAS:',
      '',
      '-> Estudia casos de éxito y fracaso de emprendedores reconocidos',
      '-> Aprende sobre lean startup y metodologías de validación rápida',
      '-> Desarrolla competencias en análisis financiero y modelos de negocio',
      '-> Busca mentores con experiencia en emprendimiento y gestión empresarial'
    ],
    'Científico-Investigador': [
      'FORTALEZAS IDENTIFICADAS:',
      '',
      '- Curiosidad intelectual: Pasión genuina por comprender fenómenos y buscar respuestas',
      '  a preguntas complejas.',
      '',
      '- Rigor metodológico: Capacidad para diseñar y ejecutar investigaciones con alto nivel',
      '  de precisión científica.',
      '',
      '- Pensamiento crítico: Habilidad para cuestionar supuestos, evaluar evidencia y',
      '  formular conclusiones válidas.',
      '',
      '- Perseverancia investigativa: Disposición para dedicar tiempo y esfuerzo sostenido',
      '  a proyectos de largo plazo.',
      '',
      '- Documentación meticulosa: Capacidad para registrar, organizar y analizar información',
      '  de manera sistemática.',
      '',
      'ÁREAS DE DESARROLLO RECOMENDADAS:',
      '',
      '- Comunicación científica: Mejorar la capacidad de divulgar hallazgos a audiencias',
      '  no especializadas.',
      '',
      '- Trabajo colaborativo: Desarrollar habilidades para investigación interdisciplinaria',
      '  y trabajo en red.',
      '',
      '- Gestión de proyectos: Fortalecer competencias en planificación de recursos y plazos',
      '  de investigación.',
      '',
      '- Aplicación práctica: Aprender a traducir hallazgos teóricos en soluciones aplicables',
      '  al mundo real.',
      '',
      'RECOMENDACIONES ESPECÍFICAS:',
      '',
      '-> Participa en congresos y publicaciones científicas para compartir tu trabajo',
      '-> Colabora con investigadores de diferentes disciplinas',
      '-> Desarrolla habilidades en visualización de datos y storytelling científico',
      '-> Busca oportunidades de aplicar tu investigación a problemas sociales o industriales'
    ],
    'Artístico-Expresivo': [
      'FORTALEZAS IDENTIFICADAS:',
      '',
      '- Sensibilidad estética: Capacidad excepcional para percibir, apreciar y crear belleza',
      '  en diferentes formas.',
      '',
      '- Expresión emocional: Habilidad para comunicar ideas, sentimientos y conceptos a través',
      '  de medios artísticos.',
      '',
      '- Originalidad creativa: Capacidad para desarrollar trabajos únicos y auténticos que',
      '  reflejan tu visión personal.',
      '',
      '- Versatilidad expresiva: Facilidad para trabajar con diferentes técnicas, estilos y',
      '  formatos creativos.',
      '',
      '- Intuición artística: Capacidad para tomar decisiones creativas basadas en tu',
      '  sensibilidad y experiencia.',
      '',
      'ÁREAS DE DESARROLLO RECOMENDADAS:',
      '',
      '- Gestión profesional: Desarrollar habilidades para comercializar y gestionar tu',
      '  trabajo artístico.',
      '',
      '- Disciplina creativa: Establecer rutinas y métodos de trabajo que potencien tu',
      '  productividad artística.',
      '',
      '- Conocimientos técnicos: Dominar herramientas digitales y técnicas contemporáneas',
      '  relevantes a tu campo.',
      '',
      '- Visión de negocio: Aprender aspectos comerciales para monetizar tu talento artístico',
      '  de manera sostenible.',
      '',
      'RECOMENDACIONES ESPECÍFICAS:',
      '',
      '-> Construye un portafolio profesional que muestre tu mejor trabajo',
      '-> Aprende sobre marketing digital y redes sociales para artistas',
      '-> Estudia casos de artistas exitosos en tu campo',
      '-> Desarrolla habilidades empresariales complementarias a tu talento artístico'
    ]
  };
  
  return analisis[perfil] || [
    'FORTALEZAS IDENTIFICADAS:',
    '',
    '- Habilidades únicas en tu área de interés',
    '- Capacidad de aprendizaje continuo y adaptación',
    '- Versatilidad en diferentes contextos',
    '',
    'ÁREAS DE DESARROLLO RECOMENDADAS:',
    '',
    '- Habilidades complementarias que potencien tu perfil',
    '- Trabajo interdisciplinario y colaborativo',
    '- Actualización constante en tu campo'
  ];
}

// Función para obtener recomendaciones por área
function getRecommendationsForAreas(areas) {
  const recomendacionesPorArea = {
    'Ingeniería': [
      '=======================================================================',
      '           PLAN DE DESARROLLO PROFESIONAL - INGENIERÍA',
      '=======================================================================',
      '',
      ' CURSOS FUNDAMENTALES (Corto plazo - 0-6 meses):',
      '',
      '1. Cálculo y Álgebra Lineal para Ingeniería',
      '   - Plataforma: Khan Academy, MIT OpenCourseWare',
      '   - Duración: 12 semanas | Nivel: Fundamental',
      '   - Certificación: Disponible',
      '   - Inversion: Gratuito / $49 USD certificado',
      '',
      '2. Programacion Aplicada a la Ingenieria (Python/MATLAB)',
      '   - Plataforma: Coursera - Universidad de Michigan',
      '   - Duracion: 8 semanas | Nivel: Intermedio',
      '   - Certificacion: Si',
      '   - Inversion: $79 USD/mes',
      '',
      '3. Fundamentos de Física e Ingeniería Mecánica',
      '   - Plataforma: edX - MIT',
      '   - Duración: 10 semanas | Nivel: Fundamental',
      '   - Certificación: Verificada disponible',
      '   - Inversión: Gratuito auditar / $149 USD certificado',
      '',
      ' ESPECIALIZACIONES (Mediano plazo - 6-12 meses):',
      '',
      '- Diseño Asistido por Computadora (CAD)',
      '  Herramientas: AutoCAD, SolidWorks, Fusion 360',
      '',
      '- Análisis de Sistemas y Optimización',
      '  Enfoque: Modelado matemático y simulación',
      '',
      '- Gestión de Proyectos de Ingeniería',
      '  Metodologías: PMI, Agile for Engineering',
      '',
      ' LIBROS RECOMENDADOS:',
      '',
      '- "Introducción a la Ingeniería" - Paul Wright',
      '- "Fundamentos de Ingeniería y Diseño" - Reynolds & Stacey',
      '- "Pensamiento de Diseño en Ingeniería" - Don Norman',
      '',
      ' PODCASTS Y RECURSOS MULTIMEDIA:',
      '',
      '- Engineering Career Coach Podcast',
      '- The Engineering Commons',
      '- YouTube: Real Engineering, Practical Engineering',
      '',
      ' COMUNIDADES Y NETWORKING:',
      '',
      '- IEEE (Institute of Electrical and Electronics Engineers)',
      '- ASME (American Society of Mechanical Engineers)',
      '- LinkedIn Groups: Engineering Professionals, Young Engineers',
      '- Stack Overflow (para programación)',
      '',
      ' CERTIFICACIONES PROFESIONALES A CONSIDERAR:',
      '',
      '- FE Exam (Fundamentals of Engineering) - USA',
      '- CAD Certifications (AutoCAD, SolidWorks)',
      '- PMP (Project Management Professional)',
      '',
      ' EXPERIENCIA PRÁCTICA:',
      '',
      '-> Participa en competencias de ingeniería (robótica, diseño)',
      '-> Realiza proyectos personales documentados en GitHub/portfolio',
      '-> Busca pasantías o voluntariados en empresas de ingeniería',
      '-> Contribuye a proyectos de código abierto relacionados con ingeniería'
    ],
    'Tecnología': [
      '=======================================================================',
      '           PLAN DE DESARROLLO PROFESIONAL - TECNOLOGÍA',
      '=======================================================================',
      '',
      ' CURSOS FUNDAMENTALES (Corto plazo - 0-6 meses):',
      '',
      '1. Fundamentos de Programación (Python o JavaScript)',
      '   - Plataforma: freeCodeCamp, Codecademy, Platzi',
      '   - Duración: 8-10 semanas | Nivel: Principiante',
      '   - Certificación: Sí',
      '   - Inversión: Gratuito - $39 USD/mes',
      '',
      '2. Estructuras de Datos y Algoritmos',
      '   - Plataforma: Coursera - UC San Diego',
      '   - Duración: 6 meses | Nivel: Intermedio-Avanzado',
      '   - Certificación: Sí',
      '   - Inversión: $49 USD/mes',
      '',
      '3. Desarrollo Web Full Stack',
      '   - Plataforma: The Odin Project (gratuito) o Udemy',
      '   - Duración: 12-16 semanas | Nivel: Intermedio',
      '   - Stack: HTML, CSS, JavaScript, React, Node.js',
      '   - Inversión: Gratuito / $15-50 USD',
      '',
      '4. Bases de Datos y SQL',
      '   - Plataforma: Khan Academy, DataCamp',
      '   - Duración: 4 semanas | Nivel: Fundamental',
      '   - Certificación: Disponible',
      '   - Inversión: Gratuito - $25 USD/mes',
      '',
      ' ESPECIALIZACIONES (Mediano plazo - 6-12 meses):',
      '',
      '- Cloud Computing (AWS, Azure, Google Cloud)',
      '  Certificación: AWS Solutions Architect, Azure Fundamentals',
      '',
      '- DevOps y CI/CD',
      '  Herramientas: Docker, Kubernetes, Jenkins, Git',
      '',
      '- Inteligencia Artificial y Machine Learning',
      '  Frameworks: TensorFlow, PyTorch, Scikit-learn',
      '',
      '- Ciberseguridad',
      '  Certificación: CompTIA Security+, CEH',
      '',
      ' LIBROS RECOMENDADOS:',
      '',
      '- "Clean Code" - Robert C. Martin',
      '- "The Pragmatic Programmer" - Hunt & Thomas',
      '- "Designing Data-Intensive Applications" - Martin Kleppmann',
      '- "You Don\'t Know JS" (serie) - Kyle Simpson',
      '',
      ' PODCASTS Y RECURSOS:',
      '',
      '- Syntax.fm (Web Development)',
      '- Software Engineering Daily',
      '- The Changelog',
      '- YouTube: Fireship, Traversy Media, freeCodeCamp',
      '',
      ' COMUNIDADES Y NETWORKING:',
      '',
      '- GitHub (contribuye a proyectos open source)',
      '- Stack Overflow, Dev.to, Hashnode (comparte conocimiento)',
      '- Discord/Slack: FreeCodeCamp, Reactiflux, Python Discord',
      '- Meetups locales de tecnología',
      '',
      ' CERTIFICACIONES PROFESIONALES:',
      '',
      '- AWS Certified Solutions Architect / Developer',
      '- Google Cloud Professional',
      '- Microsoft Azure Fundamentals / Administrator',
      '- CompTIA A+, Network+, Security+',
      '- Certified Kubernetes Administrator (CKA)',
      '',
      ' EXPERIENCIA PRÁCTICA:',
      '',
      '-> Construye un portafolio con 5-10 proyectos diversos',
      '-> Contribuye a proyectos de código abierto en GitHub',
      '-> Participa en hackathons y competencias de programación',
      '-> Crea un blog técnico o canal de YouTube compartiendo tu aprendizaje',
      '-> Freelance en Upwork/Fiverr para ganar experiencia real'
    ],
    'Negocios': [
      '=======================================================================',
      '           PLAN DE DESARROLLO PROFESIONAL - NEGOCIOS',
      '=======================================================================',
      '',
      ' CURSOS FUNDAMENTALES (Corto plazo - 0-6 meses):',
      '',
      '1. Fundamentos de Administración de Empresas',
      '   - Plataforma: Coursera - Wharton School',
      '   - Duración: 8 semanas | Nivel: Fundamental',
      '   - Certificación: Sí',
      '   - Inversión: $49 USD/mes',
      '',
      '2. Análisis Financiero y Contabilidad',
      '   - Plataforma: edX - Harvard',
      '   - Duración: 6 semanas | Nivel: Intermedio',
      '   - Certificación: Verificada disponible',
      '   - Inversión: Gratuito auditar / $99 USD certificado',
      '',
      '3. Marketing Digital y Analytics',
      '   - Plataforma: Google Digital Garage, HubSpot Academy',
      '   - Duración: 4-8 semanas | Nivel: Fundamental-Intermedio',
      '   - Certificación: Gratuita',
      '   - Inversión: Gratuito',
      '',
      '4. Excel y Análisis de Datos para Negocios',
      '   - Plataforma: Udemy, LinkedIn Learning',
      '   - Duración: 6 semanas | Nivel: Intermedio',
      '   - Certificación: Sí',
      '   - Inversión: $15-40 USD',
      '',
      ' ESPECIALIZACIONES (Mediano plazo - 6-12 meses):',
      '',
      '- MBA Essentials (Mini-MBA)',
      '  Plataforma: Coursera, edX',
      '',
      '- Business Intelligence y Data Analytics',
      '  Herramientas: Power BI, Tableau, SQL',
      '',
      '- Gestión de Proyectos',
      '  Metodologías: Agile, Scrum, Six Sigma',
      '',
      '- Estrategia Empresarial',
      '  Frameworks: Blue Ocean, Porter\'s Five Forces',
      '',
      ' LIBROS RECOMENDADOS:',
      '',
      '- "Good to Great" - Jim Collins',
      '- "The Lean Startup" - Eric Ries',
      '- "Thinking, Fast and Slow" - Daniel Kahneman',
      '- "Influence: The Psychology of Persuasion" - Robert Cialdini',
      '- "Blue Ocean Strategy" - W. Chan Kim',
      '',
      ' PODCASTS Y RECURSOS:',
      '',
      '- Harvard Business Review IdeaCast',
      '- How I Built This (NPR)',
      '- The Tim Ferriss Show',
      '- Masters of Scale',
      '',
      ' COMUNIDADES Y NETWORKING:',
      '',
      '- LinkedIn (fundamental para networking en negocios)',
      '- Cámaras de Comercio locales',
      '- BNI (Business Network International)',
      '- Toastmasters (desarrollo de habilidades de presentación)',
      '',
      ' CERTIFICACIONES PROFESIONALES:',
      '',
      '- PMP (Project Management Professional)',
      '- Google Analytics Certification',
      '- HubSpot Inbound Marketing',
      '- Lean Six Sigma Green Belt',
      '- CFA (Chartered Financial Analyst) - nivel avanzado',
      '',
      ' EXPERIENCIA PRÁCTICA:',
      '',
      '-> Inicia un proyecto emprendedor propio (incluso pequeño)',
      '-> Busca pasantías en startups o empresas establecidas',
      '-> Voluntariado en organizaciones sin fines de lucro (gestión)',
      '-> Participa en competencias de casos de negocios',
      '-> Asiste a conferencias y eventos de networking empresarial'
    ],
    'Arte y Diseño': [
      '=======================================================================',
      '           PLAN DE DESARROLLO PROFESIONAL - ARTE Y DISEÑO',
      '=======================================================================',
      '',
      ' CURSOS FUNDAMENTALES (Corto plazo - 0-6 meses):',
      '',
      '1. Fundamentos de Diseño Visual',
      '   - Plataforma: Domestika, Skillshare, CalArts (Coursera)',
      '   - Duración: 6-8 semanas | Nivel: Fundamental',
      '   - Temas: Color, tipografía, composición, jerarquía visual',
      '   - Inversión: $10-20 USD/mes',
      '',
      '2. Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
      '   - Plataforma: Adobe, Udemy, LinkedIn Learning',
      '   - Duración: 8-12 semanas | Nivel: Fundamental-Intermedio',
      '   - Certificación: Adobe Certified Professional',
      '   - Inversión: $15-40 USD por curso',
      '',
      '3. UI/UX Design Fundamentals',
      '   - Plataforma: Coursera - Google UX Design',
      '   - Duración: 6 meses | Nivel: Certificado Profesional',
      '   - Herramientas: Figma, Adobe XD',
      '   - Inversión: $49 USD/mes',
      '',
      '4. Dibujo y Anatomía Artística',
      '   - Plataforma: New Masters Academy, Proko',
      '   - Duración: Continuo | Nivel: Todos los niveles',
      '   - Certificación: No formal',
      '   - Inversión: $35 USD/mes',
      '',
      ' ESPECIALIZACIONES (Mediano plazo - 6-12 meses):',
      '',
      '- Diseño 3D y Modelado',
      '  Software: Blender (gratuito), Cinema 4D, Maya',
      '',
      '- Motion Graphics y Animación',
      '  Herramientas: After Effects, Premiere Pro',
      '',
      '- Branding e Identidad Corporativa',
      '  Enfoque: Estrategia, logo design, brand guidelines',
      '',
      '- Fotografía y Edición',
      '  Software: Lightroom, Capture One',
      '',
      ' LIBROS RECOMENDADOS:',
      '',
      '- "The Design of Everyday Things" - Don Norman',
      '- "Thinking with Type" - Ellen Lupton',
      '- "Logo Design Love" - David Airey',
      '- "Steal Like an Artist" - Austin Kleon',
      '- "The Elements of Graphic Design" - Alex White',
      '',
      ' RECURSOS MULTIMEDIA:',
      '',
      '- YouTube: The Futur, Yes I\'m a Designer, Satori Graphics',
      '- Podcasts: Design Matters, 99% Invisible',
      '- Behance (inspiración y portafolio)',
      '- Dribbble (comunidad de diseñadores)',
      '',
      ' COMUNIDADES Y NETWORKING:',
      '',
      '- Behance Network',
      '- AIGA (American Institute of Graphic Arts)',
      '- Dribbble Community',
      '- Instagram (fundamental para diseñadores)',
      '- Design meetups locales',
      '',
      ' CERTIFICACIONES Y RECONOCIMIENTOS:',
      '',
      '- Adobe Certified Professional',
      '- Google UX Design Professional Certificate',
      '- Nielsen Norman Group UX Certification',
      '- Awwwards (reconocimiento en diseño web)',
      '',
      ' EXPERIENCIA PRÁCTICA:',
      '',
      '-> Construye un portafolio profesional en Behance o tu propio sitio web',
      '-> Toma proyectos freelance en 99designs, Fiverr, Upwork',
      '-> Participa en design challenges y concursos',
      '-> Rediseña marcas ficticias como ejercicio (30 day challenge)',
      '-> Colabora gratis con ONGs para ganar experiencia real',
      '-> Crea contenido diario en redes sociales mostrando tu proceso'
    ],
    'Ciencias Sociales': [
      '=======================================================================',
      '      PLAN DE DESARROLLO PROFESIONAL - CIENCIAS SOCIALES',
      '=======================================================================',
      '',
      ' CURSOS FUNDAMENTALES (Corto plazo - 0-6 meses):',
      '',
      '1. Metodología de la Investigación Social',
      '   - Plataforma: Coursera - Universidad de Amsterdam',
      '   - Duración: 8 semanas | Nivel: Intermedio',
      '   - Certificación: Sí',
      '   - Inversión: $49 USD/mes',
      '',
      '2. Estadística para Ciencias Sociales',
      '   - Plataforma: edX, DataCamp',
      '   - Duración: 10 semanas | Nivel: Fundamental-Intermedio',
      '   - Herramientas: SPSS, R, Python',
      '   - Inversión: Gratuito - $39 USD/mes',
      '',
      '3. Psicología Social y del Comportamiento',
      '   - Plataforma: Coursera - Wesleyan University',
      '   - Duración: 6 semanas | Nivel: Fundamental',
      '   - Certificación: Sí',
      '   - Inversión: $49 USD/mes',
      '',
      ' ESPECIALIZACIONES (Mediano plazo - 6-12 meses):',
      '',
      '- Análisis de Políticas Públicas',
      '  Enfoque: Evaluación de programas sociales',
      '',
      '- Trabajo Social y Desarrollo Comunitario',
      '  Metodologías: Participativas, acción social',
      '',
      '- Antropología Digital y Etnografía',
      '  Herramientas: Análisis cualitativo, NVIVO',
      '',
      ' LIBROS RECOMENDADOS:',
      '',
      '- "Thinking, Fast and Slow" - Daniel Kahneman',
      '- "The Social Animal" - Elliot Aronson',
      '- "Capital en el Siglo XXI" - Thomas Piketty',
      '- "Sapiens" - Yuval Noah Harari',
      '',
      ' PODCASTS Y RECURSOS:',
      '',
      '- Hidden Brain (NPR)',
      '- Freakonomics Radio',
      '- The Psychology Podcast',
      '',
      ' COMUNIDADES:',
      '',
      '- American Sociological Association',
      '- Redes académicas en ResearchGate',
      '- Grupos de investigación universitarios',
      '',
      ' EXPERIENCIA PRÁCTICA:',
      '',
      '-> Voluntariado en ONGs de desarrollo social',
      '-> Asistencia de investigación en proyectos académicos',
      '-> Realiza encuestas y análisis de comunidad',
      '-> Publica artículos en revistas o blogs especializados'
    ],
    'Ciencias Naturales': [
      '=======================================================================',
      '      PLAN DE DESARROLLO PROFESIONAL - CIENCIAS NATURALES',
      '=======================================================================',
      '',
      ' CURSOS FUNDAMENTALES (Corto plazo - 0-6 meses):',
      '',
      '1. Biología Molecular y Celular',
      '   - Plataforma: edX - MIT',
      '   - Duración: 12 semanas | Nivel: Universitario',
      '   - Certificación: Verificada disponible',
      '   - Inversión: Gratuito auditar / $149 USD certificado',
      '',
      '2. Química Orgánica y Análisis',
      '   - Plataforma: Khan Academy, Coursera',
      '   - Duración: 10 semanas | Nivel: Intermedio',
      '   - Certificación: Disponible',
      '   - Inversión: Gratuito - $49 USD',
      '',
      '3. Métodos Cuantitativos en Ciencias',
      '   - Plataforma: DataCamp, Coursera',
      '   - Duración: 8 semanas | Nivel: Intermedio',
      '   - Herramientas: R, Python, MATLAB',
      '   - Inversión: $25-49 USD/mes',
      '',
      ' ESPECIALIZACIONES (Mediano plazo - 6-12 meses):',
      '',
      '- Bioinformática y Genómica',
      '  Herramientas: Python, R, Biopython',
      '',
      '- Ciencias Ambientales y Sostenibilidad',
      '  Enfoque: Cambio climático, conservación',
      '',
      '- Técnicas de Laboratorio Avanzadas',
      '  Metodologías: Espectroscopía, cromatografía',
      '',
      ' LIBROS RECOMENDADOS:',
      '',
      '- "The Selfish Gene" - Richard Dawkins',
      '- "Silent Spring" - Rachel Carson',
      '- "A Short History of Nearly Everything" - Bill Bryson',
      '- "Lab Girl" - Hope Jahren',
      '',
      ' RECURSOS:',
      '',
      '- Podcasts: Science Friday, Radiolab, Nature Podcast',
      '- YouTube: Crash Course, Kurzgesagt, SciShow',
      '',
      ' COMUNIDADES:',
      '',
      '- ResearchGate (red académica)',
      '- Sociedades científicas especializadas',
      '- iNaturalist (ciencia ciudadana)',
      '',
      ' EXPERIENCIA PRÁCTICA:',
      '',
      '-> Asistente de investigación en laboratorios universitarios',
      '-> Programas de verano en instituciones científicas',
      '-> Proyectos de ciencia ciudadana',
      '-> Publicaciones en revistas científicas'
    ],
    'Salud': [
      '=======================================================================',
      '           PLAN DE DESARROLLO PROFESIONAL - SALUD',
      '=======================================================================',
      '',
      ' CURSOS FUNDAMENTALES (Corto plazo - 0-6 meses):',
      '',
      '1. Anatomía y Fisiología Humana',
      '   - Plataforma: Coursera - Universidad de Michigan',
      '   - Duración: 12 semanas | Nivel: Fundamental',
      '   - Certificación: Sí',
      '   - Inversión: $49 USD/mes',
      '',
      '2. Fundamentos de Salud Pública',
      '   - Plataforma: edX - Johns Hopkins',
      '   - Duración: 8 semanas | Nivel: Introductorio',
      '   - Certificación: Verificada disponible',
      '   - Inversión: Gratuito auditar / $99 USD certificado',
      '',
      '3. Primeros Auxilios y RCP',
      '   - Plataforma: Cruz Roja, American Heart Association',
      '   - Duración: 1-2 días | Nivel: Fundamental',
      '   - Certificación: Oficial',
      '   - Inversión: $50-100 USD',
      '',
      ' ESPECIALIZACIONES (Mediano plazo - 6-12 meses):',
      '',
      '- Nutrición y Dietética',
      '  Certificación: Nutrition Coach',
      '',
      '- Salud Mental y Psicología',
      '  Enfoque: Counseling básico, primeros auxilios psicológicos',
      '',
      '- Administración de Servicios de Salud',
      '  Áreas: Gestión hospitalaria, políticas de salud',
      '',
      ' LIBROS RECOMENDADOS:',
      '',
      '- "Being Mortal" - Atul Gawande',
      '- "The Body" - Bill Bryson',
      '- "When Breath Becomes Air" - Paul Kalanithi',
      '',
      ' RECURSOS:',
      '',
      '- Podcasts: The Doctor\'s Kitchen, Medscape',
      '- YouTube: Osmosis, Ninja Nerd',
      '',
      ' COMUNIDADES:',
      '',
      '- Asociaciones profesionales de salud',
      '- Foros médicos y de estudiantes',
      '- Voluntariado en hospitales',
      '',
      ' EXPERIENCIA PRÁCTICA:',
      '',
      '-> Voluntariado en clínicas y hospitales',
      '-> Shadowing de profesionales de la salud',
      '-> Campañas de salud comunitaria',
      '-> Certificaciones profesionales relevantes'
    ],
    'Humanidades': [
      '=======================================================================',
      '         PLAN DE DESARROLLO PROFESIONAL - HUMANIDADES',
      '=======================================================================',
      '',
      ' CURSOS FUNDAMENTALES (Corto plazo - 0-6 meses):',
      '',
      '1. Filosofía y Pensamiento Crítico',
      '   - Plataforma: Coursera - Universidad de Edimburgo',
      '   - Duración: 6 semanas | Nivel: Introductorio',
      '   - Certificación: Sí',
      '   - Inversión: $49 USD/mes',
      '',
      '2. Historia del Arte y Cultura',
      '   - Plataforma: Khan Academy, Coursera',
      '   - Duración: 8 semanas | Nivel: Todos los niveles',
      '   - Certificación: Disponible',
      '   - Inversión: Gratuito - $49 USD',
      '',
      '3. Escritura Creativa y Crítica',
      '   - Plataforma: Wesleyan (Coursera), MasterClass',
      '   - Duración: 6-8 semanas | Nivel: Intermedio',
      '   - Certificación: Sí',
      '   - Inversión: $49-180 USD',
      '',
      ' ESPECIALIZACIONES (Mediano plazo - 6-12 meses):',
      '',
      '- Estudios Culturales y Literatura Comparada',
      '  Enfoque: Análisis textual, teoría literaria',
      '',
      '- Historia y Patrimonio Cultural',
      '  Áreas: Preservación, museología',
      '',
      '- Lingüística y Lenguas Extranjeras',
      '  Idiomas: Según interés personal',
      '',
      ' LIBROS CLÁSICOS Y CONTEMPORÁNEOS:',
      '',
      '- "Sapiens" - Yuval Noah Harari',
      '- "1984" - George Orwell',
      '- "El Arte de la Guerra" - Sun Tzu',
      '- "Cien Años de Soledad" - Gabriel García Márquez',
      '',
      ' RECURSOS:',
      '',
      '- Podcasts: Philosophy Bites, The History of Philosophy',
      '- YouTube: CrashCourse Philosophy, TED-Ed',
      '',
      ' COMUNIDADES:',
      '',
      '- Clubes de lectura y escritura',
      '- Sociedades filosóficas',
      '- Foros literarios online',
      '',
      ' EXPERIENCIA PRÁCTICA:',
      '',
      '-> Escribe y publica ensayos o artículos',
      '-> Participa en debates y grupos de discusión',
      '-> Voluntariado en museos o bibliotecas',
      '-> Crea un blog o podcast sobre temas humanísticos'
    ]
  };
  
  const primeraArea = areas[0];
  const recs = recomendacionesPorArea[primeraArea] || [
    '=======================================================================',
    '           PLAN DE DESARROLLO PROFESIONAL',
    '=======================================================================',
    '',
    ' CURSOS FUNDAMENTALES:',
    '',
    '1. Fundamentos en tu área de interés',
    '   - Plataforma: Coursera, edX, Udemy',
    '   - Duración: 8-12 semanas',
    '   - Certificación: Disponible',
    '',
    ' EXPERIENCIA PRÁCTICA:',
    '',
    '-> Busca proyectos prácticos relacionados',
    '-> Conecta con profesionales del campo',
    '-> Construye un portafolio de trabajo',
    '-> Participa en comunidades especializadas'
  ];
  
  return recs;
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
    doc.text(`- ${area.name}`, 25, yPos);
    
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
    alert('⚠ Selecciona al menos una sección para ver la vista previa');
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
          <div style="font-weight: 600; color: #856404; margin-bottom: 0.5rem;"> Nota importante:</div>
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
- Ingeniería: 80%
- Tecnología: 60%
- Negocios: 20%

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

