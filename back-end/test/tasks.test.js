import { expect } from "chai"
import app from "../server.js"

describe("Tasks API", function () {
    let server
    let baseUrl

    // start the server before the tests
    before(async function () {
        server = app.listen(0)
        await new Promise((resolve, reject) => {
            server.once("listening", resolve)
            server.once("error", reject)
        })
        baseUrl = `http://127.0.0.1:${server.address().port}`
    })

    // stop the server after the tests
    after(async function () {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close(error => error ? reject(error) : resolve())
            })
        }
    })

    it("returns 200 for a task", async function () {
        const response = await fetch(`${baseUrl}/api/tasks/youtube-mute`)
        expect(response.status).to.equal(200)
    })

    it("sends back the same taskId", async function () {
        const response = await fetch(`${baseUrl}/api/tasks/youtube-mute`)
        const data = await response.json()
        expect(data.taskId).to.equal("youtube-mute")
    })

    it("has 3 steps", async function () {
        const response = await fetch(`${baseUrl}/api/tasks/youtube-mute`)
        const data = await response.json()
        expect(data.steps).to.have.lengthOf(3)
    })

    it("puts the taskId in each step", async function () {
        const response = await fetch(`${baseUrl}/api/tasks/amazon-orders`)
        const data = await response.json()
        for (const step of data.steps) {
            expect(step).to.include("amazon-orders")
        }
    })
})
