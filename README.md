# Project Repository

## nextStep

nextStep is an app that helps older people navigate their phones whenever they get stuck. Apps change constantly and menus, buttons and gestures move around with every update. nextstep notices when a user is struggling and visually points them to the exact thing they need to tap. 

For example, if someone can't figure out how to make a Youtube video full screen, nextStep highlights the full-screen button so they can finish the task themselves. 

nextStep works somewhat like a browser extension. It will use AI to detect when a use has been stuck on a screen for too long, then offers help right on that screen. Over time it learns from each users's history, so its guidance gets more personal and more accurate for the apps that person actually uses. 

## The Product Vision Statement 
This app is for older adults who struggle to keep up with constantly changing apps and phone interface. nextStep is an AI-powered on-screen assistant that detects when they're stuck and highlight exactly what to tap next. Unlike video tutorials, help-center articles or asking a family member for help, nextStep gives real time in-context guidance that learns from each users's habits, so they can stay. independent and confident with their devices. 

##Project History 
nextStep was inspired from previous experiences with watching older folk struggle to keep up with the ever-changing landscapes of apps. Features moves, buttons were redesigned, and simple tasks became frustrating. We realize that many older adults dont need a full lesson, just a nudge towards the next step. That idea grew into nextStep. 

## Core team 
* Jasmin Contreras - github -> jsc9859
* Solomon Kim - github -> Solirss
* Nalin - Github -> NalNar


Link to contribution is is [HERE](https://github.com/agile-students-fall2026/generic-mern-stack-project-nextStep/blob/master/CONTRIBUTING.md)

## Signup and login backend

The React signup and login forms call the Express authentication API. To run
the connected app locally, start each process in a separate terminal:

1. In `back-end/`, run `npm install` once, then `PORT=3001 npm run dev` (API on
   port 3001; override the existing `PORT` setting if needed).
2. In `front-end/nextstep/`, run `npm install` once, then `npm run dev` (React on
   port 5173). Vite proxies `/api` calls to the backend. If the API uses a
   different port, set `VITE_API_PROXY_TARGET` to its base URL before starting
   Vite (for example `http://localhost:3002`).

The backend uses fake in-memory users, which reset when the backend restarts.
See [back-end/readme.txt](./back-end/readme.txt) for endpoint details and
references to the [Express routing guide](https://expressjs.com/en/guide/routing.html)
and [JWT introduction](https://jwt.io/introduction).

## Running the tests

The back-end has unit tests written with mocha and chai. c8 measures code coverage.
You do not need to start the server first, because the tests start their own copy.

1. Go to the back-end folder: `cd back-end`
2. Install packages (first time only): `npm install`
3. Run all tests: `npm test`
4. See code coverage: `npm run coverage`

Test files are in `back-end/test/`.

