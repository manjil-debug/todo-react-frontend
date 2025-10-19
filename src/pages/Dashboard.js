import React, { useState, useEffect } from "react";
import api from "../api";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);

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
  }, []);

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
      fetchTodos(); // Refresh the list
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create new task");
    } finally {
      setCreating(false);
    }
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
      <h1 className="text-center mb-4">Your Todo List</h1>

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
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
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
  );
};

export default Dashboard;
