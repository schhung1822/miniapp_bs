/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_BACKEND_BASE_URL?: string;
  readonly VITE_DEFAULT_PHONE_DISPLAY?: string;
  readonly VITE_FALLBACK_ZALO_PHONE?: string;
  readonly VITE_ZALO_USER_STORAGE_KEY?: string;
  readonly VITE_ZALO_SECRET_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
