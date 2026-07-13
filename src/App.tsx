import { useEffect, useState } from "react";
import { Download, FolderOpen, Link, Music, Trash2, Video } from "lucide-react";
import type {
  DownloadMode,
  DownloadProgress,
  MediaInfo,
} from "../shared/types";
import "./App.css";
export default function App() {
  const [url, setUrl] = useState(""),
    [info, setInfo] = useState<MediaInfo | null>(null),
    [mode, setMode] = useState<DownloadMode>("video"),
    [format, setFormat] = useState(""),
    [folder, setFolder] = useState(() => localStorage.getItem("clipeo:download-folder") ?? ""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [items, setItems] = useState<DownloadProgress[]>([]);
  useEffect(() => {
    window.clipeo.history().then(setItems);
    return window.clipeo.onProgress((p) =>
      setItems((a) => {
        const i = a.findIndex((x) => x.id === p.id);
        return i < 0 ? [p, ...a] : a.map((x) => (x.id === p.id ? p : x));
      }),
    );
  }, []);
  async function analyze() {
    try {
      setBusy(true);
      setError("");
      const x = await window.clipeo.analyze(url);
      setInfo(x);
      setFormat(x.formats[0]?.id ?? "");
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  async function choose() {
    const x = await window.clipeo.chooseFolder();
    if (x) {
      setFolder(x);
      localStorage.setItem("clipeo:download-folder", x);
    }
  }
  async function clearHistory() {
    if (!window.confirm("Effacer tout l’historique ? Les fichiers téléchargés seront conservés.")) return;
    await window.clipeo.clearHistory();
    setItems([]);
  }
  async function download() {
    if (info && folder)
      await window.clipeo.download({
        url: info.url,
        title: info.title,
        mode,
        formatId: format,
        outputDir: folder,
      });
  }
  return (
    <main>
      <header>
        <div className="brand">
          <span>▶</span>
          <div>
            <h1>Clipéo</h1>
            <p>Vos médias, simplement.</p>
          </div>
        </div>
        <div className="legal">
          Contenus personnels, libres ou autorisés uniquement
        </div>
      </header>
      <section className="hero">
        <h2>Collez. Choisissez. Téléchargez.</h2>
        <p>
          Vidéo, audio, miniature et qualité au choix — traitement entièrement
          local.
        </p>
        <div className="urlbar">
          <Link />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Collez une URL YouTube, TikTok, Instagram…"
          />
          <button onClick={analyze} disabled={busy}>
            {busy ? "Analyse…" : "Analyser"}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </section>
      {info && (
        <section className="card media">
          {info.thumbnail && <img src={info.thumbnail} />}
          <div className="details">
            <small>{info.platform}</small>
            <h3>{info.title}</h3>
            <p>
              {info.author} · {Math.floor(info.duration / 60)} min{" "}
              {Math.round(info.duration % 60)} s
            </p>
            <div className="modes">
              <button
                className={mode === "video" ? "active" : ""}
                onClick={() => setMode("video")}
              >
                <Video />
                Vidéo
              </button>
              {(["mp3", "m4a", "wav"] as DownloadMode[]).map((x) => (
                <button
                  key={x}
                  className={mode === x ? "active" : ""}
                  onClick={() => setMode(x)}
                >
                  <Music />
                  {x.toUpperCase()}
                </button>
              ))}
              <button
                className={mode === "thumbnail" ? "active" : ""}
                onClick={() => setMode("thumbnail")}
              >
                Miniature
              </button>
            </div>
            {mode === "video" && (
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                {info.formats.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                    {f.size ? ` · ${(f.size / 1048576).toFixed(0)} Mo` : ""}
                  </option>
                ))}
              </select>
            )}
            <div className="destination">
              <button onClick={choose}>
                <FolderOpen />
                Choisir le dossier
              </button>
              <span>{folder || "Aucun dossier sélectionné"}</span>
            </div>
            <button className="download" onClick={download} disabled={!folder}>
              <Download />
              Télécharger
            </button>
          </div>
        </section>
      )}
      <section className="queue">
        <div className="queue-title">
          <h2>Téléchargements</h2>
          {items.length > 0 && <button onClick={clearHistory}><Trash2 />Effacer l’historique</button>}
        </div>
        {items.length === 0 ? (
          <p className="empty">Aucun téléchargement pour le moment.</p>
        ) : (
          items.map((x) => (
            <article key={x.id}>
              <div>
                <strong>{x.title}</strong>
                <small>
                  {x.status === "done"
                    ? "Terminé"
                    : x.status === "error"
                      ? "Erreur"
                      : "Téléchargement en cours…"}
                </small>
              </div>
              <div className="progress">
                <span style={{ width: `${x.percent}%` }} />
              </div>
              <footer>
                {x.percent.toFixed(0)}% <span>{x.speed}</span>
                <span>Temps restant : {x.eta}</span>
              </footer>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
