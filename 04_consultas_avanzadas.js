// =====================================================================
// Proyecto de Aula - Bases de Datos II
// HCE Básica | Subsistema de Hospitalización
// Red de Hospitales Públicos - Gobernación de Antioquia
// -----------------------------------------------------------------
// Script 04: Consultas avanzadas con el Aggregation Framework
// Base: hce_antioquia   |   Ejecución: mongosh < 04_consultas_avanzadas.js
// -----------------------------------------------------------------
// Cubre el punto 3 del enunciado:
//   - Pipelines de agregación de 2 a 4 etapas.
//   - Etapas usadas: $match, $unwind, $group, $project, $lookup, $sort,
//     $limit, $addFields, $bucket.
//   - Cada integrante aporta al menos UNA consulta avanzada propia
//     (ver encabezado de cada bloque y la tabla del README).
// =====================================================================

use("hce_antioquia");

const sep = (t) => print("\n==================== " + t + " ====================");

// =====================================================================
// CONSULTA 1  —  Integrante: Laura
// Reporte epidemiológico: casos de diagnósticos de NOTIFICACIÓN
// OBLIGATORIA (dengue, gastroenteritis...) agrupados por sede.
// Etapas: $match -> $unwind -> $lookup -> $match -> $group -> $sort (4+)
// Objetivo: insumo para vigilancia en salud pública (SIVIGILA).
// =====================================================================
sep("C1 (Laura) - Reporte epidemiológico: notificación obligatoria por sede");
db.hospitalizaciones.aggregate([
  { $match: { activo: true } },
  { $unwind: "$diagnosticos" },
  { $lookup: {
      from: "diagnosticos_cie10",
      localField: "diagnosticos.codigo_cie10",
      foreignField: "_id",
      as: "dx"
  } },
  { $unwind: "$dx" },
  { $match: { "dx.es_notificacion_obligatoria": true } },
  { $group: {
      _id: { sede: "$sede", diagnostico: "$dx.nombre" },
      casos: { $sum: 1 },
      pacientes: { $addToSet: "$paciente_id" }
  } },
  { $project: {
      _id: 0,
      sede: "$_id.sede",
      diagnostico: "$_id.diagnostico",
      casos: 1,
      pacientes_distintos: { $size: "$pacientes" }
  } },
  { $sort: { casos: -1, sede: 1 } }
]).forEach(printjson);

// =====================================================================
// CONSULTA 2  —  Integrante: Jhon Jader Correa
// Indicador de gestión: PROMEDIO de días de estancia por sede y
// servicio, considerando solo episodios ya cerrados (con egreso).
// Etapas: $match -> $group -> $project -> $sort (4)
// Objetivo: comparar la eficiencia de los servicios de hospitalización.
// =====================================================================
sep("C2 (Jhon Jader) - Promedio de estancia por sede y servicio");
db.hospitalizaciones.aggregate([
  { $match: { activo: true, dias_estancia: { $gt: 0 } } },
  { $group: {
      _id: { sede: "$sede", servicio: "$servicio" },
      episodios: { $sum: 1 },
      promedio_estancia: { $avg: "$dias_estancia" },
      estancia_maxima: { $max: "$dias_estancia" },
      estancia_minima: { $min: "$dias_estancia" }
  } },
  { $project: {
      _id: 0,
      sede: "$_id.sede",
      servicio: "$_id.servicio",
      episodios: 1,
      promedio_estancia: { $round: ["$promedio_estancia", 1] },
      estancia_maxima: 1,
      estancia_minima: 1
  } },
  { $sort: { promedio_estancia: -1 } }
]).forEach(printjson);

// =====================================================================
// CONSULTA 3  —  Integrante: Juan Esteban Castaño Montoya
// Consumo farmacéutico: medicamentos MÁS ADMINISTRADOS, resolviendo
// el nombre del medicamento desde el catálogo con $lookup.
// Etapas: $unwind -> $group -> $lookup -> $project -> $sort -> $limit
// Objetivo: apoyar la planeación de compras y abastecimiento.
// =====================================================================
sep("C3 (Juan Esteban) - Top medicamentos administrados (con nombre)");
db.hospitalizaciones.aggregate([
  { $match: { activo: true } },
  { $unwind: "$medicamentos_administrados" },
  { $group: {
      _id: "$medicamentos_administrados.medicamento_id",
      administraciones: { $sum: 1 },
      episodios_distintos: { $addToSet: "$_id" }
  } },
  { $lookup: {
      from: "medicamentos",
      localField: "_id",
      foreignField: "_id",
      as: "med"
  } },
  { $unwind: "$med" },
  { $project: {
      _id: 0,
      medicamento: "$med.nombre",
      forma: "$med.forma_farmaceutica",
      administraciones: 1,
      episodios: { $size: "$episodios_distintos" }
  } },
  { $sort: { administraciones: -1 } },
  { $limit: 5 }
]).forEach(printjson);

// =====================================================================
// CONSULTA 4 (complementaria) - Carga asistencial por médico tratante
// Relaciona hospitalizaciones con el catálogo de médicos y cuenta
// episodios activos vs. cerrados.
// Etapas: $match -> $group -> $lookup -> $project -> $sort
// =====================================================================
sep("C4 - Carga asistencial por médico tratante");
db.hospitalizaciones.aggregate([
  { $match: { activo: true } },
  { $group: {
      _id: "$medico_tratante_id",
      total_episodios: { $sum: 1 },
      activos: { $sum: { $cond: [{ $eq: ["$estado", "Activa"] }, 1, 0] } }
  } },
  { $lookup: {
      from: "medicos", localField: "_id", foreignField: "_id", as: "m"
  } },
  { $unwind: "$m" },
  { $project: {
      _id: 0,
      medico: { $concat: ["$m.nombres", " ", "$m.apellidos"] },
      especialidad: "$m.especialidad",
      sede: "$m.sede",
      total_episodios: 1,
      activos: 1
  } },
  { $sort: { total_episodios: -1 } }
]).forEach(printjson);

// =====================================================================
// CONSULTA 5 (complementaria) - Reingresos: pacientes con más de un
// episodio de hospitalización (indicador de calidad asistencial).
// Etapas: $match -> $group -> $match -> $lookup -> $project -> $sort
// =====================================================================
sep("C5 - Pacientes con reingresos (más de un episodio)");
db.hospitalizaciones.aggregate([
  { $match: { activo: true } },
  { $group: {
      _id: "$paciente_id",
      episodios: { $sum: 1 },
      diagnosticos_principales: {
        $push: { $arrayElemAt: ["$diagnosticos.codigo_cie10", 0] }
      }
  } },
  { $match: { episodios: { $gt: 1 } } },
  { $lookup: {
      from: "pacientes", localField: "_id", foreignField: "_id", as: "p"
  } },
  { $unwind: "$p" },
  { $project: {
      _id: 0,
      paciente: { $concat: ["$p.nombres", " ", "$p.apellidos"] },
      eps: "$p.aseguramiento.eps",
      episodios: 1,
      diagnosticos_principales: 1
  } },
  { $sort: { episodios: -1 } }
]).forEach(printjson);

// =====================================================================
// CONSULTA 6 (complementaria) - Distribución etaria de pacientes
// hospitalizados por grupos de edad ($bucket sobre fecha de nacimiento).
// Etapas: $match -> $lookup -> $unwind -> $addFields(edad) -> $bucket
// =====================================================================
sep("C6 - Distribución por grupos de edad de los hospitalizados");
db.hospitalizaciones.aggregate([
  { $match: { activo: true } },
  { $lookup: {
      from: "pacientes", localField: "paciente_id", foreignField: "_id", as: "p"
  } },
  { $unwind: "$p" },
  { $addFields: {
      edad: {
        $dateDiff: { startDate: "$p.fecha_nacimiento", endDate: "$$NOW", unit: "year" }
      }
  } },
  { $bucket: {
      groupBy: "$edad",
      boundaries: [0, 12, 18, 60, 120],
      default: "Sin dato",
      output: {
        episodios: { $sum: 1 },
        pacientes: { $addToSet: "$paciente_id" }
      }
  } },
  { $project: { episodios: 1, pacientes_distintos: { $size: "$pacientes" } } }
]).forEach(printjson);

print("\n=== Fin de las consultas avanzadas ===");
