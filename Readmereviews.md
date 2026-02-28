# 💬 README — Sistema de reseñas compartidas entre usuarios

Este documento explica el problema actual y las opciones reales para que las reseñas sean visibles para **todos** los visitantes de tu sitio.

---

## ⚠️ El problema actual

El código usa `localStorage`, que guarda los datos **en el navegador de cada persona**.  
Esto significa que si Juan deja una reseña, solo Juan la ve. María entra al sitio y no ve nada.

Para que las reseñas sean compartidas, necesitás un lugar externo donde guardarlas: una base de datos o un servicio en la nube.

---

## 🔧 Opciones disponibles (de más fácil a más completa)

---

### ✅ OPCIÓN 1 — Jsonbin.io (RECOMENDADA — gratuita, sin backend)

**Jsonbin.io** es un servicio que te da una URL donde podés guardar y leer un JSON desde el navegador. No necesitás servidor propio.

**Costo:** Gratis hasta 10.000 requests/mes (más que suficiente para empezar)  
**Dificultad:** ⭐ Baja — solo necesitás copiar una API Key

#### Cómo configurarlo:

1. Entrá a [https://jsonbin.io](https://jsonbin.io) y creá una cuenta gratuita
2. Creá un nuevo **bin** (JSON vacío): `[]`
3. Copiá tu `BIN_ID` y tu `API_KEY` del panel
4. En `app.js`, reemplazá las funciones `getStoredReviews()` y `saveReviews()` con estas:

```javascript
// ── CONFIG — reemplazá con tus datos de jsonbin.io ──
const JSONBIN_ID  = 'TU_BIN_ID_AQUI';
const JSONBIN_KEY = 'TU_API_KEY_AQUI';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;

// Leer reseñas desde jsonbin
async function getStoredReviews() {
  try {
    const res = await fetch(JSONBIN_URL + '/latest', {
      headers: { 'X-Master-Key': JSONBIN_KEY }
    });
    const data = await res.json();
    return data.record || [];
  } catch {
    return [];
  }
}

// Guardar reseñas en jsonbin
async function saveReviews(arr) {
  try {
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY
      },
      body: JSON.stringify(arr)
    });
  } catch(e) {
    console.error('Error guardando reseña:', e);
  }
}
```

5. Como ahora las funciones son `async`, actualizá `submitReview()` para que espere:

```javascript
async function submitReview() {
  // ... (validaciones igual que antes) ...
  const reviews = await getStoredReviews();
  reviews.push({ name, role, text, stars: selectedStars, date: new Date().toISOString() });
  await saveReviews(reviews);
  // ... (reset del formulario igual que antes) ...
  await renderUserReviews();
  updateDynamicStats();
}

async function renderUserReviews() {
  const reviews = await getStoredReviews();
  // ... (resto igual) ...
}

async function initReviews() {
  await renderUserReviews();
  const reviews = await getStoredReviews();
  updateDynamicStats(reviews);
}
```

**Listo.** Con esto todos los visitantes comparten las mismas reseñas.

---

### ✅ OPCIÓN 2 — Google Sheets como base de datos (muy visual)

Podés usar Google Sheets para guardar las reseñas. Cada fila es una reseña.  
Se maneja con **Google Apps Script** que expone una URL (webhook).

**Ventaja:** Ves todas las reseñas en una planilla, podés moderarlas antes de publicar.  
**Dificultad:** ⭐⭐ Media

#### Cómo configurarlo:

1. Creá una Google Sheet con columnas: `fecha | nombre | rubro | estrellas | comentario | aprobado`
2. En la sheet, andá a **Extensiones → Apps Script** y pegá este código:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.name,
    data.role,
    data.stars,
    data.text,
    'pendiente' // Para que puedas moderar antes de publicar
  ]);
  return ContentService.createTextOutput(JSON.stringify({ok: true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  const reviews = rows.slice(1) // Saltear encabezados
    .filter(r => r[5] === 'aprobado') // Solo las aprobadas
    .map(r => ({
      date: r[0], name: r[1], role: r[2], stars: r[3], text: r[4]
    }));
  return ContentService.createTextOutput(JSON.stringify(reviews))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Publicá el script: **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **Yo**
   - Acceso: **Cualquier usuario**
4. Copiá la URL del webhook

5. En `app.js`:

```javascript
const SHEETS_URL = 'TU_URL_DEL_WEBHOOK_AQUI';

async function getStoredReviews() {
  try {
    const res = await fetch(SHEETS_URL);
    return await res.json();
  } catch { return []; }
}

async function saveReviews(arr) {
  const ultima = arr[arr.length - 1]; // Solo mandar la última reseña
  await fetch(SHEETS_URL, {
    method: 'POST',
    body: JSON.stringify(ultima)
  });
}
```

**Ventaja extra:** Podés ver y moderar reseñas en la planilla antes de que aparezcan en el sitio.

---

### ✅ OPCIÓN 3 — Firebase Realtime Database (más robusta)

Firebase es el servicio de Google para apps web. Tiene plan gratuito generoso.

**Costo:** Gratis hasta 1GB de datos y 10GB de transferencia/mes  
**Dificultad:** ⭐⭐ Media

#### Cómo configurarlo:

1. Entrá a [https://firebase.google.com](https://firebase.google.com) → Crear proyecto
2. Activá **Realtime Database** en modo "test" (sin autenticación por ahora)
3. Copiá la URL de tu base de datos (ej: `https://tu-proyecto.firebaseio.com`)
4. En `app.js`:

```javascript
const FIREBASE_URL = 'https://TU-PROYECTO.firebaseio.com/reviews';

async function getStoredReviews() {
  try {
    const res = await fetch(FIREBASE_URL + '.json');
    const data = await res.json();
    if (!data) return [];
    return Object.values(data); // Firebase guarda como objeto, lo convertimos a array
  } catch { return []; }
}

async function saveReviews(arr) {
  const ultima = arr[arr.length - 1];
  await fetch(FIREBASE_URL + '.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ultima)
  });
}
```

---

### ✅ OPCIÓN 4 — Supabase (la más profesional, también gratuita)

Supabase es una alternativa open-source a Firebase, con base de datos PostgreSQL.

**Costo:** Gratis hasta 500MB  
**Dificultad:** ⭐⭐⭐ Media-alta  
**Ideal si:** Ya tenés o pensás tener otras funcionalidades (usuarios, pagos, etc.)

---

## 📊 Comparativa rápida

| Opción       | Dificultad | Costo      | Moderación | Recomendado para |
|--------------|-----------|------------|------------|-----------------|
| Jsonbin.io   | ⭐ Baja    | Gratis     | ❌ No       | Arrancar rápido |
| Google Sheets| ⭐⭐ Media  | Gratis     | ✅ Sí       | Control editorial |
| Firebase     | ⭐⭐ Media  | Gratis     | ❌ No       | Escalar a futuro |
| Supabase     | ⭐⭐⭐ Alta | Gratis     | ✅ Con SQL  | Proyectos grandes |

---

## 🛡 Consejo importante sobre moderación

Sin moderación, **cualquiera puede dejar cualquier comentario**. Si el sitio es profesional, recomendamos usar Google Sheets o agregar un campo `aprobado: false` y revisarlo manualmente antes de mostrarlo.

La opción más simple: usá Google Sheets donde cada reseña empieza como "pendiente" y la cambiás a "aprobado" cuando la revisás. Así tenés control total.

---

*¿Tenés dudas? Revisá la documentación de cada servicio o consultá con tu desarrollador.*