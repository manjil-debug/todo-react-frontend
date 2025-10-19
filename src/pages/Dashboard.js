import React, { useState, useEffect } from "react";
import api from "../api";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/todos/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            completed: true, // <-- sent as query parameter
        },
        });

        // Refresh the todos list after successful update
        fetchTodos();
    } catch (err) {
        console.error("Failed to update status:", err);
        setError("Failed to update todo status");
    }
    };


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Todo List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td className="px-6 py-4 whitespace-nowrap">{todo.title}</td>
                <td className="px-6 py-4">{todo.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {todo.completed ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate(todo.id)}
                      className="px-4 py-2 text-xs font-semibold rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
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