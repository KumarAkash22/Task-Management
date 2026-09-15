function DueDateSort({ value, onChange }) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label="Sort tasks by due date"
        >
            <option value="">Sort by due date</option>
            <option value="asc">Earliest first</option>
            <option value="desc">Latest first</option>
        </select>
    )
}

export default DueDateSort
