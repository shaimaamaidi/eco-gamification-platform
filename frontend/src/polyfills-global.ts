// src/polyfills-global.ts

// Polyfill pour global
(window as any).global = window;

// Polyfill process/env si nécessaire
(window as any).process = {
  env: { NODE_ENV: 'production' }
};

// Polyfill Buffer si nécessaire
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;
