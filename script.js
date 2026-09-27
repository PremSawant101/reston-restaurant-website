document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       LENIS — SMOOTH SCROLL
    ========================================================= */

    let lenis;

    if (typeof Lenis !== "undefined") {
        lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.2
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Connect Lenis with GSAP ScrollTrigger
        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);

            lenis.on("scroll", ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        }
    }


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const header = document.querySelector(".site-header");
    const menuToggle =
        document.querySelector(".mobile-menu-btn") ||
        document.querySelector(".menu-toggle");

    const nav =
        document.querySelector(".main-nav") ||
        document.querySelector(".mobile-nav");

    const navLinks = document.querySelectorAll(
        ".main-nav a, .mobile-nav a, .mobile-nav__link"
    );

    const menuButtons = document.querySelectorAll(".menu-filter button");
    const menuItems = document.querySelectorAll(".menu-item");

    const reservationModal = document.querySelector("#reservationModal");
    const reservationButtons = document.querySelectorAll(
        '[data-modal="reservation"]'
    );

    const closeButtons = document.querySelectorAll(".modal-close");

    const galleryItems = document.querySelectorAll("[data-image]");
    const lightbox = document.querySelector("#lightbox");
    const lightboxImage = document.querySelector("#lightboxImage");

    const videoModal = document.querySelector("#videoModal");

    const backToTop = document.querySelector("#backToTop");

    const reservationForm = document.querySelector("#reservationForm");
    const newsletterForm = document.querySelector("#newsletterForm");


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    function initMobileMenu() {

        const menuToggle = document.querySelector(".mobile-menu-btn");
        const mobileNav = document.querySelector(".mobile-nav");

        if (!menuToggle || !mobileNav) {
            console.warn("RESTON: Mobile menu elements not found.");
            return;
        }

        const navLinks = mobileNav.querySelectorAll(
            ".mobile-nav__link, a"
        );

        const openMenu = () => {
            menuToggle.classList.add("active");
            mobileNav.classList.add("active");
            document.body.classList.add("menu-open");

            menuToggle.setAttribute("aria-expanded", "true");
        };

        const closeMenu = () => {
            menuToggle.classList.remove("active");
            mobileNav.classList.remove("active");
            document.body.classList.remove("menu-open");

            menuToggle.setAttribute("aria-expanded", "false");
        };

        menuToggle.setAttribute("type", "button");
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (mobileNav.classList.contains("active")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }


    /* =========================================================
       HEADER SCROLL
    ========================================================= */

    function initHeader() {
        if (!header) return;

        const updateHeader = () => {
            if (window.scrollY > 60) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        };

        updateHeader();

        window.addEventListener("scroll", updateHeader, {
            passive: true
        });
    }


    /* =========================================================
       MENU FILTER
    ========================================================= */

    function initMenuFilter() {
        const filterButtons = document.querySelectorAll(".menu-filter__btn");
        const menuItems = document.querySelectorAll(".menu-item");

        if (!filterButtons.length || !menuItems.length) return;

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {

                // Get category from YOUR HTML
                const selectedCategory = button.dataset.category;

                // Active button
                filterButtons.forEach((btn) => {
                    btn.classList.remove("active");
                    btn.setAttribute("aria-selected", "false");
                });

                button.classList.add("active");
                button.setAttribute("aria-selected", "true");


                // Filter menu items
                menuItems.forEach((item) => {

                    const itemCategory = item.dataset.category;

                    const shouldShow =
                        selectedCategory === "all" ||
                        itemCategory === selectedCategory;

                    // Stop previous GSAP animation
                    if (typeof gsap !== "undefined") {
                        gsap.killTweensOf(item);
                    }

                    if (shouldShow) {

                        item.hidden = false;
                        item.style.display = "";

                        if (typeof gsap !== "undefined") {
                            gsap.fromTo(
                                item,
                                {
                                    opacity: 0,
                                    y: 15
                                },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.35,
                                    ease: "power2.out",
                                    clearProps: "transform,opacity"
                                }
                            );
                        }

                    } else {

                        item.hidden = true;
                        item.style.display = "none";
                    }
                });


                // Update ScrollTrigger positions
                requestAnimationFrame(() => {
                    if (typeof ScrollTrigger !== "undefined") {
                        ScrollTrigger.refresh();
                    }
                });
            });
        });
    }


    /* =========================================================
       RESERVATION MODAL
    ========================================================= */

    function initReservationModal() {
        if (!reservationModal) return;

        reservationButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();

                reservationModal.classList.add("active");
                document.body.classList.add("modal-open");

                if (typeof gsap !== "undefined") {
                    gsap.fromTo(
                        reservationModal.querySelector(".modal-content"),
                        {
                            opacity: 0,
                            y: 40,
                            scale: 0.96
                        },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.45,
                            ease: "power3.out"
                        }
                    );
                }
            });
        });

        closeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                closeReservationModal();
            });
        });

        reservationModal.addEventListener("click", (event) => {
            if (event.target === reservationModal) {
                closeReservationModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeReservationModal();
            }
        });
    }


    function closeReservationModal() {
        if (!reservationModal) return;

        reservationModal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }


    /* =========================================================
       RESERVATION FORM
    ========================================================= */

    function initReservationForm() {
        if (!reservationForm) return;

        reservationForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const submitButton = reservationForm.querySelector(
                'button[type="submit"]'
            );

            if (submitButton) {
                const originalText = submitButton.textContent;

                submitButton.textContent = "Reservation Sent ✓";
                submitButton.disabled = true;

                setTimeout(() => {
                    reservationForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;

                    closeReservationModal();
                }, 1800);
            }
        });
    }


    /* =========================================================
       GALLERY LIGHTBOX
    ========================================================= */

    function initGallery() {
        if (!galleryItems.length || !lightbox || !lightboxImage) return;

        const lightboxClose = lightbox.querySelector(
            "#lightboxClose, .lightbox__close, .lightbox-close"
        );

        const lightboxOverlay = lightbox.querySelector(
            ".lightbox__overlay"
        );

        const closeLightbox = () => {
            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");

            setTimeout(() => {
                if (!lightbox.classList.contains("active")) {
                    lightboxImage.removeAttribute("src");
                    lightboxImage.alt = "";
                }
            }, 450);
        };

        galleryItems.forEach((item) => {
            item.addEventListener("click", (event) => {
                event.preventDefault();

                const image = item.querySelector("img");

                const imageSrc =
                    item.dataset.image ||
                    image?.currentSrc ||
                    image?.src;

                if (!imageSrc) return;

                lightboxImage.src = imageSrc;
                lightboxImage.alt = image?.alt || "";

                lightbox.classList.add("active");
                lightbox.setAttribute("aria-hidden", "false");
                document.body.classList.add("modal-open");

                if (typeof gsap !== "undefined") {
                    gsap.fromTo(
                        lightboxImage,
                        {
                            opacity: 0,
                            scale: 0.92
                        },
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 0.45,
                            ease: "power3.out"
                        }
                    );
                }
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();

                closeLightbox();
            });
        }

        if (lightboxOverlay) {
            lightboxOverlay.addEventListener("click", closeLightbox);
        }

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                lightbox.classList.contains("active")
            ) {
                closeLightbox();
            }
        });
    }


    /* =========================================================
       VIDEO MODAL
    ========================================================= */

    function initVideoModal() {
        if (!videoModal) return;

        const videoButtons = document.querySelectorAll(
            '[data-modal="video"], .play-btn'
        );

        const videoClose = videoModal.querySelector(
            "#videoModalClose, .video-modal__close, .modal-close"
        );

        const videoOverlay = videoModal.querySelector(
            ".video-modal__overlay"
        );

        const video = videoModal.querySelector("video");

        const openVideoModal = (event) => {
            event.preventDefault();

            videoModal.classList.add("active");
            videoModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");

            if (video) {
                video.currentTime = 0;

                const playPromise = video.play();

                if (playPromise) {
                    playPromise.catch(() => { });
                }
            }
        };

        const closeVideoModal = () => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }

            videoModal.classList.remove("active");
            videoModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
        };

        videoButtons.forEach((button) => {
            button.addEventListener("click", openVideoModal);
        });

        if (videoClose) {
            videoClose.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();

                closeVideoModal();
            });
        }

        if (videoOverlay) {
            videoOverlay.addEventListener(
                "click",
                closeVideoModal
            );
        }

        videoModal.addEventListener("click", (event) => {
            if (event.target === videoModal) {
                closeVideoModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                videoModal.classList.contains("active")
            ) {
                closeVideoModal();
            }
        });
    }


    function closeVideoModal() {
        if (!videoModal) return;

        const video = videoModal.querySelector("video");

        if (video) {
            video.pause();
        }

        videoModal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }


    /* =========================================================
       NEWSLETTER
    ========================================================= */

    function initNewsletter() {
        if (!newsletterForm) return;

        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const emailInput = newsletterForm.querySelector(
                'input[type="email"]'
            );

            const button = newsletterForm.querySelector("button");

            if (!emailInput || !button) return;

            const originalText = button.textContent;

            button.textContent = "Subscribed ✓";
            emailInput.value = "";

            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    }


    /* =========================================================
       BACK TO TOP
    ========================================================= */

    function initBackToTop() {
        if (!backToTop) return;

        const updateButton = () => {
            if (window.scrollY > 500) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        };

        window.addEventListener("scroll", updateButton, {
            passive: true
        });

        backToTop.addEventListener("click", () => {
            if (lenis) {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        });
    }


    /* =========================================================
       SMOOTH NAVIGATION
    ========================================================= */

    function initSmoothNavigation() {
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) return;

            link.addEventListener("click", (event) => {
                const target = document.querySelector(href);

                if (!target) return;

                event.preventDefault();

                if (lenis) {
                    lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.2
                    });
                } else {
                    target.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            });
        });
    }


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    function initActiveNavigation() {
        const sections = document.querySelectorAll("section[id]");

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const id = entry.target.id;

                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${id}`
                        );
                    });
                });
            },
            {
                threshold: 0.25,
                rootMargin: "-20% 0px -55% 0px"
            }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });
    }

    /* =========================================================
       GSAP — PAGE LOAD
    ========================================================= */

    function initPageLoadAnimation() {
        if (typeof gsap === "undefined") return;

        const heroContent = document.querySelector(".hero-content");
        const heroImage = document.querySelector(".hero");

        const timeline = gsap.timeline({
            defaults: {
                ease: "power3.out"
            }
        });

        if (heroImage) {
            timeline.from(heroImage, {
                scale: 1.08,
                duration: 1.8
            });
        }

        if (heroContent) {
            timeline.from(
                heroContent.children,
                {
                    opacity: 0,
                    y: 35,
                    duration: 0.8,
                    stagger: 0.12
                },
                "-=1"
            );
        }
    }


    /* =========================================================
       GSAP — SCROLL REVEALS
    ========================================================= */

    function initScrollAnimations() {
        if (
            typeof gsap === "undefined" ||
            typeof ScrollTrigger === "undefined"
        ) {
            return;
        }


        /* ABOUT */

        gsap.utils.toArray(".about-image").forEach((image) => {
            gsap.from(image, {
                x: -70,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: image,
                    start: "top 80%",
                    once: true
                }
            });
        });

        gsap.utils.toArray(".about-content").forEach((content) => {
            gsap.from(content.children, {
                x: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: content,
                    start: "top 80%",
                    once: true
                }
            });
        });


        /* SECTION HEADINGS */

        gsap.utils.toArray(".section-heading").forEach((heading) => {
            gsap.from(heading, {
                y: 45,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: heading,
                    start: "top 85%",
                    once: true
                }
            });
        });


        /* FEATURED FOOD */

        gsap.utils.toArray(".food-card").forEach((card, index) => {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                duration: 0.75,
                delay: index * 0.08,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    once: true
                }
            });
        });


        /* MENU */

        // gsap.utils.toArray(".menu-item").forEach((item) => {
        //     gsap.from(item, {
        //         y: 25,
        //         opacity: 0,
        //         duration: 0.6,
        //         ease: "power3.out",
        //         scrollTrigger: {
        //             trigger: item,
        //             start: "top 90%",
        //             once: true
        //         }
        //     });
        // });


        /* EXPERIENCE */

        const experienceSection = document.querySelector(
            ".experience-section"
        );

        if (experienceSection) {
            gsap.from(
                experienceSection.querySelectorAll(".experience-content"),
                {
                    x: -60,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: experienceSection,
                        start: "top 75%",
                        once: true
                    }
                }
            );
        }


        /* GALLERY */

        gsap.utils.toArray(".gallery-item").forEach((item, index) => {
            gsap.from(item, {
                scale: 0.92,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.08,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 88%",
                    once: true
                }
            });
        });


        /* RESERVATION */

        const reservationSection = document.querySelector(
            ".reservation-section"
        );

        if (reservationSection) {
            gsap.from(
                reservationSection.querySelectorAll(
                    ".reservation-content, .reservation-image"
                ),
                {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: reservationSection,
                        start: "top 75%",
                        once: true
                    }
                }
            );
        }


        /* CONTACT */

        gsap.utils.toArray(".contact-card").forEach((card, index) => {
            gsap.from(card, {
                y: 40,
                opacity: 0,
                duration: 0.7,
                delay: index * 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    once: true
                }
            });
        });


        /* IMAGE PARALLAX */

        gsap.utils.toArray(".parallax-image").forEach((image) => {
            gsap.to(image, {
                yPercent: -10,
                ease: "none",
                scrollTrigger: {
                    trigger: image,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });


        /* REFRESH */

        ScrollTrigger.refresh();
    }


    /* =========================================================
       HOVER IMAGE EFFECTS
    ========================================================= */

    function initHoverAnimations() {
        if (typeof gsap === "undefined") return;

        const cards = document.querySelectorAll(
            ".food-card, .gallery-item, .menu-item"
        );

        cards.forEach((card) => {
            const image = card.querySelector("img");

            if (!image) return;

            card.addEventListener("mouseenter", () => {
                gsap.to(image, {
                    scale: 1.06,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });
    }


    /* =========================================================
       PHASE 3 — CINEMATIC ANIMATIONS
    ========================================================= */

    function initCinematicAnimations() {
        if (
            typeof gsap === "undefined" ||
            typeof ScrollTrigger === "undefined"
        ) {
            return;
        }


        /* =========================================================
           HERO — CINEMATIC ENTRANCE
        ========================================================= */

        const hero = document.querySelector(".hero");

        if (hero) {
            const heroTitle = hero.querySelector("h1");
            const heroText = hero.querySelector("p");
            const heroButtons = hero.querySelectorAll(".btn");

            const heroTimeline = gsap.timeline({
                delay: 0.15
            });


            // Hero title
            if (heroTitle) {
                heroTimeline.from(heroTitle, {
                    y: 80,
                    opacity: 0,
                    scale: 0.97,
                    duration: 1.2,
                    ease: "power4.out"
                });
            }


            // Hero paragraph
            if (heroText) {
                heroTimeline.from(
                    heroText,
                    {
                        y: 25,
                        opacity: 0,
                        duration: 0.9,
                        ease: "power3.out"
                    },
                    "-=0.65"
                );
            }


            // Hero buttons
            if (heroButtons.length) {
                heroTimeline.from(
                    heroButtons,
                    {
                        y: 25,
                        opacity: 0,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: "power3.out"
                    },
                    "-=0.5"
                );
            }


            /* HERO PARALLAX */

            gsap.to(hero, {
                backgroundPosition: "50% 65%",
                ease: "none",
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }


        /* =========================================================
           SECTION HEADINGS
        ========================================================= */

        gsap.utils.toArray(".section-heading").forEach((heading) => {
            gsap.fromTo(
                heading,
                {
                    opacity: 0,
                    y: 40
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 82%",
                        once: true
                    }
                }
            );
        });


        /* =========================================================
           ABOUT — PREMIUM REVEAL
        ========================================================= */

        const aboutSection = document.querySelector(".about");

        if (aboutSection) {

            const aboutContent = aboutSection.querySelector(".about__content");
            const aboutVisual = aboutSection.querySelector(".about__visual");
            const mainImage = aboutSection.querySelector(".about__image--main");
            const smallImage = aboutSection.querySelector(".about__image--small");
            const experience = aboutSection.querySelector(".about__experience");


            /* ---------------------------------------------------------
               ABOUT TEXT
            --------------------------------------------------------- */

            if (aboutContent) {

                const contentElements = aboutContent.querySelectorAll(
                    ".section-label, .section-title, .about__lead, .about__text, .text-link"
                );

                gsap.from(contentElements, {
                    y: 45,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 75%",
                        once: true
                    }
                });
            }


            /* ---------------------------------------------------------
               MAIN IMAGE — CINEMATIC CLIP REVEAL
            --------------------------------------------------------- */

            if (mainImage) {

                gsap.fromTo(
                    mainImage,
                    {
                        clipPath: "inset(0 100% 0 0)",
                        opacity: 0
                    },
                    {
                        clipPath: "inset(0 0% 0 0)",
                        opacity: 1,
                        duration: 1.3,
                        ease: "power4.inOut",

                        scrollTrigger: {
                            trigger: aboutSection,
                            start: "top 75%",
                            once: true
                        }
                    }
                );


                /* Main image subtle zoom */

                const mainImg = mainImage.querySelector("img");

                if (mainImg) {

                    gsap.fromTo(
                        mainImg,
                        {
                            scale: 1.15
                        },
                        {
                            scale: 1,
                            duration: 1.5,
                            ease: "power3.out",

                            scrollTrigger: {
                                trigger: aboutSection,
                                start: "top 75%",
                                once: true
                            }
                        }
                    );
                }
            }


            /* ---------------------------------------------------------
               SMALL IMAGE
            --------------------------------------------------------- */

            if (smallImage) {

                gsap.fromTo(
                    smallImage,
                    {
                        y: 70,
                        opacity: 0,
                        scale: 0.94
                    },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        delay: 0.25,
                        ease: "power3.out",

                        scrollTrigger: {
                            trigger: aboutSection,
                            start: "top 70%",
                            once: true
                        }
                    }
                );


                /* Small image zoom */

                const smallImg = smallImage.querySelector("img");

                if (smallImg) {

                    gsap.fromTo(
                        smallImg,
                        {
                            scale: 1.12
                        },
                        {
                            scale: 1,
                            duration: 1.2,
                            delay: 0.25,
                            ease: "power3.out",

                            scrollTrigger: {
                                trigger: aboutSection,
                                start: "top 70%",
                                once: true
                            }
                        }
                    );
                }
            }


            /* ---------------------------------------------------------
               EXPERIENCE BADGE
            --------------------------------------------------------- */

            if (experience) {

                gsap.fromTo(
                    experience,
                    {
                        scale: 0.6,
                        opacity: 0,
                        rotation: -8
                    },
                    {
                        scale: 1,
                        opacity: 1,
                        rotation: 0,
                        duration: 0.8,
                        delay: 0.55,
                        ease: "back.out(1.7)",

                        scrollTrigger: {
                            trigger: aboutSection,
                            start: "top 70%",
                            once: true
                        }
                    }
                );
            }


            /* ---------------------------------------------------------
               ABOUT VISUAL — SUBTLE PARALLAX
            --------------------------------------------------------- */

            if (aboutVisual) {

                gsap.to(aboutVisual, {
                    yPercent: -5,
                    ease: "none",

                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        }

        /* =========================================================
   FEATURED FOOD — CINEMATIC REVEAL
========================================================= */

        const featuredFood = document.querySelector(".featured-food");

        if (featuredFood) {

            /* ---------------------------------------------------------
               SECTION HEADING
            --------------------------------------------------------- */

            const foodHeading = featuredFood.querySelector(
                ".section-heading"
            );

            if (foodHeading) {

                gsap.from(foodHeading.children, {
                    y: 45,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: featuredFood,
                        start: "top 75%",
                        once: true
                    }
                });
            }


            /* ---------------------------------------------------------
               FOOD CARDS
            --------------------------------------------------------- */

            const foodCards = featuredFood.querySelectorAll(
                ".food-card"
            );

            foodCards.forEach((card, index) => {

                const image = card.querySelector(
                    ".food-card__image"
                );

                const content = card.querySelector(
                    ".food-card__content"
                );

                const number = card.querySelector(
                    ".food-card__number"
                );


                /* Card entrance */

                gsap.from(card, {
                    y: 70,
                    opacity: 0,
                    duration: 0.9,
                    delay: index * 0.12,
                    ease: "power4.out",

                    scrollTrigger: {
                        trigger: featuredFood,
                        start: "top 70%",
                        once: true
                    }
                });


                /* Image reveal */

                if (image) {

                    gsap.fromTo(
                        image,
                        {
                            clipPath: "inset(0 0 100% 0)"
                        },
                        {
                            clipPath: "inset(0 0 0% 0)",
                            duration: 1.1,
                            delay: index * 0.12,
                            ease: "power4.inOut",

                            scrollTrigger: {
                                trigger: featuredFood,
                                start: "top 70%",
                                once: true
                            }
                        }
                    );


                    /* Image zoom */

                    const imageElement = image.querySelector("img");

                    if (imageElement) {

                        gsap.fromTo(
                            imageElement,
                            {
                                scale: 1.2
                            },
                            {
                                scale: 1.08,
                                duration: 1.4,
                                delay: index * 0.12,
                                ease: "power3.out",

                                scrollTrigger: {
                                    trigger: featuredFood,
                                    start: "top 70%",
                                    once: true
                                }
                            }
                        );
                    }
                }


                /* Content */

                if (content) {

                    gsap.from(content.children, {
                        y: 25,
                        opacity: 0,
                        duration: 0.65,
                        delay: 0.3 + index * 0.12,
                        stagger: 0.08,
                        ease: "power3.out",

                        scrollTrigger: {
                            trigger: featuredFood,
                            start: "top 70%",
                            once: true
                        }
                    });
                }


                /* Number */

                if (number) {

                    gsap.from(number, {
                        opacity: 0,
                        x: -20,
                        duration: 0.5,
                        delay: 0.4 + index * 0.12,
                        ease: "power2.out",

                        scrollTrigger: {
                            trigger: featuredFood,
                            start: "top 70%",
                            once: true
                        }
                    });
                }
            });


            ScrollTrigger.refresh();
        }


        /* =========================================================
           GALLERY — CONTAINER REVEAL
        ========================================================= */

        gsap.utils.toArray(".gallery-item").forEach((item, index) => {
            const image = item.querySelector("img");

            if (!image) return;

            // Gallery container
            gsap.fromTo(
                item,
                {
                    clipPath: "inset(12% 12% 12% 12%)",
                    opacity: 0
                },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    opacity: 1,
                    duration: 1,
                    delay: index * 0.08,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 88%",
                        once: true
                    }
                }
            );


            // Gallery image zoom
            gsap.fromTo(
                image,
                {
                    scale: 1.18
                },
                {
                    scale: 1,
                    duration: 1.4,
                    delay: index * 0.08,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 88%",
                        once: true
                    }
                }
            );
        });


        /* =========================================================
           RESERVATION — IMAGE REVEAL
        ========================================================= */

        const reservationImage = document.querySelector(
            ".reservation-image"
        );

        if (reservationImage) {
            gsap.fromTo(
                reservationImage,
                {
                    clipPath: "inset(0 0 0 100%)"
                },
                {
                    clipPath: "inset(0 0 0 0%)",
                    duration: 1.2,
                    ease: "power4.inOut",
                    scrollTrigger: {
                        trigger: reservationImage,
                        start: "top 80%",
                        once: true
                    }
                }
            );
        }


        /* =========================================================
           FOOTER — REVEAL
        ========================================================= */

        const footer = document.querySelector("footer");

        if (footer) {
            gsap.from(footer.children, {
                y: 30,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: footer,
                    start: "top 90%",
                    once: true
                }
            });
        }


        /* =========================================================
           REFRESH SCROLLTRIGGER
        ========================================================= */

        ScrollTrigger.refresh();
    }


    /* =========================================================
       REDUCED MOTION
    ========================================================= */

    function initReducedMotion() {
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        if (reducedMotion.matches && lenis) {
            lenis.stop();
        }
    }


    /* =========================================================
       INIT
    ========================================================= */

    initMobileMenu();
    initHeader();
    initMenuFilter();

    initReservationModal();
    initReservationForm();

    initGallery();
    initVideoModal();

    initNewsletter();
    initBackToTop();

    initSmoothNavigation();
    initActiveNavigation();

    initPageLoadAnimation();
    initScrollAnimations();
    initHoverAnimations();
    initCinematicAnimations();

    initReducedMotion();


    /* =========================================================
       CONSOLE
    ========================================================= */

    console.log(
        "%cRESTON",
        "font-size: 24px; font-weight: 700;"
    );

    console.log(
        "%cPremium restaurant experience loaded.",
        "font-size: 13px;"
    );
});