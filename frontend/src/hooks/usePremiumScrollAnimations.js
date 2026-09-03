import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook unique qui gère toutes les animations liées au scroll du site.
 * Remplace les anciens mécanismes redondants (IntersectionObserver dispersés
 * dans Home/About/Contact + useTextReveal) par un système GSAP + ScrollTrigger
 * cohérent, fluide dans les deux sens (scroll bas ET remontée).
 *
 * IMPORTANT : ne touche jamais à .hero-bg (déjà piloté par useHeroScrollDarken
 * via la variable CSS --scroll-p) pour ne pas créer de conflit de transform.
 */
export function usePremiumScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const easeOut = "power3.out";
        const easeImage = "power4.out";

        // ---------------------------------------------------------------
        // 0) .reveal-ready : éléments déjà stylés en CSS (badge, flèches,
        //    soulignement, carte contact). On rend le déclenchement
        //    réversible pour un effet fluide en remontant.
        // ---------------------------------------------------------------
        gsap.utils.toArray(".reveal-ready").forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            end: "bottom 12%",
            onEnter: () => el.classList.add("is-visible"),
            onLeaveBack: () => el.classList.remove("is-visible"),
          });
        });

        // ---------------------------------------------------------------
        // 1) .reveal générique -> fadeInUp
        //    (on exclut les conteneurs traités plus précisément plus bas,
        //    pour ne pas les animer deux fois)
        // ---------------------------------------------------------------
        const specificallyHandled = [
          ".feature-row",
          ".about-philosophy-card",
          ".about-subscribe-img",
          ".about-subscribe-content",
          ".contact-info-col",
          ".contact-form-col",
        ];

        gsap.utils.toArray(".reveal").forEach((el) => {
          if (specificallyHandled.some((sel) => el.matches(sel))) return;

          gsap.fromTo(
            el,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: easeOut,
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        });

        // ---------------------------------------------------------------
        // 2) .reveal-stagger générique -> enfants directs en cascade
        //    (services-grid, about-photo-cards, about-reviews-cards,
        //    about-reviews-tags, about-cta-images...)
        // ---------------------------------------------------------------
        gsap.utils.toArray(".reveal-stagger").forEach((container) => {
          const children = gsap.utils.toArray(container.children);
          if (!children.length) return;

          gsap.fromTo(
            children,
            { opacity: 0, y: 42, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: easeOut,
              stagger: 0.12,
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        });

        // ---------------------------------------------------------------
        // 3) Rangées feature (Home + About) :
        //    - texte : fadeInLeft ou fadeInRight selon le sens de la rangée
        //    - image : imageReveal (rideau clip-path + scale) à l'entrée
        //    - image : léger parallax continu (sur le conteneur, jamais
        //      sur le <img> lui-même pour ne pas gêner le hover CSS existant)
        // ---------------------------------------------------------------
        gsap.utils.toArray(".feature-row").forEach((row) => {
          const isReversed = row.classList.contains("feature-row--reverse");
          const content = row.querySelector(".feature-content");
          const imageWrap = row.querySelector(".feature-image-wrap");

          if (content) {
            gsap.fromTo(
              content,
              { opacity: 0, x: isReversed ? -70 : 70 },
              {
                opacity: 1,
                x: 0,
                duration: 1.1,
                ease: easeOut,
                scrollTrigger: {
                  trigger: row,
                  start: "top 80%",
                  toggleActions: "play reverse play reverse",
                },
              }
            );
          }

          if (imageWrap) {
            // Entrée : rideau + léger zoom-out au settle
            gsap.fromTo(
              imageWrap,
              { clipPath: "inset(0% 0% 100% 0%)", scale: 1.08, opacity: 0 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                opacity: 1,
                duration: 1.3,
                ease: easeImage,
                scrollTrigger: {
                  trigger: row,
                  start: "top 80%",
                  toggleActions: "play reverse play reverse",
                },
              }
            );

            // Parallax continu, doux, lié à la progression du scroll
            gsap.fromTo(
              imageWrap,
              { yPercent: -4 },
              {
                yPercent: 4,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              }
            );
          }
        });

        // ---------------------------------------------------------------
        // 4) Entrée du Hero (au chargement, pas liée au scroll)
        // ---------------------------------------------------------------
        document.querySelectorAll(".hero-content").forEach((content) => {
          const title = content.querySelector(".hero-title");
          const desc = content.querySelector(".hero-description");
          const targets = [title, desc].filter(Boolean);
          if (!targets.length) return;

          gsap.fromTo(
            targets,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: easeOut,
              stagger: 0.15,
              delay: 0.2,
            }
          );
        });

        // ---------------------------------------------------------------
        // 5) Groupes à stagger qui n'ont pas déjà la classe .reveal-stagger
        //    dans le JSX (mosaïque galerie, cartes statistiques)
        // ---------------------------------------------------------------
        ["stats-container", "gallery-mosaic"].forEach((className) => {
          const container = document.querySelector(`.${className}`);
          if (!container) return;
          const children = gsap.utils.toArray(container.children);
          if (!children.length) return;

          gsap.fromTo(
            children,
            { opacity: 0, y: 45, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: easeOut,
              stagger: 0.1,
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        });

        // ---------------------------------------------------------------
        // 6) Colonnes Contact : infos depuis la gauche, formulaire depuis
        //    la droite
        // ---------------------------------------------------------------
        const contactInfoCol = document.querySelector(".contact-info-col");
        const contactFormCol = document.querySelector(".contact-form-col");

        if (contactInfoCol) {
          gsap.fromTo(
            contactInfoCol,
            { opacity: 0, x: -60 },
            {
              opacity: 1,
              x: 0,
              duration: 1.1,
              ease: easeOut,
              scrollTrigger: {
                trigger: contactInfoCol,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        if (contactFormCol) {
          gsap.fromTo(
            contactFormCol,
            { opacity: 0, x: 60 },
            {
              opacity: 1,
              x: 0,
              duration: 1.1,
              ease: easeOut,
              scrollTrigger: {
                trigger: contactFormCol,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        // ---------------------------------------------------------------
        // 7) Philosophy (About) : image imageReveal + parallax,
        //    texte fadeInRight
        // ---------------------------------------------------------------
        const philosophyImg = document.querySelector(".about-philosophy-img");
        const philosophyText = document.querySelector(".about-philosophy-text");

        if (philosophyImg) {
          gsap.fromTo(
            philosophyImg,
            { clipPath: "inset(0% 0% 100% 0%)", scale: 1.08, opacity: 0 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              opacity: 1,
              duration: 1.3,
              ease: easeImage,
              scrollTrigger: {
                trigger: philosophyImg,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            }
          );

          gsap.fromTo(
            philosophyImg,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: philosophyImg,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }

        if (philosophyText) {
          gsap.fromTo(
            philosophyText,
            { opacity: 0, x: 60 },
            {
              opacity: 1,
              x: 0,
              duration: 1.1,
              ease: easeOut,
              scrollTrigger: {
                trigger: philosophyText,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        // ---------------------------------------------------------------
        // 8) Highlight (About) : image imageReveal + parallax
        //    (le soulignement animé reste géré par .reveal-ready, cf #0)
        // ---------------------------------------------------------------
        const highlightImg = document.querySelector(".about-highlight-img");
        if (highlightImg) {
          gsap.fromTo(
            highlightImg,
            { clipPath: "inset(0% 0% 100% 0%)", scale: 1.08, opacity: 0 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              opacity: 1,
              duration: 1.3,
              ease: easeImage,
              scrollTrigger: {
                trigger: highlightImg,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            }
          );

          gsap.fromTo(
            highlightImg,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: highlightImg,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }

        // ---------------------------------------------------------------
        // 9) Newsletter / Subscribe (About) : image imageReveal,
        //    contenu fadeInRight
        // ---------------------------------------------------------------
        const subscribeImg = document.querySelector(".about-subscribe-img");
        const subscribeContent = document.querySelector(".about-subscribe-content");

        if (subscribeImg) {
          gsap.fromTo(
            subscribeImg,
            { clipPath: "inset(0% 0% 100% 0%)", scale: 1.08, opacity: 0 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              opacity: 1,
              duration: 1.3,
              ease: easeImage,
              scrollTrigger: {
                trigger: subscribeImg,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        if (subscribeContent) {
          gsap.fromTo(
            subscribeContent,
            { opacity: 0, x: 60 },
            {
              opacity: 1,
              x: 0,
              duration: 1.1,
              ease: easeOut,
              scrollTrigger: {
                trigger: subscribeContent,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        // ---------------------------------------------------------------
        // 10) Recalcule les positions de trigger une fois les images
        //     chargées (évite les décalages si une image charge tard)
        // ---------------------------------------------------------------
        const imgs = document.querySelectorAll("img");
        let remaining = imgs.length;
        const checkDone = () => {
          remaining -= 1;
          if (remaining <= 0) ScrollTrigger.refresh();
        };
        if (remaining === 0) {
          ScrollTrigger.refresh();
        } else {
          imgs.forEach((img) => {
            if (img.complete) checkDone();
            else img.addEventListener("load", checkDone, { once: true });
          });
        }
      });

      // Accessibilité : si l'utilisateur préfère moins de mouvement,
      // tout reste visible sans animation.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".reveal",
            ".reveal-stagger",
            ".reveal-stagger > *",
            ".feature-content",
            ".feature-image-wrap",
            ".contact-info-col",
            ".contact-form-col",
            ".about-philosophy-img",
            ".about-philosophy-text",
            ".about-highlight-img",
            ".about-subscribe-img",
            ".about-subscribe-content",
            ".hero-title",
            ".hero-description",
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, clipPath: "none" }
        );
        document.querySelectorAll(".reveal-ready").forEach((el) =>
          el.classList.add("is-visible")
        );
      });
    });

    return () => ctx.revert(); // nettoie tweens + ScrollTriggers au démontage
  }, []);
}