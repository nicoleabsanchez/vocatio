// Funcionalidad de calificación y comentarios para el video
// --- Manejo de eventos, validaciones y DOM ---
document.addEventListener('DOMContentLoaded', function() {
  // --- Manejo del DOM: Selección de estrellas ---
  const stars = document.querySelectorAll('.star-1-stroke-14, .star-1-stroke-15, .star-1-stroke-16, .star-1-stroke-17, .star-1-stroke-18');
  let currentRating = 0;

  // --- Manejo de eventos: interacción con estrellas ---
  stars.forEach((star, idx) => {
    // Evento: mouse entra en estrella (hover visual)
    star.addEventListener('mouseenter', () => highlightStars(idx + 1));
    // Evento: mouse sale de estrella (restaurar visual)
    star.addEventListener('mouseleave', () => highlightStars(currentRating));
    // Evento: click en estrella (selección de calificación)
    star.addEventListener('click', () => {
      currentRating = idx + 1;
      highlightStars(currentRating);
    });
  });

  // --- Manejo del DOM: Actualizar visual de estrellas ---
  function highlightStars(rating) {
    stars.forEach((star, i) => {
      star.style.filter = i < rating ? 'grayscale(0)' : 'grayscale(1)';
      star.style.opacity = i < rating ? '1' : '0.5';
    });
  }

  // --- Manejo del DOM: Crear textarea para comentario ---
  const commentInput = document.createElement('textarea');
  commentInput.placeholder = 'Escribe tu comentario...';
  commentInput.style.width = '100%';
  commentInput.style.margin = '10px 0';
  commentInput.rows = 3;
  // Insertar después de "Tu comentario (opcional)"
  const commentLabel = document.querySelector('.text-13');
  commentLabel.parentNode.insertBefore(commentInput, commentLabel.nextSibling);

  // --- Manejo de eventos: click en botón publicar ---
  const publishBtn = document.querySelector('.group-24-8');
  publishBtn.style.cursor = 'pointer';
  publishBtn.addEventListener('click', function() {
    // --- Validación: debe seleccionar estrellas antes de publicar ---
    if (currentRating === 0) {
      alert('Por favor, selecciona una calificación de estrellas.');
      return;
    }
    // --- Manejo del DOM: obtener comentario y mostrar alerta ---
    const comment = commentInput.value.trim();
    alert('¡Gracias por tu calificación!\nEstrellas: ' + currentRating + '\nComentario: ' + (comment || 'Sin comentario'));
    // Aquí podrías enviar la calificación y comentario a un backend si lo deseas
    commentInput.value = '';
    currentRating = 0;
    highlightStars(0);
  });

  // --- Manejo del DOM: reemplazar imagen por video real ---
  const videoDiv = document.querySelector('.video-47');
  if (videoDiv) {
    const video = document.createElement('video');
    video.src = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Cambia por tu video
    video.controls = true;
    video.style.width = '100%';
    video.style.maxWidth = '600px';
    videoDiv.parentNode.replaceChild(video, videoDiv);
  }
// Fin del DOMContentLoaded
});
