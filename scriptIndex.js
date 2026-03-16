const track = document.getElementById('carruselTrack');
const slides = document.querySelectorAll('.carrusel-slide');
const dots = document.querySelectorAll('.carrusel-dot');
const prevBtn = document.getElementById('carruselPrev');
const nextBtn = document.getElementById('carruselNext');

let current = 0;

function goTo(index) {
    // Pausar video del slide anterior
    const prevVideo = slides[current].querySelector('.carrusel-video');
    if (prevVideo) { prevVideo.pause(); prevVideo.currentTime = 0; }

    current = (index + slides.length) % slides.length;

    // Mover el track
    track.style.transform = `translateX(-${current * 100}%)`;

    // Actualizar dots
    dots.forEach(d => d.classList.remove('active'));
    dots[current].classList.add('active');
}

// Botones
prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

// Dots
dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
});

// Hover: play/pause video
slides.forEach(slide => {
    const link = slide.querySelector('.carrusel-link');
    const video = slide.querySelector('.carrusel-video');
    if (!link || !video) return;
    link.addEventListener('mouseenter', () => video.play());
    link.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

// Autoplay cada 5 segundos
const contenedor = document.querySelector('.carrusel-contenedor');
let autoplay = setInterval(() => goTo(current + 1), 3000);

contenedor.addEventListener('mouseenter', () => {
    clearInterval(autoplay);
});

contenedor.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 3000);
});