// ============================================
// BASE DE DATOS DE MATERIALES (26 recursos)
// ============================================

const materialsDatabase = [
  // Materiales originales (6)
  {
    id: 1,
    title: '¿Qué es la administración?',
    description: 'Aprende los conceptos básicos de la administración en este video introductorio.',
    type: 'video',
    image: '../../assets/images/admin-concept.jpg',
    level: 'principiante',
    duration: 'medio',
    platform: 'youtube',
    price: 'gratis',
    language: 'es',
    rating: 4.5,
    ratingCount: 234,
    tags: ['Administración', 'Negocios', 'Fundamentos'],
    url: 'https://www.youtube.com/watch?v=example1',
    saved: false,
    completed: false
  },
  {
    id: 2,
    title: 'Gestión de proyectos',
    description: 'En este programa aprenderás gestión de proyectos y herramientas como Google Workspace.',
    type: 'lectura',
    image: '../../assets/images/project-management.png',
    level: 'intermedio',
    duration: 'largo',
    platform: 'coursera',
    price: 'pago',
    language: 'es',
    rating: 4.7,
    ratingCount: 512,
    tags: ['Gestión', 'Proyectos', 'Google Workspace'],
    url: 'https://www.coursera.org/learn/project-management',
    saved: true,
    completed: false
  },
  {
    id: 3,
    title: 'Tecnologías clave',
    description: 'Descubre las tecnologías empresariales clave que necesitas conocer.',
    type: 'video',
    image: '../../assets/images/key-technologies.jpg',
    level: 'intermedio',
    duration: 'medio',
    platform: 'youtube',
    price: 'gratis',
    language: 'en',
    rating: 4.3,
    ratingCount: 189,
    tags: ['Tecnología', 'Empresarial', 'Innovación'],
    url: 'https://www.youtube.com/watch?v=example3',
    saved: false,
    completed: true
  },
  {
    id: 4,
    title: 'Análisis de Datos',
    description: 'Aprende a analizar datos y tomar decisiones basadas en información.',
    type: 'lectura',
    image: '../../assets/images/data-analysis.jpg',
    level: 'intermedio',
    duration: 'largo',
    platform: 'udemy',
    price: 'pago',
    language: 'es',
    rating: 4.8,
    ratingCount: 876,
    tags: ['Datos', 'Análisis', 'Business Intelligence'],
    url: 'https://www.udemy.com/course/data-analysis',
    saved: true,
    completed: false
  },
  {
    id: 5,
    title: 'Arquitectura de Software',
    description: 'Guía completa sobre patrones y principios de arquitectura de software.',
    type: 'enlace',
    image: '../../assets/images/software-architecture.jpg',
    level: 'avanzado',
    duration: 'curso',
    platform: 'linkedin',
    price: 'pago',
    language: 'en',
    rating: 4.9,
    ratingCount: 1234,
    tags: ['Arquitectura', 'Software', 'Design Patterns'],
    url: 'https://www.linkedin.com/learning/software-architecture',
    saved: false,
    completed: false
  },
  {
    id: 6,
    title: 'Desarrollo Profesional',
    description: 'Consejos para desarrollar tu carrera profesional en tecnología.',
    type: 'video',
    image: '../../assets/images/diverse-students.jpg',
    level: 'principiante',
    duration: 'corto',
    platform: 'youtube',
    price: 'gratis',
    language: 'es',
    rating: 4.4,
    ratingCount: 345,
    tags: ['Carrera', 'Desarrollo', 'Tecnología'],
    url: 'https://www.youtube.com/watch?v=example6',
    saved: true,
    completed: true
  },

  // Nuevos materiales (20)
  {
    id: 7,
    title: 'Python desde Cero',
    description: 'Curso completo de Python para principiantes con ejercicios prácticos.',
    type: 'curso',
    image: '../../assets/images/python-programming.png',
    level: 'principiante',
    duration: 'curso',
    platform: 'coursera',
    price: 'gratis',
    language: 'es',
    rating: 4.8,
    ratingCount: 2341,
    tags: ['Python', 'Programación', 'Principiante'],
    url: 'https://www.coursera.org/learn/python',
    saved: true,
    completed: false
  },
  {
    id: 8,
    title: 'JavaScript Moderno',
    description: 'Aprende JavaScript ES6+ con proyectos reales y buenas prácticas.',
    type: 'video',
    image: '../../assets/images/javascript-fundamental.png',
    level: 'intermedio',
    duration: 'largo',
    platform: 'youtube',
    price: 'gratis',
    language: 'es',
    rating: 4.6,
    ratingCount: 1876,
    tags: ['JavaScript', 'ES6', 'Web Development'],
    url: 'https://www.youtube.com/watch?v=javascript-modern',
    saved: false,
    completed: false
  },
  {
    id: 9,
    title: 'Diseño de Bases de Datos',
    description: 'Modelado, normalización y optimización de bases de datos relacionales.',
    type: 'lectura',
    image: '../../assets/images/database-design.png',
    level: 'intermedio',
    duration: 'medio',
    platform: 'otro',
    price: 'gratis',
    language: 'es',
    rating: 4.7,
    ratingCount: 654,
    tags: ['Bases de datos', 'SQL', 'Modelado'],
    url: 'https://www.database-design.com',
    saved: false,
    completed: true
  },
  {
    id: 10,
    title: 'AWS Cloud Computing',
    description: 'Introducción a Amazon Web Services y arquitectura en la nube.',
    type: 'curso',
    image: '../../assets/images/cloud-computing-aws.png',
    level: 'intermedio',
    duration: 'curso',
    platform: 'coursera',
    price: 'pago',
    language: 'en',
    rating: 4.9,
    ratingCount: 3421,
    tags: ['AWS', 'Cloud', 'DevOps'],
    url: 'https://www.coursera.org/learn/aws',
    saved: true,
    completed: false
  },
  {
    id: 11,
    title: 'Machine Learning Básico',
    description: 'Fundamentos de aprendizaje automático con Python y scikit-learn.',
    type: 'video',
    image: '../../assets/images/machine-learning-intro.png',
    level: 'intermedio',
    duration: 'largo',
    platform: 'youtube',
    price: 'gratis',
    language: 'en',
    rating: 4.8,
    ratingCount: 2987,
    tags: ['Machine Learning', 'IA', 'Python'],
    url: 'https://www.youtube.com/watch?v=ml-intro',
    saved: false,
    completed: false
  },
  {
    id: 12,
    title: 'Desarrollo Web Full Stack',
    description: 'Crea aplicaciones web completas con React, Node.js y MongoDB.',
    type: 'curso',
    image: '../../assets/images/web-development.png',
    level: 'avanzado',
    duration: 'curso',
    platform: 'udemy',
    price: 'pago',
    language: 'es',
    rating: 4.7,
    ratingCount: 4521,
    tags: ['React', 'Node.js', 'Full Stack'],
    url: 'https://www.udemy.com/course/fullstack',
    saved: true,
    completed: false
  },
  {
    id: 13,
    title: 'Git y GitHub Completo',
    description: 'Domina el control de versiones y colaboración con Git y GitHub.',
    type: 'video',
    image: '../../assets/images/git-github.png',
    level: 'principiante',
    duration: 'medio',
    platform: 'youtube',
    price: 'gratis',
    language: 'es',
    rating: 4.5,
    ratingCount: 1234,
    tags: ['Git', 'GitHub', 'Control de versiones'],
    url: 'https://www.youtube.com/watch?v=git-course',
    saved: false,
    completed: true
  },
  {
    id: 14,
    title: 'Docker y Contenedores',
    description: 'Aprende a crear, gestionar y desplegar aplicaciones con Docker.',
    type: 'lectura',
    image: '../../assets/images/docker-containers.png',
    level: 'intermedio',
    duration: 'largo',
    platform: 'otro',
    price: 'gratis',
    language: 'en',
    rating: 4.6,
    ratingCount: 987,
    tags: ['Docker', 'Containers', 'DevOps'],
    url: 'https://www.docker-guide.com',
    saved: false,
    completed: false
  },
  {
    id: 15,
    title: 'APIs REST con Node.js',
    description: 'Diseño e implementación de APIs RESTful profesionales.',
    type: 'curso',
    image: '../../assets/images/api-rest-design.png',
    level: 'intermedio',
    duration: 'medio',
    platform: 'udemy',
    price: 'pago',
    language: 'es',
    rating: 4.7,
    ratingCount: 1567,
    tags: ['API', 'REST', 'Node.js'],
    url: 'https://www.udemy.com/course/rest-api',
    saved: false,
    completed: false
  },
  {
    id: 16,
    title: 'Metodologías Ágiles',
    description: 'Scrum, Kanban y otras metodologías para gestión ágil de proyectos.',
    type: 'video',
    image: '../../assets/images/agile-scrum.png',
    level: 'principiante',
    duration: 'corto',
    platform: 'linkedin',
    price: 'pago',
    language: 'es',
    rating: 4.4,
    ratingCount: 876,
    tags: ['Agile', 'Scrum', 'Kanban'],
    url: 'https://www.linkedin.com/learning/agile',
    saved: false,
    completed: true
  },
  {
    id: 17,
    title: 'Ciberseguridad Esencial',
    description: 'Conceptos fundamentales de seguridad informática y protección de datos.',
    type: 'lectura',
    image: '../../assets/images/cybersecurity-basics.png',
    level: 'principiante',
    duration: 'medio',
    platform: 'coursera',
    price: 'gratis',
    language: 'en',
    rating: 4.8,
    ratingCount: 2134,
    tags: ['Ciberseguridad', 'Seguridad', 'Protección'],
    url: 'https://www.coursera.org/learn/cybersecurity',
    saved: false,
    completed: false
  },
  {
    id: 18,
    title: 'Desarrollo Móvil con Flutter',
    description: 'Crea apps móviles nativas para iOS y Android con un solo código.',
    type: 'curso',
    image: '../../assets/images/mobile-development.png',
    level: 'intermedio',
    duration: 'curso',
    platform: 'udemy',
    price: 'pago',
    language: 'es',
    rating: 4.6,
    ratingCount: 1987,
    tags: ['Flutter', 'Mobile', 'iOS', 'Android'],
    url: 'https://www.udemy.com/course/flutter',
    saved: false,
    completed: false
  },
  {
    id: 19,
    title: 'Testing y Automatización',
    description: 'Pruebas unitarias, integración y end-to-end para aplicaciones web.',
    type: 'video',
    image: '../../assets/images/testing-automation.png',
    level: 'avanzado',
    duration: 'largo',
    platform: 'youtube',
    price: 'gratis',
    language: 'en',
    rating: 4.5,
    ratingCount: 765,
    tags: ['Testing', 'QA', 'Automation'],
    url: 'https://www.youtube.com/watch?v=testing',
    saved: false,
    completed: false
  },
  {
    id: 20,
    title: 'Diseño UI/UX Profesional',
    description: 'Principios de diseño de interfaces y experiencia de usuario.',
    type: 'curso',
    image: '../../assets/images/ui-ux-design.png',
    level: 'principiante',
    duration: 'medio',
    platform: 'coursera',
    price: 'pago',
    language: 'es',
    rating: 4.9,
    ratingCount: 3456,
    tags: ['UI', 'UX', 'Diseño'],
    url: 'https://www.coursera.org/learn/ui-ux',
    saved: true,
    completed: true
  },
  {
    id: 21,
    title: 'DevOps y CI/CD',
    description: 'Integración y despliegue continuo para equipos de desarrollo.',
    type: 'lectura',
    image: '../../assets/images/devops-practices.png',
    level: 'avanzado',
    duration: 'largo',
    platform: 'otro',
    price: 'gratis',
    language: 'en',
    rating: 4.7,
    ratingCount: 1432,
    tags: ['DevOps', 'CI/CD', 'Automation'],
    url: 'https://www.devops-guide.com',
    saved: false,
    completed: false
  },
  {
    id: 22,
    title: 'Blockchain para Desarrolladores',
    description: 'Fundamentos de blockchain y desarrollo de smart contracts.',
    type: 'video',
    image: '../../assets/images/blockchain-basics.png',
    level: 'avanzado',
    duration: 'curso',
    platform: 'udemy',
    price: 'pago',
    language: 'en',
    rating: 4.4,
    ratingCount: 567,
    tags: ['Blockchain', 'Crypto', 'Smart Contracts'],
    url: 'https://www.udemy.com/course/blockchain',
    saved: false,
    completed: false
  },
  {
    id: 23,
    title: 'Visualización de Datos',
    description: 'Crea gráficos e infografías impactantes con D3.js y Python.',
    type: 'curso',
    image: '../../assets/images/data-visualization.png',
    level: 'intermedio',
    duration: 'medio',
    platform: 'coursera',
    price: 'gratis',
    language: 'es',
    rating: 4.8,
    ratingCount: 2109,
    tags: ['Visualización', 'D3.js', 'Python'],
    url: 'https://www.coursera.org/learn/data-viz',
    saved: false,
    completed: false
  },
  {
    id: 24,
    title: 'Algoritmos y Estructuras de Datos',
    description: 'Domina algoritmos fundamentales y estructuras de datos complejas.',
    type: 'video',
    image: '../../assets/images/algorithms-datastructures.png',
    level: 'intermedio',
    duration: 'largo',
    platform: 'youtube',
    price: 'gratis',
    language: 'es',
    rating: 4.9,
    ratingCount: 3987,
    tags: ['Algoritmos', 'Estructuras', 'Complejidad'],
    url: 'https://www.youtube.com/watch?v=algorithms',
    saved: false,
    completed: true
  },
  {
    id: 25,
    title: 'Fundamentos de Redes',
    description: 'Protocolos TCP/IP, configuración de redes y seguridad básica.',
    type: 'lectura',
    image: '../../assets/images/networking-fundamentals.png',
    level: 'principiante',
    duration: 'medio',
    platform: 'linkedin',
    price: 'pago',
    language: 'en',
    rating: 4.6,
    ratingCount: 1234,
    tags: ['Redes', 'TCP/IP', 'Networking'],
    url: 'https://www.linkedin.com/learning/networking',
    saved: false,
    completed: false
  },
  {
    id: 26,
    title: 'Administración de Linux',
    description: 'Comandos esenciales y administración de servidores Linux.',
    type: 'curso',
    image: '../../assets/images/linux-system-admin.png',
    level: 'intermedio',
    duration: 'curso',
    platform: 'udemy',
    price: 'pago',
    language: 'es',
    rating: 4.7,
    ratingCount: 1765,
    tags: ['Linux', 'Servidores', 'DevOps'],
    url: 'https://www.udemy.com/course/linux-admin',
    saved: false,
    completed: false
  }
];

// ============================================
// ESTADO GLOBAL
// ============================================

let filteredMaterials = [...materialsDatabase];
let activeFilters = {
  type: [],
  level: [],
  duration: [],
  platform: [],
  price: [],
  language: [],
  search: ''
};
let currentSort = 'relevancia';
let currentView = 'grid';
let materialsToShow = 9;
let quickFilterActive = 'all'; // 'all', 'saved'

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeFilters();
  updateQuickFilterCounts();
  setQuickFilter('all'); // Activar "Todos" por defecto
  renderMaterials();
  updateStats();
  setupEventListeners();
});

// ============================================
// CONFIGURAR EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Toggle filtros
  document.getElementById('toggle-filters').addEventListener('click', () => {
    document.getElementById('filters-panel').classList.toggle('active');
  });

  // Filtros rápidos
  document.querySelectorAll('.quick-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.currentTarget.dataset.filter;
      setQuickFilter(filter);
    });
  });

  // Búsqueda
  let searchTimeout;
  document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      activeFilters.search = e.target.value.toLowerCase();
      applyFilters();
    }, 300);
  });

  // Checkboxes de filtros
  document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const filterType = e.target.name;
      const filterValue = e.target.value;
      
      if (e.target.checked) {
        activeFilters[filterType].push(filterValue);
      } else {
        activeFilters[filterType] = activeFilters[filterType].filter(v => v !== filterValue);
      }
      
      updateFilterChips();
      updateFilterCount();
    });
  });

  // Aplicar filtros
  document.getElementById('apply-filters').addEventListener('click', () => {
    applyFilters();
    document.getElementById('filters-panel').classList.remove('active');
  });

  // Limpiar filtros
  document.getElementById('clear-filters').addEventListener('click', () => {
    clearAllFilters();
  });

  // Ordenamiento
  document.getElementById('sort-select').addEventListener('change', (e) => {
    currentSort = e.target.value;
    sortMaterials();
    renderMaterials();
  });

  // Vista grid/list
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.currentTarget.dataset.view;
      changeView(view);
    });
  });

  // Cargar más
  document.getElementById('load-more-btn').addEventListener('click', () => {
    materialsToShow += 9;
    renderMaterials();
  });
}

// ============================================
// FUNCIONES DE FILTRADO
// ============================================

function initializeFilters() {
  activeFilters = {
    type: [],
    level: [],
    duration: [],
    platform: [],
    price: [],
    language: [],
    search: ''
  };
}

function applyFilters() {
  filteredMaterials = materialsDatabase.filter(material => {
    // Filtro rápido (guardados)
    if (quickFilterActive === 'saved' && !material.saved) return false;

    // Búsqueda por texto
    if (activeFilters.search) {
      const searchLower = activeFilters.search.toLowerCase();
      const matchSearch = 
        material.title.toLowerCase().includes(searchLower) ||
        material.description.toLowerCase().includes(searchLower) ||
        material.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchSearch) return false;
    }

    // Filtros de checkboxes
    for (const [key, values] of Object.entries(activeFilters)) {
      if (key === 'search') continue;
      if (values.length > 0 && !values.includes(material[key])) {
        return false;
      }
    }

    return true;
  });

  sortMaterials();
  materialsToShow = 9;
  renderMaterials();
  updateStats();
  
  document.getElementById('results-count').textContent = filteredMaterials.length;
}

function sortMaterials() {
  switch(currentSort) {
    case 'relevancia':
      filteredMaterials.sort((a, b) => a.id - b.id);
      break;
    case 'populares':
      filteredMaterials.sort((a, b) => b.ratingCount - a.ratingCount);
      break;
    case 'recientes':
      filteredMaterials.sort((a, b) => b.id - a.id);
      break;
    case 'valorados':
      filteredMaterials.sort((a, b) => b.rating - a.rating);
      break;
    case 'titulo':
      filteredMaterials.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
}

function clearAllFilters() {
  document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  
  document.getElementById('search-input').value = '';
  
  initializeFilters();
  updateFilterChips();
  updateFilterCount();
  
  filteredMaterials = [...materialsDatabase];
  sortMaterials();
  materialsToShow = 9;
  renderMaterials();
  updateStats();
}

// ============================================
// FILTROS RÁPIDOS
// ============================================

function setQuickFilter(filter) {
  quickFilterActive = filter;
  
  // Actualizar botones activos
  document.querySelectorAll('.quick-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  
  // Aplicar filtros
  applyFilters();
}

function updateQuickFilterCounts() {
  const savedCount = materialsDatabase.filter(m => m.saved).length;
  
  document.getElementById('saved-count').textContent = savedCount;
}

function updateFilterChips() {
  const container = document.getElementById('active-filters-chips');
  container.innerHTML = '';

  const allFilters = [];
  for (const [key, values] of Object.entries(activeFilters)) {
    if (key === 'search') continue;
    values.forEach(value => {
      allFilters.push({ type: key, value });
    });
  }

  if (allFilters.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';

  allFilters.forEach(filter => {
    const chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.innerHTML = `
      <span>${getLabelForFilter(filter.type, filter.value)}</span>
      <button onclick="removeFilter('${filter.type}', '${filter.value}')">×</button>
    `;
    container.appendChild(chip);
  });
}

function getLabelForFilter(type, value) {
  const labels = {
    type: { video: 'Video', lectura: 'Lectura', curso: 'Curso', enlace: 'Enlace' },
    level: { principiante: 'Principiante', intermedio: 'Intermedio', avanzado: 'Avanzado' },
    duration: { corto: '< 30 min', medio: '30min-1h', largo: '1h-3h', curso: 'Curso completo' },
    platform: { youtube: 'YouTube', coursera: 'Coursera', udemy: 'Udemy', linkedin: 'LinkedIn', otro: 'Otros' },
    price: { gratis: 'Gratis', pago: 'De pago' },
    language: { es: 'Español', en: 'Inglés' }
  };
  
  return labels[type]?.[value] || value;
}

function removeFilter(type, value) {
  activeFilters[type] = activeFilters[type].filter(v => v !== value);
  
  const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
  if (checkbox) checkbox.checked = false;
  
  updateFilterChips();
  updateFilterCount();
  applyFilters();
}

function updateFilterCount() {
  const totalFilters = Object.values(activeFilters)
    .filter(v => Array.isArray(v))
    .reduce((sum, arr) => sum + arr.length, 0);
  
  const badge = document.getElementById('active-filters-count');
  badge.textContent = totalFilters;
  badge.classList.toggle('active', totalFilters > 0);
}

// ============================================
// RENDERIZADO
// ============================================

function renderMaterials() {
  const grid = document.getElementById('materials-grid');
  const noResults = document.getElementById('no-results');
  const loadMoreContainer = document.getElementById('load-more-container');
  
  if (filteredMaterials.length === 0) {
    grid.innerHTML = '';
    noResults.classList.add('active');
    loadMoreContainer.style.display = 'none';
    return;
  }
  
  noResults.classList.remove('active');
  
  const materialsToRender = filteredMaterials.slice(0, materialsToShow);
  
  grid.innerHTML = materialsToRender.map(material => `
    <article class="material-card ${material.saved ? 'saved' : ''}" data-id="${material.id}">
      <div class="material-image">
        <img src="${material.image}" alt="${material.title}" />
      </div>
      <div class="material-info">
        <span class="material-type">${material.type}</span>
        <h3>${material.title}</h3>
        <p>${material.description}</p>
        
        <div class="material-meta">
          <span>📚 ${getLabelForFilter('level', material.level)}</span>
          <span>⏱️ ${getLabelForFilter('duration', material.duration)}</span>
          <span>${material.price === 'gratis' ? '💚 Gratis' : '💰 Pago'}</span>
        </div>
        
        <div class="material-tags">
          ${material.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        
        <div class="material-rating">
          <span class="stars">${'★'.repeat(Math.round(material.rating))}${'☆'.repeat(5 - Math.round(material.rating))}</span>
          <span class="rating-count">(${material.ratingCount})</span>
        </div>
        
        <div class="material-actions">
          <button class="btn btn-secondary ${material.saved ? 'saved' : ''}" onclick="toggleSave(${material.id})">
            ${material.saved ? '★ Guardado' : '☆ Guardar'}
          </button>
          <a href="${material.url}" target="_blank" class="btn btn-primary">
            Explorar recurso
          </a>
        </div>
      </div>
    </article>
  `).join('');
  
  if (materialsToShow < filteredMaterials.length) {
    loadMoreContainer.style.display = 'block';
  } else {
    loadMoreContainer.style.display = 'none';
  }
}

function toggleSave(id) {
  const material = materialsDatabase.find(m => m.id === id);
  if (material) {
    material.saved = !material.saved;
    updateQuickFilterCounts();
    applyFilters(); // Re-aplicar filtros para actualizar vista si está en "guardados"
    updateStats();
  }
}

function changeView(view) {
  currentView = view;
  
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  
  const grid = document.getElementById('materials-grid');
  grid.classList.toggle('list-view', view === 'list');
}

function updateStats() {
  const total = materialsDatabase.length;
  const saved = materialsDatabase.filter(m => m.saved).length;
  
  document.getElementById('total-materials').textContent = total;
  document.getElementById('saved-materials').textContent = saved;
}
