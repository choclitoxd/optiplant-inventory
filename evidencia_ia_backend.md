# Evidencia de Uso de IA - Módulo Backend (OptiPlant)

Este documento sirve como constancia del desarrollo asistido por IA para el Sistema de Inventario Multi-Sucursal (Backend Spring Boot), cumpliendo con la regla de **Documentación Obligatoria de Evidencia de IA**.

## 1. Módulos Implementados Asistidos por IA

Durante la fase de desarrollo del Backend, la IA participó activamente en las siguientes áreas:

1.  **Gestión de APIs y Documentación Swagger / OpenAPI 3**:
    *   **Prompts utilizados**: Generación de una configuración central de Swagger limpia sin exponer datos corporativos (solo de prueba), así como la integración de `springdoc-openapi-starter-webmvc-ui` y el etiquetado de los endpoints (Tags) agrupándolos de manera lógica por módulo.
    *   **Código generado**: `OpenApiConfig.java` con las etiquetas y descripciones de los servicios, esquemas y la resolución de compatibilidad para evitar el error 500 en `/v3/api-docs`.

2.  **Auditoría y Restricciones de Base de Datos (PostgreSQL)**:
    *   **Prompts utilizados**: Validación rigurosa del esquema SQL, integridad relacional, reglas DDL para constraints de duplicidad y para prevenir stock negativo.
    *   **Evaluación crítica**: Se confirmó exitosamente la resistencia de la base de datos simulando ataques e inserciones inválidas. Se generó previamente el archivo `evidencia_auditoria_bd.md`.

3.  **Suite de Pruebas Automáticas End-To-End (QA Bash)**:
    *   **Prompts utilizados**: Creación de un script `bash` con comandos `cURL` para realizar pruebas de extremo a extremo, levantando transacciones completas, probando concurrencia y evaluando los *status codes*.
    *   **Código generado**: Archivo `test_backend.sh`.

4.  **Desarrollo de Pruebas Unitarias 100% Aisladas (JUnit 5 + Mockito)**:
    *   **Prompts utilizados**: Implementar pruebas unitarias estrictamente puras (sin levantar contexto Spring o base de datos) para 5 servicios críticos: `PurchaseService`, `SaleService`, `TransferService`, `AlertService` y `DashboardService`.
    *   **Código generado**: Se crearon las 5 clases Test en `backend/src/test/java/com/optiplant/inventory/service/`.
    *   **Correcciones manuales (Troubleshooting)**: 
        *   Se corrigió un conflicto de entorno con el compilador Maven local (que arrojaba error de soporte para Java 21) trasladando la ejecución de la suite al contenedor Docker (`eclipse-temurin:21`).
        *   Se corrigió la firma de los constructores en los Java Records (como `TransferReceiveDetailDTO` y `StockAlertDTO`) que provocaban fallas de compilación.
        *   Se calibraron los "mocks" para coincidir de forma precisa con el `findById` y la lógica interna para calcular el CPP (Costo Promedio Ponderado) evitando excepciones tipo `PotentialStubbingProblem`.
    *   **Resultados de Verificación**: Los 7 métodos de prueba en las 5 clases de servicio transaccional pasaron con un **100% de éxito**. 

## 2. Decisiones Arquitectónicas Justificadas ("¿Por qué se hizo así?")

*   **Bloqueo Pesimista en Transacciones**: Para las ventas (`SaleService`) y transferencias (`TransferService`), se empleó la anotación `@Lock(LockModeType.PESSIMISTIC_WRITE)` de Spring Data JPA. **¿Por qué?** Porque en un sistema multi-sucursal las colisiones transaccionales (condiciones de carrera) al descontar inventarios en paralelo son inminentes. El bloqueo a nivel de BD protege contra inconsistencias.
*   **Aislamiento de Tests**: Las pruebas unitarias se configuraron *exclusivamente* con `@ExtendWith(MockitoExtension.class)` ignorando `@SpringBootTest`. **¿Por qué?** Las pruebas unitarias verdaderas validan el algoritmo del negocio y sus *edge cases* (como cálculos y excepciones) en fracciones de segundo y son deterministas. Para la integridad del esquema, se emplearon pruebas DDL y el script `bash`.
*   **Uso estricto de BigDecimal**: Todo campo monetario fue tratado con `BigDecimal` y redondeo `RoundingMode.HALF_UP`. **¿Por qué?** Porque los tipos flotantes primitivos o `Double` inducen a pérdidas de precisión perjudiciales a largo plazo en balances contables o cálculos de Costo Promedio Ponderado (CPP).

## 3. Estado del Proyecto

Se ha validado la construcción completa del Backend bajo los requerimientos técnicos y arquitectónicos definidos en el kanban. Se da luz verde para pasar a la capa de consumo visual (Frontend - React + TypeScript).
