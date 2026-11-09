(() => {
  "use strict";
  const TASKS_KEY = "jarvis.tasks.v1";
  const NOTES_KEY = "jarvis.notes.v1";
  const $ = (id) => document.getElementById(id);
  let tasks = [];
  try {
    const saved = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    tasks = Array.isArray(saved) ? saved.filter(t => t && typeof t.text === "string") : [];
  } catch { tasks = []; }

  function saveTasks() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    renderTasks();
  }
  function renderTasks() {
    const list = $("taskList");
    list.replaceChildren();
    $("taskEmpty").hidden = tasks.length > 0;
    $("totalCount").textContent = String(tasks.length);
    $("doneCount").textContent = String(tasks.filter(t => t.done).length);
    $("remainingCount").textContent = String(tasks.filter(t => !t.done).length);
    for (const task of tasks) {
      const item = document.createElement("li");
      item.className = "task" + (task.done ? " done" : "");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(task.done);
      checkbox.setAttribute("aria-label", "Mark task complete");
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        saveTasks();
      });
      const label = document.createElement("span");
      label.className = "task-text";
      label.textContent = task.text;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete";
      remove.textContent = "Delete";
      remove.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
      });
      item.append(checkbox, label, remove);
      list.append(item);
    }
  }

  $("taskForm").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("taskInput");
    const text = input.value.trim();
    if (!text) return;
    tasks.unshift({ id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())), text, done: false });
    input.value = "";
    saveTasks();
    input.focus();
  });

  const notes = $("notes");
  try { notes.value = localStorage.getItem(NOTES_KEY) || ""; } catch {}
  notes.addEventListener("input", () => {
    try {
      localStorage.setItem(NOTES_KEY, notes.value);
      $("saveStatus").textContent = "Saved on this device";
    } catch {
      $("saveStatus").textContent = "Could not save — browser storage may be full";
    }
  });

  $("askForm").addEventListener("submit", event => {
    event.preventDefault();
    const question = $("askInput").value.trim().toLowerCase();
    if (!question) return;
    let response = "I’m currently a dashboard prototype. I can save tasks and project notes in this browser, but I cannot yet reason with an AI model or control connected apps.";
    if (question.includes("task")) response = "I can add tasks, mark them complete, delete them, and keep them saved in this browser on this device.";
    else if (question.includes("note")) response = "Use the Project notes area. It saves automatically in this browser on this device.";
    else if (question.includes("uplika") || question.includes("instagram") || question.includes("youtube")) response = "Those services are not connected. We’ll only add an integration after checking its supported permissions and requiring approval before publishing.";
    else if (question.includes("do") || question.includes("help") || question.includes("capability")) response = "Right now I can organize a local task list and notes. The AI brain, voice, cloud memory, and app integrations are future milestones.";
    $("answer").textContent = response;
    $("askInput").value = "";
  });

  renderTasks();
})();