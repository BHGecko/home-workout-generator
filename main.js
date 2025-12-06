console.log("Home Workout Generator ready!");

let selectedDifficulty = "easy"; // defaultna tezina workouta

const exercises = {
  easy: [
    "Wall Sit",
    "Glute Bridges",
    "Calf Raises",
    "Plank (easy)",
    "Superman Hold",
    "Light Jog in Place"
  ],
  medium: [
    "Push-ups",
    "Squats",
    "Lunges",
    "Bicycle Crunches",
    "Russian Twists",
    "Tricep Dips"
  ],
  hard: [
    "Burpees",
    "Mountain Climbers",
    "Jumping Jacks",
    "High Knees",
    "Plank (hard)",
    "Jump Squats"
  ]
};

function getRandomExercise(count = 5) {
    const list = exercises[selectedDifficulty];
    const shuffled = [...list].sort(() => Math.random() - 0.5);
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

function displayWorkout() {
  const workoutList = document.getElementById("workout-list");
  workoutList.innerHTML = ""; 
  const ul = document.createElement("ul"); 

  const selected = getRandomExercise(); 

  selected.forEach(ex => {
    const li = document.createElement("li");

    const { reps, sets } = generateRepsAndSets(selectedDifficulty);

    li.textContent = `${ex} — ${reps} reps × ${sets} sets`;
    ul.appendChild(li); 
  });

  workoutList.appendChild(ul);
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

document.getElementById("generate-btn").addEventListener("click", () => {
  displayWorkout();
});
