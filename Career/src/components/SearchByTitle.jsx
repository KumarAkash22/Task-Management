import { useEffect, useState } from 'react'

function SearchByTitle({ onSearch }) {
    const [value, setValue] = useState('')

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            onSearch(value.trim())
        }, 350)

        return () => window.clearTimeout(timeoutId)
    }, [onSearch, value])

    return (
        <div className="search-box">
            <span aria-hidden="true">🔎</span>
            <input
                type="search"
                placeholder="Search by title..."
                value={value}
                onChange={(event) => setValue(event.target.value)}
                aria-label="Search tasks by title"
            />
        </div>
    )
}

export default SearchByTitle
