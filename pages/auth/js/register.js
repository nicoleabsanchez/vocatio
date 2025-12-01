document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ register.js cargado correctamente");

  const form = document.getElementById("registerForm");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const termsInput = document.getElementById("terms");

  const alertBox = document.getElementById("alert-box");

  // --- MODAL ---
  const openTerms = document.getElementById("open-terms");
  const modal = document.getElementById("terms-modal");
  const closeTerms = document.getElementById("close-terms");

  openTerms.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
  });

  closeTerms.addEventListener("click", () => {
      modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
  });

  const barFill = document.getElementById("password-strength-fill");
  const strengthText = document.getElementById("password-strength-text");

  passwordInput.addEventListener("input", () => {
    const pwd = passwordInput.value;

    if (pwd.length === 0) {
        barFill.style.width = "0%";
        barFill.style.background = "transparent";
        strengthText.textContent = "";
        return;
    }

    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    let width = ["10%", "25%", "50%", "75%", "100%"][score];
    let colors = ["red", "orange", "#c2b900", "green", "#0abf2a"];
    let labels = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];

    barFill.style.width = width;
    barFill.style.background = colors[score];
    strengthText.textContent = "Seguridad: " + labels[score];
});


  // --- VALIDACIÓN ---
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const termsAccepted = termsInput.checked;

    if (!name || !email || !password || !confirmPassword) {
      showAlert("Por favor, completa todos los campos", "error");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("El correo electrónico no es válido", "error");
      return;
    }

    if (password.length < 6) {
      showAlert("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Las contraseñas no coinciden", "error");
      return;
    }

    if (!termsAccepted) {
      showAlert("Debes aceptar los términos y condiciones", "error");
      return;
    }

    showAlert("Cuenta creada con éxito 🎉", "success");

    setTimeout(() => {
      window.location.href = "../dashboard/dashboard.html";
    }, 1500);
  });

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.style.display = "block";
    alertBox.style.padding = "12px";
    alertBox.style.marginTop = "16px";
    alertBox.style.borderRadius = "8px";
    alertBox.style.textAlign = "center";
    alertBox.style.fontWeight = "500";

    if (type === "error") {
      alertBox.style.backgroundColor = "#fee2e2";
      alertBox.style.color = "#b91c1c";
    } else {
      alertBox.style.backgroundColor = "#dcfce7";
      alertBox.style.color = "#15803d";
    }

    setTimeout(() => {
      alertBox.style.display = "none";
    }, 3000);
  }
});
