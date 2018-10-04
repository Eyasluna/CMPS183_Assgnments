#Requirements

Rework the static website you built in Homework 1 as follows:
index.html

Revise your index page based on the feedback you received in the peer reviews.
If you did not submit Homework 1, build a simple index page provides access to the todo.html and
todoForm.html pages.

todo.html
Add the following features to your todo list items:
1. Posted: date when the item was first posted; set this date automatically
2. Last Updated: date when the item was last updated; set this date automatically
3. Edit: a button that makes the item editable in place (without leaving the page);
pre-populate the edit form with the current data;
prevent the user from modifying the Posted or Last Updated date;
be sure to update the “database” (see below).
4. Delete: a button that deletes the item from the todo list
Add the following features to your todo list:
1. Sort: the user can sort the list by either Posted Date, Last Updated date, or Due Date.
Allow the user to sort in ascending (older items first) or descending order (newer items first).
2. Filter: filter the list to show only completed or incomplete tasks
(your page already has this capability; you may change how this feature is implemented)
3. Dynamically built list: Instead of putting the HTML code for the initial list items, build the list
items dynamically using JavaScript. Store the data for the initial items in a JavaScript object (the
“database”). You may want to store the selections for sorting and filtering as well. When the
todo.html is loaded, call a Javascript function to construct the list items from the data.
todoForm.html
Add the following features to your todo form:
1. Check that the due date does not precede the posted date.
2. Submit: Submit button; when clicked, the new item is added to the “database” and the
todo.html page is displayed.
Header
Make the header read “cmps183: Homework 2”.

File organization
Folder structure:
a) Put the html files in folder called cmps183hw2.
b) Put your css files in a subfolder called css.
c) Put your javascript files in subfolder called scripts.
d) Put your pictures in a folder called images
