document.addEventListener('DOMContentLoaded', function() {

    // --- NAVBAR TOGGLE (MENÚ HAMBURGUESA) ---
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close'); // No lo tienes, pero es útil si quieres un botón de cerrar

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Opcional: Cambiar icono del toggle
            if (navMenu.classList.contains('active')) {
                navToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Cerrar menú al hacer clic en un enlace (para móviles)
    const navLinks = document.querySelectorAll('.nav-link');
    function linkAction() {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Resetear icono
        }
    }
    navLinks.forEach(n => n.addEventListener('click', linkAction));


    // --- SCROLLSPY - RESALTAR ENLACE ACTIVO DEL NAVBAR AL HACER SCROLL ---
    const sections = document.querySelectorAll('section[id]'); // Selecciona todas las secciones con ID

    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Ajustar el sectionTop para considerar la altura del navbar
            const sectionTop = current.offsetTop - (document.getElementById('main-navbar').offsetHeight + 50); // +50 es un offset adicional
            const sectionId = current.getAttribute('id');
            const linkToSection = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

            if (linkToSection) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    linkToSection.classList.add('active');
                } else {
                    linkToSection.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);
    scrollActive(); // Llamar una vez para el estado inicial


    // --- CAMBIAR NAVBAR AL HACER SCROLL (BACKGROUND) ---
    function scrollHeader() {
        const nav = document.getElementById('main-navbar');
        // Cuando el scroll es mayor a 80 viewport height, añade la clase scroll-header a la etiqueta nav
        if (nav) {
            if (this.scrollY >= 80) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', scrollHeader);


    // --- ACTUALIZAR AÑO EN FOOTER ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- ANIMACIÓN REVEAL (TUYA ORIGINAL) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 80) { 
                el.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- INICIALIZAR AOS ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            delay: 50,
        });
    } else {
        console.warn("AOS library not found.");
    }

    console.log("Proyecto Lab Virtualización - JS Avanzado Cargado");
});