# Evidencia de uso de Inteligencia Artificial

Herramienta: **Claude (Anthropic) — Claude Code**.
Uso: apoyo para diseño del modelo documental, construcción y depuración de scripts,
optimización de pipelines de agregación y documentación de decisiones.

> El criterio del equipo fue usar la IA como **asistente**, no como autor: todos los
> datos, decisiones de modelado y consultas fueron revisados y validados por el grupo.

---

## Interacción 1 — Diseño embeber vs. referenciar
**Prompt:** "Para un episodio de hospitalización en MongoDB, ¿qué conviene embeber y
qué referenciar entre paciente, médico, cama, diagnósticos, evoluciones y medicamentos?"

**Resultado aplicado:** se embeben `diagnosticos[]`, `evoluciones[]` y
`medicamentos_administrados[]` (pertenecen al ciclo de vida del episodio, cardinalidad
acotada) y se referencian `paciente_id`, `medico_tratante_id`, `cama_id` (entidades
compartidas, evitan anomalías de actualización). Quedó documentado en el README §2.

## Interacción 2 — Validadores `$jsonSchema`
**Prompt:** "Genera un validador `$jsonSchema` para la colección hospitalizaciones con
enumeraciones para estado, vía de ingreso y vía de administración."

**Resultado aplicado:** validadores con `validationAction: "error"` en todas las
colecciones (script 01), con campos obligatorios y `enum` controlados.

## Interacción 3 — Pipelines de agregación
**Prompt:** "Arma un pipeline para un reporte epidemiológico que cuente los
diagnósticos de notificación obligatoria por sede, resolviendo el nombre del
diagnóstico desde el catálogo CIE-10."

**Resultado aplicado:** consulta **C1** del script 04 (`$match → $unwind → $lookup →
$match → $group → $project → $sort`). Las consultas C2–C6 se construyeron con el mismo
método y se repartieron entre los integrantes.

## Interacción 4 — Depuración y ejecución
**Prompt:** "Verifica que los scripts se ejecuten sin errores en MongoDB 7 y que las
consultas devuelvan resultados coherentes con los datos simulados."

**Resultado aplicado:** se ejecutaron los 4 scripts sobre una instancia real de
MongoDB 7.0; las salidas se guardaron como evidencia en la carpeta `datos/`
(ver `*_salida.txt`).

## Interacción 5 — Reflexión ética
**Prompt:** "¿Qué marco legal colombiano aplica al manejo de datos clínicos y cómo se
refleja en el diseño (soft delete, datos simulados)?"

**Resultado aplicado:** Ley 1581 de 2012 (protección de datos / habeas data) y
Resolución 1995 de 1999 (historias clínicas). Fundamenta la política de **soft delete**
de episodios y pacientes y el uso exclusivo de **datos simulados**.

---

> Nota: las capturas de pantalla de estas interacciones se adjuntan en el informe PDF
> final y/o en la carpeta `capturas/`.
