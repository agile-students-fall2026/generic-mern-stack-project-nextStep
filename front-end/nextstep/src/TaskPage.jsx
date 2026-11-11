import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAccessibility from './useAccessibility';
import './css/pages.css';

// Shows one step at a time for the task the user picked. Clicking the box moves on.
useAccessibility();
const TaskPage = () => {
    // Reads the id out of the URL /task/youtube-fullscreen
    const { taskId } = useParams();
    // Placeholder steps. Real screenshots come later.
    const steps = ['Step 1', 'Step 2', 'Step 3'];
    // useState remembers which step is showing. A plain variable would reset on every redraw.
    const [current, setCurrent] = useState(0);
    function nextStep() {
        // 3 steps means positions 0, 1, 2, so stop at length - 1
        if (current < steps.length - 1) {
            setCurrent(current + 1);
        }
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
