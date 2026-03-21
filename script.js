// ================= STATE =================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// ================= SELECTORS =================
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const toggle = document.getElementById("darkModeToggle");

// ================= STORAGE =================
function saveTasks(){
localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ================= LOGIC =================
function addTask(){
if(input.value.trim()==="") return;

tasks.push({
id: Date.now(),
text: input.value,
completed: false
});

input.value="";
saveTasks();
renderTasks();
}

function deleteTask(id){
tasks = tasks.filter(task => task.id !== id);
saveTasks();
renderTasks();
}

function toggleTask(id){
tasks = tasks.map(task =>
task.id === id ? {...task, completed: !task.completed} : task
);
saveTasks();
renderTasks();
}

function editTask(id, newText){
tasks = tasks.map(task =>
task.id === id ? {...task, text: newText} : task
);
saveTasks();
renderTasks();
}

function setFilter(type){
filter = type;
renderTasks();
}

// ================= UI =================
function renderTasks(){

taskList.innerHTML="";

let filteredTasks = tasks.filter(task=>{
if(filter==="active") return !task.completed;
if(filter==="completed") return task.completed;
return true;
});

filteredTasks.forEach(task => {

let li = document.createElement("li");

let checkbox = document.createElement("input");
checkbox.type="checkbox";
checkbox.checked = task.completed;

checkbox.onchange = () => toggleTask(task.id);

let span = document.createElement("span");
span.innerText = task.text;

if(task.completed){
span.style.textDecoration="line-through";
}

// edit
span.ondblclick = () => {
let editInput = document.createElement("input");
editInput.value = task.text;

editInput.onblur = () => {
editTask(task.id, editInput.value);
};

li.replaceChild(editInput, span);
};

// focus task
span.oncontextmenu = (e) => {
e.preventDefault();
document.getElementById("focusText").innerText = task.text;
};

let del = document.createElement("button");
del.innerText = "X";

del.onclick = () => deleteTask(task.id);

li.appendChild(checkbox);
li.appendChild(span);
li.appendChild(del);

taskList.appendChild(li);

});

updateStats();
}

// ================= STATS =================
function updateStats(){

let active = tasks.filter(t=>!t.completed).length;

document.getElementById("taskCounter").innerText =
active + " tasks left";

document.getElementById("totalTasks").innerText = tasks.length;

document.getElementById("completedTasks").innerText =
tasks.filter(t=>t.completed).length;

}

// ================= EVENTS =================
addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", (e)=>{
if(e.key==="Enter") addTask();
});

toggle.onclick = () => {
document.body.classList.toggle("dark");
};

// ================= INIT =================
renderTasks();

// ================= DRAG =================
new Sortable(taskList, {
animation:150,
onEnd: function(evt){
const moved = tasks.splice(evt.oldIndex,1)[0];
tasks.splice(evt.newIndex,0,moved);
saveTasks();
}
});