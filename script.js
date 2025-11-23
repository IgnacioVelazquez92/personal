document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const steps = {
        welcome: document.getElementById('step-welcome'),
        suspense: document.getElementById('step-suspense'),
        gift: document.getElementById('step-gift'),
        reveal: document.getElementById('step-reveal')
    };

    const buttons = {
        start: document.getElementById('btn-start'),
        ready: document.getElementById('btn-ready'),
        replay: document.getElementById('btn-replay')
    };

    const giftBox = document.getElementById('gift-box');
    const video = document.getElementById('ultrasound-video');

    // -----------------------
    // Navegación entre pasos
    // -----------------------
    function goToStep(currentStepId, nextStepId) {
        const current = document.getElementById(currentStepId);
        const next = document.getElementById(nextStepId);

        current.classList.remove('active');
        current.classList.add('hidden');

        // El CSS tiene transición de 0.8s → usamos 800ms
        setTimeout(() => {
            current.style.display = 'none';
            next.style.display = 'flex';

            requestAnimationFrame(() => {
                next.classList.remove('hidden');
                next.classList.add('active');
            });
        }, 800);
    }

    // Initial Setup (ensure only first step is visible)
    Object.values(steps).forEach((step, index) => {
        if (index !== 0) {
            step.style.display = 'none';
        } else {
            step.style.display = 'flex';
        }
    });

    // -----------------------
    // Event Listeners básicos
    // -----------------------
    buttons.start.addEventListener('click', () => {
        goToStep('step-welcome', 'step-suspense');
    });

    buttons.ready.addEventListener('click', () => {
        goToStep('step-suspense', 'step-gift');
    });

    // Click en el regalo
    giftBox.addEventListener('click', () => {
        openGift();
    });

    // Accesibilidad teclado (Enter / Space)
    giftBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openGift();
        }
    });

    // Replay: experiencia completa de nuevo
    buttons.replay.addEventListener('click', () => {
        // Reiniciamos completamente la página para repetir la experiencia
        location.reload();
    });

    // -----------------------
    // Lógica de apertura del regalo
    // -----------------------
    function openGift() {
        // Evitar repetir animación si ya está abierto
        if (giftBox.classList.contains('open') || giftBox.classList.contains('shake')) {
            return;
        }

        // Shake animation
        giftBox.classList.add('shake');

        // Open after shake
        setTimeout(() => {
            giftBox.classList.remove('shake');
            giftBox.classList.add('open');

            // Transition to reveal after box opens
            setTimeout(() => {
                goToStep('step-gift', 'step-reveal');
                // Reinicia el video (por si alguien vuelve con reload rápido)
                if (video) {
                    video.currentTime = 0;
                    video.play().catch(() => {});
                }
                triggerConfetti();
            }, 800);
        }, 800);
    }

    // -----------------------
    // Confetti Effect
    // -----------------------
    function triggerConfetti() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }

    // -----------------------
    // Burbujas de fondo
    // -----------------------
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        // Ubicación horizontal aleatoria visible
        bubble.style.left = `${Math.random() * 100}%`;

        // Tamaño visible
        const size = Math.random() * 40 + 40; // burbujas de 40 a 80 px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // Ajustar duración para dar variedad
        const duration = Math.random() * 4 + 6; // 6 a 10 segundos
        bubble.style.animationDuration = `${duration}s`;

        document.body.appendChild(bubble);

        // Eliminar después
        setTimeout(() => {
            bubble.remove();
        }, duration * 1000);
    }

    // Crear burbujas con cierta frecuencia
    setInterval(createBubble, 1000);

    // -----------------------
    // Rastro del cursor
    // -----------------------
    let lastParticleTime = 0;

    document.addEventListener('mousemove', (event) => {
        const now = Date.now();

        // Throttle para no generar demasiadas partículas
        if (now - lastParticleTime < 40) return;
        lastParticleTime = now;

        const particle = document.createElement('div');
        particle.classList.add('cursor-particle');
        particle.style.left = `${event.clientX}px`;
        particle.style.top = `${event.clientY}px`;

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    });
});
