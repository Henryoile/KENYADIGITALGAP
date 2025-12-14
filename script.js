document.getElementById('partner-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const form = event.target;
    const formMessage = document.getElementById('form-message');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic client-side validation
    if (!data.name || !data.email || !data.type) {
        formMessage.textContent = 'Please fill out all required fields.';
        formMessage.style.color = '#dc3545';
        return;
    }

    formMessage.textContent = 'Submitting...';
    formMessage.style.color = '#ffc107';

    try {
        const response = await fetch('/submit_inquiry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            formMessage.textContent = 'Thank you! Your inquiry has been submitted. We will be in touch soon.';
            formMessage.style.color = '#28a745';
            form.reset();
        } else {
            const errorData = await response.json();
            formMessage.textContent = `Submission failed. Server error: ${errorData.message || 'Unknown error'}`;
            formMessage.style.color = '#dc3545';
        }
    } catch (error) {
        console.error('Submission error:', error);
        formMessage.textContent = 'Network error. Please try again later.';
        formMessage.style.color = '#dc3545';
    }
});
// Donation modal handling
const donateButton = document.getElementById('donate-button');
const donationModal = document.getElementById('donation-modal');
const modalClose = document.getElementById('modal-close');
const modalOverlay = document.getElementById('modal-overlay');

function openModal() {
    donationModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    donationModal.setAttribute('aria-hidden', 'true');
}

if (donateButton) {
    donateButton.addEventListener('click', function (event) {
        event.preventDefault();
        openModal();
    });
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

// Animate numeric counters when they enter view
const counters = document.querySelectorAll('.counter');
function animateCounter(el) {
    const target = Number(el.getAttribute('data-target')) || 0;
    const start = 0;
    const duration = 1600;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const current = Math.floor(progress * (target - start) + start);
        // Format large numbers with commas
        el.textContent = current.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // For percentages, preserve formatting if needed
            if (el.nextElementSibling && el.nextElementSibling.classList.contains('muted')) return;
        }
    }
    window.requestAnimationFrame(step);
}

// Reveal animation for cards/sections
const revealElements = document.querySelectorAll('.stat-card, .impact-card, .testimonial-card, .action-form-container');
revealElements.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // If it is a counter element or contains counters, animate them
            const countersInside = entry.target.querySelectorAll ? entry.target.querySelectorAll('.counter') : [];
            countersInside.forEach(c => { if (!c.dataset.animated) { animateCounter(c); c.dataset.animated = 'true'; } });
            // Also animate direct counters
            if (entry.target.classList && entry.target.classList.contains('counter') && !entry.target.dataset.animated) {
                animateCounter(entry.target);
                entry.target.dataset.animated = 'true';
            }
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// also observe counter elements that might be outside the reveal set
document.querySelectorAll('.counter').forEach(el => {
    if (!el.dataset.animated) io.observe(el);
});

// Accessibility: close modal with Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && donationModal.getAttribute('aria-hidden') === 'false') closeModal();
});