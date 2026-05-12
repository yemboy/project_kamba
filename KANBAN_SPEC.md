# Kanban Board — Spec para GH copiliot

## Objetivo

Construye un **Kanban estático** completo con HTML, CSS y JavaScript puro.
Sin frameworks, sin dependencias npm, sin bundler.
El resultado debe poder abrirse con doble clic en el navegador y desplegarse en GitHub Pages con cero configuración.

---

## Stack

- **HTML5** semántico
- **CSS3** vanilla (Grid + Flexbox + custom properties)
- **JavaScript** ES6+ puro (`const`, `let`, arrow functions, `classList`, `dataset`)
- **Sin** React, Vue, Tailwind, Bootstrap, jQuery ni ninguna librería externa

---

## Estructura de archivos a crear

```
kanban/
├── index.html
├── styles.css
├── script.js
└── README.md
```

---

## index.html — Requisitos

### Estructura del tablero

Tres columnas fijas en este orden:
1. **To Do**
2. **In Progress**
3. **Done**

### Estructura de una card

Cada card debe tener:
- Badge de prioridad: `alta` / `media` / `baja`
- Título de la tarea
- Descripción corta
- Atributo `draggable="true"`

```html
<div class="card" draggable="true" data-id="1" data-priority="alta">
  <span class="priority-badge priority-alta">alta</span>
  <h3 class="card-title">Título de la tarea</h3>
  <p class="card-desc">Descripción corta de la tarea.</p>
</div>
```

### Cards de ejemplo a incluir (mínimo 6, distribuidas entre columnas)

| Título | Descripción | Prioridad | Columna |
|--------|-------------|-----------|---------|
| Diseñar wireframes | Crear los mockups de las pantallas principales | alta | To Do |
| Configurar GitHub Pages | Habilitar el deploy automático desde main | media | To Do |
| Revisar pull requests | Revisar y aprobar los PRs pendientes del equipo | alta | In Progress |
| Escribir tests unitarios | Cubrir las funciones de filtrado y drag & drop | baja | In Progress |
| Actualizar README | Documentar el setup y el stack del proyecto | baja | Done |
| Definir paleta de colores | Seleccionar los colores del sistema de diseño | media | Done |

### Controles de filtro

Encima del tablero, una barra de filtros con 4 botones:
- **Todas** (activo por defecto)
- **Alta**
- **Media**
- **Baja**

### Formulario para nueva card

Un botón flotante o fijo `+ Nueva card` que al hacer clic muestra un modal/formulario con:
- Campo: Título (input text, requerido)
- Campo: Descripción (textarea)
- Selector: Prioridad (select con opciones alta / media / baja)
- Selector: Columna destino (select con To Do / In Progress / Done)
- Botones: Guardar / Cancelar

---

## styles.css — Requisitos

### Custom properties (variables CSS)

```css
:root {
  --bg: #0d1117;
  --bg-card: #161b22;
  --bg-column: #1c2128;
  --border: #30363d;
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --accent: #39d98a;

  /* Prioridades */
  --priority-alta: #dc2626;
  --priority-media: #d97706;
  --priority-baja: #16a34a;

  --radius: 8px;
  --shadow: 0 4px 12px rgba(0,0,0,0.4);
}
```

### Layout

- `body`: fondo `var(--bg)`, fuente `system-ui, -apple-system, sans-serif`
- `.board`: CSS Grid de 3 columnas iguales con `gap: 16px`, padding lateral
- `.column`: fondo `var(--bg-column)`, border-radius, padding interno, altura mínima de `500px`
- `.column-header`: muestra nombre de columna + contador de cards (ej. "To Do · 2")
- `.card`: fondo `var(--bg-card)`, border `1px solid var(--border)`, border-radius, padding, cursor grab

### Badges de prioridad

```css
.priority-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.priority-alta  { background: rgba(220,38,38,0.15);  color: var(--priority-alta);  border: 1px solid rgba(220,38,38,0.3);  }
.priority-media { background: rgba(217,119,6,0.15);  color: var(--priority-media); border: 1px solid rgba(217,119,6,0.3);  }
.priority-baja  { background: rgba(22,163,74,0.15);  color: var(--priority-baja);  border: 1px solid rgba(22,163,74,0.3);  }
```

### Estados visuales

- `.card:hover`: sombra elevada, ligero translateY(-2px)
- `.card.dragging`: opacidad 0.4
- `.column.drag-over`: borde `2px dashed var(--accent)`, fondo ligeramente más claro
- `.filter-btn.active`: fondo `var(--accent)`, color negro
- Card oculta por filtro: `display: none`

### Animación columna Done

Cuando una card entra a la columna Done, aplica una animación CSS:

```css
@keyframes cardDone {
  0%   { transform: scale(0.95); opacity: 0.6; }
  60%  { transform: scale(1.03); }
  100% { transform: scale(1);    opacity: 1;   }
}
.column-done .card {
  animation: cardDone 0.35s ease-out;
}
```

### Modal de nueva card

- Overlay semitransparente que cubre toda la pantalla
- Formulario centrado con fondo `var(--bg-column)`, border-radius, padding
- Al hacer Escape o clic fuera del modal, se cierra

---

## script.js — Requisitos

### Drag & Drop

Usar la API nativa del navegador (`dragstart`, `dragover`, `drop`, `dragend`):

```javascript
// Estructura base esperada
function initDragAndDrop() {
  // Hacer las cards arrastrables
  // Marcar columnas como drop zones
  // Al soltar: mover la card al nuevo contenedor
  // Actualizar contadores de columnas
  // Si la columna destino es "done": disparar animación
}
```

### Filtros por prioridad

```javascript
function filterCards(priority) {
  // 'all' muestra todas
  // 'alta' | 'media' | 'baja' oculta las que no coinciden
  // Actualiza el botón activo
  // Actualiza los contadores de columna (solo cards visibles)
}
```

### Crear nueva card

```javascript
function createCard({ title, description, priority, column }) {
  // Genera un ID único (Date.now())
  // Crea el elemento DOM con la estructura correcta
  // Agrega al contenedor de la columna destino
  // Reinicializa los event listeners de drag en la nueva card
  // Actualiza el contador de la columna
  // Cierra el modal
}
```

### Contadores de columna

La cabecera de cada columna muestra `"Nombre · N"` donde N es el número de cards visibles actualmente. Se actualiza al:
- Mover una card con drag & drop
- Filtrar por prioridad
- Agregar una nueva card

### Persistencia opcional (localStorage)

Si tienes tiempo, guarda el estado del tablero en `localStorage` para que persista al recargar la página. No es obligatorio pero suma puntos.

---

## README.md — Requisitos

Debe incluir:

```markdown
# Kanban Board

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-39d98a)](URL_DEL_DEPLOY)

Tablero Kanban estático construido con HTML, CSS y JavaScript puro.
Proyecto desarrollado con GitHub Copilot durante el curso "Domina GitHub Copilot".

## Stack
- HTML5 semántico
- CSS3 vanilla (Grid + Flexbox + custom properties)
- JavaScript ES6+ puro

## Features
- Drag & drop nativo entre columnas
- Filtrado de cards por prioridad (alta / media / baja)
- Formulario para crear nuevas cards
- Animación en columna Done
- Diseño oscuro inspirado en GitHub

## Cómo usar
Abre `index.html` en el navegador, o visita el deploy en GitHub Pages.

## Estructura
kanban/
├── index.html   # Estructura del tablero y las cards
├── styles.css   # Estilos, variables CSS y animaciones
├── script.js    # Drag & drop, filtros y creación de cards
└── README.md    # Este archivo

## Deploy
Desplegado automáticamente en GitHub Pages desde la rama `main`.
```

---

## Criterios de calidad

- [ ] El tablero se ve bien en pantallas de 1280px o más
- [ ] Drag & drop funciona entre las 3 columnas sin errores en consola
- [ ] Los filtros muestran/ocultan cards correctamente y actualizan contadores
- [ ] El formulario valida que el título no esté vacío antes de crear la card
- [ ] La animación de Done se dispara al soltar una card en esa columna
- [ ] El código no usa `var`, no tiene `console.log` de debug, no tiene código comentado innecesario
- [ ] El HTML es semántico: usa `<header>`, `<main>`, `<section>`, `<button>` donde corresponde
- [ ] El CSS usa custom properties para todos los colores, no valores hardcodeados

---

## Lo que NO debes hacer

- ❌ Instalar ninguna dependencia npm
- ❌ Crear un `package.json`
- ❌ Usar `innerHTML` para renderizar HTML con datos del usuario (usa `createElement` + `textContent`)
- ❌ Usar `document.write()`
- ❌ Agregar librerías externas via CDN (ni jQuery, ni Animate.css, ni nada)
- ❌ Crear más archivos de los especificados (solo `index.html`, `styles.css`, `script.js`, `README.md`)

---

## Orden de construcción sugerido

1. `index.html` — estructura base del tablero con las cards de ejemplo
2. `styles.css` — variables, layout del board, columnas y cards
3. Estilos de badges, filtros y modal
4. `script.js` — drag & drop primero, luego filtros, luego formulario
5. Animación de columna Done
6. `README.md`
7. Verificación final: abrir en el navegador y probar todo manualmente

---

*Generado para uso con Claude Code — curso "Domina GitHub Copilot" · ED Team 2025*
