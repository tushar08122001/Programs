const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const pendingBtn = document.getElementById("pendingBtn");

const darkModeToggle = document.getElementById("darkModeToggle");

let tasks = [];
let currentFilter = "all";
let draggedItemId = null;

/* -------------------- LOAD DATA -------------------- */

document.addEventListener("DOMContentLoaded", () => {
    const savedTasks = localStorage.getItem("tasks");
    const savedTheme = localStorage.getItem("theme");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    renderTasks();
});

/* -------------------- ADD TASK -------------------- */

addBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = "";
}

/* -------------------- RENDER TASKS -------------------- */

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {

        if (currentFilter === "completed" && !task.completed) return;
        if (currentFilter === "pending" && task.completed) return;

        const li = document.createElement("li");
        li.setAttribute("draggable", true);
        li.dataset.id = task.id;

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        // Toggle complete
        span.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏";

        editBtn.addEventListener("click", () => {
            const newText = prompt("Edit task:", task.text);
            if (newText !== null && newText.trim() !== "") {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        /* -------- Drag Events -------- */

        li.addEventListener("dragstart", () => {
            draggedItemId = task.id;
        });

        li.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        li.addEventListener("drop", () => {
            const draggedIndex = tasks.findIndex(t => t.id === draggedItemId);
            const dropIndex = tasks.findIndex(t => t.id === task.id);

            const draggedItem = tasks[draggedIndex];
            tasks.splice(draggedIndex, 1);
            tasks.splice(dropIndex, 0, draggedItem);

            saveTasks();
            renderTasks();
        });

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

/* -------------------- FILTERS -------------------- */

allBtn.addEventListener("click", () => {
    currentFilter = "all";
    renderTasks();
});

completedBtn.addEventListener("click", () => {
    currentFilter = "completed";
    renderTasks();
});

pendingBtn.addEventListener("click", () => {
    currentFilter = "pending";
    renderTasks();
});

/* -------------------- DARK MODE -------------------- */

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

/* -------------------- SAVE -------------------- */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
