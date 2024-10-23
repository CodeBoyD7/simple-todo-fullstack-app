// client/script.js

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Fetch and display tasks
async function fetchTasks() {
  const response = await fetch("http://localhost:5000/api/tasks");
  const tasks = await response.json();
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    addTaskToDOM(task);
  });
}

// Add task to DOM
function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.textContent = task.title;
  if (task.completed) {
    li.classList.add("completed");
  }

  // Edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.onclick = () => editTask(task._id);

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = () => deleteTask(task._id);

  // Complete button
  const completeButton = document.createElement("button");
  completeButton.textContent = task.completed ? "Incomplete" : "Complete";
  completeButton.onclick = () => toggleComplete(task._id, completeButton, li);

  li.appendChild(editButton);
  li.appendChild(deleteButton);
  li.appendChild(completeButton);
  taskList.appendChild(li);
}

// Add new task
taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const taskTitle = taskInput.value;
  const response = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: taskTitle }),
  });
  const newTask = await response.json();
  addTaskToDOM(newTask);
  taskInput.value = "";
});

// Edit task
async function editTask(id) {
  const newTitle = prompt("Edit task title:");
  if (newTitle) {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    });
    fetchTasks();
  }
}

// Delete task
async function deleteTask(id) {
  await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "DELETE",
  });
  fetchTasks();
}

// Toggle task completion
async function toggleComplete(id, button, li) {
  await fetch(`http://localhost:5000/api/tasks/${id}/complete`, {
    method: "PATCH",
  });
  li.classList.toggle("completed");
  button.textContent = li.classList.contains("completed")
    ? "Incomplete"
    : "Complete";
}

// Initial fetch of tasks
fetchTasks();
