// main-progreso.js
// Utilidad para manejar validaciones, eventos y manipulación del DOM en la página de progreso

// --- Validaciones ---
function validarProgreso(valor) {
    // Valida que el progreso esté entre 0 y 100
    return typeof valor === 'number' && valor >= 0 && valor <= 100;
}

// --- Datos simulados de usuario (pueden venir de backend/localStorage) ---
let actividades = [
    // { fecha: '2025-11-24', categoria: 'Tecnología', tipo: 'Test', progreso: 100 },
    // { fecha: '2025-11-23', categoria: 'Ciencias', tipo: 'Material', progreso: 65 },
    // ...
];

let categorias = ['Tecnología', 'Ciencias', 'Arte', 'Negocios', 'Social'];
let progresoPorCategoria = { 'Tecnología': 0, 'Ciencias': 0, 'Arte': 0, 'Negocios': 0, 'Social': 0 };
let actividadPorDia = {};

// --- Cargar datos del test vocacional ---
function cargarDatosDelTest() {
    const testResults = localStorage.getItem('vocatioTestResults');
    if (testResults) {
        try {
            const data = JSON.parse(testResults);
            
            // Agregar el test como actividad solo si no existe
            const hoy = new Date().toISOString().slice(0, 10);
            const yaExiste = actividades.some(a => a.tipo === 'Test Vocacional Completado' && a.fecha === hoy);
            
            if (!yaExiste) {
                // Encontrar categoría dominante
                let categoriaDominante = 'Tecnología';
                if (data.interests) {
                    const categorias = {
                        'Tecnología': data.interests.technology || 0,
                        'Ciencias': data.interests.science || 0,
                        'Arte': data.interests.art || 0,
                        'Negocios': data.interests.business || 0,
                        'Social': data.interests.social || 0
                    };
                    categoriaDominante = Object.entries(categorias).sort((a, b) => b[1] - a[1])[0][0];
                }
                
                const testActividad = {
                    fecha: hoy,
                    categoria: categoriaDominante,
                    tipo: 'Test Vocacional Completado',
                    progreso: 100,
                    careerName: '',
                    rating: 5
                };
                
                actividades.push(testActividad);
            }
            
            // Actualizar intereses basados en el test
            if (data.interests) {
                progresoPorCategoria['Tecnología'] = Math.round(data.interests.technology || 0);
                progresoPorCategoria['Ciencias'] = Math.round(data.interests.science || 0);
                progresoPorCategoria['Arte'] = Math.round(data.interests.art || 0);
                progresoPorCategoria['Negocios'] = Math.round(data.interests.business || 0);
                progresoPorCategoria['Social'] = Math.round(data.interests.social || 0);
            }
        } catch (e) {
            console.error('Error loading test results:', e);
        }
    }
}

// Cargar datos del localStorage si existen
function cargarDatosDelLocalStorage() {
    const userProgress = localStorage.getItem('vocatioUserProgress');
    if (userProgress) {
        try {
            const data = JSON.parse(userProgress);
            // Usar datos existentes si están disponibles
            if (data.activities && Array.isArray(data.activities)) {
                actividades = [...actividades, ...data.activities];
            }
        } catch (e) {
            console.error('Error loading user progress:', e);
        }
    }
    
    // Cargar carreras exploradas
    const careersExplored = localStorage.getItem('vocatioCareersExplored');
    if (careersExplored) {
        try {
            const careers = JSON.parse(careersExplored);
            careers.forEach(career => {
                // Evitar duplicados
                const yaExiste = actividades.some(a => a.tipo === 'Carrera Explorada' && a.careerName === career.careerName);
                if (!yaExiste && career.careerName) {
                    const fecha = career.timestamp ? career.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10);
                    actividades.push({
                        fecha: fecha,
                        categoria: career.area || 'Tecnología',
                        tipo: 'Carrera Explorada',
                        progreso: 100,
                        careerName: career.careerName,
                        rating: 0
                    });
                }
            });
        } catch (e) {
            console.error('Error loading careers explored:', e);
        }
    }
    
    // Cargar materiales revisados
    const materialsReviewed = localStorage.getItem('vocatioMaterialsReviewed');
    if (materialsReviewed) {
        try {
            const materials = JSON.parse(materialsReviewed);
            materials.forEach(material => {
                const yaExiste = actividades.some(a => a.tipo === 'Material Revisado' && a.careerName === material.name);
                if (!yaExiste && material.name) {
                    const fecha = material.timestamp ? material.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10);
                    actividades.push({
                        fecha: fecha,
                        categoria: 'Material',
                        tipo: 'Material Revisado',
                        progreso: 100,
                        careerName: material.name,
                        rating: 0
                    });
                }
            });
        } catch (e) {
            console.error('Error loading materials reviewed:', e);
        }
    }
}

// --- Utilidades de cálculo ---
function calcularProgresoTotal() {
    if (actividades.length === 0) return 0;
    let suma = actividades.reduce((acc, act) => acc + (act.progreso || 0), 0);
    return Math.round(suma / actividades.length);
}

function calcularProgresoPorCategoria() {
    // Reiniciar
    categorias.forEach(cat => progresoPorCategoria[cat] = 0);
    let conteo = { ...progresoPorCategoria };
    actividades.forEach(act => {
        if (progresoPorCategoria.hasOwnProperty(act.categoria)) {
            progresoPorCategoria[act.categoria] += act.progreso || 0;
            conteo[act.categoria] += 1;
        }
    });
    // Promedio por categoría
    categorias.forEach(cat => {
        if (conteo[cat] > 0) progresoPorCategoria[cat] = Math.round(progresoPorCategoria[cat] / conteo[cat]);
    });
}

function calcularActividadPorDia() {
    actividadPorDia = {};
    actividades.forEach(act => {
        actividadPorDia[act.fecha] = (actividadPorDia[act.fecha] || 0) + 1;
    });
}

// --- Manejo del DOM ---

// --- Manejo del DOM ---
function actualizarBarraProgreso(valor) {
    if (!validarProgreso(valor)) {
        alert('El valor de progreso no es válido.');
        return;
    }
    document.getElementById('barraProgreso').style.width = valor + '%';
    document.getElementById('progresoTotal').textContent = valor + '%';
    // Mostrar/ocultar mensaje de progreso en cero
    const msgCero = document.getElementById('mensajeProgresoCero');
    const msgCeroDetalle = document.getElementById('mensajeProgresoCeroDetalle');
    if (msgCero) msgCero.style.display = (valor === 0) ? 'block' : 'none';
    if (msgCeroDetalle) msgCeroDetalle.style.display = (valor === 0) ? 'block' : 'none';
}

function actualizarGraficas() {
    // Actualizar gráfica de intereses
    calcularProgresoPorCategoria();
    categorias.forEach(cat => {
        let barra = document.querySelector('.grafica-intereses .barra[data-cat="' + cat + '"]');
        if (barra) {
            barra.style.height = progresoPorCategoria[cat] + '%';
            barra.querySelector('span').textContent = progresoPorCategoria[cat] + '%';
        }
    });
    // Actualizar gráfica semanal (últimos 7 días)
    calcularActividadPorDia();
    let hoy = new Date();
    let dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (let i = 6; i >= 0; i--) {
        let d = new Date(hoy);
        d.setDate(hoy.getDate() - i);
        let fecha = d.toISOString().slice(0, 10);
        let barra = document.querySelector('.grafica-semanal .barra-dia[data-fecha="' + fecha + '"]');
        if (barra) {
            let cantidad = actividadPorDia[fecha] || 0;
            barra.style.height = (cantidad * 10) + 20 + '%'; // Escala visual
            barra.querySelector('span').textContent = cantidad;
        }
    }

    // Actualizar casillas de resumen
    let tests = actividades.filter(a => a.tipo && a.tipo.toLowerCase().includes('test')).length;
    let carreras = actividades.filter(a => a.tipo && a.tipo.toLowerCase().includes('carrera')).length;
    let materiales = actividades.filter(a => a.tipo && a.tipo.toLowerCase().includes('material')).length;
    document.getElementById('testsCompletados').textContent = tests || 0;
    document.getElementById('carrerasExploradas').textContent = carreras || 0;
    document.getElementById('materialesRevisados').textContent = materiales || 0;
}

// --- Eventos ---
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos desde localStorage
    cargarDatosDelLocalStorage();
    cargarDatosDelTest();
    
    // Calcular progreso total basado en actividades
    const progresoTotal = calcularProgresoTotal();
    actualizarBarraProgreso(progresoTotal);
    actualizarGraficas();

    // Alternar vistas al hacer clic en la barra de progreso o botones
    const progressBar = document.getElementById('progressBarClickable');
    const vistaResumen = document.getElementById('vistaResumen');
    const vistaDetalle = document.getElementById('vistaDetalle');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const btnVolver = document.getElementById('btnVolver');

    function mostrarDetalle() {
        vistaResumen.style.display = 'none';
        vistaDetalle.style.display = 'block';
    }
    function mostrarResumen() {
        vistaDetalle.style.display = 'none';
        vistaResumen.style.display = 'block';
    }

    if (progressBar) {
        progressBar.addEventListener('click', mostrarDetalle);
    }
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', mostrarDetalle);
    }
    if (btnVolver) {
        btnVolver.addEventListener('click', mostrarResumen);
    }

    // Simulación: registrar actividad del usuario (puedes conectar con backend)
    window.registrarActividad = function({fecha, categoria, tipo, progreso}) {
        actividades.push({fecha, categoria, tipo, progreso});
        // Actualizar todo
        let total = calcularProgresoTotal();
        actualizarBarraProgreso(total);
        actualizarGraficas();
    };

    // Ejemplo: registrar una actividad al hacer clic en un botón (puedes cambiar esto por eventos reales)
    // window.registrarActividad({fecha: '2025-11-24', categoria: 'Tecnología', tipo: 'Test', progreso: 100});
});
