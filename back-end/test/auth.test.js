import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import app from "../server.js";

describe("authentication API", function () {
  let server;
  let baseUrl;
  let account;

  function signIn(password = account.password) {
    return fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user: account.username, pwd: password }),
    });
  }

  function updatePassword(accessToken, password) {
    return fetch(baseUrl.replace("/api/auth", "/api/profile"), {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        username: account.username,
        name: account.name,
        email: account.email,
        age: account.age,
        password,
      }),
    });
  }

  before(async function () {
    server = app.listen(0);
    await new Promise((resolve, reject) => {
      server.once("listening", resolve);
      server.once("error", reject);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}/api/auth`;

    const uniqueId = randomUUID().replaceAll("-", "").slice(0, 12);
    account = {
      name: "Test User",
      username: `test_${uniqueId}`,
      email: `test_${uniqueId}@example.com`,
      password: "correct-horse-battery",
      age: 42,
    };
  });

  after(async function () {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  it("creates an account and does not return the password hash", async function () {
    const response = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(account),
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.message, "Account created successfully.");
    assert.equal(body.user.username, account.username);
    assert.equal(body.user.email, account.email);
    assert.equal("passwordHash" in body.user, false);
  });

  it("rejects invalid signup details", async function () {
    const response = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...account, password: "short" }),
    });

    assert.equal(response.status, 400);
    assert.equal((await response.json()).message, "Please provide valid account details.");
  });

  it("rejects a duplicate username or email", async function () {
    const response = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(account),
    });

    assert.equal(response.status, 409);
    assert.equal((await response.json()).message, "Username or email is already in use.");
  });

  for (const identifierType of ["username", "email"]) {
    it(`signs in using ${identifierType}`, async function () {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user: account[identifierType].toUpperCase(), pwd: account.password }),
      });
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.equal(body.tokenType, "Bearer");
      assert.equal(body.expiresIn, 3600);
      assert.deepEqual(body.roles, ["user"]);
      assert.equal(body.user.username, account.username);
      const profileResponse = await fetch(`${baseUrl}/me`, {
        headers: { authorization: `Bearer ${body.accessToken}` },
      });
      const profile = await profileResponse.json();
      assert.equal(profileResponse.status, 200);
      assert.equal(profile.user.id, body.user.id);
    });
  }

  it("rejects a new password shorter than eight characters", async function () {
    const loginResponse = await signIn();
    const { accessToken } = await loginResponse.json();
    const response = await updatePassword(accessToken, "short");

    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, "Please input valid information");
    assert.equal((await signIn()).status, 200);
  });

  it("updates the password and uses the new password for sign-in", async function () {
    const loginResponse = await signIn();
    const { accessToken } = await loginResponse.json();
    const newPassword = "a-new-secure-password";
    const updateResponse = await updatePassword(accessToken, newPassword);

    assert.equal(updateResponse.status, 200);
    const updateBody = await updateResponse.json();
    assert.equal(updateBody.profile.username, account.username);
    assert.equal("passwordHash" in updateBody.profile, false);
    assert.equal((await signIn()).status, 401);
    assert.equal((await signIn(newPassword)).status, 200);
  });

  it("rejects an incorrect password", async function () {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user: account.username, pwd: "wrong-password" }),
    });

    assert.equal(response.status, 401);
    assert.equal((await response.json()).message, "Invalid username/email or password.");
  });

  it("rejects missing sign-in credentials", async function () {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user: account.username }),
    });

    assert.equal(response.status, 400);
    assert.equal((await response.json()).message, "Username/email and password are required.");
  });
});
