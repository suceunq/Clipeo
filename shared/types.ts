export interface MediaFormat {
  id: string;
  label: string;
  height: number | null;
  ext: string;
  fps: number | null;
  size: number | null;
}
export interface MediaInfo {
  url: string;
  title: string;
  author: string;
  duration: number;
  thumbnail: string | null;
  platform: string;
  formats: MediaFormat[];
}
export type DownloadMode = "video" | "mp3" | "m4a" | "wav" | "thumbnail";
export interface DownloadRequest {
  url: string;
  title: string;
  mode: DownloadMode;
  formatId?: string;
  outputDir: string;
}
export interface DownloadProgress {
  id: string;
  title: string;
  percent: number;
  speed: string;
  eta: string;
  status: "queued" | "downloading" | "done" | "error";
  message?: string;
}
