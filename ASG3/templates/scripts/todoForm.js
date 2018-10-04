document.getElementById('newTodoForm').onsubmit = function submit () {
  var title = document.getElementById('title').value
  var description = document.getElementById('description').value
  var date = document.getElementById('date').value
  var d = new Date(date)
  var da = new Date()
  if (d < da) {
    alert('Due date is earlier than now.')
  } else {
    var year = da.getFullYear()
    var month = da.getMonth() + 1
    var datetime = da.getDate()
    var posted = [year, month, datetime].join('-')
    posted = posted + ' ' + da.getHours() + ':' + da.getMinutes() + ':' + da.getSeconds()
    //console.log(posted);
    year = d.getFullYear()
    month = d.getMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    datetime = d.getDate()
    if (datetime < 10) {
      datetime = '0' + datetime
    }
    var due = [year, month, datetime].join('-')
    var item = {
      'title': title,
      'description': description,
      'due': due
    }
    ajax('/new_todo', 'post', item, function () {
      alert('Add successfully')
      document.getElementById('title').value = ''
      document.getElementById('description').value = ''
      document.getElementById('date').value = ''
    })
  }
  return false
}
