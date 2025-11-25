// mi-progreso.js
// Validaciones, eventos y manejo del DOM para Mi Progreso

document.addEventListener('DOMContentLoaded', function() {
  // Animación de barras de progreso
  document.querySelectorAll('.progress').forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = width; }, 100);
  });

  // Validación de formulario de feedback (si existe)
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
      const email = feedbackForm.querySelector('input[type="email"]');
      const comment = feedbackForm.querySelector('textarea');
      let valid = true;
      if (email && !/^\S+@\S+\.\S+$/.test(email.value)) {
        email.classList.add('input-error');
        valid = false;
      } else if (email) {
        email.classList.remove('input-error');
      }
      if (comment && comment.value.trim().length < 10) {
        comment.classList.add('input-error');
        valid = false;
      } else if (comment) {
        comment.classList.remove('input-error');
      }
      if (!valid) {
        e.preventDefault();
        alert('Por favor, completa correctamente el formulario.');
      }
    });
  }

  // Evento: mostrar detalles de actividad
  document.querySelectorAll('.activity-item').forEach(item => {
    item.addEventListener('click', function() {
      const detail = item.querySelector('.activity-content');
      if (detail) {
        detail.classList.toggle('show-detail');
      }
    });
  });

  // Evento: navegación entre secciones
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
      const text = link.textContent.trim().toLowerCase();
      let section;
      if (text.includes('progreso')) section = document.querySelector('.summary-section');
      else if (text.includes('resultados')) section = document.querySelector('.test-results');
      else if (text.includes('material')) section = document.querySelector('.materials-section');
      else if (text.includes('favorita')) section = document.querySelector('.favorites-section');
      else if (text.includes('actividad')) section = document.querySelector('.recent-activity');
      if (section) section.style.display = '';
    });
  });
});

// Utilidad: limpiar campos de formulario
function limpiarFormulario(id) {
  const form = document.getElementById(id);
  if (form) {
    form.reset();
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  }
}
