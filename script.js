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

function updateProgress() {
  if (!habits.length) return;
  const completed = habits.filter(h => h.completed).length;
  const percent = Math.round((completed / habits.length) * 100);
  document.getElementById('progressFill').style.width = percent + '%';
  document.getElementById('progressPercent').textContent = percent + '%';
}
