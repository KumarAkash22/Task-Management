import '../App.css'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteTask, getTasks } from '../lib/api'

const formatDate = (value) => {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return date.toISOString().split('T')[0]
}

function Dashboard() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [taskToDelete, setTaskToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        let isMounted = true

        async function loadTasks() {
            try {
                const response = await getTasks()
                if (isMounted) {
                    setTasks(response.tasks || [])
                }
            } catch (loadError) {
                if (isMounted) {
                    setError(loadError.message || 'Failed to load tasks')
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadTasks()

        return () => {
            isMounted = false
        }
    }, [])

    async function handleDelete() {
        if (!taskToDelete) return

        setDeleting(true)
        try {
            await deleteTask(taskToDelete._id)
            setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskToDelete._id))
            setTaskToDelete(null)
            setDeleteSuccess('Task deleted successfully.')
            window.setTimeout(() => setDeleteSuccess(''), 3000)
        } catch (deleteError) {
            setError(deleteError.message || 'Failed to delete task')
        } finally {
            setDeleting(false)
        }
    }

    const summary = useMemo(() => {
        const total = tasks.length
        const pending = tasks.filter((task) => task.status === 'Pending').length
        const completed = tasks.filter((task) => task.status === 'Completed').length

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const overdue = tasks.filter((task) => {
            if (!task.dueDate || task.status === 'Completed') return false
            const dueDate = new Date(task.dueDate)
            dueDate.setHours(0, 0, 0, 0)
            return dueDate < today
        }).length

        return [
            { label: 'Total', value: String(total), tone: 'total' },
            { label: 'Pending', value: String(pending), tone: 'pending' },
            { label: 'Completed', value: String(completed), tone: 'completed' },
            { label: 'Overdue', value: String(overdue), tone: 'overdue' },
        ]
    }, [tasks])

    return (
        <div className="dashboard-page">
            <div className="dashboard-shell">
                <header className="dashboard-header">
                    <div>
                        <p className="eyebrow">Overview</p>
                        <h1>Dashboard</h1>
                    </div>

                    <Link to="/create-task" className="primary-btn">
                        + Add Task
                    </Link>
                </header>
                {deleteSuccess && <p className="success-message" role="status">{deleteSuccess}</p>}

                <section className="summary-grid">
                    {summary.map((item) => (
                        <div key={item.label} className={`summary-card ${item.tone}`}>
                            <p>{item.label}</p>
                            <strong>{item.value}</strong>
                        </div>
                    ))}
                </section>

                <section className="table-panel">
                    <div className="table-toolbar">
                        <div className="search-box">
                            <span>🔎</span>
                            <input type="text" placeholder="Search..." />
                        </div>
                        <button type="button" className="secondary-btn">
                            Filter
                        </button>
                    </div>

                    <div className="table-wrapper">
                        {loading ? (
                            <p className="table-empty">Loading tasks...</p>
                        ) : error ? (
                            <p className="table-empty error-text">{error}</p>
                        ) : tasks.length === 0 ? (
                            <p className="table-empty">No tasks yet. Create your first task to see it here.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Priority</th>
                                        <th>Assigned</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task, index) => (
                                        <tr key={task._id || `${task.title}-${index}`}>
                                            <td>{task.title}</td>
                                            <td>{task.description || '-'}</td>
                                            <td>
                                                <span className={`priority ${task.priority?.toLowerCase()}`}>
                                                    {task.priority || 'Medium'}
                                                </span>
                                            </td>
                                            <td>{formatDate(task.assignedDate)}</td>
                                            <td>{formatDate(task.dueDate)}</td>
                                            <td>
                                                <span className={`status ${task.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                                    {task.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="task-actions">
                                                    <button
                                                        type="button"
                                                        className="icon-btn view-btn"
                                                        title="View and edit task"
                                                        aria-label={`View ${task.title}`}
                                                        onClick={() => navigate(`/create-task/${task._id}`)}
                                                    >
                                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                                            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                                            <circle cx="12" cy="12" r="2.5" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="icon-btn delete-btn"
                                                        title="Delete task"
                                                        aria-label={`Delete ${task.title}`}
                                                        onClick={() => setTaskToDelete(task)}
                                                    >
                                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                                            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7l1-3h4l1 3" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="pagination">
                        <span>
                            {tasks.length === 0
                                ? 'Showing 0 tasks'
                                : `Showing ${tasks.length} task(s)`}
                        </span>

                        <div className="pagination-buttons">
                            <button type="button" className="page-btn active">
                                1
                            </button>
                            <button type="button" className="page-btn">
                                2
                            </button>
                            <button type="button" className="page-btn">
                                3
                            </button>
                        </div>
                    </div>
                </section>
                {taskToDelete && (
                    <div className="modal-backdrop" role="presentation">
                        <div className="delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
                            <h2 id="delete-title">Delete task?</h2>
                            <p>Do you want to permanently delete “{taskToDelete.title}”?</p>
                            <div className="modal-actions">
                                <button type="button" className="secondary-btn" onClick={() => setTaskToDelete(null)} disabled={deleting}>
                                    Cancel
                                </button>
                                <button type="button" className="danger-btn" onClick={handleDelete} disabled={deleting}>
                                    {deleting ? 'Deleting...' : 'Yes, delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard