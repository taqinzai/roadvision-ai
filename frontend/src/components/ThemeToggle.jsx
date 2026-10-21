import { useEffect, useState } from "react";

const getSavedTheme = () => localStorage.getItem("roadvision-theme") || "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getSavedTheme);
  const isLight = theme === "light";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("roadvision-theme", theme);
    window.dispatchEvent(new CustomEvent("roadvision-theme-change", { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const syncTheme = (event) => {
      if (event.detail && event.detail !== theme) {
        setTheme(event.detail);
      }
    };

    window.addEventListener("roadvision-theme-change", syncTheme);
    return () => window.removeEventListener("roadvision-theme-change", syncTheme);
  }, [theme]);

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      aria-pressed={isLight}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb">{isLight ? "L" : "D"}</span>
      </span>
      <span className="theme-toggle-label">{isLight ? "Light" : "Dark"}</span>
    </button>
  );
}
