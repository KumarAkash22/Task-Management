import { useState } from "react"

function Dropdown({ id, label, options, defaultValue, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState(defaultValue)


    function selectOption(option) {
        setValue(option)
        console.log(value, "value")
        setIsOpen(false)

        if (onChange) {
            onChange({ target: { value: option } })
        }
    }

    return (
        <div className="relative">
            <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
            <input type="hidden" name={id} value={value} />
            <button
                id={id}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-left text-slate-700 outline-none transition hover:border-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            >
                {value}
                <span aria-hidden="true" className={`h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-slate-400 transition-transform ${isOpen ? 'translate-y-0.5 rotate-[225deg]' : '-translate-y-0.5'}`} />
            </button>
            {isOpen && (
                <div role="listbox" aria-labelledby={id} className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            role="option"
                            aria-selected={value === option}
                            onClick={() => selectOption(option)}
                            className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${value === option ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
export default Dropdown
