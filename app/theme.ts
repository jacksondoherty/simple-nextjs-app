export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

// Runs before first paint so the page never flashes the wrong theme: reads the
// saved preference, falls back to the OS setting, and writes the result to
// <html data-theme>, which is the only hook globals.css needs.
export const THEME_INIT_SCRIPT = `(function(){var saved=null;try{saved=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});}catch(e){}document.documentElement.dataset.theme=saved==="light"||saved==="dark"?saved:(window.matchMedia(${JSON.stringify(
  DARK_QUERY,
)}).matches?"dark":"light");})();`;

export function readThemePreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Private-mode browsers can throw on access; "system" is a fine default.
  }
  return "system";
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") return preference;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

export function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme;
}

export function storeThemePreference(preference: ThemePreference) {
  try {
    if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Preference just won't persist across reloads.
  }
}
