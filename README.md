[🇬🇧 English version](README.en.md)

# ShareSquad Companion para Hojas de Cálculo de Google™

## Descripción

**ShareSquad Companion** es una herramienta de Hojas de Cálculo de Google (Google Sheets) diseñada para funcionar como un complemento para la extensión de Chrome **[ShareSquad para Notion™](https://github.com/pfelipm/sharesquad-notion)**.

Su propósito es actuar como un **puente entre tus Grupos de Google (Google Groups) y la extensión ShareSquad**. Te permite importar los miembros de tus grupos de Google a una hoja de cálculo y luego exportarlos en el formato JSON exacto que la extensión ShareSquad necesita para funcionar.

### ¿Por qué existe esta herramienta?

La extensión ShareSquad fue diseñada para ser una herramienta ligera y agnóstica, centrada únicamente en mejorar la gestión de invitados en Notion. Integrar directamente la funcionalidad de Google Groups en la extensión habría implicado dos desafíos importantes:

1.  **Complejidad de la Autenticación (OAuth):** Acceder a los Grupos de Google de un usuario requiere un proceso de autenticación (OAuth 2.0) que debe ser verificado y aprobado por Google. Este es un paso complejo y laborioso para una extensión experimental y no publicada.
2.  **Especificidad del Ecosistema:** La integración directa limitaría conceptualmente la extensión al ecosistema de Google, cuando su función principal está ligada a Notion, una plataforma independiente.

**ShareSquad Companion** es la solución pragmática a este problema: una herramienta separada que se ejecuta de forma segura en el entorno de Google del propio usuario, permitiéndole preparar los datos de sus grupos para importarlos fácilmente a la extensión.

## Características

*   **Importación desde Google Groups:** Analiza los grupos a los que pertenece el usuario y vuelca los miembros (email del grupo y email del miembro) en una nueva hoja de cálculo.
*   **Exportación a JSON compatible:** Convierte los datos de la hoja de cálculo generada al formato JSON que la función de importación de la extensión ShareSquad puede leer.
*   **Soporte multi-idioma:** Detección automática de idioma (español e inglés) para la interfaz.

## Instalación

La instalación no requiere descargar nada. Simplemente, haz una copia de la plantilla pública de Google Sheets:

1.  **Abre la Plantilla:** Haz clic en el siguiente enlace para abrir la Hoja de Cálculo maestra:
    *   **[Plantilla Pública de ShareSquad Companion](https://docs.google.com/spreadsheets/d/1Y3wp_gu7BZqxnn5Hnzo5nWmtJKh_HmnqNXQFJ_XSY54/edit)**
2.  **Haz una Copia:** Ve al menú `Archivo` → `Hacer una copia`.
3.  **¡Listo!** La copia que has creado en tu propio Google Drive contiene todo el código necesario y está lista para usar. Al abrirla, aparecerá un nuevo menú llamado **"ShareSquad Companion"**.

## Modo de Uso

El proceso tiene dos fases: importar desde Google Groups a la hoja, y exportar desde la hoja al formato JSON.

### Fase 1: Importar Grupos a la Hoja de Cálculo

1.  **Abre tu copia** de la Hoja de Cálculo.
2.  En el menú, ve a `ShareSquad Companion` → `Importar grupos...`.
3.  **Autoriza el script:** La primera vez que lo uses, Google te pedirá permiso para que el script pueda acceder a tus Grupos de Google y modificar tus hojas de cálculo. Es un paso necesario y seguro, ya que el código se ejecuta únicamente en tu cuenta.
4.  **Selecciona los grupos:** En el diálogo que aparece, elige los grupos cuyos miembros quieres importar.
5.  Haz clic en **"Importar"**. Se creará una nueva pestaña en tu hoja con los correos del grupo y de sus miembros.

### Fase 2: Exportar a JSON y Usar en la Extensión

1.  Una vez generada la hoja, ve a `ShareSquad Companion` → `Exportar a JSON...`.
2.  En el diálogo que aparece, **selecciona la pestaña** de la hoja de cálculo que contiene los datos de los grupos importados.
3.  Haz clic en **"Exportar"**. Se descargará automáticamente un archivo JSON con los datos.
4.  Abre la extensión **ShareSquad** en Notion, ve a la pestaña de `Backup` (Copia de seguridad).
5.  Usa la función de **"Importar"** de la extensión para cargar el archivo JSON descargado.

Tus grupos y miembros de Google Groups aparecerán ahora como "squads" en la extensión, listos para ser añadidos a cualquier página de Notion.

## Detalles Técnicos

*   **Arquitectura y Acceso a Grupos:** El script utiliza `[HtmlService](https://developers.google.com/apps-script/reference/html/html-service)` para renderizar los diálogos y [GroupsApp](https://developers.google.com/apps-script/reference/groups/groups-app) para interactuar con Google Groups. Se eligió GroupsApp en lugar del [Admin SDK Directory Service](https://developers.google.com/workspace/admin/directory/reference/rest) para que la herramienta pueda ser usada por cualquier usuario de Google, no solo por administradores de Google Workspace. Esto conlleva una limitación importante: el servicio `GroupsApp` es menos potente y solo puede obtener los miembros directos de un grupo (no los miembros de grupos anidados) y únicamente su email (no el nombre del grupo).
*   **Internacionalización (i18n):** La detección del idioma se realiza en el backend de Apps Script usando `Session.getActiveUserLocale()`. Se configura para mostrar la interfaz en español (ES) para locales de habla hispana y en inglés (EN) para el resto. Todos los textos de la interfaz se almacenan en un objeto `STRINGS` para facilitar su traducción y mantenimiento.
*   **Dependencias:** La interfaz de los diálogos está construida con HTML y estilizada con **Bootstrap 5**, cargado a través de una CDN para mantener la herramienta ligera.
*   **Identificación de Hojas:** Para identificar de forma robusta las pestañas de la hoja de cálculo que contienen datos importados por esta herramienta, se utiliza la funcionalidad de `[DeveloperMetadata](https://developers.google.com/apps-script/reference/spreadsheet/developer-metadata)` de Google Sheets. Esto es más fiable que depender del nombre de la pestaña o del contenido de celdas específicas.

## Privacidad de Datos

*   Todo el código se ejecuta dentro del entorno seguro de tu propia cuenta de Google.
*   Los datos de tus grupos y miembros se almacenan únicamente en tu hoja de cálculo personal.
*   Esta herramienta no transmite ninguna información fuera de tu cuenta de Google.

## Créditos y Contribuciones

Este proyecto ha sido creado y es mantenido por [Pablo Felip](https://www.linkedin.com/in/pfelipm/).

## Licencia

Este proyecto se distribuye bajo la licencia GPL-3.0. Consulta el archivo [LICENSE](/LICENSE) para más detalles.
