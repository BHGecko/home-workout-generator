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
  workoutList.innerHTML = "";

  const selected = getRandomExercises();

  selected.forEach(ex => {
    const li = document.createElement("li");
    li.textContent = ex;
    workoutList.appendChild(li);
  });
}

document.getElementById("generate-btn").addEventListener("click", () => {
  displayWorkout();
});