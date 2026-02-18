// Select elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Add event listener to button
addBtn.addEventListener("click", function() {
    if (taskInput.value === "") 
        {
    alert("Please enter a task!");
    return;}

    // Get input value
    const taskText = taskInput.value;

    // Create new list item
    const li = document.createElement("li");
    li.textContent = taskText;

    // Add to task list
    taskList.appendChild(li);

    // Clear input
    taskInput.value = "";
});
