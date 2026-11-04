// ref: https://www.greatfrontend.com/react-interview-playbook/react-signup-form-example
// import './css/signup.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    // Prevent default behavior, which is a navigation
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch('/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // all the data to send/save to db
          email: formData.get('userEmail'),
          password: formData.get('userPassword'),
          name: formData.get('name'),
          username: formData.get('username'),
          age: formData.get('age'),

        }),
      });

      // if (!response.ok) {
      //   // Handle error response
      //   throw new Error('Signup failed. Please check your details and try again.');
      // }
      // Handle success flow
      setMessage('Account created successfully!');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Signup failed.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div role="status"> {message} </div>
      <label htmlFor="name-input">Name</label>
      <input
        id="name-input"
        name="name"
        required
        type="text"
      />
      <label htmlFor="username-input">Username</label>
      <input
        id="username-input"
        name="username"
        required
        type="text"
      />
      <label htmlFor="email-input">Email</label>
      <input
        autoComplete="email"
        id="email-input"
        name="userEmail"
        required
        type="email"
      />
      <label htmlFor="password-input">Password</label>
      <input
        aria-describedby="password-hint"
        autoComplete="new-password"
        id="password-input"
        minLength="8"
        name="userPassword"
        required
        type="password"
      />
      <label htmlFor="other-input">Age</label>
      <input
        id="other-input"
        name="age"
        required
        type="number"
      />
      <div id="password-hint">
        Your password must be at least 8 characters long.
      </div>
      <button type="submit" onClick={() => navigate('/home')}>Sign up</button>
    </form>
  );
}


export default SignUp