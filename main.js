console.log("Home Workout Generator ready!");

const exercises =  [
  "Push-ups",
  "Squats",
  "Lunges",
  "Jumping Jacks",
  "Plank",
  "Burpees",
  "Mountain Climbers",
  "High Knees",
  "Glute Bridges",
  "Tricep Dips",
  "Bicycle Crunches",
  "Russian Twists",
  "Calf Raises",
  "Wall Sit",
  "Superman Hold"
]

function getRandomExercise (count = 5) {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function displayWorkout() {
  const workoutList = document.getElementById("workout-list");
  workoutList.innerHTML = ""; // Ovo samo stavi placeholder ali zasto to kada vec imas list exercises. stavio sam "" da clearea sve previous exercises koji su bili generated.
  const ul = document.createElement("ul"); // lista izgleda bolje

  const selected = getRandomExercise();  //Funkcije se zvala getRandomExercises, ali pravo ime je getRandomExercise. Popravljeno

  selected.forEach(ex => {
    const li = document.createElement("li");
    li.textContent = ex;
    workoutList.appendChild(li);
  });
  workoutList.appendChild(ul)
}

document.getElementById("generate-btn").addEventListener("click", () => {
  displayWorkout();
});