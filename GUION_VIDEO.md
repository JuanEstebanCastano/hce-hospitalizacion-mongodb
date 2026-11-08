# Guion del video demostrativo (máx. 10 minutos)

**Proyecto:** HCE Básica — Subsistema de Hospitalización en MongoDB
**Equipo:** Laura · Jhon Jader Correa · Juan Esteban Castaño Montoya

> Objetivo del video: mostrar la ejecución de operaciones CRUD y de las consultas
> avanzadas, con **participación visible de los tres integrantes**. Se recomienda
> grabar pantalla (MongoDB Compass o `mongosh`) y que cada quien narre su parte.

---

## Minuto 0:00 – 1:00 · Introducción (todos)
- Presentación del equipo y del contexto: Red de Hospitales de la Gobernación de
  Antioquia, subsistema de hospitalización de la HCE.
- Por qué NoSQL documental (MongoDB): datos clínicos jerárquicos (episodio con
  evoluciones, diagnósticos y medicamentos embebidos).

## Minuto 1:00 – 2:30 · Modelo de datos (Integrante A)
- Mostrar `01_crear_colecciones.js`: colecciones, validadores `$jsonSchema`, índices.
- Explicar la decisión **embeber vs. referenciar** (tabla del README).
- Ejecutar el script y mostrar el mensaje "Colecciones creadas".

## Minuto 2:30 – 3:30 · Poblamiento (Integrante A)
- Ejecutar `02_poblar_datos.js`.
- Mostrar el conteo final: 12 pacientes, 14 hospitalizaciones (1 anulada), etc.
- Recalcar que **todos los datos son simulados** (nota ética).

## Minuto 3:30 – 6:00 · Operaciones CRUD (Integrante B)
Ejecutar `03_crud.js` y mostrar en pantalla:
- **Create:** alta de paciente y de una hospitalización completa (arreglos anidados).
- **Read:** `$elemMatch` (fiebre > 38.5 °C), búsqueda dentro de arreglos (alergias).
- **Update:** campo simple (estado de cama), campo anidado (`contacto.contacto_emergencia.telefono`),
  `$push` de evolución, operador posicional `$`, `$addToSet`, cierre de episodio con cálculo de estancia.
- **Delete:** **soft delete** de un episodio (justificar con la Resolución 1995/1999),
  restauración, y eliminación definitiva de catálogo con guarda de integridad.

## Minuto 6:00 – 9:00 · Consultas avanzadas (los tres, una c/u)
Ejecutar `04_consultas_avanzadas.js` y que **cada integrante explique la suya**:
- **Laura — C1:** reporte epidemiológico (notificación obligatoria por sede).
- **Jhon Jader — C2:** promedio de estancia por sede y servicio.
- **Juan Esteban — C3:** top de medicamentos con `$lookup`.
- Mencionar C4/C5/C6 como consultas complementarias del equipo.

## Minuto 9:00 – 10:00 · Reflexión ética y cierre (todos)
- Manejo de datos clínicos sensibles: Ley 1581 de 2012 (habeas data), Resolución
  1995 de 1999, principio de minimización y anonimización.
- Conclusión: cómo lo relacional y lo documental se complementan en el proyecto integrador.

---

### Checklist de evidencia de participación
- [ ] Integrante A narra modelo + poblamiento.
- [ ] Integrante B narra y ejecuta el CRUD.
- [ ] Los tres narran su consulta avanzada (C1, C2, C3).
- [ ] Todos aparecen (voz o cámara) al menos una vez.
- [ ] Duración total ≤ 10 minutos.
