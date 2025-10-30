// Configuración de Tailwind trasladada desde index.html
// Nota: si quieres que Tailwind aplique la configuración al cargarse, esta
// asignación debe ejecutarse antes de cargar https://cdn.tailwindcss.com
// (ver nota final).
if (typeof tailwind !== "undefined" || typeof window !== "undefined") {
  try {
    window.tailwind = window.tailwind || {};
    window.tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "primary": "#1791cf",
            "background-light": "#f6f7f8",
            "background-dark": "#111c21",
          },
          fontFamily: {
            "display": ["Space Grotesk"]
          },
          borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
        },
      },
    };
  } catch (e) {
    // Silenciar errores en entornos sin window/tailwind
    console.warn("No se pudo aplicar tailwind.config:", e);
  }
}

// Abrir imagen en modal al hacer click en las tarjetas del carrusel
(function () {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.getElementById('closeModal');
  if (!modal || !modalImg) return;

  const extractLastUrl = (bg) => {
    if (!bg) return null;
    const re = /url\(["']?(.*?)["']?\)/g;
    let match, last = null;
    while ((match = re.exec(bg)) !== null) last = match[1];
    return last;
  };

  // Selector más amplio: cualquier tarjeta que use bg-cover / aspect-video / bg-image-clickable
  const items = Array.from(document.querySelectorAll('.aspect-video, .bg-cover, .bg-image-clickable'));

  function findBgUrl(el) {
    // 1) computed style background-image
    let bg = getComputedStyle(el).backgroundImage;
    let url = extractLastUrl(bg);
    if (url) return url;
    // 2) style attribute (en caso de estar inline con linear-gradient(..., url(...)))
    bg = el.getAttribute('style') || '';
    url = extractLastUrl(bg);
    if (url) return url;
    // 3) data-src o data-image personalizado
    url = el.dataset.src || el.dataset.image || el.getAttribute('data-src') || el.getAttribute('data-image');
    if (url) return url;
    // 4) buscar <img> hijo
    const img = el.querySelector && el.querySelector('img');
    if (img && img.src) return img.src;
    return null;
  }

  function openModal(url, alt = '') {
    if (!url) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    modalImg.src = url;
    modalImg.alt = alt || '';
    modalImg.classList.remove('opacity-100', 'scale-100');
    modalImg.classList.add('opacity-0', 'scale-95');
    requestAnimationFrame(() => {
      modalImg.classList.remove('opacity-0', 'scale-95');
      modalImg.classList.add('opacity-100', 'scale-100');
    });
  }

  function closeModal() {
    modalImg.classList.remove('opacity-100', 'scale-100');
    modalImg.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      modalImg.src = '';
      modalImg.alt = '';
    }, 300);
  }

  items.forEach((el) => {
    const url = findBgUrl(el);
    if (!url) return; // no image, no click
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', () => {
      const alt = el.getAttribute('data-alt') || el.querySelector('img')?.alt || '';
      openModal(url, alt);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });
})();