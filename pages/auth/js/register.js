document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ register.js cargado correctamente");

  const form = document.getElementById("registerForm");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const termsInput = document.getElementById("terms");

  const alertBox = document.getElementById("alert-box");

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
