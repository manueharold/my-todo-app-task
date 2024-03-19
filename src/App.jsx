import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineUndo } from 'react-icons/ai';
import ConfirmationModal from './Components/ConfirmationModal';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState('');
  const [currentEditedItem, setCurrentEditedItem] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationCallback, setConfirmationCallback] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Functions for showing confirmation modal
  const showConfirmation = (message, action) => {
    setConfirmationMessage(message);
    setConfirmationCallback(() => action); // Pass the action to the callback
    setShowConfirmationModal(true);
  };

  const hideConfirmation = () => {
    setShowConfirmationModal(false);
  };

  const handleAddTodo = () => {
    // Check if the title field is empty
    if (!newTitle.trim()) {
      setShowErrorModal(true);
      setErrorMessage("Title is required. Please enter a title for the task.");
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
    showConfirmation('Are you sure you want to delete this task?', () => {
      let reducedTodo = [...allTodos];
      reducedTodo.splice(index, 1);
      localStorage.setItem('todolist', JSON.stringify(reducedTodo));
      setTodos(reducedTodo);
    });
  };

  const handleComplete = (index) => {
    showConfirmation('Are you sure you want to mark this task as done?', () => {
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
    });
  };
  
  const handleDeleteCompletedTodo = (index) => {
    showConfirmation('Are you sure you want to delete this completed task?', () => {
      let reducedTodo = [...completedTodos];
      reducedTodo.splice(index, 1);
      localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
      setCompletedTodos(reducedTodo);
    });
  };

  const handleDeleteAll = () => {
    showConfirmation('Are you sure you want to delete all tasks?', () => {
      setTodos([]);
      setCompletedTodos([]);
      localStorage.removeItem('todolist');
      localStorage.removeItem('completedTodos');
    });
  };

  const handleMarkAllComplete = () => {
    showConfirmation('Are you sure you want to mark all tasks as Done?', () => {
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
    });
  };

  const handleMarkAllNotComplete = () => {
    showConfirmation('Are you sure you want to mark all tasks as Undone?', () => {
      // Iterate through completedTodos and move them to allTodos
      let updatedAllTodos = [...allTodos, ...completedTodos];
      setTodos(updatedAllTodos);
      setCompletedTodos([]);
      localStorage.setItem('todolist', JSON.stringify(updatedAllTodos));
      localStorage.removeItem('completedTodos');
    });
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

  // Inside handleUpdateToDo function
const handleUpdateToDo = () => {
  // Check if title and description are not empty
  if (!currentEditedItem.title.trim()) {
    setErrorMessage("Title cannot be empty. Please fill it out before updating.");
    setShowErrorModal(true);
    return; // Exit the function if either title or description is empty
  }

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

      <ConfirmationModal
  isOpen={showConfirmationModal}
  message={confirmationMessage}
  onConfirm={() => {
    hideConfirmation(); // Hide the modal
    if (confirmationCallback) {
      confirmationCallback(); // Execute the confirmation callback if provided
    }
  }}
  onCancel={hideConfirmation} // Hide the modal if the user cancels
/>

      <ConfirmationModal
  isOpen={showErrorModal}
  message={errorMessage}
  onConfirm={() => setShowErrorModal(false)}
  onCancel={() => setShowErrorModal(false)}
/>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title (Required) </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task Title"
            />
          </div>
          <div className="todo-input-item">
            <label>Description (Optional) </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Task Description"
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
            completedTodos.map((item, index) => (
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
            ))}
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
