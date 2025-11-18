document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ profile.js cargado correctamente");

    const form = document.getElementById("profileForm");
    const saveBtn = document.querySelector(".profile-edit-btn");
    const alertBox = document.getElementById("alert-box");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const birthdateInput = document.getElementById("birthdate");

    const topName = document.querySelector(".profile-info-text h2");
    const topEmail = document.querySelector(".profile-email");

    loadProfileData();

    let initialValues = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        birthdate: birthdateInput.value.trim()
    };

    saveBtn.addEventListener("click", (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const birthdate = birthdateInput.value.trim();

        if (!name || !email || !phone || !birthdate) {
            showAlert("Por favor, completa todos los campos", "error");
            return;
        }

        if (!validateEmail(email)) {
            showAlert("El correo electrónico no es válido", "error");
            return;
        }

        const changed =
            name !== initialValues.name ||
            email !== initialValues.email ||
            phone !== initialValues.phone ||
            birthdate !== initialValues.birthdate;

        if (!changed) {
            showAlert("No se detectaron cambios en los datos", "error");
            return;
        }

        topName.textContent = name;
        topEmail.textContent = email;

        const profileData = {
            name,
            email,
            phone,
            birthdate
        };

        localStorage.setItem("profileData", JSON.stringify(profileData));

        initialValues = { ...profileData };

        showAlert("Datos actualizados correctamente 🎉", "success");
    });

    function loadProfileData() {
        const storedData = localStorage.getItem("profileData");

        if (!storedData) return; 

        const data = JSON.parse(storedData);

        nameInput.value = data.name;
        emailInput.value = data.email;
        phoneInput.value = data.phone;
        birthdateInput.value = data.birthdate;

        topName.textContent = data.name;
        topEmail.textContent = data.email;
    }

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
