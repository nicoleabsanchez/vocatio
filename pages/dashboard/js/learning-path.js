// NOTIFICACIÓN DE FASE BLOQUEADA
function showLockedNotification(message) {
  const existingMessage = document.querySelector('.locked-notification');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const notificationDiv = document.createElement('div');
  notificationDiv.className = 'locked-notification';
  notificationDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 1.5rem;">🔒</span>
      <span>${message}</span>
    </div>
  `;
  notificationDiv.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fee2e2;
    color: #991b1b;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-weight: 500;
    animation: slideDown 0.3s ease;
    border: 2px solid #fecaca;
    max-width: 90%;
    text-align: center;
  `;
  
  document.body.appendChild(notificationDiv);
  
  setTimeout(() => {
    notificationDiv.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => notificationDiv.remove(), 300);
  }, 3000);
}

// AGREGAR EVENTOS A LAS FASES BLOQUEADAS
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script cargado - Buscando fases bloqueadas...');
  
  // Buscar todos los divs con el badge "Bloqueada"
  const allDivs = document.querySelectorAll('div');
  const lockedPhases = [];
  
  allDivs.forEach(div => {
    const hasBlockedBadge = div.querySelector('span') && 
                           div.querySelector('span').textContent.includes('Bloqueada');
    const hasOpacity = div.style.opacity === '0.7';
    
    if (hasBlockedBadge && hasOpacity) {
      lockedPhases.push(div);
      console.log('Fase bloqueada encontrada:', div);
    }
  });
  
  console.log(`Total fases bloqueadas encontradas: ${lockedPhases.length}`);
  
  lockedPhases.forEach((phase, index) => {
    // Hacer el cursor pointer para indicar que es clickeable
    phase.style.cursor = 'pointer';
    
    // Agregar efecto hover
    phase.addEventListener('mouseenter', function() {
      this.style.opacity = '0.85';
      this.style.transition = 'opacity 0.3s ease';
      console.log('Mouse sobre fase bloqueada');
    });
    
    phase.addEventListener('mouseleave', function() {
      this.style.opacity = '0.7';
    });
    
    // Agregar evento click
    phase.addEventListener('click', function(e) {
      console.log('Click en fase bloqueada!');
      const phaseTitle = this.querySelector('h2').textContent;
      console.log('Título de la fase:', phaseTitle);
      
      if (phaseTitle.includes('Fase 2')) {
        showLockedNotification('⚠️ Debes completar la Fase 1 para acceder a esta fase');
      } else if (phaseTitle.includes('Fase 3')) {
        showLockedNotification('⚠️ Debes completar las Fases 1 y 2 para acceder a esta fase');
      } else {
        showLockedNotification('⚠️ Esta fase aún no está disponible');
      }
    });
  });
});

// ESTILOS DE ANIMACIÓN
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
`;
document.head.appendChild(style);
