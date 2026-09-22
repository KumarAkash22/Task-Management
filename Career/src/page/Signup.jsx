import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser, sendOTP, verifyOTP } from '../lib/api'
import PasswordInput from '../components/PasswordInput'
import '../App.css'

function Signup() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [otp, setOtp] = useState(['', '', '', ''])
    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const otpInputRefs = useRef([])

    const handleSendOTP = async () => {
        setLoading(true)
        setMessage('')
        setError('')

        try {
            const data = await sendOTP(formData.email)
            setOtpSent(true);
            setMessage(data.message)
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async () => {
        setLoading(true)
        setMessage('')
        setError('')

        try {
            const data = await verifyOTP(formData.email, otp.join(''))
            setOtpVerified(true)
            setMessage(data.message)
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async () => {
        setLoading(true)
        setMessage('')
        setError('')

        try {
            const data = await registerUser(
                formData.name,
                formData.email,
                formData.password
            )
            localStorage.setItem('taskAppUser', JSON.stringify(data.user))
            setMessage(data.message)
            navigate('/login')
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFormChange = (event) => {
        const { id, value } = event.target
        setFormData((currentData) => ({ ...currentData, [id]: value }))
    }

    const handleOtpChange = (index, value) => {
        const digit = value.replace(/\D/g, '').slice(-1)
        setOtp((currentOtp) => currentOtp.map((currentDigit, currentIndex) => (
            currentIndex === index ? digit : currentDigit
        )))

        if (digit && index < otp.length - 1) {
            otpInputRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus()
        }
    }

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-header">
                    <h2>Create Account</h2>
                    <p>Sign up to continue</p>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input id="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleFormChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-with-button">
                        <input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleFormChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="otp">OTP Verification</label>
                    <button type="button" className="otp-button" onClick={handleSendOTP} disabled={loading}>
                        {loading && !otpSent ? 'Sending...' : 'Send OTP'}
                    </button>
                    <div className="otp-box-row" aria-label="OTP input boxes">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                className="otp-box"
                                type="text"
                                maxLength="1"
                                aria-label={`OTP digit ${index + 1}`}
                                value={digit}
                                ref={(input) => {
                                    otpInputRefs.current[index] = input
                                }}
                                onChange={(event) => handleOtpChange(index, event.target.value)}
                                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                            />
                        ))}
                    </div>
                    <button type="button" className="verify-btn" onClick={handleVerifyOTP} disabled={loading || !otpSent}>
                        Verify
                    </button>
                </div>

                {/* <div className="form-group">
                    <label htmlFor="mobile">Mobile Number</label>
                    <input id="mobile" type="tel" placeholder="Enter your mobile number" />
                </div> */}

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <PasswordInput id="password" placeholder="Create a password" value={formData.password} onChange={handleFormChange} />
                </div>

                <button type="button" className="register-btn" onClick={handleRegister} disabled={loading || !otpVerified}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <p className="login-link-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
                {message && <p role="status">{message}</p>}
                {error && <p role="alert">{error}</p>}
            </div>
        </div>
    )
}

export default Signup
