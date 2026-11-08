# HCE Básica — Subsistema de Hospitalización en MongoDB

**Proyecto de Aula — Bases de Datos II | Institución Universitaria Pascual Bravo**
Red de Hospitales Públicos de la Gobernación de Antioquia
Unidad 3 — Modelo NoSQL documental

---

## 1. Estructura del repositorio

```
tarea base de datos mogodb/
├── README.md                      Diseño del modelo y decisiones
├── 01_crear_colecciones.js        Colecciones, validadores $jsonSchema e índices
├── 02_poblar_datos.js             Datos simulados coherentes
├── 03_crud.js                     Create, Read, Update, Delete (soft y definitivo)
├── 04_consultas_avanzadas.js      Pipelines de agregación (uno por integrante)
├── INFORME_TECNICO.docx           Informe técnico (Word)
├── GUION_VIDEO.md                 Guion del video demostrativo
├── EVIDENCIA_IA.md                Evidencia de uso de IA (prompts + resultados)
├── datos/                          Salidas reales de ejecución (01..04_salida.txt)
└── capturas/                       Capturas de pantalla para el informe
```

### Ejecución

```bash
mongosh < scripts/01_crear_colecciones.js
mongosh < scripts/02_poblar_datos.js
mongosh < scripts/03_crud.js
mongosh < scripts/04_consultas_avanzadas.js
```

Los scripts son **idempotentes**: `01` elimina y recrea las colecciones, así que la
secuencia completa se puede repetir cuantas veces haga falta.

---

## 2. Del modelo relacional al modelo documental

En la fase anterior el sistema se construyó en SQL Server (`BD_HCE_Antioquia`) con
un esquema normalizado. La traducción a MongoDB no fue una copia tabla→colección:
se aplicó el criterio de **agregado**, es decir, agrupar en un mismo documento
aquello que se lee y se escribe junto.

| Modelo relacional (SQL Server) | Modelo documental (MongoDB) | Criterio aplicado |
|---|---|---|
| `PACIENTE` + `CONTACTO` + `AFILIACION` | Colección `pacientes` con subdocumentos `contacto` y `aseguramiento` | Relación 1:1, sin vida propia → **embebido** |
| `ALERGIA` (1:N) | Arreglo `alergias[]` de strings | Cardinalidad baja, siempre se lee con el paciente → **embebido** |
| `MEDICO` | Colección `medicos` | Entidad compartida por muchos episodios → **referencia** |
| `CAMA` | Colección `camas` | Estado propio que cambia independientemente → **referencia** |
| `HOSPITALIZACION` | Colección `hospitalizaciones` | Documento raíz del agregado |
| `HOSPITALIZACION_DIAGNOSTICO` (tabla puente) | Arreglo `diagnosticos[]` | La tabla puente desaparece → **embebido** |
| `EVOLUCION` + `SIGNOS_VITALES` | Arreglo `evoluciones[]` con `signos_vitales` anidado | Pertenecen al episodio, cardinalidad acotada → **embebido** |
| `ADMINISTRACION_MEDICAMENTO` | Arreglo `medicamentos_administrados[]` | Ídem → **embebido** |
| `CIE10`, `MEDICAMENTO` | Colecciones catálogo | Datos de referencia estables → **referencia + `$lookup`** |

### Regla de decisión usada

> **Embeber** cuando el dato pertenece al ciclo de vida del documento padre, se
> consulta siempre con él y su cardinalidad está acotada (decenas, no miles).
> **Referenciar** cuando la entidad es compartida por muchos documentos, cambia de
> forma independiente o puede crecer sin límite.

Un episodio real de hospitalización genera a lo sumo algunas decenas de evoluciones
y administraciones, muy lejos del límite de 16 MB por documento de MongoDB. En
cambio, un paciente y un médico son referenciados por episodios distintos a lo largo
del tiempo: embeberlos produciría anomalías de actualización (cambiar un teléfono
obligaría a reescribir todos los episodios del paciente).

---

## 3. Colecciones

### `pacientes`
`_id` = número de documento (evita un índice extra y garantiza unicidad natural).
Campo `activo` para **soft delete**.

### `medicos`
Registro ReTHUS con índice único. Campo `activo`.

### `camas`
`_id` legible tipo `HGM-UCI-03` (sede–servicio–número). `estado` como enumeración
controlada por el validador. Índice compuesto `{sede, servicio, estado}` para
consultas de disponibilidad.

### `hospitalizaciones` — colección transaccional
Documento raíz del subsistema. Estructura:

```json
{
  "_id": "HOSP-2026-0001",
  "paciente_id": "1036458721",
  "medico_tratante_id": "MD-002",
  "cama_id": "HGM-UCI-02",
  "sede": "Hospital General de Medellín",
  "servicio": "UCI",
  "fecha_ingreso": ISODate("2026-08-03T07:15:00Z"),
  "fecha_egreso": ISODate("2026-08-14T11:00:00Z"),
  "estado": "Egresado",
  "via_ingreso": "Urgencias",
  "motivo_consulta": "Disnea progresiva...",
  "diagnosticos": [
    { "codigo_cie10": "J440", "tipo": "Principal", "fecha": ISODate("...") }
  ],
  "evoluciones": [
    { "fecha": ISODate("..."), "medico_id": "MD-002", "nota": "...",
      "signos_vitales": { "ta_sistolica": 142, "ta_diastolica": 88, "fc": 96,
                          "fr": 24, "temperatura": 37.2, "saturacion_o2": 90 } }
  ],
  "medicamentos_administrados": [
    { "medicamento_id": "MED-006", "dosis": "2 puff", "via": "Inhalatoria",
      "frecuencia_horas": 6, "fecha": ISODate("...") }
  ],
  "dias_estancia": 11,
  "activo": true,
  "auditoria": { "creado_por": "admision.hgm", "fecha_creacion": ISODate("...") }
}
```

Se mantiene **`sede` y `servicio` denormalizados** dentro del episodio, aunque
también estén en `camas`. Es deliberado: el servicio donde ocurrió la
hospitalización es un hecho histórico que no debe cambiar si la cama se reasigna
después a otro servicio. Es el patrón de *snapshot* de datos transaccionales.

### Catálogos: `diagnosticos_cie10`, `medicamentos`
`_id` = el propio código CIE-10 o el código interno del medicamento, lo que permite
resolverlos con `$lookup` sin campos adicionales.

---

## 4. Validación e integridad

MongoDB no impone integridad referencial, así que el control se reparte en tres
niveles:

1. **Validadores `$jsonSchema`** en cada colección: tipos de dato, campos
   obligatorios y enumeraciones (`estado`, `via_ingreso`, `via` de administración,
   `tipo` de diagnóstico, `regimen` de aseguramiento). Con
   `validationAction: "error"` se rechaza cualquier documento mal formado.
2. **Índices**, incluido uno único sobre `registro_medico`.
3. **Guardas en la capa de aplicación**: antes de borrar un elemento de catálogo se
   verifica que no esté referenciado (ver `D4` y `D5` en `03_crud.js`).

---

## 5. Política de borrado

| Tipo de dato | Política | Justificación |
|---|---|---|
| Episodio de hospitalización | **Soft delete** (`activo: false` + `motivo_anulacion` + auditoría) | La Resolución 1995 de 1999 exige conservar y poder auditar la historia clínica: un episodio se anula, no se borra |
| Paciente | **Soft delete** | Conserva la trazabilidad de sus episodios históricos |
| Elemento de catálogo no referenciado | **Eliminación definitiva** | No es un dato clínico de una persona |

Todas las consultas de lectura filtran por `activo: true`.

---

## 6. Datos simulados

Los datos de `02_poblar_datos.js` son **enteramente ficticios**. Números de
documento, nombres, direcciones y teléfonos fueron inventados y no corresponden a
personas reales. Las sedes, los códigos CIE-10 y los medicamentos sí son
verosímiles para el contexto antioqueño, de modo que las consultas de agregación
arrojen resultados clínicamente interpretables.

Volumen inicial: 10 diagnósticos CIE-10, 10 medicamentos, 7 médicos, 12 camas,
12 pacientes y 14 hospitalizaciones, con casos deliberadamente variados:
episodios activos y egresados, un reingreso del mismo paciente, una remisión,
complicaciones intrahospitalarias, un registro ya anulado y dos diagnósticos de
notificación obligatoria (dengue y gastroenteritis) para alimentar el reporte
epidemiológico.

---

## 7. Integrantes

| Integrante | Rol | Consulta avanzada propia (script 04) |
|---|---|---|
| Laura | Analista NoSQL | **C1** — Reporte epidemiológico: diagnósticos de notificación obligatoria por sede (`$match`, `$unwind`, `$lookup`, `$group`, `$project`, `$sort`) |
| Jhon Jader Correa | Analista NoSQL | **C2** — Promedio de días de estancia por sede y servicio (`$match`, `$group`, `$project`, `$sort`) |
| Juan Esteban Castaño Montoya | Analista NoSQL | **C3** — Top de medicamentos más administrados con `$lookup` al catálogo (`$unwind`, `$group`, `$lookup`, `$project`, `$sort`, `$limit`) |

Consultas complementarias del equipo: **C4** carga asistencial por médico, **C5** pacientes
con reingresos y **C6** distribución por grupos de edad (`$bucket`).
