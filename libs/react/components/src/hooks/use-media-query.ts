import { useEffect, useState } from "react";

/**
 *
 * Stolen from:
 * https://usehooks-ts.com/react-hook/use-media-query
 */
export const useMediaQuery = (query: string): boolean => {
  const cleanQuery = query.replace(/@media /g, "");
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(cleanQuery));

  function handleChange() {
    setMatches(getMatches(cleanQuery));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(cleanQuery);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanQuery]);

  return matches;
};
