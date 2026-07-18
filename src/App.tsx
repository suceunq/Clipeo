import { useEffect, useState } from "react";
import { Ban, Download, FolderOpen, Link, Mail, Music, Settings, Trash2, Video, X } from "lucide-react";
import type { DownloadMode, DownloadProgress, LocalePreference, MediaInfo, UpdateState } from "../shared/types";
import { normalizeLocale, supportedLocales, translate, type AppLocale, type TranslationKey } from "../shared/i18n";
import "./App.css";

export default function App() {
  const [locale, setLocale] = useState<AppLocale>(() => normalizeLocale(navigator.language));
  const [localePreference, setLocalePreference] = useState<LocalePreference>("system");
  const t = (key: TranslationKey, values?: Record<string, string | number>) => translate(key, values, locale);
  const [url, setUrl] = useState(""), [info, setInfo] = useState<MediaInfo | null>(null), [mode, setMode] = useState<DownloadMode>("video"),
    [format, setFormat] = useState(""), [maxItems, setMaxItems] = useState(50),
    [folder, setFolder] = useState(() => localStorage.getItem("clipeo:download-folder") ?? ""), [busy, setBusy] = useState(false),
    [feedbackOpen, setFeedbackOpen] = useState(false), [settingsOpen, setSettingsOpen] = useState(false), [error, setError] = useState(""),
    [items, setItems] = useState<DownloadProgress[]>([]), [updateState, setUpdateState] = useState<UpdateState>({ phase: "idle", currentVersion: "—" });

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = "Clipéo";
  }, [locale]);

  useEffect(() => {
    if (!window.clipeo) return;
    void window.clipeo.getLocale().then((settings) => { setLocale(settings.locale); setLocalePreference(settings.preference); });
    void window.clipeo.history().then(setItems);
    void window.clipeo.getUpdateState().then(setUpdateState);
    const removeProgress = window.clipeo.onProgress((progress) => setItems((current) => {
      const index = current.findIndex((item) => item.id === progress.id);
      return index < 0 ? [progress, ...current] : current.map((item) => item.id === progress.id ? progress : item);
    }));
    const removeUpdateState = window.clipeo.onUpdateState(setUpdateState);
    return () => { removeProgress(); removeUpdateState(); };
  }, []);

  async function changeLanguage(preference: LocalePreference) {
    if (!window.clipeo) { setLocalePreference(preference); setLocale(preference === "system" ? normalizeLocale(navigator.language) : preference); return; }
    const settings = await window.clipeo.setLocale(preference);
    setLocale(settings.locale); setLocalePreference(settings.preference);
  }

  async function analyze() {
    try { setBusy(true); setError(""); const result = await window.clipeo.analyze(url); setInfo(result); setFormat(result.formats[0]?.id ?? ""); }
    catch (cause) { setError(cleanError(cause)); } finally { setBusy(false); }
  }
  async function choose() { const selected = await window.clipeo.chooseFolder(); if (selected) { setFolder(selected); localStorage.setItem("clipeo:download-folder", selected); } }
  async function clearHistory() { if (!window.confirm(t("queue.clearConfirm"))) return; await window.clipeo.clearHistory(); setItems([]); }
  async function download() {
    if (!info || !folder) return;
    try { setError(""); await window.clipeo.download({ url: info.url, title: info.title, mode, formatId: format, outputDir: folder, collection: info.isCollection, maxItems }); }
    catch (cause) { setError(cleanError(cause)); }
  }

  return <main>
    <header>
      <div className="brand"><span>▶</span><div><h1>Clipéo</h1><p>{t("brand.tagline")}</p></div></div>
      <div className="header-actions">
        <button className="icon-button" aria-label={t("settings.title")} title={t("settings.title")} onClick={() => setSettingsOpen(true)}><Settings /></button>
        <button className="feedback-button" onClick={() => setFeedbackOpen(true)}><Mail />{t("feedback.button")}</button>
        <div className="legal">{t("legal.notice")}</div>
      </div>
    </header>
    <section className="hero">
      <h2>{t("hero.title")}</h2><p>{t("hero.subtitle")}</p>
      <div className="urlbar"><Link /><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder={t("hero.placeholder")} />
        <button onClick={analyze} disabled={busy}>{busy ? t("hero.analyzing") : t("hero.analyze")}</button></div>
      {error && <div className="error">{error}</div>}
    </section>
    {info && <section className="card media">
      {info.thumbnail && <img src={info.thumbnail} alt="" />}
      <div className="details"><small>{info.platform}</small><h3>{info.title}</h3>
        <p>{info.author}{info.isCollection ? ` · ${t("media.collection")}${info.itemCount ? ` · ${t("media.items", { count: info.itemCount })}` : ""}` : ` · ${t("media.duration", { minutes: Math.floor(info.duration / 60), seconds: Math.round(info.duration % 60) })}`}</p>
        <div className="modes"><button className={mode === "video" ? "active" : ""} onClick={() => setMode("video")}><Video />{t("mode.video")}</button>
          {(["mp3", "m4a", "wav"] as DownloadMode[]).map((value) => <button key={value} className={mode === value ? "active" : ""} onClick={() => setMode(value)}><Music />{value.toUpperCase()}</button>)}
          <button className={mode === "thumbnail" ? "active" : ""} onClick={() => setMode("thumbnail")} >{t("mode.thumbnail")}</button></div>
        {mode === "video" && <select value={format} onChange={(event) => setFormat(event.target.value)}>{info.formats.map((value) => <option key={value.id} value={value.id}>{value.label}{value.size ? ` · ${t("size.mb", { size: new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value.size / 1048576) })}` : ""}</option>)}</select>}
        {info.isCollection && <div className="batch-options"><div><strong>{t("batch.title")}</strong><small>{t("batch.description")}</small></div><label>{t("batch.limit")}<input type="number" min="1" max="1000" value={maxItems} onChange={(event) => setMaxItems(Math.min(1000, Math.max(1, Number(event.target.value) || 1)))} /></label></div>}
        <div className="destination"><button onClick={choose}><FolderOpen />{t("folder.choose")}</button><span>{folder || t("folder.none")}</span>{folder && <button onClick={() => void window.clipeo.openFolder(folder)}>{t("folder.open")}</button>}</div>
        <button className="download" onClick={download} disabled={!folder}><Download />{info.isCollection ? t("download.collectionAction", { count: maxItems }) : t("download.action")}</button>
      </div>
    </section>}
    <section className="queue"><div className="queue-title"><h2>{t("queue.title")}</h2>{items.length > 0 && <button onClick={clearHistory}><Trash2 />{t("queue.clear")}</button>}</div>
      {items.length === 0 ? <p className="empty">{t("queue.empty")}</p> : items.map((item) => <article key={item.id}><div><strong>{item.title}</strong><small>{t(`status.${item.status}` as TranslationKey)}</small>{item.message && (item.status === "error" || item.status === "interrupted") && <small className="error-detail">{item.message}</small>}</div>
        <div className="progress"><span style={{ width: `${item.percent}%` }} /></div><footer>{item.percent.toFixed(0)}% <span>{item.speed}</span><span>{t("queue.remaining", { eta: item.eta })}</span>{item.status === "downloading" && <button onClick={() => void window.clipeo.cancel(item.id)}><Ban />{t("queue.cancel")}</button>}</footer></article>)}</section>
    {feedbackOpen && <FeedbackDialog t={t} onClose={() => setFeedbackOpen(false)} />}
    {settingsOpen && <SettingsDialog t={t} locale={locale} preference={localePreference} updateState={updateState} onChange={changeLanguage} onCheck={() => window.clipeo.checkForUpdates()} onInstall={() => window.clipeo.installUpdate()} onClose={() => setSettingsOpen(false)} />}
  </main>;
}

type T = (key: TranslationKey, values?: Record<string, string | number>) => string;

function SettingsDialog({ t, locale, preference, updateState, onChange, onCheck, onInstall, onClose }: { t: T; locale: AppLocale; preference: LocalePreference; updateState: UpdateState; onChange: (value: LocalePreference) => Promise<void>; onCheck: () => Promise<UpdateState>; onInstall: () => Promise<boolean>; onClose: () => void }) {
  return <div className="feedback-overlay" onClick={onClose}><section className="feedback-dialog settings-dialog" onClick={(event) => event.stopPropagation()}><header><div><h2>{t("settings.title")}</h2><p>{t("settings.description")}</p></div><button aria-label={t("settings.close")} onClick={onClose}><X /></button></header>
    <label>{t("settings.language")}<select value={preference} onChange={(event) => void onChange(event.target.value as LocalePreference)}><option value="system">{t("settings.auto")} ({t(`language.${locale}` as TranslationKey)})</option>{supportedLocales.map((value) => <option key={value} value={value}>{t(`language.${value}` as TranslationKey)}</option>)}</select></label>
    <section className="update-settings"><h3>{t("update.section")}</h3><p>{t("update.currentVersion", { version: updateState.currentVersion })}</p><p className={`update-status ${updateState.phase === "error" ? "error" : ""}`}>{updateStatus(t, updateState)}</p>
      {updateState.phase === "ready" ? <button className="send" onClick={() => void onInstall()}>{t("update.installNow")}</button> : <button disabled={updateState.phase === "checking" || updateState.phase === "downloading"} onClick={() => void onCheck()}>{t("update.check")}</button>}
      {updateState.phase === "downloading" && <div className="progress"><span style={{ width: `${updateState.percent ?? 0}%` }} /></div>}
    </section>
    <footer><button className="send" onClick={onClose}>{t("settings.close")}</button></footer></section></div>;
}

function FeedbackDialog({ t, onClose }: { t: T; onClose: () => void }) {
  const [subject, setSubject] = useState(() => t("feedback.defaultSubject")), [message, setMessage] = useState(""), [copied, setCopied] = useState(false);
  const email = "bob62138@gmail.com", body = `${message}\n\n${t("feedback.application")}`;
  const send = () => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  const copy = async () => { await navigator.clipboard.writeText(`${t("feedback.mailTo")} : ${email}\n${t("feedback.mailSubject")} : ${subject}\n\n${body}`); setCopied(true); };
  return <div className="feedback-overlay" onClick={onClose}><section className="feedback-dialog" onClick={(event) => event.stopPropagation()}><header><div><h2>{t("feedback.title")}</h2><p>{t("feedback.intro")}</p></div><button aria-label={t("settings.close")} onClick={onClose}><X /></button></header>
    <label>{t("feedback.subject")}<input value={subject} onChange={(event) => setSubject(event.target.value)} /></label><label>{t("feedback.message")}<textarea rows={7} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t("feedback.placeholder")} /></label>
    {copied && <p className="feedback-copied">{t("feedback.copied")}</p>}<footer><button onClick={() => void copy()}>{t("feedback.copy")}</button><button className="send" disabled={!message.trim()} onClick={send}>{t("feedback.send")}</button></footer></section></div>;
}

function cleanError(value: unknown) { return String(value).replace(/^Error: /, "").replace(/^Error invoking remote method '[^']+': Error: /, ""); }

function updateStatus(t: T, state: UpdateState) {
  if (state.message) return state.message;
  if (state.phase === "checking") return t("update.checking");
  if (state.phase === "available") return t("update.available", { version: state.availableVersion ?? "" });
  if (state.phase === "downloading") return t("update.downloading", { version: state.availableVersion ?? "", percent: Math.round(state.percent ?? 0) });
  if (state.phase === "ready") return t("update.readyMessage");
  if (state.phase === "upToDate") return t("update.upToDate");
  if (state.phase === "error") return t("update.error");
  return "";
}
