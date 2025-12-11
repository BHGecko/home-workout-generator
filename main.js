console.log("Home Workout Generator ready!");

let selectedDifficulty = "easy"; // default

const exercises = {
    easy: [
        { name: "Wall Sit", tags: ["legs"] },
        { name: "Glute Bridges", tags: ["legs"] },
        { name: "Calf Raises", tags: ["legs"] },
        { name: "Plank (easy)", tags: ["abs"] },
        { name: "Superman Hold", tags: ["back", "abs"] },
        { name: "Light Jog in Place", tags: ["cardio"] }
    ],
    medium: [
        { name: "Push-ups", tags: ["arms", "chest"] },
        { name: "Squats", tags: ["legs"] },
        { name: "Lunges", tags: ["legs"] },
        { name: "Bicycle Crunches", tags: ["abs"] },
        { name: "Russian Twists", tags: ["abs"] },
        { name: "Tricep Dips", tags: ["arms"] }
    ],
    hard: [
        { name: "Burpees", tags: ["cardio", "fullbody"] },
        { name: "Mountain Climbers", tags: ["cardio", "abs"] },
        { name: "Jumping Jacks", tags: ["cardio"] },
        { name: "High Knees", tags: ["cardio", "legs"] },
        { name: "Plank (hard)", tags: ["abs"] },
        { name: "Jump Squats", tags: ["legs"] }
    ]
};

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

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function getRepRange(difficulty) {
    if (difficulty === "easy") return [8, 12];
    if (difficulty === "medium") return [12, 18];
    if (difficulty === "hard") return [18, 25];
}

function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRepsAndSets(difficulty) {
    const [min, max] = getRepRange(difficulty);
    const reps = randomInRange(min, max);

    let sets = 3;
    if (difficulty === "easy") sets = 2;
    if (difficulty === "hard") sets = 4;

    return { reps, sets };
}

function getFilters() {
    return {
        noLegs: document.getElementById("no-legs").checked,
        noArms: document.getElementById("no-arms").checked,
        noCardio: document.getElementById("no-cardio").checked,
        noAbs: document.getElementById("no-abs").checked
    };
}

const icons = {
    legs: "🦵",
    arms: "💪",
    abs: "🏋️‍♂️",
    cardio: "🔥",
    chest: "🫁",
    back: "🔙",
    fullbody: "💥"
};

function displayWorkout() {
    const workoutList = document.getElementById("workout-list");

    // Clear old content
    workoutList.innerHTML = "";
    workoutList.classList.remove("active");

    const ul = document.createElement("ul");
    const selected = getRandomExercise();

    if (selected.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No exercises available with the selected filters!";
        msg.style.color = "red";
        workoutList.appendChild(msg);

        // Trigger animation AFTER content
        requestAnimationFrame(() => workoutList.classList.add("active"));
        return;
    }

    let totalSeconds = 0;

    selected.forEach((ex, index) => {
        const li = document.createElement("li");

        const { reps, sets } = generateRepsAndSets(selectedDifficulty);

        const secondsPerRep = 2;
        const restTime = 10;
        const exerciseTime = (reps * secondsPerRep * sets) + restTime * (sets - 1);

        totalSeconds += exerciseTime;

        const timeString = exerciseTime < 60
            ? `${exerciseTime}s`
            : `${Math.round(exerciseTime / 60)} min`;

        const tagIcons = ex.tags.map(t => icons[t] || "").join(" ");

        li.innerHTML = `
        <span class="exercise-icons">${tagIcons}</span>
        ${ex.name} — ${reps} reps × ${sets} sets — ${timeString}
        `;

        li.style.opacity = "0";
        li.style.animation = "workoutItemFadeIn 0.45s ease forwards";
        li.style.animationDelay = `${index * 120}ms`

        ul.appendChild(li);
    });

    workoutList.appendChild(ul);

    const totalTimeString =
        totalSeconds < 60
            ? `${totalSeconds}s`
            : `${Math.round(totalSeconds / 60)} min`;

    const totalTimeP = document.createElement("p");
    totalTimeP.textContent = `Total Estimated Time: ${totalTimeString}`;
    totalTimeP.classList.add("total-time");

    workoutList.appendChild(totalTimeP);

    // ❤️ FIX: trigger animation only AFTER content is inserted
    requestAnimationFrame(() => workoutList.classList.add("active"));

    requestAnimationFrame(() => {
        const fullHeight = workoutList.scrollHeight;

        workoutList.classList.add("animating");
        workoutList.style.maxHeight = fullHeight + "px";
        workoutList.style.opacity = "1",

        setTimeout(() => {
            workoutList.classList.remove("animating");
            workoutList.style.maxHeight = "1000px";
        }, 500);
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

document.querySelector('[data-level="easy"]').classList.add("active");

document.getElementById("generate-btn").addEventListener("click", displayWorkout);
document.getElementById("download-btn").addEventListener("click", downloadWorkout);

function downloadWorkout() {
    const lis = document.querySelectorAll("#workout-list li");

    if (lis.length === 0) {
        alert("Generate a workout first!");
        return;
    }

    let text = "Home Workout Plan:\n\n";

    lis.forEach(li => {
        text += li.textContent + "\n";
    });

    const totalP = document.querySelector("#workout-list p.total-time");
    if (totalP) text += "\n" + totalP.textContent;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "workout.txt";
    a.click();

    URL.revokeObjectURL(url);
}

document.querySelectorAll(".filters label").forEach(label => {
    const checkbox = label.querySelector("input");

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            label.classList.add("active");
        } else {
            label.classList.remove("active");
        }
    });
});

window.addEventListener("DOMContentLoaded", () => {
    const workoutList = document.getElementById("workout-list");
    workoutList.style.opacity = "1"; 
});