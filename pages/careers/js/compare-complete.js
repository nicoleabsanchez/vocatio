// compare.js - Implementación mejorada con UX/UI optimizada
// Maneja: validaciones, eventos, manipulación del DOM y feedback visual
(function () {
  /*
    Datos (catálogo) adaptados del ejemplo React proporcionado
  */
  const careerCatalog = [
    { id: 1, name: 'Ingeniería de Sistemas', duration: '5 años', area: 'Tecnología', modality: 'Presencial', jobDemand: 'Alta demanda', difficulty: 'Alto', investment: 'S/ 2,500-4,000/mes' },
    { id: 2, name: 'Administración de empresas', duration: '5 años', area: 'Negocios', modality: 'Presencial', jobDemand: 'Media demanda', difficulty: 'Medio', investment: 'S/ 2,000-3,500/mes' },
    { id: 3, name: 'Psicología', duration: '5 años', area: 'Social', modality: 'Presencial', jobDemand: 'Media demanda', difficulty: 'Medio-Alto', investment: 'S/ 2,200-3,800/mes' },
    { id: 4, name: 'Medicina', duration: '7 años', area: 'Salud', modality: 'Presencial', jobDemand: 'Muy alta demanda', difficulty: 'Muy Alto', investment: 'S/ 3,500-6,000/mes' },
    { id: 5, name: 'Derecho', duration: '5 años', area: 'Social', modality: 'Presencial', jobDemand: 'Media demanda', difficulty: 'Medio-Alto', investment: 'S/ 2,000-4,000/mes' },
    { id: 6, name: 'Arquitectura', duration: '5 años', area: 'Arte y Diseño', modality: 'Presencial', jobDemand: 'Media demanda', difficulty: 'Alto', investment: 'S/ 2,500-4,500/mes' },
    { id: 7, name: 'Ingeniería Civil', duration: '5 años', area: 'Ingeniería', modality: 'Presencial', jobDemand: 'Alta demanda', difficulty: 'Alto', investment: 'S/ 2,300-4,200/mes' },
    { id: 8, name: 'Marketing', duration: '4 años', area: 'Negocios', modality: 'Presencial/Virtual', jobDemand: 'Alta demanda', difficulty: 'Medio', investment: 'S/ 1,800-3,200/mes' },
    { id: 9, name: 'Diseño Gráfico', duration: '4 años', area: 'Arte y Diseño', modality: 'Presencial/Virtual', jobDemand: 'Media demanda', difficulty: 'Medio', investment: 'S/ 1,500-3,000/mes' },
    { id: 10, name: 'Contabilidad', duration: '5 años', area: 'Negocios', modality: 'Presencial/Virtual', jobDemand: 'Media demanda', difficulty: 'Medio', investment: 'S/ 1,800-3,000/mes' }
  ];

  const features = ['Duración','Área','Modalidad','Salida Laboral','Nivel de Dificultad','Inversión Promedio'];

  // Estado
  let selectedCareerIds = [1,2,3]; // inicial
  let showCatalog = false;
  const STORAGE_KEY = 'selectedCareerIds';

  // DOM refs
  const controls = document.querySelector('.comparison-controls');
  const addBtn = document.getElementById('add-career-btn');
  const downloadBtn = document.getElementById('download-pdf-btn');
  const compareStrengthsBtn = document.getElementById('compare-strengths-btn');
  const strengthsAnalysis = document.getElementById('strengths-analysis');
  const grid = document.getElementById('comparison-grid');
  const statsElement = document.getElementById('comparison-stats');

  // Crear contenedor de catálogo dinámicamente
  const catalogContainer = document.createElement('div');
  catalogContainer.className = 'career-catalog';
  if (controls && controls.parentNode) controls.parentNode.insertBefore(catalogContainer, controls.nextSibling);

  /* ---------- UTILIDADES MEJORADAS ---------- */
  
  // Sistema de notificaciones toast
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${getIconForType(type)}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  function getIconForType(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }

  // Actualizar estadísticas
  function updateStats() {
    if (!statsElement) return;
    const count = selectedCareerIds.length;
    statsElement.innerHTML = `
      <span class="stat-badge">${count} ${count === 1 ? 'carrera seleccionada' : 'carreras seleccionadas'}</span>
    `;
    
    // Habilitar/deshabilitar botones según el estado
    if (downloadBtn) downloadBtn.disabled = count === 0;
    if (compareStrengthsBtn) compareStrengthsBtn.disabled = count < 2;
  }

  /* ---------- Validaciones ---------- */
  function existsInSelected(id) {
    return selectedCareerIds.indexOf(id) !== -1;
  }

  function canAddMore() {
    return selectedCareerIds.length < 4;
  }

  /* ---------- Persistencia (localStorage) ---------- */
  function saveSelectedToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCareerIds));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  function loadSelectedFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const filtered = parsed.map(Number).filter(n => !isNaN(n));
        if (filtered.length > 0 && filtered.length <= 4) {
          selectedCareerIds = filtered;
        }
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
  }

  /* ---------- Eventos y lógica mejorada ---------- */
  function bind() {
    // Toggle catálogo al pulsar el botón principal
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!canAddMore()) {
          showToast('Has alcanzado el límite de 4 carreras para comparar', 'warning');
          return;
        }
        showCatalog = !showCatalog;
        addBtn.textContent = showCatalog ? '✕ Cerrar' : '+ Agregar Carrera';
        renderCatalog();
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (selectedCareerIds.length === 0) {
          showToast('Selecciona al menos una carrera para exportar', 'error');
          return;
        }
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Generando PDF...';
        try {
          await exportarComparacionPDF();
          showToast('PDF descargado exitosamente', 'success');
        } catch (error) {
          showToast('Error al generar el PDF', 'error');
        } finally {
          downloadBtn.disabled = false;
          downloadBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3v9m0 0l-3-3m3 3l3-3M3 17h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Exportar PDF
          `;
        }
      });
    }

    if (compareStrengthsBtn) {
      compareStrengthsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (selectedCareerIds.length < 2) {
          showToast('Necesitas al menos 2 carreras para analizar', 'warning');
          return;
        }
        mostrarAnalisisFortalezas();
        showToast('Análisis generado', 'success');
      });
    }
    
    // Inicializar la carga del estado
    loadSelectedFromLocalStorage();
    updateStats();
    render();
  }

  function handleAddCareerById(id) {
    id = Number(id);
    if (existsInSelected(id)) {
      showToast('Esta carrera ya está en la comparación', 'warning');
      return;
    }
    if (canAddMore()) {
      selectedCareerIds.push(id);
      showCatalog = false;
      saveSelectedToLocalStorage();
      updateStats();
      const career = careerCatalog.find(c => c.id === id);
      showToast(`${career.name} añadida a la comparación`, 'success');
      if (addBtn) addBtn.textContent = '+ Agregar Carrera';
      render();
    } else {
      showToast('Has alcanzado el límite de 4 carreras', 'warning');
    }
  }

  function handleRemoveCareerById(id) {
    id = Number(id);
    const career = careerCatalog.find(c => c.id === id);
    selectedCareerIds = selectedCareerIds.filter(cId => cId !== id);
    saveSelectedToLocalStorage();
    updateStats();
    
    // Ocultar el análisis si la lista cae a menos de 2
    if (selectedCareerIds.length < 2 && strengthsAnalysis) {
      strengthsAnalysis.classList.remove('active');
      strengthsAnalysis.style.display = 'none';
    }
    
    showToast(`${career.name} eliminada de la comparación`, 'info');
    render();
  }

  /* ---------- Renderizado de Componentes ---------- */

  // Función para exportar la comparación a PDF
  async function exportarComparacionPDF() {
    try {
      // Verificar que jsPDF esté disponible
      if (typeof window.jspdf === 'undefined') {
        showToast('Error: Librería PDF no disponible', 'error');
        return;
      }
      
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('l', 'mm', 'a4'); // Horizontal (landscape)
      
      const selectedCareerData = selectedCareerIds
        .map(id => careerCatalog.find(c => c.id === id))
        .filter(c => c);

      if (selectedCareerData.length === 0) {
        showToast('No hay carreras para exportar', 'warning');
        return;
      }

      // Header del PDF
      let y = 20;
      
      // Logo/Título
      doc.setFontSize(28);
      doc.setTextColor(105, 62, 254);
      doc.setFont('helvetica', 'bold');
      doc.text('vocatio', 15, y);
      
      y += 12;
      doc.setFontSize(20);
      doc.setTextColor(69, 68, 76);
      doc.text('Comparación de Carreras', 15, y);
      
      y += 10;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(103, 102, 111);
      const fecha = new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.text(`Fecha de exportación: ${fecha}`, 15, y);
      
      y += 8;
      doc.text(`Total de carreras comparadas: ${selectedCareerData.length}`, 15, y);
      
      y += 10;
      
      // Tabla de comparación
      const head = [['Características'].concat(selectedCareerData.map(c => c.name))];
      
      const body = [
        { label: '⏱️ Duración', key: 'duration' },
        { label: '📚 Área', key: 'area' },
        { label: '🎓 Modalidad', key: 'modality' },
        { label: '💼 Salida Laboral', key: 'jobDemand' },
        { label: '📊 Nivel de Dificultad', key: 'difficulty' },
        { label: '💰 Inversión Promedio', key: 'investment' }
      ].map(row => [
        row.label,
        ...selectedCareerData.map(c => c[row.key] || 'N/A')
      ]);

      doc.autoTable({
        startY: y,
        head: head,
        body: body,
        styles: { 
          fontSize: 10, 
          cellPadding: 4,
          lineColor: [217, 212, 255],
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [248, 248, 255], 
          textColor: [69, 68, 76], 
          fontStyle: 'bold',
          fontSize: 11
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [250, 249, 255] }
        },
        alternateRowStyles: { 
          fillColor: [255, 255, 255] 
        },
        margin: { left: 15, right: 15 },
        theme: 'grid'
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(139, 138, 146);
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          '© 2025 VOCATIO by DecideClaro',
          15,
          doc.internal.pageSize.height - 10
        );
      }

      // Descargar el PDF
      const fileName = `comparacion_carreras_${new Date().getTime()}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      showToast('Error al generar el PDF', 'error');
      throw error;
    }
  }

  // Analiza fortalezas y debilidades de cada carrera vs la primera seleccionada
  function mostrarAnalisisFortalezas() {
    if (!strengthsAnalysis) return;
    strengthsAnalysis.innerHTML = '';

    const selectedCareerData = selectedCareerIds
      .map(id => careerCatalog.find(c => c.id === id))
      .filter(c => c);
      
    if (selectedCareerData.length < 2) {
      strengthsAnalysis.style.display = 'block';
      strengthsAnalysis.classList.add('active');
      strengthsAnalysis.innerHTML = '<p style="color:#693EFE; font-weight:600; text-align:center;">Agrega al menos dos carreras para comparar fortalezas y debilidades.</p>';
      return;
    }

    const baseCareer = selectedCareerData[0];
    
    let html = `
      <div style="text-align:center; margin-bottom:24px;">
        <h3 style="color:#693EFE; font-size:28px; margin-bottom:12px; font-weight:800;">
          🎯 Análisis Comparativo Detallado
        </h3>
        <p style="font-size:16px; color:#45444C;">
          Comparando todas las carreras respecto a <span style='font-weight:700; color:#693EFE;'>${baseCareer.name}</span>
        </p>
      </div>
    `;

    const analysisRows = selectedCareerData.slice(1).map(career => {
      let differences = [];
      let similarities = [];

      // Lógica de comparación mejorada
      if (career.difficulty !== baseCareer.difficulty) {
        differences.push(`<strong>Dificultad:</strong> ${career.difficulty} vs ${baseCareer.difficulty}`);
      } else {
        similarities.push(`Mismo nivel de dificultad (${career.difficulty})`);
      }
      
      if (career.jobDemand !== baseCareer.jobDemand) {
        differences.push(`<strong>Salida Laboral:</strong> ${career.jobDemand} vs ${baseCareer.jobDemand}`);
      } else {
        similarities.push(`Misma demanda laboral`);
      }
      
      if (career.duration !== baseCareer.duration) {
        differences.push(`<strong>Duración:</strong> ${career.duration} vs ${baseCareer.duration}`);
      } else {
        similarities.push(`Misma duración (${career.duration})`);
      }
      
      if (career.investment !== baseCareer.investment) {
        differences.push(`<strong>Inversión:</strong> ${career.investment} vs ${baseCareer.investment}`);
      } else {
        similarities.push(`Inversión similar`);
      }
      
      if (career.area !== baseCareer.area) {
        differences.push(`<strong>Área:</strong> ${career.area} vs ${baseCareer.area}`);
      } else {
        similarities.push(`Misma área de estudio (${career.area})`);
      }

      return `
        <div style="background: linear-gradient(135deg, #faf9ff, white); border-radius:12px; padding:24px; margin-bottom:16px; border-left:4px solid #693EFE;">
          <h4 style="font-size:20px; color:#693EFE; margin-bottom:16px; font-weight:700; display:flex; align-items:center; gap:8px;">
            <span>⚖️</span>
            <span>${career.name}</span>
          </h4>
          
          ${differences.length > 0 ? `
            <div style="margin-bottom:16px;">
              <p style="font-weight:700; color:#45444C; margin-bottom:8px; font-size:15px;">🔴 Diferencias clave:</p>
              <ul style="list-style-type:none; padding:0; margin:0;">
                ${differences.map(d => `<li style="margin-bottom:6px; font-size:14px; padding-left:20px; position:relative;">
                  <span style="position:absolute; left:0;">•</span>${d}
                </li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${similarities.length > 0 ? `
            <div>
              <p style="font-weight:700; color:#4CAF50; margin-bottom:8px; font-size:15px;">🟢 Similitudes:</p>
              <ul style="list-style-type:none; padding:0; margin:0;">
                ${similarities.map(s => `<li style="margin-bottom:6px; font-size:14px; padding-left:20px; position:relative;">
                  <span style="position:absolute; left:0;">✓</span>${s}
                </li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    html += analysisRows;
    strengthsAnalysis.style.display = 'block';
    strengthsAnalysis.classList.add('active');
    strengthsAnalysis.innerHTML = html;
    
    // Scroll suave hacia el análisis
    strengthsAnalysis.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  // Renderiza el catálogo de carreras disponibles para añadir
  function renderCatalog() {
    if (!catalogContainer) return;

    if (!showCatalog) {
      catalogContainer.style.display = 'none';
      return;
    }

    const available = careerCatalog.filter(c => !existsInSelected(c.id));
    catalogContainer.innerHTML = '';
    
    if (available.length === 0) {
      catalogContainer.style.display = 'block';
      catalogContainer.innerHTML = `
        <div class="catalog-box">
          <p style="text-align:center; color:#693EFE; font-weight:600; font-size:18px;">
            ✓ Todas las carreras del catálogo ya están seleccionadas
          </p>
        </div>
      `;
      return;
    }
    
    catalogContainer.style.display = 'block';

    const box = document.createElement('div');
    box.className = 'catalog-box';
    
    const h3 = document.createElement('h3');
    h3.textContent = `Selecciona una carrera (${available.length} disponibles)`;
    box.appendChild(h3);
    
    const gridWrap = document.createElement('div');
    gridWrap.className = 'catalog-grid';

    available.forEach(career => {
      const card = document.createElement('div');
      card.className = 'career-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Agregar ${career.name} a la comparación`);
      
      const h4 = document.createElement('h4');
      h4.textContent = career.name;
      h4.className = 'career-card__title';
      card.appendChild(h4);
      
      const p = document.createElement('p');
      p.textContent = `${career.area} • ${career.duration}`;
      p.className = 'career-card__meta';
      card.appendChild(p);
      
      const demand = document.createElement('p');
      demand.textContent = career.jobDemand;
      demand.style.cssText = 'font-size:12px; color:#693EFE; font-weight:600; margin-top:8px;';
      card.appendChild(demand);

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        handleAddCareerById(career.id);
      });
      
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAddCareerById(career.id);
        }
      });
      
      gridWrap.appendChild(card);
    });

    box.appendChild(gridWrap);
    catalogContainer.appendChild(box);
  }


  // Renderiza la tabla de comparación mejorada
  function renderComparisonGrid() {
    if (!grid) return;
    grid.innerHTML = ''; 

    if (selectedCareerIds.length === 0) {
      grid.innerHTML = `
        <div style="padding:60px 40px; text-align:center; grid-column:1/-1;">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style="margin:0 auto 20px; opacity:0.3;">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#693EFE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3 style="color:#693EFE; font-size:24px; margin-bottom:12px; font-weight:700;">
            Comienza tu comparación
          </h3>
          <p style="color:#67666F; font-size:16px; margin-bottom:24px;">
            Selecciona al menos una carrera usando el botón "Agregar Carrera"
          </p>
          <button onclick="document.getElementById('add-career-btn').click()" 
                  style="background:#693EFE; color:white; border:none; padding:12px 24px; border-radius:8px; cursor:pointer; font-weight:600; font-size:15px;">
            + Agregar Primera Carrera
          </button>
        </div>
      `;
      return;
    }

    const selectedCareerData = selectedCareerIds
      .map(id => careerCatalog.find(c => c.id === id))
      .filter(c => c);

    if (selectedCareerData.length === 0) return;

    // 1. Header vacío para la columna de etiquetas
    const emptyHeader = document.createElement('div');
    emptyHeader.className = 'grid-header-item';
    grid.appendChild(emptyHeader);

    // 2. Career headers (Título + botón de remover)
    selectedCareerData.forEach((career) => {
      const h = document.createElement('div');
      h.className = 'grid-header-item'; 
      
      const title = document.createElement('h4');
      title.className = 'grid-title';
      title.textContent = career.name;
      h.appendChild(title);
      
      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right:4px;">
          <path d="M4 6l8 8M12 6l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Quitar
      `;
      removeBtn.className = 'remove-btn';
      removeBtn.setAttribute('aria-label', `Quitar ${career.name} de la comparación`);
      removeBtn.addEventListener('click', () => handleRemoveCareerById(career.id));
      h.appendChild(removeBtn);

      grid.appendChild(h);
    });

    // 3. Data rows
    const rows = [
      { label: 'Duración', key: 'duration', icon: '⏱️' },
      { label: 'Área', key: 'area', icon: '📚' },
      { label: 'Modalidad', key: 'modality', icon: '🎓' },
      { label: 'Salida Laboral', key: 'jobDemand', icon: '💼' },
      { label: 'Nivel de Dificultad', key: 'difficulty', icon: '📊' },
      { label: 'Inversión Promedio', key: 'investment', icon: '💰' }
    ];

    rows.forEach((row) => {
      // a) Columna de Etiqueta
      const label = document.createElement('div');
      label.className = 'grid-feature-label';
      label.innerHTML = `<span style="margin-right:8px;">${row.icon}</span>${row.label}`;
      grid.appendChild(label);

      // b) Columnas de Datos
      selectedCareerIds.forEach((id) => {
        const career = careerCatalog.find(c => c.id === id) || {};
        const cell = document.createElement('div');
        cell.className = 'grid-data-cell';
        const value = career[row.key] || 'N/A';
        cell.textContent = value;
        cell.setAttribute('data-label', row.label);
        grid.appendChild(cell);
      });
    });

    // Ajustar la cuadrícula CSS dinámicamente
    const numColumns = selectedCareerIds.length + 1;
    grid.style.gridTemplateColumns = `1.2fr repeat(${selectedCareerIds.length}, 1fr)`;
    
    // Limpiar bordes de la última columna
    const allCells = grid.querySelectorAll('div');
    allCells.forEach((cell, index) => {
      if ((index + 1) % numColumns === 0) {
        cell.style.borderRight = 'none';
      } else {
        cell.style.borderRight = '1px solid rgba(217, 212, 255, 0.3)';
      }
    });
  }

  function render() {
    renderComparisonGrid();
    renderCatalog();
    updateStats();
  }

  // Inicializar todo
  bind();
})();