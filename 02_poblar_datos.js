// =====================================================================
// Script 02: Poblamiento con datos simulados coherentes
// Base: hce_antioquia   |   Ejecución: mongosh < 02_poblar_datos.js
// -----------------------------------------------------------------
// NOTA ÉTICA: todos los datos son SIMULADOS. Los documentos de
// identidad, nombres y direcciones son ficticios y no corresponden a
// personas reales. Ver sección de reflexión ética del informe.
// =====================================================================

use("hce_antioquia");

const D = (s) => new Date(s + "T00:00:00Z");
const DT = (s) => new Date(s + "Z");

// =====================================================================
// CATÁLOGO: Diagnósticos CIE-10
// =====================================================================
db.diagnosticos_cie10.insertMany([
  { _id: "J18",  nombre: "Neumonía, organismo no especificado", capitulo: "Enfermedades del sistema respiratorio", es_notificacion_obligatoria: false },
  { _id: "J440", nombre: "EPOC con infección aguda de vías respiratorias inferiores", capitulo: "Enfermedades del sistema respiratorio", es_notificacion_obligatoria: false },
  { _id: "E119", nombre: "Diabetes mellitus tipo 2 sin complicaciones", capitulo: "Enfermedades endocrinas y metabólicas", es_notificacion_obligatoria: false },
  { _id: "I10",  nombre: "Hipertensión esencial (primaria)", capitulo: "Enfermedades del sistema circulatorio", es_notificacion_obligatoria: false },
  { _id: "A09",  nombre: "Diarrea y gastroenteritis de presunto origen infeccioso", capitulo: "Ciertas enfermedades infecciosas y parasitarias", es_notificacion_obligatoria: true },
  { _id: "A90",  nombre: "Dengue clásico", capitulo: "Ciertas enfermedades infecciosas y parasitarias", es_notificacion_obligatoria: true },
  { _id: "N390", nombre: "Infección de vías urinarias, sitio no especificado", capitulo: "Enfermedades del sistema genitourinario", es_notificacion_obligatoria: false },
  { _id: "S726", nombre: "Fractura múltiple del fémur", capitulo: "Traumatismos y envenenamientos", es_notificacion_obligatoria: false },
  { _id: "I219", nombre: "Infarto agudo del miocardio, sin otra especificación", capitulo: "Enfermedades del sistema circulatorio", es_notificacion_obligatoria: false },
  { _id: "F329", nombre: "Episodio depresivo, no especificado", capitulo: "Trastornos mentales y del comportamiento", es_notificacion_obligatoria: false }
]);

// =====================================================================
// CATÁLOGO: Medicamentos
// =====================================================================
db.medicamentos.insertMany([
  { _id: "MED-001", nombre: "Ampicilina/Sulbactam", principio_activo: "Ampicilina sódica + Sulbactam", forma_farmaceutica: "Ampolla", concentracion: "1.5 g", pos: true },
  { _id: "MED-002", nombre: "Acetaminofén", principio_activo: "Paracetamol", forma_farmaceutica: "Tableta", concentracion: "500 mg", pos: true },
  { _id: "MED-003", nombre: "Enalapril", principio_activo: "Enalapril maleato", forma_farmaceutica: "Tableta", concentracion: "20 mg", pos: true },
  { _id: "MED-004", nombre: "Insulina cristalina", principio_activo: "Insulina humana regular", forma_farmaceutica: "Ampolla", concentracion: "100 UI/mL", pos: true },
  { _id: "MED-005", nombre: "Solución salina 0.9%", principio_activo: "Cloruro de sodio", forma_farmaceutica: "Solución IV", concentracion: "500 mL", pos: true },
  { _id: "MED-006", nombre: "Salbutamol", principio_activo: "Salbutamol sulfato", forma_farmaceutica: "Inhalador", concentracion: "100 mcg/dosis", pos: true },
  { _id: "MED-007", nombre: "Ceftriaxona", principio_activo: "Ceftriaxona sódica", forma_farmaceutica: "Ampolla", concentracion: "1 g", pos: true },
  { _id: "MED-008", nombre: "Dipirona", principio_activo: "Metamizol sódico", forma_farmaceutica: "Ampolla", concentracion: "1 g/2 mL", pos: true },
  { _id: "MED-009", nombre: "Omeprazol", principio_activo: "Omeprazol", forma_farmaceutica: "Cápsula", concentracion: "20 mg", pos: true },
  { _id: "MED-010", nombre: "Sertralina", principio_activo: "Sertralina clorhidrato", forma_farmaceutica: "Tableta", concentracion: "50 mg", pos: true }
]);

// =====================================================================
// MÉDICOS
// =====================================================================
db.medicos.insertMany([
  { _id: "MD-001", nombres: "Carolina", apellidos: "Restrepo Vélez",   registro_medico: "RM-54321", especialidad: "Medicina Interna",  sede: "Hospital General de Medellín",     activo: true },
  { _id: "MD-002", nombres: "Andrés",   apellidos: "Zapata Ochoa",     registro_medico: "RM-61204", especialidad: "Neumología",        sede: "Hospital General de Medellín",     activo: true },
  { _id: "MD-003", nombres: "Luz Mery", apellidos: "Gómez Arango",     registro_medico: "RM-47890", especialidad: "Pediatría",         sede: "Hospital Marco Fidel Suárez",      activo: true },
  { _id: "MD-004", nombres: "Jhon",     apellidos: "Álvarez Monsalve", registro_medico: "RM-70113", especialidad: "Cirugía General",   sede: "Hospital San Juan de Dios Rionegro", activo: true },
  { _id: "MD-005", nombres: "Paula",    apellidos: "Cardona Ríos",     registro_medico: "RM-33877", especialidad: "Cardiología",       sede: "Hospital General de Medellín",     activo: true },
  { _id: "MD-006", nombres: "Sebastián",apellidos: "Mejía Toro",       registro_medico: "RM-88021", especialidad: "Medicina Interna",  sede: "Hospital Marco Fidel Suárez",      activo: true },
  { _id: "MD-007", nombres: "Natalia",  apellidos: "Herrera Pineda",   registro_medico: "RM-29456", especialidad: "Psiquiatría",       sede: "ESE Hospital La María",            activo: true }
]);

// =====================================================================
// CAMAS
// =====================================================================
db.camas.insertMany([
  { _id: "HGM-UCI-01", sede: "Hospital General de Medellín", servicio: "UCI", piso: 4, estado: "Ocupada",    aislamiento: false },
  { _id: "HGM-UCI-02", sede: "Hospital General de Medellín", servicio: "UCI", piso: 4, estado: "Ocupada",    aislamiento: true  },
  { _id: "HGM-UCI-03", sede: "Hospital General de Medellín", servicio: "UCI", piso: 4, estado: "Disponible", aislamiento: false },
  { _id: "HGM-HOS-11", sede: "Hospital General de Medellín", servicio: "Hospitalización General", piso: 2, estado: "Ocupada",    aislamiento: false },
  { _id: "HGM-HOS-12", sede: "Hospital General de Medellín", servicio: "Hospitalización General", piso: 2, estado: "Ocupada",    aislamiento: false },
  { _id: "HGM-HOS-13", sede: "Hospital General de Medellín", servicio: "Hospitalización General", piso: 2, estado: "En limpieza", aislamiento: false },
  { _id: "MFS-PED-01", sede: "Hospital Marco Fidel Suárez",  servicio: "Pediatría", piso: 1, estado: "Ocupada",    aislamiento: false },
  { _id: "MFS-PED-02", sede: "Hospital Marco Fidel Suárez",  servicio: "Pediatría", piso: 1, estado: "Disponible", aislamiento: false },
  { _id: "MFS-HOS-05", sede: "Hospital Marco Fidel Suárez",  servicio: "Hospitalización General", piso: 3, estado: "Ocupada", aislamiento: false },
  { _id: "RIO-HOS-07", sede: "Hospital San Juan de Dios Rionegro", servicio: "Hospitalización General", piso: 2, estado: "Ocupada", aislamiento: false },
  { _id: "RIO-HOS-08", sede: "Hospital San Juan de Dios Rionegro", servicio: "Hospitalización General", piso: 2, estado: "En mantenimiento", aislamiento: false },
  { _id: "LAM-SM-02",  sede: "ESE Hospital La María",        servicio: "Salud Mental", piso: 1, estado: "Ocupada", aislamiento: false }
]);

// =====================================================================
// PACIENTES
// =====================================================================
db.pacientes.insertMany([
  { _id: "1036458721", tipo_documento: "CC", nombres: "María Eugenia", apellidos: "Ospina Tabares", fecha_nacimiento: D("1958-03-14"), sexo: "F", grupo_sanguineo: "O+",
    contacto: { telefono: "3104567890", direccion: "Cra 45 #67-23", municipio: "Medellín",
                contacto_emergencia: { nombre: "Diego Ospina", parentesco: "Hijo", telefono: "3115678901" } },
    aseguramiento: { eps: "Savia Salud", regimen: "Subsidiado" }, alergias: ["Penicilina"], activo: true },

  { _id: "1017889234", tipo_documento: "CC", nombres: "Jhon Fredy", apellidos: "Correa Loaiza", fecha_nacimiento: D("1991-11-02"), sexo: "M", grupo_sanguineo: "A+",
    contacto: { telefono: "3209988776", direccion: "Calle 30 #80-15", municipio: "Bello",
                contacto_emergencia: { nombre: "Sandra Loaiza", parentesco: "Madre", telefono: "3002233445" } },
    aseguramiento: { eps: "Sura", regimen: "Contributivo" }, alergias: [], activo: true },

  { _id: "1152004477", tipo_documento: "CC", nombres: "Juliana", apellidos: "Betancur Mesa", fecha_nacimiento: D("1996-07-21"), sexo: "F", grupo_sanguineo: "B+",
    contacto: { telefono: "3156677889", direccion: "Cra 70 #44-10", municipio: "Medellín",
                contacto_emergencia: { nombre: "Alberto Betancur", parentesco: "Padre", telefono: "3187766554" } },
    aseguramiento: { eps: "Nueva EPS", regimen: "Contributivo" }, alergias: ["Sulfas", "Dipirona"], activo: true },

  { _id: "70884512", tipo_documento: "CC", nombres: "Ramón Antonio", apellidos: "Úsuga Pérez", fecha_nacimiento: D("1949-01-30"), sexo: "M", grupo_sanguineo: "O-",
    contacto: { telefono: "3123344556", direccion: "Vereda La Honda", municipio: "Rionegro",
                contacto_emergencia: { nombre: "Gloria Pérez", parentesco: "Esposa", telefono: "3144455667" } },
    aseguramiento: { eps: "Savia Salud", regimen: "Subsidiado" }, alergias: [], activo: true },

  { _id: "1098776543", tipo_documento: "TI", nombres: "Samuel", apellidos: "Quintero Agudelo", fecha_nacimiento: D("2014-09-08"), sexo: "M", grupo_sanguineo: "A-",
    contacto: { telefono: "3167788990", direccion: "Calle 48 #52-30", municipio: "Bello",
                contacto_emergencia: { nombre: "Marcela Agudelo", parentesco: "Madre", telefono: "3167788990" } },
    aseguramiento: { eps: "Coosalud", regimen: "Subsidiado" }, alergias: ["Látex"], activo: true },

  { _id: "43567812", tipo_documento: "CC", nombres: "Beatriz Elena", apellidos: "Jaramillo Ruiz", fecha_nacimiento: D("1972-05-19"), sexo: "F", grupo_sanguineo: "AB+",
    contacto: { telefono: "3011122334", direccion: "Cra 50 #10-20", municipio: "Itagüí",
                contacto_emergencia: { nombre: "Carlos Ruiz", parentesco: "Hermano", telefono: "3019988776" } },
    aseguramiento: { eps: "Sura", regimen: "Contributivo" }, alergias: [], activo: true },

  { _id: "1040223344", tipo_documento: "CC", nombres: "Esteban", apellidos: "Montoya Giraldo", fecha_nacimiento: D("1988-12-11"), sexo: "M", grupo_sanguineo: "O+",
    contacto: { telefono: "3198877665", direccion: "Calle 9 Sur #43-18", municipio: "Envigado",
                contacto_emergencia: { nombre: "Laura Giraldo", parentesco: "Hermana", telefono: "3135544332" } },
    aseguramiento: { eps: "Nueva EPS", regimen: "Contributivo" }, alergias: [], activo: true },

  { _id: "21456098", tipo_documento: "CC", nombres: "Rosa Amelia", apellidos: "Cadavid Londoño", fecha_nacimiento: D("1943-08-25"), sexo: "F", grupo_sanguineo: "B-",
    contacto: { telefono: "3176655443", direccion: "Cra 12 #8-40", municipio: "Marinilla",
                contacto_emergencia: { nombre: "Nelson Cadavid", parentesco: "Hijo", telefono: "3102211334" } },
    aseguramiento: { eps: "Savia Salud", regimen: "Subsidiado" }, alergias: ["Penicilina", "AINES"], activo: true },

  { _id: "1128334455", tipo_documento: "CC", nombres: "Daniela", apellidos: "Arroyave Sierra", fecha_nacimiento: D("1999-02-17"), sexo: "F", grupo_sanguineo: "A+",
    contacto: { telefono: "3144433221", direccion: "Cra 65 #30-55", municipio: "Medellín",
                contacto_emergencia: { nombre: "Olga Sierra", parentesco: "Madre", telefono: "3123322110" } },
    aseguramiento: { eps: "Coosalud", regimen: "Subsidiado" }, alergias: [], activo: true },

  { _id: "8456123", tipo_documento: "CC", nombres: "Gustavo", apellidos: "Hincapié Marín", fecha_nacimiento: D("1965-10-05"), sexo: "M", grupo_sanguineo: "AB-",
    contacto: { telefono: "3109876543", direccion: "Calle 77 Sur #40-12", municipio: "Sabaneta",
                contacto_emergencia: { nombre: "Clara Marín", parentesco: "Esposa", telefono: "3101234567" } },
    aseguramiento: { eps: "Sura", regimen: "Contributivo" }, alergias: [], activo: true },

  { _id: "1193445566", tipo_documento: "RC", nombres: "Mariana", apellidos: "Echeverri Soto", fecha_nacimiento: D("2021-04-03"), sexo: "F", grupo_sanguineo: "O+",
    contacto: { telefono: "3185566778", direccion: "Calle 20 #15-09", municipio: "Bello",
                contacto_emergencia: { nombre: "Paola Soto", parentesco: "Madre", telefono: "3185566778" } },
    aseguramiento: { eps: "Savia Salud", regimen: "Subsidiado" }, alergias: [], activo: true },

  { _id: "71223344", tipo_documento: "CC", nombres: "Óscar Iván", apellidos: "Palacio Durán", fecha_nacimiento: D("1979-06-28"), sexo: "M", grupo_sanguineo: "A+",
    contacto: { telefono: "3112233445", direccion: "Cra 33 #5-77", municipio: "Medellín",
                contacto_emergencia: { nombre: "Yuliana Durán", parentesco: "Esposa", telefono: "3119988770" } },
    aseguramiento: { eps: "Nueva EPS", regimen: "Contributivo" }, alergias: [], activo: true }
]);

// =====================================================================
// HOSPITALIZACIONES
// =====================================================================
db.hospitalizaciones.insertMany([

  // --- 1. EPOC reagudizado en UCI, egresado --------------------------
  { _id: "HOSP-2026-0001", paciente_id: "1036458721", medico_tratante_id: "MD-002",
    cama_id: "HGM-UCI-02", sede: "Hospital General de Medellín", servicio: "UCI",
    fecha_ingreso: DT("2026-08-03T07:15:00"), fecha_egreso: DT("2026-08-14T11:00:00"),
    estado: "Egresado", via_ingreso: "Urgencias",
    motivo_consulta: "Disnea progresiva y tos productiva de 5 días de evolución",
    diagnosticos: [
      { codigo_cie10: "J440", tipo: "Principal",   fecha: DT("2026-08-03T08:00:00") },
      { codigo_cie10: "I10",  tipo: "Relacionado", fecha: DT("2026-08-03T08:00:00") }
    ],
    evoluciones: [
      { fecha: DT("2026-08-04T06:30:00"), medico_id: "MD-002", nota: "Paciente con mejoría parcial del patrón respiratorio. Continúa oxígeno por cánula.",
        signos_vitales: { ta_sistolica: 142, ta_diastolica: 88, fc: 96, fr: 24, temperatura: 37.2, saturacion_o2: 90 } },
      { fecha: DT("2026-08-08T06:40:00"), medico_id: "MD-002", nota: "Afebril, tolera destete de oxígeno. Se ajusta broncodilatador.",
        signos_vitales: { ta_sistolica: 134, ta_diastolica: 82, fc: 84, fr: 20, temperatura: 36.6, saturacion_o2: 93 } },
      { fecha: DT("2026-08-13T06:20:00"), medico_id: "MD-001", nota: "Estable. Se planea egreso con control ambulatorio por neumología.",
        signos_vitales: { ta_sistolica: 128, ta_diastolica: 78, fc: 78, fr: 18, temperatura: 36.4, saturacion_o2: 95 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-006", dosis: "2 puff", via: "Inhalatoria",  frecuencia_horas: 6,  fecha: DT("2026-08-03T09:00:00") },
      { medicamento_id: "MED-007", dosis: "1 g",    via: "Intravenosa",  frecuencia_horas: 12, fecha: DT("2026-08-03T10:00:00") },
      { medicamento_id: "MED-003", dosis: "20 mg",  via: "Oral",         frecuencia_horas: 24, fecha: DT("2026-08-04T08:00:00") }
    ],
    dias_estancia: 11, activo: true,
    auditoria: { creado_por: "admision.hgm", fecha_creacion: DT("2026-08-03T07:20:00") } },

  // --- 2. Neumonía pediátrica, egresado ------------------------------
  { _id: "HOSP-2026-0002", paciente_id: "1098776543", medico_tratante_id: "MD-003",
    cama_id: "MFS-PED-01", sede: "Hospital Marco Fidel Suárez", servicio: "Pediatría",
    fecha_ingreso: DT("2026-08-21T14:40:00"), fecha_egreso: DT("2026-08-27T10:30:00"),
    estado: "Egresado", via_ingreso: "Urgencias",
    motivo_consulta: "Fiebre de 39°C y dificultad respiratoria",
    diagnosticos: [ { codigo_cie10: "J18", tipo: "Principal", fecha: DT("2026-08-21T16:00:00") } ],
    evoluciones: [
      { fecha: DT("2026-08-22T07:00:00"), medico_id: "MD-003", nota: "Persiste fiebre. Radiografía con consolidación basal derecha.",
        signos_vitales: { ta_sistolica: 98, ta_diastolica: 60, fc: 118, fr: 30, temperatura: 38.9, saturacion_o2: 92 } },
      { fecha: DT("2026-08-25T07:10:00"), medico_id: "MD-003", nota: "Afebril por 48 horas, buena tolerancia a vía oral.",
        signos_vitales: { ta_sistolica: 100, ta_diastolica: 62, fc: 98, fr: 24, temperatura: 36.8, saturacion_o2: 96 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-001", dosis: "750 mg", via: "Intravenosa", frecuencia_horas: 8, fecha: DT("2026-08-21T17:00:00") },
      { medicamento_id: "MED-002", dosis: "250 mg", via: "Oral",        frecuencia_horas: 6, fecha: DT("2026-08-21T18:00:00") }
    ],
    dias_estancia: 6, activo: true,
    auditoria: { creado_por: "admision.mfs", fecha_creacion: DT("2026-08-21T14:45:00") } },

  // --- 3. Dengue, egresado (notificación obligatoria) ----------------
  { _id: "HOSP-2026-0003", paciente_id: "1128334455", medico_tratante_id: "MD-006",
    cama_id: "MFS-HOS-05", sede: "Hospital Marco Fidel Suárez", servicio: "Hospitalización General",
    fecha_ingreso: DT("2026-09-02T09:05:00"), fecha_egreso: DT("2026-09-06T12:00:00"),
    estado: "Egresado", via_ingreso: "Urgencias",
    motivo_consulta: "Fiebre, mialgias y cefalea retroocular de 4 días",
    diagnosticos: [ { codigo_cie10: "A90", tipo: "Principal", fecha: DT("2026-09-02T10:00:00") } ],
    evoluciones: [
      { fecha: DT("2026-09-03T07:00:00"), medico_id: "MD-006", nota: "Hemograma con trombocitopenia leve. Hidratación IV continua.",
        signos_vitales: { ta_sistolica: 108, ta_diastolica: 66, fc: 92, fr: 18, temperatura: 38.4, saturacion_o2: 97 } },
      { fecha: DT("2026-09-05T07:00:00"), medico_id: "MD-006", nota: "Plaquetas en ascenso, afebril. Se notifica al SIVIGILA.",
        signos_vitales: { ta_sistolica: 112, ta_diastolica: 70, fc: 80, fr: 17, temperatura: 36.5, saturacion_o2: 98 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-005", dosis: "500 mL", via: "Intravenosa", frecuencia_horas: 8, fecha: DT("2026-09-02T11:00:00") },
      { medicamento_id: "MED-002", dosis: "1 g",    via: "Oral",        frecuencia_horas: 8, fecha: DT("2026-09-02T12:00:00") }
    ],
    dias_estancia: 4, activo: true,
    auditoria: { creado_por: "admision.mfs", fecha_creacion: DT("2026-09-02T09:10:00") } },

  // --- 4. IAM en UCI, activa -----------------------------------------
  { _id: "HOSP-2026-0004", paciente_id: "8456123", medico_tratante_id: "MD-005",
    cama_id: "HGM-UCI-01", sede: "Hospital General de Medellín", servicio: "UCI",
    fecha_ingreso: DT("2026-10-28T03:22:00"), fecha_egreso: null,
    estado: "Activa", via_ingreso: "Urgencias",
    motivo_consulta: "Dolor torácico opresivo irradiado a brazo izquierdo",
    diagnosticos: [
      { codigo_cie10: "I219", tipo: "Principal",   fecha: DT("2026-10-28T04:00:00") },
      { codigo_cie10: "I10",  tipo: "Relacionado", fecha: DT("2026-10-28T04:00:00") },
      { codigo_cie10: "E119", tipo: "Relacionado", fecha: DT("2026-10-28T04:00:00") }
    ],
    evoluciones: [
      { fecha: DT("2026-10-29T06:00:00"), medico_id: "MD-005", nota: "Post-angioplastia primaria. Hemodinámicamente estable.",
        signos_vitales: { ta_sistolica: 118, ta_diastolica: 72, fc: 70, fr: 16, temperatura: 36.5, saturacion_o2: 97 } },
      { fecha: DT("2026-11-02T06:00:00"), medico_id: "MD-005", nota: "Sin dolor torácico. Se inicia rehabilitación cardíaca fase I.",
        signos_vitales: { ta_sistolica: 122, ta_diastolica: 74, fc: 68, fr: 16, temperatura: 36.3, saturacion_o2: 98 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-003", dosis: "20 mg",  via: "Oral",        frecuencia_horas: 24, fecha: DT("2026-10-28T08:00:00") },
      { medicamento_id: "MED-004", dosis: "10 UI",  via: "Subcutánea",  frecuencia_horas: 8,  fecha: DT("2026-10-28T08:30:00") },
      { medicamento_id: "MED-009", dosis: "20 mg",  via: "Oral",        frecuencia_horas: 24, fecha: DT("2026-10-29T07:00:00") }
    ],
    dias_estancia: null, activo: true,
    auditoria: { creado_por: "admision.hgm", fecha_creacion: DT("2026-10-28T03:30:00") } },

  // --- 5. Fractura de fémur, egresado --------------------------------
  { _id: "HOSP-2026-0005", paciente_id: "70884512", medico_tratante_id: "MD-004",
    cama_id: "RIO-HOS-07", sede: "Hospital San Juan de Dios Rionegro", servicio: "Hospitalización General",
    fecha_ingreso: DT("2026-09-15T18:50:00"), fecha_egreso: DT("2026-09-30T09:00:00"),
    estado: "Egresado", via_ingreso: "Urgencias",
    motivo_consulta: "Caída de su propia altura con impotencia funcional de miembro inferior derecho",
    diagnosticos: [
      { codigo_cie10: "S726", tipo: "Principal",    fecha: DT("2026-09-15T20:00:00") },
      { codigo_cie10: "N390", tipo: "Complicación", fecha: DT("2026-09-22T10:00:00") }
    ],
    evoluciones: [
      { fecha: DT("2026-09-17T07:30:00"), medico_id: "MD-004", nota: "Postoperatorio inmediato de osteosíntesis. Herida sin signos de infección.",
        signos_vitales: { ta_sistolica: 136, ta_diastolica: 84, fc: 88, fr: 18, temperatura: 36.9, saturacion_o2: 96 } },
      { fecha: DT("2026-09-22T07:30:00"), medico_id: "MD-004", nota: "Pico febril. Urocultivo positivo, se inicia antibiótico.",
        signos_vitales: { ta_sistolica: 130, ta_diastolica: 80, fc: 102, fr: 20, temperatura: 38.6, saturacion_o2: 95 } },
      { fecha: DT("2026-09-28T07:30:00"), medico_id: "MD-004", nota: "Afebril, deambula con caminador. Apto para egreso.",
        signos_vitales: { ta_sistolica: 128, ta_diastolica: 78, fc: 76, fr: 17, temperatura: 36.5, saturacion_o2: 97 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-008", dosis: "1 g",   via: "Intravenosa", frecuencia_horas: 8,  fecha: DT("2026-09-15T21:00:00") },
      { medicamento_id: "MED-007", dosis: "1 g",   via: "Intravenosa", frecuencia_horas: 24, fecha: DT("2026-09-22T11:00:00") },
      { medicamento_id: "MED-009", dosis: "20 mg", via: "Oral",        frecuencia_horas: 24, fecha: DT("2026-09-16T08:00:00") }
    ],
    dias_estancia: 15, activo: true,
    auditoria: { creado_por: "admision.rio", fecha_creacion: DT("2026-09-15T19:00:00") } },

  // --- 6. Gastroenteritis pediátrica, egresado -----------------------
  { _id: "HOSP-2026-0006", paciente_id: "1193445566", medico_tratante_id: "MD-003",
    cama_id: "MFS-PED-02", sede: "Hospital Marco Fidel Suárez", servicio: "Pediatría",
    fecha_ingreso: DT("2026-10-05T11:10:00"), fecha_egreso: DT("2026-10-08T15:00:00"),
    estado: "Egresado", via_ingreso: "Urgencias",
    motivo_consulta: "Deposiciones líquidas abundantes y signos de deshidratación",
    diagnosticos: [ { codigo_cie10: "A09", tipo: "Principal", fecha: DT("2026-10-05T12:00:00") } ],
    evoluciones: [
      { fecha: DT("2026-10-06T07:00:00"), medico_id: "MD-003", nota: "Mejora el estado de hidratación. Tolera suero oral.",
        signos_vitales: { ta_sistolica: 92, ta_diastolica: 58, fc: 124, fr: 28, temperatura: 37.4, saturacion_o2: 97 } },
      { fecha: DT("2026-10-07T07:00:00"), medico_id: "MD-003", nota: "Dos deposiciones en 24 horas, sin vómito. Se reduce hidratación IV.",
        signos_vitales: { ta_sistolica: 94, ta_diastolica: 60, fc: 110, fr: 26, temperatura: 36.7, saturacion_o2: 98 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-005", dosis: "250 mL", via: "Intravenosa", frecuencia_horas: 6, fecha: DT("2026-10-05T12:30:00") },
      { medicamento_id: "MED-002", dosis: "120 mg", via: "Oral",        frecuencia_horas: 8, fecha: DT("2026-10-05T13:00:00") }
    ],
    dias_estancia: 3, activo: true,
    auditoria: { creado_por: "admision.mfs", fecha_creacion: DT("2026-10-05T11:15:00") } },

  // --- 7. Descompensación diabética, activa --------------------------
  { _id: "HOSP-2026-0007", paciente_id: "43567812", medico_tratante_id: "MD-001",
    cama_id: "HGM-HOS-11", sede: "Hospital General de Medellín", servicio: "Hospitalización General",
    fecha_ingreso: DT("2026-11-01T16:25:00"), fecha_egreso: null,
    estado: "Activa", via_ingreso: "Consulta externa",
    motivo_consulta: "Hiperglicemia sostenida con poliuria y pérdida de peso",
    diagnosticos: [
      { codigo_cie10: "E119", tipo: "Principal",   fecha: DT("2026-11-01T17:00:00") },
      { codigo_cie10: "N390", tipo: "Relacionado", fecha: DT("2026-11-02T09:00:00") }
    ],
    evoluciones: [
      { fecha: DT("2026-11-02T06:45:00"), medico_id: "MD-001", nota: "Glicemias en descenso con esquema de insulina. Urocultivo pendiente.",
        signos_vitales: { ta_sistolica: 138, ta_diastolica: 86, fc: 90, fr: 18, temperatura: 37.1, saturacion_o2: 97 } },
      { fecha: DT("2026-11-05T06:45:00"), medico_id: "MD-001", nota: "Control metabólico aceptable. Educación en autocuidado.",
        signos_vitales: { ta_sistolica: 130, ta_diastolica: 80, fc: 82, fr: 17, temperatura: 36.6, saturacion_o2: 98 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-004", dosis: "8 UI",  via: "Subcutánea",  frecuencia_horas: 8,  fecha: DT("2026-11-01T18:00:00") },
      { medicamento_id: "MED-007", dosis: "1 g",   via: "Intravenosa", frecuencia_horas: 24, fecha: DT("2026-11-02T10:00:00") }
    ],
    dias_estancia: null, activo: true,
    auditoria: { creado_por: "admision.hgm", fecha_creacion: DT("2026-11-01T16:30:00") } },

  // --- 8. Neumonía en adulto mayor, remitido -------------------------
  { _id: "HOSP-2026-0008", paciente_id: "21456098", medico_tratante_id: "MD-006",
    cama_id: "RIO-HOS-07", sede: "Hospital San Juan de Dios Rionegro", servicio: "Hospitalización General",
    fecha_ingreso: DT("2026-10-12T22:05:00"), fecha_egreso: DT("2026-10-16T08:00:00"),
    estado: "Remitido", via_ingreso: "Urgencias",
    motivo_consulta: "Deterioro del estado general, fiebre y desaturación",
    diagnosticos: [
      { codigo_cie10: "J18", tipo: "Principal",   fecha: DT("2026-10-12T23:00:00") },
      { codigo_cie10: "I10", tipo: "Relacionado", fecha: DT("2026-10-12T23:00:00") }
    ],
    evoluciones: [
      { fecha: DT("2026-10-14T07:00:00"), medico_id: "MD-006", nota: "Requiere mayor soporte de oxígeno. Se solicita remisión a UCI.",
        signos_vitales: { ta_sistolica: 100, ta_diastolica: 62, fc: 108, fr: 28, temperatura: 38.8, saturacion_o2: 86 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-007", dosis: "1 g", via: "Intravenosa", frecuencia_horas: 12, fecha: DT("2026-10-12T23:30:00") },
      { medicamento_id: "MED-005", dosis: "500 mL", via: "Intravenosa", frecuencia_horas: 8, fecha: DT("2026-10-13T00:00:00") }
    ],
    dias_estancia: 3, activo: true,
    auditoria: { creado_por: "admision.rio", fecha_creacion: DT("2026-10-12T22:10:00") } },

  // --- 9. Episodio depresivo, activa ---------------------------------
  { _id: "HOSP-2026-0009", paciente_id: "1152004477", medico_tratante_id: "MD-007",
    cama_id: "LAM-SM-02", sede: "ESE Hospital La María", servicio: "Salud Mental",
    fecha_ingreso: DT("2026-10-20T10:00:00"), fecha_egreso: null,
    estado: "Activa", via_ingreso: "Remisión",
    motivo_consulta: "Ánimo deprimido persistente con ideación de desesperanza",
    diagnosticos: [ { codigo_cie10: "F329", tipo: "Principal", fecha: DT("2026-10-20T11:00:00") } ],
    evoluciones: [
      { fecha: DT("2026-10-24T09:00:00"), medico_id: "MD-007", nota: "Adherencia al tratamiento. Participa en terapia grupal.",
        signos_vitales: { ta_sistolica: 112, ta_diastolica: 70, fc: 74, fr: 16, temperatura: 36.4, saturacion_o2: 98 } },
      { fecha: DT("2026-11-03T09:00:00"), medico_id: "MD-007", nota: "Mejoría del patrón de sueño y del apetito.",
        signos_vitales: { ta_sistolica: 114, ta_diastolica: 72, fc: 72, fr: 16, temperatura: 36.5, saturacion_o2: 99 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-010", dosis: "50 mg", via: "Oral", frecuencia_horas: 24, fecha: DT("2026-10-20T12:00:00") }
    ],
    dias_estancia: null, activo: true,
    auditoria: { creado_por: "admision.lam", fecha_creacion: DT("2026-10-20T10:05:00") } },

  // --- 10. Reingreso del mismo paciente del caso 1 -------------------
  { _id: "HOSP-2026-0010", paciente_id: "1036458721", medico_tratante_id: "MD-002",
    cama_id: "HGM-HOS-12", sede: "Hospital General de Medellín", servicio: "Hospitalización General",
    fecha_ingreso: DT("2026-10-30T05:40:00"), fecha_egreso: null,
    estado: "Activa", via_ingreso: "Urgencias",
    motivo_consulta: "Reagudización de EPOC con aumento de la expectoración",
    diagnosticos: [
      { codigo_cie10: "J440", tipo: "Principal", fecha: DT("2026-10-30T06:30:00") },
      { codigo_cie10: "J18",  tipo: "Complicación", fecha: DT("2026-11-01T08:00:00") }
    ],
    evoluciones: [
      { fecha: DT("2026-11-01T06:00:00"), medico_id: "MD-002", nota: "Radiografía muestra nuevo infiltrado. Se escala antibiótico.",
        signos_vitales: { ta_sistolica: 140, ta_diastolica: 86, fc: 98, fr: 26, temperatura: 38.1, saturacion_o2: 89 } },
      { fecha: DT("2026-11-05T06:00:00"), medico_id: "MD-002", nota: "Afebril, mejora la saturación con oxígeno a bajo flujo.",
        signos_vitales: { ta_sistolica: 132, ta_diastolica: 82, fc: 86, fr: 21, temperatura: 36.7, saturacion_o2: 93 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-006", dosis: "2 puff", via: "Inhalatoria", frecuencia_horas: 4,  fecha: DT("2026-10-30T07:00:00") },
      { medicamento_id: "MED-007", dosis: "1 g",    via: "Intravenosa", frecuencia_horas: 12, fecha: DT("2026-11-01T09:00:00") },
      { medicamento_id: "MED-003", dosis: "20 mg",  via: "Oral",        frecuencia_horas: 24, fecha: DT("2026-10-30T08:00:00") }
    ],
    dias_estancia: null, activo: true,
    auditoria: { creado_por: "admision.hgm", fecha_creacion: DT("2026-10-30T05:45:00") } },

  // --- 11. IVU, egresado ---------------------------------------------
  { _id: "HOSP-2026-0011", paciente_id: "1017889234", medico_tratante_id: "MD-001",
    cama_id: "HGM-HOS-13", sede: "Hospital General de Medellín", servicio: "Hospitalización General",
    fecha_ingreso: DT("2026-09-19T13:00:00"), fecha_egreso: DT("2026-09-23T10:00:00"),
    estado: "Egresado", via_ingreso: "Urgencias",
    motivo_consulta: "Dolor lumbar, fiebre y disuria",
    diagnosticos: [ { codigo_cie10: "N390", tipo: "Principal", fecha: DT("2026-09-19T14:00:00") } ],
    evoluciones: [
      { fecha: DT("2026-09-21T07:00:00"), medico_id: "MD-001", nota: "Afebril a las 48 horas de antibiótico. Función renal normal.",
        signos_vitales: { ta_sistolica: 120, ta_diastolica: 76, fc: 80, fr: 17, temperatura: 36.6, saturacion_o2: 98 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-007", dosis: "1 g", via: "Intravenosa", frecuencia_horas: 24, fecha: DT("2026-09-19T15:00:00") },
      { medicamento_id: "MED-008", dosis: "1 g", via: "Intravenosa", frecuencia_horas: 8,  fecha: DT("2026-09-19T15:30:00") }
    ],
    dias_estancia: 4, activo: true,
    auditoria: { creado_por: "admision.hgm", fecha_creacion: DT("2026-09-19T13:05:00") } },

  // --- 12. Gastroenteritis adulto, egresado --------------------------
  { _id: "HOSP-2026-0012", paciente_id: "1040223344", medico_tratante_id: "MD-006",
    cama_id: "MFS-HOS-05", sede: "Hospital Marco Fidel Suárez", servicio: "Hospitalización General",
    fecha_ingreso: DT("2026-10-18T08:30:00"), fecha_egreso: DT("2026-10-20T16:00:00"),
    estado: "Egresado", via_ingreso: "Urgencias",
    motivo_consulta: "Diarrea y vómito de 48 horas con intolerancia a la vía oral",
    diagnosticos: [ { codigo_cie10: "A09", tipo: "Principal", fecha: DT("2026-10-18T09:00:00") } ],
    evoluciones: [
      { fecha: DT("2026-10-19T07:00:00"), medico_id: "MD-006", nota: "Hidratación adecuada, tolera dieta blanda.",
        signos_vitales: { ta_sistolica: 118, ta_diastolica: 74, fc: 84, fr: 18, temperatura: 36.8, saturacion_o2: 98 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-005", dosis: "500 mL", via: "Intravenosa", frecuencia_horas: 6, fecha: DT("2026-10-18T09:30:00") },
      { medicamento_id: "MED-009", dosis: "20 mg",  via: "Oral",        frecuencia_horas: 24, fecha: DT("2026-10-18T10:00:00") }
    ],
    dias_estancia: 2, activo: true,
    auditoria: { creado_por: "admision.mfs", fecha_creacion: DT("2026-10-18T08:35:00") } },

  // --- 13. Crisis hipertensiva, egresado -----------------------------
  { _id: "HOSP-2026-0013", paciente_id: "71223344", medico_tratante_id: "MD-005",
    cama_id: "HGM-HOS-11", sede: "Hospital General de Medellín", servicio: "Hospitalización General",
    fecha_ingreso: DT("2026-09-28T20:15:00"), fecha_egreso: DT("2026-10-01T11:00:00"),
    estado: "Egresado", via_ingreso: "Urgencias",
    motivo_consulta: "Cefalea intensa con cifras tensionales de 190/110",
    diagnosticos: [ { codigo_cie10: "I10", tipo: "Principal", fecha: DT("2026-09-28T21:00:00") } ],
    evoluciones: [
      { fecha: DT("2026-09-29T07:00:00"), medico_id: "MD-005", nota: "Cifras tensionales en descenso progresivo, sin daño de órgano blanco.",
        signos_vitales: { ta_sistolica: 156, ta_diastolica: 94, fc: 78, fr: 16, temperatura: 36.5, saturacion_o2: 98 } },
      { fecha: DT("2026-09-30T07:00:00"), medico_id: "MD-005", nota: "Tensión controlada con terapia oral. Se programa egreso.",
        signos_vitales: { ta_sistolica: 134, ta_diastolica: 82, fc: 74, fr: 16, temperatura: 36.4, saturacion_o2: 99 } }
    ],
    medicamentos_administrados: [
      { medicamento_id: "MED-003", dosis: "20 mg", via: "Oral", frecuencia_horas: 12, fecha: DT("2026-09-28T22:00:00") }
    ],
    dias_estancia: 3, activo: true,
    auditoria: { creado_por: "admision.hgm", fecha_creacion: DT("2026-09-28T20:20:00") } },

  // --- 14. Caso ya anulado (soft delete previo, p. ej. duplicado) ----
  { _id: "HOSP-2026-0014", paciente_id: "1017889234", medico_tratante_id: "MD-001",
    cama_id: "HGM-HOS-13", sede: "Hospital General de Medellín", servicio: "Hospitalización General",
    fecha_ingreso: DT("2026-09-19T13:02:00"), fecha_egreso: DT("2026-09-19T13:20:00"),
    estado: "Egresado", via_ingreso: "Urgencias",
    motivo_consulta: "Registro duplicado generado por error de admisión",
    diagnosticos: [ { codigo_cie10: "N390", tipo: "Principal", fecha: DT("2026-09-19T13:10:00") } ],
    evoluciones: [],
    medicamentos_administrados: [],
    dias_estancia: 0, activo: false,
    auditoria: { creado_por: "admision.hgm", fecha_creacion: DT("2026-09-19T13:02:00"),
                 modificado_por: "auditoria.calidad", fecha_modificacion: DT("2026-09-20T09:00:00") } }
]);

// =====================================================================
// VERIFICACIÓN
// =====================================================================
print("=== Conteo de documentos ===");
["diagnosticos_cie10", "medicamentos", "medicos", "camas",
 "pacientes", "hospitalizaciones"].forEach(function (c) {
  print("  " + c + ": " + db.getCollection(c).countDocuments());
});
print("  hospitalizaciones activas (soft delete): " +
      db.hospitalizaciones.countDocuments({ activo: true }));
