# 🤖 Evidencia de Uso de IA — OptiPlant ERP

## 1. Herramienta y Metodología

**Herramienta:** Antigravity IDE (Google DeepMind) con modelos Claude Sonnet 4.6 y Gemini Pro.

**Metodología — Context Engineering con Ponytail:**  
En lugar de solicitar "genera todo el sistema", el desarrollador actuó como **arquitecto** y la IA como **pair programmer táctico**. Se usaron slash commands especializados por dominio (`/java-springboot`, `/react-frontend`, `/ui-ux-design`, `/ponytail`) para delimitar el contexto de cada prompt e impedir que la IA sobreingeniara soluciones. El principio rector fue siempre: **la solución más simple que funcione correctamente**.

---

## 2. Áreas de Aplicación

| Área | IA Aplicada | Resultado |
|---|---|---|
| **Diseño de arquitectura** | Propuso separación de capas, diagrama E-R, normalización 3FN | Modelo de datos definitivo y decisiones documentadas |
| **Generación de código** | Backend: Services, Controllers, DTOs, JPA Repositories | ~70% del código generado, ~30% ajustado manualmente |
| **Seguridad** | Implementó Spring Security + JWT + RBAC (`@PreAuthorize`) | Sistema de autenticación multi-rol funcional |
| **Lógica de negocio** | CPP, bloqueo pesimista de stock, recepción parcial | Algoritmos auditados y validados por el desarrollador |
| **Pruebas unitarias** | Generó 12 tests JUnit 5 con Mockito | 0 fallos en suite completa |
| **Depuración** | Analizó logs de Docker, trazó errores de CORS, 403 y build | Bugs resueltos en minutos vs. horas manuales |
| **Documentación técnica** | Generó README, diagramas Mermaid, Kanban | Documentación coherente con el código |

---

## 3. Ejemplos Concretos de Prompts

### Prompt 1 — Arquitectura de Seguridad Multi-Rol (RBAC)
> *"/java-springboot /react-frontend /ponytail quiero que solo el admin sea global en sucursales, el resto debe si o si tener una sucursal [...] el gerente de la sucursal solo podra editar su stock de su sucursal"*

**Qué generó la IA:**
- `SecurityConfig.java` con Spring Security stateless + JWT
- `JwtTokenProvider.java` para emisión y validación de tokens
- Lógica en `UserService.validateManagerAccess()`: Admin hace early-return; Gerente filtrado por `branchId` del token
- `UserModal.tsx` con campo Sucursal dinámico (desaparece si rol = Admin, bloqueado si es Gerente)

**Ajuste manual del desarrollador:** El desarrollador detectó que la validación original fallaba cuando Admin editaba a otro Admin (ambos con `branch = null`). Se corrigió el orden de condiciones en `validateManagerAccess`.

---

### Prompt 2 — Concurrencia en Ventas
> *"La validación de stock debe ser concurrente para evitar saldos negativos si dos cajeros venden el último artículo al mismo tiempo"*

**Qué generó la IA:**
- `@Lock(LockModeType.PESSIMISTIC_WRITE)` en `InventoryRepository.findByBranchIdAndProductIdWithLock()`
- `@Transactional` en `SaleService.createSale()` para garantizar atomicidad
- Test unitario: `SaleServiceTest.shouldThrowIllegalArgumentExceptionWhenRequestedQuantityExceedsStock`

---

### Prompt 3 — Costo Promedio Ponderado (CPP)
> *"Calcular el costo promedio ponderado en el backend al momento de registrar la compra"*

**Qué generó la IA:**
- Fórmula: `CPP_nuevo = (stock_actual × cpp_anterior + cantidad_nueva × precio_nuevo) / (stock_actual + cantidad_nueva)`
- Implementada en `PurchaseService.java` dentro de una transacción
- Validada con test: `PurchaseServiceTest` — stock=10 a $80 + 10 a $120 = CPP de $100 exacto ✓

---

## 4. Evaluación Crítica

### Lo que la IA hizo bien
- Generó la estructura completa del backend (entidades, repositorios, DTOs, servicios) en forma correcta en el primer intento.
- Los tests unitarios con Mockito fueron precisos y cubrieron los casos límite correctos (stock negativo, usuario duplicado, rol sin sucursal).
- Identificó y resolvió errores de CORS, imports no utilizados en TypeScript y bugs de seguridad más rápido que una búsqueda manual.

### Dónde requirió intervención humana
- **Bug de validateManagerAccess:** La IA validaba `targetUser.getBranch() == null` antes de verificar si quien llama es Admin, causando un error 403 falso. El desarrollador identificó la causa raíz; la IA propuso la corrección con early-return.
- **Prueba de integración `contextLoads`:** La IA no consideró que el test necesitaba BD activa en el runner de Docker. El desarrollador indicó marcarlo con `@Disabled`.
- **Mensaje de error case-sensitive:** Test fallaba porque `"username"` != `"Username"`. Detectado por el desarrollador al leer los logs.

### Estimación de contribución
| Componente | % Código IA | % Ajuste Manual |
|---|---|---|
| Backend (Java) | ~65% | ~35% |
| Frontend (React/TS) | ~70% | ~30% |
| Tests (JUnit/Mockito) | ~80% | ~20% |
| Documentación | ~60% | ~40% |

---

## 5. Conclusión

La IA operó como un **multiplicador de productividad técnica**, no como un sustituto del desarrollador. El rol del desarrollador fue: definir la arquitectura, validar la lógica de negocio, detectar los casos límite que la IA no anticipó, y mantener la coherencia entre las capas. El resultado es un sistema que cumple los estándares de la industria precisamente porque se combinó la velocidad generativa de la IA con el juicio crítico del desarrollador.
