/**
 * PTD Jesuïtes Joan XXIII — Interactivity Module
 * ================================================
 * Updated for the new Tech/Cyber aesthetic: geometric particles,
 * snappier animations, and modern easing.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Hero Floating Tech Nodes (Squares instead of circles) ──
    const particlesContainer = document.querySelector('.hero-particles');
    if (particlesContainer) {
        for (let i = 0; i < 25; i++) {
            const span = document.createElement('span');
            span.style.left = Math.random() * 100 + '%';
            span.style.animationDuration = (8 + Math.random() * 15) + 's';
            span.style.animationDelay = Math.random() * 5 + 's';

            // Tech nodes (small squares)
            const size = (3 + Math.random() * 6) + 'px';
            span.style.width = size;
            span.style.height = size;
            span.style.borderRadius = '2px'; // Square edges

            particlesContainer.appendChild(span);
        }
    }

    // ─── Navbar Scroll Effect ───────────────────────────
    const navbar = document.querySelector('.navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // ─── Active Nav Link Highlight ──────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightActiveLink() {
        const scrollPos = window.scrollY + 150;
        let found = false;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.offsetTop <= scrollPos) {
                navLinks.forEach(l => l.classList.remove('active'));
                const target = document.querySelector(`.nav-links a[href="#${section.id}"]`);
                if (target) target.classList.add('active');
                found = true;
                break;
            }
        }
        if (!found) navLinks.forEach(l => l.classList.remove('active'));
    }
    window.addEventListener('scroll', highlightActiveLink, { passive: true });
    highlightActiveLink();

    // ─── Mobile Menu Toggle ─────────────────────────────
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navLinksContainer.classList.toggle('open');
            document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navLinksContainer.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ─── Scroll Reveal (Snappier intersection) ──────────
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── Animated Counter ───────────────────────────────
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1500; // Faster, punchier animation
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // EaseOutExpo for snappy counting
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix;
            }
        }
        requestAnimationFrame(update);
    }

    const counters = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    // ─── KPI Ring Animation ─────────────────────────────
    // Calculation: r=52 -> circumference ≈ 326.73 (Updated in CSS for r=52 inside 100x100 viewBox means scaled down, but path length stays relative)
    const kpiRingFills = document.querySelectorAll('.kpi-ring__fill');
    const circumference = 326.73;

    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = parseFloat(entry.target.getAttribute('data-percent')) || 0;
                const offset = circumference - (circumference * percent / 100);
                // Force a reflow to ensure CSS transition triggers
                void entry.target.offsetWidth;
                entry.target.style.strokeDashoffset = offset;
                ringObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    kpiRingFills.forEach(ring => {
        // Initial setup
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference;
        ringObserver.observe(ring);
    });

    // ─── Progress Bars Animate on View ──────────────────
    const progressBars = document.querySelectorAll('.progress-bar .fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.getAttribute('data-width');
                entry.target.style.width = target;
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => progressObserver.observe(bar));

    // ─── Tabs (Action Plan) ─────────────────────────────
    const tabs = document.querySelectorAll('.action-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            tab.classList.add('active');
            const targetContent = document.getElementById(target);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // ─── Back to Top ────────────────────────────────────
    const backToTop = document.querySelector('.back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Smooth scroll for anchor links ─────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    console.log('✅ Tech Theme Interactivity Loaded.');
});