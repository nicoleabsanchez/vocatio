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
        window.location.href = 'pages/careers/explore.html';
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
  // Exporta la tabla y el análisis a PDF usando jsPDF y html2canvas
  async function exportarComparacionPDF() {
    // Cargar jsPDF y html2canvas si no están presentes
    if (typeof window.jspdf === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    }
    if (typeof window.html2canvas === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    // Captura la tabla de comparación
    const gridElem = document.getElementById('comparison-grid');
    const analysisElem = document.getElementById('strengths-analysis');
    let y = 40;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Comparación de Carreras', 40, y);
    y += 20;

    if (gridElem) {
      const gridCanvas = await window.html2canvas(gridElem, { backgroundColor: '#fff', scale: 2 });
      const gridImg = gridCanvas.toDataURL('image/png');
      doc.addImage(gridImg, 'PNG', 40, y, 750, 180, undefined, 'FAST');
      y += 200;
    }

    if (analysisElem && analysisElem.style.display !== 'none') {
      doc.setFontSize(18);
      doc.text('Fortalezas y Debilidades', 40, y);
      y += 16;
      const analysisCanvas = await window.html2canvas(analysisElem, { backgroundColor: '#fff', scale: 2 });
      const analysisImg = analysisCanvas.toDataURL('image/png');
      doc.addImage(analysisImg, 'PNG', 40, y, 750, 180, undefined, 'FAST');
      y += 200;
    }

    doc.save('comparacion-carreras.pdf');
  }

  // Utilidad para cargar scripts externos
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

    if (compareStrengthsBtn) {
      compareStrengthsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarAnalisisFortalezas();
      });
    }
  // Analiza fortalezas y debilidades de cada carrera vs la primera seleccionada
  function mostrarAnalisisFortalezas() {
    if (!strengthsAnalysis) return;
    strengthsAnalysis.innerHTML = '';
    if (selectedCareerIds.length < 2) {
      strengthsAnalysis.style.display = 'block';
      strengthsAnalysis.innerHTML = '<p style="color:#693EFE; font-weight:600;">Agrega al menos dos carreras para comparar fortalezas y debilidades.</p>';
      return;
    }
    const baseId = selectedCareerIds[0];
    const baseCareer = careerCatalog.find(c => c.id === baseId);
    if (!baseCareer) return;
    const rows = [
      { label: 'Duración', key: 'duration' },
      { label: 'Área', key: 'area' },
      { label: 'Modalidad', key: 'modality' },
      { label: 'Salida Laboral', key: 'jobDemand' },
      { label: 'Nivel de Dificultad', key: 'difficulty' },
      { label: 'Inversión Promedio', key: 'investment' }
    ];
    let html = `<h3 style="color:#693EFE; font-size:24px; margin-bottom:16px;">Fortalezas y Debilidades respecto a <span style='font-weight:700;'>${baseCareer.name}</span></h3>`;
    html += '<div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse;">';
    html += '<tr><th style="text-align:left; padding:8px 12px;">Carrera</th>';
    rows.forEach(row => { html += `<th style='padding:8px 12px;'>${row.label}</th>`; });
    html += '</tr>';
    selectedCareerIds.slice(1).forEach(id => {
      const c = careerCatalog.find(ca => ca.id === id);
      if (!c) return;
      html += `<tr><td style='font-weight:600; color:#45444C; padding:8px 12px;'>${c.name}</td>`;
      rows.forEach(row => {
        const baseVal = baseCareer[row.key] || '';
        const val = c[row.key] || '';
        let cell = val;
        if (val === baseVal) {
          cell = `<span style='color:#888;'>Igual</span>`;
        } else if (row.key === 'jobDemand' || row.key === 'difficulty') {
          // Resalta si es mejor o peor (simplificado)
          if (row.key === 'jobDemand') {
            cell = val.includes('Alta') && !baseVal.includes('Alta') ? `<span style='color:green;'>Más demanda</span>` :
                   !val.includes('Alta') && baseVal.includes('Alta') ? `<span style='color:red;'>Menos demanda</span>` : val;
          } else if (row.key === 'difficulty') {
            cell = val.includes('Alto') && !baseVal.includes('Alto') ? `<span style='color:red;'>Más difícil</span>` :
                   !val.includes('Alto') && baseVal.includes('Alto') ? `<span style='color:green;'>Más fácil</span>` : val;
          }
        }
        html += `<td style='padding:8px 12px; text-align:center;'>${cell}</td>`;
      });
      html += '</tr>';
    });
    html += '</table></div>';
    strengthsAnalysis.innerHTML = html;
    strengthsAnalysis.style.display = 'block';
    strengthsAnalysis.scrollIntoView({ behavior: 'smooth' });
  }

    // cerrar catálogo si se hace click fuera
    document.addEventListener('click', (e) => {
      if (!catalogContainer.contains(e.target) && !(controls && controls.contains(e.target))) {
        if (showCatalog) {
          showCatalog = false;
          renderCatalog();
        }
      }
    });
  }

  /* ---------- Render functions (DOM manipulation) ---------- */
  function renderCatalog() {
    catalogContainer.innerHTML = '';
    if (!showCatalog) {
      catalogContainer.style.display = 'none';
      return;
    }
    catalogContainer.style.display = 'block';

    // Caja de catálogo con estilo similar al ejemplo (usa clases CSS)
    const box = document.createElement('div');
    box.className = 'catalog-box';

    const gridWrap = document.createElement('div');
    gridWrap.className = 'catalog-grid';

    const available = careerCatalog.filter(c => !existsInSelected(c.id));
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

    if (available.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'Todas las carreras están siendo comparadas';
      empty.className = 'catalog-empty';
      box.appendChild(empty);
    }

    box.appendChild(gridWrap);
    catalogContainer.appendChild(box);
  }

  function handleAddCareerById(id) {
    // Validaciones: duplicado y límite
    if (existsInSelected(id)) {
      alert('La carrera ya está añadida.');
      return;
    }
    if (!canAddMore()) {
      alert('No puedes comparar más de 4 carreras.');
      return;
    }
    selectedCareerIds.push(id);
    saveSelectedToLocalStorage();
    // cerrar catálogo
    showCatalog = false;
    renderCatalog();
    renderGrid();
  }

  function handleRemoveCareerById(id) {
    selectedCareerIds = selectedCareerIds.filter(i => i !== id);
    saveSelectedToLocalStorage();
    renderGrid();
  }

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = '';

    // Ajustar columnas del grid dinámicamente según la cantidad de carreras seleccionadas
    // Primera columna para la etiqueta de la característica, luego una columna por carrera
    try {
      const careerCols = selectedCareerIds.length > 0 ? selectedCareerIds.map(() => '1fr').join(' ') : '';
      const template = careerCols ? `1.6fr ${careerCols}` : '1fr';
      grid.style.gridTemplateColumns = template;
    } catch (e) {
      // no bloquear el render si algo falla
      grid.style.gridTemplateColumns = '1.6fr 1fr 1fr 1fr';
    }

    // Header empty cell
    const headerLabel = document.createElement('div');
    headerLabel.className = 'grid-header-item grid-feature-label';
    headerLabel.textContent = '';
    grid.appendChild(headerLabel);

    // Column headers (career names + remove button)
    selectedCareerIds.forEach((id) => {
      const career = careerCatalog.find(c => c.id === id) || { name: 'Desconocida' };
      const h = document.createElement('div');
      h.className = 'grid-header grid-header-item';

      const title = document.createElement('h4');
      title.textContent = career.name;
      title.className = 'grid-title';
      h.appendChild(title);

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Quitar Comparación';
      removeBtn.className = 'remove-btn';
      removeBtn.addEventListener('click', () => handleRemoveCareerById(id));
      h.appendChild(removeBtn);

      grid.appendChild(h);
    });

    // Data rows
    const rows = [
      { label: 'Duración', key: 'duration' },
      { label: 'Área', key: 'area' },
      { label: 'Modalidad', key: 'modality' },
      { label: 'Salida Laboral', key: 'jobDemand' },
      { label: 'Nivel de Dificultad', key: 'difficulty' },
      { label: 'Inversión Promedio', key: 'investment' }
    ];

    rows.forEach((row, rowIndex) => {
      // label
      const label = document.createElement('div');
      label.className = 'grid-feature-label';
      label.textContent = row.label;
      grid.appendChild(label);

      // values
      selectedCareerIds.forEach((id) => {
        const career = careerCatalog.find(c => c.id === id) || {};
        const cell = document.createElement('div');
        cell.className = 'grid-data-cell';
        const value = career[row.key] || '';
        cell.textContent = value;
        grid.appendChild(cell);
      });
    });
  }

  /* ---------- Inicialización ---------- */
  function init() {
    loadSelectedFromLocalStorage();
    bind();
    renderCatalog(); // initial hidden
    renderGrid();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
