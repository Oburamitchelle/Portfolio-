document.addEventListener("DOMContentLoaded", () => {
    // ─────────────────────────────────────────────────────
    //  EmailJS Configuration
    // ─────────────────────────────────────────────────────
    const EMAILJS_PUBLIC_KEY = "IA6m-AhPHyocgWPUy";
    const EMAILJS_SERVICE_ID = "service_ux2td5n";
    const EMAILJS_TEMPLATE_ID = "template_n8vx4cv";

    // Initialise EmailJS
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const toast = document.getElementById("toast");

    const fields = {
        name: {
            el: document.getElementById("name"),
            err: document.getElementById("name-error")
        },
        email: {
            el: document.getElementById("email"),
            err: document.getElementById("email-error")
        },
        message: {
            el: document.getElementById("message"),
            err: document.getElementById("message-error")
        }
    };

    // ─────────────────────────────────────────────────────
    //  Validation Helpers
    // ─────────────────────────────────────────────────────
    const validators = {
        name: v => v.trim().length >= 2,
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        message: v => v.trim().length >= 10
    };

    function validateField(key) {
        const { el, err } = fields[key];
        const valid = validators[key](el.value);
        el.classList.toggle("invalid", !valid);
        err.classList.toggle("visible", !valid);
        return valid;
    }

    function validateAll() {
        return Object.keys(fields).map(validateField).every(Boolean);
    }

    // Live validation on blur
    Object.keys(fields).forEach(key => {
        fields[key].el.addEventListener("blur", () => validateField(key));
        fields[key].el.addEventListener("input", () => {
            if (fields[key].el.classList.contains("invalid"))
                validateField(key);
        });
    });

    // ─────────────────────────────────────────────────────
    //  Toast
    // ─────────────────────────────────────────────────────
    let toastTimer;

    function showToast(message, type = "success") {
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 5000);
    }

    // ─────────────────────────────────────────────────────
    //  Form Submit
    // ─────────────────────────────────────────────────────
    form.addEventListener("submit", async e => {
        e.preventDefault();

        if (!validateAll()) return;

        submitBtn.classList.add("loading");

        const templateParams = {
            user_name: fields.name.el.value.trim(),
            user_email: fields.email.el.value.trim(),
            message: fields.message.el.value.trim()
        };

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            showToast("✓ Message sent! We'll be in touch soon.", "success");
            form.reset();
            Object.keys(fields).forEach(key => {
                fields[key].el.classList.remove("invalid");
                fields[key].err.classList.remove("visible");
            });
        } catch (error) {
            console.error("EmailJS error:", error);
            showToast("Something went wrong. Please try again.", "error");
        } finally {
            submitBtn.classList.remove("loading");
        }
    });

    // ─── Hamburger Mobile Menu ────────────────────────────────
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    function openMenu() {
        hamburger.classList.add("open");
        mobileMenu.classList.add("open");
        hamburger.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    function isOpen() {
        return hamburger.classList.contains("open");
    }

    hamburger.addEventListener("click", e => {
        e.stopPropagation();
        isOpen() ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", e => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && isOpen()) closeMenu();
    });

    // ─── Tabs ─────────────────────────────────────────────────
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            tabPanels.forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            document
                .getElementById(btn.getAttribute("data-target"))
                .classList.add("active");
        });
    });

    // ─── Custom Cursor ────────────────────────────────────────
    const cursor = document.getElementById("cursor");
    const trail = document.getElementById("cursorTrail");

    let mouseX = 0,
        mouseY = 0;
    let trailX = 0,
        trailY = 0;

    document.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.12;
        trailY += (mouseY - trailY) * 0.12;
        trail.style.left = trailX + "px";
        trail.style.top = trailY + "px";
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
        trail.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        cursor.style.opacity = "1";
        trail.style.opacity = "1";
    });

    // ─── Nav Scroll Behavior ──────────────────────────────────
    const nav = document.getElementById("nav");

    window.addEventListener(
        "scroll",
        () => {
            nav.classList.toggle("scrolled", window.scrollY > 60);
        },
        { passive: true }
    );

    // ─── Smooth Scroll for Nav Links ──────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", e => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // ─── Intersection Observer — Reveal on Scroll ─────────────
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add("visible");
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    const revealTargets = [
        ".project-card",
        ".about-text",
        ".about-skills",
        ".skill-group",
        ".stat",
        ".section-header",
        ".contact-inner"
    ];

    revealTargets.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add("reveal");
            if (el.closest(".stats-row") || el.closest(".about-skills")) {
                el.style.transitionDelay = `${i * 0.08}s`;
            }
            revealObserver.observe(el);
        });
    });

    // ─── Animated Stat Counters ───────────────────────────────
    const statNumbers = document.querySelectorAll(".stat-number");

    const counterObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(
                        entry.target,
                        parseInt(entry.target.getAttribute("data-target"), 10)
                    );
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }

        requestAnimationFrame(update);
    }

    // ─── Project Card Tilt Effect ─────────────────────────────
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.01)`;
        });

        card.addEventListener("mouseenter", () => {
            card.style.transition = "transform 0.1s ease";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform =
                "perspective(1000px) rotateY(0) rotateX(0) scale(1)";
            card.style.transition =
                "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        });
    });

    // ─── Marquee Pause on Hover ───────────────────────────────
    const marquee = document.querySelector(".marquee");
    if (marquee) {
        marquee.addEventListener("mouseenter", () => {
            marquee.style.animationPlayState = "paused";
        });
        marquee.addEventListener("mouseleave", () => {
            marquee.style.animationPlayState = "running";
        });
    }

    // ─── Nav Link Active State on Scroll ─────────────────────
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    const sectionObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach(link => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${id}`
                        );
                    });
                }
            });
        },
        { threshold: 0.4 }
    );

    sections.forEach(section => sectionObserver.observe(section));

    // ─── Subtle Parallax on Hero ──────────────────────────────
    const heroTitle = document.querySelector(".hero-title");
    const heroNumber = document.querySelector(".hero-number");

    if (heroTitle) {
        window.addEventListener(
            "scroll",
            () => {
                const scrollY = window.scrollY;
                if (scrollY < window.innerHeight) {
                    heroTitle.style.transform = `translateY(${scrollY * 0.15}px)`;
                    if (heroNumber) {
                        heroNumber.style.transform = `translateY(calc(-50% + ${scrollY * 0.08}px))`;
                    }
                }
            },
            { passive: true }
        );
    }

    // ─── Page Load Fade-in ────────────────────────────────────
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.6s ease";
    requestAnimationFrame(() => {
        document.body.style.opacity = "1";
    });

    // ─── Contact Email Magnetic Hover ─────────────────────────
    const emailLink = document.querySelector(".contact-email");

    if (emailLink) {
        emailLink.addEventListener("mousemove", e => {
            const rect = emailLink.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
            emailLink.style.transform = `translate(${x}px, ${y}px)`;
            emailLink.style.transition = "transform 0.15s ease";
        });

        emailLink.addEventListener("mouseleave", () => {
            emailLink.style.transform = "translate(0, 0)";
            emailLink.style.transition =
                "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        });
    }
}); // end DOMContentLoaded
