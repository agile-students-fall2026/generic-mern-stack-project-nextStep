import { useState, useEffect, useContext } from 'react'
import AuthContext from './assets/AuthProvider'
import { useNavigate } from 'react-router-dom'
import useAccessibility from './useAccessibility'
import './css/pages.css'

function ProfilePage() {
    useAccessibility()  //loading the settings user inputed

    //creating state variables for data this page will need
    const [saved, setSaved] = useState(null)    //saved profile
    const [form, setForm] = useState(null)  //what user inputed [edited]
    const [showPassword, setShowPassword] = useState(false) //to show or hide password
    const [isDirty, setIsDirty] = useState(false) // tracks the user editing the profile
    const { auth, setAuth } = useContext(AuthContext)    //reading logged in users data
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const navigate = useNavigate() //react navigation tool to move page to page

    useEffect(() => {   //grabbing profile from back-end route
        let ignore = false
        fetch('http://localhost:3001/api/profile', {
            headers: {
                'Authorization': `Bearer ${auth.accessToken}`
            }
        })
            .then(response => {
                //checking http req goes through
                if (!response.ok) {
                    throw new Error("failed request");
                }
                return response.json();
            })
            .then(user => {
                if (!ignore) {
                    setSaved(user)
                    setForm(user)
                }
            })
            .catch(error => {
                if (!ignore) {
                    console.error("Issue retrieving profile", error);
                }
            })
        return () => {
            ignore = true
        }
    }, [auth?.accessToken])

    const handleChangePassword = async (e) => {
        e.preventDefault()
        const { currentPassword, newPassword, confirmPassword } = passwordForm
        if (newPassword !== confirmPassword) {
            alert("New password does not match")
            return
        }
        try {
            const response = await fetch(
                'http://localhost:3001/api/profile/change-password',
                {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.accessToken}`
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            )
            const data = await response.json()
            if (!response.ok) {
                alert(data.error || "Password chnge failed")
                return
            }
            alert("Password change succesfully!")
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (error) {
            alert("Unable to change password")
        }
    }

    const handleSave = async e => {   //tracking save button appears
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:3001/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`
                },
                body: JSON.stringify({
                    username: form.username,
                    name: form.name,
                    email: form.email,
                    age: form.age
                })

            })
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error ?? 'Failed to save profile');
            }

            const data = await response.json();

            setSaved(data.profile);
            setForm(data.profile);
            setIsDirty(false);

            alert('Profile updated successfully!');

        } catch (error) {
            console.error('Error saving profile:', error);
            alert(error instanceof Error ? error.message : 'Unable to save profile changes.');
        }
        //setSaved(form)
        //setIsDirty(false)
    }

    const handleDelete = async () => {    //tracks is user attempts to delete profile
        if (window.confirm('Are you sure you want to Delete your profile?')) {
            try {
                const response = await fetch('http://localhost:3001/api/profile', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                })
                if (!response.ok) {
                    throw new Error("Failed to delete profile")
                }

                //deleting users profile
                setAuth({})

                alert('Profile deleted successfully!')
                navigate('/login')   //navigates to home page

            } catch (error) {
                console.error("Error deleting profile", error)
                alert('Unable to delete profile')
            }
        }
    }

    const handleUsernameChange = e => { //updating username
        setForm({ ...form, username: e.target.value })
        setIsDirty(true)
    }

    const handleNameChange = e => { //updating name
        setForm({ ...form, name: e.target.value })
        setIsDirty(true)
    }

    const handleEmailChange = e => {    //updating email
        setForm({ ...form, email: e.target.value })
        setIsDirty(true)
    }

    const handleAgeChange = e => {  //updating age
        setForm({ ...form, age: e.target.value })
        setIsDirty(true)
    }


    if (!form) {    //if there is not data retrieved, profile processing i loaded
        return (
            <div className="screen profile-screen">
                <main className="content profile-content">
                    <h1 className="page-title">Profile</h1>
                    <p className="loading">Loading your profile...</p>
                </main>
            </div>
        )
    }


    return (
        <div className='screen profile-screen'>
            <main className="content profile-content">
                {/*back button to return to settings page */}
                <button type="button" className="back-button" onClick={() => navigate('/menu')}>
                    Back
                </button>
                <header className='page-header'>
                    <h1 className="page-title">Profile</h1>
                </header>
                <p className="page-description">Update your personal information.</p>
                <form className="profile-form" onSubmit={handleSave}>
                    <label className="field">
                        <span className="field-label">Edit Username</span>
                        <input
                            className="form-input"
                            type="text"
                            value={form.username}
                            onChange={handleUsernameChange}
                        />
                    </label>

                    <label className="field">
                        <span className="field-label">Edit Name</span>
                        <input
                            className="form-input"
                            type="text"
                            value={form.name}
                            onChange={handleNameChange}
                        />
                    </label>

                    <label className="field">
                        <span className="field-label">Edit Email</span>
                        <input
                            className="form-input"
                            type="email"
                            value={form.email}
                            onChange={handleEmailChange}
                        />
                    </label>

                    <label className="field">
                        <span className="field-label">Edit Age</span>
                        <input
                            className="form-input"
                            type="number"
                            value={form.age}
                            onChange={handleAgeChange}
                        />
                    </label>

                    {/* <label className="field">
                        <span className="field-label">Change Password</span>

                        <div className="field-row">
                            <input
                                className="form-input"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                minLength={8}
                                placeholder="Leave blank to keep current password"
                                value={form.password}
                                onChange={e => {
                                    setForm({ ...form, password: e.target.value })
                                    setIsDirty(true)
                                }}
                            />

                            <button
                                type="button"
                                className="link-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </label> */}

                    {isDirty && (
                        <button type="submit" className="btn btn-primary">
                            Save changes
                        </button>
                    )}

                </form>
                <section className="password-section">
                    <h2>Change Password</h2>
                    <form className="profile-form" onSubmit={handleChangePassword}>
                        <label className="field">
                            <span className='field-label'>Current Password</span>
                            <input
                                className="form-input"
                                type={showPassword ? "text" : "password"}
                                value={passwordForm.currentPassword}
                                onChange={e => setPasswordForm({
                                    ...passwordForm,
                                    currentPassword: e.target.value
                                })}
                                autoComplete="current-password"
                                required
                            />
                        </label>
                        <label className="field">
                            <span className="field-label">New Password</span>
                            <input
                                className="form-input"
                                type={showPassword ? "text" : "password"}
                                value={passwordForm.newPassword}
                                onChange={e => setPasswordForm({
                                    ...passwordForm,
                                    newPassword: e.target.value
                                })}
                                autoComplete="new-password"
                                minLength={8}
                                required
                            />
                        </label>
                        <label className='field'>
                            <span className='field-label'>Confirm New Password</span>
                            <input
                                className="form-input"
                                type={showPassword ? "text" : "password"}
                                value={passwordForm.confirmPassword}
                                onChange={e => setPasswordForm({
                                    ...passwordForm,
                                    confirmPassword: e.target.value
                                })}
                                autoComplete="new-password"
                                required
                            />
                        </label>
                        <button type="button" className="link-btn" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Hide Passwords" : "Show Passwords"}
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Update Password
                        </button>
                    </form>


                </section>
                {/*//delete button*/}
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}>
                    Delete Profile
                </button>
            </main>
            <button
                className="menu-button"
                onClick={() => navigate('/menu')}>
                Menu
            </button>
        </div>
    )
}

export default ProfilePage