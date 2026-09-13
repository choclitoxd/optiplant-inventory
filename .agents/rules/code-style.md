---
trigger: always_on
---

1. PRINCIPIO RECTOR OBLIGATORIO ("¿Por qué se hizo así?"):
   - Toda decisión de arquitectura, modelo de base de datos, endpoint o componente de código DEBE incluir explícitamente su justificación técnica respondiendo a la pregunta: "¿Por qué se hizo así?" [1, 2].

2. ANATOMÍA Y ESTRUCTURA DE PROMPT EN 7 PARTES:
   - Todo prompt o instrucción debe estructurarse obligatoriamente bajo las 7 partes de ingeniería de prompts: Rol, Objetivo, Contexto, Instrucciones paso a paso, Input/Output con Formato, Restricciones y Cláusula de Clarificación (la IA debe preguntar antes de asumir o alucinar requisitos) [3-11].

3. DESARROLLO INCREMENTAL BASADO EN EL TABLERO KANBAN:
   - Se debe trabajar estrictamente sobre las tarjetas existentes en el archivo 'tablero_kanban.md', avanzando tarjeta por tarjeta y descomponiendo cada módulo en subtareas pequeñas con listas de verificación (checklists) [12-15].
   - No se deben agregar tarjetas arbitrarias que distorsionen el plan de trabajo [12, 15].

4. GESTIÓN EFICIENTE DEL CONTEXTO (CONTEXT ENGINEERING):
   - Mantener los prompts e instrucciones concisos y específicos para no saturar la ventana de contexto del modelo con información que ya existe explícitamente dentro del proyecto o código fuente [16-18].

5. CUMPLIMIENTO DEL STACK Y ARQUITECTURA EN 3 CAPAS:
   - Mantener la separación estricta entre Frontend (React + TypeScript), Backend (Java Spring Boot API REST) y Base de Datos relacional (PostgreSQL) [15, 19, 20].
   - Garantizar que todo el entorno se ejecute de manera autónoma con un solo comando mediante Docker Compose (`docker compose up`) [19, 21].

6. PROTOCOLO DE AUTOEVALUACIÓN Y VERIFICACIÓN CONTINUA:
   - Antes de dar por completada una tarjeta o moverla a DONE, la IA debe autoevaluarse aplicando un Code Review o Chain-of-Thought ("pensar paso a paso") para auditar el cumplimiento de 3FN, SOLID, casos límite (ej. bloqueos concurrentes de stock o recepciones parciales) y pruebas unitarias [22-24].

7. DOCUMENTACIÓN OBLIGATORIA DE EVIDENCIA DE IA:
   - Rastrear los prompts utilizados, el código generado, las correcciones manuales realizadas y la evaluación crítica de los resultados para completar la sección obligatoria de evidencia de uso de IA [25, 26].

8. Regla de Cero Omisiones: "Está estrictamente prohibido usar comentarios como // TODO: implementar rest o dejar capas a medias. Si el código requerido excede el espacio de respuesta, debes generar la capa Backend completa primero, confirmar la entrega y detenerte antes de pasar al Frontend."