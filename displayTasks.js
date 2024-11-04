// Affiche les tâches
function displayTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task';
        if (task.completed) taskItem.classList.add('completed');
        
        taskItem.innerHTML = `
            <span>${task.name} - Catégorie: ${task.category} - ${task.date ? task.date : 'Pas de date'}</span>
            <div class="task-actions">
                <button onclick="toggleTask('${task.id}')">Terminer</button>
                <button onclick="deleteTask('${task.id}')">Supprimer</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
    updateCounter();
}
