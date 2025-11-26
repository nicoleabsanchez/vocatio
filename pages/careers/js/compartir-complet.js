//
// compartir.js
// Permite compartir resultados en redes sociales y personalizarlos antes de compartir.
// Todas las acciones y mensajes se adaptan a la actividad real del usuario.

// Estado de personalización del usuario
let userShareData = {
  message: '¡Descubre tus carreras ideales con el test vocacional de Vocatio! Compartí mis resultados 🎓',
  includeAreas: true,
  includeCareers: true,
  includeDate: true,
  includeLogo: true,
  includeProfile: false
};

// Permite al usuario personalizar el contenido antes de compartir
function customizeContent() {
  showToast('Abre la ventana de personalización para editar tu mensaje 📝');
  // Aquí deberías abrir un modal real para personalizar, ejemplo básico:
  const newMsg = prompt('Edita tu mensaje para compartir:', userShareData.message);
  if (newMsg !== null) {
    userShareData.message = newMsg;
    showToast('Mensaje personalizado actualizado');
  }
  // Aquí podrías agregar más opciones de personalización (checkboxes, etc.)
  // y guardar en userShareData
  // Las acciones y opciones pueden ser proporcionales a lo que el usuario ya completó
}

// Lógica para compartir en redes sociales
function shareOn(network) {
  // El mensaje y los datos a compartir se adaptan a la personalización del usuario
  const pageUrl = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(userShareData.message);
  let url = '#';

  switch(network) {
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
      break;
    case 'twitter':
      url = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}`;
      break;
    case 'linkedin':
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
      break;
    case 'instagram':
      url = 'https://www.instagram.com/';
      showToast('Abre Instagram y comparte una captura de pantalla de tus resultados 📸');
      break;
  }

  if (url !== '#') {
    window.open(url, '_blank', 'width=600,height=400');
    showToast(`¡Compartiendo en ${network.charAt(0).toUpperCase() + network.slice(1)}! 🎉`);
  }
}

// Notificación visual
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Hacer clickeable toda el área de los botones sociales si existen
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.style.cursor = 'pointer';
  });
});
