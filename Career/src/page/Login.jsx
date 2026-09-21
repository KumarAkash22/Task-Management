import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../lib/api'
import '../App.css'

function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (event) => {
        const { id, value } = event.target
        setFormData((currentData) => ({ ...currentData, [id]: value }))
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await loginUser(formData.email, formData.password)
            localStorage.setItem('taskAppToken', response.token)
            localStorage.setItem('taskAppUser', JSON.stringify(response.user))
            navigate('/dashboard')
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Login</h2>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email Id</label>
                        <input id="email" type="email" placeholder="Email Id" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                    {error && <p role="alert">{error}</p>}
                </form>
            </div>
        </div>
    )
}

export default Login
