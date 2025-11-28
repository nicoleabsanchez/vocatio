// Variable global para guardar el botón de favorito actual
let botonFavoritoActual = null;

// Datos de carreras para poder cargar dinámicamente
const careerDatabase = {
  sistemas: {
    name: "Ingeniería de Sistemas",
    description: "Diseña y desarrolla sistemas de software y tecnología de punta",
    duration: "5 años",
    modality: "Presencial/Virtual",
    rating: "Excelente"
  },
  programacion: {
    name: "Técnico en Programación",
    description: "Aprende a programar aplicaciones y software básico",
    duration: "2 años",
    modality: "Presencial",
    rating: "Muy Bueno"
  },
  medicina: {
    name: "Medicina",
    description: "Formación completa para profesionales de la salud",
    duration: "6 años",
    modality: "Presencial",
    rating: "Excelente"
  },
  admin: {
    name: "Administración de Empresas",
    description: "Lidera organizaciones hacia el éxito",
    duration: "4 años",
    modality: "Presencial/Online",
    rating: "Excelente"
  },
  civil: {
    name: "Ingeniería Civil",
    description: "Diseña y construye infraestructuras",
    duration: "5 años",
    modality: "Presencial",
    rating: "Excelente"
  },
  diseño: {
    name: "Diseño Gráfico",
    description: "Crea experiencias visuales impactantes",
    duration: "4 años",
    modality: "Presencial",
    rating: "Muy Bueno"
  },
  biologia: {
    name: "Biología",
    description: "Investiga la vida y organismos vivientes",
    duration: "4 años",
    modality: "Presencial",
    rating: "Excelente"
  }
};

// Cargar carrera desde parámetro de URL
function loadCareerFromURL() {
  const params = new URLSearchParams(window.location.search);
  const careerCode = params.get('career');
  
  if (careerCode && careerDatabase[careerCode]) {
    const career = careerDatabase[careerCode];
    
    // Actualizar título de página
    document.title = career.name + ' - VOCATIO';
    
    // Guardar en localStorage para referencia
    localStorage.setItem('currentCareer', JSON.stringify(career));
    
    // Registrar visualización de carrera
    const userProgress = JSON.parse(localStorage.getItem('vocatioUserProgress') || '{}');
    userProgress.careersExplored = (userProgress.careersExplored || 0) + 1;
    localStorage.setItem('vocatioUserProgress', JSON.stringify(userProgress));
    
    console.log('Carrera cargada:', career);
  }
}

// Verificar si el usuario está logueado al cargar la página
function validarSesion() {
    // Verificar si existe un usuario en localStorage
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    
    // if (!usuarioLogueado) {
    //     alert('Debes iniciar sesión para ver esta página');
    //     console.log('Sesión no válida - Redirigiendo a login');
    //     window.location.href = '../../index.html';
    //     return false;
    // }
    
    console.log('Sesión válida - Usuario:', usuarioLogueado);
    return true;
}

// Ejecutar validación al cargar la página
// window.onload = function() {
//     validarSesion();
// };

function validarEnlaceUniversidad(url) {
    // Verificar si la URL es válida
    if (!url || url === '#') {
        alert('Este enlace aún no está disponible');
        console.log('URL no válida:', url);
        return false;
    }
    
    // Verificar formato de URL básico
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('El enlace no tiene un formato válido');
        console.log('Formato de URL incorrecto');
        return false;
    }
    
    console.log('URL válida - Redirigiendo a:', url);
    return true;
}

// Agregar validación a todos los botones de universidades
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrera desde URL
    loadCareerFromURL();
    
    const botonesInfo = document.querySelectorAll('.btn-info');
    
    botonesInfo.forEach(function(boton) {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            
            if (validarEnlaceUniversidad(url)) {
                window.open(url, '_blank');
            }
        });
    });
});

function mostrarModalFavorito(boton) {
    // Guardar referencia del botón
    botonFavoritoActual = boton;
    
    // Mostrar el modal
    const modal = document.getElementById('modalFavorito');
    modal.style.display = 'block';
}

function cerrarModal() {
    // Ocultar el modal
    const modal = document.getElementById('modalFavorito');
    modal.style.display = 'none';
    botonFavoritoActual = null;
}

function confirmarFavorito() {
    // Cambiar el estado del favorito
    if (botonFavoritoActual) {
        toggleFavorite(botonFavoritoActual);
    }
    
    // Cerrar el modal
    cerrarModal();
}

function toggleFavorite(button) {
    // Cambiar el estado visual
    button.classList.toggle('active');
    button.textContent = button.classList.contains('active') ? '★' : '☆';
    
    // Validar y confirmar la acción
    const esFavorito = button.classList.contains('active');
    
    if (esFavorito) {
        // Guardar en localStorage
        localStorage.setItem('carreraFavorita', 'Ingeniería de Sistemas');
        alert('✓ Carrera agregada a favoritos exitosamente');
        console.log('Favorito agregado correctamente');
    } else {
        // Remover de localStorage
        localStorage.removeItem('carreraFavorita');
        alert('Carrera removida de favoritos');
        console.log('Favorito removido correctamente');
    }
}

function calificar(puntuacion) {
    // Obtener todas las estrellas
    const estrellas = document.querySelectorAll('.star');
    const mensaje = document.getElementById('ratingMessage');
    
    // Activar estrellas según la puntuación
    estrellas.forEach(function(estrella, indice) {
        if (indice < puntuacion) {
            estrella.classList.add('active');
        } else {
            estrella.classList.remove('active');
        }
    });
    
    // Guardar calificación en localStorage
    localStorage.setItem('calificacionCarrera', puntuacion);
    
    // Mostrar mensaje de confirmación
    mensaje.textContent = 'Has calificado con ' + puntuacion + ' estrella(s)';
    mensaje.style.color = 'var(--primary)';
    
    console.log('Calificación guardada:', puntuacion, 'estrellas');
    alert('¡Gracias por tu calificación de ' + puntuacion + ' estrella(s)!');
}

function compartirFacebook() {
    // Obtener URL actual y título de la página
    const url = window.location.href;
    const titulo = 'Ingeniería de Sistemas - VOCATIO';
    
    // Crear URL de Facebook con parámetros
    const urlFacebook = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    
    // Abrir ventana emergente
    window.open(urlFacebook, 'facebook-share', 'width=600,height=400');
    console.log('Compartiendo en Facebook:', url);
}

function compartirTwitter() {
    // Obtener URL y crear mensaje
    const url = window.location.href;
    const texto = 'Descubre Ingeniería de Sistemas en VOCATIO';
    
    // Crear URL de Twitter
    const urlTwitter = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(texto) + '&url=' + encodeURIComponent(url);
    
    // Abrir ventana emergente
    window.open(urlTwitter, 'twitter-share', 'width=600,height=400');
    console.log('Compartiendo en Twitter:', texto);
}

function compartirWhatsApp() {
    // Obtener URL y crear mensaje
    const url = window.location.href;
    const mensaje = 'Mira esta carrera en VOCATIO: Ingeniería de Sistemas ' + url;
    
    // Crear URL de WhatsApp
    const urlWhatsApp = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(mensaje);
    
    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank');
    console.log('Compartiendo en WhatsApp:', mensaje);
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modalFavorito');
    if (event.target === modal) {
        cerrarModal();
    }
};
