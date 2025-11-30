/**
 * @OnlyCurrentDoc
 *
 * ShareSquad Companion
 *
 * 1. Importa miembros de grupos a una nueva hoja.
 * 2. Exporta los datos de una hoja al formato JSON de ShareSquad.
 */

// ============================================================================
// --- 1. CONFIGURACIÓN GLOBAL Y CONSTANTES ---
// ============================================================================

/**
 * Configuración de la aplicación.
 */
const CONFIG = {
  APP_NAME: "ShareSquad Companion",
  APP_VERSION: "1.0 (Nov 2025)"
};

/**
 * Clave para marcar las hojas exportadas con metadata.
 */
const METADATA_KEY = "isShareSquadExport";

/**
 * Cadenas de texto para internacionalización (i18n).
 */
const STRINGS = {
  es: {
    menuTitle: "ShareSquad Companion",
    menuImport: "Importar grupos...",
    menuExport: "Exportar a JSON...",
    menuAbout: "Acerca de...",
    // Títulos de Diálogos
    importTitle: "Importar Grupos de Google",
    exportTitle: "Exportar a JSON de ShareSquad",
    aboutTitle: "Acerca de ShareSquad Companion",
    // Cabeceras de Hoja
    headerGroupEmail: "Email del Grupo",
    headerMemberEmail: "Email del Miembro",
    // Diálogo "Acerca de"
    aboutText1: "Esta herramienta importa miembros de Grupos de Google a Hojas de Cálculo y los exporta al formato JSON compatible con la ",
    aboutTextLink: "extensión ShareSquad",
    aboutText2: ".",
    aboutCopyright: "© Pablo Felip",
    aboutLicense: "Ofrecido bajo licencia",
    aboutMoreTools: "Más herramientas en",
    // Diálogo Importar
    importInstructions: "Selecciona los grupos que deseas importar a la hoja.",
    importWarningNested: "(Advertencia: Solo se importarán miembros directos, no miembros de grupos anidados.)",
    importLoadingGroups: "Cargando grupos...",
    importButton: "Importar",
    importSuccess: "¡Importación completada! Todos los miembros se han añadido a una nueva hoja.",
    importSuccessWithErrors: "Importación completada. No se pudo acceder a {0} grupo(s): {1}. El resto de miembros se ha añadido.",
    // Diálogo Exportar
    exportInstructions: "Selecciona la pestaña de la hoja de cálculo que deseas exportar a formato JSON.",
    exportButton: "Exportar",
    // Botones
    close: "Cerrar",
    loading: "Cargando...",
    // Errores
    errorGetGroups: "No se pudieron obtener los grupos. Asegúrate de tener los permisos necesarios.",
    errorNoGroupsSelected: "No has seleccionado ningún grupo.",
    errorImport: "Ocurrió un error durante la importación.",
    errorNoMembersFetched: "No se recuperó ningún miembro. Los grupos pueden estar vacíos o no tener permisos para verlos.",
    errorGetSheets: "No se pudieron obtener las hojas exportadas.",
    errorNoSheets: "No se encontraron hojas exportadas por ShareSquad Companion.",
    errorSheetNotFound: "No se pudo encontrar la hoja seleccionada.",
    errorGenerateJson: "Ocurrió un error al generar el JSON.",
  },
  en: {
    menuTitle: "ShareSquad Companion",
    menuImport: "Import groups...",
    menuExport: "Export to JSON...",
    menuAbout: "About...",
    // Dialog Titles
    importTitle: "Import Google Groups",
    exportTitle: "Export to ShareSquad JSON",
    aboutTitle: "About ShareSquad Companion",
    // Sheet Headers
    headerGroupEmail: "Group Email",
    headerMemberEmail: "Member Email",
    // About Dialog
    aboutText1: "This tool imports Google Group members into Sheets and exports them to the JSON format compatible with the ",
    aboutTextLink: "ShareSquad extension",
    aboutText2: ".",
    aboutCopyright: "© Pablo Felip",
    aboutLicense: "Offered under",
    aboutMoreTools: "More tools at",
    // Import Dialog
    importInstructions: "Select the groups you want to import to the sheet.",
    importWarningNested: "(Warning: Only direct members will be imported, not members of nested groups.)",
    importLoadingGroups: "Loading groups...",
    importButton: "Import",
    importSuccess: "Import complete! All members have been added to a new sheet.",
    importSuccessWithErrors: "Import complete. Could not access {0} group(s): {1}. Remaining members were added.",
    // Export Dialog
    exportInstructions: "Select the spreadsheet tab you want to export to JSON format.",
    exportButton: "Export",
    // Buttons
    close: "Close",
    loading: "Loading...",
    // Errors
    errorGetGroups: "Could not retrieve groups. Make sure you have the necessary permissions.",
    errorNoGroupsSelected: "You have not selected any groups.",
    errorImport: "An error occurred during the import.",
    errorNoMembersFetched: "No members were retrieved. Selected groups may be empty or you may lack permissions to view them.",
    errorGetSheets: "Could not retrieve exported sheets.",
    errorNoSheets: "No sheets exported by ShareSquad Companion were found.",
    errorSheetNotFound: "Could not find the selected sheet.",
    errorGenerateJson: "An error occurred while generating the JSON.",
  }
};


// ============================================================================
// --- 2. FUNCIONES DE UTILIDAD (i18n) ---
// ============================================================================

/**
 * Detecta el idioma del usuario ('es' o 'en').
 * @returns {String} "es" o "en".
 */
function getLocale_() {
  const locale = Session.getActiveUserLocale();
  return locale.startsWith("es") ? "es" : "en";
}

/**
 * Obtiene el objeto de traducciones para el idioma actual.
 * @returns {Object}
 */
function getTranslations_() {
  const locale = getLocale_();
  return STRINGS[locale];
}

/**
 * Obtiene una cadena de texto traducida por su clave.
 * @param {String} key La clave de la cadena (ej: "menuTitle").
 * @returns {String} La cadena traducida.
 */
function translate_(key) {
  const locale = getLocale_();
  return STRINGS[locale][key];
}


// ============================================================================
// --- 3. FUNCIONES DE MENÚ Y DIÁLOGOS ---
// ============================================================================

/**
 * Se ejecuta al abrir la hoja de cálculo. Crea el menú personalizado.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const t = getTranslations_();

  ui.createMenu(t.menuTitle)
    .addItem(t.menuImport, "mostrarDialogoGrupos")
    .addItem(t.menuExport, "mostrarDialogoExportar")
    .addSeparator()
    .addItem(t.menuAbout, "mostrarDialogoAcercaDe")
    .addToUi();
}

/**
 * Función genérica para mostrar un diálogo HTML.
 * Inyecta las traducciones y constantes globales como JSON string.
 * @param {String} titleKey Clave de traducción para el título del diálogo.
 * @param {String} filename Nombre del archivo HTML.
 */
function mostrarDialogo_(titleKey, filename) {
  const t = getTranslations_();
  const template = HtmlService.createTemplateFromFile(filename);

  // Inyectar los objetos como strings JSON (método robusto confirmado)
  template.t = JSON.stringify(t);
  template.CONFIG = JSON.stringify(CONFIG);

  // Ancho fijo de 500px para Importación/Exportación
  const html = template.evaluate().setWidth(500).setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, t[titleKey]);
}

/** Muestra el diálogo de importación de grupos. */
function mostrarDialogoGrupos() {
  mostrarDialogo_("importTitle", "DialogoGrupos.html");
}

/** Muestra el diálogo de exportación a JSON. */
function mostrarDialogoExportar() {
  mostrarDialogo_("exportTitle", "DialogoExportar.html");
}

/** Muestra el diálogo "Acerca de". */
function mostrarDialogoAcercaDe() {
  const t = getTranslations_();
  const template = HtmlService.createTemplateFromFile("DialogoAcercaDe.html");
  
  // Inyectar variables (método de plantilla simple para este diálogo)
  template.t = t;
  template.CONFIG = CONFIG;

  // Usar dimensiones personalizadas (410px de alto para evitar barra)
  const html = template.evaluate().setWidth(500).setHeight(470);
  SpreadsheetApp.getUi().showModalDialog(html, t.aboutTitle);
}


// ============================================================================
// --- 4. LÓGICA DE IMPORTACIÓN (GRUPOS -> HOJA) ---
// ============================================================================

/**
 * Obtiene la lista de grupos (email como nombre) a los que el usuario pertenece.
 * Se llama desde el cliente (DialogoGrupos.html).
 * @returns {Array|Object} Lista de objetos {name, email} o un objeto de error.
 */
function obtenerGruposDeUsuario() {
  try {
    const groups = GroupsApp.getGroups();
    return groups
      .map(group => ({
        name: group.getEmail(),
        email: group.getEmail()
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente
  } catch (e) {
    Logger.log(e);
    return { error: translate_("errorGetGroups") };
  }
}

/**
 * Procesa los grupos seleccionados y vuelca sus miembros a una nueva hoja.
 * Se llama desde el cliente (DialogoGrupos.html).
 * @param {Array<String>} emailsDeGrupos - Array de emails de los grupos seleccionados.
 * @returns {Object} Objeto de éxito o error.
 */
function procesarGruposSeleccionados(emailsDeGrupos) {
  if (!emailsDeGrupos || emailsDeGrupos.length === 0) {
    return { error: translate_("errorNoGroupsSelected") };
  }

  const t = getTranslations_();
  const datosParaHoja = [];
  const gruposFallidos = [];


  // --- IMPLEMENTACIÓN (A): Ordenar alfabéticamente los grupos seleccionados ---
  emailsDeGrupos.sort(); // Ordena el array por email del grupo (alfabético)

  // --- 1. REFACTOR: Recopilar datos de forma resiliente (en memoria) ---
  emailsDeGrupos.forEach(emailGrupo => {
    try {
      const group = GroupsApp.getGroupByEmail(emailGrupo);
      const members = group.getUsers();
      
      if (members.length > 0) {
        // --- IMPLEMENTACIÓN (B): Obtener emails y ordenar alfabéticamente ---
        const memberEmails = members.map(miembro => miembro.getEmail());
        memberEmails.sort(); // Ordena alfabéticamente los emails de los miembros
        // Mapear los emails ordenados al formato de fila [[grupo, miembro], ...]
        const datosGrupo = memberEmails.map(emailMiembro => [
          emailGrupo,           // Col A (Email del Grupo)
          emailMiembro          // Col B (Email del Miembro)
        ]);
        datosParaHoja.push(...datosGrupo); // Añadir filas al array
      }
      // Si members.length es 0, no es un error, solo está vacío.
    } catch (e) {
      // Error de permisos o cualquier otro fallo en el grupo individual
      Logger.log(`Error al procesar el grupo ${emailGrupo}: ${e.message}`);
      gruposFallidos.push(emailGrupo);
    }
  });

  // --- 2. REFACTOR: Comprobar si se obtuvo algo ---
  if (datosParaHoja.length === 0) {
    let errorMsg = translate_("errorNoMembersFetched");
    if (gruposFallidos.length > 0) {
      errorMsg += ` Grupos fallidos: ${gruposFallidos.join(", ")}`;
    }
    return { error: errorMsg };
  }

  // --- 3. REFACTOR: Si hay datos, crear la hoja y escribir ---
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
    const fecha = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm:ss");
    const nombreHoja = `SS_Export_${fecha}`;
    const sheet = ss.insertSheet(nombreHoja);

    sheet.addDeveloperMetadata(METADATA_KEY, "true");

    // Cabeceras (traducidas)
    const cabeceras = [
      translate_("headerGroupEmail"),
      translate_("headerMemberEmail")
    ];
    sheet.getRange(1, 1, 1, cabeceras.length).setValues([cabeceras]).setFontWeight("bold");

    // Escribir todos los datos de una vez(desde la fila 2)
    sheet.getRange(2, 1, datosParaHoja.length, datosParaHoja[0].length).setValues(datosParaHoja);
    
    sheet.activate();

    // --- 4. REFACTOR: Devolver mensaje de éxito (con o sin advertencias) ---
    if (gruposFallidos.length > 0) {
      let warningMsg = translate_("importSuccessWithErrors")
                        .replace("{0}", gruposFallidos.length)
                        .replace("{1}", gruposFallidos.join(", "));
      // Devolver un 'message' con tipo 'warning'
      return { message: warningMsg, type: "warning" }; 
    } else {
      // Éxito total
      return { message: translate_("importSuccess"), type: "success" };
    }

  } catch (e) {
    Logger.log(e);
    return { error: `${translate_("errorImport")}: ${e.message}` };
  }
}


// ============================================================================
// --- 5. LÓGICA DE EXPORTACIÓN (HOJA -> JSON) ---
// ============================================================================

/**
 * Obtiene las hojas que han sido marcadas con la metadata de este script.
 * Se llama desde el cliente (DialogoExportar.html).
 * @returns {Array<String>|Object} Lista de nombres de hojas o un objeto de error.
 */
function obtenerHojasExportadas() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const allSheets = ss.getSheets();
    const hojasExportadas = [];

    // Comprobar la metadata de la hoja (más robusto que el nombre)
    allSheets.forEach(sheet => {
      const metadata = sheet.getDeveloperMetadata();
      const esHojaExportada = metadata.some(meta => meta.getKey() === METADATA_KEY);
      if (esHojaExportada) {
        hojasExportadas.push(sheet.getName());
      }
    });

    if (hojasExportadas.length === 0) {
      return { error: translate_("errorNoSheets") };
    }

    return hojasExportadas;
  } catch (e) {
    Logger.log(e);
    return { error: `${translate_("errorGetSheets")}: ${e.message}` };
  }
}

/**
 * Lee los datos de una hoja y los convierte al formato JSON de ShareSquad.
 * Se llama desde el cliente (DialogoExportar.html).
 * @param {String} nombreHoja - El nombre de la hoja a procesar.
 * @returns {Object} El objeto JSON final o un objeto de error.
 */
function generarJsonDeHoja(nombreHoja) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(nombreHoja);

    if (!sheet) {
      return { error: translate_("errorSheetNotFound") };
    }

    const datos = sheet.getDataRange().getValues();
    
    // Estructuras de datos para normalización
    const users = [];
    const groups = [];
    const mapaUsuarios = {}; // { "email": "u_12345" }
    const mapaGrupos = {};   // { "nombreGrupo": "g_67890" }

    // Objeto final a devolver
    const jsonOutput = {
      users: [],
      groups: []
    };
    
    // Asumir que la cabecera está en la Fila 1 (índice 0)
    const cabeceras = datos[0];
    const indiceGrupo = cabeceras.indexOf(translate_("headerGroupEmail"));
    const indiceMiembro = cabeceras.indexOf(translate_("headerMemberEmail"));

    // Validar cabeceras
    if (indiceGrupo === -1 || indiceMiembro === -1) {
      return { error: `Las cabeceras de la hoja no son correctas. Se esperaba '${translate_("headerGroupEmail")}' y '${translate_("headerMemberEmail")}'.` };
    }

    // Iterar por los datos (saltar cabecera, fila 0)
    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      const nombreGrupo = fila[indiceGrupo];
      const emailUsuario = fila[indiceMiembro];

      if (!nombreGrupo || !emailUsuario) continue;

      let userId;
      let groupId;

      // --- 1. Normalizar Usuario ---
      if (!mapaUsuarios[emailUsuario]) {
        // Usuario nuevo, crear ID y añadirlo
        // NOTA: Usar i o un contador secuencial aquí asegura que los IDs son diferentes 
        // para diferentes usuarios, incluso si Date.now() es el mismo.
        userId = `u_${Date.now() + i}`; // ID único simple
        mapaUsuarios[emailUsuario] = userId;
        jsonOutput.users.push({
          id: userId,
          email: emailUsuario
        });
      } else {
        // Usuario existente
        userId = mapaUsuarios[emailUsuario];
      }

      // --- 2. Normalizar Grupo ---
      if (!mapaGrupos[nombreGrupo]) {
        // Grupo nuevo, crear ID y añadirlo
        groupId = `g_${Date.now() + i + 1000}`; // ID único simple
        mapaGrupos[nombreGrupo] = groupId;
        jsonOutput.groups.push({
          id: groupId,
          name: nombreGrupo,
          userIds: [] // Inicializar array de miembros
        });
      } else {
        // Grupo existente
        groupId = mapaGrupos[nombreGrupo];
      }

      // --- 3. Vincular Usuario al Grupo ---
      // Buscar el grupo en el array de salida
      const grupoObj = jsonOutput.groups.find(g => g.id === groupId);
      
      // Añadir el ID de usuario si no existe ya en ese grupo
      if (grupoObj && !grupoObj.userIds.includes(userId)) {
        grupoObj.userIds.push(userId);
      }
    }

    return jsonOutput;

  } catch (e) {
    Logger.log(e);
    return { error: `${translate_("errorGenerateJson")}: ${e.message}` };
  }
}