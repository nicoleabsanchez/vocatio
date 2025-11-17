document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ forgotPassword.js cargado correctamente");

  const form = document.getElementById("forgotForm");
  const emailInput = document.getElementById("email");
  const alertBox = document.getElementById("alert-box");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      showAlert("Por favor, ingresa tu correo", "error");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("El correo no es válido", "error");
      return;
    }

    showAlert("Enlace de recuperación enviado 🎉", "success");

    setTimeout(() => {
      window.location.href = "login.html";
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
