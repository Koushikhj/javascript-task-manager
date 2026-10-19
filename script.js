
let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");
let statusText = document.getElementById("status");
let taskCount = document.getElementById("taskCount");

let taskCounts = document.getElementById("taskCounts");
let filterAll = document.getElementById("filterAll");
let filterPending = document.getElementById("filterPending");
let filterCompleted = document.getElementById("filterCompleted");
let clearAllBtn = document.getElementById("clearAllBtn");

// Load saved tasks
let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
}

// Generate the next task ID
let nextId = tasks.reduce(function (maxId, task) {
    return Math.max(maxId, Number(task.id) || 0);
}, 0) + 1;

// Current filter
let currentFilter = "all";

// Save tasks
function saveTasks() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        return true;
    } catch (error) {
        statusText.textContent = "Could not save tasks!";
        return false;
    }
}

// Display tasks and counts
function renderTasks() {
    taskList.textContent = "";

    let completedCount = tasks.filter(function (task) {
        return task.completed;
    }).length;

    let pendingCount = tasks.length - completedCount;

    taskCount.textContent = "Total tasks: " + tasks.length;

    taskCounts.textContent =
        "Pending: " + pendingCount +
        " | Completed: " + completedCount;

    let filteredTasks = tasks.filter(function (task) {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {
        let message = document.createElement("li");

        message.textContent = tasks.length === 0
            ? "No tasks yet. Add one!"
            : "No tasks match this filter.";

        taskList.appendChild(message);
        return;
    }

    filteredTasks.forEach(function (task) {
        let li = document.createElement("li");

        let taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.classList.add("task-text");

        if (task.completed) {
            taskText.classList.add("completed");
        }

        let completeBtn = document.createElement("button");

        completeBtn.textContent = task.completed
            ? "Undo"
            : "Complete";

        completeBtn.addEventListener("click", function () {
            task.completed = !task.completed;

            if (saveTasks()) {
                statusText.textContent = "Task status updated!";
            }

            renderTasks();
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            if (saveTasks()) {
                statusText.textContent = "Task deleted!";
            }

            renderTasks();
        });

        li.append(taskText, completeBtn, deleteBtn);
        taskList.appendChild(li);
    });
}

// Add a task
function addTask() {
    let text = taskInput.value.trim();

    if (text === "") {
        statusText.textContent = "Please enter a task!";
        return;
    }

    let newTask = {
        id: nextId++,
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = "";

    if (saveTasks()) {
        statusText.textContent = "Task added successfully!";
    }

    renderTasks();
}

// Filter buttons
filterAll.addEventListener("click", function () {
    currentFilter = "all";
    renderTasks();
});

filterPending.addEventListener("click", function () {
    currentFilter = "pending";
    renderTasks();
});

filterCompleted.addEventListener("click", function () {
    currentFilter = "completed";
    renderTasks();
});

// Clear all tasks
clearAllBtn.addEventListener("click", function () {
    if (tasks.length === 0) {
        statusText.textContent = "There are no tasks to clear!";
        return;
    }

    let confirmed = confirm("Delete all tasks?");

    if (confirmed) {
        tasks = [];

        if (saveTasks()) {
            statusText.textContent = "All tasks cleared!";
        }

        renderTasks();
    }
});

// Add task with button or Enter key
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Initial display
renderTasks();
