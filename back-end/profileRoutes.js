import express from 'express';

const router = express.Router(); //route that is for profile page backend

//temp mock user

let profile = {
    id: 2,
    username: 'Adam S.',
    name: 'Adam Smith',
    email: 'adamsmith@gmail.com',
    age: 72

}

router.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173') //telling browser to allow frontend request for profile info
    res.set('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();

})

//get method to retrieve profile info
router.get('/', (req, res) => {
    res.json(profile)
})

//put method to update profile info
router.put('/', (req, res) => {
    const { username, name, email, age } = req.body ?? {}
    if (!username || !name || !email || age === undefined || age === '') {
        return res.status(400).json({
            error: "Please fill in all fields"
        })
    }

    profile = {
        ...profile,
        username,
        name,
        email,
        age: Number(age)
    }

    res.json({
        message: "Profile updated successfully",
        profile
    })
})
export default router;