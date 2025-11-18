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

    const progressPercent = ((currentIndex + 1) / questions.length) * 100;
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
