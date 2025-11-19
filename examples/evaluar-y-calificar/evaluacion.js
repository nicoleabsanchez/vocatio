(function(){
  'use strict';
  function qs(sel, ctx=document){ return ctx.querySelector(sel); }
  function qsa(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }

  // Asegura que exista un textarea dentro de .comment-box
  const commentBox = qs('.comment-box');
  let textarea = commentBox && commentBox.querySelector('textarea');
  if(commentBox && !textarea){
    textarea = document.createElement('textarea');
    textarea.id = 'comment';
    textarea.placeholder = 'Escribe tus comentarios aquí...';
    textarea.rows = 4;
    textarea.style.width = '100%';
    textarea.style.boxSizing = 'border-box';
    textarea.style.border = '1px solid #d9d4ff';
    textarea.style.borderRadius = '6px';
    textarea.style.padding = '0.5rem';
    commentBox.innerHTML = '';
    commentBox.appendChild(textarea);
  }

  function setRatingVisual(ratingContainer, value){
    const dots = qsa('.rating-dot', ratingContainer);
    dots.forEach((dot, i)=>{
      if(i < value){
        dot.style.background = '#ffd166';
        dot.style.borderColor = '#ffb703';
      } else {
        dot.style.background = '#693efe';
        dot.style.borderColor = '#39017d';
      }
    });
    ratingContainer.dataset.selected = String(value);
  }

  // Convierte puntos en elementos interactivos y añade listeners
  qsa('.rating').forEach(ratingContainer=>{
    const dots = qsa('.rating-dot', ratingContainer);
    dots.forEach((dot, idx)=>{
      dot.style.cursor = 'pointer';
      dot.tabIndex = 0;
      dot.setAttribute('role','button');
      dot.addEventListener('click', ()=> setRatingVisual(ratingContainer, idx+1));
      dot.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setRatingVisual(ratingContainer, idx+1); } });
      dot.addEventListener('mouseover', ()=>{
        const temp = idx+1;
        const dotsLocal = qsa('.rating-dot', ratingContainer);
        dotsLocal.forEach((d,i)=>{
          if(i < temp){ d.style.background = '#ffefc1'; d.style.borderColor = '#ffb703'; }
          else { d.style.background = '#693efe'; d.style.borderColor = '#39017d'; }
        });
      });
      dot.addEventListener('mouseout', ()=>{
        const sel = parseInt(ratingContainer.dataset.selected || '0', 10);
        setRatingVisual(ratingContainer, sel);
      });
    });
  });

  const mainSendBtn = qs('.main-content .btn');
  const saveBtn = qs('.score-panel .btn');

  function gatherMainRatings(){
    const cards = qsa('.evaluation-card');
    return cards.map(card=>{
      const rc = qs('.rating', card);
      const sel = parseInt(rc && rc.dataset.selected || '0', 10);
      return { title: qs('.evaluation-title', card)?.textContent?.trim() || '', rating: sel };
    });
  }

  function validateAndSend(){
    const ratings = gatherMainRatings();
    const missing = ratings.filter(r => r.rating === 0);
    const comment = textarea ? textarea.value.trim() : '';
    if(missing.length){
      alert('Por favor selecciona una calificación para todas las evaluaciones.');
      return;
    }
    if(comment.length < 5){
      alert('El comentario debe tener al menos 5 caracteres.');
      textarea && textarea.focus();
      return;
    }
    const payload = { evaluations: ratings, comment };
    console.log('Enviar evaluación:', payload);
    alert('Evaluación enviada correctamente. Mira la consola para el payload.');
  }

  function validateAndSave(){
    const rc = qs('.score-panel .rating');
    const sel = parseInt(rc && rc.dataset.selected || '0', 10);
    const commentRight = qs('.score-panel .comment-box textarea')?.value || (textarea ? textarea.value : '');
    if(sel === 0){
      alert('Selecciona la calificación general antes de guardar.');
      return;
    }
    console.log('Guardar calificación:', { score: sel, comment: commentRight });
    alert('Calificación guardada. Mira la consola para el payload.');
  }

  if(mainSendBtn) mainSendBtn.addEventListener('click', validateAndSend);
  if(saveBtn) saveBtn.addEventListener('click', validateAndSave);

  // Restaurar visuales según estado inicial (si hubiera)
  qsa('.rating').forEach(rc=> setRatingVisual(rc, parseInt(rc.dataset.selected || '0', 10)));

})();
