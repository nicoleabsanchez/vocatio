document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ login.js cargado correctamente");

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const alertBox = document.getElementById("alert-box");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showAlert("Por favor, completa todos los campos", "error");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("El correo no es válido", "error");
      return;
    }

    if (password.length < 6) {
      showAlert("Revise su contraseña e intente de nuevo", "error");
      return;
    }

    showAlert("Inicio de sesión exitoso 🎉", "success");

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
