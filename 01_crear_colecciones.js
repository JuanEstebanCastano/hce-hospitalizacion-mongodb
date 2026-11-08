// =====================================================================
// Proyecto de Aula - Bases de Datos II
// HCE Básica | Subsistema de Hospitalización
// Red de Hospitales Públicos - Gobernación de Antioquia
// -----------------------------------------------------------------
// Script 01: Creación de la base de datos, colecciones, validadores
//            de esquema ($jsonSchema) e índices.
// Motor: MongoDB 7.x   |   Ejecución: mongosh < 01_crear_colecciones.js
// =====================================================================

use("hce_antioquia");

// --- Limpieza previa (idempotencia: el script se puede re-ejecutar) ---
["hospitalizaciones", "pacientes", "medicos", "camas",
 "medicamentos", "diagnosticos_cie10"].forEach(function (c) {
  db.getCollection(c).drop();
});

// =====================================================================
// 1. COLECCIONES DE CATÁLOGO (poco volumen, alta referencia)
// =====================================================================

// --- diagnosticos_cie10 ----------------------------------------------
db.createCollection("diagnosticos_cie10", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "nombre", "capitulo"],
      properties: {
        _id:      { bsonType: "string", description: "Código CIE-10, ej. J18" },
        nombre:   { bsonType: "string" },
        capitulo: { bsonType: "string" },
        es_notificacion_obligatoria: { bsonType: "bool" }
      }
    }
  },
  validationLevel: "strict"
});

// --- medicamentos -----------------------------------------------------
db.createCollection("medicamentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "nombre", "forma_farmaceutica"],
      properties: {
        _id:                { bsonType: "string", description: "Código interno, ej. MED-001" },
        nombre:             { bsonType: "string" },
        principio_activo:   { bsonType: "string" },
        forma_farmaceutica: { enum: ["Tableta", "Cápsula", "Ampolla", "Jarabe", "Solución IV", "Inhalador"] },
        concentracion:      { bsonType: "string" },
        pos:                { bsonType: "bool", description: "Incluido en el Plan de Beneficios" }
      }
    }
  }
});

// =====================================================================
// 2. COLECCIONES MAESTRAS
// =====================================================================

// --- pacientes --------------------------------------------------------
// Decisión de diseño: los datos de contacto y la info de aseguramiento
// se EMBEBEN porque siempre se consultan junto con el paciente y
// no tienen vida propia fuera de él (relación 1:1).
db.createCollection("pacientes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "tipo_documento", "nombres", "apellidos",
                 "fecha_nacimiento", "sexo", "activo"],
      properties: {
        _id:              { bsonType: "string", description: "Número de documento" },
        tipo_documento:   { enum: ["CC", "TI", "RC", "CE", "PA", "PEP"] },
        nombres:          { bsonType: "string" },
        apellidos:        { bsonType: "string" },
        fecha_nacimiento: { bsonType: "date" },
        sexo:             { enum: ["M", "F"] },
        grupo_sanguineo:  { bsonType: "string" },
        contacto: {
          bsonType: "object",
          properties: {
            telefono:  { bsonType: "string" },
            direccion: { bsonType: "string" },
            municipio: { bsonType: "string" },
            contacto_emergencia: {
              bsonType: "object",
              properties: {
                nombre:    { bsonType: "string" },
                parentesco:{ bsonType: "string" },
                telefono:  { bsonType: "string" }
              }
            }
          }
        },
        aseguramiento: {
          bsonType: "object",
          required: ["eps", "regimen"],
          properties: {
            eps:     { bsonType: "string" },
            regimen: { enum: ["Contributivo", "Subsidiado", "Especial", "No afiliado"] }
          }
        },
        alergias: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        activo: { bsonType: "bool", description: "Soft delete" }
      }
    }
  }
});

// --- medicos ----------------------------------------------------------
db.createCollection("medicos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "nombres", "apellidos", "registro_medico", "especialidad", "activo"],
      properties: {
        _id:             { bsonType: "string" },
        nombres:         { bsonType: "string" },
        apellidos:       { bsonType: "string" },
        registro_medico: { bsonType: "string", description: "ReTHUS" },
        especialidad:    { bsonType: "string" },
        sede:            { bsonType: "string" },
        activo:          { bsonType: "bool" }
      }
    }
  }
});

// --- camas ------------------------------------------------------------
db.createCollection("camas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "sede", "servicio", "estado"],
      properties: {
        _id:      { bsonType: "string", description: "ej. HGM-UCI-03" },
        sede:     { bsonType: "string" },
        servicio: { enum: ["UCI", "Hospitalización General", "Pediatría",
                           "Ginecobstetricia", "Urgencias", "Salud Mental"] },
        piso:     { bsonType: "int" },
        estado:   { enum: ["Disponible", "Ocupada", "En mantenimiento", "En limpieza"] },
        aislamiento: { bsonType: "bool" }
      }
    }
  }
});

// =====================================================================
// 3. COLECCIÓN TRANSACCIONAL (el corazón del subsistema)
// =====================================================================
// Decisión de diseño:
//   - evoluciones[] y medicamentos_administrados[] se EMBEBEN porque
//     pertenecen al episodio, se leen siempre con él y su cardinalidad
//     está acotada (decenas, no miles).
//   - paciente_id / medico_tratante_id / cama_id son REFERENCIAS porque
//     esas entidades son compartidas por muchos episodios y cambian
//     de forma independiente (evitamos anomalías de actualización).
//   - Los catálogos se referencian por código y se resuelven con $lookup.
db.createCollection("hospitalizaciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "paciente_id", "medico_tratante_id", "cama_id",
                 "fecha_ingreso", "estado", "activo"],
      properties: {
        _id:                { bsonType: "string", description: "ej. HOSP-2026-0001" },
        paciente_id:        { bsonType: "string" },
        medico_tratante_id: { bsonType: "string" },
        cama_id:            { bsonType: "string" },
        sede:               { bsonType: "string" },
        servicio:           { bsonType: "string" },
        fecha_ingreso:      { bsonType: "date" },
        fecha_egreso:       { bsonType: ["date", "null"] },
        estado:             { enum: ["Activa", "Egresado", "Remitido", "Fallecido"] },
        via_ingreso:        { enum: ["Urgencias", "Consulta externa", "Remisión", "Programada"] },
        motivo_consulta:    { bsonType: "string" },
        diagnosticos: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["codigo_cie10", "tipo"],
            properties: {
              codigo_cie10: { bsonType: "string" },
              tipo:         { enum: ["Principal", "Relacionado", "Complicación"] },
              fecha:        { bsonType: "date" }
            }
          }
        },
        evoluciones: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["fecha", "medico_id", "nota"],
            properties: {
              fecha:     { bsonType: "date" },
              medico_id: { bsonType: "string" },
              nota:      { bsonType: "string" },
              signos_vitales: {
                bsonType: "object",
                properties: {
                  ta_sistolica:  { bsonType: "int" },
                  ta_diastolica: { bsonType: "int" },
                  fc:            { bsonType: "int" },
                  fr:            { bsonType: "int" },
                  temperatura:   { bsonType: "double" },
                  saturacion_o2: { bsonType: "int" }
                }
              }
            }
          }
        },
        medicamentos_administrados: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["medicamento_id", "dosis", "via", "fecha"],
            properties: {
              medicamento_id: { bsonType: "string" },
              dosis:          { bsonType: "string" },
              via:            { enum: ["Oral", "Intravenosa", "Intramuscular",
                                       "Subcutánea", "Inhalatoria", "Tópica"] },
              frecuencia_horas: { bsonType: "int" },
              fecha:          { bsonType: "date" }
            }
          }
        },
        dias_estancia: { bsonType: ["int", "null"] },
        activo:        { bsonType: "bool", description: "Soft delete" },
        auditoria: {
          bsonType: "object",
          properties: {
            creado_por:      { bsonType: "string" },
            fecha_creacion:  { bsonType: "date" },
            modificado_por:  { bsonType: "string" },
            fecha_modificacion: { bsonType: "date" }
          }
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

// =====================================================================
// 4. ÍNDICES
// =====================================================================
db.pacientes.createIndex({ apellidos: 1, nombres: 1 });
db.pacientes.createIndex({ "aseguramiento.eps": 1 });
db.pacientes.createIndex({ activo: 1 });

db.medicos.createIndex({ especialidad: 1 });
db.medicos.createIndex({ registro_medico: 1 }, { unique: true });

db.camas.createIndex({ sede: 1, servicio: 1, estado: 1 });

db.hospitalizaciones.createIndex({ paciente_id: 1, fecha_ingreso: -1 });
db.hospitalizaciones.createIndex({ "diagnosticos.codigo_cie10": 1 });
db.hospitalizaciones.createIndex({ estado: 1, activo: 1 });
db.hospitalizaciones.createIndex({ sede: 1, fecha_ingreso: -1 });
// Índice de texto para búsquedas en notas de evolución
db.hospitalizaciones.createIndex({ motivo_consulta: "text", "evoluciones.nota": "text" });

print("=== Colecciones creadas ===");
db.getCollectionNames().forEach(function (c) { print("  - " + c); });
