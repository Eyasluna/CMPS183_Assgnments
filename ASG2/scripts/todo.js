//console.log(todoList)
var tmpList = [];
function updateTodoListData(type) {
            var  myselect=document.getElementById("todooption");
            var index = myselect.selectedIndex ;
            var sorttype = myselect.options[index].value;
            var todoList = getDataFromLocalByType(type,sorttype);
            console.log("#########");
            console.log(sorttype);

            var todoListTableBody = document.getElementById('todoListTableBody');
            var length = todoListTableBody.children.length;
            for (i = 0; i < length; i++) {
                todoListTableBody.removeChild(todoListTableBody.children[0]);
            }

            for (i = 0; i < todoList.length; i++) {
                var todo = todoList[i];
                var radios = "";
                if(todo.done == "true"){
                   radios = '<input type="radio" name="status'+ todo.uuid +'" value="true" checked="checked" />done <input type="radio" name="status'+ todo.uuid +'" value="false" />ongoging';
                }else{
                   radios = '<input type="radio" name="status'+ todo.uuid +'" value="true" />done <input type="radio" name="status'+ todo.uuid +'" value="false" checked="checked" />ongoging';
                }
                var doneCheckbox = '<input type="checkbox" title="done" onclick="return false;" >';
                if (todo.done == "true") {
                    doneCheckbox = '<input type="checkbox" title="done" onclick="return false;"  checked>';
                }
                var tr = document.createElement('tr');
                console.log(todo);
                tr.innerHTML = '<td>' + todo.title + '</td><td>' + todo.notes + '</td><td>' + todo.duedate + '</td><td>' + todo.posted + '</td><td>' + todo.updated + '</td><td>' + doneCheckbox + '</td><td><button onclick="editTodoItem(' + todo.uuid + ')">Edit</button><button onclick="deleteItem(' + todo.uuid + ','+ type +')" >Delete</button><div class="modal" id="mo'+ todo.uuid +'"><div class="modaldiv"> <div class="mcaption"><span class="h">Edit the item infomation</span><span class="close" id="close' + todo.uuid + '" onclick="closeModal(' + todo.uuid + ')" >×</span></div><div class="mbody"><form id="editform'+ todo.uuid +'"  onsubmit="submitEditInfo('+todo.uuid+')">Title: <input class="textinput" type="text" id="title'+ todo.uuid +'" placeholder="Please input title" value="'+ todo.title+'" required><br> <br>Notes: <input class="textinput" type="text" id="notes'+ todo.uuid +'" placeholder="Please input notes" value="'+ todo.notes+'" required> <br> <br>Duedate: <input class="textinput" type="date" id="date'+ todo.uuid +'" placeholder="(yyyy-MM-dd)" value="'+ todo.duedate+'" required> <br> <br>Posted: <input class="textinput" type="text" id="posted'+ todo.uuid +'" placeholder="(yyyy-MM-dd)" value="'+ todo.posted+'" readonly> <br> <br>Updated: <input class="textinput" type="text" id="updated'+ todo.uuid +'" placeholder="(yyyy-MM-dd)" value="'+ todo.updated+'" readonly>  <br><br>Status: '+radios+' <br><br><button type="submit" class="editbtn" >Submit</button></form>  </div></div></div></td>';
                todoListTableBody.appendChild(tr);
            }
}

updateTodoListData(0);

function changeTodoDone(index) {
    var todo = todoList[index];
    todo.done = !todo.done;
}
function deleteItem(uuid,type){
  console.log(uuid);
  deleteDataFromLocal(uuid);
  updateTodoListData(type);
}
function editTodoItem(uuid){
  document.getElementById('mo'+uuid).style.display="block";
}
function closeModal(uuid){
        document.getElementById('mo'+uuid).style.display="none";
}
function submitEditInfo(uuid){
  //console.log(uuid);
  var title = document.getElementById('title'+uuid).value;
  var notes = document.getElementById('notes' + uuid).value;
  var duedate = document.getElementById('date' + uuid).value;
  var posted = document.getElementById('posted'+uuid).value;
  var dones = document.getElementsByName('status'+uuid);
  var d = new Date(duedate);
  var da = new Date();

  var value;
  for(var i=0;i<dones.length;i++){
    if(dones[i].checked){
      value = dones[i].value;
      break;
    }
  }
  //console.log(value);
  //alert("xxx");
  if (d < da) {
      alert('Due date is earlier than now.');
  }else{

    var year = da.getFullYear();
    var month = da.getMonth()+1;
    var datetime = da.getDate();
    if(month<10){
      month = "0"+month;
    }
    if(datetime<10){
      datetime = "0"+datetime;
    }
    var updated = [year,month,datetime].join('-');
    updated = updated + " " + da.getHours() + ":" + da.getMinutes() + ":" + da.getSeconds();
    //console.log(posted);
    var item={
      "uuid":uuid,
      "title": title,
      "notes": notes,
      "duedate": duedate,
      "posted":posted,
      "updated":updated,
      "done": value
    };
    //console.log(item);
    alert('Edit todo successfully.');
    editDataFromLocal(item);
    updateTodoListData(0);
    //storeDateToLocal(item);
    //alert("lalal");
  }
}
