// ================================================================
// 대전디자인 - Main JavaScript
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    initWelcomePopup();
    initGlassHeader();
    initMobileNav();
    initHeroSlider();
    initMorphingText();
    initPortfolioTabs();
    initFAQ();
    initContactForm();
    initScrollReveal();
    initCountUp();
    initModal();
});

// ===== WELCOME POPUP =====
function initWelcomePopup() {
    const popup = document.getElementById('welcomePopup');
    const closeBtn = document.getElementById('popupClose');
    const noShowCheck = document.getElementById('popupNoShow');
    if (!popup) return;

    // Check if user opted out today
    const noShowDate = localStorage.getItem('popupNoShow');
    const today = new Date().toDateString();
    if (noShowDate === today) return;

    // Show popup after a brief delay
    setTimeout(() => {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 800);

    function closePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
        // Save "don't show today" preference
        if (noShowCheck && noShowCheck.checked) {
            localStorage.setItem('popupNoShow', today);
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    popup.querySelector('.welcome-popup-backdrop').addEventListener('click', closePopup);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) closePopup();
    });
}

// ===== GLASS HEADER =====
function initGlassHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const heroSlider = document.querySelector('.hero-slider');
    const isHomePage = !!heroSlider;

    function updateHeader() {
        const scrollY = window.pageYOffset;
        const heroH = heroSlider ? heroSlider.offsetHeight : 0;

        if (isHomePage) {
            if (scrollY > heroH - 100) {
                header.classList.add('scrolled', 'on-light');
            } else {
                header.classList.add('scrolled');
                header.classList.remove('on-light');
            }
            if (scrollY < 10) {
                header.classList.remove('scrolled', 'on-light');
            }
        } else {
            if (scrollY > 300) {
                header.classList.add('on-light');
                header.classList.remove('scrolled');
            } else if (scrollY > 10) {
                header.classList.add('scrolled');
                header.classList.remove('on-light');
            } else {
                header.classList.remove('scrolled', 'on-light');
            }
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
}

// ===== MOBILE NAV =====
function initMobileNav() {
    const toggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            toggle.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('open');
            toggle.classList.remove('active');
        }
    });
}

// ===== HERO SLIDER =====
function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.slider-dot');
    const currentNum = slider.querySelector('.current-num');
    const total = slides.length;
    let current = 0;
    let interval = null;
    let isTransitioning = false;
    const DURATION = 6000;

    function goTo(index) {
        if (isTransitioning || index === current) return;
        isTransitioning = true;

        const prev = current;
        current = index;

        slides[prev].classList.remove('active');
        slides[prev].classList.add('leaving');
        slides[current].classList.add('active');

        setTimeout(() => {
            slides[prev].classList.remove('leaving');
            isTransitioning = false;
        }, 1200);

        // Update dots
        dots.forEach((dot) => {
            dot.classList.remove('active');
            const progress = dot.querySelector('.dot-progress');
            if (progress) progress.style.animation = 'none';
        });

        void dots[current].offsetWidth;
        dots[current].classList.add('active');
        const activeProgress = dots[current].querySelector('.dot-progress');
        if (activeProgress) {
            activeProgress.style.animation = 'none';
            void activeProgress.offsetWidth;
            activeProgress.style.animation = `dotFill ${DURATION}ms linear forwards`;
        }

        if (currentNum) {
            currentNum.textContent = String(current + 1).padStart(2, '0');
        }

        // Trigger morphing text on new slide
        const newMorph = slides[current].querySelector('.morph-text');
        if (newMorph && newMorph._morphInstance) {
            newMorph._morphInstance.reset();
        }
    }

    function next() {
        goTo((current + 1) % total);
    }

    function startAutoplay() {
        stopAutoplay();
        interval = setInterval(next, DURATION);
        const firstProgress = dots[current].querySelector('.dot-progress');
        if (firstProgress) {
            firstProgress.style.animation = `dotFill ${DURATION}ms linear forwards`;
        }
    }

    function stopAutoplay() {
        if (interval) clearInterval(interval);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            goTo(i);
            startAutoplay();
        });
    });

    // Touch swipe
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 60) {
            stopAutoplay();
            if (diff > 0) goTo((current + 1) % total);
            else goTo((current - 1 + total) % total);
            startAutoplay();
        }
    }, { passive: true });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    slides[0].classList.add('active');
    dots[0].classList.add('active');
    startAutoplay();
}

// ===== MORPHING TEXT =====
function initMorphingText() {
    const morphElements = document.querySelectorAll('.morph-text');
    if (!morphElements.length) return;

    morphElements.forEach(el => {
        const words = (el.dataset.words || '').split(',').map(w => w.trim()).filter(Boolean);
        if (words.length < 2) return;

        let currentIndex = 0;
        let morphInterval = null;

        function setChars(text, isAnimating) {
            el.innerHTML = '';
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.className = 'morph-char';
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = isAnimating ? `${i * 0.04}s` : '0s';
                el.appendChild(span);
            });
        }

        function morphOut() {
            const chars = el.querySelectorAll('.morph-char');
            chars.forEach((char, i) => {
                char.style.animationDelay = `${i * 0.025}s`;
                char.classList.add('out');
            });
        }

        function morphTo(text) {
            morphOut();
            setTimeout(() => {
                setChars(text, true);
            }, 250);
        }

        function nextWord() {
            currentIndex = (currentIndex + 1) % words.length;
            morphTo(words[currentIndex]);
        }

        function start() {
            setChars(words[0], true);
            morphInterval = setInterval(nextWord, 3000);
        }

        function reset() {
            clearInterval(morphInterval);
            currentIndex = 0;
            start();
        }

        // Store instance on the element for slider access
        el._morphInstance = { reset, start };

        // Only start morphing if the parent slide is active
        const parentSlide = el.closest('.hero-slide');
        if (parentSlide && parentSlide.classList.contains('active')) {
            start();
        } else {
            // Set initial text without animation
            setChars(words[0], false);
        }

        // Observe slide activation
        if (parentSlide) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((m) => {
                    if (m.attributeName === 'class') {
                        if (parentSlide.classList.contains('active')) {
                            reset();
                        } else {
                            clearInterval(morphInterval);
                        }
                    }
                });
            });
            observer.observe(parentSlide, { attributes: true });
        }
    });
}

// ===== PORTFOLIO TABS =====
function initPortfolioTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.portfolio-panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            panels.forEach(p => {
                p.classList.remove('active');
                if (p.id === `panel-${target}`) p.classList.add('active');
            });
        });
    });
}

// ===== FAQ =====
function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const q = item.querySelector('.faq-question');
        const a = item.querySelector('.faq-answer');
        if (!q || !a) return;

        q.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => {
                i.classList.remove('active');
                const ans = i.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = '0';
            });
            if (!isActive) {
                item.classList.add('active');
                a.style.maxHeight = a.scrollHeight + 'px';
            }
        });
    });
}

// ===== CONTACT FORM (Formspree) =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const phone = document.getElementById('phone');
    if (phone) {
        phone.addEventListener('input', (e) => {
            let v = e.target.value.replace(/[^0-9]/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            if (v.length > 7) v = v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7);
            else if (v.length > 3) v = v.slice(0, 3) + '-' + v.slice(3);
            e.target.value = v;
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const companyName = document.getElementById('companyName')?.value.trim();
        const contactName = document.getElementById('contactName')?.value.trim();
        const phoneVal = document.getElementById('phone')?.value.trim();
        const privacyAgree = document.getElementById('privacyAgree')?.checked;
        const message = document.getElementById('message')?.value.trim() || '';
        const serviceTypes = [];
        document.querySelectorAll('input[name="serviceType"]:checked').forEach(c => serviceTypes.push(c.value));

        if (!companyName || !contactName || !phoneVal) { alert('필수 항목을 모두 입력해 주세요.'); return; }
        if (serviceTypes.length === 0) { alert('서비스 유형을 하나 이상 선택해 주세요.'); return; }
        if (!privacyAgree) { alert('개인정보 수집 및 이용에 동의해 주세요.'); return; }

        btn.classList.add('loading');
        btn.textContent = '전송 중...';

        try {
            // Send to Formspree
            await fetch('https://formspree.io/f/mvgdzwry', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    companyName, contactName, phone: phoneVal,
                    serviceType: serviceTypes.join(', '),
                    message
                })
            });

            // Also save to local DB
            try {
                await fetch('tables/consultations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        companyName, contactName, phone: phoneVal,
                        serviceType: serviceTypes.join(', '),
                        message, status: '신규',
                        submittedAt: new Date().toISOString()
                    })
                });
            } catch(dbErr) { /* silent */ }

        } catch (err) { /* silent */ }

        btn.classList.remove('loading');
        btn.textContent = '무료 시안 신청하기';
        form.reset();
        showModal();
    });
}

// ===== MODAL =====
function initModal() {
    const modal = document.getElementById('successModal');
    const close = document.getElementById('modalClose');
    if (!modal || !close) return;
    close.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
}
function showModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.add('active');
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
}

// ===== COUNT UP =====
function initCountUp() {
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCount(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    nums.forEach(n => observer.observe(n));
}

function animateCount(el, target) {
    const duration = 1500;
    const start = performance.now();
    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
}