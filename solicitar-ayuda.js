// Funcionalidad para solicitud de ayuda y generación de ticket
// Autor: GitHub Copilot

document.addEventListener('DOMContentLoaded', function () {

  // --- MANEJO DEL DOM: obtener referencias a elementos ---
  const form = document.getElementById('form-ayuda');
  const ticketResultado = document.getElementById('ticket-resultado');
  const estadoTicket = document.getElementById('estado-ticket');
  const archivoInput = document.getElementById('archivo');
  const archivoNombre = document.getElementById('archivo-nombre');

  // Estado simulado de tickets
  let tickets = {};

  // Colores de estado y prioridad
  function getStatusColor(status) {
    switch(status) {
      case 'En revisión': return '#FFA500';
      case 'En progreso': return '#4169E1';
      case 'Resuelto': return '#32CD32';
      case 'Cerrado': return '#808080';
      default: return '#693EFE';
    }
  }
  function getPriorityColor(priority) {
    switch(priority) {
      case 'Baja': return '#32CD32';
      case 'Media': return '#FFA500';
      case 'Alta': return '#FF4500';
      case 'Urgente': return '#DC143C';
      default: return '#693EFE';
    }
  }

  // --- EVENTOS: cambio de archivo ---
  if (archivoInput && archivoNombre) {
    archivoInput.addEventListener('change', function(e) {
      // MANEJO DEL DOM: mostrar nombre de archivo seleccionado
      const file = archivoInput.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          archivoInput.value = '';
          archivoNombre.textContent = 'Haz clic para seleccionar archivos';
          alert('El archivo debe ser menor a 5MB');
        } else {
          archivoNombre.textContent = file.name;
        }
      } else {
        archivoNombre.textContent = 'Haz clic para seleccionar archivos';
      }
    });
  }

  // --- EVENTOS: envío del formulario ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // --- VALIDACIONES ---
    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const asunto = form.asunto.value.trim();
    const tipo = form.tipo.value;
    const prioridad = form.prioridad.value;
    const descripcion = form.descripcion.value.trim();
    const archivo = archivoInput && archivoInput.files[0] ? archivoInput.files[0] : null;
    let errores = [];
    if (!nombre) errores.push('El nombre es obligatorio.');
    if (!correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) errores.push('Correo inválido.');
    if (!tipo) errores.push('Selecciona el tipo de incidencia.');
    if (!prioridad) errores.push('Selecciona la prioridad.');
    if (!asunto) errores.push('El asunto es obligatorio.');
    if (!descripcion) errores.push('La descripción es obligatoria.');
    if (archivo && archivo.size > 5 * 1024 * 1024) errores.push('El archivo debe ser menor a 5MB.');
    if (errores.length > 0) {
      // MANEJO DEL DOM: mostrar errores en pantalla
      ticketResultado.innerHTML = '<div style="color:#DC143C;font-size:18px;font-weight:600;margin-bottom:20px;">' + errores.join('<br>') + '</div>';
      return;
    }
    // --- MANEJO DEL DOM: crear y mostrar ticket ---
    const ticketNum = 'VCT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    tickets[ticketNum] = {
      estado: 'En revisión',
      nombre, correo, asunto, tipo, prioridad, descripcion,
      archivo: archivo ? archivo.name : null,
      creado: new Date().toLocaleString('es-PE'),
      actualizado: new Date().toLocaleString('es-PE')
    };
    ticketResultado.innerHTML = `
      <div style='text-align:center;max-width:700px;margin:0 auto;background:#fff;border:4px solid #D9D4FF;border-radius:20px;padding:40px 20px;'>
        <div style='font-size:60px;margin-bottom:10px;'>✅</div>
        <h2 style='font-size:32px;font-weight:700;color:#45444C;margin:0 0 10px 0;'>¡Solicitud Enviada!</h2>
        <p style='font-size:18px;color:#67666F;margin-bottom:20px;'>Tu ticket ha sido creado exitosamente</p>
        <div style='background:#f8f8ff;border:3px solid #693EFE;border-radius:15px;padding:20px;margin-bottom:20px;'>
          <p style='font-size:16px;color:#67666F;margin:0 0 5px 0;'>Número de Ticket</p>
          <p style='font-size:28px;font-weight:700;color:#693EFE;margin:0 0 10px 0;letter-spacing:2px;'>${ticketNum}</p>
          <span style='display:inline-block;background:${getStatusColor('En revisión')};color:white;padding:6px 18px;border-radius:20px;font-size:14px;font-weight:600;'>En revisión</span>
        </div>
        <div style='text-align:left;background:#fff;border:2px solid #D9D4FF;border-radius:10px;padding:15px;margin-bottom:20px;'>
          <p style='font-size:15px;color:#67666F;margin:0 0 6px 0;'><strong>Asunto:</strong> ${asunto}</p>
          <p style='font-size:15px;color:#67666F;margin:0 0 6px 0;'><strong>Tipo:</strong> ${tipo}</p>
          <p style='font-size:15px;color:#67666F;margin:0 0 6px 0;'><strong>Prioridad:</strong> <span style='color:${getPriorityColor(prioridad)};font-weight:600;'>${prioridad}</span></p>
          <p style='font-size:15px;color:#67666F;margin:0;'><strong>Fecha de creación:</strong> ${tickets[ticketNum].creado}</p>
        </div>
        <p style='font-size:16px;color:#67666F;margin-bottom:20px;line-height:1.6;'>Te enviaremos una respuesta a <strong>${correo}</strong> dentro de las próximas 24-48 horas. Guarda tu número de ticket para hacer seguimiento.</p>
        <button id='ver-estado-btn' style='background:#693EFE;color:white;border:none;border-radius:7px;padding:12px 30px;font-size:18px;font-weight:500;cursor:pointer;'>Ver estado del ticket</button>
      </div>
    `;
    estadoTicket.innerHTML = '';
    // --- EVENTOS: botón para ver estado del ticket ---
    document.getElementById('ver-estado-btn').onclick = function() {
      mostrarEstado(ticketNum);
    };
    form.reset();
    if (archivoNombre) archivoNombre.textContent = 'Haz clic para seleccionar archivos';
  });

  // --- MANEJO DEL DOM: función para mostrar el estado del ticket ---
  function mostrarEstado(ticketNum) {
    const ticket = tickets[ticketNum];
    if (ticket) {
      estadoTicket.innerHTML = `
        <div style='max-width:700px;margin:0 auto;background:#fff;border:3px solid #D9D4FF;border-radius:15px;padding:30px;'>
          <h3 style='font-size:28px;font-weight:700;color:#693EFE;margin:0 0 10px 0;'>${ticketNum}</h3>
          <div style='display:flex;gap:10px;align-items:center;margin-bottom:15px;'>
            <span style='background:${getPriorityColor(ticket.prioridad)};color:white;padding:6px 15px;border-radius:15px;font-size:14px;font-weight:600;'>${ticket.prioridad}</span>
            <span style='background:${getStatusColor(ticket.estado)};color:white;padding:6px 15px;border-radius:15px;font-size:14px;font-weight:600;'>${ticket.estado}</span>
          </div>
          <div style='background:#f8f8ff;border-radius:10px;padding:20px;margin-bottom:15px;'>
            <p style='font-size:20px;font-weight:700;color:#45444C;margin:0 0 10px 0;'>${ticket.asunto}</p>
            <p style='font-size:16px;color:#67666F;margin:0 0 15px 0;line-height:1.5;'>${ticket.descripcion}</p>
            <div style='display:flex;gap:20px;flex-wrap:wrap;'>
              <p style='font-size:14px;color:#67666F;margin:0;'><strong>Tipo:</strong> ${ticket.tipo}</p>
              <p style='font-size:14px;color:#67666F;margin:0;'><strong>Email:</strong> ${ticket.correo}</p>
              ${ticket.archivo ? `<p style='font-size:14px;color:#67666F;margin:0;'><strong>Archivo:</strong> ${ticket.archivo}</p>` : ''}
            </div>
          </div>
          <p style='font-size:14px;color:#67666F;margin:0 0 15px 0;'>Última actualización: ${ticket.actualizado}</p>
        </div>
      `;
    } else {
      estadoTicket.innerHTML = '<div style="color:#DC143C;font-size:18px;font-weight:600;">Ticket no encontrado.</div>';
    }
  }
});
