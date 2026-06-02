/**
 * Mi Chef - Rotisería Familiar
 * script.js — JavaScript principal
 *
 * Funcionalidades:
 *  1. Loader de entrada
 *  2. Header scroll (sticky + shrink)
 *  3. Menú hamburguesa (mobile)
 *  4. Scroll suave y nav link activo
 *  5. Reveal al hacer scroll (IntersectionObserver)
 *  6. Contadores animados (stats)
 *  7. Botón "Volver arriba"
 *  8. Formulario → WhatsApp
 *  9. Helper openWhatsApp() para botones de tarjetas
 */

'use strict';

/* ── Utilidades ── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* =========================================================
   1. LOADER
   ========================================================= */
window.addEventListener('load', () => {
  const loader = qs('#loader');
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add('hidden');
    // Quitar del DOM para no bloquear interacción
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 700);
});


 /*=========================================================
   2. HEADER: scroll effect
   ========================================================= */
const header = qs('#header');

function handleHeaderScroll() {
  if (!header) return;
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll(); // estado inicial


/* =========================================================
   3. MENÚ HAMBURGUESA
   ========================================================= */
const hamburger = qs('#hamburger');
const navLinks  = qs('#nav-links');
const navbar    = qs('#navbar');

// Crear overlay dinámicamente
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

function openMenu() {
  navLinks.classList.add('open');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });
}

overlay.addEventListener('click', closeMenu);

// Cerrar menú al presionar Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
  }
});

/* =========================================================
   4. SCROLL SUAVE + LINK ACTIVO (Versión Multi-página)
   ========================================================= */
const allNavLinks = qsa('.nav-link');
const dropdownLinks = qsa('.dropdown-link');
const sections    = qsa('section[id], div[id]');

// Manejador del click para enlaces de navegación
[...allNavLinks, ...dropdownLinks].forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Si el enlace es un ancla interna de la página actual
    if (href.startsWith('#')) {
      e.preventDefault();
      closeMenu();
      if (hasDropdown) hasDropdown.classList.remove('open'); 

      const target = qs(href);
      if (!target) return;

      const navHeight = header ? header.offsetHeight : 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    } 
    // Si el enlace apunta a otra página con ancla (ej: platos.html#pastas)
    else if (href.includes('#')) {
      const parts = href.split('#');
      // Verificamos si estamos actualmente en la página base del enlace
      if (window.location.pathname.endsWith(parts[0]) || (parts[0] === 'index.html' && (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')))) {
        e.preventDefault();
        closeMenu();
        if (hasDropdown) hasDropdown.classList.remove('open');
        
        const target = qs('#' + parts[1]);
        if (target) {
          const navHeight = header ? header.offsetHeight : 80;
          const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }
    }
  });
});

// Resaltar link activo según el archivo actual en la URL
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Limpiar clases previas de manera segura
    link.classList.remove('active');

    if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html')))) {
      link.classList.add('active');
    }
  });
}

// Control nativo de scroll si el usuario viene directo desde otra página con un hash (#)
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    const target = qs(window.location.hash);
    if (target) {
      setTimeout(() => {
        const navHeight = header ? header.offsetHeight : 80;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
        window.scrollTo({ top: targetTop, behavior: 'auto' });
      }, 100); // Pequeña espera para asegurar que el DOM y Loader no alteren la altura
    }
  }
});

window.addEventListener('scroll', setActiveNavLink, { passive: true });
setActiveNavLink();


/* =========================================================
   5. REVEAL AL SCROLL (IntersectionObserver)
   ========================================================= */
const revealElements = qsa('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (!entry.isIntersecting) return;

      // Delay escalonado para grupos de tarjetas
      const delay = entry.target.closest('.cards-grid')
        ? Array.from(entry.target.closest('.cards-grid').children).indexOf(entry.target) * 100
        : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));


/* =========================================================
   6. CONTADORES ANIMADOS (stats)
   ========================================================= */
const statNumbers = qsa('.stat-num[data-target]');

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cuadrático
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('es-AR');

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('es-AR');
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => counterObserver.observe(el));


/* =========================================================
   7. BOTÓN "VOLVER ARRIBA"
   ========================================================= */
const backToTopBtn = qs('#backToTop');

function toggleBackToTop() {
  if (!backToTopBtn) return;
  if (window.scrollY > 480) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', toggleBackToTop, { passive: true });

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* =========================================================
   8. FORMULARIO DE CONTACTO → WHATSAPP
   ========================================================= */
const contactForm = qs('#contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre   = qs('#nombre',   contactForm);
    const telefono = qs('#telefono', contactForm);
    const mensaje  = qs('#mensaje',  contactForm);

    let valid = true;

    // Limpiar errores previos
    qsa('.error-msg', contactForm).forEach(err => err.remove());
    [nombre, telefono, mensaje].forEach(f => f.classList.remove('invalid'));

    // Validar
    function showError(field, msg) {
      field.classList.add('invalid');
      const span = document.createElement('span');
      span.className = 'error-msg';
      span.textContent = msg;
      field.insertAdjacentElement('afterend', span);
      valid = false;
    }

    if (!nombre.value.trim() || nombre.value.trim().length < 2) {
      showError(nombre, 'Por favor ingresá tu nombre completo.');
    }
    if (!telefono.value.trim() || !/^[\d\s\-+()]{7,15}$/.test(telefono.value.trim())) {
      showError(telefono, 'Ingresá un número de teléfono válido.');
    }
    if (!mensaje.value.trim() || mensaje.value.trim().length < 10) {
      showError(mensaje, 'El mensaje debe tener al menos 10 caracteres.');
    }

    if (!valid) return;

    // Armar mensaje para WhatsApp
    const texto = encodeURIComponent(
      `Hola! Soy ${nombre.value.trim()}.\n` +
      `📞 Teléfono: ${telefono.value.trim()}\n\n` +
      `📝 Consulta / Pedido:\n${mensaje.value.trim()}`
    );

    const waNumber = '5491141858091';
    window.open(`https://wa.me/${waNumber}?text=${texto}`, '_blank', 'noopener,noreferrer');

    // Feedback visual
    const submitBtn = contactForm.querySelector('[type="submit"]');
    const original  = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Mensaje enviado!';
    submitBtn.style.background = '#25D366';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = original;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      contactForm.reset();
    }, 3500);
  });

  // Quitar clase invalid al escribir
  qsa('input, textarea', contactForm).forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('invalid');
      const nextErr = field.nextElementSibling;
      if (nextErr && nextErr.classList.contains('error-msg')) nextErr.remove();
    });
  });
}


/* =========================================================
   9. HELPER: openWhatsApp(producto)
      Llamado desde los botones "Pedir" de las tarjetas
   ========================================================= */
function openWhatsApp(producto) {
  const texto = encodeURIComponent(
    `Hola! Me gustaría pedir: *${producto}*.\n¿Podría darme más información sobre el precio y tiempo de entrega?`
  );
  window.open(`https://wa.me/5491141858091?text=${texto}`, '_blank', 'noopener,noreferrer');
}

// Hacer global para que funcione en los onclick del HTML
window.openWhatsApp = openWhatsApp;


/* =========================================================
   10. LAZY LOAD para imágenes (fallback extra)
   ========================================================= */
if ('loading' in HTMLImageElement.prototype) {
  // El navegador soporta lazy nativo (ya usado en HTML)
  // No hace falta nada más
} else {
  // Fallback con IntersectionObserver
  const lazyImgs = qsa('img[loading="lazy"]');
  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src || img.src;
      lazyObserver.unobserve(img);
    });
  });
  lazyImgs.forEach(img => lazyObserver.observe(img));
}


/* =========================================================
   11. TOOLTIP en precio (pequeño easter egg)
   ========================================================= */
qsa('.price').forEach(el => {
  el.setAttribute('title', 'Precio al público · Consultar por combos y docenas');
});

 /* =========================================================
   12. FILTROS Y LIGHTBOX DE LA GALERÍA (Versión Corregida)
   ========================================================= */

// --- LÓGICA DE FILTROS ---
const filterBtns   = qsa('.filter-btn');
const galleryItems = qsa('.gallery-item');
const galleryEmpty = qs('#galleryEmpty');

if (filterBtns.length > 0 && galleryItems.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Cambiar clase activa visual en los botones
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;
      let visibleCount = 0;

      galleryItems.forEach(item => {
        // Si es 'all' o coincide la categoría de la tarjeta
        if (filterValue === 'all' || item.dataset.category === filterValue) {
          item.classList.remove('hidden');
          item.classList.add('fade-in');
          visibleCount++;
        } else {
          item.classList.add('hidden');
          item.classList.remove('fade-in');
        }
      });

      // Mostrar u ocultar mensaje de "sin resultados"
      if (galleryEmpty) {
        galleryEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  });
}

// --- LÓGICA DEL LIGHTBOX MODAL ---
const lightbox        = qs('#lightbox');
const lightboxImg     = qs('#lightboxImg');
const lightboxCaption = qs('#lightboxCaption');
const lightboxCounter = qs('#lightboxCounter');
const lightboxClose   = qs('#lightboxClose');
const lightboxOverlay = qs('#lightboxOverlay');
const lightboxPrev    = qs('#lightboxPrev');
const lightboxNext    = qs('#lightboxNext');

// Variables de control de estado
let currentIndex = 0;
let activeItems  = []; // Almacenará sólo las imágenes visibles actuales

// Renderiza en el modal la imagen basada en el índice de la lista activa
function showLightbox(index) {
  // Filtramos en tiempo real para no incluir fotos ocultas por el filtro superior
  activeItems = galleryItems.filter(item => !item.classList.contains('hidden'));
  
  if (index < 0 || index >= activeItems.length) return;
  
  currentIndex = index;
  const currentItem = activeItems[currentIndex];
  const targetImg   = qs('img', currentItem);
  
  if (!targetImg) return;

  // Mostramos el contenedor y bloqueamos el scroll del fondo
  lightbox.style.display = 'flex';
  lightbox.classList.add('lightbox-loading');
  document.body.style.overflow = 'hidden';

  // Inyectamos los datos de la imagen de la galería al modal grande
  lightboxImg.src = targetImg.src;
  lightboxImg.alt = targetImg.alt;
  
  // Priorizar el "data-caption", si no tiene usar el "alt"
  lightboxCaption.textContent = targetImg.dataset.caption || targetImg.alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${activeItems.length}`;

  // Quitamos la animación de carga cuando el navegador renderice la foto grande
  lightboxImg.onload = () => {
    lightbox.classList.remove('lightbox-loading');
  };
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.style.display = 'none';
  lightbox.classList.remove('lightbox-loading');
  lightboxImg.src = ''; 
  document.body.style.overflow = ''; // Devolver el scroll a la página web
}

function nextImage() {
  activeItems = galleryItems.filter(item => !item.classList.contains('hidden'));
  if (activeItems.length === 0) return;
  
  let nextIdx = currentIndex + 1;
  if (nextIdx >= activeItems.length) nextIdx = 0; // Bucle infinito hacia adelante
  showLightbox(nextIdx);
}

function prevImage() {
  activeItems = galleryItems.filter(item => !item.classList.contains('hidden'));
  if (activeItems.length === 0) return;
  
  let prevIdx = currentIndex - 1;
  if (prevIdx < 0) prevIdx = activeItems.length - 1; // Bucle infinito hacia atrás
  showLightbox(prevIdx);
}

// --- ASIGNACIÓN DE EVENTOS ---

// Registrar el click en cada contenedor de imagen de la galería
if (galleryItems.length > 0 && lightbox) {
  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Actualizar la lista de elementos disponibles sin los ocultos
      activeItems = galleryItems.filter(el => !el.classList.contains('hidden'));
      const itemIndex = activeItems.indexOf(item);
      
      if (itemIndex !== -1) {
        showLightbox(itemIndex);
      }
    });
  });

  // Cierre del modal
  if (lightboxClose)   lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  // Navegación mediante las flechas de la interfaz gráfica
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita que el click cierre el modal por tocar el fondo
      nextImage();
    });
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevImage();
    });
  }

  // Navegación ergonómica usando el teclado
  document.addEventListener('keydown', (e) => {
    // Solo actuar si el Lightbox está actualmente abierto en pantalla
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape')    closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft')  prevImage(); // Corregido: antes decía prevIdx()
    }
  });
}

/* =========================================================
   3b. CONTROL DE DESPLEGABLES (PLATOS Y EXTRAS) EN MÓVILES
   ========================================================= */
// Seleccionamos todos los contenedores que tienen submenú y sus botones activadores
const dropdownToggles = qsa('.dropdown-toggle');

dropdownToggles.forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    // Comprobamos si el botón hamburguesa está visible (confirma entorno móvil)
    const isMobile = window.getComputedStyle(hamburger).display !== 'none';
    
    if (isMobile) {
      // Evitamos que el navegador abra el archivo .html directamente al primer clic
      e.preventDefault();
      
      const parentLi = toggle.closest('.has-dropdown');
      
      if (parentLi) {
        // Si el usuario hace clic en uno, cerramos los demás para mantener el orden
        qsa('.has-dropdown').forEach(li => {
          if (li !== parentLi) li.classList.remove('open');
        });
        
        // Alternamos la clase .open en el elemento actual
        parentLi.classList.toggle('open');
        
        // Accesibilidad para lectores de pantalla
        const isOpen = parentLi.classList.contains('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    }
  });
});

// Modificación en el clic general para limpiar estados al navegar internamente
allNavLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault();
    
    // Cerramos el menú hamburguesa principal y limpiamos cualquier dropdown abierto
    closeMenu();
    qsa('.has-dropdown').forEach(li => li.classList.remove('open')); 

    const target = qs(href);
    if (!target) return;

    const navHeight = header ? header.offsetHeight : 80;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

