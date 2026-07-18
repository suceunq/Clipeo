import type {
  DownloadProgress,
  DownloadRequest,
  MediaInfo,
  LocalePreference,
  LocaleSettings,
  UpdateState,
  AppSettings,
  WelcomeDismissal,
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
      getAppSettings: () => Promise<AppSettings>;
      dismissWelcome: (choice: WelcomeDismissal) => Promise<boolean>;
      openDonation: () => Promise<boolean>;
      getUpdateState: () => Promise<UpdateState>;
      checkForUpdates: () => Promise<UpdateState>;
      installUpdate: () => Promise<boolean>;
      onUpdateState: (callback: (value: UpdateState) => void) => () => void;
      onProgress: (callback: (value: DownloadProgress) => void) => () => void;
    };
  }
}
