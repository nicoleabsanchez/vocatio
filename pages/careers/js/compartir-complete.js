// Compartir Resultados - Funcionalidad Mejorada
// Sistema de temas mejorado con más opciones
const themes = {
  purple: {
    primary: "#693efe",
    secondary: "#7e7af7",
    light: "#f9f8ff",
    border: "#d9d4ff",
    gradient: "linear-gradient(135deg, #693efe 0%, #7e7af7 100%)"
  },
  blue: {
    primary: "#2563eb",
    secondary: "#3b82f6",
    light: "#eff6ff",
    border: "#bfdbfe",
    gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)"
  },
  green: {
    primary: "#059669",
    secondary: "#10b981",
    light: "#f0fdf4",
    border: "#bbf7d0",
    gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)"
  },
  orange: {
    primary: "#ea580c",
    secondary: "#f97316",
    light: "#fff7ed",
    border: "#fed7aa",
    gradient: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)"
  },
  pink: {
    primary: "#db2777",
    secondary: "#ec4899",
    light: "#fdf2f8",
    border: "#fbcfe8",
    gradient: "linear-gradient(135deg, #db2777 0%, #ec4899 100%)"
  },
};

// Estado de la aplicación
let appState = {
  currentTheme: "purple",
  customTitle: "",
  customMessage: "",
  showDate: true,
  resultsData: {
    tecnologia: 0,
    ciencias: 0,
    arte: 0,
    negocios: 0,
    social: 0
  },
  careers: [],
  testDate: null
};

// Aplicar tema con animación suave
function applyTheme(theme) {
  const colors = themes[theme];
  appState.currentTheme = theme;
  
  // Aplicar estilos a los elementos con transición
  document.querySelectorAll(".result-item").forEach((item, index) => {
    setTimeout(() => {
      item.style.backgroundColor = colors.light;
      item.style.borderColor = colors.border;
      item.style.transition = "all 0.3s ease";
    }, index * 50);
  });
  
  document.querySelectorAll(".result-name").forEach((name) => {
    name.style.color = colors.primary;
  });
  
  document.querySelectorAll(".result-percentage").forEach((p) => {
    p.style.color = colors.secondary;
  });
  
  document.querySelectorAll(".preview-btn, .download-btn").forEach((btn) => {
    if (!btn.id.includes('Pdf')) {
      btn.style.background = colors.gradient;
      btn.style.borderColor = colors.primary;
    }
  });
  
  // Guardar preferencia en localStorage
  localStorage.setItem('vocatioShareTheme', theme);
}

// Sistema de notificaciones toast mejorado
function showToast(message, type = 'success', duration = 3000) {
  const toast = document.getElementById('toast');
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };
  
  toast.style.background = colors[type] || colors.success;
  toast.innerHTML = `${icons[type] || '✓'} ${message}`;
  toast.style.display = 'block';
  toast.style.animation = 'slideUp 0.3s ease';
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, duration);
}

// Generar vista previa mejorada
function generatePreview() {
  const previewContainer = document.getElementById("previewContainer");
  const colors = themes[appState.currentTheme];
  
  // Crear card de preview con estructura mejorada
  const previewCard = document.createElement("div");
  previewCard.style.cssText = `
    background: white;
    border-radius: 24px;
    padding: 48px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    max-width: 800px;
    margin: 0 auto;
  `;
  
  // Logo
  const logoEl = document.createElement("div");
  logoEl.textContent = "vocatio";
  logoEl.style.cssText = `
    font-size: 48px;
    font-weight: 700;
    background: ${colors.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 24px;
    text-align: center;
  `;
  previewCard.appendChild(logoEl);
  
  // Título personalizado
  const titleEl = document.createElement("h2");
  titleEl.textContent = appState.customTitle || "¡Descubrí mi vocación!";
  titleEl.style.cssText = `
    font-size: 32px;
    font-weight: 700;
    color: #1b1b1b;
    margin-bottom: 20px;
    text-align: center;
    line-height: 1.3;
  `;
  previewCard.appendChild(titleEl);
  
  // Grid de resultados
  const resultsGrid = document.createElement("div");
  resultsGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin: 32px 0;
  `;
  
  const results = [
    { emoji: "💻", name: "Tecnología", percentage: appState.resultsData.tecnologia },
    { emoji: "🔬", name: "Ciencias", percentage: appState.resultsData.ciencias },
    { emoji: "🎨", name: "Arte", percentage: appState.resultsData.arte },
    { emoji: "💼", name: "Negocios", percentage: appState.resultsData.negocios },
    { emoji: "🤝", name: "Social", percentage: appState.resultsData.social }
  ];
  
  results.forEach((result) => {
    const item = document.createElement("div");
    item.style.cssText = `
      background: ${colors.light};
      border: 3px solid ${colors.border};
      border-radius: 16px;
      padding: 24px 16px;
      text-align: center;
      transition: transform 0.3s ease;
    `;
    item.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 12px;">${result.emoji}</div>
      <div style="font-size: 18px; font-weight: 700; color: ${colors.primary}; margin-bottom: 8px;">${result.name}</div>
      <div style="font-size: 16px; color: ${colors.secondary}; font-weight: 600;">${result.percentage}%</div>
    `;
    resultsGrid.appendChild(item);
  });
  previewCard.appendChild(resultsGrid);
  
  // Fecha
  if (appState.showDate && appState.testDate) {
    const dateEl = document.createElement("div");
    dateEl.textContent = `Realizado el ${appState.testDate}`;
    dateEl.style.cssText = `
      text-align: center;
      color: ${colors.secondary};
      font-size: 14px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid ${colors.border};
    `;
    previewCard.appendChild(dateEl);
  }
  
  // Mensaje personalizado
  if (appState.customMessage) {
    const messageEl = document.createElement("p");
    messageEl.textContent = appState.customMessage;
    messageEl.style.cssText = `
      font-size: 16px;
      color: #67666f;
      margin-top: 24px;
      text-align: center;
      line-height: 1.8;
      padding: 20px;
      background: ${colors.light};
      border-radius: 12px;
      border-left: 4px solid ${colors.primary};
    `;
    previewCard.appendChild(messageEl);
  }
  
  // Carreras recomendadas en preview
  if (appState.careers && appState.careers.length > 0) {
    const careersSection = document.createElement("div");
    careersSection.style.cssText = `
      margin-top: 24px;
      padding: 20px;
      background: ${colors.light};
      border-radius: 12px;
    `;
    
    const careersTitle = document.createElement("h3");
    careersTitle.textContent = "Carreras Recomendadas";
    careersTitle.style.cssText = `
      font-size: 18px;
      font-weight: 700;
      color: ${colors.primary};
      margin-bottom: 12px;
      text-align: center;
    `;
    careersSection.appendChild(careersTitle);
    
    const careersList = document.createElement("div");
    careersList.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    `;
    
    appState.careers.slice(0, 5).forEach(career => {
      const careerBadge = document.createElement("span");
      careerBadge.textContent = career;
      careerBadge.style.cssText = `
        background: white;
        color: ${colors.primary};
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        border: 2px solid ${colors.border};
      `;
      careersList.appendChild(careerBadge);
    });
    
    careersSection.appendChild(careersList);
    previewCard.appendChild(careersSection);
  }
  
  // Hashtags
  const hashtagsEl = document.createElement("div");
  hashtagsEl.textContent = "#Vocatio #TestVocacional #MiVocación";
  hashtagsEl.style.cssText = `
    text-align: center;
    color: ${colors.primary};
    font-size: 14px;
    margin-top: 24px;
    font-weight: 600;
  `;
  previewCard.appendChild(hashtagsEl);
  
  previewContainer.innerHTML = "";
  previewContainer.appendChild(previewCard);
  document.getElementById("previewModal").classList.add("active");
}

// Generar y descargar imagen mejorada
async function downloadImage() {
  const btn = document.getElementById('downloadBtn');
  const originalText = btn.textContent;
  btn.textContent = "⏳ Generando imagen...";
  btn.disabled = true;
  
  try {
    const tempDiv = document.createElement("div");
    tempDiv.style.cssText = "position:fixed;left:-9999px;top:0;";
    document.body.appendChild(tempDiv);
    
    const colors = themes[appState.currentTheme];
    const card = createDownloadCard(colors, 1200);
    tempDiv.appendChild(card);
    
    const canvas = await html2canvas(card, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      width: 1200,
      useCORS: true,
      allowTaint: true
    });
    
    document.body.removeChild(tempDiv);
    
    const link = document.createElement("a");
    const timestamp = new Date().getTime();
    link.download = `vocatio-resultados-${timestamp}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    
    btn.textContent = "✅ ¡Descargado!";
    showToast("Imagen descargada exitosamente", "success");
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
  } catch (error) {
    console.error("Error al generar imagen:", error);
    btn.textContent = "❌ Error";
    showToast("Error al generar la imagen", "error");
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
  }
}

// Generar y descargar PDF
async function downloadPDF() {
  const btn = document.getElementById('downloadPdfBtn');
  const originalText = btn.textContent;
  btn.textContent = "⏳ Generando PDF...";
  btn.disabled = true;
  
  try {
    // Importar jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const colors = themes[appState.currentTheme];
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Fondo con gradiente
    doc.setFillColor(249, 248, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(105, 62, 254);
    doc.text('vocatio', pageWidth / 2, 30, { align: 'center' });
    
    // Título
    doc.setFontSize(20);
    doc.setTextColor(27, 27, 27);
    const title = appState.customTitle || "¡Descubrí mi vocación!";
    doc.text(title, pageWidth / 2, 45, { align: 'center' });
    
    // Fecha
    if (appState.showDate && appState.testDate) {
      doc.setFontSize(11);
      doc.setTextColor(139, 138, 146);
      doc.text(`Realizado el ${appState.testDate}`, pageWidth / 2, 55, { align: 'center' });
    }
    
    // Resultados
    let yPos = 70;
    doc.setFontSize(16);
    doc.setTextColor(105, 62, 254);
    doc.text('Áreas de Mayor Afinidad', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 10;
    const results = [
      { emoji: "💻", name: "Tecnología", percentage: appState.resultsData.tecnologia },
      { emoji: "🔬", name: "Ciencias", percentage: appState.resultsData.ciencias },
      { emoji: "🎨", name: "Arte", percentage: appState.resultsData.arte },
      { emoji: "💼", name: "Negocios", percentage: appState.resultsData.negocios },
      { emoji: "🤝", name: "Social", percentage: appState.resultsData.social }
    ];
    
    results.forEach((result, index) => {
      doc.setFillColor(249, 248, 255);
      doc.roundedRect(20, yPos, pageWidth - 40, 18, 3, 3, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(69, 68, 76);
      doc.text(`${result.emoji} ${result.name}`, 25, yPos + 7);
      
      doc.setFontSize(16);
      doc.setTextColor(105, 62, 254);
      doc.setFont('helvetica', 'bold');
      doc.text(`${result.percentage}%`, pageWidth - 25, yPos + 7, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      
      // Barra de progreso
      const barWidth = (pageWidth - 50) * (result.percentage / 100);
      doc.setFillColor(105, 62, 254);
      doc.roundedRect(25, yPos + 11, barWidth, 3, 1.5, 1.5, 'F');
      
      yPos += 23;
    });
    
    // Mensaje personalizado
    if (appState.customMessage) {
      yPos += 5;
      doc.setFontSize(12);
      doc.setTextColor(103, 102, 111);
      const lines = doc.splitTextToSize(appState.customMessage, pageWidth - 50);
      doc.text(lines, pageWidth / 2, yPos, { align: 'center' });
      yPos += lines.length * 7;
    }
    
    // Carreras recomendadas
    if (appState.careers && appState.careers.length > 0) {
      yPos += 10;
      doc.setFontSize(16);
      doc.setTextColor(105, 62, 254);
      doc.text('Carreras Recomendadas', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;
      
      appState.careers.slice(0, 6).forEach((career, index) => {
        doc.setFontSize(12);
        doc.setTextColor(69, 68, 76);
        doc.text(`• ${career}`, 25, yPos);
        yPos += 8;
        
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = 30;
        }
      });
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(139, 138, 146);
    doc.text('#Vocatio #TestVocacional #MiVocación', pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text('www.vocatio.com', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Guardar PDF
    const timestamp = new Date().getTime();
    doc.save(`vocatio-resultados-${timestamp}.pdf`);
    
    btn.textContent = "✅ ¡Descargado!";
    showToast("PDF descargado exitosamente", "success");
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    btn.textContent = "❌ Error";
    showToast("Error al generar el PDF", "error");
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
  }
}

// Crear card para descarga
function createDownloadCard(colors, width) {
  const card = document.createElement("div");
  card.style.cssText = `
    background: white;
    width: ${width}px;
    padding: 60px;
    font-family: 'Inter', sans-serif;
  `;
  
  const logo = document.createElement("div");
  logo.textContent = "vocatio";
  logo.style.cssText = `
    font-size: 52px;
    font-weight: 700;
    color: ${colors.primary};
    margin-bottom: 25px;
    text-align: center;
  `;
  card.appendChild(logo);
  
  const title = document.createElement("h2");
  title.textContent = appState.customTitle || "¡Descubrí mi vocación!";
  title.style.cssText = `
    font-size: 36px;
    font-weight: 700;
    color: #1b1b1b;
    margin-bottom: 20px;
    text-align: center;
  `;
  card.appendChild(title);
  
  const grid = document.createElement("div");
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 30px 0;
  `;
  
  const results = [
    { emoji: "💻", name: "Tecnología", percentage: appState.resultsData.tecnologia },
    { emoji: "🔬", name: "Ciencias", percentage: appState.resultsData.ciencias },
    { emoji: "🎨", name: "Arte", percentage: appState.resultsData.arte },
    { emoji: "💼", name: "Negocios", percentage: appState.resultsData.negocios },
    { emoji: "🤝", name: "Social", percentage: appState.resultsData.social }
  ];
  
  results.forEach((result) => {
    const item = document.createElement("div");
    item.style.cssText = `
      background: ${colors.light};
      border: 3px solid ${colors.border};
      border-radius: 15px;
      padding: 30px;
      text-align: center;
    `;
    item.innerHTML = `
      <div style="font-size: 52px; margin-bottom: 10px;">${result.emoji}</div>
      <div style="font-size: 26px; font-weight: 700; color: ${colors.primary}; margin-bottom: 8px;">${result.name}</div>
      <div style="font-size: 20px; color: ${colors.secondary}; font-weight: 600;">${result.percentage}%</div>
    `;
    grid.appendChild(item);
  });
  card.appendChild(grid);
  
  if (appState.showDate && appState.testDate) {
    const date = document.createElement("div");
    date.textContent = `Realizado el ${appState.testDate}`;
    date.style.cssText = `
      text-align: center;
      color: ${colors.secondary};
      font-size: 16px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid ${colors.border};
    `;
    card.appendChild(date);
  }
  
  if (appState.customMessage) {
    const message = document.createElement("p");
    message.textContent = appState.customMessage;
    message.style.cssText = `
      font-size: 18px;
      color: #67666f;
      margin-top: 25px;
      text-align: center;
      line-height: 1.6;
      padding: 20px;
      background: ${colors.light};
      border-radius: 10px;
    `;
    card.appendChild(message);
  }
  
  const hashtags = document.createElement("div");
  hashtags.textContent = "#Vocatio #TestVocacional #MiVocación";
  hashtags.style.cssText = `
    text-align: center;
    color: ${colors.primary};
    font-size: 16px;
    margin-top: 25px;
    font-weight: 600;
  `;
  card.appendChild(hashtags);
  
  return card;
}

// Copiar enlace al portapapeles
async function copyLink() {
  try {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    showToast("Enlace copiado al portapapeles", "success");
  } catch (error) {
    // Fallback para navegadores antiguos
    const textarea = document.createElement('textarea');
    textarea.value = window.location.href;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast("Enlace copiado al portapapeles", "success");
  }
}

// Obtener URL para compartir en redes sociales
function getShareUrl(network) {
  const pageUrl = encodeURIComponent(window.location.href);
  const title = appState.customTitle || "¡Mira mis resultados del test vocacional!";
  const message = appState.customMessage || "Descubrí mis áreas de mayor afinidad vocacional";
  const text = encodeURIComponent(`${title} ${message} en Vocatio 💻🔬🎨 #Vocatio #TestVocacional`);
  
  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
    whatsapp: `https://wa.me/?text=${text}%20${pageUrl}`
  };
  
  return urls[network];
}

// Cargar datos del test vocacional mejorado
function cargarDatosDelTest() {
  // Intentar múltiples fuentes de datos
  const sources = [
    'vocatioTestResults',
    'vocatioTestResults_old',
    'vocatioResults',
    'vocatioResults_old'
  ];
  
  let data = null;
  for (const source of sources) {
    const raw = localStorage.getItem(source);
    if (raw) {
      try {
        data = JSON.parse(raw);
        if (data) break;
      } catch (e) {
        continue;
      }
    }
  }
  
  // Normalizar categorías
  const canonical = {
    tecnologia: "tecnologia",
    tecnología: "tecnologia",
    technology: "tecnologia",
    ciencias: "ciencias",
    science: "ciencias",
    arte: "arte",
    "arte y diseño": "arte",
    innovacion: "arte",
    innovación: "arte",
    negocios: "negocios",
    analisis: "negocios",
    análisis: "negocios",
    business: "negocios",
    social: "social",
    salud: "social"
  };
  
  // Extraer porcentajes
  let rawPorcentajes = null;
  if (data) {
    if (data.porcentajes) rawPorcentajes = data.porcentajes;
    else if (data.categorias) rawPorcentajes = data.categorias;
    else if (data.interests) rawPorcentajes = data.interests;
    else if (Array.isArray(data)) {
      rawPorcentajes = {};
      data.forEach((item) => {
        if (item && item.name) {
          rawPorcentajes[item.name] = item.value || item.percentage || 0;
        }
      });
    } else if (typeof data === "object") {
      rawPorcentajes = data;
    }
  }
  
  // Inicializar resultados
  const normalized = {
    tecnologia: 0,
    ciencias: 0,
    arte: 0,
    negocios: 0,
    social: 0
  };
  
  if (rawPorcentajes) {
    Object.entries(rawPorcentajes).forEach(([key, value]) => {
      const normalizedKey = key.toLowerCase().trim()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]/g, "");
      
      const category = canonical[normalizedKey] || canonical[key.toLowerCase().trim()];
      
      if (category && normalized.hasOwnProperty(category)) {
        const num = typeof value === "number" 
          ? value 
          : parseInt(String(value).replace(/[^0-9]/g, "")) || 0;
        normalized[category] = num;
      }
    });
  }
  
  // Actualizar estado global
  appState.resultsData = normalized;
  
  // Actualizar UI
  document.getElementById("affinity-tecnologia").textContent = `${normalized.tecnologia}% de afinidad`;
  document.getElementById("affinity-ciencias").textContent = `${normalized.ciencias}% de afinidad`;
  document.getElementById("affinity-arte").textContent = `${normalized.arte}% de afinidad`;
  document.getElementById("affinity-negocios").textContent = `${normalized.negocios}% de afinidad`;
  document.getElementById("affinity-social").textContent = `${normalized.social}% de afinidad`;
  
  // Cargar fecha
  const dateRaw = localStorage.getItem("vocatioTestDate") || (data && (data.fecha || data.date));
  if (dateRaw) {
    try {
      const fecha = new Date(dateRaw).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      appState.testDate = fecha;
      document.getElementById("dateInfo").textContent = `Realizado el ${fecha}`;
    } catch (e) {
      appState.testDate = dateRaw;
      document.getElementById("dateInfo").textContent = `Realizado el ${dateRaw}`;
    }
  }
  
  // Cargar carreras recomendadas
  let carreras = [];
  if (data) {
    if (Array.isArray(data.carrerasRecomendadas)) carreras = data.carrerasRecomendadas;
    else if (Array.isArray(data.recomendaciones)) carreras = data.recomendaciones;
    else if (Array.isArray(data.recomendacionesCarreras)) carreras = data.recomendacionesCarreras;
  }
  
  // Si no hay carreras, inferir por categorías principales
  if (!carreras || carreras.length === 0) {
    const careerMap = {
      tecnologia: ["Ingeniería de Sistemas", "Ciencias de la Computación", "Ingeniería Informática"],
      ciencias: ["Biología", "Química", "Física"],
      arte: ["Diseño Gráfico", "Arquitectura", "Artes Visuales"],
      negocios: ["Administración de Empresas", "Economía", "Contabilidad"],
      social: ["Medicina", "Enfermería", "Psicología"]
    };
    
    const sortedCategories = Object.entries(normalized)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
    
    sortedCategories.forEach(([category]) => {
      if (careerMap[category]) {
        carreras = carreras.concat(careerMap[category]);
      }
    });
  }
  
  appState.careers = [...new Set(carreras)];
  
  // Actualizar lista de carreras en UI
  if (appState.careers.length > 0) {
    const listHTML = appState.careers.map(c => `<li>${c}</li>`).join("");
    document.getElementById("recommended-list").innerHTML = listHTML;
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  // Cargar datos del test
  cargarDatosDelTest();
  
  // Cargar tema guardado
  const savedTheme = localStorage.getItem('vocatioShareTheme');
  if (savedTheme && themes[savedTheme]) {
    appState.currentTheme = savedTheme;
    document.getElementById('colorTheme').value = savedTheme;
  }
  applyTheme(appState.currentTheme);
  
  // Cambio de tema
  document.getElementById("colorTheme").addEventListener("change", function (e) {
    applyTheme(e.target.value);
  });
  
  // Mostrar/ocultar fecha
  document.getElementById("showDate").addEventListener("change", function (e) {
    appState.showDate = e.target.value === "yes";
    document.getElementById("dateInfo").style.display = appState.showDate ? "block" : "none";
  });
  
  // Actualizar título y mensaje en tiempo real
  document.getElementById("customTitle").addEventListener("input", function (e) {
    appState.customTitle = e.target.value;
  });
  
  document.getElementById("customMessage").addEventListener("input", function (e) {
    appState.customMessage = e.target.value;
  });
  
  // Vista previa
  document.getElementById("previewBtn").addEventListener("click", generatePreview);
  
  // Descargas
  document.getElementById("downloadBtn").addEventListener("click", downloadImage);
  document.getElementById("downloadPdfBtn").addEventListener("click", downloadPDF);
  
  // Copiar enlace
  document.getElementById("copyLinkBtn").addEventListener("click", copyLink);
  
  // Compartir en redes sociales
  document.getElementById("facebookBtn").addEventListener("click", function (e) {
    e.preventDefault();
    const url = getShareUrl("facebook");
    if (url) window.open(url, "_blank", "width=600,height=400");
  });
  
  document.getElementById("twitterBtn").addEventListener("click", function (e) {
    e.preventDefault();
    const url = getShareUrl("twitter");
    if (url) window.open(url, "_blank", "width=600,height=400");
  });
  
  document.getElementById("linkedinBtn").addEventListener("click", function (e) {
    e.preventDefault();
    const url = getShareUrl("linkedin");
    if (url) window.open(url, "_blank", "width=600,height=400");
  });
  
  document.getElementById("instagramBtn").addEventListener("click", function (e) {
    e.preventDefault();
    showToast('💡 Usa "Descargar Imagen" para compartir en Instagram Stories o Feed', 'info', 4000);
  });
  
  // Cerrar modal
  document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("previewModal").classList.remove("active");
  });
  
  document.getElementById("previewModal").addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.remove("active");
    }
  });
});

// Agregar estilos para la animación del toast
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      transform: translate(-50%, 100px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    to {
      transform: translate(-50%, 100px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
