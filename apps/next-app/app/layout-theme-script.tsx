import type { FunctionComponent } from "react";

export const LayoutThemeScript: FunctionComponent = () => {
  const modeStorageKey = "joy-mode";
  const defaultMode = "light";
  const colorSchemeStorageKey = "joy-color-scheme";
  const defaultLightColorScheme = "light";
  const defaultDarkColorScheme = "dark";
  const colorSchemeNode = "document.documentElement";
  const attribute = "data-joy-color-scheme";

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
                (function() {
                try {
                    var mode = localStorage.getItem('${modeStorageKey}') || '${defaultMode}';
                    var colorScheme = '';
                    if (mode === 'system') {
                    // handle system mode
                    var mql = window.matchMedia('(prefers-color-scheme: dark)');
                    if (mql.matches) {
                        colorScheme = localStorage.getItem('${colorSchemeStorageKey}-dark') || '${defaultDarkColorScheme}';
                    } else {
                        colorScheme = localStorage.getItem('${colorSchemeStorageKey}-light') || '${defaultLightColorScheme}';
                    }
                    }
                    if (mode === 'light') {
                    colorScheme = localStorage.getItem('${colorSchemeStorageKey}-light') || '${defaultLightColorScheme}';
                    }
                    if (mode === 'dark') {
                    colorScheme = localStorage.getItem('${colorSchemeStorageKey}-dark') || '${defaultDarkColorScheme}';
                    }
                    if (colorScheme) {
                    ${colorSchemeNode}.setAttribute('${attribute}', colorScheme);
                    }
                } catch(e){}
                })();
            `,
      }}
    />
  );
};
