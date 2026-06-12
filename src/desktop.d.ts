export {};

declare global {
  interface Window {
    sparkLabDesktop?: {
      isDesktop: boolean;
      getAppInfo: () => Promise<{
        name: string;
        version: string;
        platform: string;
      }>;
      minimize: () => Promise<void>;
      toggleMaximize: () => Promise<void>;
      close: () => Promise<void>;
      onWindowState: (callback: (state: {
        isMaximized: boolean;
        isFullScreen: boolean;
      }) => void) => () => void;
    };
  }
}
