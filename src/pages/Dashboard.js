import React, { useState, useEffect } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleDelete = async (todoId) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/todos/${todoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setError("Failed to delete todo");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to login
  };

  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Tasks</h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="d-flex justify-content-around text-center mb-4">
        <div>
          <h5 className="text-primary mb-0">Total Tasks</h5>
          <p className="fs-4 fw-bold mb-0">{totalTasks}</p>
        </div>
        <div>
          <h5 className="text-success mb-0">Completed</h5>
          <p className="fs-4 fw-bold mb-0">{completedTasks}</p>
        </div>
        <div>
          <h5 className="text-warning mb-0">Pending</h5>
          <p className="fs-4 fw-bold mb-0">{pendingTasks}</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-borderless align-middle">
          <thead className="table-light">
            <tr>
              <th>S.N</th>
              <th>Task</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <tr
                key={todo.id}
                title={todo.description || "No description provided"}
              >
                <td>{index + 1}</td>
                <td
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: todo.completed ? "gray" : "black",
                  }}
                >
                  {todo.title}
                </td>
                <td>
                  {todo.completed ? (
                    <span className="badge bg-success">Completed</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Pending</span>
                  )}
                </td>
                <td className="text-end">
                  {!todo.completed && (
                    <button
                      className="btn btn-sm btn-outline-success me-2"
                      onClick={() => handleStatusUpdate(todo.id)}
                    >
                      Mark Done
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {todos.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
