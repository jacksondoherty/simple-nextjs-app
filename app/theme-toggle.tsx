"use client";

import { useEffect, useState } from "react";
import {
  DARK_QUERY,
  applyTheme,
  readThemePreference,
  resolveTheme,
  storeThemePreference,
  type ThemePreference,
} from "./theme";

const cycle: Record<ThemePreference, ThemePreference> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const label: Record<ThemePreference, string> = {
  system: "system theme",
  light: "light theme",
  dark: "dark theme",
};

export default function ThemeToggle() {
  // Starts at "system" to match the server-rendered markup; the saved
  // preference arrives right after hydration. The theme itself is already
  // correct by then, courtesy of the init script in the layout.
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    setPreference(readThemePreference());
  }, []);

  // Keep following the OS while the preference is "system".
  useEffect(() => {
    if (preference !== "system") return;
    const query = window.matchMedia(DARK_QUERY);
    const onChange = () => applyTheme(query.matches ? "dark" : "light");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [preference]);

  function selectNext() {
    const next = cycle[preference];
    setPreference(next);
    storeThemePreference(next);
    applyTheme(resolveTheme(next));
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={selectNext}
      aria-label={`Using ${label[preference]}. Switch to ${label[cycle[preference]]}.`}
      title={`Using ${label[preference]}`}
    >
      <ThemeIcon preference={preference} />
    </button>
  );
}

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  const shared = {
    "aria-hidden": true,
    focusable: false,
    viewBox: "0 0 24 24",
    width: 18,
    height: 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (preference === "light") {
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
      </svg>
    );
  }

  if (preference === "dark") {
    return (
      <svg {...shared}>
        <path d="M20 14.4A8.4 8.4 0 1 1 9.6 4a6.6 6.6 0 0 0 10.4 10.4Z" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <rect x="2.8" y="4.5" width="18.4" height="12" rx="2" />
      <path d="M9 20h6M12 16.5V20" />
    </svg>
  );
}
