import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function DashboardHeader({ userName, variant = 'dashboard' }) {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)
    const navigate = useNavigate()
    const storedUser = localStorage.getItem('taskAppUser')
    const registeredUser = storedUser ? JSON.parse(storedUser) : null
    const displayName = userName || registeredUser?.name || 'User'

    const handleLogout = () => {
        localStorage.removeItem('taskAppUser')
        localStorage.removeItem('taskAppToken')
        setShowLogoutDialog(false)
        navigate('/login', { replace: true })
    }

    return (
        <>
            <header className={`dashboard-header shared-header ${variant}-header`}>
                <div className="brand-block">
                    <div className="brand-logo" aria-hidden="true">✓</div>
                    <div>
                        <h1>Welcome {displayName}</h1>
                    </div>
                </div>

                <button type="button" className="secondary-btn signout-btn" onClick={() => setShowLogoutDialog(true)}>
                    Sign out
                </button>
            </header>

            {showLogoutDialog && (
                <div className="modal-backdrop" role="presentation">
                    <div className="delete-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
                        <h2 id="logout-title">Are you want to logout?</h2>
                        <p>You will need to sign in again to access your tasks.</p>
                        <div className="modal-actions">
                            <button type="button" className="secondary-btn" onClick={() => setShowLogoutDialog(false)}>
                                Cancel
                            </button>
                            <button type="button" className="danger-btn" onClick={handleLogout}>
                                Yes, logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DashboardHeader
