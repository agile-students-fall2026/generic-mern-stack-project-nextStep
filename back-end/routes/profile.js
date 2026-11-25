import express from 'express';
import bcrypt from 'bcryptjs';
import profiles from '../mockData/profiles.json' with { type: 'json' } //connecting to the mock data
import jwt from 'jsonwebtoken'
import { getAccountById, updateAccountById, deleteAccountById } from './auth.js'

const router = express.Router() //route that is for profile page backend

//temp mock user
// let profile = {
//     id: 2,
//     username: 'Adam S.',
//     name: 'Adam Smith',
//     email: 'adamsmith@gmail.com',
//     age: 72
// }

let profile = profiles[0] ? { ...profiles[0] } : null

//get method to retrieve profile info
router.get('/', (req, res) => {
    //function to work with mockaroo data
    //     //not allowing null profiles as acceptable
    //     if (!profile) {
    //         return res.status(404).json({
    //             error: "Profile does not exist"
    //         })
    //     }
    //     res.json(profile)
    // })


    //reading auth sent by react
    const authorization = req.get('Authorization') ?? ''
    const token = authorization.match(/^Bearer ([^\s]+)$/i)

    if (!token) {
        return res.status(401).json({
            error: "Authentication required"
        })
    }
    try {   //verifying token using same auth.js secret
        const jwtSecret = process.env.JWT_SECRET ?? "development-only-secret-change-before-deploy"
        const decoded = jwt.verify(token[1], jwtSecret)
        const account = getAccountById(decoded.sub)

        if (!account) {
            return res.status(404).json({
                error: "Profile does note exist"
            })
        }
        res.json({
            id: account.id,
            username: account.username,
            name: account.name,
            email: account.email,
            age: account.age
        })
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: "Invalid token"
            })
        }
        throw error
    }
})

//put method to update profile info
router.put('/', async (req, res) => {

    //function to work with mockaroo data
    //      const { username, name, email, age } = req.body ?? {}
    //     if (!username || !name || !email || age === undefined || age === '') {
    //         return res.status(400).json({
    //             error: "Please fill in all fields"
    //         })
    //     }

    //     profile = {
    //         ...profile,
    //         username,
    //         name,
    //         email,
    //         age: Number(age)
    //     }

    //     res.json({
    //         message: "Profile updated successfully",
    //         profile
    //     })
    // })



    const authorization = req.get('Authorization') ?? ''
    const token = authorization.match(/^Bearer ([^\s]+)$/i)

    if (!token) {
        return res.status(401).json({
            error: "Authentication required"
        })
    }
    try {
        const jwtSecret = process.env.JWT_SECRET ?? "development-only-secret-change-before-deploy"
        const decoded = jwt.verify(token[1], jwtSecret)

        const account = getAccountById(decoded.sub)
        if (!account) {
            return res.status(404).json({
                error: "Profile does not exist"
            })
        }
        const { username, name, email, age, password } = req.body ?? {}
        const updatedUsername = typeof username == "string" ? username.trim().toLowerCase() : ''
        const updatedName = typeof name === 'string' ? name.trim() : ''
        const updatedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
        const updatedAge = Number(age)
        const passwordIsValid = password === undefined || (
            typeof password === 'string' &&
            password.length >= 8 &&
            Buffer.byteLength(password, 'utf8') <= 72
        )

        if (
            !/^[a-zA-Z0-9_]{3,30}$/.test(updatedUsername) ||
            !updatedName || updatedName.length > 80 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedEmail) ||
            updatedEmail.length > 254 ||
            age === undefined || age === '' ||
            !Number.isInteger(updatedAge) ||
            updatedAge < 0 || updatedAge > 130 ||
            !passwordIsValid
        ) {
            return res.status(400).json({
                error: "Please input valid information"
            })
        }
        const changes = {
            username: updatedUsername,
            name: updatedName,
            email: updatedEmail,
            age: updatedAge
        }
        if (password !== undefined) {
            changes.passwordHash = await bcrypt.hash(password, 12)
        }
        const updatedAccount = updateAccountById(account.id, changes)
        if (updatedAccount === false) {
            return res.status(409).json({
                error: "Username or email is already used"
            })
        }
        res.json({
            message: "Profile updated successfully",
            profile: {
                id: updatedAccount.id,
                username: updatedAccount.username,
                name: updatedAccount.name,
                email: updatedAccount.email,
                age: updatedAccount.age
            }
        })
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: "Invlaid token"
            })
        }
        throw error
    }
})

//logic for deleteing a profile
router.delete('/', (req, res) => {
    // if (!profile) {
    //     return res.status(404).json({
    //         error: "Profile does not exist"
    //     })
    // }
    // profile = null
    // res.json({
    //     message: "Profile deleted successfully"
    // })

    const authorization = req.get("Authorization") ?? ''
    const token = authorization.match(/^Bearer ([^\s]+)$/i)

    if (!token) {
        return res.status(401).json({
            error: "Authentication required"
        })
    }
    try {
        const jwtSecret = process.env.JWT_SECRET ?? "development-only-secret-change-before-deploy"
        const decoded = jwt.verify(token[1], jwtSecret)

        const account = getAccountById(decoded.sub)
        if (!account) {
            return res.status(404).json({
                error: "Profile foes not exist"
            })
        }
        deleteAccountById(account.id)
        res.json({
            message: "Profile Deleted successfully"
        })
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: "Invalid token"
            })
        }
        throw error
    }


})

//tracking users accessibiliy preferences 
const defaultAccessibility = {
    sizeIndex: 1,
    darkMode: false,
    lowContrast: false
}

function authenticateAccessibility(req, res, next) {
    const authorization = req.get("Authorization") ?? ""
    const token = authorization.match(/^Bearer ([^\s]+)$/i)

    if (!token) {
        return res.status(401).json({
            error: "Authentication required",
        })
    }

    try {
        const jwtSecret = process.env.JWT_SECRET ?? "development-only-secret-change-before-deploy"
        const decoded = jwt.verify(token[1], jwtSecret)
        const account = getAccountById(decoded.sub)

        if (!account) {
            return res.status(401).json({
                error: "Account not found"
            })
        }
        req.account = account
        next()
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: "Invalid token",
            })
        }
        next(error)
    }
}
//getting the users preferences on accessibility 
router.get("/accessibility", authenticateAccessibility, (req, res) => {
    res.json({
        accessibility: req.account.accessibility ?? defaultAccessibility,

    })
})
//putting the users updated preferences on accessibility 
router.put("/accessibility", authenticateAccessibility, (req, res) => {
    const { sizeIndex, darkMode, lowContrast } = req.body ?? {}

    //makings sure inputs are valid 
    if (!Number.isInteger(sizeIndex) || sizeIndex < 0 || sizeIndex > 4 || typeof darkMode !== "boolean" || typeof lowContrast !== "boolean") {
        return res.status(400).json({
            error: "Invalid accessibility settings"
        })
    }
    req.account.accessibility = {
        sizeIndex,
        darkMode,
        lowContrast
    }
    res.json({
        message: "Preferences saved!",
        accessibility: req.account.accessibility,
    })
})

export default router