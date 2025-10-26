export const config = {
  API_BASE: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
  API_TIMEOUT: 30000,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
}

export default config