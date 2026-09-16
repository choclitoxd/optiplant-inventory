# 🤖 Evidencia de Uso de IA y Análisis de Prompts

Este documento recopila la trazabilidad del desarrollo asistido por Inteligencia Artificial durante la prueba técnica del sistema **OptiPlant ERP**. Se detalla la estructura del proyecto, el registro de prompts utilizados, el impacto de cada uno en el código fuente, y un análisis estimado del consumo de tokens (ancho de banda cognitivo).

---

## 🏗️ 1. Estructura del Proyecto y Metodología

El proyecto se estructuró bajo una arquitectura estricta de 3 capas, separando responsabilidades:
*   **Frontend (`/frontend`)**: React + TypeScript + Vite + TailwindCSS.
*   **Backend (`/backend`)**: Java 21 + Spring Boot 3 + Spring Data JPA.
*   **Base de Datos**: PostgreSQL 15.

**Metodología de IA aplicada:**
Se aplicó la regla de **Desarrollo Incremental basado en Context Engineering**. En lugar de pedir "hazme toda la app", el modelo fue alimentado progresivamente por el desarrollador con problemas puntuales, permitiendo que la IA operara como un *Pair Programmer* (Modo Ponytail: directo, sin sobreingeniería).

---

## 📊 2. Análisis de Consumo de Tokens (Estimación de Carga Cognitiva)

Durante la sesión, el consumo de tokens de contexto varió según la tarea. Las tareas de depuración (debugging) fueron las más costosas debido a la necesidad de leer logs largos y múltiples archivos simultáneamente.

| Fila | Tipo de Tarea | Consumo de Tokens (Estimado) | Nivel de Dificultad para IA |
| :--- | :--- | :--- | :--- |
| 1 | **Depuración de Envío de Correos (Mailtrap + Spring `@Async`)** | 🔴 Alto (~8k - 12k tokens) | Muy Alto (Implicó leer logs de Java, `application.yml`, y refactorizar dependencias Maven). |
| 2 | **Resolución de Errores CORS y Datos Vacíos (`http://localhost:3000/catalog`)** | 🟠 Medio-Alto (~6k tokens) | Alto (Implicó escanear archivos de configuración de Spring Security y Controladores). |
| 3 | **Creación del Componente UI (`Dropdown.tsx`) con variables CSS** | 🟡 Medio (~4k tokens) | Medio (Generación pura de código basada en restricciones estrictas de UI/UX). |
| 4 | **Refactorización del Layout (Sidebar Estático vs Scroll)** | 🟢 Bajo (~2k tokens) | Bajo (Conocimiento estándar de Flexbox y TailwindCSS). |

> **💡 Conclusión del consumo:** El prompt que consumió más tokens fue la **resolución del envío de correos (Notificar a Gerencia)**. El modelo tuvo que mantener en memoria el controlador REST, el servicio de correos, la configuración del `pom.xml`, el archivo `application.yml` y los logs de error de Docker de Mailtrap para conectar todas las piezas.

---

## 📝 3. Registro de Prompts Clave y su Impacto en el Proyecto

A continuación, se detallan los prompts exactos enviados por el desarrollador y cómo la IA los transformó en código funcional.

### 🎯 Prompt 1: Creación de Componente UI Personalizado
**Prompt del Usuario:**
> *"/react-frontend /ponytail /ui-ux-design Actúa como un desarrollador Frontend experto para un componente de menú desplegable (dropdown) personalizado. [...] Color dinámico (Crucial): Todo el esquema de color debe controlarse mediante una única Variable CSS en la raíz (por ejemplo, --theme-color)..."*

*   **¿Qué hacía el prompt?** Exigía la creación de un componente de UI desde cero, prohibiendo el uso del `<select>` nativo del navegador para mantener una estética "Bento UI" moderna y corporativa.
*   **Impacto en el proyecto:** Se creó el archivo `frontend/src/components/ui/Dropdown.tsx`. La IA utilizó la propiedad `color-mix` de CSS para generar estados de *hover* y *active* basados puramente en variables CSS dinámicas, logrando un diseño premium.

### 🎯 Prompt 2: Depuración de Capas Front/Back (CORS y Endpoints)
**Prompt del Usuario:**
> *"/react-frontend /ponytail /ui-ux-design Tengo un serio problema en http://localhost:3000/catalog no se evidencia informacion ni datos lo mismo para purchases, sales, transfers necesito que encuentres el error /java-springboot"*

*   **¿Qué hacía el prompt?** Reportaba un fallo crítico de integración donde la interfaz gráfica no mostraba los datos provenientes de la base de datos (PostgreSQL).
*   **Impacto en el proyecto:** La IA auditó la red y descubrió dos bloqueos. Primero, habilitó globalmente los encabezados CORS en `backend/src/main/java/com/optiplant/inventory/config/CorsConfig.java`. Segundo, identificó que los controladores (`PurchaseController`, etc.) no estaban exponiendo correctamente las rutas GET, procediendo a mapearlos.

### 🎯 Prompt 3: Refactorización Visual de Layouts (Bug del menú cortado)
**Prompt del Usuario:**
> *"/ponytail /react-frontend /ui-ux-design Se evidencia que side bar queda corto a la misma vez quiero asi yo baje quisera que lo que este side bar quede estatico que no se mueva asi baje"*

*   **¿Qué hacía el prompt?** Solicitaba corregir un defecto de maquetación (layout) donde el menú lateral se desplazaba hacia arriba al hacer scroll en tablas de datos muy largas.
*   **Impacto en el proyecto:** La IA modificó `BentoAppLayout.tsx`. Se reemplazó la clase `min-h-screen` por un enfoque de **App Shell** usando `h-screen overflow-hidden` en el contenedor principal, e inyectando `overflow-y-auto` únicamente en la etiqueta `<main>`.

### 🎯 Prompt 4: El Reto Principal - Sistema de Alertas por Correo (Mailtrap)
**Prompts del Usuario (Secuencia interactiva):**
> *1. "no funciona el notificar a gerencia"*
> *2. "No me llega el correo"*
> *3. "Yo lo decia por que lo de correo medio un token para esto y un ejemplo de como se puede implentar tal import io.mailtrap.client.MailtrapClient..."*

*   **¿Qué hacía el prompt?** El desarrollador detectó que el botón de envío de alertas no funcionaba. Tras varios intentos, proveyó directamente la documentación oficial del SDK de Mailtrap en Java para que la IA lo implementara.
*   **Impacto en el proyecto (Mayor consumo de tokens):** 
    1. Se inyectó la dependencia `mailtrap-java` en `pom.xml`.
    2. Se refactorizó totalmente `EmailService.java` para reemplazar el clásico `JavaMailSender` por la API robusta de Mailtrap.
    3. Se implementó el decorador `@Async` y `@EnableAsync` en Spring Boot para garantizar que el correo se enviara en un hilo secundario y no bloqueara la interfaz gráfica del usuario.
    4. Se aseguró que los secretos se movieran a `.gitignore`.

---

## 🏁 4. Conclusión

El uso de asistentes de IA (Antigravity/Gemini) en este proyecto no se limitó a "generar código", sino que operó como una herramienta de **ingeniería de software asistida**. El desarrollador mantuvo el control de la arquitectura (dirigiendo a la IA mediante slash commands como `/java-springboot` y `/ui-ux-design`), mientras que la IA resolvió la complejidad táctica (CSS conflictivo, dependencias de Maven, y asincronismo en Java).
