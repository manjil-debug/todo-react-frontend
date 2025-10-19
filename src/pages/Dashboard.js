import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Required for Bootstrap tooltips

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/todos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
    } catch (err) {
      setError("Failed to fetch todos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  // Update todo status
  const handleStatusUpdate = async (todoId) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/todos/${todoId}/status`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { completed: true },
      });
      fetchTodos();
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update todo status");
    }
  };

  // Create new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: newTask.title,
        description: newTask.description,
        completed: false,
      };

      await api.post("/todos/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewTask({ title: "", description: "" });
      fetchTodos();
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create new task");
    } finally {
      setCreating(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className="container py-5">
      {/* Header with Logout */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center flex-grow-1">Tasks</h1>
        <button className="btn btn-outline-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Total tasks */}
      <div className="mb-3">
        <strong>Total Tasks: {todos.length}</strong>
      </div>

      {/* Create New Task Form */}
      <div className="card mb-4 shadow-sm p-3">
        <h5 className="mb-3">Create New Task</h5>
        <form className="row g-3" onSubmit={handleCreateTask}>
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-2 d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating}
            >
              {creating ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
              ) : null}
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Todo Table */}
      <div className="card shadow-sm p-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>S.N.</th>
                <th>Tasks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo, index) => (
                <tr
                  key={todo.id}
                  title={todo.description}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                >
                  <td>{index + 1}</td>
                  <td
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#6c757d" : "#212529",
                    }}
                  >
                    {todo.title}
                  </td>
                  <td>
                    {todo.completed ? (
                      <span className="badge bg-success">Completed</span>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(todo.id)}
                      >
                        Pending
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
