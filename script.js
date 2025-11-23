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
    
    // Navigation Logic
    function goToStep(currentStepId, nextStepId) {
        const current = document.getElementById(currentStepId);
        const next = document.getElementById(nextStepId);

        current.classList.remove('active');
        current.classList.add('hidden');

        setTimeout(() => {
            current.style.display = 'none'; // Fully hide after transition
            next.style.display = 'flex'; // Prepare for transition (keep flex for centering)
            // Small delay to allow display:flex to apply before adding active class
            requestAnimationFrame(() => {
                next.classList.remove('hidden');
                next.classList.add('active');
            });
        }, 500); // Match CSS transition speed
    }

    // Initial Setup (ensure only first step is visible)
    Object.values(steps).forEach((step, index) => {
        if (index !== 0) step.style.display = 'none';
        else step.style.display = 'flex'; // Ensure first step is flex
    });

    // Event Listeners
    buttons.start.addEventListener('click', () => {
        goToStep('step-welcome', 'step-suspense');
    });

    buttons.ready.addEventListener('click', () => {
        goToStep('step-suspense', 'step-gift');
    });

    giftBox.addEventListener('click', () => {
        // Shake animation
        giftBox.classList.add('shake');
        
        // Open after shake
        setTimeout(() => {
            giftBox.classList.remove('shake');
            giftBox.classList.add('open');
            
            // Transition to reveal after box opens
            setTimeout(() => {
                goToStep('step-gift', 'step-reveal');
                triggerConfetti();
            }, 800);
        }, 800);
    });

    buttons.replay.addEventListener('click', () => {
        // Reset gift box
        giftBox.classList.remove('open');
        
        // Go back to start or gift? Let's go to gift to re-open
        // Or maybe just re-trigger confetti?
        // Let's reload the page for a fresh experience or go to start
        location.reload();
    });

    // Confetti Effect
    function triggerConfetti() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
});
