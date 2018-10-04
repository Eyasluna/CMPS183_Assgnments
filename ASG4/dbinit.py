import sqlite3
conn = sqlite3.connect('todo.db') # Warning: This file is created in the current directory
conn.execute("DROP TABLE todo")
conn.execute("CREATE TABLE todo (id INTEGER PRIMARY KEY, task char(100) NOT NULL, status bool NOT NULL)")
conn.execute("ALTER TABLE todo ADD COLUMN post_date CHAR(50)")
conn.execute("ALTER TABLE todo ADD COLUMN due_date CHAR(50)")
conn.execute("INSERT INTO todo (task,status, post_date, due_date) VALUES ('Read A-byte-of-python to get a good introduction into Python',0,'2018-01-01', '2018-01-02')")
conn.execute("INSERT INTO todo (task,status, post_date, due_date) VALUES ('Visit the Python website',1,'2018-02-01', '2018-02-10')")
conn.execute("INSERT INTO todo (task,status, post_date, due_date) VALUES ('Test various editors for and check the syntax highlighting',1,'2018-03-01', '2018-03-05')")
conn.execute("INSERT INTO todo (task,status, post_date, due_date) VALUES ('Choose your favorite WSGI-Framework',0,'2018-03-11', '2018-03-14')")
conn.commit()
