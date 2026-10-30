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

- **Cargarlo:** pestaña Plan → «Cargar mi plan» (o Ajustes → Tu plan) y eliges `mi-plan.json` desde OneDrive o Archivos. Se hace una sola vez: queda guardado en el dispositivo, en tus copias y, con sesión iniciada, en todos tus dispositivos.
- **Plan nuevo:** cargas el archivo nuevo igual. Se aplican sus ajustes y la página del libro no retrocede.
- **Plantillas:** en los textos del plan, `{dias}`, `{descanso}`, `{diaCafe}`, `{base}`, `{paso}`, `{max}`, `{umbral}`, `{diasSemana}`, `{duracion}`, `{semanas}`, `{semanasBuenas}`, `{inicio}`, `{libro}` y `{paginasRestantes}` se reemplazan con tus datos. `{?var: texto}` solo aparece si `var` tiene valor.

## Sincronización entre dispositivos
En Ajustes → Sincronización inicias sesión con tu correo y contraseña de Firebase, una vez en cada dispositivo. Desde ahí:

- Tus sesiones, ajustes y plan se sincronizan solos en segundos. La cabecera dice **Sincronizado**, **Subiendo…** o **Sin conexión**.
- **Sin conexión** todo se guarda en el dispositivo y sube solo al volver la señal. Si registras en dos dispositivos sin conexión, al reconectar se suman las sesiones de ambos; en los ajustes gana el último cambio de cada campo.
- Al iniciar sesión por primera vez en un dispositivo, lo que ya tenía guardado se sube y se junta con lo de la nube.
- **Cerrar sesión** borra los datos de ese dispositivo; siguen en la nube y vuelven al entrar.
- Sin iniciar sesión, la app funciona igual que antes: todo queda solo en el dispositivo.

Los datos viven en el proyecto de Firebase `plan-lectura-43119` (Firestore), en `users/TU-UID/`. Las reglas de Firestore solo admiten a los usuarios de una lista de UID, y cada uno solo lee y escribe su propia carpeta. La configuración de Firebase que está en `index.html` no es secreta.

## Tus datos
En Ajustes:
- **Exportar copia** guarda un archivo `.json` con todo el registro. **Importar copia** lo restaura y reemplaza lo que haya (con sesión iniciada, en todos tus dispositivos).
- **Copiar resumen para Claude** copia el texto para pegarlo en el chat en las revisiones.

Haz una copia de vez en cuando y guárdala en tu Drive.

## Actualizarla
Si cambias `index.html`, sube la nueva versión. La app la descarga sola la próxima vez que la abras con conexión. Para forzar que se descargue todo de nuevo (íconos, manifiesto), sube la versión en `sw.js`: `const CACHE = 'plan-lectura-v4';`.

El ícono del iPhone (`icons/apple-touch-icon.png`, 180×180) es distinto del de PC y Android (`icon-192`, `icon-512` y `maskable-512`, que usa el manifiesto). Se puede cambiar uno sin tocar los otros. Para que el iPhone tome un ícono nuevo hay que borrar la app de la pantalla de inicio y volver a agregarla desde Safari.

## Segunda app: `chtenie/` (en ruso)
Otra app de lectura, con su propia lógica (dos repisas, estados de libros, regla de las 50 páginas, sesión de mesa con la lista de dos minutos, metas y resumen). Se publica en `.../plan-lectura-pwa/chtenie/` y usa el mismo proyecto de Firebase.

- **Su plan no está en el código:** vive en un archivo `.json` en la carpeta de arriba (fuera del repositorio) y se carga una vez desde la pestaña «План». Incluye los textos del plan, sus ajustes y los libros iniciales (con identificadores fijos, para que no se dupliquen entre dispositivos ni vuelvan si se borran).
- **Datos separados:** guarda en `users/{uid}/chtenie_books`, `chtenie_log` y `chtenie_meta`, así que nunca toca las colecciones de esta app aunque se use la misma cuenta. La lista de dos minutos y la sesión de mesa en curso nunca salen del teléfono.
- **Sincronización:** primero guarda en el teléfono; con sesión iniciada sube los cambios campo por campo, así dos dispositivos que editan el mismo libro sin conexión se combinan en vez de pisarse. Si Firebase no responde, la app sigue funcionando y sube lo pendiente al volver la conexión.
- **Contraseña olvidada:** «Ещё → Синхронизация → Забыли пароль?» envía el correo de Firebase en ruso. Para que el correo traiga el botón de vuelta a la app, agrega `froggyandy.github.io` en Firebase → Authentication → Configuración → Dominios autorizados (sin eso el correo funciona igual, solo sin ese botón).
- **Mismo dominio:** cada app tiene su propio service worker y solo borra sus cachés (prefijos `plan-lectura-` y `chtenie-`); el de esta app ignora la carpeta `chtenie/`. Cada una usa su propia instancia de Firebase, así que iniciar sesión en una no inicia sesión en la otra.

### Dar acceso a una persona nueva
1. Firebase → Authentication → Usuarios → **Agregar usuario** con su correo y una contraseña temporal cualquiera.
2. Copia su **UID** y agrégalo a la lista de las reglas de Firestore (Firestore → Reglas → Publicar).
3. Ella entra en la app y usa **«Забыли пароль?»** para elegir su propia contraseña: así nadie más la conoce.

## Probarla en este PC
- `.claude/serve.ps1` sirve la carpeta en `http://localhost:8123` (no se publica).
- Con los emuladores de Firebase corriendo (auth en el puerto 9099, Firestore en el 8080), abre `http://localhost:8123/?emulador` o `http://localhost:8123/chtenie/?emulador`: las apps usan la copia local de Firebase en vez de la real.
- Al terminar, borra los datos de prueba de `localhost` en el navegador, para que nunca terminen subidos a la cuenta real.
