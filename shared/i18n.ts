export const supportedLocales = ["fr", "en", "es", "de"] as const;
export type AppLocale = (typeof supportedLocales)[number];

const fr = {
  "language.fr": "Français", "language.en": "English", "language.es": "Español", "language.de": "Deutsch",
  "brand.tagline": "Vos médias, simplement.", "legal.notice": "Contenus personnels, libres ou autorisés uniquement",
  "settings.title": "Paramètres", "settings.language": "Langue", "settings.auto": "Langue du système", "settings.description": "Choisissez la langue de l’application.", "settings.close": "Fermer",
  "feedback.button": "Suggestion / Correction", "feedback.title": "Suggestion / Correction", "feedback.intro": "Une idée ou un problème ? Écrivez-nous.",
  "feedback.subject": "Sujet", "feedback.message": "Message", "feedback.placeholder": "Décrivez votre suggestion ou les étapes du problème…",
  "feedback.copied": "Adresse et message copiés.", "feedback.copy": "Copier", "feedback.send": "Envoyer", "feedback.defaultSubject": "Clipéo - Suggestion / Correction",
  "feedback.mailTo": "À", "feedback.mailSubject": "Sujet", "feedback.application": "Application : Clipéo",
  "hero.title": "Collez. Choisissez. Téléchargez.", "hero.subtitle": "Vidéo, audio, miniature et qualité au choix — traitement entièrement local.",
  "hero.placeholder": "Collez une URL YouTube, TikTok, Instagram…", "hero.analyze": "Analyser", "hero.analyzing": "Analyse…",
  "media.untitled": "Sans titre", "media.collection": "Collection", "media.items": "{count} élément(s)", "media.duration": "{minutes} min {seconds} s",
  "mode.video": "Vidéo", "mode.thumbnail": "Miniature", "size.mb": "{size} Mo",
  "unit.speed": "{speed} Mo/s", "unit.seconds": "{seconds} s",
  "batch.title": "Téléchargement groupé", "batch.description": "Playlist, chaîne ou profil public. Les éléments déjà téléchargés seront ignorés.", "batch.limit": "Limite",
  "folder.choose": "Choisir le dossier", "folder.none": "Aucun dossier sélectionné", "folder.open": "Ouvrir",
  "download.action": "Télécharger", "download.collectionAction": "Télécharger jusqu’à {count} éléments",
  "queue.title": "Téléchargements", "queue.clear": "Effacer l’historique", "queue.empty": "Aucun téléchargement pour le moment.",
  "queue.clearConfirm": "Effacer tout l’historique ? Les fichiers téléchargés seront conservés.", "queue.remaining": "Temps restant : {eta}", "queue.cancel": "Annuler",
  "status.done": "Terminé", "status.error": "Erreur", "status.cancelled": "Annulé", "status.interrupted": "Interrompu", "status.queued": "En attente…", "status.downloading": "Téléchargement en cours…",
  "context.undo": "Annuler", "context.redo": "Rétablir", "context.cut": "Couper", "context.copy": "Copier", "context.paste": "Coller", "context.selectAll": "Tout sélectionner", "context.openLink": "Ouvrir le lien dans le navigateur",
  "update.title": "Mise à jour de Clipéo", "update.readyTitle": "Mise à jour prête", "update.readyMessage": "La nouvelle version de Clipéo est prête.", "update.install": "Installer et redémarrer", "update.later": "Plus tard",
  "error.invalidUrl": "L’URL fournie est invalide.", "error.httpsOnly": "Seules les URL HTTPS sans identifiants sont acceptées.", "error.invalidRequest": "Demande de téléchargement invalide.",
  "error.invalidMode": "Format de téléchargement invalide.", "error.invalidFolder": "Dossier de destination invalide.", "error.invalidTitle": "Titre du média invalide.", "error.invalidQuality": "Qualité vidéo invalide.",
  "error.invalidLimit": "Limite de collection invalide.", "error.invalidDownloadId": "Identifiant de téléchargement invalide.", "error.engineStart": "Impossible de démarrer le moteur multimédia : {message}",
  "error.engineFailed": "Le moteur multimédia a échoué ({code}).", "error.downloadFailed": "Le téléchargement a échoué ({code}).", "error.unsupported": "Cette adresse ou cette plateforme n’est pas prise en charge.",
  "error.private": "Ce contenu nécessite une connexion ou n’est pas public.", "error.unavailable": "Ce contenu n’est pas disponible.", "error.noSpace": "L’espace disque disponible est insuffisant.",
  "error.invalidLocale": "Langue invalide.", "error.generic": "Une erreur inattendue s’est produite.",
  "download.cancelledMessage": "Téléchargement annulé.", "download.interruptedMessage": "Téléchargement interrompu lors de la fermeture de l’application.",
} as const;

type TranslationKey = keyof typeof fr;
type Catalog = Record<TranslationKey, string>;

const en: Catalog = {
  "language.fr":"Français","language.en":"English","language.es":"Español","language.de":"Deutsch","brand.tagline":"Your media, made simple.","legal.notice":"Personal, free or authorized content only",
  "settings.title":"Settings","settings.language":"Language","settings.auto":"System language","settings.description":"Choose the application language.","settings.close":"Close",
  "feedback.button":"Suggestion / Correction","feedback.title":"Suggestion / Correction","feedback.intro":"Have an idea or found a problem? Write to us.","feedback.subject":"Subject","feedback.message":"Message","feedback.placeholder":"Describe your suggestion or the steps that caused the problem…","feedback.copied":"Address and message copied.","feedback.copy":"Copy","feedback.send":"Send","feedback.defaultSubject":"Clipéo - Suggestion / Correction","feedback.mailTo":"To","feedback.mailSubject":"Subject","feedback.application":"Application: Clipéo",
  "hero.title":"Paste. Choose. Download.","hero.subtitle":"Video, audio, thumbnail and quality options — processed entirely locally.","hero.placeholder":"Paste a YouTube, TikTok, Instagram URL…","hero.analyze":"Analyze","hero.analyzing":"Analyzing…",
  "media.untitled":"Untitled","media.collection":"Collection","media.items":"{count} item(s)","media.duration":"{minutes} min {seconds} sec","mode.video":"Video","mode.thumbnail":"Thumbnail","size.mb":"{size} MB","unit.speed":"{speed} MB/s","unit.seconds":"{seconds} sec",
  "batch.title":"Batch download","batch.description":"Playlist, channel or public profile. Previously downloaded items will be skipped.","batch.limit":"Limit","folder.choose":"Choose folder","folder.none":"No folder selected","folder.open":"Open",
  "download.action":"Download","download.collectionAction":"Download up to {count} items","queue.title":"Downloads","queue.clear":"Clear history","queue.empty":"No downloads yet.","queue.clearConfirm":"Clear the entire history? Downloaded files will be kept.","queue.remaining":"Time remaining: {eta}","queue.cancel":"Cancel",
  "status.done":"Completed","status.error":"Error","status.cancelled":"Cancelled","status.interrupted":"Interrupted","status.queued":"Waiting…","status.downloading":"Downloading…",
  "context.undo":"Undo","context.redo":"Redo","context.cut":"Cut","context.copy":"Copy","context.paste":"Paste","context.selectAll":"Select all","context.openLink":"Open link in browser",
  "update.title":"Clipéo update","update.readyTitle":"Update ready","update.readyMessage":"The new version of Clipéo is ready.","update.install":"Install and restart","update.later":"Later",
  "error.invalidUrl":"The provided URL is invalid.","error.httpsOnly":"Only HTTPS URLs without credentials are accepted.","error.invalidRequest":"Invalid download request.","error.invalidMode":"Invalid download format.","error.invalidFolder":"Invalid destination folder.","error.invalidTitle":"Invalid media title.","error.invalidQuality":"Invalid video quality.","error.invalidLimit":"Invalid collection limit.","error.invalidDownloadId":"Invalid download identifier.","error.engineStart":"Unable to start the media engine: {message}","error.engineFailed":"The media engine failed ({code}).","error.downloadFailed":"The download failed ({code}).","error.unsupported":"This address or platform is not supported.","error.private":"This content requires sign-in or is not public.","error.unavailable":"This content is unavailable.","error.noSpace":"There is not enough disk space.","error.invalidLocale":"Invalid language.","error.generic":"An unexpected error occurred.","download.cancelledMessage":"Download cancelled.","download.interruptedMessage":"Download interrupted when the application was closed.",
};

const es: Catalog = {
  "language.fr":"Français","language.en":"English","language.es":"Español","language.de":"Deutsch","brand.tagline":"Tus contenidos, sin complicaciones.","legal.notice":"Solo contenido personal, libre o autorizado",
  "settings.title":"Ajustes","settings.language":"Idioma","settings.auto":"Idioma del sistema","settings.description":"Elige el idioma de la aplicación.","settings.close":"Cerrar",
  "feedback.button":"Sugerencia / Corrección","feedback.title":"Sugerencia / Corrección","feedback.intro":"¿Tienes una idea o un problema? Escríbenos.","feedback.subject":"Asunto","feedback.message":"Mensaje","feedback.placeholder":"Describe tu sugerencia o los pasos del problema…","feedback.copied":"Dirección y mensaje copiados.","feedback.copy":"Copiar","feedback.send":"Enviar","feedback.defaultSubject":"Clipéo - Sugerencia / Corrección","feedback.mailTo":"Para","feedback.mailSubject":"Asunto","feedback.application":"Aplicación: Clipéo",
  "hero.title":"Pega. Elige. Descarga.","hero.subtitle":"Vídeo, audio, miniatura y calidad a elegir — procesamiento totalmente local.","hero.placeholder":"Pega una URL de YouTube, TikTok, Instagram…","hero.analyze":"Analizar","hero.analyzing":"Analizando…",
  "media.untitled":"Sin título","media.collection":"Colección","media.items":"{count} elemento(s)","media.duration":"{minutes} min {seconds} s","mode.video":"Vídeo","mode.thumbnail":"Miniatura","size.mb":"{size} MB","unit.speed":"{speed} MB/s","unit.seconds":"{seconds} s",
  "batch.title":"Descarga por lotes","batch.description":"Lista, canal o perfil público. Se omitirán los elementos ya descargados.","batch.limit":"Límite","folder.choose":"Elegir carpeta","folder.none":"Ninguna carpeta seleccionada","folder.open":"Abrir",
  "download.action":"Descargar","download.collectionAction":"Descargar hasta {count} elementos","queue.title":"Descargas","queue.clear":"Borrar historial","queue.empty":"Todavía no hay descargas.","queue.clearConfirm":"¿Borrar todo el historial? Los archivos descargados se conservarán.","queue.remaining":"Tiempo restante: {eta}","queue.cancel":"Cancelar",
  "status.done":"Completado","status.error":"Error","status.cancelled":"Cancelado","status.interrupted":"Interrumpido","status.queued":"En espera…","status.downloading":"Descargando…",
  "context.undo":"Deshacer","context.redo":"Rehacer","context.cut":"Cortar","context.copy":"Copiar","context.paste":"Pegar","context.selectAll":"Seleccionar todo","context.openLink":"Abrir enlace en el navegador",
  "update.title":"Actualización de Clipéo","update.readyTitle":"Actualización lista","update.readyMessage":"La nueva versión de Clipéo está lista.","update.install":"Instalar y reiniciar","update.later":"Más tarde",
  "error.invalidUrl":"La URL proporcionada no es válida.","error.httpsOnly":"Solo se aceptan URL HTTPS sin credenciales.","error.invalidRequest":"Solicitud de descarga no válida.","error.invalidMode":"Formato de descarga no válido.","error.invalidFolder":"Carpeta de destino no válida.","error.invalidTitle":"Título del contenido no válido.","error.invalidQuality":"Calidad de vídeo no válida.","error.invalidLimit":"Límite de colección no válido.","error.invalidDownloadId":"Identificador de descarga no válido.","error.engineStart":"No se pudo iniciar el motor multimedia: {message}","error.engineFailed":"El motor multimedia falló ({code}).","error.downloadFailed":"La descarga falló ({code}).","error.unsupported":"Esta dirección o plataforma no es compatible.","error.private":"Este contenido requiere iniciar sesión o no es público.","error.unavailable":"Este contenido no está disponible.","error.noSpace":"No hay suficiente espacio en disco.","error.invalidLocale":"Idioma no válido.","error.generic":"Se produjo un error inesperado.","download.cancelledMessage":"Descarga cancelada.","download.interruptedMessage":"La descarga se interrumpió al cerrar la aplicación.",
};

const de: Catalog = {
  "language.fr":"Français","language.en":"English","language.es":"Español","language.de":"Deutsch","brand.tagline":"Deine Medien, ganz einfach.","legal.notice":"Nur persönliche, freie oder autorisierte Inhalte",
  "settings.title":"Einstellungen","settings.language":"Sprache","settings.auto":"Systemsprache","settings.description":"Wähle die Sprache der Anwendung.","settings.close":"Schließen",
  "feedback.button":"Vorschlag / Korrektur","feedback.title":"Vorschlag / Korrektur","feedback.intro":"Eine Idee oder ein Problem? Schreib uns.","feedback.subject":"Betreff","feedback.message":"Nachricht","feedback.placeholder":"Beschreibe deinen Vorschlag oder die Schritte zum Problem…","feedback.copied":"Adresse und Nachricht kopiert.","feedback.copy":"Kopieren","feedback.send":"Senden","feedback.defaultSubject":"Clipéo - Vorschlag / Korrektur","feedback.mailTo":"An","feedback.mailSubject":"Betreff","feedback.application":"Anwendung: Clipéo",
  "hero.title":"Einfügen. Auswählen. Herunterladen.","hero.subtitle":"Video, Audio, Vorschaubild und Qualität nach Wahl — vollständig lokale Verarbeitung.","hero.placeholder":"YouTube-, TikTok- oder Instagram-URL einfügen…","hero.analyze":"Analysieren","hero.analyzing":"Analyse…",
  "media.untitled":"Ohne Titel","media.collection":"Sammlung","media.items":"{count} Element(e)","media.duration":"{minutes} Min. {seconds} Sek.","mode.video":"Video","mode.thumbnail":"Vorschaubild","size.mb":"{size} MB","unit.speed":"{speed} MB/s","unit.seconds":"{seconds} Sek.",
  "batch.title":"Stapel-Download","batch.description":"Playlist, Kanal oder öffentliches Profil. Bereits geladene Elemente werden übersprungen.","batch.limit":"Limit","folder.choose":"Ordner auswählen","folder.none":"Kein Ordner ausgewählt","folder.open":"Öffnen",
  "download.action":"Herunterladen","download.collectionAction":"Bis zu {count} Elemente herunterladen","queue.title":"Downloads","queue.clear":"Verlauf löschen","queue.empty":"Noch keine Downloads.","queue.clearConfirm":"Gesamten Verlauf löschen? Heruntergeladene Dateien bleiben erhalten.","queue.remaining":"Verbleibende Zeit: {eta}","queue.cancel":"Abbrechen",
  "status.done":"Abgeschlossen","status.error":"Fehler","status.cancelled":"Abgebrochen","status.interrupted":"Unterbrochen","status.queued":"Wartet…","status.downloading":"Wird heruntergeladen…",
  "context.undo":"Rückgängig","context.redo":"Wiederholen","context.cut":"Ausschneiden","context.copy":"Kopieren","context.paste":"Einfügen","context.selectAll":"Alles auswählen","context.openLink":"Link im Browser öffnen",
  "update.title":"Clipéo-Aktualisierung","update.readyTitle":"Aktualisierung bereit","update.readyMessage":"Die neue Clipéo-Version ist bereit.","update.install":"Installieren und neu starten","update.later":"Später",
  "error.invalidUrl":"Die angegebene URL ist ungültig.","error.httpsOnly":"Nur HTTPS-URLs ohne Zugangsdaten werden akzeptiert.","error.invalidRequest":"Ungültige Download-Anfrage.","error.invalidMode":"Ungültiges Download-Format.","error.invalidFolder":"Ungültiger Zielordner.","error.invalidTitle":"Ungültiger Medientitel.","error.invalidQuality":"Ungültige Videoqualität.","error.invalidLimit":"Ungültiges Sammlungslimit.","error.invalidDownloadId":"Ungültige Download-ID.","error.engineStart":"Medien-Engine konnte nicht gestartet werden: {message}","error.engineFailed":"Die Medien-Engine ist fehlgeschlagen ({code}).","error.downloadFailed":"Der Download ist fehlgeschlagen ({code}).","error.unsupported":"Diese Adresse oder Plattform wird nicht unterstützt.","error.private":"Dieser Inhalt erfordert eine Anmeldung oder ist nicht öffentlich.","error.unavailable":"Dieser Inhalt ist nicht verfügbar.","error.noSpace":"Nicht genügend Speicherplatz verfügbar.","error.invalidLocale":"Ungültige Sprache.","error.generic":"Ein unerwarteter Fehler ist aufgetreten.","download.cancelledMessage":"Download abgebrochen.","download.interruptedMessage":"Der Download wurde beim Schließen der Anwendung unterbrochen.",
};

export const catalogs: Record<AppLocale, Catalog> = { fr, en, es, de };
let currentLocale: AppLocale = "fr";

export function normalizeLocale(value: string | null | undefined): AppLocale {
  const language = value?.toLowerCase().split(/[-_]/)[0];
  return supportedLocales.includes(language as AppLocale) ? language as AppLocale : "en";
}

export function setI18nLocale(locale: AppLocale) { currentLocale = locale; }
export function getI18nLocale() { return currentLocale; }
export function translate(key: TranslationKey, values: Record<string, string | number> = {}, locale = currentLocale) {
  return catalogs[locale][key].replace(/\{(\w+)\}/g, (_match, name) => String(values[name] ?? `{${name}}`));
}
export type { TranslationKey };
