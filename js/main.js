
/**
 * ARENA NLD 24HS
 * Funcionalidades principales de la landing:
 *
 * 1. Menú móvil accesible.
 * 2. Carrusel de instalaciones.
 * 3. Enlaces de WhatsApp configurados desde config.js.
 * 4. Formulario de consulta para potenciales socios.
 * 5. Año automático en el pie de página.
 *
 * El formulario no almacena datos ni los envía a un servidor.
 * Solo prepara un mensaje y abre WhatsApp para que la persona
 * lo revise y decida si quiere enviarlo.
 */

(() => {
  "use strict";

  const config = window.ARENA_CONFIG ?? {};

  /* =========================================================
     1. MENÚ MÓVIL
     ========================================================= */

  const menuButton = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("icon-open");
  const iconClose = document.getElementById("icon-close");

  /**
   * Abre o cierra el menú y mantiene sincronizados
   * los atributos de accesibilidad.
   */
  function setMenuOpen(isOpen) {
    if (!menuButton || !mobileMenu || !iconOpen || !iconClose) {
      return;
    }

    mobileMenu.classList.toggle("hidden", !isOpen);
    iconOpen.classList.toggle("hidden", isOpen);
    iconClose.classList.toggle("hidden", !isOpen);

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const menuIsClosed = mobileMenu.classList.contains("hidden");
      setMenuOpen(menuIsClosed);
    });

    // Cierra el menú al elegir una sección.
    document.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    // Cierra el menú con Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });

    // Cierra el menú móvil al pasar a escritorio.
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    });
  }

  /* =========================================================
     2. CARRUSEL DE INSTALACIONES
     ========================================================= */

  const carousel = document.getElementById("carousel");

  if (carousel) {
    const slides = Array.from(
      carousel.querySelectorAll(".carousel-slide")
    );

    const dotsContainer = document.getElementById("dots");

    const previousButtons = [
      document.getElementById("prev-btn"),
      document.getElementById("prev-btn-m")
    ].filter(Boolean);

    const nextButtons = [
      document.getElementById("next-btn"),
      document.getElementById("next-btn-m")
    ].filter(Boolean);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let autoplayId = null;

    // Crea los indicadores de navegación automáticamente.
    const dots = slides.map((_, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className =
        "dot h-2.5 w-2.5 rounded-full bg-white/30 hover:bg-white/60";

      button.setAttribute("role", "tab");
      button.setAttribute(
        "aria-label",
        `Ir a la imagen ${index + 1}`
      );

      button.addEventListener("click", () => goToSlide(index));

      dotsContainer?.appendChild(button);

      return button;
    });

    const getMaxScroll = () =>
      Math.max(0, carousel.scrollWidth - carousel.clientWidth);

    const getSlideStep = () => {
      if (slides.length > 1) {
        return slides[1].offsetLeft - slides[0].offsetLeft;
      }

      return carousel.clientWidth;
    };

    const getCurrentIndex = () => {
      const step = Math.max(getSlideStep(), 1);

      return Math.min(
        slides.length - 1,
        Math.round(carousel.scrollLeft / step)
      );
    };

    const scrollBehavior = reduceMotion ? "auto" : "smooth";

    function goToSlide(index) {
      if (!slides.length) return;

      const safeIndex = Math.max(
        0,
        Math.min(index, slides.length - 1)
      );

      const targetPosition =
        slides[safeIndex].offsetLeft - slides[0].offsetLeft;

      carousel.scrollTo({
        left: Math.min(targetPosition, getMaxScroll()),
        behavior: scrollBehavior
      });
    }

    function nextSlide() {
      if (!slides.length) return;

      const maxScroll = getMaxScroll();

      if (carousel.scrollLeft >= maxScroll - 4) {
        carousel.scrollTo({
          left: 0,
          behavior: scrollBehavior
        });
      } else {
        carousel.scrollBy({
          left: getSlideStep(),
          behavior: scrollBehavior
        });
      }
    }

    function previousSlide() {
      if (!slides.length) return;

      const maxScroll = getMaxScroll();

      if (carousel.scrollLeft <= 4) {
        carousel.scrollTo({
          left: maxScroll,
          behavior: scrollBehavior
        });
      } else {
        carousel.scrollBy({
          left: -getSlideStep(),
          behavior: scrollBehavior
        });
      }
    }

    function updateDots() {
      if (!slides.length) return;

      const isAtEnd =
        carousel.scrollLeft >= getMaxScroll() - 4;

      const activeIndex = isAtEnd
        ? slides.length - 1
        : getCurrentIndex();

      dots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.setAttribute("aria-current", "true");
          dot.setAttribute("aria-selected", "true");
        } else {
          dot.removeAttribute("aria-current");
          dot.setAttribute("aria-selected", "false");
        }
      });
    }

    function stopAutoplay() {
      if (autoplayId !== null) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    function startAutoplay() {
      if (
        !reduceMotion &&
        autoplayId === null &&
        slides.length > 1
      ) {
        autoplayId = window.setInterval(nextSlide, 6000);
      }
    }

    // Los controles manuales detienen el avance automático.
    nextButtons.forEach((button) => {
      button.addEventListener("click", () => {
        stopAutoplay();
        nextSlide();
      });
    });

    previousButtons.forEach((button) => {
      button.addEventListener("click", () => {
        stopAutoplay();
        previousSlide();
      });
    });

    // Soporte de teclado y actualización de indicadores.
    carousel.addEventListener(
      "scroll",
      () => window.requestAnimationFrame(updateDots),
      { passive: true }
    );

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stopAutoplay();
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stopAutoplay();
        previousSlide();
      }
    });

    // Evita que el carrusel avance mientras alguien lo usa.
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("touchstart", stopAutoplay, {
      passive: true
    });
    carousel.addEventListener("pointerdown", stopAutoplay);

    // Solo inicia el avance automático cuando el carrusel
    // está visible en pantalla.
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAutoplay();
            } else {
              stopAutoplay();
            }
          });
        },
        { threshold: 0.4 }
      );

      observer.observe(carousel);
    } else {
      startAutoplay();
    }

    window.addEventListener("resize", updateDots);
    updateDots();
  }

  /* =========================================================
     3. CONFIGURACIÓN SEGURA DE ENLACES DE WHATSAPP
     ========================================================= */

  // Elimina accidentalmente espacios o símbolos del número.
  const whatsappNumber = String(
    config.whatsappNumber ?? ""
  ).replace(/\D/g, "");

  const hasValidWhatsAppNumber = whatsappNumber.length >= 10;

  /**
   * Construye un enlace de WhatsApp con un mensaje inicial.
   * No inventa un número si la configuración está vacía.
   */
  function createWhatsAppUrl(message) {
    if (!hasValidWhatsAppNumber) {
      return null;
    }

    return (
      `https://wa.me/${whatsappNumber}` +
      `?text=${encodeURIComponent(message)}`
    );
  }

  document
    .querySelectorAll("[data-whatsapp-message]")
    .forEach((link) => {
      const message =
        link.getAttribute("data-whatsapp-message") ||
        "Hola, quiero consultar por ARENA NLD 24HS.";

      const url = createWhatsAppUrl(message);

      if (url) {
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.removeAttribute("aria-disabled");
      } else {
        // Sin número oficial, el enlace lleva al formulario.
        link.href = "#contacto";
        link.removeAttribute("target");
        link.removeAttribute("rel");
        link.setAttribute(
          "aria-label",
          "Consultá por el formulario de contacto"
        );
      }
    });

  /* =========================================================
     4. FORMULARIO PARA POTENCIALES SOCIOS
     ========================================================= */

  const leadForm = document.getElementById("lead-form");
  const feedback = document.getElementById("lead-feedback");

  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(leadForm);

      const name = String(
        formData.get("name") ?? ""
      ).trim();

      const goal = String(
        formData.get("goal") ?? ""
      ).trim();

      const preferredTime = String(
        formData.get("time") ?? ""
      ).trim();

      // Validación adicional a los atributos HTML required.
      if (!name || !goal || !preferredTime) {
        if (feedback) {
          feedback.textContent =
            "Completá los campos para preparar tu consulta.";
        }

        return;
      }

      const message =
        `Hola, soy ${name}. ` +
        `Quiero consultar por ${goal} en ARENA NLD 24HS. ` +
        `Mi horario preferido para entrenar es: ${preferredTime}. ` +
        "¿Me pasan información sobre planes, precios y cómo asociarme?";

      const url = createWhatsAppUrl(message);

      if (!url) {
        if (feedback) {
          feedback.textContent =
            "Todavía falta configurar el WhatsApp oficial. " +
            "Podés contactarnos por Instagram @arenanld.";
        }

        return;
      }

      if (feedback) {
        feedback.textContent =
          "Se abrirá WhatsApp para que revises el mensaje " +
          "y lo envíes cuando estés listo.";
      }

      // Abre WhatsApp solamente después de una acción del usuario.
      const whatsappWindow = window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      // Si el navegador bloquea la ventana, ofrecemos el enlace.
      if (!whatsappWindow && feedback) {
        feedback.textContent =
          "El navegador bloqueó la ventana emergente. " +
          "Probá habilitar ventanas emergentes y volvé a intentarlo.";
      }
    });
  }

  /* =========================================================
     5. AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
     ========================================================= */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();
