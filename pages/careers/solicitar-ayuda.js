document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-ayuda');
  const archivoInput = document.getElementById('archivo');
  const archivoNombre = document.getElementById('archivo-nombre');
  const resultado = document.getElementById('ticket-resultado');
  const estadoDiv = document.getElementById('estado-ticket');

  if (archivoInput) {
    archivoInput.addEventListener('change', () => {
      const f = archivoInput.files[0];
      archivoNombre.textContent = f ? f.name : 'Haz clic para seleccionar archivos';
    });
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      id: 'T-' + Date.now().toString().slice(-6),
      nombre: form.nombre.value.trim(),
      correo: form.correo.value.trim(),
      tipo: form.tipo.value,
      prioridad: form.prioridad.value,
      asunto: form.asunto.value.trim(),
      descripcion: form.descripcion.value.trim(),
      archivoNombre: archivoInput && archivoInput.files[0] ? archivoInput.files[0].name : null,
      status: 'Abierto',
      createdAt: new Date().toISOString()
    };

    const tickets = JSON.parse(localStorage.getItem('helpTickets') || '[]');
    tickets.unshift(data);
    localStorage.setItem('helpTickets', JSON.stringify(tickets));

    resultado.innerHTML = `
      <div style="max-width:800px;margin:20px auto;padding:20px;border-radius:8px;background:#F6F6FF;border:2px solid #D9D4FF;">
        <p style="font-weight:700;font-size:18px;margin:0 0 8px;">Solicitud enviada</p>
        <p style="margin:0 0 8px;">Tu ticket: <strong>${data.id}</strong></p>
        <p style="margin:0 0 8px;">Asunto: ${escapeHtml(data.asunto)}</p>
      </div>
    `;

    renderStatus(data);
    form.reset();
    if (archivoNombre) archivoNombre.textContent = 'Haz clic para seleccionar archivos';
    window.scrollTo({ top: resultado.offsetTop - 20, behavior: 'smooth' });
  });

  function renderStatus(ticket) {
    estadoDiv.innerHTML = `
      <div style="max-width:800px;margin:0 auto;padding:20px;border-radius:8px;background:#fff;border:2px solid #E7E7FB;">
        <p style="font-weight:700;margin:0 0 8px;">Estado del ticket <strong>${ticket.id}</strong></p>
        <p style="margin:0 0 8px;">Estado: <span style="color:#693EFE;font-weight:700;">${ticket.status}</span></p>
        <p style="margin:0 0 12px;">Creado: ${new Date(ticket.createdAt).toLocaleString()}</p>
        <button id="volver-explore" style="background:#693EFE;color:#fff;border:none;padding:12px 18px;border-radius:8px;cursor:pointer;">Volver a explorar</button>
      </div>
    `;
    const btn = document.getElementById('volver-explore');
    if (btn) btn.addEventListener('click', () => { window.location.href = './explore.html'; });
  }

  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // Show most recent ticket status if exists
  const existing = JSON.parse(localStorage.getItem('helpTickets') || '[]');
  if (existing.length) renderStatus(existing[0]);
});
