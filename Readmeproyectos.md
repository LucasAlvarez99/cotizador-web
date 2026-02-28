# 📁 README — Cómo agregar proyectos reales a projects.json

Este archivo explica cómo cargar tus proyectos reales en el portfolio.  
Los proyectos del archivo `projects.json` aparecen **primero** en el grid, antes de los proyectos de ejemplo generados automáticamente.

---

## 🗂 Estructura del archivo

`projects.json` es un array de objetos. Cada objeto es un proyecto.

```json
[
  { ...proyecto 1 },
  { ...proyecto 2 },
  { ...proyecto 3 }
]
```

---

## 📋 Campos disponibles por proyecto

| Campo       | Tipo     | Obligatorio | Descripción |
|-------------|----------|-------------|-------------|
| `id`        | número   | ✅ Sí        | ID único. Usá números altos (1001, 1002...) para no chocar con los proyectos generados |
| `cat`       | string   | ✅ Sí        | Categoría del proyecto. Ver valores válidos abajo |
| `name`      | string   | ✅ Sí        | Nombre del proyecto o cliente |
| `year`      | número   | ✅ Sí        | Año de entrega del proyecto |
| `height`    | número   | ✅ Sí        | Altura de la card en el masonry (px). Recomendado: entre 220 y 320 |
| `img`       | string   | ✅ Sí        | URL de la imagen de thumbnail (portada en el grid) |
| `images`    | array    | ✅ Sí        | Array con 3 URLs de imágenes para el slider del popup |
| `desc`      | string   | ✅ Sí        | Descripción corta del proyecto (1-2 oraciones) |
| `challenge` | objeto   | ✅ Sí        | Caso de estudio con 3 subcampos (ver abajo) |
| `testi`     | objeto   | ✅ Sí        | Testimonio del cliente (ver abajo) |
| `tech`      | array    | ✅ Sí        | Tecnologías usadas (máx. 6 recomendado) |
| `url`       | string   | ✅ Sí        | URL del sitio en vivo. Usá `"#"` si no hay link disponible |
| `client`    | string   | ✅ Sí        | Nombre del cliente (aparece en el popup) |
| `real`      | boolean  | ⬜ Opcional  | Podés marcarlo como `true` para diferenciarlo internamente |

---

## 🏷 Valores válidos para `cat`

```
"landing"      → Landing Page
"corporativo"  → Sitio Corporativo
"ecommerce"    → E-commerce
"blog"         → Blog / Portal
"app"          → App / PWA
```

---

## 📐 El objeto `challenge` (caso de estudio)

```json
"challenge": {
  "challenge": "Descripción del problema o necesidad que tenía el cliente.",
  "solution":  "Qué solución implementaron juntos.",
  "result":    "Resultados concretos obtenidos (números, porcentajes, mejoras)."
}
```

---

## 💬 El objeto `testi` (testimonio)

```json
"testi": {
  "initials": "MR",
  "name":     "Martina Rodríguez",
  "role":     "Psicóloga · Buenos Aires",
  "text":     "El comentario del cliente va acá, sin comillas externas."
}
```

- `initials`: 2 letras para el avatar (se muestra si no hay foto)
- `role`: rubro y ciudad del cliente

---

## 🖼 Las imágenes (`img` e `images`)

Podés usar:

**A) URLs de imágenes reales** (subidas a tu hosting, Cloudinary, etc.)
```json
"img": "https://midominio.com/proyectos/cliente-x-thumb.jpg",
"images": [
  "https://midominio.com/proyectos/cliente-x-vista1.jpg",
  "https://midominio.com/proyectos/cliente-x-vista2.jpg",
  "https://midominio.com/proyectos/cliente-x-mobile.jpg"
]
```

**B) Placeholders de color** mientras no tenés imágenes (formato: `fondo/texto`)
```json
"img": "https://placehold.co/600x260/1a0d2e/9b59b6?text=Nombre+Proyecto",
"images": [
  "https://placehold.co/900x500/1a0d2e/9b59b6?text=Vista+1",
  "https://placehold.co/900x500/1a0d2e/9b59b6?text=Vista+2",
  "https://placehold.co/900x500/1a0d2e/9b59b6?text=Mobile"
]
```

---

## ✅ Ejemplo completo de un proyecto real

```json
{
  "id": 1002,
  "cat": "ecommerce",
  "name": "Ferretería El Martillo",
  "year": 2024,
  "height": 280,
  "img": "https://midominio.com/img/ferreteria-thumb.jpg",
  "images": [
    "https://midominio.com/img/ferreteria-1.jpg",
    "https://midominio.com/img/ferreteria-2.jpg",
    "https://midominio.com/img/ferreteria-mobile.jpg"
  ],
  "desc": "Tienda online completa con más de 500 productos, integración con MercadoPago y panel de gestión de pedidos.",
  "challenge": {
    "challenge": "El cliente tenía una ferretería física exitosa pero sin presencia digital. Perdía ventas frente a competidores con tienda online.",
    "solution": "Desarrollamos un e-commerce con catálogo categorizado, buscador interno, carrito y checkout con MercadoPago en 8 semanas.",
    "result": "En los primeros 3 meses las ventas online representaron el 30% del total. Actualmente superan el 45%."
  },
  "testi": {
    "initials": "CL",
    "name": "Carlos López",
    "role": "Dueño · Ferretería El Martillo, Córdoba",
    "text": "No puedo creer el cambio. Antes era todo por teléfono, ahora los pedidos entran solos. La inversión se recuperó en menos de 4 meses."
  },
  "tech": ["React", "Node.js", "MongoDB", "MercadoPago", "AWS S3", "Vercel"],
  "url": "https://ferreteria-elmartillo.com.ar",
  "client": "Ferretería El Martillo",
  "real": true
}
```

---

## 🔢 Recomendaciones para `height`

El campo `height` define la altura de la imagen en el masonry. Variarlo le da ritmo visual al grid:

| Valor | Uso sugerido |
|-------|-------------|
| 220   | Card compacta / screenshot mobile |
| 260   | Estándar — la más común |
| 280   | Para proyectos con mucho detalle visual |
| 300   | Destacado / proyecto grande |
| 320   | Para proyectos estrella del portfolio |

---

## ➕ Cómo agregar un nuevo proyecto paso a paso

1. Abrí `projects.json` con cualquier editor de texto
2. Copiá el bloque de ejemplo de arriba
3. Pegalo dentro del array `[ ]`, separado por coma del proyecto anterior
4. Completá todos los campos con los datos reales
5. Guardá el archivo
6. Recargá la página — el proyecto aparece automáticamente al inicio del grid

---

## 🔢 IDs recomendados

Los proyectos generados automáticamente usan IDs del 1 al ~80.  
**Usá siempre IDs de 1001 en adelante** para tus proyectos reales:

- Primer proyecto real → `"id": 1001`
- Segundo → `"id": 1002`
- Y así sucesivamente...

---

## 🗑 Cómo eliminar los proyectos de ejemplo

Cuando tengas suficientes proyectos reales, podés desactivar los generados automáticamente.  
En `app.js`, buscá la función `loadProjects()` y reemplazá esta línea:

```javascript
// ANTES (mezcla reales + generados)
const generated = generateProjects(customProjects.length);
ALL_PROJECTS = [...customProjects, ...generated];

// DESPUÉS (solo proyectos reales del JSON)
ALL_PROJECTS = [...customProjects];
```

---

*Cualquier duda, revisá el archivo `projects.json` incluido como ejemplo de referencia.*