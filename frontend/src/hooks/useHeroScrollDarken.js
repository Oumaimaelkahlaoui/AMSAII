import { useEffect } from "react";

export function useHeroScrollDarken() {
  useEffect(() => {
    const hero = document.querySelector(".amsaii-home .hero");
    if (!hero) return;

    let ticking = false;

    const update = () => {
      const heroHeight = hero.offsetHeight;
      // Progression 0 -> 1 sur la hauteur du hero (donc pendant tout le scroll de la section 1)
      const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
      hero.style.setProperty("--scroll-p", progress.toFixed(3));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}