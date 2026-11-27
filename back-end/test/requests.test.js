import { expect } from "chai"
import { randomUUID } from "node:crypto"
import app from "../server.js"

describe("Requests API", function () {
    let server
    let baseUrl
    let aliceToken
    let bobToken

    // make an account, log in, and return the token
    async function makeUserAndLogin(name) {
        const id = randomUUID().slice(0, 8)
        const account = {
            name: name,
            username: `${name}_${id}`,
            email: `${name}_${id}@example.com`,
            password: "testpassword123",
            age: 20
        }
        await fetch(`${baseUrl}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(account)
        })
        const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: account.username, pwd: account.password })
        })
        const loginData = await loginResponse.json()
        return loginData.accessToken
    }

    before(async function () {
        server = app.listen(0)
        await new Promise((resolve, reject) => {
            server.once("listening", resolve)
            server.once("error", reject)
        })
        baseUrl = `http://127.0.0.1:${server.address().port}`

        aliceToken = await makeUserAndLogin("alice")
        bobToken = await makeUserAndLogin("bob")
    })

    after(async function () {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close(error => error ? reject(error) : resolve())
            })
        }
    })

    it("GET without a token gives 401", async function () {
        const response = await fetch(`${baseUrl}/api/requests`)
        expect(response.status).to.equal(401)
    })

    it("GET with a fake token gives 401", async function () {
        const response = await fetch(`${baseUrl}/api/requests`, {
            headers: { Authorization: "Bearer fake" }
        })
        expect(response.status).to.equal(401)
    })

    it("POST without a token gives 401", async function () {
        const response = await fetch(`${baseUrl}/api/requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: "How do I use Gmail?" })
        })
        expect(response.status).to.equal(401)
    })

    it("POST with empty text gives 400", async function () {
        const response = await fetch(`${baseUrl}/api/requests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${aliceToken}`
            },
            body: JSON.stringify({ text: "   " })
        })
        expect(response.status).to.equal(400)
    })

    it("POST with text saves the request", async function () {
        const response = await fetch(`${baseUrl}/api/requests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${aliceToken}`
            },
            body: JSON.stringify({ text: "How do I use Gmail?" })
        })
        const data = await response.json()
        expect(response.status).to.equal(201)
        expect(data.text).to.equal("How do I use Gmail?")
        expect(data.status).to.equal("Pending")
    })

    it("GET shows the user's own request", async function () {
        const response = await fetch(`${baseUrl}/api/requests`, {
            headers: { Authorization: `Bearer ${aliceToken}` }
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.have.lengthOf(1)
        expect(data[0].text).to.equal("How do I use Gmail?")
    })

    it("another user cannot see that request", async function () {
        const response = await fetch(`${baseUrl}/api/requests`, {
            headers: { Authorization: `Bearer ${bobToken}` }
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.have.lengthOf(0)
    })
})
