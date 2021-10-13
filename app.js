//
// Global variables
//
let listTasks = [];
let indexTasks = 0;
const STATUS_PEND = "pend";
const STATUS_OK = "ok";

//
// Initialize app
//
const init = () => {
  console.log("init");
  prepareEvents();
  getLocalStorage();
  displayAllTasks();
};

//
// Prepare events
//
const prepareEvents = () => {
  console.log('prepareEvents');

  document
    .querySelector('.dashboard__add')
    .addEventListener('click', clickAddButton);

  document.querySelector('.nav__input').addEventListener('input', applyFilter);

  document.querySelector('.nav__init-filter').addEventListener('click', clickInitFilter);

  // Catch a key pressed
  document.querySelector('.dashboard__input').addEventListener("keyup", addTaskWithEnter);

}

//
// Execute a function when the user releases a key on the keyboard
//
const addTaskWithEnter = (event) => {

  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    clickAddButton();
  }
};

//
// Selects only those tasks that match the filter
//
const applyFilter = (event) => {

  console.log('applyFilter');
  console.log(event.target.value);

  // Removes all tasks from the dashboard
  document.querySelector('.dashboard__list').innerHTML = '';

  if (event.target.value.length > 0) {
    const list = listTasks
      .filter( (elem) => {return elem.text.toLowerCase().includes(event.target.value.toLowerCase())} )
      .forEach((elem) => {displayTask(elem) } );
  } else {
    displayAllTasks();
  }
}

const clickInitFilter = () => {
  console.log('clickInitFilter');
  
  document.querySelector('.nav__input').value = '';
  document.querySelector('.dashboard__list').innerHTML = '';
  displayAllTasks();
}

//
// Click on the add button
//
const clickAddButton = () => {

  const $$input = document.querySelector(".dashboard__input");
  const text = $$input.value;

  if (text.length > 0) {
    const newTask = {
      id: "t_" + indexTasks,
      text: text,
      status: STATUS_PEND,
    };
    indexTasks++;
    addTask(newTask);
    displayTask(newTask);
    $$input.value = '';
  }
};

// Add a new task and show it on the dashboard
//
const addTask = (newTask) => {
  console.log("newTask");
  listTasks.push(newTask);
  setLocalStorage();
};

//
// Include a new task in the dashboard to be displayed
//
const displayTask = (newTask) => {
  console.log("displayTask");

  const $$list = document.querySelector(".dashboard__list");

  const $$task = document.createElement("div");
  $$task.className = "dashboard__item";
  $$task.id = `l${newTask.id}`;

  const $$span1 = document.createElement("span");
  $$span1.id = `t${newTask.id}`;
  if (newTask.status === STATUS_OK) {
    $$span1.className = "dashboard__text dashboard__text--checked";
  } else {
    $$span1.className = "dashboard__text";
  }
  $$span1.textContent = newTask.text;

  const $$span2 = document.createElement("span");
  $$span2.className = "dashboard__done";
  $$span2.id = `s${newTask.id}`;
  $$span2.innerHTML = `<i class="fas fa-check-circle" id='i${newTask.id}'></i>`;
  $$span2.addEventListener("click", clickCheckTask);

  const $$span3 = document.createElement("span");
  $$span3.className = "dashboard__del";
  $$span3.id = `s${newTask.id}`;
  $$span3.innerHTML = `<i class="fas fa-times-circle" id='i${newTask.id}'></i>`;
  $$span3.addEventListener("click", clickDelTask);

  const $$span4 = document.createElement("span");
  $$span4.className = "dashboard__edit";
  $$span4.id = `s${newTask.id}`;
  $$span4.innerHTML = `<i class="fas fa-edit" id='i${newTask.id}'></i>`;
  $$span4.addEventListener("click", clickEditTask);

  $$task.appendChild($$span1);
  $$task.appendChild($$span2);
  $$task.appendChild($$span3);
  $$task.appendChild($$span4);
  $$list.appendChild($$task);
};

//
// Click on a task check button
// Check task and update it on the dashboard
//
const clickCheckTask = (event) => {
  console.log("clickCheckTask");
  console.log(event);

  const taskId = event.path[1].id.substring(1);
  document.querySelector(`#t${taskId}`).classList.add("dashboard__text--checked");

  const ind = searchListTasks(taskId);
  listTasks[ind].status = STATUS_OK;
  setLocalStorage();
};

//
// Click on a task delete button
// Delete task and remove it from the dashboard
//
const clickDelTask = (event) => {
  console.log("clickDelTask");
  console.log(event);

  const taskId = event.path[1].id.substring(1);
  deleteTask(taskId);
};

//
// Click on a task edit button
// Move the content to the new_task field, delete the task and remove it from the dashboard
//
const clickEditTask = (event) => {
  console.log("clickEditTask");
  console.log(event);
  
  const taskId = event.path[1].id.substring(1);
  document.querySelector(".dashboard__input").value = listTasks[searchListTasks(taskId)].text;
  deleteTask(taskId);
}

//
// Delete a task by id
//
const deleteTask = (taskId) => {
  console.log('deleteTask');
  
  // Remove the task from the dashboard
  const $$task = document.querySelector(`#l${taskId}`)
  $$task.remove();
  
  // Delete the task
  listTasks.splice(searchListTasks(taskId), 1);
  
  if (listTasks.length == 0) {
    indexTasks = 0;
  }
  
  // Update localStorage
  setLocalStorage();  
}

//
// Search by id in listTasks array
//
const searchListTasks = (taskId) => {
  return listTasks.findIndex((element) => element.id === taskId);
};

//
// Set local storage
//
const setLocalStorage = () => {
  console.log("setLocalStorage");

  if (typeof Storage !== "undefined") {
    localStorage.setItem("listTasks", JSON.stringify(listTasks));
    localStorage.setItem("indexTasks", indexTasks);
  }
};

//
// Get local storage
//
const getLocalStorage = () => {
  console.log("getLocalStorage");

  if (typeof Storage !== "undefined") {
    if (localStorage.indexTasks) {
      indexTasks = Number(localStorage.indexTasks);
      listTasks = JSON.parse(localStorage.listTasks);

      console.log("indexTasks ->", indexTasks);
      console.log("listTasks ->", listTasks);
    }
  }
};

//
// Include on the dashboard all the tasks
//
const displayAllTasks = () => {
  console.log("displayAllTasks");

  listTasks.forEach((element) => {
    displayTask(element);
  });
};

//
// Windows onload
//
window.onload = () => {
  console.log("Onload");
  init();
};
