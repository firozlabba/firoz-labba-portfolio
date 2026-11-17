
/* =========================================================
   FIROZ LABBA — PREMIUM PORTFOLIO
   Complete interactive JavaScript
========================================================= */

"use strict";

document.documentElement.classList.add("js-enabled");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const finePointer = window.matchMedia(
    "(pointer: fine)"
).matches;


/* 1. CINEMATIC LOADER */

const pageLoader = document.querySelector("#pageLoader");

function hidePageLoader() {
    if (!pageLoader) return;

    pageLoader.classList.add("loader-hidden");

    window.setTimeout(() => {
        pageLoader.remove();
    }, 900);
}

if (pageLoader) {
    if (document.readyState === "complete") {
        window.setTimeout(hidePageLoader, 350);
    } else {
        window.addEventListener("load", hidePageLoader, {
            once: true
        });

        window.setTimeout(hidePageLoader, 3000);
    }
}


/* 2. SCROLL PROGRESS */

const progressBar = document.querySelector("#scrollProgress");
let scrollTicking = false;

function updateScrollProgress() {
    if (!progressBar) return;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress = scrollHeight > 0
        ? (window.scrollY / scrollHeight) * 100
        : 0;

    progressBar.style.width = `${progress}%`;
    scrollTicking = false;
}

window.addEventListener("scroll", () => {
    if (!scrollTicking) {
        requestAnimationFrame(updateScrollProgress);
        scrollTicking = true;
    }
}, { passive: true });

updateScrollProgress();


/* 3. NAVBAR SCROLL EFFECT */

const navbar = document.querySelector("#navbar");

function updateNavbar() {
    if (!navbar) return;

    navbar.classList.toggle(
        "scrolled",
        window.scrollY > 40
    );
}

window.addEventListener("scroll", updateNavbar, {
    passive: true
});

updateNavbar();


/* 4. CUSTOM CURSOR */

const cursor = document.querySelector("#customCursor");
const cursorOutline = document.querySelector("#cursorOutline");

if (finePointer && !prefersReducedMotion && cursor) {
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let cursorAnimationRunning = false;

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.45;
        cursorY += (mouseY - cursorY) * 0.45;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        if (cursorOutline) {
            cursorOutline.style.left = `${cursorX}px`;
            cursorOutline.style.top = `${cursorY}px`;
        }

        if (
            Math.abs(mouseX - cursorX) > 0.5 ||
            Math.abs(mouseY - cursorY) > 0.5
        ) {
            requestAnimationFrame(animateCursor);
        } else {
            cursorAnimationRunning = false;
        }
    }

    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        cursor.classList.add("cursor-visible");

        if (cursorOutline) {
            cursorOutline.classList.add("cursor-visible");
        }

        if (!cursorAnimationRunning) {
            cursorAnimationRunning = true;
            requestAnimationFrame(animateCursor);
        }
    }, { passive: true });

    document.addEventListener("mouseover", (event) => {
        const target = event.target.closest(
            "a, button, .project-card, .service-card, .skill-card"
        );

        cursor.classList.toggle(
            "cursor-active",
            Boolean(target)
        );

        if (cursorOutline) {
            cursorOutline.classList.toggle(
                "cursor-active",
                Boolean(target)
            );
        }
    });

    document.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor-visible");

        if (cursorOutline) {
            cursorOutline.classList.remove("cursor-visible");
        }
    });
}


/* 5. SCROLL REVEAL */

const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
    revealElements.forEach((element) => {
        element.classList.add("active");
    });

} else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element, index) => {
        element.style.transitionDelay =
            `${Math.min(index % 4, 3) * 70}ms`;

        revealObserver.observe(element);
    });

} else {
    revealElements.forEach((element) => {
        element.classList.add("active");
    });
}


/* 6. PROJECT CARD TILT */

const projectCards = document.querySelectorAll(".project-card");

if (finePointer && !prefersReducedMotion) {
    projectCards.forEach((card) => {
        let cardFrame = null;

        card.addEventListener("mousemove", (event) => {
            if (cardFrame) return;

            cardFrame = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX =
                    ((y - centerY) / centerY) * -2.5;

                const rotateY =
                    ((x - centerX) / centerX) * 2.5;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-4px)
                `;

                cardFrame = null;
            });
        });

        card.addEventListener("mouseleave", () => {
            if (cardFrame) {
                cancelAnimationFrame(cardFrame);
                cardFrame = null;
            }

            card.style.transform = "";
        });
    });
}


/* 7. MAGNETIC BUTTONS */

const magneticButtons = document.querySelectorAll(
    ".primary-btn, .secondary-btn, .nav-button, .hero-v2-btn"
);

if (finePointer && !prefersReducedMotion) {
    magneticButtons.forEach((button) => {
        button.addEventListener("mousemove", (event) => {
            const rect = button.getBoundingClientRect();

            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            button.style.transform =
                `translate(${x * 0.06}px, ${y * 0.06}px)`;
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "";
        });
    });
}


/* 8. HERO PARALLAX */


/* =========================================================
   8. HERO PARALLAX — SAFE TRANSFORM
========================================================= */

const heroSection = document.querySelector(".hero-v2");
const heroVisual = document.querySelector(".hero-v2-visual");

if (
    heroSection &&
    heroVisual &&
    finePointer &&
    !prefersReducedMotion
) {
    let heroFrame = null;

    heroSection.addEventListener("mousemove", (event) => {
        if (heroFrame) return;

        heroFrame = requestAnimationFrame(() => {
            const rect = heroSection.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            heroVisual.style.setProperty(
                "--hero-mouse-x",
                `${x * 4}px`
            );

            heroVisual.style.setProperty(
                "--hero-mouse-y",
                `${y * 4}px`
            );

            heroFrame = null;
        });
    });

    heroSection.addEventListener("mouseleave", () => {
        heroVisual.style.setProperty("--hero-mouse-x", "0px");
        heroVisual.style.setProperty("--hero-mouse-y", "0px");
    });
}



/* 9. PARTICLE BACKGROUND */

const canvas = document.querySelector("#particles");

if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");

    if (ctx) {
        let particles = [];
        let animationFrame = null;
        let isAnimating = false;

        const mouse = {
            x: null,
            y: null,
            radius: 100
        };

        function createParticles() {
            const area =
                window.innerWidth * window.innerHeight;

            const particleCount = Math.min(
                35,
                Math.max(12, Math.floor(area / 30000))
            );

            particles = [];

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 1.3 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.4 + 0.15
                });
            }
        }

        function resizeCanvas() {
            const dpr = Math.min(
                window.devicePixelRatio || 1,
                1.5
            );

            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;

            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            createParticles();
            drawParticles();
        }

        function drawParticles() {
            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );

            particles.forEach((particle) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (
                    particle.x < 0 ||
                    particle.x > window.innerWidth
                ) {
                    particle.speedX *= -1;
                }

                if (
                    particle.y < 0 ||
                    particle.y > window.innerHeight
                ) {
                    particle.speedY *= -1;
                }

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particle.x - mouse.x;
                    const dy = particle.y - mouse.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < mouse.radius && distance > 0) {
                        const force =
                            (mouse.radius - distance) / mouse.radius;

                        particle.x +=
                            (dx / distance) * force * 0.7;

                        particle.y +=
                            (dy / distance) * force * 0.7;
                    }
                }

                ctx.beginPath();
                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(242,29,67,${particle.opacity})`;

                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < 95) {
                        const opacity =
                            0.09 * (1 - distance / 95);

                        ctx.beginPath();
                        ctx.strokeStyle =
                            `rgba(242,29,67,${opacity})`;

                        ctx.lineWidth = 0.6;

                        ctx.moveTo(
                            particles[i].x,
                            particles[i].y
                        );

                        ctx.lineTo(
                            particles[j].x,
                            particles[j].y
                        );

                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            if (document.hidden || isAnimating) return;

            isAnimating = true;

            function frame() {
                if (document.hidden) {
                    isAnimating = false;
                    return;
                }

                drawParticles();
                animationFrame = requestAnimationFrame(frame);
            }

            animationFrame = requestAnimationFrame(frame);
        }

        function stopParticles() {
            cancelAnimationFrame(animationFrame);
            isAnimating = false;
        }

        window.addEventListener("mousemove", (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        }, { passive: true });

        window.addEventListener("mouseout", (event) => {
            if (!event.relatedTarget) {
                mouse.x = null;
                mouse.y = null;
            }
        });

        window.addEventListener("resize", resizeCanvas, {
            passive: true
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopParticles();
            } else {
                animateParticles();
            }
        });

        resizeCanvas();
        animateParticles();
    }
}


/* 10. MOBILE NAVIGATION */

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

if (menuToggle && navLinks) {
    function closeMenu() {
        navLinks.classList.remove("nav-open");
        menuToggle.classList.remove("menu-active");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen =
            navLinks.classList.toggle("nav-open");

        menuToggle.classList.toggle(
            "menu-active",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        const clickedInside =
            navLinks.contains(event.target) ||
            menuToggle.contains(event.target);

        if (!clickedInside) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });
}


/* 11. ACTIVE NAVIGATION LINK */

const pageSections = document.querySelectorAll("section[id]");
const navigationLinks = document.querySelectorAll(
    ".nav-links a[href^='#']"
);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                navigationLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${currentId}`
                    );
                });
            });
        },
        {
            threshold: 0.3
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


/* 12. SMOOTH ANCHOR SCROLL */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
        });
    });
});


/* 13. PROJECT DETAILS MODAL */

const projectModal = document.querySelector("#projectModal");
const modalTitle = document.querySelector("#projectModalTitle");
const modalDescription = document.querySelector(
    "#projectModalDescription"
);
const modalTech = document.querySelector("#projectModalTech");

const closeProjectModalButton = document.querySelector(
    "#closeProjectModal"
);

const projectModalBackdrop = document.querySelector(
    "#projectModalBackdrop"
);

const projectDetails = {
    talent: {
        title: "Talent Vector",
        description:
            "An AI-powered resume analysis platform that identifies skills, evaluates experience and provides career insights. Built with Python, Flask and JavaScript.",
        technologies: ["Python", "Flask", "JavaScript", "AI"]
    },

    restaurant: {
        title: "Restaurant Website",
        description:
            "A modern restaurant website concept showcasing its brand, menu and services through an elegant and responsive interface.",
        technologies: ["HTML", "CSS", "JavaScript"]
    },

    aurence: {
        title: "AURENCE Fashion Store",
        description:
            "A premium fashion storefront focused on refined product presentation, elegant styling and modern shopping experiences.",
        technologies: ["Next.js", "React", "TypeScript"]
    }
};

function openProjectModal(projectKey) {
    const project = projectDetails[projectKey];

    if (
        !project ||
        !projectModal ||
        !modalTitle ||
        !modalDescription ||
        !modalTech
    ) return;

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;

    modalTech.innerHTML = "";

    project.technologies.forEach((technology) => {
        const tag = document.createElement("span");
        tag.textContent = technology;
        modalTech.appendChild(tag);
    });

    projectModal.classList.add("modal-open");
    projectModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    if (closeProjectModalButton) {
        closeProjectModalButton.focus();
    }
}

function closeProjectModal() {
    if (!projectModal) return;

    projectModal.classList.remove("modal-open");
    projectModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}

document.querySelectorAll("[data-open-project]").forEach((button) => {
    button.addEventListener("click", () => {
        openProjectModal(button.dataset.openProject);
    });
});

if (closeProjectModalButton) {
    closeProjectModalButton.addEventListener(
        "click",
        closeProjectModal
    );
}

if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener(
        "click",
        closeProjectModal
    );
}

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        projectModal &&
        projectModal.classList.contains("modal-open")
    ) {
        closeProjectModal();
    }
});


/* 14. CONTACT FORM — MAILTO */


/* =========================================================
   14. CONTACT FORM — EMAILJS DIRECT EMAIL
========================================================= */

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

if (contactForm) {
    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );

    const originalButtonHTML = submitButton
        ? submitButton.innerHTML
        : "SEND MESSAGE ↗";

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        const name = document.querySelector("#contactName").value.trim();
        const email = document.querySelector("#contactEmail").value.trim();
        const subject = document.querySelector("#contactSubject").value.trim();
        const message = document.querySelector("#contactMessage").value.trim();

        if (!name || !email || !subject || !message) {
            if (formStatus) {
                formStatus.textContent = "Please complete all fields.";
                formStatus.className = "form-status status-error";
            }
            return;
        }

        if (typeof emailjs === "undefined") {
            if (formStatus) {
                formStatus.textContent =
                    "Email service is unavailable. Please try again later.";
                formStatus.className = "form-status status-error";
            }
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = "SENDING...";
        }

        if (formStatus) {
            formStatus.textContent = "Sending your message...";
            formStatus.className = "form-status";
        }

        try {
            const templateParams = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };

            await emailjs.send(
                "service_ose82lk",
                "template_ah4door",
                templateParams,
                {
                    publicKey: "sTyWwk46lnd0xTxXa"
                }
            );

            if (formStatus) {
                formStatus.textContent =
                    "Your message has been sent successfully! Thank you for contacting me.";
                formStatus.className = "form-status status-success";
            }

            contactForm.reset();

        } catch (error) {
            console.error("EmailJS Error:", error);

            if (formStatus) {
                formStatus.textContent =
                    "Unable to send your message. Please try again or contact me directly by email.";
                formStatus.className = "form-status status-error";
            }

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        }
    });
}


/* 15. VISITOR GREETING */

const visitorGreeting = document.querySelector(
    "#visitorGreeting"
);

const greetingText = document.querySelector("#greetingText");
const closeGreeting = document.querySelector("#closeGreeting");

function showVisitorGreeting() {
    if (!visitorGreeting || !greetingText) return;

    const hour = new Date().getHours();

    let greeting = "WELCOME TO MY PORTFOLIO";

    if (hour >= 5 && hour < 12) {
        greeting = "GOOD MORNING — WELCOME";
    } else if (hour >= 12 && hour < 17) {
        greeting = "GOOD AFTERNOON — WELCOME";
    } else if (hour >= 17 && hour < 22) {
        greeting = "GOOD EVENING — WELCOME";
    } else {
        greeting = "WELCOME — EXPLORE MY WORK";
    }

    greetingText.textContent = greeting;

    window.setTimeout(() => {
        visitorGreeting.classList.add("greeting-visible");
    }, 1200);

    window.setTimeout(() => {
        visitorGreeting.classList.remove("greeting-visible");
    }, 6500);
}

showVisitorGreeting();

if (closeGreeting) {
    closeGreeting.addEventListener("click", () => {
        visitorGreeting.classList.remove("greeting-visible");
    });
}


/* 16. BACK TO TOP */

const backToTop = document.querySelector("#backToTop");

if (backToTop) {
    backToTop.addEventListener("click", (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });
}


/* 17. IMAGE LOADING EFFECT */

const portfolioImages = document.querySelectorAll(
    ".hero-v2-image, .project-preview img"
);

portfolioImages.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
        img.classList.add("image-loaded");
    } else {
        img.addEventListener("load", () => {
            img.classList.add("image-loaded");
        }, { once: true });
    }
});


/* 18. FOOTER YEAR */

const footerParagraph = document.querySelector(".footer p");

if (footerParagraph) {
    footerParagraph.innerHTML =
        footerParagraph.innerHTML.replace(
            /\b20\d{2}\b/,
            new Date().getFullYear()
        );
}


/* 19. CONSOLE BRANDING */

console.log(
    "%c FIROZ LABBA ",
    "background:#f21d43;color:#fff;padding:10px 18px;font-size:16px;font-weight:bold;"
);

console.log(
    "%cBuilding digital experiences with creativity.",
    "color:#999;font-size:12px;"
);
