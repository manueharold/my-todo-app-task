import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineUndo } from 'react-icons/ai';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState('');
  const [currentEditedItem, setCurrentEditedItem] = useState('');

  const handleAddTodo = () => {
    // Check if the title field is empty
    if (!newTitle.trim()) {
      alert("Title is required. Please enter a title for the task.");
      return; // Exit the function if the title is empty
    }
  
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };

    let updatedTodoArr = [...allTodos];
  updatedTodoArr.push(newTodoItem);
  setTodos(updatedTodoArr);
  localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));

  // Clear the text fields after adding a task
  setNewTitle('');
  setNewDescription('');
};

  const handleDeleteTodo = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      let reducedTodo = [...allTodos];
      reducedTodo.splice(index, 1);
      localStorage.setItem('todolist', JSON.stringify(reducedTodo));
      setTodos(reducedTodo);
    }
  };

  const handleComplete = (index) => {
    const confirmComplete = window.confirm('Are you sure you want to mark this task as done?');
    if (confirmComplete) {
      let now = new Date();
      let dd = now.getDate();
      let mm = now.getMonth() + 1;
      let yyyy = now.getFullYear();
      let h = now.getHours();
      let m = now.getMinutes();
      let s = now.getSeconds();
      let completedOn = dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

      let filteredItem = {
        ...allTodos[index],
        completedOn: completedOn,
      };

      let updatedCompletedArr = [...completedTodos];
      updatedCompletedArr.push(filteredItem);
      setCompletedTodos(updatedCompletedArr);

      // Remove the completed item from allTodos
      let updatedAllTodos = [...allTodos];
      updatedAllTodos.splice(index, 1);
      setTodos(updatedAllTodos);

      localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
      localStorage.setItem('todolist', JSON.stringify(updatedAllTodos)); // Update local storage for allTodos
    }
  };
  
  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  const handleDeleteAll = () => {
    const confirmDeleteAll = window.confirm('Are you sure you want to delete all tasks?');
    if (confirmDeleteAll) {
      setTodos([]);
      setCompletedTodos([]);
      localStorage.removeItem('todolist');
      localStorage.removeItem('completedTodos');
    }
  };

  const handleMarkAllComplete = () => {
    const confirmMarkAllComplete = window.confirm('Are you sure you want to mark all tasks as Done?');
    if (confirmMarkAllComplete) {
      const now = new Date();
      const completedOn = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  
      const updatedAllTodos = allTodos.map(todo => ({
        ...todo,
        completedOn: completedOn
      }));
  
      setCompletedTodos([...completedTodos, ...updatedAllTodos]);
      setTodos([]);
      localStorage.setItem('completedTodos', JSON.stringify([...completedTodos, ...updatedAllTodos]));
      localStorage.removeItem('todolist');
    }
  };

  const handleMarkAllNotComplete = () => {
    const confirmMarkAllNotComplete = window.confirm('Are you sure you want to mark all tasks as Undone?');
    if (confirmMarkAllNotComplete) {
      // Iterate through completedTodos and move them to allTodos
      let updatedAllTodos = [...allTodos, ...completedTodos];
      setTodos(updatedAllTodos);
      setCompletedTodos([]);
      localStorage.setItem('todolist', JSON.stringify(updatedAllTodos));
      localStorage.removeItem('completedTodos');
    }
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  const handleEdit = (ind, item) => {
    console.log(ind);
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };

  const handleUndone = (index) => {
    const confirmUndone = window.confirm('Are you sure you want to mark this task as undone?');
    if (confirmUndone) {
      // Move the task from completedTodos to allTodos
      const undoneItem = completedTodos[index];
      const updatedAllTodos = [...allTodos, undoneItem];
      const updatedCompletedTodos = completedTodos.filter((_, idx) => idx !== index);
  
      setTodos(updatedAllTodos);
      setCompletedTodos(updatedCompletedTodos);
  
      localStorage.setItem('todolist', JSON.stringify(updatedAllTodos));
      localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedTodos));
    }
  };

  const handleUpdateToDo = () => {
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo);
    setCurrentEdit('');
  
    // Update local storage with the new list of todos
    localStorage.setItem('todolist', JSON.stringify(newToDo));
  };

  return (
    <div className="App">
      <h1 className="todo-header">My Todos</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title (Required) </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description (Optional) </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <button type="button" onClick={handleAddTodo} className="primaryBtn">
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Done
          </button>
        </div>

        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className="edit__wrapper" key={index}>
                    <input
                      placeholder="Updated Title"
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      placeholder="Updated Description"
                      rows={4}
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <button type="button" onClick={handleUpdateToDo} className="primaryBtn">
                      Update
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3 style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>{item.title}</h3>
                      <p style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>{item.description}</p>
                    </div>
                    <div>
                      <AiOutlineDelete className="icon" onClick={() => handleDeleteTodo(index)} title="Delete?" />
                      <BsCheckLg className="check-icon" onClick={() => handleComplete(index)} title="Done?" />
                      <AiOutlineEdit className="check-icon" onClick={() => handleEdit(index, item)} title="Edit?" />
                    </div>
                  </div>
                );
              }
            })}
          {isCompleteScreen === true &&
        completedTodos.map((item, index) => {
          return (
          <div className="todo-list-item" key={index}>
          <div>
          <h3 style={{ textDecoration: 'line-through' }}>{item.title}</h3>
          <p style={{ textDecoration: 'line-through' }}>{item.description}</p>
          <p><small>Done on: {item.completedOn}</small></p>
          </div>
          <div>
          <AiOutlineDelete
            className="icon"
            onClick={() => handleDeleteCompletedTodo(index)}
            title="Delete?"
          />
          <AiOutlineUndo
            className="check-icon"
            onClick={() => handleUndone(index)}
            title="Undone?"
          />
        </div>
        </div>
      );
      })}
        </div>
        {/* Buttons for delete all and mark all */}
        <div className="todo-actions">
          {isCompleteScreen === false ? (
            <>
              <button className="delete-all-btn" onClick={handleDeleteAll}>
                Delete All
              </button>
              <button className="mark-all-complete-btn" onClick={handleMarkAllComplete}>
                Mark All as Done
              </button>
            </>
          ) : (
            <>
              <button className="delete-all-btn" onClick={handleDeleteAll}>
                Delete All
              </button>
              <button className="mark-all-not-complete-btn" onClick={handleMarkAllNotComplete}>
                Mark All as Undone
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
