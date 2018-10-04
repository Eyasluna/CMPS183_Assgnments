var todoList = [];
var tmpList = [];
todoList = [
    {
      "title": "Begin to learn JAVA",
      "notes": "Hello World!",
      "date": "2018-02-02",
      "done": true
    },
    {
      "title": "Read and practice",
      "notes": "Hello World!",
      "date": "2018-02-15",
      "done": true
    },
    {
      "title": "Read and practice",
      "notes": "Hello World!",
      "date": "2018-02-20",
      "done": false
    },
    {
      "title": "Gave up",
      "notes": "System.out.give up()",
      "date": "2018-02-25",
      "done": false
    }
  ];
function updateTodoListData(type) {
    
            
            var i = 0;
            if (type === 1) {
                var completedList = [];
                for (i = 0; i < todoList.length; i++) {
                    if (todoList[i].done) {
                        completedList.push(todoList[i]);
                    }
                }
                tmpList = completedList;
            } else if (type === 2) {
                var notCompletedList = [];
                for (i = 0; i < todoList.length; i++) {
                    if (!todoList[i].done) {
                        notCompletedList.push(todoList[i]);
                    }
                }
                tmpList = notCompletedList;
            }else{
                tmpList = todoList;
            }

            var todoListTableBody = document.getElementById('todoListTableBody');
            var length = todoListTableBody.children.length;
            for (i = 0; i < length; i++) {
                todoListTableBody.removeChild(todoListTableBody.children[0]);
            }

            for (i = 0; i < tmpList.length; i++) {
                var todo = tmpList[i];
                var k = -1;
                for(var j = 0;j< todoList.length;j++){
                    if (todoList[j] ==tmpList[i]){
                        k = j;
                    }
                }
                var doneCheckbox = '<input type="checkbox" title="done" onchange="changeTodoDone(' + k + ')">';
                if (todo.done) {
                    doneCheckbox = '<input type="checkbox" title="done" onchange="changeTodoDone(' + k + ')" checked>';
                }
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + todo.title + '</td><td>' + todo.notes + '</td><td>' + todo.date + '</td><td>' + doneCheckbox + '</td>';
                todoListTableBody.appendChild(tr);
            }
}

updateTodoListData();

function changeTodoDone(index) {
    var todo = todoList[index];
    todo.done = !todo.done;
}
