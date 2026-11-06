import {useParams} from 'react-router-dom';

// This page is the page that is shown when the user clicks on a task from the home page. 
// It will show the task title and a button to start the task. 

const TaskPage = () => {
    const {taskId} = useParams();

    return(
        <div className="task-container">
        <h1>Task: {taskId}</h1>
    </div>
    )
}

export default TaskPage
