(() => {
  "use strict";
  const TASKS_KEY = "jarvis.tasks.v1", NOTES_KEY = "jarvis.notes.v1";
  const $ = id => document.getElementById(id);
  let tasks = [], chatHistory = [];
  try {
    const saved = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    tasks = Array.isArray(saved) ? saved.filter(t => t && typeof t.text === "string") : [];
  } catch {}
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
      checkbox.type = "checkbox"; checkbox.checked = Boolean(task.done);
      checkbox.setAttribute("aria-label", "Mark task complete");
      checkbox.addEventListener("change", () => { task.done = checkbox.checked; saveTasks(); });
      const label = document.createElement("span");
      label.className = "task-text"; label.textContent = task.text;
      const remove = document.createElement("button");
      remove.type = "button"; remove.className = "delete"; remove.textContent = "Delete";
      remove.addEventListener("click", () => { tasks = tasks.filter(t => t.id !== task.id); saveTasks(); });
      item.append(checkbox, label, remove); list.append(item);
    }
  }
  function saveTasks() { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); renderTasks(); }
  $("taskForm").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("taskInput"), value = input.value.trim();
    if (!value) return;
    tasks.unshift({id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), text:value, done:false});
    input.value = ""; saveTasks(); input.focus();
  });
  const notes = $("notes");
  try { notes.value = localStorage.getItem(NOTES_KEY) || ""; } catch {}
  notes.addEventListener("input", () => {
    try { localStorage.setItem(NOTES_KEY, notes.value); $("saveStatus").textContent = "Saved on this device"; }
    catch { $("saveStatus").textContent = "Could not save — browser storage may be full"; }
  });
  function addChatMessage(role, text) {
    const line = document.createElement("div");
    line.style.cssText = "padding:10px 12px;margin:8px 0;border-radius:10px;white-space:pre-wrap;line-height:1.55;font-size:13px;background:" + (role === "user" ? "#20334e" : "#142238") + ";color:#edf3ff;";
    line.textContent = (role === "user" ? "YOU\n" : "JARVIS\n") + text;
    $("chatMessages").append(line); $("chatMessages").scrollTop = $("chatMessages").scrollHeight;
  }
  $("askForm").addEventListener("submit", async event => {
    event.preventDefault();
    const input = $("askInput"), question = input.value.trim();
    if (!question) return;
    input.value = ""; addChatMessage("user", question);
    chatHistory.push({role:"user", text:question}); chatHistory = chatHistory.slice(-12);
    const button = $("askForm").querySelector("button"), status = $("answer");
    button.disabled = true; button.textContent = "Thinking…"; status.textContent = "JARVIS is thinking…";
    try {
      const response = await fetch("/api/chat", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({messages:chatHistory})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not reach Gemini.");
      chatHistory.push({role:"model", text:data.reply}); chatHistory = chatHistory.slice(-12);
      addChatMessage("model", data.reply); status.textContent = "Response received from Gemini.";
    } catch (error) {
      const message = error.message || "Something went wrong. Please try again.";
      addChatMessage("model", message); status.textContent = message;
    } finally { button.disabled = false; button.textContent = "Ask"; input.focus(); }
  });
  renderTasks();
})();