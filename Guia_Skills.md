# Guía de Uso de Skills de Antigravity

Este documento explica cómo funcionan tus "skills" (habilidades) personalizadas y cómo puedes utilizarlas eficientemente en tus prompts para sacarle el mayor provecho a tu asistente Antigravity.

## ¿Qué son los Skills?

Los skills son carpetas que contienen instrucciones, scripts y recursos diseñados para ampliar mis capacidades en tareas especializadas. Cada skill funciona como una "hoja de trucos" o un conjunto de reglas que cargo a pedido cuando lo necesitas. 

## ¿Cómo utilizar un Skill en un Prompt?

Para utilizar un skill, simplemente debes mencionarlo explícitamente en tu prompt o hacer una solicitud que esté claramente relacionada con su propósito. Aquí hay algunas formas de invocarlos:

1. **Mención directa:** "Por favor, usa el skill `java-springboot` para revisar este código."
2. **Uso de comandos "slash":** Para algunos skills específicos, puedes usar comandos como `/ponytail-audit`.
3. **Mención de palabras clave:** Si dices "ponytail", "sé perezoso", "solución mínima" o "yagni", activaré automáticamente la actitud de "ponytail" para darte la solución más corta y sencilla posible.

---

## Tus Skills Disponibles

A continuación, detallo cada uno de tus skills y cómo puedes usarlos:

### 1. `agy-customizations`
**Descripción:** Guía completa y referencia para el Sistema de Personalización de Antigravity.
**Cuándo usarlo:** Cuando quieras entender cómo funcionan las personalizaciones, su prioridad de carga, mecanismos de descubrimiento y para guiar la creación de nuevos skills, reglas, plugins, hooks y servidores MCP.
**Ejemplo de Prompt:** "Explícame cómo crear un nuevo skill siguiendo las reglas de `agy-customizations`."

### 2. `antigravity-guide`
**Descripción:** Proporciona una guía completa, referencia rápida y mapa del sitio para Google Antigravity (AGY).
**Cuándo usarlo:** Cuando tengas preguntas sobre cómo usar, configurar o personalizar Antigravity, la CLI de agy, el IDE de Antigravity o Antigravity 2.0.
**Ejemplo de Prompt:** "¿Cómo configuro un servidor MCP en el IDE? Usa `antigravity-guide`."

### 3. `context-compressor`
**Descripción:** Estrategias para comprimir el contexto y maximizar la eficiencia de los tokens.
**Cuándo usarlo:** Cuando estemos trabajando con un repositorio muy grande y necesites que reduzca la cantidad de información que leo o genero para no agotar la ventana de contexto.
**Ejemplo de Prompt:** "Aplica `context-compressor` antes de leer todos los archivos de esta carpeta."

### 4. `java-springboot`
**Descripción:** Mejores prácticas para desarrollar aplicaciones con Spring Boot.
**Cuándo usarlo:** Cuando estemos creando o modificando código en el backend de tu proyecto (Java Spring Boot API REST). Esto asegurará que siga los estándares y convenciones adecuados.
**Ejemplo de Prompt:** "Crea un nuevo controlador REST para productos. Asegúrate de aplicar el skill `java-springboot`."

### 5. `ponytail`
**Descripción:** Fuerza la solución más perezosa que realmente funcione: la más simple, corta y mínima. Canaliza a un desarrollador senior que ya lo ha visto todo.
**Cuándo usarlo:** En CUALQUIER tarea de codificación donde quieras evitar la sobreingeniería, el código inflado o dependencias innecesarias. 
**Ejemplo de Prompt:** "Necesito parsear este archivo JSON. Ponytail." o "Dame la solución más perezosa para validar este formulario."

### 6. `ponytail-audit`
**Descripción:** Auditoría de todo el repositorio en busca de sobreingeniería. Escanea el código para encontrar qué se puede eliminar, simplificar o reemplazar con funciones nativas.
**Cuándo usarlo:** Cuando quieras limpiar el proyecto.
**Ejemplo de Prompt:** "/ponytail-audit" o "Audita este repositorio en busca de sobreingeniería."

### 7. `ponytail-debt`
**Descripción:** Recolecta todos los comentarios `ponytail:` en el código en un libro mayor de deuda técnica, para rastrear los atajos deliberados que se tomaron.
**Cuándo usarlo:** Para saber qué cosas se dejaron para después intencionalmente.
**Ejemplo de Prompt:** "/ponytail-debt" o "¿Qué deuda técnica dejó ponytail?"

### 8. `ponytail-gain`
**Descripción:** Muestra el impacto medido de ponytail como un marcador compacto: menos código, menos costo, más velocidad.
**Cuándo usarlo:** Para ver cuánto tiempo y código has ahorrado.
**Ejemplo de Prompt:** "/ponytail-gain" o "Muestra el impacto de ponytail."

### 9. `ponytail-help`
**Descripción:** Tarjeta de referencia rápida para todos los modos, skills y comandos de ponytail.
**Cuándo usarlo:** Cuando olvides cómo interactuar con ponytail.
**Ejemplo de Prompt:** "/ponytail-help" o "¿Cómo utilizo ponytail?"

### 10. `ponytail-review`
**Descripción:** Revisión de código enfocada exclusivamente en la sobreingeniería. Encuentra qué eliminar (abstracciones innecesarias, dependencias inútiles, etc.).
**Cuándo usarlo:** Al revisar un Pull Request o un bloque de código nuevo.
**Ejemplo de Prompt:** "Revisa este archivo para ver qué podemos eliminar. Usa `ponytail-review`."

---

## Consejos Finales para tus Prompts

* **Combina reglas y skills:** Recuerda que tienes reglas globales obligatorias (como usar la arquitectura de 3 capas, documentar "¿Por qué se hizo así?", y no dejar código a medias). Puedes pedirme que aplique un skill respetando estas reglas.
* **Sé específico:** Cuanto más específico seas sobre qué skill quieres que aplique, mejores serán los resultados.

¡Usa estos skills para acelerar tu desarrollo y mantener tu código limpio y eficiente!
