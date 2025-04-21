import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ToDoList.css";

const ToDoList = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get(`http://localhost:5000/api/todo/${user._id}`);
      setTasks(res.data);
    };
    fetchTasks();
  }, [user._id]);

  const handleAdd = async () => {
    if (!input.trim()) return;
    const res = await axios.post("http://localhost:5000/api/todo", {
      userId: user._id,
      task: input,
      dueDate,
      priority,
    });
    setTasks([...tasks, res.data]);
    setInput("");
    setDueDate("");
    setPriority("Medium");
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/todo/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const toggleComplete = async (id, currentStatus) => {
    const res = await axios.put(`http://localhost:5000/api/todo/${id}`, {
      completed: !currentStatus,
    });
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="main-layout">
      <header className="header">My To-Do List</header>

      <div className="todo-container">
        <h2>To-Do List</h2>
        <div className="progress">
          Completed: {completedCount} / {tasks.length}
        </div>
        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New Task"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button onClick={handleAdd}>Add</button>
        </div>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className={`task-item ${task.completed ? "completed" : ""}`}>
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task._id, task.completed)}
                />
                <div className="task-text">
                  <strong>{task.task}</strong><br />
                  <small>Priority: {task.priority}</small><br />
                  <small>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</small>
                </div>
              </div>
              <button className="delete" onClick={() => handleDelete(task._id)}>✕</button>
            </li>
          ))}
        </ul>
      </div>

      <footer className="footer">© 2025 Abhay Kumar</footer>
    </div>
  );
};

export default ToDoList;
