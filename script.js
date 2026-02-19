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
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = taskText;

    span.addEventListener("click", function () {
        span.classList.toggle("completed");
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";

    deleteBtn.addEventListener("click", function () {
        li.remove();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(li);

    taskInput.value = "";
}


// ===== Event Listener =====
document.getElementById("addBtn").addEventListener("click", addTask);


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

        // Edit
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

        // Delete
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        /* -------- Drag & Drop -------- */

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

    updateStats();
    toggleEmptyState();
}

/* -------------------- FILTERS -------------------- */

allBtn.addEventListener("click", () => {
    currentFilter = "all";
    setActiveFilter(allBtn);
    renderTasks();
});

completedBtn.addEventListener("click", () => {
    currentFilter = "completed";
    setActiveFilter(completedBtn);
    renderTasks();
});

pendingBtn.addEventListener("click", () => {
    currentFilter = "pending";
    setActiveFilter(pendingBtn);
    renderTasks();
});

function setActiveFilter(activeButton) {
    document.querySelectorAll(".filters button").forEach(btn => {
        btn.classList.remove("active");
    });
    activeButton.classList.add("active");
}

/* -------------------- DARK MODE -------------------- */

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

/* -------------------- STATS + EMPTY STATE -------------------- */

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
}

function toggleEmptyState() {
    const emptyState = document.getElementById("emptyState");

    if (tasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}

/* -------------------- SAVE -------------------- */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
