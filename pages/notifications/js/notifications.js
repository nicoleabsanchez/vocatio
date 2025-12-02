// Notifications page JavaScript - Mark as read, filtering, delete, and configuration
; (() => {
  function initNotifications() {
    const notifications = document.querySelectorAll(".notification-item")

    // Marcar notificación como leída
    document.querySelectorAll(".btn-mark-read").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()
        const notificationItem = this.closest(".notification-item")
        notificationItem.classList.remove("unread")
        notificationItem.style.backgroundColor = "var(--white)"
        notificationItem.style.borderLeft = "3px solid var(--gray-light)"
        this.style.display = "none"
        updateUnreadCount()
      })
    })

    // Eliminar notificación individual
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()
        const notificationItem = this.closest(".notification-item")
        notificationItem.style.animation = "fadeOut 0.3s ease"
        setTimeout(() => {
          notificationItem.remove()
          updateUnreadCount()
          const remainingNotifications = document.querySelectorAll(".notification-item")
          if (remainingNotifications.length === 0) {
            showEmptyState("todas")
          }
        }, 300)
      })
    })

    // Filtros de notificaciones
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach((b) => {
          b.classList.remove("active")
          b.style.backgroundColor = "transparent"
          b.style.color = "var(--gray)"
        })

        this.classList.add("active")
        this.style.backgroundColor = "var(--primary)"
        this.style.color = "var(--white)"

        const filterType = this.textContent.trim().toLowerCase()

        notifications.forEach((notification) => {
          const title = notification.querySelector("h3").textContent.toLowerCase()
          const icon = notification.querySelector(".notification-icon").textContent
          let shouldShow = false

          if (filterType === "todas") {
            shouldShow = true
          } else if (filterType === "no leídas") {
            shouldShow = notification.classList.contains("unread")
          } else if (filterType === "eventos") {
            shouldShow = icon.includes("📅") || title.includes("evento") || title.includes("charla")
          } else if (filterType === "resultados") {
            shouldShow = icon.includes("📊") || icon.includes("⭐") || icon.includes("🎯") ||
              title.includes("resultado") || title.includes("perfil") || title.includes("test")
          } else if (filterType === "sistema") {
            shouldShow = icon.includes("🔔") || icon.includes("💬") || icon.includes("📚") ||
              title.includes("actualización") || title.includes("material") || title.includes("soporte")
          }

          if (shouldShow) {
            notification.style.display = "flex"
            notification.style.animation = "fadeIn 0.3s ease"
          } else {
            notification.style.display = "none"
          }
        })

        const visibleNotifications = Array.from(notifications).filter((n) => n.style.display !== "none")
        if (visibleNotifications.length === 0) {
          showEmptyState(filterType)
        } else {
          removeEmptyState()
        }
      })
    })

    // Configuración modal
    const btnSettings = document.getElementById("btn-settings")
    if (btnSettings) {
      btnSettings.addEventListener("click", showConfigModal)
    }

    const modalClose = document.getElementById("modal-close")
    const cancelConfig = document.getElementById("cancel-config")
    if (modalClose) modalClose.addEventListener("click", hideConfigModal)
    if (cancelConfig) cancelConfig.addEventListener("click", hideConfigModal)

    const saveConfig = document.getElementById("save-config")
    if (saveConfig) {
      saveConfig.addEventListener("click", saveNotificationPreferences)
    }

    const modal = document.getElementById("config-modal")
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) hideConfigModal()
      })
    }

    loadNotificationPreferences()
    updateUnreadCount()
  }

  function updateUnreadCount() {
    const unreadCount = document.querySelectorAll(".notification-item.unread").length
    console.log("[v0] Unread notifications:", unreadCount)
  }

  function showEmptyState(filterType) {
    const notificationsList = document.querySelector(".notifications-list")
    const existingEmpty = document.querySelector(".empty-state")
    if (existingEmpty) existingEmpty.remove()

    const emptyState = document.createElement("div")
    emptyState.className = "empty-state"
    emptyState.style.cssText = "text-align: center; padding: 3rem; color: var(--gray);"

    let message = ""
    if (filterType === "desactivadas") {
      message = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔕</div>
        <h3>Notificaciones desactivadas</h3>
        <p>Has desactivado todas las notificaciones. Actívalas desde la configuración.</p>
      `
    } else {
      message = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
        <h3>No hay notificaciones</h3>
        <p>No tienes notificaciones de tipo "${filterType}"</p>
      `
    }

    emptyState.innerHTML = message
    notificationsList.parentNode.insertBefore(emptyState, notificationsList.nextSibling)
  }

  function removeEmptyState() {
    const emptyState = document.querySelector(".empty-state")
    if (emptyState) emptyState.remove()
  }

  function showConfigModal() {
    const modal = document.getElementById("config-modal")
    if (modal) modal.style.display = "flex"
  }

  function hideConfigModal() {
    const modal = document.getElementById("config-modal")
    if (modal) modal.style.display = "none"
  }

  function saveNotificationPreferences() {
    const enabled = document.getElementById("notifications-enabled").checked
    const types = []
    const frequency = document.querySelector('input[name="frequency"]:checked').value

    document.querySelectorAll('input[name="notif-type"]:checked').forEach(checkbox => {
      types.push(checkbox.value)
    })

    const preferences = { enabled, types, frequency }
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences))

    if (!enabled) {
      hideAllNotifications()
    } else {
      deleteUnwantedNotifications(types)
      showAllNotifications()
    }

    hideConfigModal()
    showToast('Preferencias guardadas correctamente', 'success')
  }

  function hideAllNotifications() {
    const notificationsList = document.querySelector('.notifications-list')
    if (notificationsList) {
      notificationsList.style.display = 'none'
      showEmptyState('desactivadas')
    }
  }

  function showAllNotifications() {
    const notificationsList = document.querySelector('.notifications-list')
    const emptyState = document.querySelector('.empty-state')

    if (notificationsList) notificationsList.style.display = 'block'
    if (emptyState && emptyState.textContent.includes('desactivadas')) {
      emptyState.remove()
    }
  }

  function deleteUnwantedNotifications(selectedTypes) {
    const notifications = document.querySelectorAll('.notification-item')

    notifications.forEach(notification => {
      const icon = notification.querySelector('.notification-icon').textContent
      const title = notification.querySelector('h3').textContent.toLowerCase()

      let notificationType = null

      if (icon.includes('📅') || title.includes('evento') || title.includes('charla')) {
        notificationType = 'eventos'
      } else if (icon.includes('📊') || icon.includes('⭐') || icon.includes('🎯') ||
        title.includes('resultado') || title.includes('perfil') || title.includes('test')) {
        notificationType = 'resultados'
      } else if (icon.includes('📚') || title.includes('material')) {
        notificationType = 'materiales'
      } else if (icon.includes('🔔') || icon.includes('💬') ||
        title.includes('actualización') || title.includes('soporte')) {
        notificationType = 'sistema'
      }

      if (notificationType && !selectedTypes.includes(notificationType)) {
        notification.style.animation = 'fadeOut 0.3s ease'
        setTimeout(() => {
          notification.remove()
          updateUnreadCount()

          const remainingNotifications = document.querySelectorAll('.notification-item')
          if (remainingNotifications.length === 0) {
            showEmptyState('todas')
          }
        }, 300)
      }
    })
  }

  function loadNotificationPreferences() {
    const preferences = JSON.parse(localStorage.getItem('notificationPreferences') || '{}')

    const enabledCheckbox = document.getElementById('notifications-enabled')
    if (enabledCheckbox && preferences.enabled !== undefined) {
      enabledCheckbox.checked = preferences.enabled
      if (!preferences.enabled) hideAllNotifications()
    }

    if (preferences.types) {
      document.querySelectorAll('input[name="notif-type"]').forEach(checkbox => {
        checkbox.checked = preferences.types.includes(checkbox.value)
      })
    }

    if (preferences.frequency) {
      const frequencyRadio = document.querySelector(`input[name="frequency"][value="${preferences.frequency}"]`)
      if (frequencyRadio) frequencyRadio.checked = true
    }
  }

  function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast-notification')
    if (existingToast) existingToast.remove()

    const toast = document.createElement('div')
    toast.className = `toast-notification toast-${type}`
    toast.textContent = message
    toast.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
      color: white; padding: 16px 24px; border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000;
      animation: slideIn 0.3s ease; font-weight: 600;
    `

    const style = document.createElement('style')
    if (!document.getElementById('toast-animations')) {
      style.id = 'toast-animations'
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(400px); opacity: 0; }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications)
  } else {
    initNotifications()
  }

  console.log('[v0] Notifications module loaded')
})()
