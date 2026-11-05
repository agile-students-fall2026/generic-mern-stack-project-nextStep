import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import './css/pages.css'

// Task objects
// This is a list of tasks that the user can try. Each task has an id, title, and url.
const TASKS = [
    {
        id: 'youtube-fullscreen',
        title: 'How to make a YouTube video fullscreen',
        url: 'https://www.youtube.com'
    },
    {
        id: 'youtube-captions',
        title: 'How to turn on YouTube captions',
        url: 'https://www.youtube.com'
    },
    {
        id: 'youtube-volumn-up',
        title: 'How to volumn up YouTube video',
        url: 'https://www.youtube.com'
    },
    {
        id: 'youtube-mute',
        title: 'How to mute a YouTube video',
        url: 'https://www.youtube.com'
    },
    {
        id: 'youtube-history',
        title: 'How to see a YouTube video history',
        url: 'https://www.youtube.com'
    },
    {
        id: 'youtube-subscriptions',
        title: 'How to see a YouTube subscriptions',
        url: 'https://www.youtube.com'
    },
    {
        id: 'amazon-orders',
        title: 'How to see a Amazon orders',
        url: 'https://www.amazon.com/'
    },
    {
        id: 'amazon-search',
        title: 'How to how to search on Amazon',
        url: 'https://www.amazon.com/'
    },
    {
        id: 'amazon-account',
        title: 'How to see a Amazon account',
        url: 'https://www.amazon.com/'
    },
    {
        id: 'facebook-marketplace',
        title: 'How to goto Facebook marketplace',
        url: 'https://www.facebook.com/'
    },
]


const Home = () => {

    // Moves user to the task webpage.
    function moveUser(task) {
        window.postMessage({ from: 'nextStep', taskID: task.id })
    }

    return (
        <>
            <div className="home-container">
                <main className="content home-content">
                    <header className="page-header">
                        <h1 className="page-title">Welcome to NextStep</h1>
                    </header>
                    <section className="home-welcome">
                        <h2 className="home-heading">What would you like to learn today?</h2>
                        <p className="page-description">Choose a task below to get started</p>
                    </section>

                    <section className="home-tasks">
                        <ul className="task-list">
                            {/* Render the tasks as a list of links */}
                            {TASKS.map((task) => (
                                <li key={task.id}>
                                    <button onClick={() => moveUser(task)}>
                                        {task.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </main>
                <button
                    className="menu-button"
                    onClick={() => navigate('/menu')}>
                    Menu
                </button>
            </div>
        </>
    )
}

export default Home
