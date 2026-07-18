import type {
  DownloadProgress,
  DownloadRequest,
  MediaInfo,
  LocalePreference,
  LocaleSettings,
  UpdateState,
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
      getLocale: () => Promise<LocaleSettings>;
      setLocale: (locale: LocalePreference) => Promise<LocaleSettings>;
      getUpdateState: () => Promise<UpdateState>;
      checkForUpdates: () => Promise<UpdateState>;
      installUpdate: () => Promise<boolean>;
      onUpdateState: (callback: (value: UpdateState) => void) => () => void;
      onProgress: (callback: (value: DownloadProgress) => void) => () => void;
    };
  }
}
