import { remult } from "remult";

// See about environment variables https://vitejs.dev/guide/env-and-mode.html
export const API_URL = import.meta.env['VITE_API_URL'] || 'http://127.0.0.1:3002/api';
remult.apiClient.url = API_URL;