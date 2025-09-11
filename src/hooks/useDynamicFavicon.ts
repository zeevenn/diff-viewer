import { useEffect } from "react";

export const useDynamicFavicon = () => {
  useEffect(() => {
    const updateFavicon = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      
      if (favicon) {
        favicon.href = isDark ? '/logo-dark.svg' : '/logo.svg';
      }
    };

    updateFavicon();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateFavicon);

    return () => {
      mediaQuery.removeEventListener('change', updateFavicon);
    };
  }, []);
};