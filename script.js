let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function renderTasks(){
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task,index)=> {
        let li = document.createElement("li");
        li.innerText = task.text;

        if(task.completed){
            li.style.textDecoration="line-through";
        }
        
        li.onclick=function(){
            tasks[index].completed =! tasks[index].completed;
            saveTasks();
            renderTasks();
        }

        let del = document.createElement("button");
        del.innerText = "X";

        del.onclick = function(e){
            e.stopPropagation();
            tasks.splice(index,1);
            saveTasks();
            renderTasks();
        }

        li.appendChild(del);
        list.appendChild(li);

    });
}

function addTask(){
    let input = document.getElementById("taskInput");

    if(input.value==="") return;

    tasks.push({
        text:input.value,
        completed:false,
    });
    
    input.value="";

    saveTasks();
    renderTasks();
}

renderTasks();