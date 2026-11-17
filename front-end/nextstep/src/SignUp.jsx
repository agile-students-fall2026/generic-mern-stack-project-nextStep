// ref: https://www.greatfrontend.com/react-interview-playbook/react-signup-form-example
// import './css/signup.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAccessibility from './useAccessibility';
import './css/pages.css'
import api from './api';

function SignUp() {
  useAccessibility();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    // Prevent default behavior, which is a navigation
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      await api.post('/auth/signup', {
        email: formData.get('userEmail'),
        password: formData.get('userPassword'),
        name: formData.get('name'),
        username: formData.get('username'),
        age: formData.get('age'),
      });

      navigate('/login', {
        state: { message: 'Account created successfully. Please sign in.' },
      });
    } catch (error) {
      setMessage(
        error?.response?.data?.message ??
        (error?.response ? 'Signup failed. Please check your details.' : 'Unable to reach the server.'),
      );
    }
  }

  return (
    <div className="screen auth-screen">
      {/*back button to return to login page */}

      <main className="content auth-content">
        <button type="button" className="back-button" onClick={() => navigate('/login')}>
          Back
        </button>
        <header className="auth-header">
          <h1 className="auth-logo">
            NextStep
          </h1>
          <p className="auth-tagline">Keeping you in the loop</p>
        </header>

        <section className="auth-section">
          <h2 className="auth-title">
            Create Your Account
          </h2>
          <p className="page-description">
            Enter your information below</p>
          <p className="auth-message" role="status"> {message} </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field" htmlFor="name-input">Name</label>
            <input
              className="form-input"
              id="name-input"
              name="name"
              required
              type="text"
            />
            <label className="field" htmlFor="username-input">Username</label>
            <input
              className="form-input"
              id="username-input"
              name="username"
              required
              type="text"
            />
            <label className="field" htmlFor="email-input">Email</label>
            <input
              className="form-input"
              autoComplete="email"
              id="email-input"
              name="userEmail"
              required
              type="email"
            />
            <label className="field" htmlFor="password-input">Password</label>
            <input
              className="form-input"
              aria-describedby="password-hint"
              autoComplete="new-password"
              id="password-input"
              minLength="8"
              name="userPassword"
              required
              type="password"
            />
            <label className="field" htmlFor="other-input">Age</label>
            <input
              className="form-input"
              id="other-input"
              min="0"
              max="130"
              step="1"
              name="age"
              required
              type="number"
            />
            <p className="form-hint" id="password-hint">
              Your password must be at least 8 characters long.
            </p>
            <button className="btn btn-primary" type="submit">Sign up</button>

          </form>
        </section>
      </main>
    </div>
  );
}


export default SignUp