function PriorityFilter({ value, onChange }) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label="Filter tasks by priority"
        >
            <option value="">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
        </select>
    )
}

export default PriorityFilter
