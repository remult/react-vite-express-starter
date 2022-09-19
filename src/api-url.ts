import { remult } from "remult";

// See about environment variables https://vitejs.dev/guide/env-and-mode.html
export const API_URL = import.meta.env['API_URL'] || 'http://127.0.0.1:3002/api';
remult.apiClient.url = API_URL;
console.log({ API_URL });
console.log(import.meta.env);