// Smart Habit Tracker JS (initial setup)
const habitListEl = document.createElement('div');
habitListEl.id = 'habitList';
document.querySelector('.container').appendChild(habitListEl);

let habits = [];

function render() {
  habitListEl.innerHTML = '';
  habits.forEach(habit => {
    const card = document.createElement('div');
    card.textContent = habit.name;
    habitListEl.appendChild(card);
  });
}

document.getElementById('addHabitBtn').onclick = () => {
  const name = document.getElementById('habitName').value.trim();
  if (!name) return;
  habits.push({ name });
  document.getElementById('habitName').value = '';
  render();
};
