import sqlite3
import json
from bottle import route, run, static_file, request, post, TEMPLATE_PATH, response

connection = sqlite3.connect("./todo.db")

@route('/static/<filename:path>')
def send_static(filename):
    return static_file(filename, root='templates')


@route('/images/<filename:re:.*\.jpg>')
def send_image(filename):
    return static_file(filename, root='images', mimetype='image/jpg')


@route('/index')
def show_index():
    return static_file('index.html', root='templates')


@route('/list')
def show_list():
    return static_file('todo.html', root='templates')


@route('/new')
def show_new():
    return static_file('todoForm.html', root='templates')


@route('/get_list')
def get_list():
    c = connection.cursor()
    rows = c.execute("SELECT * FROM TODO").fetchall()

    if 'orderby' in request.query:
        ordertype = request.query['orderby']

        if ordertype == 'due':
            rows.sort(key=lambda r: r[4])
        elif ordertype == 'updated':
            rows.sort(key=lambda r: r[5])
        else:
            rows.sort(key=lambda r: r[3])
        pass

    rows.reverse()
    response.add_header('content-type', 'application/json')
    return json.dumps(rows)

@route('/get_complete')
def get_complete():
    c = connection.cursor()
    rows = c.execute("SELECT * FROM TODO WHERE status = 1").fetchall()
    response.add_header('content-type', 'application/json')
    return json.dumps(rows)

@route('/get_wait')
def get_wait():
    c = connection.cursor()
    rows = c.execute("SELECT * FROM TODO WHERE status = 0").fetchall()
    response.add_header('content-type', 'application/json')
    return json.dumps(rows)


@post('/new_todo')
def add_todo():
    c = connection.cursor()
    c.execute("INSERT INTO TODO(title, description, due) VALUES (?,?,?)", (request.json['title'], request.json['description'], request.json['due']))
    connection.commit()
    return "add success"


@route('/delete/<todo_id>')
def delete_todo(todo_id):
    c = connection.cursor()
    c.execute("DELETE FROM TODO WHERE id = ?;", (todo_id,))
    connection.commit()
    return 'delete success'


@post('/edit/<todo_id>')
def edit_todo(todo_id):
    c = connection.cursor()
    c.execute("UPDATE TODO SET title = ?, description = ?,due = ?, status = ?, updated = ? WHERE id = ?;", (request.json['title'], request.json['description'], request.json['due'], request.json['status'],
      request.json['updated'], int(todo_id)))
    connection.commit()
    return 'edit success'


@post('/edit_done/<todo_id>')
def edit_todo(todo_id):
    c = connection.cursor()
    c.execute("UPDATE TODO SET status = ? WHERE id = ?;", (request.json['status'], todo_id))
    connection.commit()
    return 'edit success'


run(host='0.0.0.0', port=1234, debug=True)
