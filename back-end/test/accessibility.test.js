import { expect } from "chai"
import { randomUUID } from "node:crypto"
import app from "../server.js"

describe("Accessibility API", function () {
    let server
    let baseUrl
    let accessToken

    before(async function () {
        server = app.listen(0)

        await new Promise((resolve, reject) => {
            server.once('listening', resolve)
            server.once('error', reject)
        })

        baseUrl = `http://127.0.0.1:${server.address().port}`

        //creating the tests
        const id = randomUUID().slice(0, 8)
        const username = `access_${id}`
        const password = "testpassword123"

        const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Accessibility test",
                username,
                email: `${username}@gmail.com`,
                password,
                age: 69
            })
        })

        expect(signupResponse.status).to.equal(201)

        const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: username,
                pwd: password
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

    it("returning default for new users", async function () {
        const response = await fetch(`${baseUrl}/api/profile/accessibility`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data.accessibility).to.deep.equal({
            sizeIndex: 1,
            darkMode: false,
            lowContrast: false
        })
    })

    it("saves updated accessibility preferences", async function () {
        const updatedSettings = {
            sizeIndex: 4,
            darkMode: true,
            lowContrast: true
        }
        const response = await fetch(`${baseUrl}/api/profile/accessibility`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(updatedSettings)
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data.accessibility).to.deep.equal(updatedSettings)

        const getResponse = await fetch(`${baseUrl}/api/profile/accessibility`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const savedData = await getResponse.json()

        expect(getResponse.status).to.equal(200)
        expect(savedData.accessibility).to.deep.equal(updatedSettings)
    })

    it("Invalid accessibility preferences rejected", async function () {
        const response = await fetch(`${baseUrl}/api/profile/accessibility`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                sizeIndex: 999,
                darkMode: true,
                lowContrast: false
            })
        })
        expect(response.status).to.equal(400)
    })

    // it("Request without authorization rejected", async function () {
    //     const response = await fetch(`${baseUrl}/api/profile/accessibility`)
    //     expect(response.status).to.equal(401)
    // })
})
