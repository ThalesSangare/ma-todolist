// Sélection de l'input où l'utilisateur écrit ses tâches
const input = document.querySelector("input");

// Sélection du bouton "+" pour ajouter une tâche
const addButton = document.querySelector(".add-button");

// Sélection du conteneur <ul> qui affichera les tâches
const todosHtml = document.querySelector(".todos");

// Sélection de l'image affichée quand il n'y a aucune tâche
const emptyImage = document.querySelector(".empty-image");

// Récupération des tâches sauvegardées dans le localStorage (si il y en a)
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];

// Sélection du bouton "Delete All"
const deleteAllButton = document.querySelector(".delete-all");

// Sélection de tous les filtres (Complete, Incomplete)
const filters = document.querySelectorAll(".filter");

// Variable pour stocker le filtre actif
let filter = '';

// Affiche les tâches au chargement de la page
showTodos();

/**
 * Génère le HTML d'une tâche
 * @param {Object} todo - Objet tâche (name, status)
 * @param {number} index - Index de la tâche dans le tableau
 * @returns {string} - Code HTML de la tâche
 */
function getTodoHtml(todo, index) {
  // Si un filtre est actif et que la tâche ne correspond pas => ne pas l'afficher
  if (filter && filter != todo.status) {
    return '';
  }
  // Si la tâche est complétée, on coche la checkbox
  let checked = todo.status == "completed" ? "checked" : "";

  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)">
        <i class="fa fa-times"></i>
      </button>
    </li>
  `;
}

/**
 * Affiche toutes les tâches sur la page
 */
function showTodos() {
  if (todosJson.length == 0) {
    // Si aucune tâche, vider la liste et afficher l'image vide
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    // Sinon, générer le HTML de toutes les tâches
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

/**
 * Ajoute une tâche au tableau et met à jour le localStorage
 * @param {string} todo - Nom de la tâche
 */
function addTodo(todo) {
  input.value = ""; // Réinitialise l'input
  todosJson.unshift({ name: todo, status: "pending" }); // Ajoute la tâche en haut du tableau
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Sauvegarde dans le localStorage
  showTodos(); // Affiche les tâches mises à jour
}

// Quand l'utilisateur appuie sur "Entrée" après avoir écrit une tâche
input.addEventListener("keyup", e => {
  let todo = input.value.trim(); // Récupération du texte sans espaces
  if (!todo || e.key != "Enter") {
    return; // Si vide ou si ce n'est pas "Entrée", on ne fait rien
  }
  addTodo(todo); // Ajout de la tâche
});

// Quand l'utilisateur clique sur le bouton "+"
addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return; // Si vide, on ne fait rien
  }
  addTodo(todo); // Ajout de la tâche
});

/**
 * Met à jour le statut (completed/pending) d'une tâche
 * @param {HTMLInputElement} todo - Checkbox cliquée
 */
function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild; // Sélectionne le <span> qui contient le nom
  if (todo.checked) {
    todoName.classList.add("checked"); // Barre le texte
    todosJson[todo.id].status = "completed"; // Change le statut
  } else {
    todoName.classList.remove("checked"); // Enlève le barré
    todosJson[todo.id].status = "pending"; // Change le statut
  }
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Sauvegarde
}

/**
 * Supprime une tâche
 * @param {HTMLButtonElement} todo - Bouton "X" cliqué
 */
function remove(todo) {
  const index = todo.dataset.index; // Récupère l'index de la tâche
  todosJson.splice(index, 1); // Supprime la tâche du tableau
  showTodos(); // Actualise l'affichage
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Sauvegarde
}

// Pour chaque filtre (Complete / Incomplete)
filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      // Si le filtre est déjà actif, on le désactive
      el.classList.remove('active');
      filter = '';
    } else {
      // Sinon, on active celui cliqué et on désactive les autres
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos(); // Actualise l'affichage selon le filtre
  });
});

// Quand on clique sur "Delete All"
deleteAllButton.addEventListener("click", () => {
  todosJson = []; // Vide le tableau
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Vide le localStorage
  showTodos(); // Actualise l'affichage
});


