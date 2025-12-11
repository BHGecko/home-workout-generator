console.log("Home Workout Generator ready!");

// =====================================
// Difficulty state
// =====================================
let selectedDifficulty = "easy";

// =====================================
// EXERCISE DATABASE
// =====================================
const exercises = {
    easy: [
        { name: "Wall Sit", tags: ["legs"], type: "time" },
        { name: "Glute Bridges", tags: ["legs"], type: "reps" },
        { name: "Calf Raises", tags: ["legs"], type: "reps" },
        { name: "Plank (easy)", tags: ["abs"], type: "time" },
        { name: "Superman Hold", tags: ["back", "abs"], type: "time" },
        { name: "Light Jog in Place", tags: ["cardio"], type: "time" }
    ],
    medium: [
        { name: "Push-ups", tags: ["arms", "chest"], type: "reps" },
        { name: "Squats", tags: ["legs"], type: "reps" },
        { name: "Lunges", tags: ["legs"], type: "reps" },
        { name: "Bicycle Crunches", tags: ["abs"], type: "reps" },
        { name: "Russian Twists", tags: ["abs"], type: "reps" },
        { name: "Tricep Dips", tags: ["arms"], type: "reps" }
    ],
    hard: [
        { name: "Burpees", tags: ["cardio", "fullbody"], type: "reps" },
        { name: "Mountain Climbers", tags: ["cardio", "abs"], type: "time" },
        { name: "Jumping Jacks", tags: ["cardio"], type: "time" },
        { name: "High Knees", tags: ["cardio", "legs"], type: "time" },
        { name: "Plank (hard)", tags: ["abs"], type: "time" },
        { name: "Jump Squats", tags: ["legs"], type: "reps" }
    ]
};

// =====================================
// ICONS
// =====================================
const icons = {
    legs: "🦵",
    arms: "💪",
    abs: "🏋️‍♂️",
    cardio: "🔥",
    chest: "🫁",
    back: "🔙",
    fullbody: "💥"
};

// =====================================
// FILTERS
// =====================================
function getFilters() {
    return {
        noLegs: document.getElementById("no-legs").checked,
        noArms: document.getElementById("no-arms").checked,
        noCardio: document.getElementById("no-cardio").checked,
        noAbs: document.getElementById("no-abs").checked
    };
}

// Glow active filter labels
document.querySelectorAll(".filters label").forEach(label => {
    const checkbox = label.querySelector("input");
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) label.classList.add("active");
        else label.classList.remove("active");
    });
});

// =====================================
// RANDOM SELECTOR
// =====================================
function getRandomExercise(count = 5) {
    const filters = getFilters();
    const list = exercises[selectedDifficulty];

    const filtered = list.filter(ex => {
        if (filters.noLegs && ex.tags.includes("legs")) return false;
        if (filters.noArms && ex.tags.includes("arms")) return false;
        if (filters.noCardio && ex.tags.includes("cardio")) return false;
        if (filters.noAbs && ex.tags.includes("abs")) return false;
        return true;
    });

    if (filtered.length === 0) return [];

    return [...filtered].sort(() => Math.random() - 0.5).slice(0, count);
}

// =====================================
// VALUE RANGES & RANDOMIZER
// =====================================
function getRepRange(difficulty) {
    if (difficulty === "easy") return [8, 12];
    if (difficulty === "medium") return [12, 18];
    return [18, 25];
}

function getTimeRange(difficulty) {
    if (difficulty === "easy") return [20, 35];
    if (difficulty === "medium") return [30, 45];
    return [40, 60];
}

function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRepsAndSets(level) {
    const [min, max] = getRepRange(level);
    const reps = randomInRange(min, max);
    const sets = level === "easy" ? 2 : level === "hard" ? 4 : 3;
    return { reps, sets };
}

function generateTime(level) {
    const [min, max] = getTimeRange(level);
    return randomInRange(min, max);
}

// =====================================
// MAIN RENDER FUNCTION
// =====================================
function displayWorkout() {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = "";

    const selected = getRandomExercise();
    const ul = document.createElement("ul");

    if (selected.length === 0) {
        workoutList.innerHTML = `<p style="color:red">No exercises match your filters!</p>`;
        return;
    }

    let totalSeconds = 0;

    selected.forEach((ex, index) => {
        const li = document.createElement("li");

        let details = "";
        let exTime = 0;

        if (ex.type === "reps") {
            const { reps, sets } = generateRepsAndSets(selectedDifficulty);
            details = `${reps} reps × ${sets} sets`;
            exTime = reps * 2 * sets + (sets - 1) * 10;
        } else {
            const secs = generateTime(selectedDifficulty);
            details = "Time"; // PREVENTS DUPLICATION
            exTime = secs;
        }

        totalSeconds += exTime;

        const tagIcons = ex.tags.map(t => icons[t] || "").join(" ");

        const timeString =
            exTime < 60 ? `${exTime}s` : `${Math.round(exTime / 60)} min`;

        li.innerHTML = `
            <span class="exercise-icons">${tagIcons}</span>
            ${ex.name} — ${details} — ${timeString}
        `;

        li.style.opacity = "0";
        li.style.animation = "workoutItemFadeIn 0.45s ease forwards";
        li.style.animationDelay = `${index * 120}ms`;

        ul.appendChild(li);
    });

    workoutList.appendChild(ul);

    const totalTime = document.createElement("p");
    const tStr =
        totalSeconds < 60
            ? `${totalSeconds}s`
            : `${Math.round(totalSeconds / 60)} min`;
    totalTime.textContent = `Total Estimated Time: ${tStr}`;
    totalTime.classList.add("total-time");

    workoutList.appendChild(totalTime);

    workoutList.classList.add("active");
}

// =====================================
// Event listeners
// =====================================
document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        selectedDifficulty = btn.dataset.level;

        document.querySelectorAll(".difficulty-btn").forEach(b =>
            b.classList.remove("active")
        );
        btn.classList.add("active");
    });
});

document.querySelector('[data-level="easy"]').classList.add("active");

document.getElementById("generate-btn").addEventListener("click", displayWorkout);

window.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("workout-list");
    list.style.opacity = "1";
});
