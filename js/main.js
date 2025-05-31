document.addEventListener('DOMContentLoaded', function() {

    // --- NAVBAR TOGGLE (MENÚ HAMBURGUESA) ---
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Cerrar menú al hacer clic en un enlace (para móviles)
    const navLinks = document.querySelectorAll('.nav-link');
    function linkAction() {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    navLinks.forEach(n => n.addEventListener('click', linkAction));

    // --- SCROLLSPY - RESALTAR ENLACE ACTIVO DEL NAVBAR AL HACER SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const mainNavbar = document.getElementById('main-navbar');
    function scrollActive() {
        const scrollY = window.pageYOffset;
        const navbarHeight = mainNavbar ? mainNavbar.offsetHeight : 70;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - (navbarHeight + 80); // Ajustado offset
            const sectionId = current.getAttribute('id');
            const linkToSection = document.querySelector('.nav-menu a[href*="' + sectionId + '"]');

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
    scrollActive();

    // --- CAMBIAR NAVBAR AL HACER SCROLL (BACKGROUND) ---
    // El navbar ahora es semi-transparente por defecto, 'scrolled' podría añadir más opacidad o una sombra más fuerte.
    // Ya está manejado por el CSS de :root para #main-navbar y #main-navbar.scrolled
    // No es estrictamente necesario este JS si el estilo base es suficiente.
    // function scrollHeader() {
    //     if (mainNavbar) {
    //         if (window.scrollY >= 50) mainNavbar.classList.add('scrolled');
    //         else mainNavbar.classList.remove('scrolled');
    //     }
    // }
    // window.addEventListener('scroll', scrollHeader);
    // scrollHeader();

    // --- ACTUALIZAR AÑO EN FOOTER ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- ANIMACIÓN REVEAL (Original, puede ser redundante si AOS se usa para todo) ---
    // const revealElements = document.querySelectorAll('.reveal');
    // const revealOnScroll = () => {
    //     const windowHeight = window.innerHeight;
    //     revealElements.forEach(el => {
    //         const elementTop = el.getBoundingClientRect().top;
    //         if (elementTop < windowHeight - 80) { 
    //             el.classList.add('visible');
    //         }
    //     });
    // };
    // window.addEventListener('scroll', revealOnScroll);
    // revealOnScroll();

    // --- INICIALIZAR AOS ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,      // Duración un poco más larga
            once: true,         // Animación solo una vez
            offset: 100,        // Reducido para activar antes
            delay: 50,
            easing: 'ease-out-cubic', // Suavizado diferente
        });
    } else {
        console.warn("AOS library not found.");
    }

    // --- SCROLL TO TOP BUTTON ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    function toggleScrollToTopButton() {
        if (scrollToTopBtn) {
            if (window.scrollY > 400) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    }
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', toggleScrollToTopButton);
        toggleScrollToTopButton(); 
    }

    // --- ANIMATED COUNTER ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Velocidad del contador (menor es más rápido)

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 10); // Ajustar el timeout para velocidad
        } else {
            counter.innerText = target;
        }
    };

    const observerOptions = {
        root: null,
        threshold: 0.5 // Se activa cuando el 50% del elemento es visible
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Animar solo una vez
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    console.log("Proyecto Lab Virtualización - JS Avanzado Cargado (vNext)");
});