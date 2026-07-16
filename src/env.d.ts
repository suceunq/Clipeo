import type {
  DownloadProgress,
  DownloadRequest,
  MediaInfo,
} from "../shared/types";
declare global {
  interface Window {
    clipeo: {
      analyze: (url: string) => Promise<MediaInfo>;
      chooseFolder: () => Promise<string | null>;
      download: (request: DownloadRequest) => Promise<{ id: string }>;
      cancel: (id: string) => Promise<boolean>;
      openFolder: (path: string) => Promise<void>;
      history: () => Promise<DownloadProgress[]>;
      clearHistory: () => Promise<void>;
      onProgress: (callback: (value: DownloadProgress) => void) => () => void;
    };
  }
}
