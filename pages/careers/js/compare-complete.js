// compare.js - Implementación basada en el ejemplo React proporcionado
// Maneja: validaciones, eventos y manipulación del DOM
(function () {
  /*
    Datos (catálogo) adaptados del ejemplo React `career-comparison-app.tsx`.
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
  let selectedCareerIds = [1,2,3]; // inicial como en el ejemplo
  let showCatalog = false;
  const STORAGE_KEY = 'selectedCareerIds';

  // DOM refs (la HTML ya incluye `comparison-controls` y `comparison-grid`)
  const controls = document.querySelector('.comparison-controls');
  const addBtn = document.getElementById('add-career-btn');
  const select = document.getElementById('career-select');
  const downloadBtn = document.getElementById('download-pdf-btn');
  const compareStrengthsBtn = document.getElementById('compare-strengths-btn');
  const strengthsAnalysis = document.getElementById('strengths-analysis');
  const grid = document.getElementById('comparison-grid');
  const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = './explore.html'; 
      });
    }

  // Crear contenedor de catálogo dinámicamente (inserta después de controls)
  const catalogContainer = document.createElement('div');
  catalogContainer.className = 'career-catalog';
  if (controls && controls.parentNode) controls.parentNode.insertBefore(catalogContainer, controls.nextSibling);

  /* ---------- Validaciones ---------- */
  function existsInSelected(id) {
    return selectedCareerIds.indexOf(id) !== -1;
  }

  function canAddMore() {
    return selectedCareerIds.length < 4; // límite 4 como en el ejemplo React
  }

  /* ---------- Persistencia (localStorage) ---------- */
  function saveSelectedToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCareerIds));
    } catch (e) {
      // Silenciar errores de storage
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
      // ignore parse errors
    }
  }

  /* ---------- Eventos y lógica ---------- */
  function bind() {
    // Toggle catálogo al pulsar el botón principal
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showCatalog = !showCatalog;
        renderCatalog();
      });
    }

    // Poblar select con catálogo (compatibilidad)
    if (select) {
      select.innerHTML = '';
      careerCatalog.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        select.appendChild(opt);
      });
    }


    if (downloadBtn) {
      downloadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await exportarComparacionPDF();
      });
    }

    if (compareStrengthsBtn) {
      compareStrengthsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarAnalisisFortalezas();
      });
    }
    
    // Inicializar la carga del estado
    loadSelectedFromLocalStorage();
    render();
  }

  function handleAddCareerById(id) {
    id = Number(id);
    if (existsInSelected(id)) return;
    if (canAddMore()) {
      selectedCareerIds.push(id);
      showCatalog = false;
      saveSelectedToLocalStorage();
      render();
    }
  }

  function handleRemoveCareerById(id) {
    id = Number(id);
    selectedCareerIds = selectedCareerIds.filter(cId => cId !== id);
    saveSelectedToLocalStorage();
    // Ocultar el análisis si la lista cae a menos de 2
    if (selectedCareerIds.length < 2) {
      if (strengthsAnalysis) strengthsAnalysis.style.display = 'none';
    }
    render();
  }

  /* ---------- Renderizado de Componentes ---------- */

  // Función para exportar la comparación a PDF
  async function exportarComparacionPDF() {
    // Carga dinámica de jsPDF (ya cargado en HTML, pero se mantiene para robustez)
    if (typeof window.jspdf === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // Horizontal (landscape)
    
    const selectedCareerData = selectedCareerIds
      .map(id => careerCatalog.find(c => c.id === id))
      .filter(c => c);

    if (selectedCareerData.length === 0) return;

    let y = 20;
    doc.setFontSize(22);
    doc.setTextColor('#693EFE');
    doc.setFont('helvetica', 'bold');
    doc.text('Comparación de Carreras Vocatio', 15, y);
    y += 10;
    
    doc.setFontSize(14);
    doc.setTextColor('#45444C');
    doc.setFont('helvetica', 'normal');
    doc.text('Fecha de Exportación: ' + new Date().toLocaleDateString(), 15, y);
    y += 10;
    
    const head = [['Características'].concat(selectedCareerData.map(c => c.name))];
    
    const body = [
      { label: 'Duración', key: 'duration' },
      { label: 'Área', key: 'area' },
      { label: 'Modalidad', key: 'modality' },
      { label: 'Salida Laboral', key: 'jobDemand' },
      { label: 'Nivel de Dificultad', key: 'difficulty' },
      { label: 'Inversión Promedio', key: 'investment' }
    ].map(row => [
      row.label,
      ...selectedCareerData.map(c => c[row.key] || '-')
    ]);

    doc.autoTable({
      startY: y,
      head: head,
      body: body,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [248, 248, 255], textColor: [69, 68, 76], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      margin: { left: 15, right: 15 },
    });

    doc.save('comparacion_carreras.pdf');
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
      strengthsAnalysis.innerHTML = '<p style="color:#693EFE; font-weight:600; text-align:center;">Agrega al menos dos carreras para comparar fortalezas y debilidades.</p>';
      return;
    }

    const baseCareer = selectedCareerData[0];
    
    let html = `<h3 style="color:#693EFE; font-size:24px; margin-bottom:16px; text-align:center;">Análisis comparativo de Fortalezas y Debilidades</h3>`;
    html += `<p style="font-size:16px; color:#45444C; text-align:center; margin-bottom:20px;">Se compara cada carrera respecto a <span style='font-weight:700;'>${baseCareer.name}</span>:</p>`;

    const analysisRows = selectedCareerData.slice(1).map(career => {
      let analysisText = `Análisis de ${career.name} vs ${baseCareer.name}:`;
      let differences = [];

      // Lógica de comparación simple (puede ser extendida)
      if (career.difficulty !== baseCareer.difficulty) {
        differences.push(`Dificultad: ${career.difficulty} vs ${baseCareer.difficulty}.`);
      }
      if (career.jobDemand !== baseCareer.jobDemand) {
        differences.push(`Salida Laboral: ${career.jobDemand} vs ${baseCareer.jobDemand}.`);
      }
      if (career.duration !== baseCareer.duration) {
        differences.push(`Duración: ${career.duration} vs ${baseCareer.duration}.`);
      }
      if (career.investment !== baseCareer.investment) {
        differences.push(`Inversión Promedio: ${career.investment} vs ${baseCareer.investment}.`);
      }

      if (differences.length === 0) {
        analysisText = `${career.name} es muy similar a ${baseCareer.name}.`;
      } else {
        analysisText = `
          <h4 style="font-size:18px; color:#45444C; margin-bottom:8px; border-bottom:1px solid #D9D4FF; padding-bottom:5px;">
            <span style="color:#693EFE; font-weight:700;">${career.name}</span> vs ${baseCareer.name}
          </h4>
          <ul style="list-style-type:none; padding:0; margin:0;">
            ${differences.map(d => `<li style="margin-bottom:4px; font-size:15px;">- ${d}</li>`).join('')}
          </ul>
        `;
      }
      return analysisText;
    }).join('<div style="margin:10px 0;"></div>');


    html += `<div style="padding:20px; border:1px solid #D9D4FF; border-radius:10px; background:#f8f8ff;">${analysisRows}</div>`;
    strengthsAnalysis.style.display = 'block';
    strengthsAnalysis.innerHTML = html;
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
          <p style="text-align:center; color:#693EFE; font-weight:600;">Todas las carreras del catálogo ya están seleccionadas.</p>
        </div>
      `;
      return;
    }
    
    catalogContainer.style.display = 'block';

    const box = document.createElement('div');
    box.className = 'catalog-box';
    
    const h3 = document.createElement('h3');
    h3.textContent = 'Selecciona una carrera para añadir a la comparación';
    h3.style.cssText = 'color:#45444C; font-size:20px; margin-bottom:15px; text-align:center;';
    box.appendChild(h3);
    
    const gridWrap = document.createElement('div');
    gridWrap.className = 'catalog-grid';

    available.forEach(career => {
      const card = document.createElement('div');
      card.className = 'career-card';
      const h4 = document.createElement('h4');
      h4.textContent = career.name;
      h4.className = 'career-card__title';
      card.appendChild(h4);
      const p = document.createElement('p');
      p.textContent = `${career.area} • ${career.duration}`;
      p.className = 'career-card__meta';
      card.appendChild(p);

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        handleAddCareerById(career.id);
      });
      gridWrap.appendChild(card);
    });

    box.appendChild(gridWrap);
    catalogContainer.appendChild(box);
  }


  // Renderiza la tabla de comparación
  function renderComparisonGrid() {
    if (!grid) return;
    grid.innerHTML = ''; 

    if (selectedCareerIds.length === 0) {
      grid.innerHTML = `
        <div style="padding:40px; text-align:center; color:#67666F; font-size:16px;">
          <p>Selecciona al menos una carrera para comenzar la comparación.</p>
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
      removeBtn.textContent = 'Quitar Comparación';
      removeBtn.className = 'remove-btn';
      removeBtn.addEventListener('click', () => handleRemoveCareerById(career.id));
      h.appendChild(removeBtn);

      grid.appendChild(h);
    });

    // 3. Data rows
    const rows = [
      { label: 'Duración', key: 'duration' },
      { label: 'Área', key: 'area' },
      { label: 'Modalidad', key: 'modality' },
      { label: 'Salida Laboral', key: 'jobDemand' },
      { label: 'Nivel de Dificultad', key: 'difficulty' },
      { label: 'Inversión Promedio', key: 'investment' }
    ];

    rows.forEach((row, rowIndex) => {
      // a) Columna de Etiqueta
      const label = document.createElement('div');
      label.className = 'grid-feature-label';
      label.textContent = row.label;
      grid.appendChild(label);

      // b) Columnas de Datos
      selectedCareerIds.forEach((id) => {
        const career = careerCatalog.find(c => c.id === id) || {};
        const cell = document.createElement('div');
        cell.className = 'grid-data-cell';
        const value = career[row.key] || 'N/A';
        cell.textContent = value;
        grid.appendChild(cell);
      });
    });

    // Re-configurar la cuadrícula CSS para el número de carreras actual (ajuste dinámico del grid-template-columns)
    // Esto asegura que la cuadrícula se adapte si se añaden/quitan carreras (hasta el límite de 4).
    const numColumns = selectedCareerIds.length + 1; // 1 columna de etiqueta + N columnas de carrera
    grid.style.gridTemplateColumns = `1.2fr repeat(${selectedCareerIds.length}, 1fr)`;
    
    // (Opcional) Limpiar el borde derecho de la última columna dinámicamente:
    const allCells = grid.querySelectorAll('div');
    allCells.forEach((cell, index) => {
      // Si es el último elemento de una fila (índice 0, 4, 8, 12, etc.)
      if ((index + 1) % numColumns === 0) {
        cell.style.borderRight = 'none';
      } else {
        cell.style.borderRight = '1px solid var(--color-border)';
      }
    });
  }

  function render() {
    renderComparisonGrid();
    renderCatalog();
  }

  // Inicializar todo
  bind();
})();