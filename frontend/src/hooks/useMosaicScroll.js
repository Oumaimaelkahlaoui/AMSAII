import { useEffect } from "react";

export function useMosaicScroll() {
  useEffect(() => {
    const wrapper = document.querySelector(".mosaic-pin-wrapper");
    const sticky = document.querySelector(".mosaic-sticky");
    if (!wrapper || !sticky) return;

    let ticking = false;

    const update = () => {
      const vh = window.innerHeight;
      const rect = wrapper.getBoundingClientRect();
      // rect.top = distance entre le haut du wrapper et le haut de l'écran (peut être négative)
      const wrapperHeight = wrapper.offsetHeight;
      const pinDistance = wrapperHeight - vh; // distance de scroll pendant laquelle on reste épinglé

      if (rect.top > 0) {
        // Le wrapper n'est pas encore atteint : sticky reste en haut
        sticky.style.position = "absolute";
        sticky.style.top = "0px";
      } else if (rect.top <= 0 && rect.top > -pinDistance) {
        // On est dans la zone d'épinglage
        sticky.style.position = "fixed";
        sticky.style.top = "0px";
      } else {
        // On a dépassé la zone d'épinglage : sticky reste collé en bas du wrapper
        sticky.style.position = "absolute";
        sticky.style.top = `${pinDistance}px`;
      }

      const progress = Math.min(Math.max(-rect.top / pinDistance, 0), 1);
      wrapper.style.setProperty("--mosaic-p", progress.toFixed(3));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);
}