var todoList = [];
ajax("/get_list", "get", null, function(data) {
  todoList = JSON.parse(data);
  updateTodoListData(0);
});

function sort() {
  var myselect = document.getElementById("todooption");
  var index = myselect.selectedIndex;
  var orderby = myselect.options[index].value;

  ajax("/get_list?orderby=" + orderby, "get", null, function(data) {
    todoList = JSON.parse(data);
    updateTodoListData(0);
  });
}

function show_all() {
  ajax("/get_list", "get", null, function(data) {
    todoList = JSON.parse(data);
    updateTodoListData(0);
  });
}

function show_complete() {
  ajax("/get_complete", "get", null, function(data) {
    todoList = JSON.parse(data);
    updateTodoListData(0);
  });
}

function show_wait() {
  ajax("/get_wait", "get", null, function(data) {
    todoList = JSON.parse(data);
    updateTodoListData(0);
  });
}

function updateTodoListData(type) {
  var todoListTableBody = document.getElementById("todoListTableBody");
  var length = todoListTableBody.children.length;
  for (i = 0; i < length; i++) {
    todoListTableBody.removeChild(todoListTableBody.children[0]);
  }

  for (i = 0; i < todoList.length; i++) {
    var item = todoList[i];
    var todo = {
      id: item[0],
      title: item[1],
      description: item[2],
      posted: item[3],
      due: item[4],
      updated: item[5],
      status: item[6]
    };
    var radios = "";
    if (todo.status == 1) {
      radios =
        '<input type="radio" name="status' +
        todo.id +
        '" value="true" checked="checked" />done <input type="radio" name="status' +
        todo.id +
        '" value="false" />ongoging';
    } else {
      radios =
        '<input type="radio" name="status' +
        todo.id +
        '" value="true" />done <input type="radio" name="status' +
        todo.id +
        '" value="false" checked="checked" />ongoging';
    }
    var doneCheckbox =
      '<input type="checkbox" title="status" onclick="changeDoneState(' +
      todo.id +
      ', true)" >';
    if (todo.status == 1) {
      doneCheckbox =
        '<input type="checkbox" title="status" onclick="changeDoneState(' +
        todo.id +
        ', false)"  checked>';
    }
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" +
      todo.title +
      "</td><td>" +
      todo.description +
      "</td><td>" +
      todo.due +
      "</td><td>" +
      todo.posted +
      "</td><td>" +
      todo.updated +
      "</td><td>" +
      doneCheckbox +
      '</td><td><button onclick="editTodoItem(' +
      todo.id +
      ')">Edit</button><button onclick="deleteItem(' +
      todo.id +
      "," +
      type +
      ')" >Delete</button><div class="modal" id="mo' +
      todo.id +
      '"><div class="modaldiv"> <div class="mcaption"><span class="h">Edit the item infomation</span><span class="close" id="close' +
      todo.id +
      '" onclick="closeModal(' +
      todo.id +
      ')" >\xD7</span></div><div class="mbody"><form id="editform' +
      todo.id +
      '"  onsubmit="return submitEditInfo(' +
      todo.id +
      ')">Title: <input class="textinput" type="text" id="title' +
      todo.id +
      '" placeholder="Please input title" value="' +
      todo.title +
      '" required><br> <br>Notes: <input class="textinput" type="text" id="description' +
      todo.id +
      '" placeholder="Please input notes" value="' +
      todo.description +
      '" required> <br> <br>Duedate: <input class="textinput" type="date" id="date' +
      todo.id +
      '" placeholder="(yyyy-MM-dd)" value="' +
      todo.due +
      '" required> <br> <br>Posted: <input class="textinput" type="text" id="posted' +
      todo.id +
      '" placeholder="(yyyy-MM-dd)" value="' +
      todo.posted +
      '" readonly> <br> <br>Updated: <input class="textinput" type="text" id="updated' +
      todo.id +
      '" placeholder="(yyyy-MM-dd)" value="' +
      todo.updated +
      '" readonly>  <br><br>Status: ' +
      radios +
      ' <br><br><button type="submit" class="editbtn" >Submit</button></form>  </div></div></div></td>';
    todoListTableBody.appendChild(tr);
  }
}

updateTodoListData(0);

function changeTodoDone(index) {
  var todo = todoList[index];
  todo.status = !todo.status;
}

function deleteItem(id, type) {
  ajax("/delete/" + id, "get", null, function() {
    alert("Delete todo successfully.");
    location.reload();
  });
  deleteDataFromLocal(id);
  updateTodoListData(type);
}

function editTodoItem(id) {
  document.getElementById("mo" + id).style.display = "block";
}

function closeModal(id) {
  document.getElementById("mo" + id).style.display = "none";
}

function submitEditInfo(id) {
  //console.log(id);
  var title = document.getElementById("title" + id).value;
  var description = document.getElementById("description" + id).value;
  var duedate = document.getElementById("date" + id).value;
  var posted = document.getElementById("posted" + id).value;
  var dones = document.getElementsByName("status" + id);
  var d = new Date(duedate);
  var da = new Date();

  var value;

  if (dones[0].checked) {
    value = true
  } else {
    value = false
  }

  // for (var i = 0; i < dones.length; i++) {
  //   if (dones[i].checked) {
  //     value = dones[i].value;
  //     break;
  //   }
  // }
  //console.log(value);
  //alert("xxx");
  if (d < da) {
    alert("Due date is earlier than now.");
    return false
  } else {
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var datetime = da.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (datetime < 10) {
      datetime = "0" + datetime;
    }
    var updated = [year, month, datetime].join("-");
    var item = {
      title: title,
      description: description,
      due: duedate,
      status: !!value ? 1 : 0,
      updated: updated
    };

    ajax("/edit/" + id, "post", item, function() {
      alert("Edit todo successfully.");
      location.reload();
    });
    return false
  }
}

function changeDoneState(id, status) {
  var item = {
    status: !!status ? 1 : 0
  };

  ajax("/edit_done/" + id, "post", item, function() {
    show_all();
  });
}
