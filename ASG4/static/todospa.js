const initDocElems = () => {
    return {
        todoList: document.getElementById('todolist'),
        taskTemplate: document.getElementById('task-template').firstElementChild,
        editTemplate: document.getElementById('edit-task-template').firstElementChild,
        newList: document.getElementById('newlist'),
        formCount: 0
    }
};

var docElems;

const init = () => {
    // tasks load asynchronously with rest of init()
    loadTasks(); 

    // convenience object with references to key DOM objects and the form counter
    docElems = initDocElems();

    // attach event handlers to controls in right sidebar
    // to controls
    document.querySelector('.controls')
        .addEventListener('click', (event) => {
            if (event.target.closest('INPUT.controlbtn') && 
                event.target.closest('INPUT.controlbtn').value == "New task") {
                handleNewTask(event)
            };
            // Filter handling goes here ...
            if (event.target.closest('INPUT.controlbtn') && 
                event.target.closest('INPUT.controlbtn').value == "Filter") {
                handleFilterTasks(event)
            };

            if (event.target.closest('INPUT.controlbtn') && 
                event.target.closest('INPUT.controlbtn').value == "Order") {
                handleOrderTasks(event)
            };
        });
    //
    // to new tasks being edited
    document.querySelector('#newlist')
        .addEventListener('click', (event) => {
            
            // you can remove the diagnostic console.log and alert statements
            console.log("event:");
            console.log(event);
            // alert("Check browser console for console.log messages");

            if (event.target.closest('INPUT.editbtn')) {
                handleNewTaskSave(event)
            };

            if (event.target.closest('INPUT.deletebtn')) {
                handleNewTaskCancel(event)
            };
            
        });

    document.querySelector('#todolist')
        .addEventListener('click', (event) => {
            if (event.target.closest('INPUT.status') && !event.target.closest('SECTION.todoitem').classList.contains('editing')) {
                console.log("task checked? " + event.target.checked);
                status = (event.target.checked ? "done" : "tbd");
                console.log('status: ' + status);

                taskid = event.target.closest('SECTION.todoitem').children[0].value;
                console.log('taskid: ' + taskid);

                postData('/status/update', { 'taskid': taskid, 'status': status })
                    .then(response => {
                        console.log("before reading body of postData response:")
                        console.log(response);

                        message = response.json();

                        console.log("after reading body of postData response:")
                        console.log(response);
                        console.log("message read from response body: ")
                        console.log(message);

                        return message;
                    })
                    .then(reply => {
                        console.log("reply that resolved promise:")
                        console.log(reply);
                        
                        if (reply.error) {
                            alert("Server Error: " + reply.error)
                        }
                    })
                    // catch errors not caught by server-side application 
                    .catch(error => console.log(error))
            };
            // addition eventListeners go here for clicks of buttons
            // Edit, Delete
            if (event.target.closest('INPUT.deletebtn')) {
                console.log('delete task');
                handleDeleteTask(event);
            }
            if (event.target.closest('INPUT.editbtn')) {
                console.log('edit task');
                handleEditTask(event);
            }
            // Save and Cancel (these on the form created click on Edit)
            if (event.target.closest('INPUT.save-btn')) {
                console.log('save edit task');
                handleSaveEditTask(event);
            }
            if (event.target.closest('INPUT.cancel-btn')) {
                console.log('cancel edit task');
                handleCancelEditTask(event);
            }
            if (event.target.closest('.due_date') && !event.target.closest('.due_date').querySelector('.due_date_input')) {
                console.log('edit due_date');
                handleEditDueDate(event);
            }
        });
        document.querySelector('#todolist').addEventListener('input', function(e) {
            if (e.target.closest('.due_date_input.direct')) {
                handleDueDateUpdate(e);
            }
        })
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#todolist') && document.querySelector('#todolist').querySelector('.due_date_input.direct')) {
                var ele = document.querySelector('#todolist').querySelector('.due_date_input.direct');
                ele.closest('.due_date').innerHTML = ele.value;
            }
        });

};   

const loadTasks = () => {
    getTasks("all")
        .then(rsp => {
            payload = rsp.json();
            return payload
        })
        .then(tasks => {
            console.log("resolving promise in loadTasks response:")
            console.log(tasks);
            createTaskElements(tasks);
        })
};

const getTasks = (filter) => {
    return fetch("/tasks/" + filter, {
                // set headers to let server know format of 
                // request and response bodies
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            })
}

const putTask = (task) => {
    console.log("from putTask, task:");
    console.log(task);
    return fetch('/task/new', {

        // represent JS object as a string
        body: JSON.stringify(task),

        // set headers to let server know format of 
        // request and response bodies
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },

        // in the ReST spirit method should be PUT
        // but bottle does not support HTTP verb PUT
        method: 'POST'
    })
}

var deleteTask = function(taskid) {
    console.log("from deleteTask, taskid:", taskid);
    return fetch('/task/delete', {

        // represent JS object as a string
        body: JSON.stringify({
            taskid: taskid,
        }),

        // set headers to let server know format of 
        // request and response bodies
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },

        // in the ReST spirit method should be PUT
        // but bottle does not support HTTP verb PUT
        method: 'POST'
    });
};

const postTask = (task) => {
    console.log("from postTask, task:");
    console.log(task);
    return postData('/task/update', task)
}

function postData(url, jsondata) {
    return fetch(url, {
        body: JSON.stringify(jsondata),
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        method: 'POST'
    })
}

// functions for building and manipulating DOM

const createTaskElements = (taskListData) => {
    console.log("from createTaskElements: creating task elements");
    taskListData.forEach(createAndAppendTaskElement)
}

const createTaskElement = (task) => {
    // cloneNode(true) makes a deep clone (as opposed to shallow clone)
    var taskel = docElems.taskTemplate.cloneNode(true);
    updateTaskElement(task, taskel);
    return taskel
};

const updateTaskElement = (task, taskel) => {
    setTaskId(taskel, task.taskid);
    setTaskDescription(taskel, task.taskdescription);
    setTaskPostDate(taskel, task.post_date);
    setTaskDueDate(taskel, task.due_date);
    setStatus(taskel, task.status);
}

const appendTaskElement = (taskel) => {
        docElems.todoList.appendChild(taskel);
}

// poor (wo)man's function composition
const createAndAppendTaskElement = (taskel) => {
    appendTaskElement(createTaskElement(taskel))
}

const setTaskId = (taskel, taskid) => {
    var  taskidEl = taskel.querySelector('.taskid');
    taskidEl.value = taskid;
};

const getTaskId = (taskel) => {
    var taskidEl = taskel.querySelector('.taskid');
    return taskidEl.value
}

const setTaskDescription = (taskel, taskdescription) => {
    var taskDescriptionEl = taskel.querySelector('.taskdescription');
    taskDescriptionEl.innerHTML = taskdescription;
}

var setTaskPostDate = function(taskel, post_date) {
    var taskPostDateEl = taskel.querySelector('.post_date');
    // var taskPostDateInputEl = taskel.querySelector('input.post_date_input');
    // console.log(taskPostDateEl);
    taskPostDateEl.innerHTML = post_date;
    // taskPostDateInputEl.value = post_date;
    // if (taskPostDateEl.querySelector('input.post_date_input')) {
    //     taskPostDateEl.querySelector('input.post_date_input').value = post_date;
    // }
}

Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getDate(){
    return  new Date().Format("yyyy-MM-dd");
    // debugger;
    // var today = new Date(); 
    // var date; 
    // date = (today.getFullYear()) +"-" + (today.getMonth() + 1 ) + "-" + today.getDate(); 
    // return date;
}

var setTaskDueDate = function(taskel, due_date) {
    var taskDueDateEl = taskel.querySelector('.due_date');
    // var taskDueDateInputEl = taskel.querySelector('input.due_date_input');
    taskDueDateEl.innerHTML = due_date;
    // taskDueDateInputEl.value = due_date;
    // if (taskDueDateEl.querySelector('input.due_date_input')) {
    //     taskDueDateEl.querySelector('input.due_date_input').value = due_date;
    // }
}

const getTaskFormDescription = (taskel) => {
    var taskDescriptionEl = taskel.querySelector('.taskdescription');
    return taskDescriptionEl.firstElementChild.value
}

const getTaskDescription = (taskel) => {
    var taskDescriptionEl = taskel.querySelector('.taskdescription');
    return taskDescriptionEl.innerHTML
}

const setStatus = (taskel, status) => {
    var taskStatusEl = taskel.querySelector('.status');
    if (status === "done") {
        taskStatusEl.checked = true;
    }
}

const getStatus = (taskel) => {
    var taskStatusEl = taskel.querySelector('.status');
    return (taskStatusEl.checked ? "done" : "tbd")
}

const editNewTask = () => {
    var taskFormEl = docElems.editTemplate.cloneNode(true);
    setFormId(taskFormEl);
    // console.log(taskFormEl.querySelector('input[name="post_date_input"]'));
    console.log(taskFormEl.querySelector('input[name="post_date_input"]').value);
    taskFormEl.querySelector('input[name="post_date_input"]').value = getDate();
    taskFormEl.querySelector('input[name="post_date_input"]').disabled = true;
    console.log(taskFormEl.querySelector('input[name="post_date_input"]').value);
    
    docElems.newList.appendChild(taskFormEl);
}

var editOldTask = function(taskEle) {
    var taskFormEl = taskEle.cloneNode(true);
    taskFormEl.classList.add('editing');
    var discriptionEle = taskFormEl.querySelector('.taskdescription');
    var textAreaEle = document.createElement('textarea');
    textAreaEle.innerHTML = discriptionEle.innerHTML;
    discriptionEle.innerHTML = '';
    discriptionEle.appendChild(textAreaEle);

    // var taskPostDateInputEl = taskFormEl.querySelector('input.post_date_input');
    // var taskFormPostDateInputEl = taskPostDateInputEl.cloneNode(true);
    // taskFormPostDateInputEl.classList.remove('hide');
    
    var pdInputEl = document.createElement('input');
    pdInputEl.setAttribute('type', 'date');
    pdInputEl.disabled = true;
    pdInputEl.classList.add('post_date_input');
    var taskPostDateEl = taskFormEl.querySelector('p.post_date');
    pdInputEl.value = taskPostDateEl.innerHTML;
    taskPostDateEl.innerHTML = '';
    taskPostDateEl.appendChild(pdInputEl);

    var ddInputEl = document.createElement('input');
    ddInputEl.setAttribute('type', 'date');
    ddInputEl.classList.add('due_date_input');
    var ddEl = taskFormEl.querySelector('p.due_date');
    ddInputEl.value = ddEl.innerHTML;
    // ddInputEl.setAttribute('value', ddEl.innerHTML)
    // ddInputEl.innerHTML = ddEl.innerHTML;
    ddEl.innerHTML = '';
    ddEl.appendChild(ddInputEl);

    taskFormEl.querySelector('.editbtn').closest('li').classList.add('hide');
    taskFormEl.querySelector('.deletebtn').closest('li').classList.add('hide');
    taskFormEl.querySelector('.save-btn').closest('li').classList.remove('hide');
    taskFormEl.querySelector('.cancel-btn').closest('li').classList.remove('hide');
    taskEle.classList.add('hide');
    docElems.todoList.insertBefore(taskFormEl, taskEle);
}

const setFormId = (taskFormEl) => {

    // create unique (within DOM) form id
    docElems.formCount += 1;
    formid = "form-" + docElems.formCount

    // set form id in form elements and form
    taskFormEl.querySelector('.taskid').form = formid;
    taskFormEl.querySelector('.taskdescription').firstElementChild.form = formid;
    taskFormEl.querySelector('.status').form = formid;
    taskFormEl.querySelector('.editbtn').form = formid;
    taskFormEl.querySelector('FORM').id = formid;
}

// event handling functions

const handleNewTask = (event) => {
    editNewTask();
}

var handleFilterTasks = function(event) {
    var filter = getCheckedValue('filter');
    getTasks(filter).then(rsp => {
        console.log("before reading getTasks response body");
        console.log(rsp);
        payload = rsp.json();
        console.log("after reading getTasks response body");
        console.log(rsp);
        console.log("payload:");
        console.log(payload);
        return payload
    }).then(tasks => {
        console.log(tasks);
        var filterIds = [];
        tasks.forEach(item => {
            // console.log(item.taskid);
            filterIds.push(parseInt(item.taskid));
        });
        hideTasks(filterIds);
    });
}

var handleOrderTasks = function(event) {
    var order = getCheckedValue('order');
    console.log('order', order);
    var field = order.split(':')[0];
    var sortOrder = order.split(':')[1];
    var taskEls = docElems.todoList.children;
    console.log(taskEls);
    sortTaskEls(taskEls, field, sortOrder)
    
}

var sortTaskEls = function(taskEls, field, sortOrder) {
    var arr = [];
    for(var i = 0; i < taskEls.length; i++) {
        var tmp = {};
        tmp.index = i;
        if (field === 'taskid') {
            tmp[field] = taskEls[i].querySelector('input.taskid').value;
        }
        if (field === 'post_date' || field === 'due_date') {
            tmp[field] = taskEls[i].querySelector('p.' + field + '').innerHTML;
        }
        arr.push(tmp);
    }
    console.log('before:', JSON.stringify(arr));
    arr = arr.sort(function(a, b) {
        if (field === 'taskid') {
            if (sortOrder.toLowerCase() === 'asc') {
                return parseInt(a[field]) - parseInt(b[field]);
            } else {
                return parseInt(b[field]) - parseInt(a[field]);
            }
        }
        if (field === 'post_date' || field === 'due_date') {
            var a_field = (new Date(a[field])).getTime() || 0;
            var b_field = (new Date(b[field])).getTime() || 0;
            if (sortOrder.toLowerCase() === 'asc') {
                return a_field - b_field;
            } else {
                return b_field - a_field;
            }
        }
    });
    console.log('after:', JSON.stringify(arr));
    var newEls = [];
    arr.forEach(function(item) {
        console.log(taskEls[item.index]);
        console.log(taskEls[item.index].querySelector('p.post_date').innerHTML);
        console.log(taskEls[item.index].querySelector('p.taskdescription').innerHTML);
        newEls.push(taskEls[item.index]);
        // docElems.todoList.appendChild(taskEls[item.index]);
    });
    docElems.todoList.innerHTML = '';
    newEls.forEach(function(el) {
        docElems.todoList.appendChild(el);
    });
}

var hideTasks = function(filterIds) {
    var taskEles = document.querySelectorAll('#todolist .todoitem');
    taskEles.forEach(taskEle => {
        var taskId = getTaskId(taskEle);
        if (filterIds.indexOf(parseInt(taskId)) === -1) {
            taskEle.classList.add('hide');
        } else {
            if (taskEle.classList.contains('hide')) {
                taskEle.classList.remove('hide');
            }
        }
    });
}

var getCheckedValue = function(name) {
    var nodeList = document.querySelectorAll('input[name="' + name + '"]');
    for (var i = 0; i < nodeList.length; ++i) {
        if (nodeList[i].checked === true) {
            return nodeList[i].value;
        }
    }
}

const handleNewTaskSave = (event) => {
    var taskFormEl = event.target.closest('section.todoitem');
    task = {
        taskdescription: getTaskFormDescription(taskFormEl),
        status: getStatus(taskFormEl),
        post_date: getPostDate(taskFormEl),
        due_date: getDueDate(taskFormEl),
    };
    console.log('task', task);
    console.log('event.preventDefault();', event.preventDefault());
    putTask(task)
        .then(rsp => {
            console.log("before reading putTask response body");
            console.log(rsp);
            payload = rsp.json();
            console.log("after reading putTask response body");
            console.log(rsp);
            console.log("payload:");
            console.log(payload);
            return payload
        })
        .then(task => {
            console.log("task resolving promise:")
            console.log(task);
            // createTaskElement(task);
            appendTaskElement(createTaskElement(task))
            taskFormEl.remove();
        })
}

var getPostDate = function(taskFormEl) {
    var postDataInputEl = taskFormEl.querySelector('input[name="post_date_input"]');
    return postDataInputEl.value;
}

var getDueDate = function(taskFormEl) {
    var dueDataInputEl = taskFormEl.querySelector('input[name="due_date_input"]');
    return dueDataInputEl.value;
}

const handleNewTaskCancel = (event) => {
    var taskFormEl = event.target.closest('section.todoitem');
    taskFormEl.remove()
}

var handleEditTask = function(event) {
    var targetEle = event.target;
    var taskEle = targetEle.closest('SECTION.todoitem');
    editOldTask(taskEle);
    // var taskid = targetEle.closest('SECTION.todoitem').children[0].value;
}

var handleSaveEditTask = function(event) {
    var targetEle = event.target;
    var taskFormEle = targetEle.closest('SECTION.todoitem');
    var taskEle = taskFormEle.nextElementSibling;
    var textAreaEle = taskFormEle.querySelector('textarea');
    var textAreaValue = textAreaEle.value;
    taskEle.querySelector('.taskdescription').innerHTML = textAreaValue;
    taskEle.querySelector('.post_date').innerHTML = taskFormEle.querySelector('input.post_date_input').value;
    taskEle.querySelector('.due_date').innerHTML = taskFormEle.querySelector('input.due_date_input').value;
    taskEle.querySelector('input.status').checked = taskFormEle.querySelector('input.status').checked;

    postTask({
        taskid: taskEle.querySelector('input.taskid').value,
        taskdescription: taskEle.querySelector('.taskdescription').innerHTML,
        status: taskEle.querySelector('input.status').checked ? 'done' : 'tbd',
        post_date: taskEle.querySelector('.post_date').innerHTML,
        due_date: taskEle.querySelector('.due_date').innerHTML,
    }).then(rsp => {
        console.log("before reading postTask response body");
        console.log(rsp);
        payload = rsp.json();
        console.log("after reading postTask response body");
        console.log(rsp);
        console.log("payload:");
        console.log(payload);
        return payload
    }).then(res => {
        console.log('res: ', res);
        if (res && res.taskid == taskEle.querySelector('input.taskid').value) {
            docElems.todoList.removeChild(taskFormEle);
            taskEle.classList.remove('hide');
        }
    })
}

var handleCancelEditTask = function(event) {
    console.log('handleCancelEditTask');
    var targetEle = event.target;
    var taskFormEle = targetEle.closest('SECTION.todoitem');
    var taskEle = taskFormEle.nextElementSibling;
    docElems.todoList.removeChild(taskFormEle);
    taskEle.classList.remove('hide');
}

var handleEditDueDate = function(event) {
    event.preventDefault();
    event.stopPropagation();
    var dueDateEl = event.target.closest('.due_date');
    var due_date = dueDateEl.innerHTML;
    var dueDateInputEl = document.createElement('input');
    dueDateInputEl.setAttribute('type', 'date');
    dueDateInputEl.classList.add('due_date_input');
    dueDateInputEl.classList.add('direct');
    dueDateInputEl.value = due_date;
    dueDateEl.innerHTML = '';
    dueDateEl.appendChild(dueDateInputEl);
    return false;
}

var handleDueDateUpdate = function(event) {
    var ddEl = event.target.closest('.due_date');
    var ddInputEl = ddEl.querySelector('input.due_date_input');
    var taskEle = event.target.closest('SECTION.todoitem');
    var task = {
        taskid: taskEle.querySelector('input.taskid').value,
        taskdescription: taskEle.querySelector('.taskdescription').innerHTML,
        status: taskEle.querySelector('input.status').checked ? 'done' : 'tbd',
        post_date: taskEle.querySelector('.post_date').innerHTML,
        due_date: ddInputEl.value,
    }
    console.log(task);
    postTask(task).then(rsp => {
        console.log("before reading postTask response body");
        console.log(rsp);
        payload = rsp.json();
        console.log("after reading postTask response body");
        console.log(rsp);
        console.log("payload:");
        console.log(payload);
        return payload
    }).then(res => {
        console.log('res: ', res);
        
    })
}

var handleDeleteTask = function(event) {
    var targetEle = event.target;
    console.log(targetEle.parentElement.parentElement.parentElement);
    console.log(targetEle.closest('SECTION.todoitem').children[0].value);
    var taskid = targetEle.closest('SECTION.todoitem').children[0].value;
    deleteTask(taskid).then(rsp => {
        console.log("before reading deleteTask response body");
        console.log(rsp);
        payload = rsp.json();
        console.log("after reading deleteTask response body");
        console.log(rsp);
        console.log("payload:");
        console.log(payload);
        return payload
    })
    .then(res => {
        console.log('res', res);
        var todoItem = targetEle.closest('SECTION.todoitem');
        todoItem.parentNode.removeChild(todoItem);
    })
}

init();


