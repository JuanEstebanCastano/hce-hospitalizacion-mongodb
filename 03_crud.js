// =====================================================================
// Script 03: Operaciones de manipulación (CRUD)
// Base: hce_antioquia   |   Ejecución: mongosh < 03_crud.js
// -----------------------------------------------------------------
// Cubre el punto 2 del enunciado:
//   C -> insertar documentos
//   R -> lectura con proyección y filtros sobre arreglos
//   U -> actualizar campos simples Y campos anidados
//   D -> soft delete y eliminación definitiva
// =====================================================================

use("hce_antioquia");

const DT = (s) => new Date(s + "Z");
const sep = (t) => print("\n========== " + t + " ==========");

// =====================================================================
// C — CREATE
// =====================================================================

sep("C1. Insertar un paciente nuevo (insertOne)");
db.pacientes.insertOne({
  _id: "1214556677",
  tipo_documento: "CC",
  nombres: "Valentina",
  apellidos: "Agudelo Ramírez",
  fecha_nacimiento: new Date("1993-05-26T00:00:00Z"),
  sexo: "F",
  grupo_sanguineo: "O+",
  contacto: {
    telefono: "3012345678",
    direccion: "Cra 43A #18-50",
    municipio: "Medellín",
    contacto_emergencia: { nombre: "Hernán Agudelo", parentesco: "Padre", telefono: "3019876543" }
  },
  aseguramiento: { eps: "Sura", regimen: "Contributivo" },
  alergias: ["Yodo"],
  activo: true
});
printjson(db.pacientes.findOne({ _id: "1214556677" }));

sep("C2. Insertar una hospitalización completa (insertOne con arreglos anidados)");
db.hospitalizaciones.insertOne({
  _id: "HOSP-2026-0015",
  paciente_id: "1214556677",
  medico_tratante_id: "MD-001",
  cama_id: "HGM-UCI-03",
  sede: "Hospital General de Medellín",
  servicio: "UCI",
  fecha_ingreso: DT("2026-11-06T02:40:00"),
  fecha_egreso: null,
  estado: "Activa",
  via_ingreso: "Urgencias",
  motivo_consulta: "Fiebre alta y signos de respuesta inflamatoria sistémica",
  diagnosticos: [
    { codigo_cie10: "J18", tipo: "Principal", fecha: DT("2026-11-06T03:30:00") }
  ],
  evoluciones: [
    { fecha: DT("2026-11-06T07:00:00"), medico_id: "MD-001",
      nota: "Ingreso a UCI por criterios de sepsis. Se inicia antibiótico empírico.",
      signos_vitales: { ta_sistolica: 96, ta_diastolica: 58, fc: 116, fr: 26, temperatura: 39.1, saturacion_o2: 91 } }
  ],
  medicamentos_administrados: [
    { medicamento_id: "MED-007", dosis: "1 g", via: "Intravenosa", frecuencia_horas: 12, fecha: DT("2026-11-06T04:00:00") }
  ],
  dias_estancia: null,
  activo: true,
  auditoria: { creado_por: "admision.hgm", fecha_creacion: DT("2026-11-06T02:45:00") }
});
print("Insertada: " + db.hospitalizaciones.countDocuments({ _id: "HOSP-2026-0015" }));

sep("C3. Insertar varios medicamentos al catálogo (insertMany)");
db.medicamentos.insertMany([
  { _id: "MED-011", nombre: "Vancomicina", principio_activo: "Vancomicina clorhidrato", forma_farmaceutica: "Ampolla", concentracion: "500 mg", pos: true },
  { _id: "MED-012", nombre: "Losartán",    principio_activo: "Losartán potásico",       forma_farmaceutica: "Tableta", concentracion: "50 mg",  pos: true }
]);
print("Medicamentos en catálogo: " + db.medicamentos.countDocuments());

// =====================================================================
// R — READ
// =====================================================================

sep("R1. Hospitalizaciones activas con proyección");
db.hospitalizaciones.find(
  { estado: "Activa", activo: true },
  { paciente_id: 1, sede: 1, servicio: 1, fecha_ingreso: 1, "diagnosticos.codigo_cie10": 1 }
).sort({ fecha_ingreso: -1 }).forEach(printjson);

sep("R2. Pacientes con alergia a la penicilina (búsqueda dentro de un arreglo)");
db.pacientes.find(
  { alergias: "Penicilina", activo: true },
  { nombres: 1, apellidos: 1, alergias: 1 }
).forEach(printjson);

sep("R3. Episodios con fiebre > 38.5 °C en alguna evolución ($elemMatch)");
db.hospitalizaciones.find(
  { evoluciones: { $elemMatch: { "signos_vitales.temperatura": { $gt: 38.5 } } }, activo: true },
  { paciente_id: 1, motivo_consulta: 1 }
).forEach(printjson);

sep("R4. Estancias largas: más de 10 días");
db.hospitalizaciones.find(
  { dias_estancia: { $gt: 10 }, activo: true },
  { paciente_id: 1, sede: 1, dias_estancia: 1 }
).forEach(printjson);

// =====================================================================
// U — UPDATE
// =====================================================================

sep("U1. Campo SIMPLE: cambiar el estado de una cama");
db.camas.updateOne(
  { _id: "HGM-UCI-03" },
  { $set: { estado: "Ocupada" } }
);
printjson(db.camas.findOne({ _id: "HGM-UCI-03" }));

sep("U2. Campo ANIDADO con notación de punto: teléfono del contacto de emergencia");
db.pacientes.updateOne(
  { _id: "1036458721" },
  { $set: { "contacto.contacto_emergencia.telefono": "3157788991" } }
);
printjson(db.pacientes.findOne({ _id: "1036458721" }, { "contacto.contacto_emergencia": 1 }));

sep("U3. $push: agregar una evolución al arreglo anidado");
db.hospitalizaciones.updateOne(
  { _id: "HOSP-2026-0015" },
  { $push: { evoluciones: {
      fecha: DT("2026-11-07T06:30:00"), medico_id: "MD-002",
      nota: "Descenso de la fiebre y mejoría de la perfusión. Se mantiene esquema antibiótico.",
      signos_vitales: { ta_sistolica: 108, ta_diastolica: 66, fc: 94, fr: 20, temperatura: 37.3, saturacion_o2: 95 }
    } },
    $set: { "auditoria.modificado_por": "MD-002",
            "auditoria.fecha_modificacion": DT("2026-11-07T06:35:00") } }
);
print("Evoluciones registradas: " +
      db.hospitalizaciones.findOne({ _id: "HOSP-2026-0015" }).evoluciones.length);

sep("U4. Operador posicional $: corregir la dosis de un medicamento YA administrado");
db.hospitalizaciones.updateOne(
  { _id: "HOSP-2026-0015", "medicamentos_administrados.medicamento_id": "MED-007" },
  { $set: { "medicamentos_administrados.$.dosis": "2 g",
            "medicamentos_administrados.$.frecuencia_horas": 24 } }
);
printjson(db.hospitalizaciones.findOne({ _id: "HOSP-2026-0015" }, { medicamentos_administrados: 1 }));

sep("U5. $addToSet: registrar una alergia nueva sin duplicar");
db.pacientes.updateOne(
  { _id: "1017889234" },
  { $addToSet: { alergias: "Ceftriaxona" } }
);
printjson(db.pacientes.findOne({ _id: "1017889234" }, { nombres: 1, alergias: 1 }));

sep("U6. updateMany: marcar como 'En limpieza' las camas de un servicio cerrado");
const resUM = db.camas.updateMany(
  { sede: "Hospital San Juan de Dios Rionegro", estado: "Disponible" },
  { $set: { estado: "En limpieza" } }
);
print("Camas modificadas: " + resUM.modifiedCount);

sep("U7. Cierre de episodio: egreso + cálculo de días de estancia");
const h = db.hospitalizaciones.findOne({ _id: "HOSP-2026-0009" });
const fechaEgreso = DT("2026-11-07T10:00:00");
const dias = Math.round((fechaEgreso - h.fecha_ingreso) / (1000 * 60 * 60 * 24));
db.hospitalizaciones.updateOne(
  { _id: "HOSP-2026-0009" },
  { $set: { estado: "Egresado", fecha_egreso: fechaEgreso, dias_estancia: dias,
            "auditoria.modificado_por": "MD-007",
            "auditoria.fecha_modificacion": fechaEgreso } }
);
printjson(db.hospitalizaciones.findOne({ _id: "HOSP-2026-0009" },
          { estado: 1, fecha_egreso: 1, dias_estancia: 1 }));

sep("U8. $pull: retirar un diagnóstico mal codificado del arreglo");
db.hospitalizaciones.updateOne(
  { _id: "HOSP-2026-0004" },
  { $pull: { diagnosticos: { codigo_cie10: "E119", tipo: "Relacionado" } } }
);
printjson(db.hospitalizaciones.findOne({ _id: "HOSP-2026-0004" }, { diagnosticos: 1 }));

// =====================================================================
// D — DELETE
// =====================================================================

sep("D1. SOFT DELETE de una hospitalización (anulación lógica)");
// Justificación: en una HCE NO se borran episodios clínicos. Se anulan
// lógicamente para preservar la trazabilidad y la auditoría, conforme a
// la Resolución 1995 de 1999 sobre historias clínicas.
db.hospitalizaciones.updateOne(
  { _id: "HOSP-2026-0012" },
  { $set: { activo: false,
            motivo_anulacion: "Episodio duplicado detectado en auditoría de calidad",
            "auditoria.modificado_por": "auditoria.calidad",
            "auditoria.fecha_modificacion": DT("2026-11-07T08:00:00") } }
);
printjson(db.hospitalizaciones.findOne({ _id: "HOSP-2026-0012" },
          { activo: 1, motivo_anulacion: 1, auditoria: 1 }));
print("Total: " + db.hospitalizaciones.countDocuments() +
      " | Visibles (activo:true): " + db.hospitalizaciones.countDocuments({ activo: true }));

sep("D2. SOFT DELETE de un paciente (inactivación)");
db.pacientes.updateOne({ _id: "1193445566" }, { $set: { activo: false } });
print("Pacientes activos: " + db.pacientes.countDocuments({ activo: true }) +
      " de " + db.pacientes.countDocuments());

sep("D3. Restaurar un documento con soft delete (reversibilidad)");
db.hospitalizaciones.updateOne(
  { _id: "HOSP-2026-0012" },
  { $set: { activo: true }, $unset: { motivo_anulacion: "" } }
);
print("Restaurado. Visibles: " + db.hospitalizaciones.countDocuments({ activo: true }));

sep("D4. ELIMINACIÓN DEFINITIVA de un registro de catálogo (deleteOne)");
// Justificación: un medicamento nunca usado en el catálogo sí puede
// borrarse físicamente, porque no es un dato clínico de un paciente.
const usado = db.hospitalizaciones.countDocuments({ "medicamentos_administrados.medicamento_id": "MED-012" });
if (usado === 0) {
  db.medicamentos.deleteOne({ _id: "MED-012" });
  print("MED-012 eliminado definitivamente (no estaba referenciado).");
} else {
  print("MED-012 NO se elimina: está referenciado en " + usado + " episodio(s).");
}
print("Medicamentos en catálogo: " + db.medicamentos.countDocuments());

sep("D5. deleteMany con guarda de integridad referencial");
const borrables = db.medicamentos.find({}, { _id: 1 }).toArray()
  .map(m => m._id)
  .filter(id => db.hospitalizaciones.countDocuments({ "medicamentos_administrados.medicamento_id": id }) === 0
                && id === "MED-011");
const resDM = db.medicamentos.deleteMany({ _id: { $in: borrables } });
print("Eliminados: " + resDM.deletedCount);

sep("ESTADO FINAL");
["pacientes", "medicos", "camas", "medicamentos",
 "diagnosticos_cie10", "hospitalizaciones"].forEach(function (c) {
  print("  " + c + ": " + db.getCollection(c).countDocuments());
});
