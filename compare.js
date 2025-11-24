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
  const grid = document.getElementById('comparison-grid');

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
      downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
      });
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
