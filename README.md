# VOCATIO - Plataforma de Orientación Vocacional

Proyecto HTML/CSS puro para la orientación vocacional de estudiantes.

## Estructura del Proyecto

\`\`\`
vocatio/
├── index.html                 # Página principal (landing page)
├── css/
│   ├── styles.css            # Estilos globales
│   ├── components.css        # Componentes reutilizables
│   └── responsive.css        # Media queries
├── pages/
│   ├── auth/
│   │   ├── login.html        # Página de inicio de sesión
│   │   └── register.html     # Página de registro
│   ├── vocational-test/
│   │   ├── test.html         # Test vocacional
│   │   └── results.html      # Resultados del test
│   ├── careers/
│   │   ├── explore.html      # Explorar carreras
│   │   ├── details.html      # Detalles de carrera
│   │   └── compare.html      # Comparar carreras
│   ├── events/
│   │   └── events.html       # Eventos vocacionales
│   ├── materials/
│   │   ├── materials.html    # Materiales sugeridos
│   │   └── saved-materials.html # Materiales guardados
│   ├── profile/
│   │   ├── profile.html      # Perfil del usuario
│   │   ├── favorites.html    # Carreras favoritas
│   │   └── settings.html     # Configuración
│   ├── learning-path/
│   │   └── learning-path.html # Ruta de aprendizaje
│   ├── results/
│   │   └── results.html      # Resultados y reportes
│   ├── progress/
│   │   └── progress.html     # Progreso del usuario
│   └── support/
│       └── support.html      # Soporte y ayuda
└── assets/
    └── images/               # Imágenes del proyecto
\`\`\`

## Cómo ejecutar el proyecto

### Opción 1: Usar Python (Recomendado)

Si tienes Python instalado, ejecuta:

\`\`\`bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
\`\`\`

Luego abre tu navegador en: `http://localhost:8000`

### Opción 2: Usar Node.js

Si tienes Node.js instalado, instala `http-server`:

\`\`\`bash
npm install -g http-server
http-server
\`\`\`

Luego abre tu navegador en: `http://localhost:8080`

### Opción 3: Usar Live Server en VS Code

1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

## Características

- ✅ HTML semántico en todas las vistas
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Estructura clara de carpetas por funcionalidad
- ✅ CSS puro sin dependencias externas
- ✅ Sin JavaScript, sin React, sin frameworks
- ✅ Navegación completa entre todas las páginas

## Funcionalidades

1. **Test Vocacional** - Descubre tu vocación perfecta
2. **Explorar Carreras** - Navega por cientos de carreras
3. **Eventos Vocacionales** - Participa en charlas y ferias
4. **Materiales Educativos** - Accede a recursos por carrera
5. **Perfil Personalizado** - Crea tu perfil y guarda favoritos
6. **Ruta de Aprendizaje** - Sigue un camino estructurado
7. **Reportes** - Descarga tu informe vocacional

## Notas Importantes

⚠️ **No abras los archivos HTML directamente desde el explorador de archivos**. Esto causará errores de rutas debido a restricciones de seguridad del navegador.

Siempre usa un servidor web local como se describe arriba.

## Autor

DecideClaro - Soluciones tecnológicas educativas para orientación vocacional
