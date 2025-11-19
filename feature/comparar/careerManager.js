// careerManager.js
// Maneja validaciones, eventos y manipulación del DOM para carreras

// Validación de formulario
function validateForm(formId) {
    const form = document.getElementById(formId);
    let isValid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    return isValid;
}

// Manejo de eventos
function setupEventListeners() {
    // Validar al enviar el formulario
    const form = document.getElementById('careerForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm('careerForm')) {
                addCareer();
            }
        });
    }

    // Evento para eliminar carrera
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            e.target.parentElement.remove();
        }
    });
}

// Manipulación del DOM
function addCareer() {
    const nameInput = document.getElementById('careerName');
    const list = document.getElementById('careerList');
    if (nameInput && list) {
        const li = document.createElement('li');
        li.textContent = nameInput.value;
        const btn = document.createElement('button');
        btn.textContent = 'Eliminar';
        btn.className = 'delete-btn';
        li.appendChild(btn);
        list.appendChild(li);
        nameInput.value = '';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', setupEventListeners);
