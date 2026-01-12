# Web de CIMEC Salud

Sitio web estático de la clínica CIMEC Salud, generado con **Hugo**.

- Hugo: `hugo v0.152.2` (extended)
- Lenguaje principal: Español (`es-es`)

---

## Desarrollo

### Requisitos

- Hugo Extended instalado (>= 0.152.2)

### Ejecutar en local

```bash
hugo server -D
```

Esto levanta el sitio en `http://localhost:1313` con contenido en borradores (`-D`).

### Generar build de producción

```bash
hugo
```

Los archivos estáticos se generan en el directorio `public/`.

---

## Estructura principal

- `content/` — Páginas y entradas del blog en Markdown.
- `layouts/` — Plantillas de Hugo (base, secciones, parciales, shortcodes).
- `static/` — Assets estáticos servidos tal cual (CSS, JS, imágenes, vídeos).
- `data/` — Datos estructurados en YAML (especialidades, clínica, aseguradoras).
- `assets/` — Recursos para procesar (por ejemplo SCSS).
- `hugo.toml` — Configuración principal del sitio.

---

## Notas de SEO y accesibilidad

- Meta tags de Open Graph y Twitter Cards definidas en `layouts/_default/baseof.html`.
- Datos estructurados Schema.org (home, blog, especialidades) en `layouts/partials/schema-org.html`.
- Enlace “Saltar al contenido principal” para accesibilidad en teclado en `baseof.html` y estilos en `static/css/style.css`.
