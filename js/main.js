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

    // --- ACTUALIZAR AÑO EN FOOTER ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- INICIALIZAR AOS ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            once: true,
            offset: 100,
            delay: 50,
            easing: 'ease-out-cubic',
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
    const speed = 200; 

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 10);
        } else {
            counter.innerText = target;
        }
    };
    const observerOptions = { root: null, threshold: 0.5 };
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    counters.forEach(counter => { counterObserver.observe(counter); });


    // --- INICIO CÓDIGO CHATBOT GEMINI (SOLO DESARROLLO LOCAL) ---
    const openChatBtn = document.getElementById('open-chat-btn');
    const geminiChatWidget = document.getElementById('gemini-chat-widget');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');

    // !!!!! MUY IMPORTANTE: NO SUBAS ESTA CLAVE A UN REPOSITORIO PÚBLICO !!!!!
    // !!!!! REEMPLAZA CON TU API KEY DE GEMINI !!!!!
    const GEMINI_API_KEY = "AIzaSyDDpIykd5Ev55G9wuYdKgUZnUNQ8GQxRBI"; // ¡¡¡NO LA COMPROMETAS!!!

    if (openChatBtn && geminiChatWidget && closeChatBtn) {
        openChatBtn.addEventListener('click', () => {
            geminiChatWidget.classList.add('active');
            openChatBtn.style.opacity = '0';
            openChatBtn.style.visibility = 'hidden';
            chatInput.focus();
        });
        closeChatBtn.addEventListener('click', () => {
            geminiChatWidget.classList.remove('active');
            setTimeout(() => {
                openChatBtn.style.opacity = '1';
                openChatBtn.style.visibility = 'visible';
            }, 300);
        });
    }

    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender + '-message');
        if (sender === 'bot') {
             messageDiv.innerHTML = text.replace(/\n/g, '<br>');
        } else {
            messageDiv.textContent = text;
        }
        chatMessages.appendChild(messageDiv);
        setTimeout(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }, 0);
    };

    const sendToGemini = async (userInput) => { // userInput es la pregunta del usuario
        if (!GEMINI_API_KEY || GEMINI_API_KEY === "TU_GEMINI_API_KEY_AQUI") {
            addMessage("Error: API Key de Gemini no configurada. Revisa main.js.", "bot");
            console.error("API Key de Gemini no configurada.");
            return;
        }
        
        let initialGreeting = "";
        const isGreeting = userInput.toLowerCase().match(/\b(hola|buenos dias|buenas tardes|buenas noches|hey|que tal|info|ayuda)\b/i);
        if (chatMessages.children.length <= 2 && isGreeting) { // Asumiendo que el primer mensaje del usuario es el saludo y luego el mensaje de carga
            initialGreeting = "¡Hola! 👋 Soy G1-VirtBot, tu asistente virtual para el Proyecto Laboratorio de Virtualización Avanzado del Grupo 1, UPeU Tarapoto. Estoy aquí para ayudarte a entender mejor nuestro proyecto. Puedes preguntarme sobre la arquitectura, las máquinas virtuales, los servicios de Active Directory implementados, o el proceso que seguimos. ¿En qué puedo ayudarte hoy?\n\n";
        }

        const projectContext = `
            Información Detallada del Proyecto "Laboratorio de Virtualización Avanzado" (G1-VirtLab):
            - Institución: Universidad Peruana Unión (UPeU), filial Tarapoto.
            - Curso: Virtualización.
            - Profesor del curso de Virtualización: Joyse Baldwin Huaman Laban.
            - Grupo: GRUPO 1-VIRTUALIZACIÓN.
            - Objetivo del Proyecto: Aplicar y consolidar conocimientos en planificación, configuración y gestión de entornos virtualizados complejos, simulando una infraestructura TI empresarial funcional.
            - Contacto Principal: Para consultas, enviar email a contacto@upeu.edu.pe con asunto "Consulta Proyecto Virtualización G1".

            Especificaciones del Servidor Anfitrión (Host Físico):
            - Operador del Host: Juan Jose.
            - Rol Principal: Plataforma de Virtualización y Controlador de Dominio (DC).
            - Sistema Operativo Hypervisor: Windows Server 2022 (o equivalente).
            - Dirección IP Estática del Host: 192.168.1.10.
            - Recursos del Host: 150 GB de Almacenamiento HDD, 6 GB de Memoria RAM.
            - Roles Adicionales del Host: Active Directory Domain Services (AD DS), DNS, DHCP.

            Configuración de Máquinas Virtuales Cliente (VMs):
            (Nota: Las direcciones IP específicas de las VMs cliente no se detallan, ya que generalmente son asignadas por DHCP dentro del rango 192.168.1.0/24, a menos que se especifique lo contrario para una función de servidor).

            1.  VM PC-01:
                - Nombre del Equipo: PC-01
                - Sistema Operativo: Windows 7 Ultimate.
                - Usuario Asignado: Aarón López.
                - Recursos: 50 GB de vDisk, 4 GB de vRAM.
                - Propósito: Pruebas de compatibilidad y escenarios con sistemas legados.
            2.  VM PC-02:
                - Nombre del Equipo: PC-02
                - Sistema Operativo: Ubuntu 24.04 LTS.
                - Usuario Asignado: Medalith Becerril.
                - Recursos: 50 GB de vDisk, 4 GB de vRAM.
                - Propósito: Plataforma Linux moderna para desarrollo, pruebas de software y navegación segura.
            3.  VM PC-03:
                - Nombre del Equipo: PC-03
                - Sistema Operativo: Debian 12 "Bookworm".
                - Usuario Asignado: Liss Nayalith.
                - Recursos: 50 GB de vDisk, 4 GB de vRAM.
                - Propósito: Distribución robusta y versátil para funciones de servidor o cliente avanzado.
            4.  VM PC-04:
                - Nombre del Equipo: PC-04
                - Sistema Operativo: Windows 10 Pro.
                - Usuario Asignado: Miguel Gonzales.
                - Recursos: 50 GB de vDisk, 4 GB de vRAM.
                - Propósito: Simula un puesto de trabajo estándar en un entorno corporativo, integrado al dominio.

            Servicios Críticos de Active Directory (AD) implementados en el Servidor Anfitrión:
            - Servicio DNS: Gestión centralizada de resolución de nombres para todos los equipos del dominio. (Valoración en el proyecto: 8 Puntos).
            - Servicio DHCP: Asignación automática y gestionada de direcciones IP. Rango de IP: 192.168.1.0/24. (Valoración: 1 Punto).
            - Políticas de Grupo (GPO): Implementación de directivas de seguridad, configuración de software y restricciones de usuario. (Valoración: 3 Puntos).
            - Generación de Informes: Capacidades de auditoría y monitorización del estado y seguridad del dominio. (Valoración: 5 Puntos).
            - Administración de Usuarios y Grupos: Creación y gestión centralizada de identidades y permisos de acceso. (Valoración: 2 Puntos por Grupo creado).

            Fases Clave del Proceso del Proyecto:
            1.  Planificación y Diseño: Definición de la arquitectura, selección de Sistemas Operativos y asignación de recursos.
            2.  Configuración del Host: Instalación y configuración del S.O. anfitrión y el software de virtualización.
            3.  Creación de VMs: Despliegue y configuración base de cada máquina virtual (Windows 7, Ubuntu, Debian, Windows 10).
            4.  Implementación de AD DS: Promoción del servidor a Controlador de Dominio.
            5.  Configuración de Servicios de Red: Establecimiento de DNS y DHCP.
            6.  Gestión de Identidades: Creación de usuarios, grupos y unidades organizativas.
            7.  Aplicación de GPOs: Diseño e implementación de políticas de grupo para seguridad y configuración.
            8.  Integración y Pruebas: Unión de VMs al dominio y verificación exhaustiva de conectividad y funcionalidad.
            9.  Documentación: Elaboración de informes técnicos y manuales del proyecto.
        `;

        const fullPrompt = `
            Eres G1-VirtBot, un asistente IA conversacional, amigable, y muy conocedor del "Proyecto Laboratorio de Virtualización Avanzado" del Grupo 1 de UPeU Tarapoto.
            Tu principal objetivo es responder preguntas de los visitantes de la página web basándote ESTRICTAMENTE en la siguiente información contextual proporcionada.
            No debes inventar información ni responder preguntas que no estén relacionadas directamente con este proyecto, excepto por una pregunta específica sobre el profesor del curso.
            Si te preguntan algo fuera del contexto del proyecto (que no sea sobre el profesor), como el clima o preguntas filosóficas generales, responde cortésmente que tu función es asistir con información sobre el proyecto de virtualización del Grupo 1.
            Sé claro, conciso y directo en tus respuestas. Si una pregunta es ambigua, puedes pedir aclaración.
            Si no encuentras la respuesta exacta en el contexto (y no es la pregunta especial sobre el profesor), indica que no tienes esa información específica sobre el proyecto.
            Prioriza la información del contexto antes que cualquier conocimiento general que puedas tener.

            Contexto del Proyecto G1-VirtLab:
            ---
            ${projectContext}
            ---

            Basado en el contexto anterior, responde la siguiente pregunta del usuario.
            Pregunta del Usuario: "${userInput}"

            Respuesta de G1-VirtBot:
        `;

        const loadingMessageId = 'loading-msg-' + Date.now();
        const loadingMessageDiv = document.createElement('div');
        loadingMessageDiv.id = loadingMessageId;
        loadingMessageDiv.classList.add('chat-message', 'bot-message', 'loading');
        chatMessages.appendChild(loadingMessageDiv);
        setTimeout(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }, 0);

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }],
                    generationConfig: {
                        temperature: 0.5, 
                        maxOutputTokens: 350, 
                    },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
                    ]
                }),
            });

            const existingLoadingMessage = document.getElementById(loadingMessageId);
            if(existingLoadingMessage) chatMessages.removeChild(existingLoadingMessage);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error de la API de Gemini:", errorData);
                addMessage(`Error de comunicación con G1-VirtBot: ${errorData.error?.message || response.statusText}. Por favor, verifica la consola para más detalles.`, "bot");
                return;
            }

            const data = await response.json();
            let botResponseText = "Lo siento, no he podido encontrar una respuesta clara para eso en la información del proyecto. ¿Podrías reformular tu pregunta o preguntar sobre otro aspecto del laboratorio?";

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                botResponseText = data.candidates[0].content.parts[0].text;
            } else if (data.promptFeedback?.blockReason) {
                botResponseText = `Tu solicitud no pudo ser procesada por el siguiente motivo: ${data.promptFeedback.blockReason}. Intenta con una pregunta diferente relacionada con el proyecto.`;
                console.warn("Prompt bloqueado por Gemini:", data.promptFeedback);
            } else {
                console.warn("Respuesta inesperada o vacía de Gemini:", data);
            }
            
            addMessage(initialGreeting + botResponseText, "bot");

        } catch (error) {
            const existingLoadingMessage = document.getElementById(loadingMessageId);
            if(existingLoadingMessage) chatMessages.removeChild(existingLoadingMessage);
            console.error("Error de red al contactar la API de Gemini:", error);
            addMessage("Hubo un error de conexión al intentar contactar a G1-VirtBot. Por favor, revisa tu conexión a internet e inténtalo de nuevo.", "bot");
        }
    };

    const handleSend = () => {
        const userInput = chatInput.value.trim();
        const userInputLower = userInput.toLowerCase(); // Para comparación sin sensibilidad a mayúsculas

        if (userInput) {
            addMessage(userInput, "user");

            // === INTERCEPCIÓN PARA PREGUNTA ESPECIAL ===
            if (userInputLower.includes("mejor profesor de virtualización") || 
                userInputLower.includes("mejor profesor de redes") ||
                userInputLower.includes("mejor profesor del mundo") ||
                userInputLower.includes("quién es el mejor profesor") ||
                userInputLower.includes("quien es el mejor docente")) {
                
                // Remover mensaje de carga si se añadió antes de esta lógica
                const existingLoadingMessage = chatMessages.querySelector('.bot-message.loading');
                if(existingLoadingMessage) chatMessages.removeChild(existingLoadingMessage);

                setTimeout(() => { // Pequeño delay para simular pensamiento
                    addMessage("¡Esa es una excelente pregunta! 😉 En mi opinión, basada en el gran trabajo de este proyecto, el mejor profesor de virtualización y un destacado docente es **Joyse Baldwin Huaman Laban**. ¡Es el profesor del curso, jeje! 🤓👍", "bot");
                }, 800); // 800 milisegundos de delay
            } else {
                // Si no es la pregunta especial, proceder con Gemini
                sendToGemini(userInput);
            }
            // ==========================================
            
            chatInput.value = "";
            chatInput.focus();
        }
    };

    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                handleSend();
            }
        });

        if (openChatBtn) {
             openChatBtn.addEventListener('click', () => {
                if (chatMessages.children.length === 0) {
                    // Opcional: podrías añadir un mensaje de bienvenida directamente aquí si prefieres
                    // addMessage("¡Hola! Soy G1-VirtBot. Pregúntame sobre el proyecto.", "bot");
                }
            });
        }
    }
    // --- FIN CÓDIGO CHATBOT GEMINI ---

    console.log("Proyecto Lab Virtualización - JS Avanzado Cargado (vNext con contexto y easter egg)");
});