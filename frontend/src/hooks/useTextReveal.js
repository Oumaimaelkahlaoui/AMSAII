import { useEffect } from "react";

export function useTextReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(".contact-title, .contact-arrow-decoration");
    targets.forEach((el) => el.classList.add("reveal-ready"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}