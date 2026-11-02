# CreatorRing 🥊

Catálogo web de peleadores de boxeo entre creadores de contenido, con administración de
**peleadores, combates y eventos** desde Supabase. Proyecto estático: HTML, CSS y JavaScript.

## Primeros pasos

1. Extrae el ZIP; **guarda una copia** del original por separado.
2. Ejecuta un servidor local desde la carpeta `creatorring`:
   `python3 -m http.server 5500` y abre `http://localhost:5500`.
3. Revisa `supabase-config.js`: solo debe tener la URL del proyecto y la **publishable key**.
   Nunca pongas `service_role`, `secret key`, contraseñas ni tokens privados allí.
4. Inicia sesión en `http://localhost:5500/admin/login.html` con el administrador que ya registraste.
5. En Supabase SQL Editor revisa y, si hacen falta columnas de eventos, ejecuta
   `sql/01_eventos_campos.sql` **tras hacer un respaldo**. La migración no borra registros.
6. Empieza por **Eventos**, después **Peleadores** y al final **Combates**.

## Qué contiene

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Página pública: roster, perfiles y eventos. |
| `style.css` | Estilos del catálogo y diseño responsive. |
| `peleadores.js` | Datos históricos locales. **No se sincronizan** con Supabase. |
| `script.js` | Consulta Supabase, fusiona por slug, muestra perfiles e historiales. |
| `supabase-config.js` | Configuración pública y creación de `supabaseClient`. |
| `admin/login.html` | Autenticación Supabase y consulta de función `es_administrador`. |
| `admin/panel.html` | Formularios y listados administrativos. |
| `admin/admin.js` | Lógica de agregar, editar y eliminar registros. |
| `admin/admin.css` | Estilos del panel. |
| `admin/generador.html` | **Herramienta antigua**: genera JSON, no escribe en la base de datos. |
| `sql/01_eventos_campos.sql` | Agrega columnas opcionales que requiere el panel de eventos. |
| `tests/smoke_browser.py` | Pruebas de interfaz con Supabase simulado; no toca tu base real. |

## Flujo de datos

`Supabase Auth + administradores + RLS` permite operaciones de escritura
solamente a tu usuario autorizado. `peleadores`, `combates` y `eventos`
permiten la lectura pública necesaria para el catálogo. El navegador recibe
solo la **clave publicable**, que nunca sustituye las políticas RLS.

En el catálogo, los datos locales se muestran inmediatamente. Después se
consultan **eventos**, **combates** y **peleadores** en ese orden, para
relacionar `evento_id` y `peleador_id`. Si hay coincidencia de `slug`, gana
Supabase. Los peleadores originales que no hayas importado siguen apareciendo.

## Importante antes de cargar tus datos

- `peleadores.id` es un número (automático). `peleadores.slug` es el identificador
  textual único. `combates.peleador_id` guarda el **número**, no el slug.
- `combates.evento_id` puede estar vacío. Si se asigna, la ficha muestra el nombre
  del evento. La eliminación puede estar bloqueada si hay claves foráneas.
- **Cada pelea pertenece a un peleador**. Si dos peleadores están registrados y quieres
  que ambos historiales muestren el encuentro, crea una fila por peleador con
  el resultado correspondiente.
- El `record` **se edita manualmente** en la ficha del peleador; no se recalcula
  automáticamente con las filas de combates. Es intencional para no alterar
  historiales incompletos.
- Un evento de Supabase sin hora exacta se cuenta desde el inicio (00:00) de su
  fecha según el huso horario del visitante; el contador es orientativo.
- TikTok, YouTube, Instagram y X aparecen solo si tienen URL HTTP(S) válida.
- Las fotos sin URL o con enlace roto usan el avatar que ya tenía el proyecto.
- Si `eventos` está vacío, aparecen las tarjetas de promotoras históricas que
  traía la página. Si hay eventos en Supabase, esas tarjetas se reemplazan.
- El panel **no incorpora subida de imágenes**: usa URL pública de imagen.
- Para datos reales, verifica resultados, enlaces y derechos de imágenes.

## Seguridad y publicación

- No quites RLS ni utilices claves secretas en HTML/JS.
- Confirma que Supabase `administradores`, `es_administrador()` y las políticas
  de SELECT público / escritura solo administrador continúan activos.
- `admin/login.html` es una ruta pública, pero los permisos de escritura los
  controla Supabase, no la ocultación del panel.
- En Netlify, publica **la carpeta creatorring** como raíz. Para un sitio estático
  sin compilación, no hace falta comando de build.
- Tras probar localmente: `git status`, `git add .`, `git commit -m "Mejora panel y catalogo"`,
  `git push`. Netlify puede desplegar automáticamente si el repositorio está vinculado.
- El ZIP entregado excluye `.git` para no mezclar historiales ni configuraciones
  locales; conserva tu repositorio Git original y copia estos archivos sobre él.

## Diagnóstico rápido

- **Peleadores nuevos no aparecen**: revisa que el sitio tenga red, que la
  URL/clave publicable sean correctas y que RLS permita SELECT en `peleadores`.
- **Acceso denegado**: comprueba el usuario de Auth y su fila en `administradores`;
  verifica `es_administrador()` y políticas de escritura.
- **No guarda evento**: ejecuta la migración SQL de eventos y revisa las columnas
  existentes obligatorias de tu esquema si sigue fallando.
- **No guarda combate**: comprueba que el peleador (y evento, si lo seleccionaste)
  exista en Supabase y que el usuario sea administrador.
- **No aparecen videos**: si no hay URL, el texto «Sin video» es esperado.
- **Datos viejos tras cambios**: recarga con Ctrl+Shift+R y vuelve a abrir el perfil.

Manual ampliado: **Manual-CreatorRing.pdf** (se entrega por separado).
