//var todoListstr = '[{"title": "title1","description": "description1","date": "2018-01-20","done": true  } ]';
function stringToJson(todoListstr) {
  //var todoListstr = getDataFromLocal();
  var res = []
  if (todoListstr != null) {
    res = JSON.parse(todoListstr)
  }
  return res
}

function sortBy(attr, rev) {
  //asc
  if (rev == 0) {
    rev = 1
  } else {
    rev = (rev) ? 1 : -1
  }

  return function (a, b) {
    a = a[attr]
    b = b[attr]
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return rev * 1
    }
    return 0
  }
}

function getDataFromLocal() {
  var todoListstr = window.localStorage.getItem('datas')
  var todoList = stringToJson(todoListstr)
  return todoList
}

function deleteDataFromLocal(id) {
  var todoList = getDataFromLocal()
  var flag = -1
  for (var i = 0; i < todoList.length; i++) {
    if (todoList[i].id == id) {
      flag = i
    }
  }
  if (flag != -1) {
    todoList.splice(flag, 1)
  }
  var todoListstr = JSON.stringify(todoList)
  window.localStorage.setItem('datas', todoListstr)
  //return todoList;
}

function editDataFromLocal(item) {
  var todoList = getDataFromLocal()
  for (var i = 0; i < todoList.length; i++) {
    if (todoList[i].id == item.id) {
      todoList[i] = item
      break
    }
  }
  var todoListstr = JSON.stringify(todoList)
  window.localStorage.setItem('datas', todoListstr)
}

function ajax (url, type, data, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open(type, url)
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.onload = function () {
    callback(xhr.responseText)
  }
  xhr.send(JSON.stringify(data))
}
