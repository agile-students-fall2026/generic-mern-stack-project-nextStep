import { expect } from "chai"
import { randomUUID } from "node:crypto"
import app from "../server.js"


describe("Profile API", function () {
    let server
    let baseUrl
    let accessToken
    let account

    before(async function () {
        server = app.listen(0)

        await new Promise((resolve, reject) => {
            server.once("listening", resolve)
            server.once("error", reject)
        })

        baseUrl = `http://127.0.0.1:${server.address().port}`

        const id = randomUUID().slice(0, 8)

        account = {
            name: "Profile Test",
            username: `profile_${id}`,
            email: `profile_${id}@example.com`,
            password: "testpassword123",
            age: 69
        }
        const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        })
        expect(signupResponse.status).to.equal(201)
        const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: account.username,
                pwd: account.password
            })
        })
        expect(loginResponse.status).to.equal(200)
        const loginData = await loginResponse.json()
        accessToken = loginData.accessToken
    })
    after(async function () {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close(error => error ? reject(error) : resolve())
            })
        }
    })

    it("Updating and saving profile info", async function () {
        const updatedProfile = {
            username: account.username,
            name: "Updated Profile",
            email: `updated_${account.username}@example.com`,
            age: 75
        }
        const response = await fetch(`${baseUrl}/api/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(updatedProfile)
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data.message).to.equal("Profile updated successfully")
        expect(data.profile).to.include(updatedProfile)

        const getResponse = await fetch(`${baseUrl}/api/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const savedProfile = await getResponse.json()
        expect(getResponse.status).to.equal(200)
        expect(savedProfile).to.include(updatedProfile)
    })

    it("rejects invalid inputs to profile", async function () {
        const invalidProfile = {
            usernmae: account.userame,
            name: "Profile test",
            email: account.email,
            age: -5
        }
        const response = await fetch(`${baseUrl}/api/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(invalidProfile)
        })
        const data = await response.json()
        expect(response.status).to.equal(400)
        expect(data.error).to.equal("Please input valid information")

    })
})