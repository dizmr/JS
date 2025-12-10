let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskDeadline = document.getElementById('taskDeadline');
const calendar = document.getElementById('calendar');
const quoteText = document.getElementById('quoteText');
const clearBtn = document.getElementById('clearTasks');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderCalendar() {
  calendar.innerHTML = '';

  const tasksByDate = {};
  tasks.forEach(t => {
    if (!tasksByDate[t.date]) tasksByDate[t.date] = [];
    tasksByDate[t.date].push(t);
  });

  const dates = Object.keys(tasksByDate).sort();

  dates.forEach(date => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    dayDiv.innerHTML = `<h3>${date}</h3>`;

    tasksByDate[date].forEach((task, index) => {
      const li = document.createElement('div');
      li.className = 'taskItem';
      if (task.done) li.classList.add('done');
      li.innerHTML = `
        <span>date: ${task.date}</span>
        <span>task: ${task.name}</span>
        <span>deadline: ${task.deadline}</span>
        <div class="buttons">
          <button data-date="${date}" data-index="${index}" class="deleteBtn">del</button>
          <button data-date="${date}" data-index="${index}" class="doneBtn">done</button>
        </div>
      `;
      dayDiv.appendChild(li);
    });

    calendar.appendChild(dayDiv);
  });
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = taskInput.value.trim();
  const date = taskDate.value;
  const deadline = taskDeadline.value;

  if (!name || !date || !deadline) return alert('Заповніть усі поля!');
  tasks.push({ name, date, deadline, done: false });
  saveTasks();
  renderCalendar();
  taskForm.reset();
});

calendar.addEventListener('click', e => {
  const date = e.target.dataset.date;
  const index = parseInt(e.target.dataset.index);

  if (e.target.classList.contains('deleteBtn')) {
    const tasksOnDate = tasks.filter(t => t.date === date);
    const taskToDelete = tasksOnDate[index];
    const globalIndex = tasks.findIndex(t => t.name === taskToDelete.name && t.date === taskToDelete.date && t.deadline === taskToDelete.deadline);
    tasks.splice(globalIndex, 1);
    saveTasks();
    renderCalendar();
  }

  if (e.target.classList.contains('doneBtn')) {
    const tasksOnDate = tasks.filter(t => t.date === date);
    const taskToMark = tasksOnDate[index];
    const globalIndex = tasks.findIndex(t => t.name === taskToMark.name && t.date === taskToMark.date && t.deadline === taskToMark.deadline);
    tasks[globalIndex].done = !tasks[globalIndex].done;
    saveTasks();
    renderCalendar();
  }
});

clearBtn.addEventListener('click', () => {
  if (confirm("Ви дійсно хочете очистити всі задачі?")) {
    tasks = [];
    saveTasks();
    renderCalendar();
  }
});

renderCalendar();

async function fetchQuote() {
  try {
    const res = await fetch('https://api.quotable.io/random');
    const data = await res.json();
    quoteText.textContent = `"${data.content}" — ${data.author}`;
  } catch(err) {
    const fallback = [
      "Дій, навіть якщо боїшся — невдача не страшна.",
      "Крок за кроком — і ти дійдеш до мети.",
      "Мрії збуваються для тих, хто працює."
    ];
    const random = fallback[Math.floor(Math.random() * fallback.length)];
    quoteText.textContent = random;
  }
}

fetchQuote();
