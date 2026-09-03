// useScrollAnimations.js
import { useEffect } from "react";

export function useScrollAnimations() {
  useEffect(() => {
    // Header transparent -> plein au scroll + bouton retour en haut
    const header = document.querySelector(".header");
    const backToTop = document.querySelector(".back-to-top");

    const onScroll = () => {
      const scrolled = window.scrollY > 80;
      header?.classList.toggle("scrolled", scrolled);
      backToTop?.classList.toggle("is-visible", window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}