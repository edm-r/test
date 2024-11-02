// Initialiser les tâches et les catégories
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

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

// Ajoute une tâche
function addTask() {
    const taskName = document.getElementById('taskName').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskCategory = document.getElementById('taskCategory').value;

    if (!taskName) return alert('Veuillez entrer une tâche');
    
    const task = {
        id: Date.now().toString(),
        name: taskName,
        date: taskDate,
        category: taskCategory,
        completed: false
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// Supprime une tâche
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// Marque une tâche comme terminée
function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// Filtrer les tâches par état
function filterTasks(filter) {
    const filteredTasks = filter === 'completed' ? tasks.filter(task => task.completed) :
                          filter === 'uncompleted' ? tasks.filter(task => !task.completed) :
                          tasks;
    displayTasks(filteredTasks);
}

// Filtrer les tâches par catégorie
function filterByCategory(category) {
    const filteredTasks = tasks.filter(task => task.category === category);
    displayTasks(filteredTasks);
}

// Mise à jour du compteur de tâches restantes
function updateCounter() {
    const remainingTasks = tasks.filter(task => !task.completed).length;
    document.getElementById('taskCounter').innerText = `${remainingTasks} tâche(s) restante(s)`;
}

// Fonction de recherche
function searchTask() {
    const query = document.getElementById('searchTask').value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(query));
    displayTasks(filteredTasks);
}

// Fonction pour vérifier et notifier les tâches en retard
function checkOverdueTasks() {
    const now = new Date();

    tasks.forEach(task => {
        if (task.date && !task.completed) {
            const taskDate = new Date(task.date);
            if (taskDate < now) {
                notifyTask(task.name);
            }
        }
    });
}

// Fonction pour envoyer une notification pour une tâche spécifique
function notifyTask(taskName) {
  if (!("Notification" in window)) {
      console.log("Les notifications ne sont pas supportées par ce navigateur.");
      return;
  }

  Notification.requestPermission().then(permission => {
      if (permission === "granted") {
          console.log(`Notification envoyée pour la tâche : ${taskName}`);
          new Notification("Tâche en retard", {
              body: `La tâche "${taskName}" est en retard !`,
              icon: 'images/icon.png' // Remplacez par le chemin de votre icône si nécessaire
          });
      } else {
          console.log("Permission de notification non accordée.");
      }
  });
}

// Fonction pour tester les notifications manuellement
function testNotification() {
    notifyTask("Test de Notification");
}

// Appel de la fonction toutes les minutes pour vérifier les tâches en retard
setInterval(checkOverdueTasks, 5000); // Vérifie toutes les 60 secondes

// Charger les tâches au démarrage
document.addEventListener('DOMContentLoaded', displayTasks);
