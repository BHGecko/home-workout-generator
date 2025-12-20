// Navbar mobile menu logic with backdrop blur + scrollbar compensation

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const backdrop = document.getElementById("menu-backdrop");

    if (!hamburger || !navLinks || !backdrop) return;

    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    function lockScroll() {
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.overflow = "hidden";

        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
    }

    function unlockScroll() {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
    }

    function openMenu() {
        hamburger.classList.add("open");
        navLinks.classList.add("open");
        backdrop.classList.add("active");
        lockScroll();
    }

    function closeMenu() {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
        backdrop.classList.remove("active");
        unlockScroll();
    }

    function toggleMenu() {
        navLinks.classList.contains("open") ? closeMenu() : openMenu();
    }

    hamburger.addEventListener("click", toggleMenu);
    backdrop.addEventListener("click", closeMenu);

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // animate once
            }
        });
    },
    {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
    }
);

revealElements.forEach(el => revealObserver.observe(el));