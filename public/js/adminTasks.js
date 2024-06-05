// Function to handle adding a new task
async function addTask(taskData) {
    try {
        const response = await fetch('/admin/tasks/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });
        const result = await response.json();
        console.log('Task added:', result.message); // Logging the success message
        alert(result.message);
        location.reload(); // Reload the page to see the updated task list
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task.');
    }
}

// Function to handle editing a task
async function editTask(taskId, taskData) {
    try {
        const response = await fetch(`/admin/tasks/edit/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });
        const result = await response.json();
        console.log('Task edited:', result.message); // Logging the success message
        alert(result.message);
        location.reload(); // Reload the page to see the changes
    } catch (error) {
        console.error('Error editing task:', error);
        alert('Failed to edit task.');
    }
}

// Function to handle deleting a task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        const response = await fetch(`/admin/tasks/delete/${taskId}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        console.log('Task deleted:', result.message); // Logging the success message
        alert(result.message);
        location.reload(); // Reload the page to remove the deleted task
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task.');
    }
}

// Function to assign a task to a user based on tier
async function assignTask(taskId, userId) {
    try {
        const response = await fetch(`/admin/tasks/assign/${taskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        const result = await response.json();
        console.log('Task assigned:', result.message); // Logging the success message
        alert(result.message);
        location.reload(); // Reload to see the task assignment updates
    } catch (error) {
        console.error('Error assigning task:', error);
        alert('Failed to assign task.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners to buttons or forms for add, edit, assign, delete operations
    if (document.getElementById('addTaskForm')) {
        document.getElementById('addTaskForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const taskData = {
                description: this.elements['description'].value,
                amountEarned: this.elements['amountEarned'].value,
                commission: this.elements['commission'].value,
                rating: this.elements['rating'].value,
                uniqueCode: this.elements['uniqueCode'].value,
                userId: this.elements['userId'].value, // Ensure userId is included in taskData for task creation
            };
            addTask(taskData);
        });
    }

    const editTaskButtons = document.querySelectorAll('.edit-task-button');
    editTaskButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-task-id');
            const taskData = {
                description: document.getElementById(`description-${taskId}`).value,
                amountEarned: document.getElementById(`amountEarned-${taskId}`).value,
                commission: document.getElementById(`commission-${taskId}`).value,
                rating: document.getElementById(`rating-${taskId}`).value,
                uniqueCode: document.getElementById(`uniqueCode-${taskId}`).value,
            };
            editTask(taskId, taskData);
        });
    });

    const deleteTaskButtons = document.querySelectorAll('.delete-task-button');
    deleteTaskButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-task-id');
            deleteTask(taskId);
        });
    });

    if (document.getElementById('assignTaskForm')) {
        document.getElementById('assignTaskForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const taskId = this.elements['taskId'].value;
            const userId = this.elements['userId'].value;
            assignTask(taskId, userId);
        });
    }
});