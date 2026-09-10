import '../App.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTask } from '../lib/api'
import Dropdown from '../components/Dropdown'


function CreateTask() {
    const navigate = useNavigate()

    const [submitted, setSubmitted] = useState(false)
    const today = new Date().toISOString().split('T')[0]
    const [taskValue, setTaskValue] = useState("")
    const [descValue, setDescValue] = useState("")
    const [priority, setPriority] = useState("Medium")
    const [status, setStatus] = useState("Pending")
    const [assignDate, setAssignDate] = useState(today)
    const [dueDate, setDueDate] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(event) {
        event.preventDefault()
        setLoading(true)
        setError("")

        try {
            await createTask({
                title: taskValue,
                description: descValue,
                priority,
                assignedDate: assignDate,
                dueDate: dueDate || null,
                status
            })

            setSubmitted(true)
            navigate("/dashboard")
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f8f5] px-4 py-6 text-slate-900 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-lg text-amber-700">✦</div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today</p>
                            <p className="font-semibold text-slate-800">Make progress</p>
                        </div>
                    </div>
                </header>

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
                    <form onSubmit={handleSubmit} className="w-full p-6 sm:p-8 lg:p-10">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="task-title" className="mb-2 block text-sm font-semibold text-slate-700">Task Title</label>
                                <input id="task-title" value={taskValue} onChange={(e) => setTaskValue(e.target.value)} name="title" required placeholder="Add Title" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                            </div>
                            <div>
                                <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span></label>
                                <textarea id="description" name="description" value={descValue} onChange={(e) => setDescValue(e.target.value)} rows="2" placeholder="Add context" className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                            </div>
                            <div>
                                <Dropdown id="priority" label="Priority" onChange={(e) => setPriority(e.target.value)} options={['High', 'Medium', 'Low']} defaultValue="Medium" />
                            </div>
                            <div>
                                <Dropdown id="status" label="Status" onChange={(e) => setStatus(e.target.value)} options={['Pending', 'In Progress', 'Complete']} defaultValue="Pending" />
                            </div>
                            <div>
                                <label htmlFor="assign-date" className="mb-2 block text-sm font-semibold text-slate-700">Assign date</label>
                                <input id="assign-date" name="assignDate" value={assignDate}
                                    onChange={(e) => setAssignDate(e.target.value)} type="date" defaultValue={today} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                            </div>
                            <div>
                                <label htmlFor="due-date" className="mb-2 block text-sm font-semibold text-slate-700">Due date</label>
                                <input id="due-date" name="dueDate" value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)} type="date" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col-reverse items-stretch gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p aria-live="polite" className="text-sm font-medium text-emerald-700">{submitted ? 'Task added successfully.' : 'Ready when you are.'}</p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/25 active:scale-[0.98]"
                            >
                                {loading ? 'Creating...' : 'Create task'}
                            </button>
                        </div>
                        {error && <p role="alert" className="mt-3 text-red-600">{error}</p>}
                    </form>
                </section>
            </div>
        </main>
    )
}

export default CreateTask
