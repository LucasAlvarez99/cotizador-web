# Cómo cargar los 6 videos

Los videos se cargan desde `videos.json`. Cada línea es un slot (el primero es el 01, el último el 06).

```json
{ "title": "Tolvar Soluciones", "who": "Martin Tolosa · Cliente", "src": "https://...", "poster": "" }
```

| Campo    | Qué es                                                                 |
|----------|------------------------------------------------------------------------|
| `src`    | Link del video. Vacío = el slot queda libre.                           |
| `title`  | Título corto debajo del video (opcional).                              |
| `who`    | Quién habla / cliente (opcional).                                      |
| `poster` | Imagen de portada (opcional). En YouTube se usa la miniatura sola.     |

## Formatos de `src` que funcionan

- **YouTube** (incluye Shorts): `https://youtube.com/watch?v=XXXXXXXXXXX`, `https://youtu.be/XXXXXXXXXXX`, `https://youtube.com/shorts/XXXXXXXXXXX`
- **Vimeo**: `https://vimeo.com/123456789`
- **Archivo directo** (`.mp4` / `.webm`): una ruta del repo (`./videos/demo1.mp4`) o un link público (Cloudinary, por ejemplo).

## Formato vertical u horizontal

En `styles.css`, buscá `.video-grid` y cambiá `--video-ratio`:

- `9 / 16` → vertical (reels / shorts). Es el valor por defecto.
- `16 / 9` → horizontal.

## Ver los slots libres

Mientras un slot no tenga `src`, en tu computadora (localhost) o abriendo la página con `?edit` al final de la URL se ve el aviso "Slot libre". Los visitantes ven "Próximamente".
