import { useState } from 'react'

function PasswordInput({ id, placeholder, value, onChange }) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="password-input-wrapper">
            <input
                id={id}
                type={visible ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
            />
            <button
                type="button"
                className="password-toggle"
                onClick={() => setVisible((currentVisible) => !currentVisible)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                title={visible ? 'Hide password' : 'Show password'}
            >
                {visible ? 'Hide' : 'Show'}
            </button>
        </div>
    )
}

export default PasswordInput
