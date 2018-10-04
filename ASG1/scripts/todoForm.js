document.getElementById('newTodoForm').onsubmit = function submit() {
    var title = document.getElementById('title');
    var notes = document.getElementById('notes');
    var date = document.getElementById('date');
    var d = new Date(date.value);
    if (d < new Date()) {
        alert('Due date is earlier than now.');
    } else {
        alert('Add todo successfully.');
    }
    return false;
};