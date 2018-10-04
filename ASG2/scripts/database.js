
//var todoListstr = '[{"title": "title1","notes": "notes1","date": "2018-01-20","done": true  } ]';
function stringToJson(todoListstr){
  //var todoListstr = getDataFromLocal();
  var res = [];
  if(todoListstr != null){
    res = JSON.parse(todoListstr);
  }
  return res;
}
function sortBy(attr,rev){
    //asc
    if(rev ==  0){
        rev = 1;
    }else{
        rev = (rev) ? 1 : -1;
    }

    return function(a,b){
        a = a[attr];
        b = b[attr];
        if(a < b){
            return rev * -1;
        }
        if(a > b){
            return rev * 1;
        }
        return 0;
    }
}
function jsonToString(todoList){
  //var todoListstr = getDataFromLocal();
  var res = [];
  if(todoListstr != null){
    res = JSON.parse(todoListstr);
  }
  return res;
}
function getDataFromLocal(){
   var todoListstr = window.localStorage.getItem("datas");
   var todoList = stringToJson(todoListstr);
   return todoList;
}
function getDataFromLocalByType(type,sorttype){
  var todoListstr = window.localStorage.getItem("datas");
  var todoList = stringToJson(todoListstr);
  var res = [];
  console.log(todoList);
  if(type === 1)//complete
  {
    for(var i=0;i<todoList.length;i++){
      if(todoList[i].done == "true"){
        res.push(todoList[i]);
      }
    }
  }else if(type === 2){
    for(var i=0;i<todoList.length;i++){
      if(todoList[i].done == "false"){
        res.push(todoList[i]);
      }
    }
  }else{
    res = todoList;
  }
  console.log(res);
  /* sort */
  var attr = "uuid";
  switch (sorttype) {
    case "10":
      res.sort(sortBy('posted',false))
      break;
    case "11":
      res.sort(sortBy('posted'))
      break;
    case "20":
      res.sort(sortBy('updated',false))
      break;
    case "21":
      res.sort(sortBy('updated'))
      break;
    case "30":
      res.sort(sortBy('duedate',false))
      break;
    case "31":
      res.sort(sortBy('duedate'))
      break;
    default:
      res.sort(sortBy('uuid',false))

  }
  res.sort(sortBy('number',false));
   return res;
}
function storeDataToLocal(item){
  var todoList = getDataFromLocal();
  todoList.push(item);
  var todoListstr = JSON.stringify(todoList);
  window.localStorage.setItem("datas",todoListstr);
  console.log(todoList);
}
function deleteDataFromLocal(uuid){
  var todoList = getDataFromLocal();
  var flag = -1;
  for(var i=0;i<todoList.length;i++){
    if(todoList[i].uuid == uuid){
      flag = i;
    }
  }
  if(flag != -1){
    todoList.splice(flag, 1);
  }
  var todoListstr = JSON.stringify(todoList);
  window.localStorage.setItem("datas",todoListstr);
  //return todoList;
}
function editDataFromLocal(item){
  var todoList = getDataFromLocal();
  for(var i=0;i<todoList.length;i++){
    if(todoList[i].uuid == item.uuid){
      todoList[i] = item;
      break;
    }
  }
  var todoListstr = JSON.stringify(todoList);
  window.localStorage.setItem("datas",todoListstr);
}
