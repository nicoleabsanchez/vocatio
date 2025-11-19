// form-handler.js

// Validations, event handling, and DOM manipulation for the help request form

(function () {
  const form = document.getElementById('helpForm');
  const confirmation = document.getElementById('confirmation');
  const ticketSpan = document.getElementById('ticketNumber');
  const continueBtn = document.getElementById('continueBtn');
  const sendBtn = document.getElementById('sendBtn');
  const backBtn = document.getElementById('backBtn');

  function generateTicket() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const rnd = Math.floor(1000 + Math.random() * 9000);
    return `VOC-${yyyy}${mm}${dd}-${hh}${min}-${rnd}`;
  }

  function validateForm() {
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const incidentType = document.getElementById('incidentType').value;
    const priority = document.getElementById('priority').value;
    const subject = document.getElementById('subject').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!name || !email || !incidentType || !priority || !subject || !description) {
      alert('Por favor completa todos los campos obligatorios.');
      return false;
    }

    if (!email.includes('@')) {
      alert('Por favor ingresa un correo electrónico válido.');
      return false;
    }

    return true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const ticket = generateTicket();
    ticketSpan.textContent = ticket;
    form.style.display = 'none';
    confirmation.style.display = 'block';
    continueBtn.focus();
  });

  continueBtn.addEventListener('click', function () {
    form.reset();
    confirmation.style.display = 'none';
    form.style.display = 'block';
    document.getElementById('fullName').focus();
  });

  backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.querySelectorAll('.file-block').forEach(function (lbl) {
    lbl.addEventListener('click', function () {
      const input = lbl.querySelector('input[type=file]');
      if (input) input.click();
    });
  });
})();