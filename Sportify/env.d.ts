/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNSPLASH_KEY: string;
  // add more variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
