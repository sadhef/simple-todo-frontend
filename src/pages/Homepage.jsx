import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../utils/api';
import TodoList from '../components/TodoList';

function HomePage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to fetch todos');
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await createTodo({ title: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo');
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const todoToToggle = todos.find(todo => todo._id === id);
      const updatedTodo = await updateTodo(id, { completed: !todoToToggle.completed });
      setTodos(todos.map(todo => todo._id === id ? updatedTodo.data : todo));
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Todo List</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Logout
              </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleAddTodo} className="mb-6">
              <div className="flex items-center border-b border-gray-300 py-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="New todo"
                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
                >
                  Add Todo
                </button>
              </div>
            </form>
            <TodoList
              todos={todos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;