import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,30}$/;
const users = new Map();
const jwtSecret = process.env.JWT_SECRET ?? "development-only-secret-change-before-deploy";

router.post("/signup", async (req, res) => {
  const { name, username, email, password, age } = req.body ?? {};
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedUsername = typeof username === "string" ? username.trim().toLowerCase() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const parsedAge = Number(age);

  if (
    !normalizedName ||
    normalizedName.length > 80 ||
    !usernamePattern.test(normalizedUsername) ||
    !emailPattern.test(normalizedEmail) ||
    normalizedEmail.length > 254 ||
    typeof password !== "string" ||
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72 ||
    (typeof age !== "number" && (typeof age !== "string" || !age.trim())) ||
    !Number.isInteger(parsedAge) ||
    parsedAge < 0 ||
    parsedAge > 130
  ) {
    return res.status(400).json({ message: "Please provide valid account details." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const isDuplicate = [...users.values()].some(
    (account) => account.username === normalizedUsername || account.email === normalizedEmail,
  );
  if (isDuplicate) {
    return res.status(409).json({ message: "Username or email is already in use." });
  }

  const account = {
    id: randomUUID(),
    name: normalizedName,
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash,
    age: parsedAge,
    roles: ["user"],
    //adding accessibilities track
    accessibility: {
      sizeIndex: 1,
      darkMode: false,
      lowContrast: false,
    }
  };
  users.set(account.id, account);

  return res.status(201).json({
    message: "Account created successfully.",
    user: {
      id: account.id,
      name: account.name,
      username: account.username,
      email: account.email,
    },
  });
});

router.post("/login", async (req, res) => {
  const { user: identifier, pwd: password } = req.body ?? {};
  if (
    typeof identifier !== "string" ||
    !identifier.trim() ||
    typeof password !== "string" ||
    !password ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({ message: "Username/email and password are required." });
  }

  const normalizedIdentifier = identifier.trim().toLowerCase();
  const account = [...users.values()].find(
    (candidate) =>
      candidate.username === normalizedIdentifier || candidate.email === normalizedIdentifier,
  );

  if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
    return res.status(401).json({ message: "Invalid username/email or password." });
  }

  const accessToken = jwt.sign(
    { sub: account.id, roles: account.roles },
    jwtSecret,
    { expiresIn: "1h" },
  );

  return res.json({
    accessToken,
    tokenType: "Bearer",
    expiresIn: 3600,
    roles: account.roles,
    user: {
      id: account.id,
      name: account.name,
      username: account.username,
      email: account.email,
    },
  });
});

router.get("/me", async (req, res) => {
  const authorization = (req.get("authorization") ?? "").match(/^Bearer ([^\s]+)$/i);
  if (!authorization) {
    return res.status(401).json({ message: "A bearer token is required." });
  }

  let tokenPayload;
  try {
    tokenPayload = jwt.verify(authorization[1], jwtSecret);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "The access token is invalid or expired." });
    }
    throw error;
  }

  const account = users.get(tokenPayload.sub);
  if (!account) {
    return res.status(401).json({ message: "The account for this token no longer exists." });
  }

  return res.json({
    user: {
      id: account.id,
      name: account.name,
      username: account.username,
      email: account.email,
    },
    roles: account.roles,
  });
});

//finding the registered account to edit
export function getAccountById(id) {
  return users.get(id)
}

//functino to update user profile
export function updateAccountById(id, changes) {
  const account = users.get(id)
  if (!account) {
    return null
  }
  //checks that users are not recreating other users name/email
  const duplicate = [...users.values()].some(user =>
    user.id !== id &
    (user.username === changes.username || user.email == changes.email)
  )
  if (duplicate) {
    return false
  } Object.assign(account, changes)
  return account
}

//function to deletes profile
export function deleteAccountById(id) {
  return users.delete(id)
}

export default router;
