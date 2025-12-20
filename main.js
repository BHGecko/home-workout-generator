console.log("Home Workout Generator ready!");

let currentWorkout = [];
let currentExerciseIndex = 0;
let workoutInProgress = false;
let isResting = false;
let isPreparing = false;
let workoutStartTime = null;

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        hamburger.classList.toggle("open");
    });
});

let selectedDifficulty = "easy";

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

const difficultySettings = {
    easy: { reps: 10, time: 20 },
    medium: { reps: 15, time: 30 },
    hard: { reps: 20, time: 40 }
};

const icons = {
    legs: "🦵",
    arms: "💪",
    abs: "🏋️‍♂️",
    cardio: "🔥",
    chest: "🫁",
    back: "🔙",
    fullbody: "💥"
};

function getFilters() {
    return {
        noLegs: document.getElementById("no-legs").checked,
        noArms: document.getElementById("no-arms").checked,
        noCardio: document.getElementById("no-cardio").checked,
        noAbs: document.getElementById("no-abs").checked
    };
}

document.querySelectorAll(".filters label").forEach(label => {
    const checkbox = label.querySelector("input");
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) label.classList.add("active");
        else label.classList.remove("active");
    });
});

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

function buildWorkout(selectedExercises, difficulty) {
    return selectedExercises.map(ex => {
        if (ex.type === "reps") {
            return {
                name: ex.name,
                tags: ex.tags,
                info: `${difficultySettings[difficulty].reps} reps`,
                type: "reps"
            };
        } else {
            return {
                name: ex.name,
                tags: ex.tags,
                info: `${difficultySettings[difficulty].time} seconds`,
                type: "time",
                duration: difficultySettings[difficulty].time
            };
        }
    });
}

function displayWorkout() {
if (workoutInProgress) return;
    const startBtn = document.getElementById("start-workout-btn");
    if (startBtn) startBtn.style.display = "none";
    const workoutList = document.getElementById("workout-list");

    workoutInProgress = false;
    currentWorkout = [];
    currentExerciseIndex = 0;

    workoutList.innerHTML = "";

    const rawExercises = getRandomExercise();
    const workout = buildWorkout(rawExercises, selectedDifficulty);

    currentWorkout = workout;
    currentExerciseIndex = 0;
    const ul = document.createElement("ul");

    if (workout.length === 0) {
        workoutList.innerHTML = `<p style="color:red">No exercises match your filters!</p>`;
        return;
    }

    let totalSeconds = 0;

    workout.forEach((ex, index) => {
        const li = document.createElement("li");

        let details = "";
        let exTime = 0;

        if (ex.type === "time") {
            exTime = ex.duration;
        } else {
            exTime = difficultySettings[selectedDifficulty].reps * 3;
        }

        totalSeconds += exTime;

        const tagIcons = ex.tags.map(t => icons[t] || "").join(" ");

        const timeString =
            exTime < 60 ? `${exTime}s` : `${Math.round(exTime / 60)} min`;

        li.innerHTML = `
            <span class="exercise-icons">${tagIcons}</span>
            ${ex.name} — ${ex.info}
        `;

        li.style.opacity = "0";
        li.style.animation = "workoutItemFadeIn 0.45s ease forwards";
        li.style.animationDelay = `${index * 150}ms`;

        ul.appendChild(li);

    });
    workoutList.appendChild(ul);

    if (startBtn && !workoutInProgress) startBtn.style.display = "inline-block";
    else if (startBtn) {
        startBtn.style.display = "none";
    }

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

function startWorkout() {
    const startBtn = document.getElementById("start-workout-btn");
    workoutInProgress = true;
    workoutStartTime = Date.now();

    if (startBtn) startBtn.style.display = "none";

    isPreparing = true;
    showCurrentExercise();
}

function showCurrentExercise() {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = "";

    if (currentExerciseIndex >= currentWorkout.length) {
        workoutInProgress = false;
        isResting = false;
        const durationMs = Date.now() - workoutStartTime;
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);

        workoutList.innerHTML = `
            <h2>🎉 Workout Complete!</h2>
            <p>⏱️ Time: ${minutes}m ${seconds}s</p>
            <p>🏋️ Exercises: ${currentWorkout.length}</p>
            <p>🔥 Difficulty: ${selectedDifficulty}</p>
        `;

        document
            .getElementById("new-workout-btn")
            .addEventListener("click", () => {
                workoutInProgress = false;
                isResting = false;
                isPreparing = false;
                displayWorkout();
            });
        return;
    }

    if (isPreparing) {
        let prepTime = 5;

        workoutList.innerHTML = `
            <h2>⏳ Get Ready</h2>
            <p>Starting in ${prepTime}...</p>
        `;

        const interval = setInterval(() => {
            prepTime--;
            workoutList.querySelector("p").textContent = 
                `Starting in ${prepTime}...`;
            
            if (prepTime <= 0) {
                clearInterval(interval);
                isPreparing = false;
                showCurrentExercise();
            }         
        }, 1000);

        return;
    }

    if (isResting) {
        let restTime = 30;

        workoutList.innerHTML = `
            <h2>🧘 Rest</h2>
            <p>⏱️ ${restTime} seconds</p>
            <button id="skip-rest-btn">Skip Rest</button>
        `;

        const interval = setInterval(() => {
            restTime--;
            workoutList.querySelector("p").textContent =
                `⏱️ ${restTime} seconds`;

            if (restTime <= 0) {
                clearInterval(interval);
                isResting = false;
                isPreparing = true;
                showCurrentExercise();
            }
        }, 1000);

        document
            .getElementById("skip-rest-btn")
            .addEventListener("click", () => {
                clearInterval(interval);
                isResting = false;
                isPreparing = true;
                showCurrentExercise();
            });

        return;
    }

    const ex = currentWorkout[currentExerciseIndex];
    const tagIcons = ex.tags.map(t => icons[t] || "").join(" ");

    if (ex.type === "time") {
        let remaining = ex.duration;

        workoutList.innerHTML = `
            <h2>${tagIcons} ${ex.name}</h2>
            <p>⏱️ ${remaining} seconds</p>
        `;

        const interval = setInterval(() => {
            remaining--;
            workoutList.querySelector("p").textContent =
                `⏱️ ${remaining} seconds`;

            if (remaining <= 0) {
                clearInterval(interval);
                currentExerciseIndex++;
                if (currentExerciseIndex < currentWorkout.length) {
                    isResting = true;
                }
                showCurrentExercise();
            }
        }, 1000);

        return;
    }

    workoutList.innerHTML = `
        <h2>${tagIcons} ${ex.name}</h2>
        <p>${ex.info}</p>
        <button id="next-exercise-btn">Next Exercise</button>
    `;

    document.getElementById("next-exercise-btn").addEventListener("click", () => {
        currentExerciseIndex++;
        if (currentExerciseIndex < currentWorkout.length) {
            isResting = true;
        }
        showCurrentExercise();
    });
}


document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        selectedDifficulty = btn.dataset.level;

        document.querySelectorAll(".difficulty-btn").forEach(b =>
            b.classList.remove("active")
        );
        btn.classList.add("active");
    });
});

document.getElementById('download-btn').addEventListener('click', () => {
    const workoutList = document.getElementById('workout-list').innerText;
    const blob = new Blob([workoutList], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'workout.txt';
    link.click();
});

document.querySelector('[data-level="easy"]').classList.add("active");

document.getElementById("generate-btn").addEventListener("click", displayWorkout);

window.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("workout-list");
    list.style.opacity = "1";
});

document
    .getElementById("start-workout-btn")
    ?.addEventListener("click", startWorkout);