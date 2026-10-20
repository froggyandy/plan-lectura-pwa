# Plan de lectura (PWA)

## Publicarla
Una PWA necesita estar en un sitio con HTTPS. Sirve cualquier hosting estático:

- **GitHub Pages:** crea un repositorio, sube estos archivos tal cual y activa Pages en Settings → Pages → Deploy from a branch → main / (root). Queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.
- **Netlify o Vercel:** arrastra la carpeta o conecta el repositorio.

Todas las rutas son relativas, así que funciona tanto en la raíz como en una subcarpeta.

## Instalarla en el celular
- **iPhone:** abre el enlace en Safari → botón Compartir → «Agregar a pantalla de inicio».
- **Android:** abre el enlace en Chrome → menú ⋮ → «Instalar aplicación» o «Agregar a la pantalla principal».

Una vez instalada, abre como app propia, con su ícono, y funciona sin internet.

## Tu plan personal
La app publicada es genérica: no trae ningún texto personal. Tu plan (los textos de la pestaña Plan, el libro, los días, el día de café y el inicio del bloque) está en `mi-plan.json`, en la carpeta de arriba (`Plan de Lectura PWA`), fuera de lo que se publica. **No lo pongas en esta carpeta.**

- **Cargarlo:** en el teléfono, pestaña Plan → «Cargar mi plan» (o Ajustes → Tu plan) y eliges `mi-plan.json` desde OneDrive o Archivos. Se hace una sola vez y queda guardado en el teléfono y en tus copias.
- **Plan nuevo:** cargas el archivo nuevo igual. Se aplican sus ajustes y la página del libro no retrocede.
- **Plantillas:** en los textos del plan, `{dias}`, `{descanso}`, `{diaCafe}`, `{base}`, `{paso}`, `{max}`, `{umbral}`, `{diasSemana}`, `{duracion}`, `{semanas}`, `{semanasBuenas}`, `{inicio}`, `{libro}` y `{paginasRestantes}` se reemplazan con tus datos. `{?var: texto}` solo aparece si `var` tiene valor.

## Tus datos
Viven solo en el teléfono. En Ajustes:
- **Exportar copia** guarda un archivo `.json` con todo el registro. **Importar copia** lo restaura (reemplaza lo que haya).
- **Copiar resumen para Claude** copia el texto para pegarlo en el chat en las revisiones.

Haz una copia de vez en cuando: si borras la app o los datos del navegador, la copia es lo que te salva.

## Actualizarla
Si cambias `index.html`, sube la nueva versión. La app la descarga sola la próxima vez que la abras con conexión. Para forzar que se descargue todo de nuevo (íconos, manifiesto), sube la versión en `sw.js`: `const CACHE = 'plan-lectura-v2';`.
