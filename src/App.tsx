// Import necessary libraries
import React, { useState } from 'react';
import './App.css';

// Define the Task interface
interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');

    // Save tasks to local storage
    const saveTasks = (updatedTasks: Task[]) => {
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    // Add a new task
    const addTask = () => {
        if (newTask.trim() === '') return;
        const newTaskObj: Task = {
            id: Date.now(),
            text: newTask,
            completed: false,
        };
        saveTasks([...tasks, newTaskObj]);
        setNewTask('');
    };

    // Start editing a task
    const startEditingTask = (id: number, currentText: string) => {
        setEditingTaskId(id);
        setEditingText(currentText);
    };

    // Save edited task
    const saveEditedTask = () => {
        if (editingTaskId === null || editingText.trim() === '') return;
        const updatedTasks = tasks.map(task =>
            task.id === editingTaskId ? { ...task, text: editingText } : task
        );
        saveTasks(updatedTasks);
        setEditingTaskId(null);
        setEditingText('');
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditingText('');
    };

    // Delete a task
    const deleteTask = (id: number) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        saveTasks(updatedTasks);
    };

    // Toggle task completion
    const toggleTaskCompletion = (id: number) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks(updatedTasks);
    };

    // Filter tasks based on filter state
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    return (
        <div className="app">
            <h1>To-Do List</h1>
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Add a new task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={addTask}>Add</button>
            </div>
            <div className="filter-group">
                <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
                <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
                <button onClick={() => setFilter('incomplete')} className={filter === 'incomplete' ? 'active' : ''}>Incomplete</button>
            </div>
            <ul className="task-list">
                {filteredTasks.map(task => (
                    <li key={task.id} className={task.completed ? 'completed' : ''}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                        />
                        {editingTaskId === task.id ? (
                            <div className="edit-group">
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="task-text"
                                />
                                <button onClick={saveEditedTask} className="save-btn">Save</button>
                                <button onClick={cancelEditing} className="cancel-btn">Cancel</button>
                            </div>
                        ) : (
                            <span className="task-text" onDoubleClick={() => startEditingTask(task.id, task.text)}>
                                {task.text}
                            </span>
                        )}
                        <button onClick={() => deleteTask(task.id)} className="delete-btn">&times;</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;


