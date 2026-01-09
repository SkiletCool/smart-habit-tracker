/*
  Smart Habit Tracker
  Fully functional, vanilla JS, modular and clean
*/

const habitListEl = document.getElementById('habitList');
const habitNameInput = document.getElementById('habitName');
const habitColorInput = document.getElementById('habitColor');
const addHabitBtn = document.getElementById('addHabitBtn');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const themeToggle = document.getElementById('themeToggle');

let habits = [];
const STORAGE_KEY = 'smart-habits';
const THEME_KEY = 'smart-theme';

const today = () => new Date().toISOString().split('T')[0];

/* ---------- Storage ---------- */
function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function loadHabits() {
  const data = localStorage.getItem(STORAGE_KEY);
  habits = data ? JSON.parse(data) : [];
}

/* ---------- Habit logic ---------- */
function addHabit() {
  const name = habitNameInput.value.trim();
  if (!name) return;

  habits.push({
    id: crypto.randomUUID(),
    name,
    color: habitColorInput.value,
    completedDates: []
  });

  habitNameInput.value = '';
  saveHabits();
  render();
}

function toggleComplete(id) {
  const habit = habits.find(h => h.id === id);
  const date = today();

  if (habit.completedDates.includes(date)) {
    habit.completedDates = habit.completedDates.filter(d => d !== date);
  } else {
    habit.completedDates.push(date);
  }

  saveHabits();
  render();
}

function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id);
  saveHabits();
  render();
}

/* ---------- Calculations ---------- */
function calculateStreak(habit) {
  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (habit.completedDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function updateProgress() {
  if (habits.length === 0) {
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';
    return;
  }

  const completedToday = habits.filter(h =>
    h.completedDates.includes(today())
  ).length;

  const percent = Math.round((completedToday / habits.length) * 100);
  progressFill.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
}

/* ---------- Rendering ---------- */
function render() {
  habitListEl.innerHTML = '';

  habits.forEach(habit => {
    const completed = habit.completedDates.includes(today());
    const streak = calculateStreak(habit);

    const card = document.createElement('div');
    card.className = 'habit-card';

    card.innerHTML = `
      <div class="habit-header">
        <span class="habit-name ${completed ? 'completed' : ''}">
          ${habit.name}
        </span>
        <div class="habit-actions">
          <button title="Mark completed">✅</button>
          <button title="Delete">🗑️</button>
        </div>
      </div>
      <div class="habit-footer">
        <span>🔥 ${streak} day streak</span>
        <span style="color:${habit.color}">●</span>
      </div>
    `;

    const [completeBtn, deleteBtn] = card.querySelectorAll('button');
    completeBtn.onclick = () => toggleComplete(habit.id);
    deleteBtn.onclick = () => deleteHabit(habit.id);

    habitListEl.appendChild(card);
  });

  updateProgress();
}

/* ---------- Theme ---------- */
function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme === 'dark') document.body.classList.add('dark');
}

themeToggle.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem(
    THEME_KEY,
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );
};

/* ---------- Initialization ---------- */
addHabitBtn.onclick = addHabit;

loadTheme();
loadHabits();
render();
