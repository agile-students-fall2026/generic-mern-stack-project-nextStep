// ref: https://www.greatfrontend.com/react-interview-playbook/react-signup-form-example
import './css/signup.css'


function SignUp() {
  async function handleSubmit(event) {
    // Prevent default behavior, which is a navigation
    event.preventDefault();

    const formElement = event.target;
    const formData = new FormData(formElement);

    const response = await fetch('/users/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('userEmail'),
        password: formData.get('userPassword'),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      // Handle error response
      return;
    }

    // Handle success flow
  }

  return (
    <form onSubmit={handleSubmit}>
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
      <button>Sign up</button>
    </form>
  );
}


export default SignUp