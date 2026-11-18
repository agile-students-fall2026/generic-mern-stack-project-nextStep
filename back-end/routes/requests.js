import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Same secret auth.js uese to sign tokens.
const jwtSecret = process.env.JWT_SECRET ?? 'development-only-secret-change-before-deploy';

// Every request is stored in this variable. 
const requests = []

// Reads token and returns user's id
function getUserId(req){
  const header = req.get("authorization") ?? "";
  const token = header.replace("Bearer ", "");
    try{
        const payload = jwt.verify(token, jwtSecret);
        return payload.sub;
      }catch (err){
        return null;
    }
}

// GET /api/requests: only the logged-in user's requests
router.get("/", (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Please log in first." });
    }
  
    const myRequests = requests.filter((request) => request.userId === userId);
    return res.json(myRequests);
  });

  // POST /api/requests: save a new request for the logged-in user
router.post("/", (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Please log in first." });
    }
  
    const text = req.body?.text;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Request text is required." });
    }
    const newRequest = {
        id: requests.length + 1,
        userId: userId,
        text: text.trim(),
        date: new Date().toLocaleDateString(),
        status: "Pending",
      };
      requests.push(newRequest);
    
      return res.status(201).json(newRequest);
    });
    
    export default router;