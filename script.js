let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let filter = "all";

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

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

let list=document.getElementById("taskList");
list.innerHTML="";

let filteredTasks = tasks.filter(task=>{
if(filter==="active") return !task.completed;
if(filter==="completed") return task.completed;
return true;
});

filteredTasks.forEach((task,index)=>{

let li=document.createElement("li");

let span=document.createElement("span");
span.innerText=task.text;

if(task.completed){
span.style.textDecoration="line-through";
}

span.onclick=function(){

task.completed=!task.completed;

saveTasks();
renderTasks();

}

let del=document.createElement("button");
del.innerText="X";

del.onclick=function(e){

e.stopPropagation();

tasks.splice(index,1);

saveTasks();
renderTasks();

}

li.appendChild(span);
li.appendChild(del);

list.appendChild(li);

});

updateCounter();
}

function updateCounter(){

let count = tasks.filter(t=>!t.completed).length;

document.getElementById("taskCounter").innerText = count + " tasks left";

}

renderTasks();