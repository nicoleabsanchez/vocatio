// Events page JavaScript - Full event management with inscriptions and calendar
;(() => {
  let enrolledEvents = JSON.parse(localStorage.getItem("enrolledEvents")) || []
  let eventToCancel = null // Variable para almacenar evento a cancelar

  function showToast(message, type = 'info') {
    console.log("[v0] showToast llamado:", message, type)
    
    const existingToast = document.querySelector('.toast-notification')
    if (existingToast) {
      existingToast.remove()
    }

    const toast = document.createElement('div')
    toast.className = `toast-notification toast-${type}`
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease;
      font-weight: 600;
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
      `
      document.head.appendChild(style)
    }
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  function getEventDataFromCard(eventCard) {
    const eventId = eventCard.getAttribute("data-event-id")
    const title = eventCard.querySelector("h3").textContent
    const description = eventCard.querySelector(".event-description").textContent
    const metaItems = eventCard.querySelectorAll(".meta-item span:nth-child(2)")
    
    // Extract date and time
    const dateTimeText = metaItems[0].textContent.trim()
    const dateParts = dateTimeText.match(/(\d{1,2})\s+de\s+(\w+),\s+(\d{4})\s+-\s+(\d{2}:\d{2})/)
    
    const months = {
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    }
    
    const day = dateParts ? parseInt(dateParts[1]) : 1
    const month = dateParts ? months[dateParts[2]] : 0
    const year = dateParts ? parseInt(dateParts[3]) : 2025
    const time = dateParts ? dateParts[4] : "00:00"
    
    const date = new Date(year, month, day)
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    
    const location = metaItems[1] ? metaItems[1].textContent : "Online"
    const participants = metaItems[2] ? metaItems[2].textContent : "0/0"
    
    const imageEl = eventCard.querySelector(".event-image-wrapper img")
    const image = imageEl ? imageEl.getAttribute("src") : ""
    
    const badgeEl = eventCard.querySelector(".event-badge")
    const type = badgeEl ? badgeEl.textContent : "Evento"
    
    const button = eventCard.querySelector(".btn")
    const isFull = button && button.textContent.trim() === "Evento Lleno"
    
    return {
      id: eventId,
      title,
      description,
      date: dateString,
      time,
      location,
      participants,
      image,
      type,
      day,
      isFull
    }
  }

  function initEvents() {
    const eventCards = document.querySelectorAll(".event-card-modern")
    
    eventCards.forEach((eventCard) => {
      eventCard.addEventListener("click", function (e) {
        const button = e.target.closest(".btn")
        if (!button) return
        
        e.preventDefault()
        e.stopPropagation()
        
        const eventId = eventCard.getAttribute("data-event-id")
        if (!eventId) return
        
        const event = getEventDataFromCard(eventCard)
        const buttonText = button.textContent.trim()
      
        
        if (buttonText === "Evento Lleno") {
          showToast("Este evento está lleno", "error")
          return
        }
        
        if (buttonText === "Inscrito ✓" || enrolledEvents.includes(event.id)) {
          showToast("Ya estás inscrito en este evento", "info")
          return
        }
        
        if (buttonText === "Inscribirse") {
          enrolledEvents.push(event.id)
          localStorage.setItem("enrolledEvents", JSON.stringify(enrolledEvents))
          
          updateButtonToEnrolled(button)
          highlightCalendarDate(event.day)
          updateMyEventsTab()
          
          showToast("¡Inscripción exitosa!", "success")
        }
      })
      
      const button = eventCard.querySelector(".btn")
      const eventId = eventCard.getAttribute("data-event-id")
      
      if (button && eventId && enrolledEvents.includes(eventId) && button.classList.contains("enroll-btn")) {
        updateButtonToEnrolled(button)
      }
    })

    initializeCalendar()
    updateMyEventsTab()
    initCancelModal()
  }

  function updateButtonToEnrolled(button) {
    button.textContent = "Inscrito ✓"
    button.classList.remove("btn-primary")
    button.classList.add("btn-secondary")
    button.style.backgroundColor = "var(--success)"
    button.style.color = "var(--white)"
    button.style.border = "none"
    button.style.cursor = "default"
    button.disabled = true
  }

  function updateButtonToNotEnrolled(button) {
    button.textContent = "Inscribirse"
    button.classList.remove("btn-secondary")
    button.classList.add("btn-primary", "enroll-btn")
    button.style.backgroundColor = ""
    button.style.color = ""
    button.style.border = ""
    button.style.cursor = "pointer"
    button.disabled = false
  }

  function highlightCalendarDate(day) {
    const calendars = document.querySelectorAll(".calendar-grid")
    calendars.forEach((calendar) => {
      const dayElements = calendar.querySelectorAll(".cal-day")
      dayElements.forEach((dayEl) => {
        if (Number.parseInt(dayEl.textContent) === day && !dayEl.classList.contains("empty")) {
          dayEl.classList.add("highlight")
          dayEl.style.backgroundColor = "var(--primary)"
          dayEl.style.color = "var(--white)"
          dayEl.style.fontWeight = "600"
        }
      })
    })
  }

  function initializeCalendar() {
    const proximosTab = document.getElementById("content-proximos")
    if (!proximosTab) return
    
    const eventCards = proximosTab.querySelectorAll(".event-card-modern[data-event-id]")
    
    enrolledEvents.forEach((eventId) => {
      // Find the event card in the DOM
      const eventCard = Array.from(eventCards).find(card => 
        card.getAttribute("data-event-id") === eventId
      )
      
      if (eventCard) {
        const event = getEventDataFromCard(eventCard)
        highlightCalendarDate(event.day)
      }
    })
  }

  function updateMyEventsTab() {
    const myEventsContent = document.getElementById("content-mis-eventos")
    if (!myEventsContent) return

    const eventsMain = myEventsContent.querySelector(".events-main")

    if (enrolledEvents.length === 0) {
      eventsMain.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <rect x="20" y="30" width="80" height="70" rx="8" stroke="#7C3AED" stroke-width="3" fill="none"/>
              <line x1="20" y1="45" x2="100" y2="45" stroke="#7C3AED" stroke-width="3"/>
              <circle cx="35" cy="37.5" r="3" fill="#7C3AED"/>
              <circle cx="50" cy="37.5" r="3" fill="#7C3AED"/>
            </svg>
          </div>
          <h2>No tienes eventos próximos</h2>
          <p>Inscríbete a eventos para verlos aquí y recibir recordatorios.</p>
        </div>
      `
    } else {
      const eventsGrid = document.createElement("div")
      eventsGrid.className = "events-grid"

      const proximosTab = document.getElementById("content-proximos")
      const eventCards = proximosTab ? proximosTab.querySelectorAll(".event-card-modern[data-event-id]") : []

      enrolledEvents.forEach((eventId) => {
        // Find the event card in the DOM
        const sourceCard = Array.from(eventCards).find(card => 
          card.getAttribute("data-event-id") === eventId
        )
        
        if (!sourceCard) return
        
        const event = getEventDataFromCard(sourceCard)

        const eventCard = document.createElement("article")
        eventCard.className = "event-card-modern"
        eventCard.setAttribute("data-event-id", event.id)
        eventCard.innerHTML = `
          <div class="event-image-wrapper">
            <img src="${event.image}" alt="${event.title}">
            <span class="event-badge badge-talk">${event.type}</span>
          </div>
          <div class="event-content">
            <h3>${event.title}</h3>
            <p class="event-description">${event.description}</p>
            <div class="event-meta">
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span>${formatDate(event.date)} - ${event.time}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📍</span>
                <span>${event.location}</span>
              </div>
            </div>
            <button class="btn btn-secondary btn-block cancel-enrollment-btn" data-event-id="${event.id}">
              Anular inscripción
            </button>
          </div>
        `
        eventsGrid.appendChild(eventCard)
      })

      eventsMain.innerHTML = ""
      eventsMain.appendChild(eventsGrid)

      const cancelButtons = eventsMain.querySelectorAll(".cancel-enrollment-btn")
      cancelButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const eventId = this.getAttribute("data-event-id")
          showCancelModal(eventId)
        })
      })
    }
  }

  function showCancelModal(eventId) {
    eventToCancel = eventId
    const modal = document.getElementById("cancel-modal")
    if (modal) {
      modal.style.display = "flex"
    }
  }

  function hideCancelModal() {
    const modal = document.getElementById("cancel-modal")
    if (modal) {
      modal.style.display = "none"
    }
    eventToCancel = null
  }

  function initCancelModal() {
    const cancelYes = document.getElementById("cancel-yes")
    const cancelNo = document.getElementById("cancel-no")
    const modal = document.getElementById("cancel-modal")

    if (cancelYes) {
      cancelYes.addEventListener("click", () => {
        if (eventToCancel) {
          confirmCancelEnrollment(eventToCancel)
        }
        hideCancelModal()
      })
    }

    if (cancelNo) {
      cancelNo.addEventListener("click", hideCancelModal)
    }

    // Cerrar modal al hacer click fuera de él
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          hideCancelModal()
        }
      })
    }
  }

  function confirmCancelEnrollment(eventId) {
    const proximosTab = document.getElementById("content-proximos")
    const eventCards = proximosTab ? proximosTab.querySelectorAll(".event-card-modern[data-event-id]") : []
    const sourceCard = Array.from(eventCards).find(card => 
      card.getAttribute("data-event-id") === eventId
    )
    
    if (!sourceCard) return
    
    const event = getEventDataFromCard(sourceCard)

    enrolledEvents = enrolledEvents.filter((id) => id !== eventId)
    localStorage.setItem("enrolledEvents", JSON.stringify(enrolledEvents))

    const button = sourceCard.querySelector(".btn")
    if (button) {
      updateButtonToNotEnrolled(button)
    }

    removeCalendarHighlight(event.day)
    updateMyEventsTab()

    showToast("Inscripción cancelada", "info")
  }

  function removeCalendarHighlight(day) {
    const proximosTab = document.getElementById("content-proximos")
    const eventCards = proximosTab ? proximosTab.querySelectorAll(".event-card-modern[data-event-id]") : []
    
    const otherEventsOnSameDay = enrolledEvents.some((eventId) => {
      const sourceCard = Array.from(eventCards).find(card => 
        card.getAttribute("data-event-id") === eventId
      )
      
      if (!sourceCard) return false
      
      const event = getEventDataFromCard(sourceCard)
      return event.day === day
    })

    if (!otherEventsOnSameDay) {
      const calendars = document.querySelectorAll(".calendar-grid")
      calendars.forEach((calendar) => {
        const dayElements = calendar.querySelectorAll(".cal-day")
        dayElements.forEach((dayEl) => {
          if (Number.parseInt(dayEl.textContent) === day && !dayEl.classList.contains("empty")) {
            dayEl.classList.remove("highlight")
            dayEl.style.backgroundColor = ""
            dayEl.style.color = ""
            dayEl.style.fontWeight = ""
          }
        })
      })
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ]
    return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEvents)
  } else {
    initEvents()
  }
})()
