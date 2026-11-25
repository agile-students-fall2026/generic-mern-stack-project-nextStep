## Authentication API

The Express API implements:

- `POST /api/auth/signup` with `name`, `username`, `email`, `password`, and `age`.
- `POST /api/auth/login` with `user` (username or email) and `pwd`.
- `PUT /api/profile` to update profile details and optionally set a new password.
  Leave the password field blank to keep the current password; new passwords
  must be at least 8 characters and are stored as bcrypt hashes.

Users are stored in a fake in-memory collection for development, passwords
are hashed with bcrypt, and successful logins return a short-lived JWT in
`accessToken`. Accounts disappear whenever the backend restarts.

### Run the demo

From `back-end/`, run:

```sh
npm install
npm run dev
```

Set `PORT=3001` when starting the API if another local service is already using
port 3000. The Vite development server proxies `/api` requests to
`http://localhost:3001`.
For production, set a private `JWT_SECRET` of at least 32 bytes; never commit
secrets.

### Run authentication tests

After installing the backend dependencies, run the signup and sign-in tests from
`back-end/` with:

```sh
npx --yes mocha@11 test/auth.test.js
```

### Reference tutorial and documentation

- [Express routing](https://expressjs.com/en/guide/routing.html)
- [Express middleware guide](https://expressjs.com/en/guide/using-middleware.html)
- [bcryptjs usage](https://www.npmjs.com/package/bcryptjs)
- [JSON Web Token introduction](https://jwt.io/introduction)
