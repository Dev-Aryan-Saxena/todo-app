let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let filter = "all";

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", function(e){
if(e.key==="Enter"){
addTask();
}
});

function saveTasks(){
localStorage.setItem("tasks", JSON.stringify(tasks));
}

function setFilter(type){
filter = type;
renderTasks();
}

function addTask(){

if(input.value.trim()==="") return;

tasks.push({
text:input.value,
completed:false
});

input.value="";

saveTasks();
renderTasks();

}

function renderTasks(){

taskList.innerHTML="";

let filteredTasks = tasks.filter(task=>{
if(filter==="active") return !task.completed;
if(filter==="completed") return task.completed;
return true;
});

filteredTasks.forEach((task)=>{

let li=document.createElement("li");

let checkbox=document.createElement("input");
checkbox.type="checkbox";
checkbox.checked=task.completed;

checkbox.onchange=function(){

task.completed=!task.completed;

saveTasks();
renderTasks();

};

let span=document.createElement("span");
span.innerText=task.text;

if(task.completed){
span.style.textDecoration="line-through";
}

span.ondblclick=function(){

let editInput=document.createElement("input");
editInput.value=task.text;

editInput.onblur=function(){

task.text=editInput.value;

saveTasks();
renderTasks();

};

li.replaceChild(editInput,span);

};

span.oncontextmenu=function(e){

e.preventDefault();

document.getElementById("focusText").innerText = task.text;

};

let del=document.createElement("button");
del.innerText="X";

del.onclick=function(){

tasks = tasks.filter(t => t !== task);

saveTasks();
renderTasks();

};

li.appendChild(checkbox);
li.appendChild(span);
li.appendChild(del);

taskList.appendChild(li);

});

updateCounter();

}

function updateCounter(){

let count = tasks.filter(t=>!t.completed).length;

document.getElementById("taskCounter").innerText = count + " tasks left";

document.getElementById("totalTasks").innerText = tasks.length;

document.getElementById("completedTasks").innerText =
tasks.filter(t=>t.completed).length;

}

renderTasks();

const sortable = new Sortable(taskList, {

animation:150,

onEnd:function(evt){

const movedTask = tasks.splice(evt.oldIndex,1)[0];

tasks.splice(evt.newIndex,0,movedTask);

saveTasks();

}

});

const toggle=document.getElementById("darkModeToggle");

toggle.onclick=function(){

document.body.classList.toggle("dark");

};