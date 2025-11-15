let currentStep = 1;
let selectedArea = "";
let selectedFormation = "";

const careersData = {
  tecnologia: {
    universitaria: [
      {
        name: "Ingeniería de Sistemas",
        description: "Diseña y desarrolla sistemas de software y tecnología",
        duration: "5 años",
        modality: "Presencial/Virtual",
        rating: "Excelente",
        link: "details.html?career=sistemas",
      },
    ],
    tecnica: [
      {
        name: "Técnico en Programación",
        description: "Aprende a programar aplicaciones y software básico",
        duration: "2 años",
        modality: "Presencial",
        rating: "Muy Bueno",
        link: "details.html?career=programacion",
      },
    ],
  },
  salud: {
    universitaria: [
      {
        name: "Medicina",
        description: "Formación completa para profesionales de la salud",
        duration: "6 años",
        modality: "Presencial",
        rating: "Excelente",
        link: "details.html?career=medicina",
      },
    ],
    tecnica: [],
  },
  negocios: {
    universitaria: [
      {
        name: "Administración de Empresas",
        description: "Lidera organizaciones hacia el éxito",
        duration: "4 años",
        modality: "Presencial/Online",
        rating: "Excelente",
        link: "details.html?career=admin",
      },
    ],
    tecnica: [],
  },
  ingenieria: {
    universitaria: [
      {
        name: "Ingeniería Civil",
        description: "Diseña y construye infraestructuras",
        duration: "5 años",
        modality: "Presencial",
        rating: "Excelente",
        link: "details.html?career=civil",
      },
    ],
    tecnica: [],
  },
  arte: {
    universitaria: [
      {
        name: "Diseño Gráfico",
        description: "Crea experiencias visuales impactantes",
        duration: "4 años",
        modality: "Presencial",
        rating: "Muy Bueno",
        link: "details.html?career=diseño",
      },
    ],
    tecnica: [],
  },
  ciencias: {
    universitaria: [
      {
        name: "Biología",
        description: "Investiga la vida y organismos vivientes",
        duration: "4 años",
        modality: "Presencial",
        rating: "Excelente",
        link: "details.html?career=biologia",
      },
    ],
    tecnica: [],
  },
};

// NOTIFICACIÓN DE ÉXITO
function showSuccessMessage(message) {
  const existingMessage = document.querySelector('.success-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #10b981;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-weight: 500;
    animation: slideDown 0.3s ease;
  `;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => successDiv.remove(), 300);
  }, 3000);
}

// CREAR BARRA DE BÚSQUEDA
function createSearchBar() {
  const stepContent = document.querySelector('#step-3 .step-content');
  const careersTitle = stepContent.querySelector('.careers-title');
  
  if (document.getElementById('search-bar-container')) {
    return;
  }
  
  const searchContainer = document.createElement('div');
  searchContainer.id = 'search-bar-container';
  searchContainer.style.cssText = `
    margin: 2rem auto;
    max-width: 600px;
    padding: 0 1rem;
  `;
  
  const searchForm = document.createElement('form');
  searchForm.id = 'search-form';
  searchForm.style.cssText = `
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  `;
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'search-input';
  searchInput.placeholder = 'Buscar carreras...';
  searchInput.style.cssText = `
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--gray-light);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    background-color: white;
    color: var(--dark);
  `;
  
  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.textContent = 'Buscar';
  searchButton.className = 'btn btn-primary';
  searchButton.style.cssText = `
    width: 100%;
    padding: 0.75rem 1rem;
    white-space: nowrap;
    border-radius: 8px;
  `;
  
  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchButton);
  searchContainer.appendChild(searchForm);
  
  careersTitle.parentNode.insertBefore(searchContainer, careersTitle.nextSibling);
  
  searchInput.addEventListener('keyup', function(e) {
    filterCareers(e.target.value);
  });
  
  searchInput.addEventListener('blur', function(e) {
    if (e.target.value.trim() === '') {
      loadCareers();
    }
  });
  
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    filterCareers(searchInput.value);
  });
}

// FILTRAR CARRERAS
function filterCareers(searchTerm) {
  const careers = careersData[selectedArea][selectedFormation] || [];
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  if (normalizedSearch === '') {
    loadCareers();
    return;
  }
  
  const filteredCareers = careers.filter(career => 
    career.name.toLowerCase().includes(normalizedSearch) ||
    career.description.toLowerCase().includes(normalizedSearch)
  );
  
  renderCareers(filteredCareers);
  
  document.getElementById('careers-count').textContent = 
    `${filteredCareers.length} ${filteredCareers.length === 1 ? 'carrera encontrada' : 'carreras encontradas'}`;
}

// RENDERIZAR CARRERAS
function renderCareers(careers) {
  const careersList = document.getElementById('careers-list');
  
  if (careers.length === 0) {
    careersList.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--gray);">
        <h3>No se encontraron carreras</h3>
        <p>Intenta con otro término de búsqueda</p>
      </div>
    `;
    return;
  }
  
  careersList.innerHTML = careers.map(career => `
    <article class="career-item">
      <div class="career-header">
        <h3>${career.name}</h3>
        <button class="favorite-btn" 
                onclick="toggleFavorite(event, '${career.name}', '${selectedArea}', '${selectedFormation}')" 
                title="Añadir a favoritos">♡</button>
      </div>
      <p>${career.description}</p>
      <div class="career-meta">
        <span>⏱ ${career.duration}</span>
        <span>📍 ${career.modality}</span>
        <span>⭐ ${career.rating}</span>
      </div>
      <a href="${career.link}" class="btn btn-primary">Ver Detalles</a>
    </article>
  `).join('');
  
  updateFavoriteButtons();
}

function goToStep(step) {
  document.querySelectorAll(".carousel-step").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".progress-step").forEach((el) => el.classList.remove("active"));

  document.getElementById("step-" + step).classList.add("active");
  document.getElementById("progress-step-" + step).classList.add("active");

  currentStep = step;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function previousStep() {
  if (currentStep > 1) {
    goToStep(currentStep - 1);
  }
}

function loadCareers() {
  const careers = careersData[selectedArea][selectedFormation] || [];
  const areaName = selectedArea.charAt(0).toUpperCase() + selectedArea.slice(1);
  const formationType = selectedFormation === "universitaria" ? "Formación Universitaria" : "Formación Técnica";

  document.getElementById("selected-area").textContent = areaName;
  document.getElementById("formation-type").textContent = formationType;
  document.getElementById("careers-count").textContent = careers.length + " carreras disponibles";

  renderCareers(careers);
  createSearchBar();
}

function toggleFavorite(event, careerName, area, formation) {
  event.preventDefault();
  event.stopPropagation();

  const button = event.currentTarget;
  let favorites = JSON.parse(localStorage.getItem("favoritesCareers") || "[]");

  const careerData = {
    name: careerName,
    area: area,
    formation: formation,
    timestamp: new Date().toISOString(),
  };

  const existingIndex = favorites.findIndex((fav) => fav.name === careerName);

  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    button.textContent = "♡";
    button.style.color = "var(--gray)";
    showSuccessMessage(`"${careerName}" eliminada de favoritos`);
  } else {
    favorites.push(careerData);
    button.textContent = "♥";
    button.style.color = "var(--error)";
    showSuccessMessage(`"${careerName}" agregada a favoritos`);
  }

  localStorage.setItem("favoritesCareers", JSON.stringify(favorites));
  updateFavoritesCount();
}

function updateFavoriteButtons() {
  const favorites = JSON.parse(localStorage.getItem("favoritesCareers") || "[]");
  const favoriteNames = favorites.map((fav) => fav.name);

  document.querySelectorAll(".favorite-btn").forEach((button) => {
    const careerName = button.closest(".career-item").querySelector("h3").textContent;
    if (favoriteNames.includes(careerName)) {
      button.textContent = "♥";
      button.style.color = "var(--error)";
    } else {
      button.textContent = "♡";
      button.style.color = "var(--gray)";
    }
  });
}

function updateFavoritesCount() {
  const favorites = JSON.parse(localStorage.getItem("favoritesCareers") || "[]");
  const placeholder = document.querySelector(".favorites-placeholder");
  
  if (!placeholder) return;
  
  if (favorites.length > 0) {
    placeholder.textContent = `Mis favoritas (${favorites.length})`;
    placeholder.style.color = "var(--primary)";
    placeholder.style.cursor = "pointer";
    placeholder.onclick = () => {
      window.location.href = "../dashboard/my-favorites.html";
    };
  } else {
    placeholder.textContent = "Mis favoritas";
    placeholder.style.color = "var(--gray-light)";
    placeholder.style.cursor = "default";
    placeholder.onclick = null;
  }
}

// ESTILOS DE ANIMACIÓN dgsdgjflfjiqwf
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
  
  @media (max-width: 480px) {
    #search-bar-container {
      padding: 0 0.5rem !important;
    }
    
    #search-input {
      font-size: 0.875rem !important;
      padding: 0.625rem 0.75rem !important;
    }
    
    #search-form button {
      padding: 0.625rem 1rem !important;
      font-size: 0.875rem !important;
    }
  }
  
  @media (min-width: 481px) {
    #search-form {
      flex-direction: row !important;
      align-items: stretch !important;
    }
    
    #search-input {
      flex: 1 !important;
    }
    
    #search-form button {
      width: auto !important;
      flex-shrink: 0 !important;
    }
  }
`;
document.head.appendChild(style);

// INICIALIZAR AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', function() {
  updateFavoritesCount();
  
  document.querySelectorAll("#step-1 .carousel-card").forEach((card) => {
    card.addEventListener("click", function () {
      selectedArea = this.dataset.area;
      goToStep(2);
    });
  });

  document.querySelectorAll("#step-2 .carousel-card").forEach((card) => {
    card.addEventListener("click", function () {
      selectedFormation = this.dataset.formation;
      loadCareers();
      goToStep(3);
    });
  });
});
