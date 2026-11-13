import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const THEME_KEY = "chair-flight-theme";

export const THEME_SCRIPT = `
  try{
	var storedTheme = localStorage.getItem('${THEME_KEY}');
	var theme=storedTheme === 'light' || storedTheme === 'dark' 
	  ? storedTheme:matchMedia('(prefers-color-scheme: dark)').matches?'dark' 
	  : 'light';document.documentElement.dataset.theme=theme
  } catch(e){}
`;

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(
    () =>
      setTheme(
        document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      ),
    [],
  );

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    const freezeTransitions = document.createElement("style");
    freezeTransitions.textContent =
      "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(freezeTransitions);
    document.documentElement.dataset.theme = nextTheme;
    getComputedStyle(document.documentElement).color;
    requestAnimationFrame(() => freezeTransitions.remove());
    setTheme(nextTheme);
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {}
  };

  return { theme, toggleTheme };
};
