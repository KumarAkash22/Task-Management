function StatusFilter({ value, onChange }) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label="Filter tasks by status"
        >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
        </select>
    )
}

export default StatusFilter
