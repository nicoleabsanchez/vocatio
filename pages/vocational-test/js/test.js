let testCompletado = false;

// Handler para evitar salida
const beforeUnloadHandler = (event) => {
    if (!testCompletado) {
        event.preventDefault();
        event.returnValue = "";
    }
};
window.addEventListener("beforeunload", beforeUnloadHandler);

const questions = [
    {
        question: "¿Qué tipo de actividades disfrutas más?",
        options: [
            "Resolver problemas complejos",
            "Ayudar a otras personas",
            "Crear o diseñar cosas",
            "Organizar información o datos"
        ]
    },
    {
        question: "¿Qué ambiente de trabajo prefieres?",
        options: [
            "Tecnología y computadoras",
            "Salud y bienestar",
            "Arte y creatividad",
            "Administración y gestión"
        ]
    },
    {
        question: "¿Qué tan cómodo te sientes trabajando en equipo?",
        options: [
            "Prefiero trabajar solo",
            "Me adapto bien a equipos",
            "Me encanta liderar grupos",
            "Prefiero seguir instrucciones claras"
        ]
    },
    {
        question: "¿Qué te motiva más?",
        options: [
            "Innovar y crear nuevas soluciones",
            "Impactar positivamente en otros",
            "Expresar ideas creativas",
            "Lograr eficiencia y organización"
        ]
    },
    {
        question: "¿Qué habilidad consideras tu fortaleza principal?",
        options: [
            "Pensamiento lógico",
            "Empatía",
            "Creatividad",
            "Planificación"
        ]
    }
];

let currentIndex = 0;
const answers = {};

const questionTitle = document.getElementById("questionTitle");
const questionOptions = document.getElementById("questionOptions");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const currentQuestionText = document.getElementById("currentQuestion");

function renderQuestion() {
    const q = questions[currentIndex];

    questionTitle.textContent = q.question;
    currentQuestionText.textContent = currentIndex + 1;

    const progressPercent = ((currentIndex) / (questions.length - 1)) * 100;
    progressBar.style.width = progressPercent + "%";

    questionOptions.innerHTML = "";
    q.options.forEach((opt, index) => {
        const optionId = `option-${index}`;

        const wrapper = document.createElement("label");
        wrapper.className = "option-label";
        wrapper.setAttribute("for", optionId);

        const checked = answers[currentIndex] === index ? "checked" : "";

        wrapper.innerHTML = `
            <input type="radio" name="question" id="${optionId}" value="${index}" ${checked}>
            <span class="option-text">${opt}</span>
        `;

        if (answers[currentIndex] === index) {
            wrapper.classList.add("selected");
        }

        wrapper.addEventListener("click", () => {
            document.querySelectorAll(".option-label").forEach(l => l.classList.remove("selected"));
            wrapper.classList.add("selected");
            nextBtn.disabled = false;
        });

        questionOptions.appendChild(wrapper);
    });

    nextBtn.disabled = answers[currentIndex] === undefined;
    prevBtn.disabled = currentIndex === 0;
}

nextBtn.addEventListener("click", () => {
    const selectedOption = document.querySelector("input[name='question']:checked");

    if (!selectedOption) {
        nextBtn.disabled = true;
        return;
    }

    answers[currentIndex] = parseInt(selectedOption.value);

    if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        testCompletado = true;
        window.removeEventListener("beforeunload", beforeUnloadHandler);
        // Analizar respuestas seleccionadas, guardarlas y luego redirigir a resultados
        const answersText = {};
        for (let i = 0; i < questions.length; i++) {
            const selectedIndex = answers[i];
            answersText[`pregunta${i+1}`] = questions[i].options[selectedIndex];
        }

        const resultado = analizarPerfilVocacional(answersText);
        guardarResultados(resultado, answersText);

        // Redirigir a la página de resultados
        window.location.href = "../results/results.html";
    }
});

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
});

renderQuestion();

// =================================================================
// CÓDIGO DE ANÁLISIS DE PERFIL VOCACIONAL
// Basado en las 5 preguntas y categorías proporcionadas
// =================================================================

function analizarPerfilVocacional(respuestasUsuario) {
    // Matriz de clasificación (mapeo respuesta -> categorías)
    const matrizClasificacion = {
        "Resolver problemas complejos": ["Tecnología", "Ciencias", "Ingeniería"],
        "Ayudar a otras personas": ["Salud"],
        "Crear o diseñar cosas": ["Arte y Diseño"],
        "Organizar información o datos": ["Negocios"],
        "Tecnología y computadoras": ["Tecnología", "Ingeniería"],
        "Salud y bienestar": ["Salud"],
        "Arte y creatividad": ["Arte y Diseño"],
        "Administración y gestión": ["Negocios"],
        "Prefiero trabajar solo": ["Ciencias", "Arte y Diseño", "Tecnología"],
        "Me adapto bien a equipos": ["Salud", "Negocios"],
        "Me encanta liderar grupos": ["Negocios"],
        "Prefiero seguir instrucciones claras": ["Negocios", "Ingeniería"],
        "Innovar y crear nuevas soluciones": ["Tecnología", "Ciencias", "Ingeniería"],
        "Impactar positivamente en otros": ["Salud"],
        "Expresar ideas creativas": ["Arte y Diseño"],
        "Lograr eficiencia y organización": ["Negocios", "Ingeniería"],
        "Pensamiento lógico": ["Tecnología", "Ciencias", "Ingeniería"],
        "Empatía": ["Salud"],
        "Creatividad": ["Arte y Diseño"],
        "Planificación": ["Negocios", "Ingeniería"]
    };

    // Mapeo de categoría -> carreras recomendadas (simple)
    const carrerasPorCategoria = {
        "Tecnología": ["Ingeniería de Sistemas", "Ciencias de la Computación"],
        "Salud": ["Medicina", "Enfermería", "Psicología"],
        "Negocios": ["Administración de Empresas", "Economía", "Marketing"],
        "Ingeniería": ["Ingeniería Civil", "Ingeniería Industrial"],
        "Arte y Diseño": ["Diseño Gráfico", "Arquitectura", "Bellas Artes"],
        "Ciencias": ["Biología", "Química", "Física"]
    };

    // Inicializar contadores
    const puntuacionCategorias = {
        "Tecnología": 0,
        "Salud": 0,
        "Negocios": 0,
        "Ingeniería": 0,
        "Arte y Diseño": 0,
        "Ciencias": 0
    };

    const totalPreguntas = Object.keys(respuestasUsuario).length || questions.length;

    // Sumar puntos según la matriz
    for (const [, respuesta] of Object.entries(respuestasUsuario)) {
        const categorias = matrizClasificacion[respuesta] || [];
        categorias.forEach(cat => {
            if (puntuacionCategorias.hasOwnProperty(cat)) puntuacionCategorias[cat] += 1;
        });
    }

    // Calcular porcentajes y determinar categoría principal
    const resultadosPorcentuales = {};
    let maxPuntuacion = 0;
    let categoriaRecomendada = "";

    for (const [categoria, puntuacion] of Object.entries(puntuacionCategorias)) {
        const porcentaje = Math.round((puntuacion / totalPreguntas) * 100);
        resultadosPorcentuales[categoria] = porcentaje;
        if (puntuacion > maxPuntuacion) {
            maxPuntuacion = puntuacion;
            categoriaRecomendada = categoria;
        }
    }

    // Mensaje y carreras
    let mensaje = "";
    if (maxPuntuacion === 0) {
        mensaje = "No se encontró una coincidencia clara. Por favor, completa el test nuevamente.";
    } else if (maxPuntuacion >= 3) {
        mensaje = `Tu perfil muestra una fuerte afinidad con ${categoriaRecomendada}. ¡Estas carreras son ideales para ti!`;
    } else {
        mensaje = `Tienes una tendencia hacia ${categoriaRecomendada}. Te recomendamos explorar estas opciones.`;
    }

    return {
        categorias: resultadosPorcentuales,
        categoriaRecomendada,
        puntuacionMaxima: maxPuntuacion,
        porcentajeMaximo: resultadosPorcentuales[categoriaRecomendada] || 0,
        carrerasRecomendadas: carrerasPorCategoria[categoriaRecomendada] || [],
        mensaje
    };
}

function guardarResultados(resultado, respuestasUsuario) {
    try {
        localStorage.setItem('vocatioTestResults', JSON.stringify(resultado));
        localStorage.setItem('vocatioTestAnswers', JSON.stringify(respuestasUsuario));
        localStorage.setItem('vocatioTestDate', new Date().toISOString());

        // Actualizar progreso del usuario (estructura simple)
        let userProgress = { testsCompleted: 0, careersExplored: 0, materialsReviewed: 0, totalProgress: 0 };
        const stored = localStorage.getItem('vocatioUserProgress');
        if (stored) {
            try { userProgress = JSON.parse(stored); } catch (e) { }
        }
        userProgress.testsCompleted = (userProgress.testsCompleted || 0) + 1;
        // recalcular totalProgress con una regla simple
        const suma = (userProgress.testsCompleted || 0) + (userProgress.careersExplored || 0) + (userProgress.materialsReviewed || 0);
        userProgress.totalProgress = Math.min(Math.round((suma / 30) * 100), 100);
        localStorage.setItem('vocatioUserProgress', JSON.stringify(userProgress));

        console.log('Resultados guardados en localStorage:', resultado);
    } catch (err) {
        console.error('No se pudo guardar resultados:', err);
    }
}
