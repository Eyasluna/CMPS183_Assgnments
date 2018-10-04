document.getElementById('newTodoForm').onsubmit = function submit() {
    var title = document.getElementById('title').value;
    var notes = document.getElementById('notes').value;
    var date = document.getElementById('date').value;
    var d = new Date(date);
    var da = new Date();
    if (d < da) {
        alert('Due date is earlier than now.');
    } else {
        alert('Add todo successfully.');
        var year = da.getFullYear();
        var month = da.getMonth()+1;
        var datetime = da.getDate();
        var posted = [year,month,datetime].join('-');
        posted = posted + " " + da.getHours() + ":" + da.getMinutes() + ":" + da.getSeconds();
        //console.log(posted);
        year = d.getFullYear();
        month = d.getMonth()+1;
        if(month<10){
          month = "0"+month;
        }
        datetime = d.getDate();
        if(datetime<10){
          datetime = "0"+datetime;
        }
        var duedate = [year,month,datetime].join('-');
        //console.log(duedate);
        var uuid = (new Date()).valueOf();
        var item={
          "uuid":uuid,
          "title": title,
          "notes": notes,
          "duedate": duedate,
          "posted":posted,
          "updated":posted,
          "done": "false"
        }
        //console.log(item);
        storeDataToLocal(item);
        //alert("Add successfully");
        document.getElementById('title').value="";
        document.getElementById('notes').value="";
        document.getElementById('date').value="";
        /*todoList.push();
        */
    }
    return false;
};
