// ============================================
// COMPARADOR DE MALLAS CURRICULARES
// ============================================

// Base de datos de mallas curriculares por universidad
const curriculumData = {
  'ingenieria-sistemas': {
    upc: {
      name: 'UPC - Universidad Peruana de Ciencias Aplicadas',
      logo: '../../assets/images/upc-logo.png',
      totalCredits: 200,
      duration: '10 ciclos (5 años)',
      semesters: [
        {
          semester: 1,
          name: 'Ciclo 01',
          credits: 23,
          courses: [
            { code: 'CB101', name: 'Analytical Geometry', credits: 3, type: 'obligatorio' },
            { code: 'CB121', name: 'Differential Calculus', credits: 5, type: 'obligatorio' },
            { code: 'CB201', name: 'General Chemistry', credits: 4, type: 'obligatorio' },
            { code: 'CB501', name: 'Engineering Drawing', credits: 3, type: 'obligatorio' },
            { code: 'HS101', name: 'Personal Development', credits: 2, type: 'obligatorio' },
            { code: 'HS111', name: 'Oral and Written Communication', credits: 3, type: 'obligatorio' },
            { code: 'ST101', name: 'Introduction to Systems Engineering', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 2,
          name: 'Ciclo 02',
          credits: 21,
          courses: [
            { code: 'CB111', name: 'Linear Algebra', credits: 3, type: 'obligatorio' },
            { code: 'CB131', name: 'Integral Calculus', credits: 5, type: 'obligatorio' },
            { code: 'HS121', name: 'Methodology of Scientific Research', credits: 3, type: 'obligatorio' },
            { code: 'HS141', name: 'Philosophy and Ethics', credits: 2, type: 'obligatorio' },
            { code: 'HS201', name: 'Constitution and Human Rights', credits: 2, type: 'obligatorio' },
            { code: 'ST103', name: 'Systems General Theory', credits: 3, type: 'obligatorio' },
            { code: 'ST221', name: 'Algorithms and Data Structures', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 3,
          name: 'Ciclo 03',
          credits: 21,
          courses: [
            { code: 'CB112', name: 'Discrete Mathematics', credits: 3, type: 'obligatorio' },
            { code: 'CB132', name: 'Multivariable Calculus', credits: 5, type: 'obligatorio' },
            { code: 'CB302', name: 'Physics I', credits: 5, type: 'obligatorio' },
            { code: 'CB402', name: 'Statistics and Probabilities', credits: 3, type: 'obligatorio' },
            { code: 'HS131', name: 'Sociology', credits: 2, type: 'obligatorio' },
            { code: 'ST202', name: 'Structured Programming Languages', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 4,
          name: 'Ciclo 04',
          credits: 23,
          courses: [
            { code: 'CB122', name: 'Numerical Calculus', credits: 3, type: 'obligatorio' },
            { code: 'CB142', name: 'Differential Equations', credits: 5, type: 'obligatorio' },
            { code: 'CB312', name: 'Physics II', credits: 5, type: 'obligatorio' },
            { code: 'CB412', name: 'Applied Statistics', credits: 3, type: 'obligatorio' },
            { code: 'GP202', name: 'Microeconomy', credits: 3, type: 'obligatorio' },
            { code: 'ST232', name: 'Object Oriented Programming', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 5,
          name: 'Ciclo 05',
          credits: 22,
          courses: [
            { code: 'CB143', name: 'Applied Mathematics', credits: 3, type: 'obligatorio' },
            { code: 'CB313', name: 'Modern Physics', credits: 3, type: 'obligatorio' },
            { code: 'GP102', name: 'Organization and Methods', credits: 3, type: 'obligatorio' },
            { code: 'GP203', name: 'Macroeconomy', credits: 3, type: 'obligatorio' },
            { code: 'ST113', name: 'Operations Research I', credits: 3, type: 'obligatorio' },
            { code: 'ST203', name: 'Data Modeling', credits: 3, type: 'obligatorio' },
            { code: 'TP113', name: 'Electrical and Electronics Systems', credits: 4, type: 'obligatorio' }
          ]
        },
        {
          semester: 6,
          name: 'Ciclo 06',
          credits: 20,
          courses: [
            { code: 'GP223', name: 'Financial Accounting', credits: 3, type: 'obligatorio' },
            { code: 'GP403', name: 'Production Systems', credits: 3, type: 'obligatorio' },
            { code: 'ST123', name: 'Operations Research II', credits: 3, type: 'obligatorio' },
            { code: 'ST133', name: 'Systems Dynamics', credits: 3, type: 'obligatorio' },
            { code: 'ST213', name: 'Systems Design and Analysis', credits: 5, type: 'obligatorio' },
            { code: 'TP123', name: 'Digital Systems', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 7,
          name: 'Ciclo 07',
          credits: 16,
          courses: [
            { code: 'GP122', name: 'Entrepreneurial Creativity', credits: 1, type: 'obligatorio' },
            { code: 'GP233', name: 'Costs Accounting and Budgets', credits: 3, type: 'obligatorio' },
            { code: 'ST124', name: 'Simulation', credits: 3, type: 'obligatorio' },
            { code: 'ST204', name: 'Software Engineering Workshop I', credits: 3, type: 'obligatorio' },
            { code: 'ST214', name: 'Data Bases Administration', credits: 3, type: 'obligatorio' },
            { code: 'ST314', name: 'Computer Architecture', credits: 3, type: 'obligatorio' },
            { code: 'ST324', name: 'Operating Systems', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 8,
          name: 'Ciclo 08',
          credits: 17,
          courses: [
            { code: 'GP235', name: 'Financial Management', credits: 3, type: 'obligatorio' },
            { code: 'GP304', name: 'Business Logistics', credits: 3, type: 'obligatorio' },
            { code: 'GP314', name: 'Marketing', credits: 3, type: 'obligatorio' },
            { code: 'HS204', name: 'Business Legislation', credits: 2, type: 'obligatorio' },
            { code: 'ST334', name: 'Data Communication Systems', credits: 3, type: 'obligatorio' },
            { code: 'ST414', name: 'Artificial Intelligence', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 9,
          name: 'Ciclo 09',
          credits: 14,
          courses: [
            { code: 'GP515', name: 'Strategic Planning and Management', credits: 3, type: 'obligatorio' },
            { code: 'GP525', name: 'Project Design and Evaluation', credits: 4, type: 'obligatorio' },
            { code: 'ST205', name: 'Special Topics in Systems Engineering', credits: 2, type: 'obligatorio' },
            { code: 'ST215', name: 'Information Security', credits: 3, type: 'obligatorio' },
            { code: 'ST235', name: 'Systems Engineering Project I', credits: 2, type: 'obligatorio' }
          ]
        },
        {
          semester: 10,
          name: 'Ciclo 10',
          credits: 9,
          courses: [
            { code: 'ST236', name: 'Systems Engineering Project II', credits: 2, type: 'obligatorio' },
            { code: 'ST255', name: 'Information Projects Management', credits: 3, type: 'obligatorio' },
            { code: 'ST275', name: 'Information Systems Auditing', credits: 3, type: 'obligatorio' },
            { code: 'ST285', name: 'Electronic Business Applications', credits: 3, type: 'obligatorio' },
            { code: 'ST295', name: 'Business Engineering', credits: 3, type: 'obligatorio' }
          ]
        }
      ]
    },
    
    uni: {
      name: 'UNI - Universidad Nacional de Ingeniería',
      logo: '../../assets/images/uni-logo.png',
      totalCredits: 216,
      duration: '10 niveles (5 años)',
      semesters: [
        {
          semester: 1,
          name: 'Nivel 1',
          credits: 20,
          courses: [
            { code: 'MB110', name: 'Matemática Básica', credits: 5, type: 'obligatorio' },
            { code: 'MI110', name: 'Metodologías de Investigación', credits: 3, type: 'obligatorio' },
            { code: 'DP110', name: 'Desarrollo Personal y Social', credits: 2, type: 'obligatorio' },
            { code: 'LC110', name: 'Lenguaje y Comunicación I', credits: 4, type: 'obligatorio' },
            { code: 'GR110', name: 'Globalización y Realidad Nacional', credits: 2, type: 'obligatorio' },
            { code: 'EC110', name: 'Ética Cívica', credits: 2, type: 'obligatorio' }
          ]
        },
        {
          semester: 2,
          name: 'Nivel 2',
          credits: 20,
          courses: [
            { code: 'CI210', name: 'Cálculo I', credits: 5, type: 'obligatorio' },
            { code: 'EE210', name: 'Economía y Empresa', credits: 3, type: 'obligatorio' },
            { code: 'AL210', name: 'Álgebra Lineal', credits: 3, type: 'obligatorio' },
            { code: 'TF210', name: 'Temas de Filosofía', credits: 3, type: 'obligatorio' },
            { code: 'LC210', name: 'Lenguaje y Comunicación II', credits: 3, type: 'obligatorio' },
            { code: 'PS210', name: 'Procesos Sociales y Políticos', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 3,
          name: 'Nivel 3',
          credits: 21,
          courses: [
            { code: 'FI310', name: 'Fundamentos de Ingeniería de Sistemas', credits: 2, type: 'obligatorio' },
            { code: 'CI320', name: 'Cálculo II', credits: 4, type: 'obligatorio' },
            { code: 'IG310', name: 'Informática para la Gestión', credits: 3, type: 'obligatorio' },
            { code: 'EC310', name: 'Estructuras de Datos y Computación', credits: 2, type: 'obligatorio' },
            { code: 'IP310', name: 'Introducción a la Programación', credits: 3, type: 'obligatorio' },
            { code: 'FI320', name: 'Física I', credits: 4, type: 'obligatorio' },
            { code: 'AQ310', name: 'Arquitectura de Computadoras', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 4,
          name: 'Nivel 4',
          credits: 22,
          courses: [
            { code: 'EP410', name: 'Estadística y Probabilidad', credits: 3, type: 'obligatorio' },
            { code: 'CI430', name: 'Cálculo III', credits: 4, type: 'obligatorio' },
            { code: 'GC410', name: 'Gestión Contable', credits: 2, type: 'obligatorio' },
            { code: 'OE410', name: 'Organización de Empresas / Business Organization', credits: 3, type: 'obligatorio' },
            { code: 'PO410', name: 'Programación Orientada a Objetos', credits: 3, type: 'obligatorio' },
            { code: 'FE410', name: 'Fundamentos de Electricidad y Electrónica', credits: 3, type: 'obligatorio' },
            { code: 'SO410', name: 'Sistemas Operativos', credits: 4, type: 'obligatorio' }
          ]
        },
        {
          semester: 5,
          name: 'Nivel 5',
          credits: 20,
          courses: [
            { code: 'EA510', name: 'Estadística Aplicada', credits: 3, type: 'obligatorio' },
            { code: 'MI510', name: 'Modelación e Integración de Sistemas', credits: 3, type: 'obligatorio' },
            { code: 'CO510', name: 'Costeo de Operaciones', credits: 2, type: 'obligatorio' },
            { code: 'DC510', name: 'Desarrollo de Competencias Gerenciales', credits: 3, type: 'obligatorio' },
            { code: 'IP510', name: 'Ingeniería de Procesos de Negocio', credits: 3, type: 'obligatorio' },
            { code: 'ED510', name: 'Estructuras de Datos y Algoritmos', credits: 3, type: 'obligatorio' },
            { code: 'IC510', name: 'Internet de las Cosas / Internet of Things', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 6,
          name: 'Nivel 6',
          credits: 20,
          courses: [
            { code: 'TI610', name: 'Taller de Investigación de Operaciones I', credits: 3, type: 'obligatorio' },
            { code: 'GF610', name: 'Gestión Financiera', credits: 3, type: 'obligatorio' },
            { code: 'LE610', name: 'Legislación y Ética', credits: 3, type: 'obligatorio' },
            { code: 'TE610', name: 'Taller de Emprendimiento Tecnológico / Startup Workshop', credits: 3, type: 'obligatorio' },
            { code: 'ID610', name: 'Ingeniería de Datos', credits: 4, type: 'obligatorio' },
            { code: 'LP610', name: 'Lenguajes de Programación', credits: 3, type: 'obligatorio' },
            { code: 'CD610', name: 'Comunicación de Datos', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 7,
          name: 'Nivel 7',
          credits: 18,
          courses: [
            { code: 'SM710', name: 'Simulación', credits: 3, type: 'obligatorio' },
            { code: 'GO710', name: 'Gestión de Operaciones', credits: 3, type: 'obligatorio' },
            { code: 'EP710', name: 'Evaluación de Proyectos de Inversión', credits: 3, type: 'obligatorio' },
            { code: 'SI710', name: 'Sistemas de Información Empresarial', credits: 3, type: 'obligatorio' },
            { code: 'AB710', name: 'Administración de Base de Datos', credits: 4, type: 'obligatorio' },
            { code: 'IS710', name: 'Ingeniería de Software', credits: 3, type: 'obligatorio' },
            { code: 'PR710', name: 'Programación Web', credits: 2, type: 'obligatorio' },
            { code: 'SR710', name: 'Seminario de Redes', credits: 4, type: 'obligatorio' }
          ]
        },
        {
          semester: 8,
          name: 'Nivel 8',
          credits: 16,
          courses: [
            { code: 'TP810', name: 'Taller de Propuesta de Investigación', credits: 3, type: 'obligatorio' },
            { code: 'GR810', name: 'Gestión de Riesgos', credits: 3, type: 'obligatorio' },
            { code: 'MD810', name: 'Marketing Digital', credits: 3, type: 'obligatorio' },
            { code: 'SE810', name: 'Sistemas ERP', credits: 3, type: 'obligatorio' },
            { code: 'SD810', name: 'Sistemas de Soporte de Decisiones', credits: 3, type: 'obligatorio' },
            { code: 'AM810', name: 'Aprendizaje de Máquina / Machine Learning', credits: 3, type: 'obligatorio' },
            { code: 'IS820', name: 'Ingeniería de Software II', credits: 4, type: 'obligatorio' },
            { code: 'PM810', name: 'Programación Móvil', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 9,
          name: 'Nivel 9',
          credits: 16,
          courses: [
            { code: 'SI910', name: 'Seminario de Investigación I', credits: 3, type: 'obligatorio' },
            { code: 'PE910', name: 'Planeamiento Estratégico', credits: 3, type: 'obligatorio' },
            { code: 'GP910', name: 'Gestión de Proyectos', credits: 3, type: 'obligatorio' },
            { code: 'SA910', name: 'Sistemas Avanzados de Información', credits: 3, type: 'obligatorio' },
            { code: 'AP910', name: 'Analítica Predictiva de Datos', credits: 3, type: 'obligatorio' },
            { code: 'AC910', name: 'Aseguramiento de la Calidad', credits: 3, type: 'obligatorio' },
            { code: 'GS910', name: 'Gestión de Servicios de las Tecnologías de la Información', credits: 3, type: 'obligatorio' },
            { code: 'AT910', name: 'Auditoría de Tecnologías de la Información', credits: 4, type: 'obligatorio' }
          ]
        },
        {
          semester: 10,
          name: 'Nivel 10',
          credits: 10,
          courses: [
            { code: 'SI920', name: 'Seminario de Investigación II', credits: 4, type: 'obligatorio' },
            { code: 'AS1010', name: 'Auditoría y Control de Sistemas', credits: 3, type: 'obligatorio' },
            { code: 'GC1010', name: 'Gestión del Capital Humano', credits: 3, type: 'obligatorio' },
            { code: 'AE1010', name: 'Arquitectura Empresarial', credits: 3, type: 'obligatorio' },
            { code: 'AB1010', name: 'Analítica con Big Data', credits: 3, type: 'obligatorio' },
            { code: 'PV1010', name: 'Programación de Videojuegos', credits: 4, type: 'obligatorio' },
            { code: 'AS1020', name: 'Arquitectura de Software', credits: 4, type: 'obligatorio' },
            { code: 'ST1010', name: 'Seguridad de Sistemas de Tecnologías de la Información', credits: 3, type: 'obligatorio' },
            { code: 'CC1010', name: 'Ciberseguridad / Cybersecurity', credits: 3, type: 'obligatorio' }
          ]
        }
      ]
    },
    
    ulima: {
      name: 'U. de Lima - Universidad de Lima',
      logo: '../../assets/images/ulima-logo.png',
      totalCredits: 203,
      duration: '10 ciclos (5 años)',
      semesters: [
        {
          semester: 1,
          name: 'Ciclo 01',
          credits: 20,
          courses: [
            { code: 'AE101', name: 'Aprendizaje Estratégico y Liderazgo', credits: 2, type: 'obligatorio' },
            { code: 'CA101', name: 'Cálculo I', credits: 5, type: 'obligatorio' },
            { code: 'BD101', name: 'Base de Datos', credits: 3, type: 'obligatorio' },
            { code: 'AC101', name: 'Arquitectura de Computadoras y Sistemas Operativos', credits: 4, type: 'obligatorio' },
            { code: 'AE102', name: 'Arquitectura Empresarial', credits: 3, type: 'obligatorio' },
            { code: 'AA101', name: 'Arquitectura de Aplicaciones', credits: 3, type: 'obligatorio' }
          ]
        },
        {
          semester: 2,
          name: 'Ciclo 02',
          credits: 20,
          courses: [
            { code: 'CC201', name: 'Crítica y Comunicación', credits: 4, type: 'obligatorio' },
            { code: 'LP201', name: 'Lenguaje de Programación', credits: 3, type: 'obligatorio' },
            { code: 'CP201', name: 'Contabilidad y Presupuestos', credits: 3, type: 'obligatorio' },
            { code: 'FI201', name: 'Física I', credits: 4, type: 'obligatorio' },
            { code: 'CA202', name: 'Cálculo II', credits: 4, type: 'obligatorio' },
            { code: 'DE201', name: 'Diseño de Experimentos en SI', credits: 2, type: 'obligatorio' }
          ]
        },
        {
          semester: 3,
          name: 'Ciclo 03',
          credits: 21,
          courses: [
            { code: 'FP301', name: 'Fundamentos en Programación', credits: 3, type: 'obligatorio' },
            { code: 'OD301', name: 'Organización y Dirección De Empresas', credits: 3, type: 'obligatorio' },
            { code: 'FI302', name: 'Física I', credits: 4, type: 'obligatorio' },
            { code: 'HU301', name: 'HCI for UX Design', credits: 3, type: 'obligatorio' },
            { code: 'EA301', name: 'Estadística Aplicada I', credits: 3, type: 'obligatorio' },
            { code: 'EN301', name: 'Emprendimiento de Negocios Sostenibles Formulación', credits: 2, type: 'obligatorio' }
          ]
        },
        {
          semester: 4,
          name: 'Ciclo 04',
          credits: 22,
          courses: [
            { code: 'MA401', name: 'Matemática Básica', credits: 3, type: 'obligatorio' },
            { code: 'PO401', name: 'Programación Orientada a Objetos', credits: 3, type: 'obligatorio' },
            { code: 'MD401', name: 'Matemática Discreta', credits: 3, type: 'obligatorio' },
            { code: 'MC401', name: 'Matemática Computacional', credits: 4, type: 'obligatorio' },
            { code: 'TE401', name: 'Tecnologías Emergentes', credits: 3, type: 'obligatorio' },
            { code: 'RC401', name: 'Redes y Comunicaciones de Datos', credits: 3, type: 'obligatorio' },
            { code: 'SO401', name: 'Sistemas Operativos', credits: 4, type: 'obligatorio' }
          ]
        },
        {
          semester: 5,
          name: 'Ciclo 05',
          credits: 20,
          courses: [
            { code: 'PC501', name: 'Pensamiento Crítico Aplicado', credits: 2, type: 'obligatorio' },
            { code: 'SI501', name: 'Seminario de Investigación Académica I', credits: 3, type: 'obligatorio' },
            { code: 'MD502', name: 'Matemática Discreta', credits: 3, type: 'obligatorio' },
            { code: 'EL501', name: 'Electivo', credits: 3, type: 'electivo' },
            { code: 'EL502', name: 'Electivo', credits: 3, type: 'electivo' },
            { code: 'EL503', name: 'Electivo', credits: 3, type: 'electivo' },
            { code: 'EL504', name: 'Electivo', credits: 3, type: 'electivo' }
          ]
        },
        {
          semester: 6,
          name: 'Ciclo 06',
          credits: 20,
          courses: [
            { code: 'SS601', name: 'Sistemas y Sociedad', credits: 2, type: 'obligatorio' },
            { code: 'EL601', name: 'Electivo', credits: 3, type: 'electivo' },
            { code: 'EL602', name: 'Electivo', credits: 3, type: 'electivo' },
            { code: 'EL603', name: 'Electivo', credits: 3, type: 'electivo' },
            { code: 'EL604', name: 'Electivo', credits: 3, type: 'electivo' },
            { code: 'EL605', name: 'Electivo', credits: 3, type: 'electivo' },
            { code: 'EL606', name: 'Electivo', credits: 3, type: 'electivo' }
          ]
        },
        {
          semester: 7,
          name: 'Ciclo 07',
          credits: 20,
          courses: [
            { code: 'GP701', name: 'Gerencia de Proyectos S/IT', credits: 3, type: 'obligatorio' },
            { code: 'GS701', name: 'Gestión de Seguridad de Información', credits: 3, type: 'obligatorio' },
            { code: 'RP701', name: 'Robotización de Procesos', credits: 3, type: 'obligatorio' },
            { code: 'SD701', name: 'Soluciones Digitales e Inteligentes', credits: 4, type: 'obligatorio' },
            { code: 'TI701', name: 'Trabajo de Investigación I', credits: 3, type: 'obligatorio' },
            { code: 'EL701', name: 'Electivo', credits: 4, type: 'electivo' }
          ]
        },
        {
          semester: 8,
          name: 'Ciclo 08',
          credits: 18,
          courses: [
            { code: 'SI801', name: 'Seminario de Investigación Académica II', credits: 4, type: 'obligatorio' },
            { code: 'SM801', name: 'Soluciones Móviles y Cloud', credits: 3, type: 'obligatorio' },
            { code: 'TS801', name: 'Technical Sales and Marketing', credits: 3, type: 'obligatorio' },
            { code: 'TI802', name: 'Tecnologías e Ingeniería Financiera', credits: 3, type: 'obligatorio' },
            { code: 'TI803', name: 'Tópicos de Investigación Aplicada', credits: 3, type: 'obligatorio' },
            { code: 'EL801', name: 'Electivo', credits: 2, type: 'electivo' }
          ]
        },
        {
          semester: 9,
          name: 'Ciclo 09',
          credits: 16,
          courses: [
            { code: 'BP901', name: 'Business Predictive Analytics', credits: 3, type: 'obligatorio' },
            { code: 'TI901', name: 'Trabajo de Investigación I', credits: 3, type: 'obligatorio' },
            { code: 'PE901', name: 'Planeamiento Estratégico', credits: 3, type: 'obligatorio' },
            { code: 'GR901', name: 'Gestión de Riesgos', credits: 3, type: 'obligatorio' },
            { code: 'SE901', name: 'Sistemas ERP', credits: 3, type: 'obligatorio' },
            { code: 'AS901', name: 'Aseguramiento de la Calidad', credits: 3, type: 'obligatorio' },
            { code: 'AT901', name: 'Auditoría y Control de Sistemas', credits: 4, type: 'obligatorio' }
          ]
        },
        {
          semester: 10,
          name: 'Ciclo 10',
          credits: 10,
          courses: [
            { code: 'EL1001', name: 'Electivo', credits: 3, type: 'electivo' },
            { code: 'EL1002', name: 'Electivo', credits: 3, type: 'electivo' },
            { code: 'EL1003', name: 'Electivo', credits: 4, type: 'electivo' }
          ]
        }
      ]
    }
  }
};

// Función para abrir el comparador de mallas
function openCurriculumComparator(careerId) {
  const careerData = curriculumData[careerId];
  
  if (!careerData) {
    alert('No hay mallas curriculares disponibles para comparar en esta carrera.');
    return;
  }

  // Crear modal de comparación
  const modal = document.createElement('div');
  modal.className = 'modal-overlay curriculum-comparator-modal active';
  modal.id = 'curriculum-comparator';
  
  modal.innerHTML = `
    <div class="modal-content curriculum-modal-content">
      <div class="modal-header">
        <h2>🎓 Comparador de Mallas Curriculares</h2>
        <button class="modal-close" onclick="closeCurriculumComparator()">&times;</button>
      </div>
      
      <div class="modal-body">
        <!-- Selector de universidades -->
        <div class="university-selector">
          <h3>Selecciona las universidades a comparar:</h3>
          <div class="university-chips">
            <label class="university-chip">
              <input type="checkbox" id="select-upc" value="upc" checked onchange="updateComparison()"/>
              <span>
                <img src="../../assets/images/upc-logo.png" alt="UPC" class="uni-logo"/>
                <strong>UPC</strong>
              </span>
            </label>
            
            <label class="university-chip">
              <input type="checkbox" id="select-uni" value="uni" checked onchange="updateComparison()"/>
              <span>
                <img src="../../assets/images/uni-logo.png" alt="UNI" class="uni-logo"/>
                <strong>UNI</strong>
              </span>
            </label>
            
            <label class="university-chip">
              <input type="checkbox" id="select-ulima" value="ulima" checked onchange="updateComparison()"/>
              <span>
                <img src="../../assets/images/ulima-logo.png" alt="U. de Lima" class="uni-logo"/>
                <strong>U. de Lima</strong>
              </span>
            </label>
          </div>
        </div>

        <!-- Filtros y vista -->
        <div class="comparison-controls">
          <div class="view-selector">
            <button class="view-btn active" data-view="side-by-side" onclick="changeComparisonView('side-by-side')">
              Vista Lado a Lado
            </button>
            <button class="view-btn" data-view="unified" onclick="changeComparisonView('unified')">
              Vista Unificada
            </button>
          </div>
          
          <div class="semester-filter">
            <label>Filtrar por ciclo:</label>
            <select id="semester-filter" onchange="updateComparison()">
              <option value="all">Todos los ciclos</option>
              <option value="1">Ciclo 1</option>
              <option value="2">Ciclo 2</option>
              <option value="3">Ciclo 3</option>
              <option value="4">Ciclo 4</option>
              <option value="5">Ciclo 5</option>
              <option value="6">Ciclo 6</option>
              <option value="7">Ciclo 7</option>
              <option value="8">Ciclo 8</option>
              <option value="9">Ciclo 9</option>
              <option value="10">Ciclo 10</option>
            </select>
          </div>
        </div>

        <!-- Resumen comparativo -->
        <div class="comparison-summary" id="comparison-summary">
          <!-- Se llenará dinámicamente -->
        </div>

        <!-- Contenedor de comparación -->
        <div class="curriculum-comparison-container" id="comparison-container">
          <!-- Se llenará dinámicamente -->
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-secondary" onclick="exportComparison()">
          📥 Exportar Comparación
        </button>
        <button class="btn-primary" onclick="closeCurriculumComparator()">
          Cerrar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Inicializar comparación
  window.currentCareerId = careerId;
  updateComparison();
}

// Actualizar comparación
function updateComparison() {
  const careerId = window.currentCareerId;
  const careerData = curriculumData[careerId];
  
  const selectedUniversities = [];
  if (document.getElementById('select-upc')?.checked) selectedUniversities.push('upc');
  if (document.getElementById('select-uni')?.checked) selectedUniversities.push('uni');
  if (document.getElementById('select-ulima')?.checked) selectedUniversities.push('ulima');
  
  if (selectedUniversities.length === 0) {
    document.getElementById('comparison-container').innerHTML = `
      <div class="no-selection">
        <p>⚠️ Selecciona al menos una universidad para comparar</p>
      </div>
    `;
    return;
  }
  
  const semesterFilter = document.getElementById('semester-filter')?.value || 'all';
  
  // Generar resumen
  generateSummary(careerData, selectedUniversities);
  
  // Generar comparación
  const view = document.querySelector('.view-btn.active')?.dataset.view || 'side-by-side';
  
  if (view === 'side-by-side') {
    generateSideBySideView(careerData, selectedUniversities, semesterFilter);
  } else {
    generateUnifiedView(careerData, selectedUniversities, semesterFilter);
  }
}

// Generar resumen comparativo
function generateSummary(careerData, universities) {
  const summaryContainer = document.getElementById('comparison-summary');
  
  const summaryHTML = universities.map(uni => {
    const data = careerData[uni];
    return `
      <div class="summary-card">
        <h4>${data.name}</h4>
        <div class="summary-stats">
          <div class="stat">
            <span class="stat-label">Créditos totales:</span>
            <span class="stat-value">${data.totalCredits}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Duración:</span>
            <span class="stat-value">${data.duration}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Ciclos:</span>
            <span class="stat-value">${data.semesters.length}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  summaryContainer.innerHTML = summaryHTML;
}

// Vista lado a lado
function generateSideBySideView(careerData, universities, semesterFilter) {
  const container = document.getElementById('comparison-container');
  container.className = 'curriculum-comparison-container side-by-side';
  
  let html = '<div class="comparison-grid">';
  
  universities.forEach(uni => {
    const data = careerData[uni];
    const semesters = semesterFilter === 'all' 
      ? data.semesters 
      : data.semesters.filter(s => s.semester === parseInt(semesterFilter));
    
    html += `
      <div class="university-column">
        <div class="university-header">
          <h3>${uni.toUpperCase()}</h3>
          <span class="credits-badge">${data.totalCredits} créditos</span>
        </div>
        
        <div class="semesters-list">
          ${semesters.map(semester => `
            <div class="semester-card">
              <div class="semester-header">
                <h4>${semester.name}</h4>
                <span class="semester-credits">${semester.credits} créditos</span>
              </div>
              <div class="courses-list">
                ${semester.courses.map(course => `
                  <div class="course-item ${course.type}">
                    <span class="course-code">${course.code}</span>
                    <span class="course-name">${course.name}</span>
                    <span class="course-credits">${course.credits} CR</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// Vista unificada
function generateUnifiedView(careerData, universities, semesterFilter) {
  const container = document.getElementById('comparison-container');
  container.className = 'curriculum-comparison-container unified';
  
  const maxSemesters = Math.max(...universities.map(uni => careerData[uni].semesters.length));
  
  let html = '';
  
  for (let i = 1; i <= maxSemesters; i++) {
    if (semesterFilter !== 'all' && parseInt(semesterFilter) !== i) continue;
    
    html += `
      <div class="unified-semester">
        <div class="unified-semester-header">
          <h3>Ciclo ${i}</h3>
        </div>
        <div class="unified-semester-grid">
          ${universities.map(uni => {
            const data = careerData[uni];
            const semester = data.semesters.find(s => s.semester === i);
            
            if (!semester) {
              return `<div class="unified-university-column empty">
                <h4>${uni.toUpperCase()}</h4>
                <p class="empty-message">No hay información disponible</p>
              </div>`;
            }
            
            return `
              <div class="unified-university-column">
                <div class="unified-uni-header">
                  <h4>${uni.toUpperCase()}</h4>
                  <span class="credits-badge">${semester.credits} CR</span>
                </div>
                <div class="courses-list">
                  ${semester.courses.map(course => `
                    <div class="course-item ${course.type}">
                      <div class="course-info">
                        <span class="course-code">${course.code}</span>
                        <span class="course-name">${course.name}</span>
                      </div>
                      <span class="course-credits">${course.credits} CR</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

// Cambiar vista
function changeComparisonView(view) {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  updateComparison();
}

// Cerrar comparador
function closeCurriculumComparator() {
  const modal = document.getElementById('curriculum-comparator');
  if (modal) {
    modal.remove();
  }
}

// Exportar comparación
function exportComparison() {
  alert('Funcionalidad de exportación en desarrollo. Próximamente podrás descargar la comparación en PDF.');
}
