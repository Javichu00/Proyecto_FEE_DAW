/* scriptIndex.js — Carrusel con swipe táctil y vídeo al mantener */
(function () {
    'use strict';
  
    const track      = document.getElementById('carruselTrack');
    const slides     = document.querySelectorAll('.carrusel-slide');
    const prevBtn    = document.getElementById('carruselPrev');
    const nextBtn    = document.getElementById('carruselNext');
    const contenedor = document.querySelector('.carrusel-contenedor');
  
    if (!track || !slides.length) return;
  
    let current       = 0;
    let autoplayTimer = null;
  
    /* ── Ir a un slide ────────────────────── */
    function goTo(index) {
      const prevVideo = slides[current]?.querySelector('.carrusel-video');
      if (prevVideo) { prevVideo.pause(); prevVideo.currentTime = 0; }
  
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
    }
  
    /* ── Botones prev/next ────────────────── */
    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
  
    /* ── Hover (escritorio): play/pause vídeo */
    slides.forEach(slide => {
      const link  = slide.querySelector('.carrusel-link');
      const video = slide.querySelector('.carrusel-video');
      if (!link || !video) return;
      link.addEventListener('mouseenter', () => video.play().catch(() => {}));
      link.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    });
  
    /* ── Autoplay ─────────────────────────── */
    function startAutoplay() {
      autoplayTimer = setInterval(() => goTo(current + 1), 3000);
    }
  
    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }
  
    contenedor?.addEventListener('mouseenter', stopAutoplay);
    contenedor?.addEventListener('mouseleave', startAutoplay);
  
    /* ── Touch: swipe + mantener para vídeo ─ */
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping   = false;
    let holdTimer   = null;
    let holdVideo   = null;
    let isHolding   = false;
  
    contenedor.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping   = false;
      isHolding   = false;
  
      // Mantener 400ms → reproducir vídeo del slide actual
      const video = slides[current]?.querySelector('.carrusel-video');
      if (video) {
        holdVideo = video;
        holdTimer = setTimeout(() => {
          isHolding = true;
          holdVideo.play().catch(() => {});
          stopAutoplay();
        }, 400);
      }
    }, { passive: true });
  
    contenedor.addEventListener('touchmove', (e) => {
      const diffX = Math.abs(e.touches[0].clientX - touchStartX);
      const diffY = Math.abs(e.touches[0].clientY - touchStartY);
  
      // Si se mueve → es swipe, cancelar hold
      if (diffX > 10 || diffY > 10) {
        isSwiping = true;
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    }, { passive: true });
  
    contenedor.addEventListener('touchend', (e) => {
      clearTimeout(holdTimer);
      holdTimer = null;
  
      // Soltar tras hold → parar vídeo
      if (isHolding && holdVideo) {
        holdVideo.pause();
        holdVideo.currentTime = 0;
        holdVideo  = null;
        isHolding  = false;
        startAutoplay();
        return;
      }
  
      // Swipe → cambiar slide si fue más de 50px
      if (isSwiping) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diffX) > 50) {
          diffX < 0 ? goTo(current + 1) : goTo(current - 1);
        }
      }
    }, { passive: true });
  
    /* ── Init ─────────────────────────────── */
    startAutoplay();
  
  })();