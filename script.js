// ===== STATE =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// ===== SELECTORS =====
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const toggle = document.getElementById("darkModeToggle");

// ===== STORAGE =====
function saveTasks(){
localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== LOGIC =====
function addTask(){
if(input.value.trim()==="") return;

tasks.push({
id: Date.now(),
text: input.value,
status:"todo",
focus:false
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
tasks = tasks.map(task => {
if(task.id === id){
let newStatus =
task.status === "done" ? "todo" : "done";
return {
...task,
status: newStatus
};
}
return task;
});
saveTasks();
renderTasks();
}


function editTask(id,newText){
tasks = tasks.map(task =>
task.id === id ? {...task,text:newText} : task
);
saveTasks();
renderTasks();
}

function setFilter(type){
filter = type;
renderTasks();
}

// ===== UI =====
function renderTasks(){

taskList.innerHTML="";

let filteredTasks = tasks.filter(task=>{
if(filter==="active") return task.status !== "done";
if(filter==="completed") return task.status === "done";
return true;
});

filteredTasks.forEach(task=>{

let li = document.createElement("li");

// checkbox
let checkbox = document.createElement("button");
checkbox.innerText = task.status === "done" ? "☑" : "☐";
checkbox.checked = task.status === "done";
checkbox.onclick = () => toggleTask(task.id);

// text
let span = document.createElement("span");
span.innerText = task.text;

if(task.status === "done"){
span.style.textDecoration="line-through";
span.style.textDecorationColor="black";
}

// edit
span.ondblclick = ()=>{
let editInput = document.createElement("input");
editInput.value = task.text;

editInput.onblur = ()=>{
editTask(task.id, editInput.value);
};

li.replaceChild(editInput, span);
};

// focus
let star = document.createElement("button");

star.innerText = task.focus ? "⭐" : "☆";
star.onclick = () => {
tasks = tasks.map(t =>
t.id === task.id
? {...t, focus: !t.focus}
: {...t, focus:false}
);
saveTasks();
renderTasks();
};

// delete
let del = document.createElement("button");
del.innerText = "🗑";
del.onclick = ()=> deleteTask(task.id);

li.appendChild(checkbox);
li.appendChild(span);
li.appendChild(star);
li.appendChild(del);

taskList.appendChild(li);

});

updateStats();
renderKanban();
}

// ===== STATS =====
function updateStats(){

let active = tasks.filter(t=>t.status !== "done").length;

document.getElementById("taskCounter").innerText =
active + " tasks left";

document.getElementById("totalTasks").innerText = tasks.length;

document.getElementById("completedTasks").innerText =
tasks.filter(t=>t.status === "done").length;

let focusTask = tasks.find(t=>t.focus);

document.getElementById("focusText").innerText =
focusTask ? focusTask.text : "No focus task";
}

// ===== KANBAN =====
function renderKanban(){



["todo","doing","done"].forEach(status=>{
document.getElementById(status).innerHTML =
`<h3>${status.toUpperCase()}</h3>`;
});

tasks.forEach(task=>{

let div = document.createElement("div");
div.innerText = task.text;
div.className = "kanban-task";
div.dataset.id = task.id;

// highlight focus
if(task.focus){
div.style.border = "2px solid gold";
}

document.getElementById(task.status || "todo")
.appendChild(div);

});
}

// ===== EVENTS =====
addBtn.addEventListener("click", addTask);

input.addEventListener("keypress",(e)=>{
if(e.key==="Enter") addTask();
});

// dark mode persistence
if(localStorage.getItem("darkMode")==="true"){
document.body.classList.add("dark");
}
toggle.onclick = ()=>{
document.body.classList.toggle("dark");

localStorage.setItem(
"darkMode",
document.body.classList.contains("dark")
);
};

// ===== INIT =====
renderTasks();

// ===== DRAG LIST =====
new Sortable(taskList,{
animation:150,
onEnd:function(evt){
const moved = tasks.splice(evt.oldIndex,1)[0];
tasks.splice(evt.newIndex,0,moved);
saveTasks();
}
});

// ===== DRAG KANBAN =====
["todo","doing","done"].forEach(col=>{

new Sortable(document.getElementById(col),{
group:"kanban",
animation:150,

onAdd:function(evt){

let id = Number(evt.item.dataset.id);

tasks = tasks.map(t =>
t.id === id ? {...t,status:col} : t
);

saveTasks();
renderTasks();

}

});

});