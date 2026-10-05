### Ejercicio 0.4: Nueva nota en diagrama de aplicación tradicional

```mermaid
sequenceDiagram
    participant browser as Navegador
    participant server as Servidor

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note over server: El servidor procesa la nueva nota y la guarda en memoria/BD
    server-->>browser: HTTP 302 Redirección (URL: /notes)
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: Documento HTML
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: Archivo CSS
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: Archivo JavaScript
    deactivate server

    Note over browser: El navegador ejecuta el JS que solicita el archivo JSON con los datos

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{"content": "nueva nota", "date": "2026-10-04..."}, ...]
    deactivate server

    Note over browser: El navegador ejecuta la función callback que renderiza las notas en el DOM

```

### Ejercicio 0.5: Diagrama de aplicación de una sola página (SPA)

```mermaid
sequenceDiagram
    participant browser as Navegador
    participant server as Servidor

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: Documento HTML
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: Archivo CSS
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: Archivo JavaScript (spa.js)
    deactivate server

    Note over browser: El navegador ejecuta spa.js para solicitar el archivo JSON

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{"content": "nota 1", "date": "..."}, ...]
    deactivate server

    Note over browser: El código JS renderiza dinámicamente las notas en el DOM

```

### Ejercicio 0.6: Nueva nota en diagrama de aplicación de una sola página (SPA)

```mermaid
sequenceDiagram
    participant browser as Navegador
    participant server as Servidor

    Note over browser: El usuario escribe la nota y hace clic en "Save"
    Note over browser: El JS maneja el evento de envío, agrega la nota a la lista local y redibuja la pantalla

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note over browser: Content-Type: application/json<br/>Cuerpo: {"content": "mi nota SPA", "date": "2026-10-04..."}
    activate server
    server-->>browser: HTTP 201 Created
    deactivate server


```
