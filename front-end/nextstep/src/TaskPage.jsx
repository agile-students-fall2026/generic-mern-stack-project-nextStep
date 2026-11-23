import { useState,useEffect } from 'react';
import api from './api';
import { useParams } from 'react-router-dom';
import useAccessibility from './useAccessibility';
import './css/pages.css';

// Shows one step at a time for the task the user picked. Clicking the box moves on.
const TaskPage = () => {
    useAccessibility();

    // Reads the id out of the URL /task/youtube-fullscreen
    const { taskId } = useParams();
    //state to hold the steps for the task
    // setSteps is a function that updates the steps state. When you call setSteps, React will redraw the page with the new steps. 
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        api.get(`/tasks/${taskId}`).then((response) => setSteps(response.data.steps))
    }, [taskId]);
    // useState remembers which step is showing. A plain variable would reset on every redraw.
    const [current, setCurrent] = useState(0);
    function nextStep() {
        // 3 steps means positions 0, 1, 2, so stop at length - 1
        if (current < steps.length - 1) {
            setCurrent(current + 1);
        }
    }

    // If the steps are not loaded, show a loading message.
    if (steps.length === 0) {
        return <p>Loading guide...</p>;
    }
    
    return (
        <div className="task-container">
            <h1>Task: {taskId}</h1>

            <div className="step-screen" onClick={nextStep}>
                <p>{steps[current]}</p>
            </div>

            <p>{current + 1} of {steps.length}</p>
        </div>
    );
};

export default TaskPage;
