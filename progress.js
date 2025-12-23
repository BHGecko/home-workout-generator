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
        if (window.innerWidth > 768) closeMenu();
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const progressList = document.getElementById("progress-list");
    const totalWorkoutsEl = document.getElementById("total-workouts");
    const totalMinutesEl = document.getElementById("total-minutes");
    const streakEl = document.getElementById("streak-count");
    const streakHeroNumber = document.getElementById("streak-number");

    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

    let totalMinutes = 0;
    workouts.forEach(w => {
        totalMinutes += w.totalTime || 0;
    });

    // --- STREAK CALCULATION ---
    let currentStreak = 0;
    let dateCursor = new Date();
    dateCursor.setHours(0,0,0,0);

    while(workouts.some(w => new Date(w.date).setHours(0,0,0,0) === dateCursor.getTime())) {
        currentStreak++;
        dateCursor.setDate(dateCursor.getDate() - 1);
    }

    // Update streak hero
    if (streakHeroNumber) streakHeroNumber.textContent = currentStreak;

    // Update the other stats
    totalWorkoutsEl.textContent = workouts.length;
    totalMinutesEl.textContent = totalMinutes;
    streakEl.textContent = currentStreak;

    // Render workout history
    if (workouts.length === 0) {
        progressList.innerHTML = "<li>No workouts yet.</li>";
    } else {
        workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
        progressList.innerHTML = workouts.map(w => {
            const date = new Date(w.date);
            const timeStr = w.totalTime < 60 ? `${w.totalTime}s` : `${Math.round(w.totalTime/60)}m`;
            return `<li>
                <span>${date.toLocaleDateString()}</span>
                <span>${timeStr} • ${w.exercises.length} exercises • ${w.difficulty}</span>
            </li>`;
        }).join("");
    }

    // Render saved workouts if you have that function
    if (typeof renderSavedWorkouts === "function") renderSavedWorkouts();
});
