todoForm.title.addEventListener("keyup", (e) => validateField(e.target));
todoForm.title.addEventListener("blur", (e) => validateField(e.target));
todoForm.description.addEventListener("blur", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("input", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("blur", (e) => validateField(e.target));

todoForm.addEventListener("submit", onSubmit);

const todoListElement = document.getElementById("todoList");
// const checkbox = document.getElementById("checkbox");

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api("http://localhost:5000/tasks");

function validateField(field) {
	const { name, value } = field;

	let = validationMessage = "";

	switch (name) {
		case "title": {
			if (value.length < 2) {
				titleValid = false;
				validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
			} else if (value.length > 100) {
				titleValid = false;
				validationMessage =
					"Fältet 'Titel' får inte innehålla mer än 100 tecken.";
			} else {
				titleValid = true;
			}
			break;
		}

		case "description": {
			if (value.length > 500) {
				descriptionValid = false;
				validationMessage =
					"Fältet 'Beskrvining' får inte innehålla mer  än 500 tecken.";
			} else {
				descriptionValid = true;
			}
			break;
		}

		case "dueDate": {
			if (value.length === 0) {
				dueDateValid = false;
				validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
			} else {
				dueDateValid = true;
			}
			break;
		}
	}

	field.previousElementSibling.innerText = validationMessage;

	field.previousElementSibling.classList.remove("hidden");
}
function onSubmit(e) {
	e.preventDefault();

	if (titleValid && descriptionValid && dueDateValid) {
		console.log("Submit");

		saveTask();
	}

	function saveTask() {
		const task = {
			title: todoForm.title.value,
			description: todoForm.description.value,
			dueDate: todoForm.dueDate.value,
			completed: false,
		};

		api.create(task).then((task) => {
			if (task) {
				renderList();
			}
		});
	}
}

function renderList() {
	api.getAll().then((tasks) => {
		console.log(tasks);
		todoListElement.innerHTML = "";
		if (tasks && tasks.length > 0) {
			sortDueDate(tasks);
			sortFinished(tasks);
			tasks.forEach((task) => {
				todoListElement.insertAdjacentHTML("beforeend", renderTask(task));
			});
		}
	});
}

function renderTask({ id, title, description, dueDate, completed }) {
	let html = `
    <li class="select-none mt-2 py-2 ${
			completed ? "bg-green-400" : ""
		}border-b border-amber-300  ">
      <div class="flex items-center">
      <input type="checkbox" ${
				completed ? "checked" : ""
			} onclick="updateTask(${id}) "id = "checkbox${id}">
        <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${title}</h3>
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 
		  border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;
	description &&
		(html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);

	html += `
    </li>`;
	return html;
}

function updateTask(id) {
	const checkbox = document.getElementById(`checkbox${id}`);
	if (checkbox.checked == true) {
		const complete = { completed: true };
		api.update(id, complete).then((result) => renderList());
	} else if (checkbox.checked == false) {
		const unfinished = { completed: false };
		api.update(id, unfinished).then((result) => renderList());
	}
}

function deleteTask(id) {
	console.log(id);
	api.remove(id).then((result) => {
		renderList();
	});
}

function sortDueDate(tasks) {
	tasks.sort((a, b) => {
		if (a.dueDate < b.dueDate) {
			return -1;
		} else if (a.dueDate > b.dueDate) {
			return 1;
		} else {
			return 0;
		}
	});
}

function sortFinished(tasks) {
	tasks.sort((a, b) => {
		if (a.completed < b.completed) {
			return -1;
		} else if (a.completed > b.completed) {
			return 1;
		}
	});
}

renderList();
