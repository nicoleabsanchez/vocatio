// Notifications page JavaScript - Mark as read and filtering
;(() => {
    // Función principal: inicializa todos los eventos y lógica de la página
  function initNotifications() {
        // DOM: selecciona todas las notificaciones
    const notifications = document.querySelectorAll(".notification-item")

    // EVENTO: marcar notificación como leída
    document.querySelectorAll(".btn-icon").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()

        // DOM: obtiene el contenedor de la notificación asociada
        const notificationItem = this.closest(".notification-item")
        
        // MANIPULACIÓN DOM: cambia clases y estilos al marcar como leída
        notificationItem.classList.remove("unread")
        notificationItem.style.backgroundColor = "var(--white)"
        notificationItem.style.borderLeft = "3px solid var(--gray-light)"
        this.style.display = "none"

        // Actualiza contador de no leídas
        updateUnreadCount()
      })
    })

    // EVENTO: filtros de notificaciones
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        // DOM: remueve estilo activo de todos los filtros
        document.querySelectorAll(".filter-btn").forEach((b) => {
          b.classList.remove("active")
          b.style.backgroundColor = "transparent"
          b.style.color = "var(--gray)"
        })

        // DOM: aplica estilo al botón activo
        this.classList.add("active")
        this.style.backgroundColor = "var(--primary)"
        this.style.color = "var(--white)"

        const filterType = this.textContent.trim().toLowerCase()

        // Filtrado de notificaciones
        notifications.forEach((notification) => {
          const title = notification.querySelector("h3").textContent.toLowerCase()
          const icon = notification.querySelector(".notification-icon").textContent

          let shouldShow = false

        // VALIDACIONES SEGÚN FILTRO
          if (filterType === "todas") {
            shouldShow = true
          } else if (filterType === "no leídas") {
            shouldShow = notification.classList.contains("unread")
          } else if (filterType === "eventos") {
            shouldShow = icon.includes("📅") || title.includes("evento") || title.includes("charla")
          } else if (filterType === "resultados") {
            shouldShow =
              icon.includes("📊") ||
              icon.includes("⭐") ||
              icon.includes("🎯") ||
              title.includes("resultado") ||
              title.includes("perfil") ||
              title.includes("test")
          } else if (filterType === "sistema") {
            shouldShow =
              icon.includes("🔔") ||
              icon.includes("💬") ||
              icon.includes("📚") ||
              title.includes("actualización") ||
              title.includes("material") ||
              title.includes("soporte")
          }

          // MANIPULACIÓN DOM: mostrar u ocultar notificaciones
          if (shouldShow) {
            notification.style.display = "flex"
            notification.style.animation = "fadeIn 0.3s ease"
          } else {
            notification.style.display = "none"
          }
        })

        // Validación: si no hay resultados visibles → mostrar estado vacío
        const visibleNotifications = Array.from(notifications).filter((n) => n.style.display !== "none")
        if (visibleNotifications.length === 0) {
          showEmptyState(filterType)
        } else {
          removeEmptyState()
        }
      })
    })

    // Inicializa contador de no leídas
    updateUnreadCount()
  }

      // FUNCIONALIDAD: contar notificaciones no leídas
  function updateUnreadCount() {
    const unreadCount = document.querySelectorAll(".notification-item.unread").length
    console.log("[v0] Unread notifications:", unreadCount)
  }
      // DOM: muestra mensaje cuando no hay notificaciones en un filtro
  function showEmptyState(filterType) {
    if (document.querySelector(".empty-notifications-state")) return

    const notificationsList = document.querySelector(".notifications-list")
    const emptyState = document.createElement("div")
    emptyState.className = "empty-notifications-state"
    emptyState.style.cssText = `
      text-align: center;
      padding: 3rem;
      color: var(--gray);
    `
    emptyState.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
      <h3>No hay notificaciones</h3>
      <p>No tienes notificaciones de tipo "${filterType}"</p>
    `
    notificationsList.appendChild(emptyState)
  }

  function removeEmptyState() {
    const emptyState = document.querySelector(".empty-notifications-state")
    if (emptyState) emptyState.remove()
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNotifications)
  } else {
    initNotifications()
  }

  console.log("[v0] Notifications module loaded")
})()
