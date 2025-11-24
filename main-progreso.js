// main-progreso.js
// Lógica para actualizar el progreso dinámicamente

document.addEventListener('DOMContentLoaded', function() {
    const progreso = 75; // Porcentaje de progreso
    document.getElementById('barraProgreso').style.width = progreso + '%';
    document.getElementById('progresoTotal').textContent = progreso + '%';
});
